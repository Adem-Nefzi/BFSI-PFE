// src/lib/services/ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db/prisma";

// Read API key from environment once at module load.
const API_KEY = process.env.AI_API_KEY;

if (!API_KEY) {
  console.error("❌ AI_API_KEY is missing from environment variables");
  console.error("Please add AI_API_KEY to your .env file");
  throw new Error("AI_API_KEY is not configured");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Runtime options used by analysis.
type AnalyzeOptions = {
  userId?: string;
  fileName?: string;
  maxRetries?: number;
};

// Canonical shape returned by this service after normalization and validation.
type NormalizedAnalysis = {
  title: string;
  type:
    | "INSURANCE_AUTO"
    | "INSURANCE_HOME"
    | "INSURANCE_HEALTH"
    | "INSURANCE_LIFE"
    | "LOAN"
    | "CREDIT_CARD"
    | "INVESTMENT"
    | "OTHER";
  provider: string | null;
  policyNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  premium: number | null;
  summary: string;
  keyPoints: {
    guarantees: string[];
    exclusions: string[];
    franchise: string | null;
    importantDates: string[];
  };
  extractedText: string;
};

type ContractPrecheckResult = {
  isValidContract: boolean;
  confidence: number;
  reason: string | null;
};

export class AIService {
  /**
   * Domain-specific guidance for contract Q&A.
   * This keeps responses focused on what matters most for each contract family.
   */
  private static getContractTypeGuidance(type?: string | null): string {
    switch (type) {
      case "INSURANCE_AUTO":
        return "Focus on coverage scope, exclusions, deductible/franchise impact, claims workflow, and driver/vehicle obligations.";
      case "INSURANCE_HOME":
        return "Focus on covered perils, property limits, occupancy obligations, exclusions, and claims evidence requirements.";
      case "INSURANCE_HEALTH":
        return "Focus on reimbursement rules, waiting periods, provider network constraints, exclusions, and pre-authorization requirements.";
      case "INSURANCE_LIFE":
        return "Focus on beneficiary clauses, premium continuity, surrender/termination conditions, exclusions, and payout trigger conditions.";
      case "LOAN":
        return "Focus on repayment schedule, interest mechanics, default triggers, penalties, early repayment clauses, and covenant obligations.";
      case "CREDIT_CARD":
        return "Focus on APR/fees, billing cycle deadlines, late-payment penalties, credit limit terms, and dispute/chargeback conditions.";
      case "INVESTMENT":
        return "Focus on risk profile, fee structure, lock-in/liquidity constraints, reporting duties, and suitability/compliance implications.";
      default:
        return "Focus on obligations, financial exposure, compliance risks, termination conditions, and operational next steps.";
    }
  }

  /**
   * Analyze contract with Gemini 2.5 Flash.
   *
   * Pipeline overview:
   * 1) Download uploaded file
   * 2) Resolve MIME type safely
   * 3) Build adaptive prompt context from previous completed analyses
   * 4) Ask Gemini for strict JSON output
   * 5) Parse + normalize output
   * 6) Validate contract legitimacy and required fields
   * 7) Retry with correction hints if output is invalid
   * 8) Return canonical analysis object
   *
   * Supports both PDF and image files
   */
  static async analyzeContract(fileUrl: string, options?: AnalyzeOptions) {
    try {
      const maxRetries = Math.min(3, Math.max(1, options?.maxRetries ?? 2));

      // Step 1: Download raw file bytes from storage URL.
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      // Step 2: Resolve MIME type from response header and URL fallback.
      const mimeType = this.resolveMimeType(
        fileUrl,
        response.headers.get("content-type"),
      );

      // Quick pre-validation to short-circuit obvious non-contract files.
      const precheck = await this.preValidateContract({
        base64,
        mimeType,
        fileName: options?.fileName,
      });

      if (!precheck.isValidContract || precheck.confidence < 45) {
        throw new Error(
          `INVALID_CONTRACT:${precheck.reason || "Uploaded file is not recognized as a valid contract."}`,
        );
      }

      // Step 3: Configure model for deterministic, JSON-centric extraction.
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.1, // Low for consistency
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      // Step 4: Build adaptive extraction context from previously analyzed contracts.
      const adaptiveContext = await this.buildAdaptiveContext(options?.userId);
      const basePrompt = this.buildPrompt({
        adaptiveContext,
        fileName: options?.fileName,
      });

      let previousRawResponse = "";
      let lastValidationError = "";

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const startTime = Date.now();

        const correctionHint =
          attempt === 1
            ? ""
            : `\n\nCORRECTION MODE:\nYour previous response was invalid.\nReason: ${lastValidationError || "Invalid structure"}.\nReturn JSON only and keep every required field.\nPrevious invalid response:\n${previousRawResponse.slice(0, 2000)}`;

        // Step 5: Ask model to extract strict JSON from the uploaded file.
        const result = await model.generateContent([
          `${basePrompt}${correctionHint}`,
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
        ]);

        const text = result.response.text();
        if (!text) {
          lastValidationError = "No content in AI response";
          continue;
        }

        previousRawResponse = text;

        try {
          // Step 6: Parse and normalize output into canonical structure.
          const parsed = this.parseJsonResponse(text);
          const normalized = this.normalizeAnalysis(parsed);

          // Step 7: Reject non-contract uploads with explicit error.
          this.assertValidContract(parsed, normalized);

          console.log(
            "📄 Extracted text length:",
            normalized.extractedText.length,
            "chars",
          );
          console.log(
            "✅ Analysis completed in",
            ((Date.now() - startTime) / 1000).toFixed(2),
            "seconds",
          );

          return normalized;
        } catch (validationError: any) {
          // If validation fails, keep reason and retry with correction guidance.
          lastValidationError =
            validationError?.message || "Failed to parse model output";
          if (attempt === maxRetries) {
            throw new Error(lastValidationError);
          }
        }
      }

      throw new Error("AI analysis failed after retries.");
    } catch (error: any) {
      // Better error messages
      if (error.message?.includes("API key")) {
        throw new Error(
          "Invalid or missing Gemini API key. Check AI_API_KEY in your .env file",
        );
      } else if (error.message?.includes("INVALID_CONTRACT:")) {
        const reason = String(error.message)
          .replace("INVALID_CONTRACT:", "")
          .trim();
        throw new Error(
          reason || "Uploaded file is not recognized as a valid contract.",
        );
      } else if (
        error.message?.includes("not found") ||
        error.message?.includes("404")
      ) {
        throw new Error(
          "Invalid Gemini model. Ensure 'gemini-2.5-flash' is available in your Google Cloud project.",
        );
      } else if (
        error.message?.includes("fetch") &&
        !error.message?.includes("generativelanguage")
      ) {
        throw new Error(
          "Download failed. Check if the file URL is correct and accessible.",
        );
      } else if (error.message?.includes("JSON")) {
        console.error("❌ Raw response that failed to parse:", error);
        console.error("Full error message:", error.message);

        // Help user understand what went wrong
        if (error.message?.includes("escaped quotes")) {
          throw new Error(
            "The contract contains special characters that corrupted the analysis. Try uploading a cleaner version.",
          );
        } else if (error.message?.includes("incomplete")) {
          throw new Error(
            "AI analysis failed to complete properly. This might be a large or complex contract. Try a smaller contract first.",
          );
        } else if (error.message?.includes("missing expected")) {
          throw new Error(
            "This doesn't appear to be a valid financial/insurance contract. Please upload a legitimate contract document.",
          );
        } else {
          throw new Error(
            "Error parsing AI response. The response may not be valid JSON. Check console for details.",
          );
        }
      } else if (error.message?.includes("quota")) {
        throw new Error(
          "Limit exceeded. Your Gemini API quota may be exhausted. Check your Google Cloud Console for usage details.",
        );
      } else {
        throw new Error(`Error analyzing contract: ${error.message}`);
      }
    }
  }

  /**
   * Build extraction prompt with strict schema + anti-hallucination instructions.
   */
  private static buildPrompt(input?: {
    adaptiveContext?: string;
    fileName?: string;
  }): string {
    return `You are an expert in BFSI contract analysis (Banking, Financial Services, Insurance).

Document name: ${input?.fileName ?? "Unknown"}

${input?.adaptiveContext ?? ""}

Analyze this contract document and extract ALL important information in the EXACT JSON format below:

{
  "title": "Descriptive contract title (e.g., Allianz Car Insurance)",
  "type": "INSURANCE_AUTO",
  "provider": "Name of the company or financial institution",
  "policyNumber": "Policy number or contract number",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "premium": 1200.50,
  "summary": "Clear and concise summary of the contract in a maximum of 3–4 sentences, covering the main guarantees and conditions",
  "keyPoints": {
    "guarantees": ["List of main guarantees or coverages provided"],
    "exclusions": ["List of important exclusions to be aware of"],
    "franchise": "Deductible amount or description (e.g., €500)",
    "importantDates": ["Key dates and important deadlines"]
  },
  "contractValidation": {
    "isValidContract": true,
    "confidence": 88,
    "reason": "Short reason if invalid, otherwise null"
  },
  "extractedText": "Full text extracted from the document with all details"
}

CRITICAL INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPE — Must be EXACTLY one of the following values:

INSURANCE_AUTO (car insurance)

INSURANCE_HOME (home insurance)

INSURANCE_HEALTH (health insurance/mutual)

INSURANCE_LIFE (life insurance)

LOAN (bank loan)

CREDIT_CARD (credit card)

INVESTMENT (investment account)

OTHER (other type)

DATES — Strict format YYYY-MM-DD (e.g., 2024-01-15)

PREMIUM — Decimal number only (e.g., 1200.50, no text)

NULL — If information does not exist, use null (not an empty string "")

CONTRACT VALIDATION — Determine whether this document is truly a contract/policy/loan agreement.
- contractValidation.isValidContract must be false for invoices, receipts, ID cards, blank scans, random photos, marketing flyers, or unrelated files.
- confidence must be an integer from 0 to 100.
- reason must explain why invalid when isValidContract is false.

EXTRACTED TEXT — Must contain ALL visible text from the document

SUMMARY — Maximum 4 sentences, clear and informative

RESPONSE — Respond ONLY with valid JSON, no text before or after, no markdown

QUALITY GUARDRAILS:
- Never invent provider names, policy numbers, dates, or premium values.
- If uncertain, use null for that field.
- Keep extractedText raw and faithful to the visible document content.
- For summary and key points, prioritize practical legal and business implications.

NOW ANALYZE THE DOCUMENT:`;
  }

  /**
   * Resolve MIME type from HTTP headers first, then URL extension fallback.
   */
  private static resolveMimeType(
    fileUrl: string,
    headerContentType: string | null,
  ): string {
    const normalizedHeader = headerContentType?.toLowerCase() || "";
    if (normalizedHeader.startsWith("application/pdf")) {
      return "application/pdf";
    }
    if (normalizedHeader.startsWith("image/png")) {
      return "image/png";
    }
    if (normalizedHeader.startsWith("image/jpeg")) {
      return "image/jpeg";
    }
    if (normalizedHeader.startsWith("image/webp")) {
      return "image/webp";
    }

    const lowerUrl = fileUrl.toLowerCase();
    if (lowerUrl.includes(".pdf")) return "application/pdf";
    if (lowerUrl.includes(".png")) return "image/png";
    if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg"))
      return "image/jpeg";
    if (lowerUrl.includes(".webp")) return "image/webp";
    return "application/pdf"; // Default
  }

  private static parseJsonResponse(text: string): unknown {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("AI response is empty or invalid.");
    }

    // Remove potential markdown wrappers, comments, and extra whitespace
    let cleanJson = text
      .replace(/```json[\s\n]*/, "") // Remove opening markdown
      .replace(/```[\s\n]*$/, "") // Remove closing markdown
      .replace(/\/\/.*$/gm, "") // Remove JavaScript comments
      .trim();

    // Check for common issues that indicate incomplete/corrupted response
    const responsePreview = cleanJson.substring(0, 200);
    console.log("🔍 AI Response preview:", responsePreview);

    // Try direct parse first
    try {
      const result = JSON.parse(cleanJson);
      console.log("✅ JSON parsed successfully on first attempt");
      return result;
    } catch (firstError) {
      console.warn(
        "⚠️ First JSON parse failed:",
        (firstError as Error).message,
      );
    }

    // Fallback 1: Try removing non-JSON text (explanations before/after JSON)
    try {
      const firstCurly = cleanJson.indexOf("{");
      const lastCurly = cleanJson.lastIndexOf("}");

      if (firstCurly === -1 || lastCurly === -1 || firstCurly >= lastCurly) {
        throw new Error(
          "No JSON object wrapper found (missing { or }). Response may be incomplete.",
        );
      }

      // Ensure we get complete closing braces for nested objects
      let braceCount = 0;
      let endIndex = firstCurly;

      for (let i = firstCurly; i < cleanJson.length; i++) {
        if (cleanJson[i] === "{") braceCount++;
        if (cleanJson[i] === "}") braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }

      const jsonSlice = cleanJson.slice(firstCurly, endIndex + 1);
      console.log("📝 Extracted JSON slice length:", jsonSlice.length);

      const result = JSON.parse(jsonSlice);
      console.log("✅ JSON parsed successfully after text removal");
      return result;
    } catch (fallbackError) {
      console.error(
        "❌ JSON fallback parsing failed:",
        (fallbackError as Error).message,
      );
      console.error("Full raw response:", cleanJson.substring(0, 500));

      // Last resort: Check for common formatting issues
      if (cleanJson.includes('\\n"') || cleanJson.includes('\\"')) {
        throw new Error(
          "Response contains escaped quotes or newlines that couldn't be parsed. The contract may have corrupted text.",
        );
      }

      if (!cleanJson.includes('"type"') && !cleanJson.includes('"title"')) {
        throw new Error(
          "Response is missing expected contract fields. It may not be a valid contract document.",
        );
      }

      throw new Error(
        `Failed to parse AI response as JSON: ${(fallbackError as Error).message}`,
      );
    }
  }

  /**
   * Lightweight contract validity pre-check.
   *
   * Goal: reject clearly invalid files quickly (invoice/photo/blank/non-legal doc)
   * before running heavier full extraction.
   */
  private static async preValidateContract(input: {
    base64: string;
    mimeType: string;
    fileName?: string;
  }): Promise<ContractPrecheckResult> {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0,
        topP: 0.9,
        topK: 20,
        maxOutputTokens: 350,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      `You are validating whether an uploaded document is a legal/financial contract.

File name: ${input.fileName ?? "Unknown"}

Return ONLY JSON:
{
  "isValidContract": true,
  "confidence": 0,
  "reason": null
}

Rules:
- isValidContract=false for invoices, receipts, identity cards, random photos/screenshots, blank pages, flyers, or unrelated files.
- confidence is an integer from 0 to 100.
- reason must be concise and user-friendly when invalid.
- If valid, reason can be null.
`,
      {
        inlineData: {
          data: input.base64,
          mimeType: input.mimeType,
        },
      },
    ]);

    const raw = this.parseJsonResponse(result.response.text() || "{}");
    const maybe = raw as Partial<ContractPrecheckResult>;

    const isValidContract = Boolean(maybe.isValidContract);
    const confidence = Number.isFinite(Number(maybe.confidence))
      ? Math.max(0, Math.min(100, Math.round(Number(maybe.confidence))))
      : 0;
    const reason =
      typeof maybe.reason === "string" && maybe.reason.trim().length > 0
        ? maybe.reason.trim()
        : null;

    return {
      isValidContract,
      confidence,
      reason,
    };
  }

  private static normalizeAnalysis(input: any): NormalizedAnalysis {
    // Ensure contract type belongs to supported enum.
    const validTypes = new Set([
      "INSURANCE_AUTO",
      "INSURANCE_HOME",
      "INSURANCE_HEALTH",
      "INSURANCE_LIFE",
      "LOAN",
      "CREDIT_CARD",
      "INVESTMENT",
      "OTHER",
    ]);

    const type =
      typeof input?.type === "string" && validTypes.has(input.type)
        ? input.type
        : null;

    if (!type) {
      throw new Error("Contract type is missing or invalid.");
    }

    const title = String(input?.title || "").trim();
    const summary = String(input?.summary || "").trim();
    const extractedText = String(input?.extractedText || "").trim();

    if (title.length < 3) {
      throw new Error("Title is missing or too short.");
    }
    if (summary.length < 10) {
      throw new Error("Summary is missing or too short.");
    }
    if (extractedText.length < 50) {
      throw new Error("Extracted text is missing or too short.");
    }

    // Helper: normalize unknown primitive into string|null.
    const toStringOrNull = (value: unknown): string | null => {
      const normalized = String(value ?? "").trim();
      return normalized.length > 0 ? normalized : null;
    };

    // Helper: accept only strict ISO date values.
    const toDateOrNull = (value: unknown): string | null => {
      const candidate = String(value ?? "").trim();
      if (!candidate) return null;

      const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(candidate);
      return isIsoDate ? candidate : null;
    };

    // Helper: sanitize array values into non-empty text list.
    const toStringList = (value: unknown): string[] => {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => String(item ?? "").trim())
        .filter((item) => item.length > 0);
    };

    // Premium must be numeric and non-negative.
    const premiumValue =
      input?.premium === null || input?.premium === undefined
        ? null
        : Number(input.premium);

    const premium =
      premiumValue !== null &&
      Number.isFinite(premiumValue) &&
      premiumValue >= 0
        ? Number(premiumValue.toFixed(2))
        : null;

    return {
      title,
      type,
      provider: toStringOrNull(input?.provider),
      policyNumber: toStringOrNull(input?.policyNumber),
      startDate: toDateOrNull(input?.startDate),
      endDate: toDateOrNull(input?.endDate),
      premium,
      summary,
      keyPoints: {
        guarantees: toStringList(input?.keyPoints?.guarantees),
        exclusions: toStringList(input?.keyPoints?.exclusions),
        franchise: toStringOrNull(input?.keyPoints?.franchise),
        importantDates: toStringList(input?.keyPoints?.importantDates),
      },
      extractedText,
    };
  }

  private static async buildAdaptiveContext(userId?: string): Promise<string> {
    // No user context means no adaptation baseline.
    if (!userId) {
      return "";
    }

    const examples = await prisma.contract.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 12,
      select: {
        type: true,
        provider: true,
        policyNumber: true,
        summary: true,
      },
    });

    if (examples.length < 2) {
      return "";
    }

    // Small utility to get most frequent values from prior analyses.
    const count = (items: string[]) => {
      const bucket = new Map<string, number>();
      for (const item of items) {
        bucket.set(item, (bucket.get(item) ?? 0) + 1);
      }
      return [...bucket.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([value]) => value);
    };

    const topTypes = count(
      examples
        .map((item) => item.type)
        .filter((value): value is NonNullable<typeof value> => value !== null)
        .map((value) => String(value)),
    );
    const topProviders = count(
      examples
        .map((item) => item.provider)
        .filter((value): value is string => Boolean(value)),
    );

    const policyPatterns = examples
      .map((item) => item.policyNumber)
      .filter((value): value is string => Boolean(value))
      .slice(0, 4)
      .map((value) => value.replace(/[A-Za-z0-9]/g, "X"));

    const avgSummaryLength =
      examples
        .map((item) => item.summary?.length ?? 0)
        .reduce((sum, length) => sum + length, 0) / examples.length;

    return `ADAPTIVE EXTRACTION CONTEXT FROM PREVIOUS DOCUMENTS:
- Frequent contract types in this workspace: ${topTypes.join(", ") || "N/A"}
- Frequent provider naming patterns: ${topProviders.join(", ") || "N/A"}
- Example policy number shape patterns: ${policyPatterns.join(", ") || "N/A"}
- Typical summary length target: around ${Math.round(avgSummaryLength)} characters.

Use this context only as formatting guidance. Do not force it if current document content differs.`;
  }

  /**
   * Validate contract legitimacy.
   *
   * Rejection rules:
   * - Model explicitly says document is not a contract
   * - Model confidence for validity is critically low
   * - Heuristic text signals suggest non-contract content
   */
  private static assertValidContract(
    raw: any,
    normalized: NormalizedAnalysis,
  ): void {
    const modelIsValid = raw?.contractValidation?.isValidContract;
    const confidenceRaw = Number(raw?.contractValidation?.confidence);
    const modelReason = String(raw?.contractValidation?.reason ?? "").trim();

    const legalSignalRegex =
      /contract|agreement|policy|terms|clause|premium|coverage|insured|insurer|loan|borrower|credit|beneficiary|liability/i;
    const hasLegalSignals = legalSignalRegex.test(normalized.extractedText);
    const hasStructuredSignal =
      Boolean(normalized.provider) ||
      Boolean(normalized.policyNumber) ||
      normalized.keyPoints.guarantees.length > 0 ||
      normalized.keyPoints.exclusions.length > 0 ||
      normalized.premium !== null;

    if (modelIsValid === false) {
      throw new Error(
        `INVALID_CONTRACT:${modelReason || "Uploaded file is not recognized as a contract."}`,
      );
    }

    if (Number.isFinite(confidenceRaw) && confidenceRaw < 45) {
      throw new Error(
        `INVALID_CONTRACT:${modelReason || "Contract confidence is too low. Please upload a clearer contract document."}`,
      );
    }

    if (!hasLegalSignals && !hasStructuredSignal) {
      throw new Error(
        "INVALID_CONTRACT:Uploaded file does not contain enough contract-specific signals.",
      );
    }
  }

  /**
   * Validate that AI results have all required fields
   */
  static validateAnalysis(data: any): boolean {
    try {
      // Validation uses same normalizer used in production flow.
      this.normalizeAnalysis(data);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string | null | undefined): Date | undefined {
    if (!dateString) return undefined;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return undefined;
      }
      return date;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number | null | undefined): string {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  static async askAboutContract(input: {
    question: string;
    contract: {
      fileName: string;
      title?: string | null;
      type?: string | null;
      provider?: string | null;
      policyNumber?: string | null;
      startDate?: Date | string | null;
      endDate?: Date | string | null;
      premium?: number | null;
      summary?: string | null;
      keyPoints?: Record<string, unknown> | null;
      extractedText?: string | null;
    };
  }) {
    try {
      // Configure fast Q&A model tuned for concise answers.
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      // Keep context bounded to avoid overlong prompts and token waste.
      const extractedTextSnippet = (input.contract.extractedText || "")
        .slice(0, 12000)
        .trim();
      const contractTypeGuidance = this.getContractTypeGuidance(
        input.contract.type,
      );

      const prompt = `You are a senior BFSI contract advisor.

Contract metadata:
- File: ${input.contract.fileName}
- Title: ${input.contract.title ?? "N/A"}
- Type: ${input.contract.type ?? "N/A"}
- Provider: ${input.contract.provider ?? "N/A"}
- Policy Number: ${input.contract.policyNumber ?? "N/A"}
- Start Date: ${input.contract.startDate ?? "N/A"}
- End Date: ${input.contract.endDate ?? "N/A"}
- Premium: ${input.contract.premium ?? "N/A"}

Summary:
${input.contract.summary ?? "N/A"}

Key Points (JSON):
${JSON.stringify(input.contract.keyPoints ?? {}, null, 2)}

Extracted Text:
${extractedTextSnippet || "N/A"}

User question:
${input.question}

Instructions:
- Write in clear, professional, business-oriented plain text.
- Do NOT use markdown or special formatting symbols, including: **, __, #, *, -, backticks.
- Do NOT quote large raw excerpts from extracted text unless strictly necessary.
- Synthesize and explain the implications in practical terms instead of copying file content.
- Base your answer ONLY on the provided contract content.
- Adapt answer emphasis using this type guidance: ${contractTypeGuidance}
- If information is missing, explicitly say: Information not found in the analyzed contract.
- If the question asks about legal consequences or non-compliance, provide general legal context for EU/USA at a high level only.
- For legal context, use wording like: "Under general EU/US legal principles..." and avoid citing specific article numbers unless explicitly present in the contract content.
- Never claim certainty where the contract text is ambiguous.
- Keep the answer concise, executive, and decision-oriented.

Response structure:
1) Direct answer in one sentence.
2) Business impact in one to two sentences (risk, cost, operational effect).
3) General legal context in one to two sentences when relevant.
4) Recommended next step in one sentence.

Compliance note:
Include one short disclaimer only when legal context is discussed: "This is general information, not formal legal advice."`;

      // Execute completion and sanitize styling artifacts from response.
      const result = await model.generateContent(prompt);
      const rawAnswer = result.response.text()?.trim();

      if (!rawAnswer) {
        throw new Error("No response generated");
      }

      const sanitizedAnswer = rawAnswer
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")
        .replace(/^\s*#{1,6}\s*/gm, "")
        .replace(/^\s*[-*]\s+/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      return sanitizedAnswer;
    } catch (error: any) {
      if (error.message?.includes("API key")) {
        throw new Error("Invalid or missing Gemini API key.");
      }
      throw new Error(`Error answering question: ${error.message}`);
    }
  }
}
