// src/lib/services/ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db/prisma";
import {
  AnalyzeOptions,
  ContractPrecheckResult,
  NormalizedAnalysis,
} from "@/lib/services/ai/analysis.types";
import type { Prisma } from "@prisma/client";
import {
  buildAnalysisPrompt,
  buildPrevalidationPrompt,
} from "@/lib/services/ai/analysis.prompt";
import { parseJsonResponse as parseAiJsonResponse } from "@/lib/services/ai/analysis.parser";
import { normalizeAnalysis as normalizeAiAnalysis } from "@/lib/services/ai/analysis.normalizer";
import { RAGService } from "@/lib/services/rag.service";

import { keyManager } from "@/lib/services/ai/key-manager";

const PRIMARY_ANALYSIS_MODEL =
  process.env.AI_MODEL_PRIMARY || "gemini-3.1-flash-lite-preview";
const GEMINI_SECONDARY_ANALYSIS_MODEL =
  process.env.AI_MODEL_SECONDARY_GEMINI || "";
const FALLBACK_ANALYSIS_MODEL =
  process.env.AI_MODEL_FALLBACK || "llama-3.3-70b-versatile";
const FALLBACK_REPAIR_MODEL =
  process.env.AI_MODEL_FALLBACK_REPAIR || "llama-3.3-70b-versatile";
const GROQ_API_KEY =
  process.env.GROQ_API_KEY?.trim() || process.env.AI_GROQ_API_KEY?.trim() || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GEMINI_ANALYSIS_MODELS = Array.from(
  new Set(
    [PRIMARY_ANALYSIS_MODEL, GEMINI_SECONDARY_ANALYSIS_MODEL].filter(Boolean),
  ),
);

const ANALYSIS_MODELS = Array.from(
  new Set([...GEMINI_ANALYSIS_MODELS, `groq:${FALLBACK_ANALYSIS_MODEL}`]),
);

const FORCE_FALLBACK_TEST =
  process.env.AI_FORCE_FALLBACK_TEST === "1" ||
  String(process.env.AI_FORCE_FALLBACK_TEST).toLowerCase() === "true";

type ValidationEnvelope = {
  contractValidation?: {
    isValidContract?: boolean;
    confidence?: number;
    reason?: string | null;
  };
};

type PrevalidationResponse = {
  isValidContract?: boolean;
  confidence?: number;
  reason?: string | null;
};

type AdaptiveExplainability = {
  field?: string;
  sourceHints?: {
    confidence?: number;
  };
};

type AdaptiveAiMeta = {
  language?: string | null;
  keyPeople?: Array<{ role?: string | null }>;
};

type AdaptiveKeyPoints = {
  explainability?: AdaptiveExplainability[];
  aiMeta?: AdaptiveAiMeta;
};

type AdaptiveContractExample = {
  type?: string | null;
  provider?: string | null;
  policyNumber?: string | null;
  summary?: string | null;
  keyPoints?: Prisma.JsonValue | null;
};

