// src/lib/services/ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/db/prisma";
import {
  AnalyzeOptions,
  ContractPrecheckResult,
  NormalizedAnalysis,
} from "@/lib/services/ai/analysis.types";
import {
  buildAnalysisPrompt,
  buildPrevalidationPrompt,
} from "@/lib/services/ai/analysis.prompt";
import { parseJsonResponse as parseAiJsonResponse } from "@/lib/services/ai/analysis.parser";
import { normalizeAnalysis as normalizeAiAnalysis } from "@/lib/services/ai/analysis.normalizer";

// Read API key from environment once at module load.
const API_KEY =
  process.env.AI_API_KEY || process.env.AI_API_KEY2 || process.env.AI_API_KEY3;

if (!API_KEY) {
  console.error("❌ AI_API_KEY is missing from environment variables");
  console.error("Please add AI_API_KEY to your .env file");
  throw new Error("AI_API_KEY is not configured");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

const PRIMARY_ANALYSIS_MODEL =
  process.env.AI_MODEL_PRIMARY || "gemini-2.5-flash";
const FALLBACK_ANALYSIS_MODEL =
  process.env.AI_MODEL_FALLBACK || "gemini-2.0-flash";

const ANALYSIS_MODELS = Array.from(
  new Set([PRIMARY_ANALYSIS_MODEL, FALLBACK_ANALYSIS_MODEL]),
);

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
          `Invalid Gemini model configuration. Current models: ${ANALYSIS_MODELS.join(", ")}. Check model availability in your Gemini account.`,
        );
      } else if (
        error.message?.includes("fetch") &&
        !error.message?.includes("generativelanguage")
      ) {
        throw new Error(
          "Download failed. Check if the file URL is correct and accessible.",
        );
      } else if (
        error.message?.includes("JSON") ||
        error.message?.includes("No complete JSON object") ||
        error.message?.includes("parse failed")
      ) {
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
            "AI returned a malformed response format. Please retry analysis; if it fails again, the file may require OCR cleanup.",
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

  private static async generateAnalysisWithFallback(input: {
    prompt: string;
    base64: string;
    mimeType: string;
  }): Promise<string> {
    let lastError: unknown = null;

    for (const modelName of ANALYSIS_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
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
      } catch (error) {
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
    } catch (error) {
      console.warn("Lenient generation also failed:", error);
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("All analysis models failed to generate content.");
  }

  private static async repairMalformedJson(
    malformedResponse: string,
    parseError: string,
  ): Promise<string | null> {
    try {
      const repairModelName = FALLBACK_ANALYSIS_MODEL;
      const model = genAI.getGenerativeModel({
        model: repairModelName,
        generationConfig: {
          temperature: 0,
          topP: 0.9,
          topK: 20,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      });

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

      const repaired = await model.generateContent(repairPrompt);
      const repairedText = repaired.response.text()?.trim() || "";

      if (repairedText.length === 0) {
        return null;
      }

      // Verify the repaired text is at least JSON-like before returning
      if (!repairedText.includes("{")) {
        return null;
      }

      return repairedText;
    } catch (error) {
      console.warn("JSON repair step failed:", error);
      return null;
    }
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

    let raw: any;
    try {
      raw = this.parseJsonResponse(rawText || "{}");
    } catch (error) {
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

    for (const modelName of ANALYSIS_MODELS) {
      try {
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
      } catch (error) {
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

  private static normalizeAnalysis(input: any): NormalizedAnalysis {
    return normalizeAiAnalysis(input);
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
        const maybeExplainability = (item.keyPoints as any)?.explainability;
        return Array.isArray(maybeExplainability) ? maybeExplainability : [];
      })
      .slice(0, 120);

    const explainabilityByField = count(
      allExplainability
        .map((entry: any) => String(entry?.field ?? "").trim())
        .filter((value: string) => value.length > 0),
    );

    const confidenceValues = allExplainability
      .map((entry: any) => Number(entry?.sourceHints?.confidence))
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
        .map((item) => (item.keyPoints as any)?.aiMeta?.language)
        .map((value) => String(value ?? "").trim())
        .filter((value: string) => value.length > 0),
    );

    const learnedKeyRoles = count(
      examples
        .flatMap((item) => {
          const people = (item.keyPoints as any)?.aiMeta?.keyPeople;
          return Array.isArray(people) ? people : [];
        })
        .map((person: any) => String(person?.role ?? "").trim())
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
    raw: any,
    normalized: NormalizedAnalysis,
  ): void {
    const modelIsValid = raw?.contractValidation?.isValidContract;
    const confidenceRaw = Number(raw?.contractValidation?.confidence);
    const modelReason = String(raw?.contractValidation?.reason ?? "").trim();

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
      language?: string | null; // NEW: contract's detected language
    };
  }) {
    try {
      // Keep context bounded to avoid overlong prompts and token waste.
      const extractedTextSnippet = (input.contract.extractedText || "")
        .slice(0, 12000)
        .trim();
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

Extracted Text:
${extractedTextSnippet || "N/A"}

User question (${languageName}):
${input.question}

Instructions:
- RESPOND ENTIRELY IN ${languageName}. This is critical.
- Write in clear, professional, business-oriented plain text.
- Do NOT use markdown or special formatting symbols, including: **, __, #, *, -, backticks with one exception: you can use | for separators if needed for clarity
- Do NOT quote large raw excerpts from extracted text unless strictly necessary.
- Synthesize and explain the implications in practical terms instead of copying file content.
- Base your answer ONLY on the provided contract content.
- Adapt answer emphasis using this type guidance: ${contractTypeGuidance}
- If information is missing, explicitly say: Information not found in the analyzed contract.
- If the question asks about legal consequences or non-compliance, provide general legal context for EU/USA at a high level only.
- For legal context, use wording like: "Under general EU/US legal principles..." and avoid citing specific article numbers unless explicitly present in the contract content.
- Never claim certainty where the contract text is ambiguous.
- Keep the answer concise, executive, and decision-oriented.
- Use the same language preference throughout (${languageName}).

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

      for (const modelName of ANALYSIS_MODELS) {
        try {
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
          rawAnswer = result.response.text()?.trim() || "";

          if (rawAnswer) {
            console.log(
              `✅ Q&A with model ${modelName} succeeded in ${languageName}`,
            );
            break;
          }
        } catch (error) {
          lastError = error;
          console.warn(
            `Q&A with model ${modelName} failed. Trying next model.`,
          );
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
    } catch (error: any) {
      if (error.message?.includes("API key")) {
        throw new Error("Invalid or missing Gemini API key.");
      }
      throw new Error(`Error answering question: ${error.message}`);
    }
  }
}
