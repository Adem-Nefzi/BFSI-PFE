/**
 * Contract Server Actions
 *
 * Handles all contract-related operations including:
 * - Saving uploaded contracts
 * - Retrieving contracts
 * - Analyzing contracts with AI
 * - Deleting contracts
 * - Asking questions about contracts
 *
 * Each action integrates with:
 * - Clerk for authentication
 * - Contract service for database operations
 * - AI service for document analysis
 * - Notification service for user feedback
 *
 * All operations include comprehensive error handling and notification creation.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  ContractService,
  saveContract as savePendingContract,
} from "@/lib/services/contract.service";
import { AIService } from "@/lib/services/ai.service";
import { NotificationService } from "@/lib/services/notification.service";

/**
 * Saves a new contract after UploadThing upload
 *
 * Steps:
 * 1. Get authenticated user from Clerk
 * 2. Get internal user ID from database
 * 3. Save contract to database with UPLOADED status
 * 4. Create success notification for the user
 * 5. Revalidate dashboard and contacts pages
 *
 * @param data - Contract file metadata from UploadThing
 * @returns Success status with contract data or error message
 */
export async function saveContract(data: {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}) {
  try {
    // Get authenticated user
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Save contract
    const result = await savePendingContract(data);

    if (result.success && result.contract) {
      // Get internal user ID for notification
      const user = await ContractService.getUserByClerkId(clerkId);

      if (user) {
        // Create success notification
        await NotificationService.create({
          userId: user.id,
          type: "SUCCESS",
          title: "📄 Contract Uploaded",
          message: `"${data.fileName}" has been uploaded successfully. Click "Analyze" to extract contract details.`,
          contractId: result.contract.id,
          actionType: "UPLOAD_SUCCESS",
          icon: "FileCheck",
          expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      revalidatePath("/contacts");
      revalidatePath("/dashboard");
    }

    return result;
  } catch (error: unknown) {
    console.error("Save contract error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retrieves all contracts for the authenticated user
 *
 * Steps:
 * 1. Query database for contracts matching filter criteria
 * 2. Serialize data: convert Decimal to number, dates to ISO strings
 * 3. Return paginated/filtered contract list
 *
 * Supported Filters:
 * - status: UPLOADED, PROCESSING, COMPLETED, FAILED
 * - type: INSURANCE_AUTO, INSURANCE_HOME, etc.
 * - search: Searches title, provider, policyNumber, fileName
 * - userId: Auto-filtered to authenticated user
 *
 * @param filters - Filter criteria
 * @returns Array of contracts with serialized data
 */
export async function getContracts(filters?: Record<string, unknown>) {
  try {
    const contracts = await ContractService.getAll(filters);

    // Serialize contracts: convert Decimal to number, dates to ISO strings
    const serializedContracts = contracts.map((contract: any) => ({
      id: contract.id,
      fileName: contract.fileName,
      fileSize: contract.fileSize,
      mimeType: contract.mimeType,
      status: contract.status,
      createdAt: contract.createdAt?.toISOString() || new Date().toISOString(),
      fileUrl: contract.fileUrl,
      // AI Analysis fields
      title: contract.title || null,
      type: contract.type || null,
      provider: contract.provider || null,
      policyNumber: contract.policyNumber || null,
      startDate: contract.startDate ? contract.startDate.toISOString() : null,
      endDate: contract.endDate ? contract.endDate.toISOString() : null,
      premium: contract.premium
        ? parseFloat(contract.premium.toString())
        : null,
      summary: contract.summary || null,
      keyPoints: contract.keyPoints || null,
      extractedText: contract.extractedText || null,
    }));

    return { success: true, contracts: serializedContracts };
  } catch (error: unknown) {
    console.error("Get contracts error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retrieves a single contract by ID
 *
 * @param id - Contract ID
 * @returns Contract details or error
 */
export async function getContract(id: string) {
  try {
    const contract = await ContractService.getById(id);
    return { success: true, contract };
  } catch (error: unknown) {
    console.error("Get contract error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deletes a contract from both cloud storage and database
 *
 * Steps:
 * 1. Get authenticated user from Clerk
 * 2. Get internal user ID from database
 * 3. Verify user owns the contract
 * 4. Delete file from UploadThing cloud storage
 * 5. Delete contract record from database
 * 6. Create success notification
 * 7. Revalidate pages
 *
 * @param id - Contract ID to delete
 * @returns Success status or error message
 *
 * Security: Only the contract owner can delete their contracts
 */
export async function deleteContract(id: string) {
  try {
    // Get authenticated user
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get contract to verify ownership and get title
    const contract = await ContractService.getById(id);
    const contractTitle = contract.title || contract.fileName;

    // Get internal user ID
    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user || contract.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized: Contract not found or does not belong to you",
      };
    }

    // Delete contract (handles both storage and database)
    await ContractService.delete(id);

    if (user) {
      // Create success notification
      await NotificationService.create({
        userId: user.id,
        type: "SUCCESS",
        title: "🗑️ Contract Deleted",
        message: `"${contractTitle}" has been permanently deleted.`,
        actionType: "DELETE_SUCCESS",
        icon: "Trash2",
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours
      });
    }

    revalidatePath("/contacts");
    revalidatePath("/dashboard");

    return { success: true, message: "Contract deleted successfully" };
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retrieves dashboard statistics for the authenticated user
 *
 * Returns:
 * - Total contracts count
 * - Status breakdown (uploaded, processing, completed, failed)
 * - Contract type distribution
 * - AI learning telemetry data
 *
 * @returns Statistics object or error
 */
export async function getContractStats() {
  try {
    const stats = await ContractService.getStats();
    return { success: true, stats };
  } catch (error: unknown) {
    console.error("Stats error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Analyzes a contract using AI service
 *
 * Steps:
 * 1. Authenticate user
 * 2. Get contract details
 * 3. Update status to PROCESSING
 * 4. Call AI service to analyze contract
 * 5. Validate AI results
 * 6. Save results to database with COMPLETED status
 * 7. Create success notification
 * 8. Return analysis results or error
 *
 * On Error:
 * - Detects if contract is invalid vs analysis failed
 * - Saves failure reason to database
 * - Creates error notification
 * - Returns appropriate error code for UI handling
 *
 * @param id - Contract ID to analyze
 * @returns Success with analysis results or error with error code
 *
 * Error Codes:
 * - INVALID_CONTRACT: File is not a valid contract document
 * - ANALYSIS_ERROR: Analysis failed during processing
 */
export async function analyzeContractAction(id: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get internal user ID
    const user = await ContractService.getUserByClerkId(clerkId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Get contract
    const contract = await ContractService.getById(id);

    // Verify ownership
    if (contract.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized: Contract not found or does not belong to you",
      };
    }

    // Update status to PROCESSING
    await ContractService.updateStatus(id, "PROCESSING");

    // Create processing notification
    await NotificationService.create({
      userId: user.id,
      type: "INFO",
      title: "⏳ Analyzing Contract",
      message: `"${contract.fileName}" is being analyzed. This may take a few seconds...`,
      contractId: id,
      actionType: "ANALYSIS_STARTED",
      icon: "Loader",
    });

    // Analyze with AI
    const aiResults = await AIService.analyzeContract(contract.fileUrl, {
      userId: contract.userId,
      fileName: contract.fileName,
      maxRetries: 3,
    });

    // Validate results
    if (!AIService.validateAnalysis(aiResults)) {
      console.error("❌ AI validation failed");
      await ContractService.markFailed(
        id,
        "AI validation failed. The file may be incomplete or not a valid contract.",
      );

      // Create error notification
      await NotificationService.create({
        userId: user.id,
        type: "ERROR",
        title: "❌ Analysis Failed",
        message:
          "The AI could not validate the analysis result. The file may be incomplete or corrupted.",
        contractId: id,
        actionType: "ANALYSIS_FAILED",
        icon: "AlertCircle",
      });

      return {
        success: false,
        error: "AI analysis validation failed. Please try again.",
        errorCode: "ANALYSIS_ERROR",
      };
    }

    // Persist AI learning metadata inside keyPoints JSON so future analyses can adapt
    // without requiring DB schema changes.
    const keyPointsWithLearning = {
      ...(aiResults.keyPoints ?? {}),
      aiMeta: {
        language: (aiResults as any).language ?? null,
        keyPeople: (aiResults as any).keyPeople ?? [],
        contactInfo: (aiResults as any).contactInfo ?? null,
        importantContacts: (aiResults as any).importantContacts ?? [],
        relevantDates: (aiResults as any).relevantDates ?? [],
        premiumCurrency: (aiResults as any).premiumCurrency ?? null,
        learnedAt: new Date().toISOString(),
      },
    };

    // Save AI results to database (convert nulls to undefined for optional fields)
    await ContractService.updateWithAIResults(id, {
      ...aiResults,
      keyPoints: keyPointsWithLearning,
      provider: aiResults.provider ?? undefined,
      policyNumber: aiResults.policyNumber ?? undefined,
      startDate: aiResults.startDate ?? undefined,
      endDate: aiResults.endDate ?? undefined,
      premium: aiResults.premium ?? undefined,
    });

    // Create success notification with extracted info
    const contractTitle = aiResults.title || "Contract";
    const contractProvider = aiResults.provider || "Unknown Provider";
    const endDate = aiResults.endDate
      ? new Date(aiResults.endDate).toLocaleDateString()
      : "N/A";

    await NotificationService.create({
      userId: user.id,
      type: "SUCCESS",
      title: "✅ Contract Analyzed",
      message: `"${contractTitle}" from ${contractProvider} (Expires: ${endDate}) has been successfully analyzed and saved.`,
      contractId: id,
      actionType: "ANALYSIS_SUCCESS",
      icon: "CheckCircle2",
      expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    revalidatePath("/contacts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Contract analyzed successfully!",
      contract: aiResults,
    };
  } catch (error: unknown) {
    console.error("Analyze error:", error);

    try {
      const { userId: clerkId } = await auth();
      const user = clerkId && (await ContractService.getUserByClerkId(clerkId));

      // Update contract status to FAILED
      const reason =
        error instanceof Error ? error.message : "Unknown error occurred";
      await ContractService.markFailed(id, reason);

      // Create error notification
      if (user) {
        const contract = await ContractService.getById(id);
        await NotificationService.create({
          userId: user.id,
          type: "ERROR",
          title: "❌ Analysis Failed",
          message: reason,
          contractId: id,
          actionType: "ANALYSIS_ERROR",
          icon: "AlertCircle",
        });
      }
    } catch (e) {
      console.error("Failed to update status or create notification", e);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Detect if contract is invalid vs analysis failed
    const invalidContractSignals = [
      "not recognized as a valid contract",
      "contract confidence is too low",
      "does not contain enough contract-specific signals",
      "uploaded file is not recognized as a contract",
      "invalid_contract",
    ];
    const normalizedError = errorMessage.toLowerCase();
    const isInvalidContract = invalidContractSignals.some((signal) =>
      normalizedError.includes(signal),
    );

    return {
      success: false,
      error: errorMessage,
      errorCode: isInvalidContract ? "INVALID_CONTRACT" : "ANALYSIS_ERROR",
    };
  }
}

/**
 * Asks a question about a specific contract using AI
 *
 * Steps:
 * 1. Authenticate user
 * 2. Validate question is not empty
 * 3. Retrieve contract details
 * 4. Call AI service with contract context
 * 5. Return answer or error
 *
 * The AI uses the contract's extracted data to provide contextual answers about:
 * - Contract terms and conditions
 * - Dates and expiration information
 * - Coverage details
 * - Renewal terms
 * - Specific clauses and provisions
 *
 * @param id - Contract ID
 * @param question - User's question about the contract
 * @returns AI-generated answer or error
 *
 * Example Questions:
 * - "When does this insurance expire?"
 * - "What is the coverage limit?"
 * - "What are the exclusions?"
 * - "How much is the premium?"
 */
export async function askContractQuestionAction(id: string, question: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return { success: false, error: "Question cannot be empty" };
    }

    // Get contract details
    const contract = await ContractService.getById(id);

    // Get internal user ID
    const user = await ContractService.getUserByClerkId(clerkId);
    if (!user || contract.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized: Contract not found or does not belong to you",
      };
    }

    // Ask AI about contract with full context
    const answer = await AIService.askAboutContract({
      question: trimmedQuestion,
      contract: {
        fileName: contract.fileName,
        title: contract.title,
        type: contract.type,
        provider: contract.provider,
        policyNumber: contract.policyNumber,
        startDate: contract.startDate,
        endDate: contract.endDate,
        premium: contract.premium
          ? parseFloat(contract.premium.toString())
          : null,
        summary: contract.summary,
        keyPoints:
          (contract.keyPoints as Record<string, unknown> | null) ?? null,
        extractedText: contract.extractedText,
        language: (contract.keyPoints as any)?.aiMeta?.language ?? null,
      },
    });

    return { success: true, answer };
  } catch (error: unknown) {
    console.error("Ask contract question error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