const isAdaptiveKeyPoints = (
  value: Prisma.JsonValue | null | undefined,
): value is AdaptiveKeyPoints => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export class AIService {
  private static isTransientGeminiError(message: string): boolean {
    const normalized = message.toLowerCase();
    return (
      normalized.includes("503") ||
      normalized.includes("service unavailable") ||
      normalized.includes("high demand") ||
      normalized.includes("temporarily unavailable") ||
      normalized.includes("backend error") ||
      normalized.includes("internal server error") ||
      normalized.includes("bad gateway") ||
      normalized.includes("gateway timeout") ||
      normalized.includes("deadline exceeded")
    );
  }

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
    keyManager.resetKeys();
    try {
      const maxRetries = Math.min(3, Math.max(1, options?.maxRetries ?? 2));
      const forceFallbackModelTest =
        options?.forceFallbackModelTest ?? FORCE_FALLBACK_TEST;

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

      // Step 4: Build adaptive extraction context from previously analyzed contracts.
      const adaptiveContext = await this.buildAdaptiveContext(options?.userId);
      const basePrompt = buildAnalysisPrompt({
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
        const text = await this.generateAnalysisWithFallback({
          prompt: `${basePrompt}${correctionHint}`,
          base64,
          mimeType,
          forceFallbackModelTest,
        });

        if (!text) {
          lastValidationError = "No content in AI response";
          continue;
        }

        previousRawResponse = text;

        try {
          // Step 6: Parse and normalize output into canonical structure.
          let parsed: unknown;

          try {
            parsed = this.parseJsonResponse(text);
          } catch (parseError) {
            console.warn(
              "Initial JSON parse failed. Attempting repair with fallback model...",
            );
            const repaired = await this.repairMalformedJson(
              text,
              parseError instanceof Error
                ? parseError.message
                : "Invalid JSON response",
            );

            if (!repaired) {
              // Emergency fallback: try to extract key fields from raw text
              console.warn(
                "Repair model failed. Attempting emergency field extraction...",
              );
              const emergency = this.emergencyExtractFields(text);
              if (emergency) {
                console.log("✅ Emergency extraction succeeded");
                parsed = this.parseJsonResponse(emergency);
              } else {
                throw parseError;
              }
            } else {
              parsed = this.parseJsonResponse(repaired);
            }
          }

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
        } catch (validationError: unknown) {
          // If validation fails, keep reason and retry with correction guidance.
          lastValidationError =
            validationError instanceof Error
              ? validationError.message
              : "Failed to parse model output";
          if (attempt === maxRetries) {
            throw new Error(lastValidationError);
          }
        }
      }

      throw new Error("AI analysis failed after retries.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // Better error messages
      if (errorMessage.includes("API key")) {
        throw new Error(
          "Invalid or missing AI API key. Check AI_API_KEY1/2/3 for Gemini and GROQ_API_KEY for Groq fallback.",
        );
      } else if (errorMessage.includes("INVALID_CONTRACT:")) {
        const reason = String(errorMessage)
          .replace("INVALID_CONTRACT:", "")
          .trim();
        throw new Error(
          reason || "Uploaded file is not recognized as a valid contract.",
        );
      } else if (this.isTransientGeminiError(errorMessage)) {
        throw new Error(
          `Gemini is temporarily overloaded for the configured analysis models (${ANALYSIS_MODELS.join(", ")}). The app retried automatically, but both models are still busy. Please try again in a few minutes.`,
        );
      } else if (
        errorMessage.includes("not found") ||
        errorMessage.includes("404")
      ) {
        throw new Error(
          `Invalid Gemini model configuration. Current models: ${ANALYSIS_MODELS.join(", ")}. Check model availability in your Gemini account.`,
        );
      } else if (
        errorMessage.includes("fetch") &&
        !errorMessage.includes("generativelanguage")
      ) {
        throw new Error(
          "Download failed. Check if the file URL is correct and accessible.",
        );
      } else if (
        errorMessage.includes("JSON") ||
        errorMessage.includes("No complete JSON object") ||
        errorMessage.includes("parse failed")
      ) {
        console.error("❌ Raw response that failed to parse:", error);
        console.error("Full error message:", errorMessage);

        // Help user understand what went wrong
        if (errorMessage.includes("escaped quotes")) {
          throw new Error(
            "The contract contains special characters that corrupted the analysis. Try uploading a cleaner version.",
          );
        } else if (errorMessage.includes("incomplete")) {
          throw new Error(
            "AI analysis failed to complete properly. This might be a large or complex contract. Try a smaller contract first.",
          );
        } else if (errorMessage.includes("missing expected")) {
          throw new Error(
            "This doesn't appear to be a valid financial/insurance contract. Please upload a legitimate contract document.",
          );
        } else {
          throw new Error(
            "AI returned a malformed response format. Please retry analysis; if it fails again, the file may require OCR cleanup.",
          );
        }
      } else if (errorMessage.includes("quota")) {
        throw new Error(
          "Limit exceeded. Gemini or Groq quota may be exhausted. Check your provider dashboards for usage and limits.",
        );
      } else {
        throw new Error(`Error analyzing contract: ${errorMessage}`);
      }
    }
  }

  /**
   * Prompt generation has been moved to lib/services/ai/analysis.prompt.ts.
   */
  private static buildPrompt(input?: {
    adaptiveContext?: string;
    fileName?: string;
  }): string {
    return buildAnalysisPrompt(input);
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
    return parseAiJsonResponse(text);
  }

  private static isGroqConfigured(): boolean {
    return GROQ_API_KEY.length > 0;
  }

  private static async generateWithGroq(input: {
    model?: string;
    prompt: string;
    systemPrompt?: string;
    responseAsJson: boolean;
    maxOutputTokens: number;
    temperature?: number;
    topP?: number;
  }): Promise<string> {
    if (!this.isGroqConfigured()) {
      throw new Error(
        "Groq fallback is not configured. Set GROQ_API_KEY (or AI_GROQ_API_KEY).",
      );
    }

    const modelName = input.model || FALLBACK_ANALYSIS_MODEL;

    // Build messages with system/user role separation for better instruction adherence
    const messages: Array<{ role: string; content: string }> = [];
    if (input.systemPrompt) {
      messages.push({ role: "system", content: input.systemPrompt });
    }
    messages.push({ role: "user", content: input.prompt });

    // Use json_object mode (compatible with all models)
    const responseFormat: Record<string, unknown> | undefined = input.responseAsJson
      ? { type: "json_object" as const }
      : undefined;

    const body: Record<string, unknown> = {
      model: modelName,
      temperature: input.temperature ?? 0,
      top_p: input.topP ?? 0.95,
      max_tokens: input.maxOutputTokens,
      response_format: responseFormat,
      messages,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `Groq API error ${response.status}: ${details.slice(0, 300)}`,
      );
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      throw new Error("Empty response from Groq fallback model.");
    }

    return text;
  }

  private static async generateWithGroqModelChain(input: {
    preferredModel?: string;
    prompt: string;
    systemPrompt?: string;
    responseAsJson: boolean;
    maxOutputTokens: number;
    temperature?: number;
    topP?: number;
  }): Promise<string> {
    const candidates = Array.from(
      new Set(
        [
          input.preferredModel,
          FALLBACK_ANALYSIS_MODEL,
          "llama-3.3-70b-versatile",
          "qwen-2.5-32b",
          "llama-3.1-8b-instant",
        ].filter(Boolean),
      ),
    ) as string[];

    let lastError: unknown = null;

    for (const modelName of candidates) {
      try {
        const text = await this.generateWithGroq({
          model: modelName,
          prompt: input.prompt,
          systemPrompt: input.systemPrompt,
          responseAsJson: input.responseAsJson,
          maxOutputTokens: input.maxOutputTokens,
          temperature: input.temperature,
          topP: input.topP,
        });
        if (modelName !== (input.preferredModel || FALLBACK_ANALYSIS_MODEL)) {
          console.warn(
            `Groq switched to fallback model ${modelName} after primary fallback model failed.`,
          );
        }
        return text;
      } catch (error) {
        lastError = error;
        console.warn(
          `Groq model ${modelName} failed. Trying next fallback model.`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("All Groq fallback models failed.");
  }

  /**
   * Build a Groq-optimized system prompt that mirrors the Gemini behavior.
   * This separates role & formatting rules from user content for better
   * instruction adherence on open-source models.
   */
  private static buildGroqSystemPrompt(): string {
    return `You are an expert contract analysis engine for the BFSI (Banking, Financial Services, and Insurance) sector.
You receive the full text content of a contract document below and must extract structured information from it.

CRITICAL OUTPUT RULES:
1. Return ONLY valid, parseable JSON — no markdown, no backticks, no explanations, no commentary.
2. Your JSON must conform EXACTLY to the schema specified in the user prompt.
3. Every required field MUST be present. Use null for missing strings/numbers and [] for missing arrays.
4. All dates MUST be in ISO YYYY-MM-DD format or null.
5. The "premium" field must be a positive number or null — NO currency symbols.
6. The "type" field MUST be one of: INSURANCE_AUTO, INSURANCE_HOME, INSURANCE_HEALTH, INSURANCE_LIFE, LOAN, CREDIT_CARD, INVESTMENT, OTHER.
7. Do NOT hallucinate or invent data that is not present in the document.
8. Preserve original language in extractedText and sourceSnippet fields (accents, special characters).
9. The "summary" must be 4-6 professional sentences covering parties, obligations, coverage, exclusions, and deadlines.
10. The "extractedText" must contain at least 30 characters of actual document content.
11. The "keyPoints.explainability" array must have at least 4 items for critical fields when data is available.
12. contractValidation.confidence must reflect actual extraction certainty (0-100).
13. When uncertain about a value, use null and set a lower confidence — never guess.
14. Parse localized number formats correctly (e.g., 1.234,56 vs 1,234.56).
15. Detect the contract language and set the "language" field accordingly (ISO 639-1).

You are replacing a more capable multimodal model (Gemini) as a fallback. Your output quality MUST match production standards.`;
  }

  private static async generateAnalysisWithFallback(input: {
    prompt: string;
    base64: string;
    mimeType: string;
    forceFallbackModelTest?: boolean;
  }): Promise<string> {
    let lastError: unknown = null;
    const forceFallback = Boolean(input.forceFallbackModelTest);

    const buildGroundedGroqPrompt = async (basePrompt: string) => {
      const groundingText = await this.extractGroqGroundingText({
        base64: input.base64,
        mimeType: input.mimeType,
      });

      if (!groundingText) {
        return `${basePrompt}\n\nGROQ FALLBACK RULES:\n- You do not have direct binary file access in this fallback path.\n- Do not hallucinate values; use null/empty arrays when data is missing.\n- Keep contractValidation conservative when uncertain.\n- Set contractValidation.confidence to at most 60 when no grounding text is available.`;
      }

      return `${basePrompt}\n\n--- BEGIN GROUNDED DOCUMENT TEXT (AUTHORITATIVE SOURCE) ---\n${groundingText}\n--- END GROUNDED DOCUMENT TEXT ---\n\nGROQ FALLBACK RULES:\n- Extract fields ONLY from the grounded document text above. This text is the full contract content.\n- Do not invent, assume, or hallucinate any values not explicitly present in the above text.\n- If a field's data is not found in the text, use null (for strings/numbers) or [] (for arrays).\n- Dates: convert any date format found in the text to YYYY-MM-DD.\n- Numbers: parse localized formats (comma vs period) correctly before setting numeric fields.\n- contractValidation.confidence should reflect how much data you could extract from the text.`;
    };

    if (forceFallback) {
      console.warn(
        `🧪 Fallback test mode enabled. Skipping Gemini and forcing Groq model ${FALLBACK_ANALYSIS_MODEL}.`,
      );
      const groundedPrompt = await buildGroundedGroqPrompt(input.prompt);
      return this.generateWithGroqModelChain({
        preferredModel: FALLBACK_ANALYSIS_MODEL,
        systemPrompt: this.buildGroqSystemPrompt(),
        prompt: `${groundedPrompt}\n\nTEST MODE: You are the forced fallback model. Return ONLY valid JSON and preserve the required schema exactly.`,
        responseAsJson: true,
        maxOutputTokens: 8192,
      });
    }

    for (const modelName of GEMINI_ANALYSIS_MODELS) {
      try {
        return await keyManager.execute(async (genAI) => {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 16384,
              responseMimeType: "application/json",
            },
          });

          const result = await model.generateContent([
            input.prompt,
            {
              inlineData: {
                data: input.base64,
                mimeType: input.mimeType,
              },
            },
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 0) {
            console.log(`✅ Analysis with model ${modelName} succeeded`);
            return text;
          }
          throw new Error("Empty response");
        });
      } catch (error: any) {
        if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
        lastError = error;
        console.warn(
          `Analysis with model ${modelName} failed. Trying next model.`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    // All primary models failed. Try with more lenient generation settings as last resort
    console.warn(
      "All standard models failed. Trying with lenient generation config...",
    );
    try {
      return await keyManager.execute(async (genAI) => {
        const fallbackModel = genAI.getGenerativeModel({
          model: PRIMARY_ANALYSIS_MODEL,
          generationConfig: {
            temperature: 0,
            topP: 0.9,
            topK: 20,
            maxOutputTokens: 16384,
            // Don't enforce JSON format; let model produce raw output
          },
        });

        const result = await fallbackModel.generateContent([
          input.prompt,
          {
            inlineData: {
              data: input.base64,
              mimeType: input.mimeType,
            },
          },
        ]);

        const text = result.response.text();
        if (text && text.trim().length > 0) {
          console.log("✅ Lenient generation succeeded");
          return text;
        }
        throw new Error("Empty response from fallback");
      });
    } catch (error: any) {
      if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
      console.warn("Lenient generation also failed:", error);
    }

    // === Groq fallback path ===
    console.warn(
      "All Gemini models exhausted. Activating Groq fallback pipeline...",
    );
    try {
      const groundedPrompt = await buildGroundedGroqPrompt(input.prompt);
      const groqText = await this.generateWithGroqModelChain({
        preferredModel: FALLBACK_ANALYSIS_MODEL,
        systemPrompt: this.buildGroqSystemPrompt(),
        prompt: `${groundedPrompt}\n\nIMPORTANT: Return ONLY valid JSON and preserve the required schema exactly. Do not add any text outside of the JSON object.`,
        responseAsJson: true,
        maxOutputTokens: 8192,
      });
      console.log(
        `✅ Analysis fallback with Groq model ${FALLBACK_ANALYSIS_MODEL} succeeded`,
      );
      return groqText;
    } catch (groqError) {
      console.warn("Groq analysis fallback failed:", groqError);
    }

    throw lastError instanceof Error
      ? lastError
      : new Error(
          "All analysis models (Gemini + Groq fallback) failed to generate content.",
        );
  }

  private static async repairMalformedJson(
    malformedResponse: string,
    parseError: string,
  ): Promise<string | null> {
    try {
      const expectedSchema = {
        language: "string|null",
        title: "string",
        type: "enum: INSURANCE_AUTO|INSURANCE_HOME|INSURANCE_HEALTH|INSURANCE_LIFE|LOAN|CREDIT_CARD|INVESTMENT|OTHER",
        provider: "string|null",
        policyNumber: "string|null",
        startDate: "YYYY-MM-DD|null",
        endDate: "YYYY-MM-DD|null",
        premium: "number|null",
        premiumCurrency: "string|null (ISO code like EUR/USD/TND or symbol)",
        summary: "string (min 10 chars)",
        extractedText: "string (min 30 chars)",
        keyPoints: {
          guarantees: "string[]",
          exclusions: "string[]",
          franchise: "string|null",
          importantDates: "string[]",
          explainability:
            "[{ field, why, sourceSnippet, sourceHints:{ page|null, section|null, confidence|null } }]",
        },
        keyPeople: "[{ name, role|null, email|null, phone|null }]",
        contactInfo:
          "{ name|null, email|null, phone|null, address|null, role|null }",
        importantContacts:
          "[{ name|null, email|null, phone|null, address|null, role|null }]",
        relevantDates:
          "[{ date:'YYYY-MM-DD', description, type:'EXPIRATION|RENEWAL|PAYMENT|REVIEW|OTHER' }]",
        contractValidation: {
          isValidContract: "boolean",
          confidence: "number (0-100)",
          reason: "string|null",
        },
      };

      const repairPrompt = `You are a JSON repair engine for contract analysis.
Fix the malformed JSON response below and return ONLY valid, parseable JSON conforming to this schema:

${JSON.stringify(expectedSchema, null, 2)}

Rules:
1. Return ONLY the JSON object, no markdown, no explanations.
2. Preserve all values from the original response as accurately as possible.
3. Fix structural issues: missing braces, unescaped quotes, trailing commas, unmatched brackets.
4. For null/missing fields, use null value or empty array [] as appropriate.
5. Ensure all required text fields (title, summary, extractedText) have content.
6. All numeric values must be valid numbers.
7. All dates must be in YYYY-MM-DD format.
8. If type is unclear, use "OTHER".
9. Preserve explainability and evidence snippets when present.

Original parse error: ${parseError}

Malformed response to fix:
${malformedResponse.slice(0, 14000)}`;

      const repairedText = await this.generateWithGroqModelChain({
        preferredModel: FALLBACK_REPAIR_MODEL,
        prompt: repairPrompt,
        responseAsJson: true,
        maxOutputTokens: 6144,
      });

      if (repairedText.length === 0) {
        return null;
      }

      if (!repairedText.includes("{")) {
        return null;
      }

      try {
        this.parseJsonResponse(repairedText);
      } catch (firstRepairParseError) {
        const secondPassPrompt = `${repairPrompt}\n\nSECOND PASS CORRECTION:\nYour previous repaired JSON was still invalid.\nReason: ${firstRepairParseError instanceof Error ? firstRepairParseError.message : "Invalid JSON"}.\nReturn ONLY strict valid JSON.`;

        const secondPass = await this.generateWithGroqModelChain({
          preferredModel: FALLBACK_REPAIR_MODEL,
          prompt: secondPassPrompt,
          responseAsJson: true,
          maxOutputTokens: 6144,
        });

        this.parseJsonResponse(secondPass);
        return secondPass;
      }

      return repairedText;
    } catch (error: any) {
      if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
      console.warn("JSON repair step failed:", error);
      return null;
    }
  }

  private static async extractGroqGroundingText(input: {
    base64: string;
    mimeType: string;
  }): Promise<string> {
    // For PDFs: extract text directly using pdf-parse
    if (input.mimeType === "application/pdf") {
      try {
        const pdfBuffer = Buffer.from(input.base64, "base64");
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: pdfBuffer });
        let parsed: { text?: string };
        try {
          parsed = await parser.getText();
        } finally {
          await parser.destroy();
        }

        const text = (parsed?.text || "")
          .replace(/\r/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        if (text && text.length > 50) {
          console.log(
            `📄 Groq grounding: extracted ${text.length} chars from PDF`,
          );
          return text.slice(0, 50000);
        }
      } catch (error) {
        console.warn(
          "PDF grounding extraction failed for Groq fallback.",
          error,
        );
      }
    }

    // For images: try to extract text using Gemini OCR as grounding bridge.
    // This gives Groq the text content it needs since it can't read images.
    if (input.mimeType.startsWith("image/")) {
      try {
        const ocrText = await keyManager.execute(async (genAI) => {
          const model = genAI.getGenerativeModel({
            model: PRIMARY_ANALYSIS_MODEL,
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 8192,
            },
          });

          const result = await model.generateContent([
            "Extract ALL text from this document image exactly as it appears. Preserve structure, formatting, and all content. Return ONLY the raw text, no JSON, no commentary.",
            {
              inlineData: {
                data: input.base64,
                mimeType: input.mimeType,
              },
            },
          ]);

          return result.response.text()?.trim() || "";
        });

        if (ocrText && ocrText.length > 50) {
          console.log(
            `🖼️ Groq grounding: extracted ${ocrText.length} chars from image via Gemini OCR bridge`,
          );
          return ocrText.slice(0, 50000);
        }
      } catch (error: any) {
        // Gemini OCR bridge failed (likely key exhaustion), continue without
        if (!error.message?.includes("CRITICAL_KEY_EXHAUSTION")) {
          console.warn(
            "Image grounding via Gemini OCR failed for Groq fallback; continuing without grounded text.",
            error,
          );
        }
      }
    }

    return "";
  }

  /**
   * Emergency fallback: Extract key contract fields from raw text when JSON is completely malformed.
   * Builds a minimal but valid JSON structure from pattern-matched fields.
   */
  private static emergencyExtractFields(rawText: string): string | null {
    try {
      const titleMatch = rawText.match(
        /["']?title["']?\s*:\s*["']([^"']{5,200})/i,
      );
      const summaryMatch = rawText.match(
        /summary["']?\s*:\s*["']([^"']{10,500})/i,
      );
      const extractedMatch = rawText.match(
        /extractedText["']?\s*:\s*["']([^"']{30,})/i,
      );

      if (!titleMatch || !summaryMatch) {
        return null;
      }

      const emergency = {
        title: titleMatch[1]?.slice(0, 200) || "Contract",
        type: "OTHER",
        provider: null,
        policyNumber: null,
        startDate: null,
        endDate: null,
        premium: null,
        premiumCurrency: null,
        summary: summaryMatch[1]?.slice(0, 500) || "Contract analysis",
        extractedText:
          extractedMatch?.[1]?.slice(0, 12000) || rawText.slice(0, 12000),
        keyPoints: {
          guarantees: [],
          exclusions: [],
          franchise: null,
          importantDates: [],
        },
        contractValidation: {
          isValidContract: true,
          confidence: 50,
          reason: "Emergency partial extraction due to response malformation",
        },
      };

      return JSON.stringify(emergency);
    } catch {
      return null;
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
    const rawText = await this.generatePrevalidationWithFallback(input);

    let raw: PrevalidationResponse;
    try {
      raw = this.parseJsonResponse(rawText || "{}") as PrevalidationResponse;
    } catch {
      // If prevalidation JSON is malformed, assume it's a contract with moderate confidence
      console.warn(
        "Prevalidation JSON parse failed, assuming contract with moderate confidence",
      );
      return {
        isValidContract: true,
        confidence: 60,
        reason:
          "Prevalidation response was malformed, but document appears contract-like",
      };
    }

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

  private static async generatePrevalidationWithFallback(input: {
    base64: string;
    mimeType: string;
    fileName?: string;
  }): Promise<string> {
    let lastError: unknown = null;

    for (const modelName of GEMINI_ANALYSIS_MODELS) {
      try {
        return await keyManager.execute(async (genAI) => {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0,
              topP: 0.9,
              topK: 20,
              maxOutputTokens: 350,
              responseMimeType: "application/json",
            },
          });

          const result = await model.generateContent([
            buildPrevalidationPrompt(input.fileName),
            {
              inlineData: {
                data: input.base64,
                mimeType: input.mimeType,
              },
            },
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 0) {
            return text;
          }
          throw new Error("Empty response");
        });
      } catch (error: any) {
        if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
        lastError = error;
        console.warn(
          `Pre-validation with model ${modelName} failed. Trying next model.`,
        );
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("All pre-validation models failed to generate content.");
  }

  private static normalizeAnalysis(input: unknown): NormalizedAnalysis {
    return normalizeAiAnalysis(input);
  }

  private static async buildAdaptiveContext(userId?: string): Promise<string> {
    // No user context means no adaptation baseline.
    if (!userId) {
      return "";
    }

    const examples: AdaptiveContractExample[] = await prisma.contract.findMany({
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
        keyPoints: true,
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

    const allExplainability = examples
      .flatMap((item) => {
        const maybeExplainability = isAdaptiveKeyPoints(item.keyPoints)
          ? item.keyPoints.explainability
          : undefined;
        return Array.isArray(maybeExplainability) ? maybeExplainability : [];
      })
      .slice(0, 120);

    const explainabilityByField = count(
      allExplainability
        .map((entry) => String(entry?.field ?? "").trim())
        .filter((value: string) => value.length > 0),
    );

    const confidenceValues = allExplainability
      .map((entry) => Number(entry?.sourceHints?.confidence))
      .filter((value: number) => Number.isFinite(value));

    const avgEvidenceConfidence = confidenceValues.length
      ? Math.round(
          confidenceValues.reduce(
            (sum: number, value: number) => sum + value,
            0,
          ) / confidenceValues.length,
        )
      : null;

    const learnedLanguages = count(
      examples
        .map((item) =>
          isAdaptiveKeyPoints(item.keyPoints)
            ? item.keyPoints.aiMeta?.language
            : null,
        )
        .map((value) => String(value ?? "").trim())
        .filter((value: string) => value.length > 0),
    );

    const learnedKeyRoles = count(
      examples
        .flatMap((item) => {
          const people = isAdaptiveKeyPoints(item.keyPoints)
            ? item.keyPoints.aiMeta?.keyPeople
            : undefined;
          return Array.isArray(people) ? people : [];
        })
        .map((person) => String(person?.role ?? "").trim())
        .filter((value: string) => value.length > 0),
    );

    const avgSummaryLength =
      examples
        .map((item) => item.summary?.length ?? 0)
        .reduce((sum, length) => sum + length, 0) / examples.length;

    return `ADAPTIVE EXTRACTION CONTEXT FROM PREVIOUS DOCUMENTS:
- Frequent contract types in this workspace: ${topTypes.join(", ") || "N/A"}
- Frequent provider naming patterns: ${topProviders.join(", ") || "N/A"}
- Example policy number shape patterns: ${policyPatterns.join(", ") || "N/A"}
- Typical summary length target: around ${Math.round(avgSummaryLength)} characters.
- Dominant learned languages: ${learnedLanguages.join(", ") || "N/A"}
- Most evidenced fields: ${explainabilityByField.join(", ") || "N/A"}
- Average evidence confidence: ${avgEvidenceConfidence ?? "N/A"}
- Frequent key roles identified: ${learnedKeyRoles.join(", ") || "N/A"}

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
    raw: unknown,
    normalized: NormalizedAnalysis,
  ): void {
    const validation = raw as ValidationEnvelope;
    const modelIsValid = validation.contractValidation?.isValidContract;
    const confidenceRaw = Number(validation.contractValidation?.confidence);
    const modelReason = String(
      validation.contractValidation?.reason ?? "",
    ).trim();

    const legalSignalRegex =
      /contract|agreement|policy|terms|clause|premium|coverage|insured|insurer|loan|borrower|credit|beneficiary|liability|lease|service|supplier|client|vendor|annex|appendix|signature|party|contrat|assurance|banque|credit|emprunteur|garantie|echeance|duree|clause/i;
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

    // For generic contracts mapped to OTHER, keep a lighter heuristic so valid non-BFSI contracts pass.
    if (normalized.type === "OTHER") {
      if (!hasLegalSignals && normalized.extractedText.length < 120) {
        throw new Error(
          "INVALID_CONTRACT:Uploaded file does not contain enough contract-specific signals.",
        );
      }
      return;
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
  static validateAnalysis(data: unknown): boolean {
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
    } catch {
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
    ragChunks?: Array<{ chunkIndex: number; content: string; score: number }>;
    contract: {
      id: string;
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
      language?: string | null; // NEW: contract's detected language
    };
  }) {
    try {
      // Retrieve best matching persisted chunks for grounded Q&A.
      let ragChunks = input.ragChunks ?? [];
      if (ragChunks.length === 0) {
        try {
          ragChunks = await RAGService.retrieveRelevantChunks({
            contractId: input.contract.id,
            question: input.question,
            topK: 6,
          });
        } catch (error) {
          console.warn(
            "RAG chunk retrieval failed. Falling back to extracted snippet.",
            error,
          );
        }
      }

      // Keep context bounded to avoid overlong prompts and token waste.
      const extractedTextSnippet = (input.contract.extractedText || "")
        .slice(0, 5000)
        .trim();
      const ragContext =
        ragChunks.length > 0
          ? RAGService.buildChunkContext(ragChunks)
          : extractedTextSnippet || "N/A";
      const contractTypeGuidance = this.getContractTypeGuidance(
        input.contract.type,
      );

      // Detect contract language for multilingual response
      const contractLanguage = input.contract.language || "en";
      const languageName =
        {
          en: "English",
          fr: "French",
          de: "German",
          es: "Spanish",
          it: "Italian",
          pt: "Portuguese",
          nl: "Dutch",
          pl: "Polish",
          ja: "Japanese",
          zh: "Chinese",
          ar: "Arabic",
        }[contractLanguage] || "English";

      const prompt = `You are a senior BFSI contract advisor. IMPORTANT: Respond entirely in ${languageName} to match the contract language.

Contract metadata:
- File: ${input.contract.fileName}
- Language: ${languageName}
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

Grounded RAG Context:
${ragContext}

User question (${languageName}):
${input.question}

Instructions:
- RESPOND ENTIRELY IN ${languageName}. This is critical.
- Write in clear, professional, business-oriented plain text.
- Do NOT use markdown or special formatting symbols, including: **, __, #, *, -, backticks with one exception: you can use | for separators if needed for clarity
- Do NOT quote large raw excerpts from extracted text unless strictly necessary.
- Synthesize and explain the implications in practical terms instead of copying file content.
- Base your answer ONLY on the provided contract content.
- Prioritize information from Grounded RAG Context over any assumptions.
- Adapt answer emphasis using this type guidance: ${contractTypeGuidance}
- If information is missing, explicitly say: Information not found in the analyzed contract.
- If the question asks about legal consequences or non-compliance, provide general legal context for EU/USA at a high level only.
- For legal context, use wording like: "Under general EU/US legal principles..." and avoid citing specific article numbers unless explicitly present in the contract content.
- Never claim certainty where the contract text is ambiguous.
- Keep the answer concise, executive, and decision-oriented.
- Use the same language preference throughout (${languageName}).
- Add one short evidence line at the end in this format: Source basis: Chunk X, Chunk Y (or Source basis: extracted contract text).

Response structure (in ${languageName}):
1) Direct answer in one sentence.
2) Business impact in one to two sentences (risk, cost, operational effect).
3) General legal context in one to two sentences when relevant.
4) Recommended next step in one sentence.

Compliance note (in ${languageName}):
Include one short disclaimer only when legal context is discussed: "This is general information, not formal legal advice."`;

      // Execute completion with model fallback and sanitize styling artifacts.
      let rawAnswer = "";
      let lastError: unknown = null;

      for (const modelName of GEMINI_ANALYSIS_MODELS) {
        try {
          rawAnswer = await keyManager.execute(async (genAI) => {
            const model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                temperature: 0.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
              },
            });

            const result = await model.generateContent(prompt);
            const text = result.response.text()?.trim() || "";

            if (text) {
              console.log(
                `✅ Q&A with model ${modelName} succeeded in ${languageName}`,
              );
              return text;
            }
            throw new Error("Empty response");
          });

          if (rawAnswer) {
            break;
          }
        } catch (error: any) {
          if (error.message?.includes("CRITICAL_KEY_EXHAUSTION")) throw error;
          lastError = error;
          console.warn(
            `Q&A with model ${modelName} failed. Trying next model.`,
          );
        }
      }

      if (!rawAnswer) {
        try {
          rawAnswer = await this.generateWithGroqModelChain({
            preferredModel: FALLBACK_ANALYSIS_MODEL,
            systemPrompt: `You are a senior BFSI contract advisor. Answer questions about contracts accurately and professionally. Respond entirely in ${languageName}. Use plain text only — no markdown, no bold, no headers, no bullet points. Base your answers ONLY on the provided contract content. If information is missing, say so.`,
            prompt,
            responseAsJson: false,
            maxOutputTokens: 2048,
            temperature: 0.2,
            topP: 0.95,
          });
          console.log(
            `✅ Q&A fallback with Groq model ${FALLBACK_ANALYSIS_MODEL} succeeded in ${languageName}`,
          );
        } catch (groqError) {
          lastError = groqError;
        }
      }

      if (!rawAnswer) {
        if (lastError instanceof Error) {
          throw lastError;
        }
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("API key")) {
        throw new Error("Invalid or missing AI API key (Gemini/Groq).");
      }
      if (this.isTransientGeminiError(errorMessage)) {
        throw new Error(
          `Gemini is temporarily overloaded for the configured Q&A models (${ANALYSIS_MODELS.join(", ")}). Please try again in a few minutes.`,
        );
      }
      throw new Error(`Error answering question: ${errorMessage}`);
    }
  }
}
