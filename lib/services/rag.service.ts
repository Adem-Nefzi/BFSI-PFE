import { createHash } from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db/prisma";

type ChunkRecord = {
  chunkIndex: number;
  content: string;
  contentHash: string;
  embedding: number[];
};

type RetrievedChunk = {
  chunkIndex: number;
  content: string;
  score: number;
};

import { keyManager } from "@/lib/services/ai/key-manager";

const EMBEDDING_MODEL = process.env.AI_EMBEDDING_MODEL || "text-embedding-004";
const EMBEDDING_MODEL_FALLBACKS = [
  EMBEDDING_MODEL,
  "gemini-embedding-001",
  "text-embedding-004",
];

export class RAGService {
  private static readonly MAX_CHUNK_CHARS = 1400;
  private static readonly CHUNK_OVERLAP_CHARS = 220;
  private static readonly MAX_CHUNKS_PER_CONTRACT = 120;

  static async upsertContractChunks(input: {
    contractId: string;
    extractedText?: string | null;
    summary?: string | null;
    keyPoints?: Record<string, unknown> | null;
  }): Promise<number> {
    const sourceText = this.buildSourceText(input);
    if (!sourceText.trim()) {
      await prisma.contractRagChunk.deleteMany({
        where: { contractId: input.contractId },
      });
      return 0;
    }

    const chunks = this.chunkText(sourceText);
    if (chunks.length === 0) {
      await prisma.contractRagChunk.deleteMany({
        where: { contractId: input.contractId },
      });
      return 0;
    }

    const embeddedChunks: ChunkRecord[] = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const embedding = await this.embedText(chunk);
      embeddedChunks.push({
        chunkIndex: index,
        content: chunk,
        contentHash: this.hashChunk(chunk),
        embedding,
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.contractRagChunk.deleteMany({
        where: { contractId: input.contractId },
      });
      for (const chunk of embeddedChunks) {
        await tx.contractRagChunk.create({
          data: {
            contractId: input.contractId,
            chunkIndex: chunk.chunkIndex,
            content: chunk.content,
            contentHash: chunk.contentHash,
            embedding: chunk.embedding,
          },
        });
      }
    });

    return embeddedChunks.length;
  }

  static async retrieveRelevantChunks(input: {
    contractId: string;
    question: string;
    topK?: number;
  }): Promise<RetrievedChunk[]> {
    const question = input.question.trim();
    if (!question) return [];

    const allChunks = await prisma.contractRagChunk.findMany({
      where: { contractId: input.contractId },
      orderBy: { chunkIndex: "asc" },
      select: {
        chunkIndex: true,
        content: true,
        embedding: true,
      },
    });

    if (allChunks.length === 0) return [];

    const queryEmbedding = await this.embedText(question);
    const topK = Math.max(2, Math.min(12, input.topK ?? 6));

    return allChunks
      .map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter((chunk) => Number.isFinite(chunk.score) && chunk.score > 0.12);
  }

  static buildChunkContext(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) {
      return "No RAG chunks available.";
    }

    return chunks
      .map(
        (chunk) =>
          `[Chunk ${chunk.chunkIndex} | relevance=${chunk.score.toFixed(3)}]\n${chunk.content}`,
      )
      .join("\n\n");
  }

  private static buildSourceText(input: {
    extractedText?: string | null;
    summary?: string | null;
    keyPoints?: Record<string, unknown> | null;
  }): string {
    const section: string[] = [];

    const summary = String(input.summary ?? "").trim();
    if (summary) {
      section.push(`SUMMARY\n${summary}`);
    }

    const keyPoints = input.keyPoints ?? {};
    const guarantees = Array.isArray(keyPoints.guarantees)
      ? keyPoints.guarantees.map((item) => String(item).trim()).filter(Boolean)
      : [];
    const exclusions = Array.isArray(keyPoints.exclusions)
      ? keyPoints.exclusions.map((item) => String(item).trim()).filter(Boolean)
      : [];
    const importantDates = Array.isArray(keyPoints.importantDates)
      ? keyPoints.importantDates
          .map((item) => String(item).trim())
          .filter(Boolean)
      : [];
    const franchise = String(keyPoints.franchise ?? "").trim();

    const keyPointsLines: string[] = [];
    if (guarantees.length > 0) {
      keyPointsLines.push(`Guarantees: ${guarantees.join(" | ")}`);
    }
    if (exclusions.length > 0) {
      keyPointsLines.push(`Exclusions: ${exclusions.join(" | ")}`);
    }
    if (franchise) {
      keyPointsLines.push(`Franchise: ${franchise}`);
    }
    if (importantDates.length > 0) {
      keyPointsLines.push(`ImportantDates: ${importantDates.join(" | ")}`);
    }
    if (keyPointsLines.length > 0) {
      section.push(`KEY_POINTS\n${keyPointsLines.join("\n")}`);
    }

    const extractedText = String(input.extractedText ?? "").trim();
    if (extractedText) {
      section.push(`EXTRACTED_TEXT\n${extractedText}`);
    }

    return section.join("\n\n").slice(0, 45000);
  }

  private static chunkText(text: string): string[] {
    const normalized = text.replace(/\r\n/g, "\n").trim();
    if (!normalized) return [];

    const chunks: string[] = [];
    let cursor = 0;
    const maxLen = this.MAX_CHUNK_CHARS;
    const overlap = this.CHUNK_OVERLAP_CHARS;

    while (
      cursor < normalized.length &&
      chunks.length < this.MAX_CHUNKS_PER_CONTRACT
    ) {
      let end = Math.min(cursor + maxLen, normalized.length);

      if (end < normalized.length) {
        const window = normalized.slice(cursor, end);
        const breakAt = Math.max(
          window.lastIndexOf("\n\n"),
          window.lastIndexOf(". "),
          window.lastIndexOf("\n"),
        );

        if (breakAt > Math.floor(maxLen * 0.45)) {
          end = cursor + breakAt + 1;
        }
      }

      const chunk = normalized.slice(cursor, end).trim();
      if (chunk.length > 40) {
        chunks.push(chunk);
      }

      if (end >= normalized.length) break;
      cursor = Math.max(end - overlap, cursor + 1);
    }

    return chunks;
  }

  private static hashChunk(content: string): string {
    return createHash("sha256").update(content, "utf8").digest("hex");
  }

  private static async embedText(text: string): Promise<number[]> {
    let lastError: unknown = null;

    for (const modelName of Array.from(new Set(EMBEDDING_MODEL_FALLBACKS))) {
      try {
        return await keyManager.execute(async (genAI) => {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.embedContent(text);
          const values = result.embedding?.values;

          if (values && Array.isArray(values) && values.length > 0) {
            return values;
          }
          throw new Error("Empty embedding");
        });
      } catch (error: any) {
        if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
        lastError = error;
      }
    }

    const errorMessage =
      lastError instanceof Error
        ? lastError.message
        : "Failed to generate embedding vector.";
    throw new Error(`Embedding generation failed: ${errorMessage}`);
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return -1;

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i += 1) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    if (magA === 0 || magB === 0) return -1;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
}
