// src/lib/services/contract.service.ts

import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import type {
  ContractFilters,
  ContractStats,
  ContractStatus,
  ContractType,
} from "@/types/contract.types";
import { revalidatePath } from "next/cache";
import { NotificationService } from "@/lib/services/notification.service";

const utapi = new UTApi();

export async function saveContract(data: {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Step 1: Create contract record (status: UPLOADED)
    const contract = await ContractService.create({
      ...data,
      userId,
    });

    // Keep uploaded contracts pending until the user manually clicks Analyze.
    // Status stays as UPLOADED here.

    revalidatePath("/contacts");
    revalidatePath("/dashboard");

    return {
      success: true,
      contract: {
        id: contract.id,
        fileName: contract.fileName,
        fileUrl: contract.fileUrl,
        status: contract.status,
      },
    };
  } catch (error: unknown) {
    console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ SAVE CONTRACT ERROR");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export class ContractService {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CREATE CONTRACT
  // Called after UploadThing upload completes
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async create(data: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    userId: string; // This is Clerk userId (clerkId)
  }) {
    // Find the internal database user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: data.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.contract.create({
      data: {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        userId: user.id, // Use internal database User.id
        status: "UPLOADED",
      },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE WITH AI RESULTS
  // Called after AI processing completes (Sprint 2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async updateWithAIResults(
    id: string,
    aiResults: {
      title: string;
      type: ContractType;
      provider?: string;
      policyNumber?: string;
      startDate?: string | Date;
      endDate?: string | Date;
      premium?: number;
      extractedText: string;
      summary: string;
      keyPoints: Record<string, unknown>;
    },
  ) {
    // Convert date strings to proper ISO-8601 DateTime format
    const parseDate = (dateInput: string | Date | undefined): Date | null => {
      if (!dateInput) return null;

      if (dateInput instanceof Date) {
        return dateInput;
      }

      // If it's a date string (YYYY-MM-DD), convert to ISO DateTime
      if (typeof dateInput === "string") {
        const date = new Date(`${dateInput}T00:00:00Z`);
        return isNaN(date.getTime()) ? null : date;
      }

      return null;
    };

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        title: aiResults.title,
        type: aiResults.type,
        provider: aiResults.provider,
        policyNumber: aiResults.policyNumber,
        startDate: parseDate(aiResults.startDate),
        endDate: parseDate(aiResults.endDate),
        premium: aiResults.premium,
        extractedText: aiResults.extractedText,
        summary: aiResults.summary,
        keyPoints: JSON.parse(JSON.stringify(aiResults.keyPoints)),
        status: "COMPLETED",
      },
    });

    // Check for upcoming deadlines after contract is completed
    try {
      const user = await prisma.user.findUnique({
        where: { id: contract.userId },
        select: { id: true },
      });

      if (user) {
        await NotificationService.checkUpcomingDeadlines(user.id);
      }
    } catch (error) {
      console.warn("Failed to check upcoming deadlines:", error);
      // Don't fail the contract update if deadline check fails
    }

    return contract;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE STATUS
  // Used during processing pipeline
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async updateStatus(id: string, status: ContractStatus) {
    return await prisma.contract.update({
      where: { id },
      data: { status },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MARK FAILED WITH REASON
  // Store user-visible reason in summary for failed analyses
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async markFailed(id: string, reason: string) {
    const safeReason = reason.trim().slice(0, 900);
    return await prisma.contract.update({
      where: { id },
      data: {
        status: "FAILED",
        summary: safeReason || "Analysis failed. Please try again.",
      },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET ALL CONTRACTS
  // With optional filtering and search
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getAll(filters?: ContractFilters) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // Find the internal database user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    interface WhereClause {
      userId: string;
      type?: ContractType;
      status?: ContractStatus;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        provider?: { contains: string; mode: "insensitive" };
        policyNumber?: { contains: string; mode: "insensitive" };
        fileName?: { contains: string; mode: "insensitive" };
      }>;
    }

    const where: WhereClause = { userId: user.id };

    // Filter by type
    if (filters?.type) {
      where.type = filters.type;
    }

    // Filter by status
    if (filters?.status) {
      where.status = filters.status;
    }

    // Search across title, provider, policy number
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { provider: { contains: filters.search, mode: "insensitive" } },
        { policyNumber: { contains: filters.search, mode: "insensitive" } },
        { fileName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return await prisma.contract.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            ragChunks: true,
          },
        },
      },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET SINGLE CONTRACT
  // With authorization check
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getById(id: string) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // Find the internal database user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.userId !== user.id) {
      throw new Error("Unauthorized to access this contract");
    }

    return contract;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DELETE CONTRACT
  // With authorization check and UploadThing file deletion
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async delete(id: string) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // Verify ownership and get contract details
    const contract = await this.getById(id);

    // Extract file key from UploadThing URL
    // URL format: https://utfs.io/f/{fileKey}
    const fileKey = this.extractFileKeyFromUrl(contract.fileUrl);

    // Delete file from UploadThing storage
    if (fileKey) {
      try {
        await utapi.deleteFiles(fileKey);
      } catch (error) {
        console.error("Failed to delete file from UploadThing:", error);
        // Continue with database deletion even if UploadThing deletion fails
      }
    }

    // Delete contract record from database
    return await prisma.contract.delete({
      where: { id },
    });
  }

  static async deleteAllForUser(userId: string): Promise<number> {
    const contracts = await prisma.contract.findMany({
      where: { userId },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    if (contracts.length === 0) {
      return 0;
    }

    const fileKeys = contracts
      .map((contract) => this.extractFileKeyFromUrl(contract.fileUrl))
      .filter((value): value is string => Boolean(value));

    if (fileKeys.length > 0) {
      try {
        await utapi.deleteFiles(fileKeys);
      } catch (error) {
        console.error("Failed to bulk delete files from UploadThing:", error);
      }
    }

    const deleted = await prisma.contract.deleteMany({
      where: { userId },
    });

    return deleted.count;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HELPER: Extract file key from UploadThing URL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  private static extractFileKeyFromUrl(url: string): string | null {
    try {
      // UploadThing URL format: https://utfs.io/f/{fileKey}
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      // Get the last part which is the file key
      const fileKey = pathParts[pathParts.length - 1];
      return fileKey || null;
    } catch (error) {
      console.error("Failed to extract file key from URL:", error);
      return null;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET STATISTICS
  // Dashboard stats: total, active, expired, expiring soon
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getStats(): Promise<ContractStats> {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    // Find the internal database user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    const [total, active, expired, expiringSoon] = await Promise.all([
      // Total contracts
      prisma.contract.count({
        where: { userId: user.id },
      }),

      // Active (completed and not expired)
      prisma.contract.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
          OR: [
            { endDate: { gte: now } },
            { endDate: null }, // No end date
          ],
        },
      }),

      // Expired (end date in the past)
      prisma.contract.count({
        where: {
          userId: user.id,
          endDate: {
            lt: now,
            not: null,
          },
        },
      }),

      // Expiring in next 30 days
      prisma.contract.count({
        where: {
          userId: user.id,
          endDate: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
        },
      }),
    ]);

    return { total, active, expired, expiringSoon };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET EXPIRING CONTRACTS
  // Get contracts expiring within X days
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getExpiring(daysAhead: number = 30) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000,
    );

    return await prisma.contract.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        endDate: {
          gte: now,
          lte: futureDate,
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET CONTRACTS BY TYPE
  // Group contracts by type for analytics
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getByType() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const contracts = await prisma.contract.groupBy({
      by: ["type"],
      where: { userId: user.id },
      _count: {
        type: true,
      },
    });

    return contracts.map((item) => ({
      type: item.type,
      count: item._count.type,
    }));
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHECK IF USER OWNS CONTRACT
  // Quick ownership check (used for authorization)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async isOwner(contractId: string, userId: string): Promise<boolean> {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { userId: true },
    });

    return contract?.userId === userId;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GET RECENT CONTRACTS
  // For dashboard "recent activity"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async getRecent(limit: number = 5) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.contract.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        fileName: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UPDATE PARTIAL
  // Update specific fields (useful for editing)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  static async updatePartial(
    id: string,
    data: {
      title?: string;
      type?: ContractType;
      provider?: string;
      policyNumber?: string;
      startDate?: Date;
      endDate?: Date;
      premium?: number;
    },
  ) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    await this.getById(id);

    return await prisma.contract.update({
      where: { id },
      data,
    });
  }

  /**
   * Get user by Clerk ID
   *
   * Used to retrieve internal database user ID from Clerk authentication ID
   * This is necessary because:
   * - Clerk returns clerkId after authentication
   * - Database stores internal User.id (CUID)
   * - Contract operations need the internal User.id
   *
   * @param clerkId - Clerk authentication user ID
   * @returns Internal database User object or null if not found
   */
  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}
