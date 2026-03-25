import { ContractStatus, ContractType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const TREND_WINDOW_DAYS = 30;

const STATUS_LABELS: Record<ContractStatus, string> = {
  UPLOADED: "Uploaded",
  PROCESSING: "Processing",
  COMPLETED: "Analyzed",
  FAILED: "Failed",
};

const TYPE_LABELS: Record<ContractType, string> = {
  INSURANCE_AUTO: "Auto Insurance",
  INSURANCE_HOME: "Home Insurance",
  INSURANCE_HEALTH: "Health Insurance",
  INSURANCE_LIFE: "Life Insurance",
  LOAN: "Loan",
  CREDIT_CARD: "Credit Card",
  INVESTMENT: "Investment",
  OTHER: "Other",
};

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTrendLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const countKeyPoints = (value: unknown): number => {
  if (!value || typeof value !== "object") {
    return 0;
  }

  const candidate = value as {
    guarantees?: unknown;
    exclusions?: unknown;
    importantDates?: unknown;
    franchise?: unknown;
  };

  const guarantees = Array.isArray(candidate.guarantees)
    ? candidate.guarantees.length
    : 0;
  const exclusions = Array.isArray(candidate.exclusions)
    ? candidate.exclusions.length
    : 0;
  const importantDates = Array.isArray(candidate.importantDates)
    ? candidate.importantDates.length
    : 0;
  const franchise =
    typeof candidate.franchise === "string" && candidate.franchise.trim()
      ? 1
      : 0;

  return guarantees + exclusions + importantDates + franchise;
};

export async function getUserStats(clerkUserId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    });

    if (!user) {
      return {
        success: true,
        stats: {
          totalContracts: 0,
          analyzedContracts: 0,
          processingContracts: 0,
          uploadedContracts: 0,
          failedContracts: 0,
          analysisRate: 0,
        },
        chartData: {
          byType: [],
          byStatus: [],
          trends: [],
        },
        premiumInfo: {
          averagePremium: 0,
          totalPremium: 0,
          count: 0,
        },
        aiLearningTelemetry: {
          completedSamples: 0,
          completedLast7Days: 0,
          avgSummaryLength: 0,
          avgExtractedTextLength: 0,
          avgKeyPointsPerContract: 0,
          learningScore: 0,
          improvementHint:
            "Analyze contracts to build your AI quality profile.",
        },
        recentContracts: [],
      };
    }

    const today = new Date();
    const trendStartDate = new Date(today);
    trendStartDate.setHours(0, 0, 0, 0);
    trendStartDate.setDate(trendStartDate.getDate() - (TREND_WINDOW_DAYS - 1));

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalContracts,
      analyzedContracts,
      processingContracts,
      uploadedContracts,
      failedContracts,
      contractsByType,
      contractsByStatus,
      recentUploads,
      premiumStats,
      completedContractsForTelemetry,
      completedLast7Days,
      recentAnalyzedContracts,
    ] = await Promise.all([
      prisma.contract.count({
        where: { userId: user.id },
      }),
      prisma.contract.count({
        where: { userId: user.id, status: "COMPLETED" },
      }),
      prisma.contract.count({
        where: { userId: user.id, status: "PROCESSING" },
      }),
      prisma.contract.count({
        where: { userId: user.id, status: "UPLOADED" },
      }),
      prisma.contract.count({
        where: { userId: user.id, status: "FAILED" },
      }),
      prisma.contract.groupBy({
        by: ["type"],
        where: { userId: user.id },
        _count: {
          _all: true,
        },
      }),
      prisma.contract.groupBy({
        by: ["status"],
        where: { userId: user.id },
        _count: {
          _all: true,
        },
      }),
      prisma.contract.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: trendStartDate },
        },
        select: {
          createdAt: true,
        },
      }),
      prisma.contract.aggregate({
        where: {
          userId: user.id,
          status: "COMPLETED",
          premium: { not: null },
        },
        _avg: { premium: true },
        _sum: { premium: true },
        _count: {
          _all: true,
        },
      }),
      prisma.contract.findMany({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 25,
        select: {
          summary: true,
          extractedText: true,
          keyPoints: true,
        },
      }),
      prisma.contract.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
          updatedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.contract.findMany({
        where: { userId: user.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true,
          premium: true,
        },
      }),
    ]);

    const dailyUploads = new Map<string, number>();
    for (const item of recentUploads) {
      const dayKey = toDateKey(item.createdAt);
      dailyUploads.set(dayKey, (dailyUploads.get(dayKey) ?? 0) + 1);
    }

    const trends = Array.from({ length: TREND_WINDOW_DAYS }, (_, index) => {
      const date = new Date(trendStartDate);
      date.setDate(trendStartDate.getDate() + index);

      const dayKey = toDateKey(date);
      return {
        date: formatTrendLabel(date),
        count: dailyUploads.get(dayKey) ?? 0,
      };
    });

    const statusCountMap = new Map<ContractStatus, number>();
    for (const item of contractsByStatus) {
      statusCountMap.set(item.status, item._count._all);
    }

    const byStatus = (Object.keys(STATUS_LABELS) as ContractStatus[]).map(
      (status) => ({
        status: STATUS_LABELS[status],
        count: statusCountMap.get(status) ?? 0,
      }),
    );

    const byType = contractsByType
      .filter((item) => item.type !== null)
      .map((item) => ({
        type: TYPE_LABELS[item.type as ContractType],
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    const completedSamples = completedContractsForTelemetry.length;
    const avgSummaryLength =
      completedSamples > 0
        ? Math.round(
            completedContractsForTelemetry.reduce(
              (sum, item) => sum + (item.summary?.length ?? 0),
              0,
            ) / completedSamples,
          )
        : 0;

    const avgExtractedTextLength =
      completedSamples > 0
        ? Math.round(
            completedContractsForTelemetry.reduce(
              (sum, item) => sum + (item.extractedText?.length ?? 0),
              0,
            ) / completedSamples,
          )
        : 0;

    const avgKeyPointsPerContract =
      completedSamples > 0
        ? Number(
            (
              completedContractsForTelemetry.reduce(
                (sum, item) => sum + countKeyPoints(item.keyPoints),
                0,
              ) / completedSamples
            ).toFixed(1),
          )
        : 0;

    const summaryQuality = clamp((avgSummaryLength / 220) * 100, 0, 100);
    const extractionDepth = clamp(
      (avgExtractedTextLength / 4000) * 100,
      0,
      100,
    );
    const keyPointCoverage = clamp(avgKeyPointsPerContract * 12, 0, 100);
    const sampleConsistency = clamp((completedSamples / 12) * 100, 0, 100);

    const learningScore = Math.round(
      summaryQuality * 0.35 +
        extractionDepth * 0.35 +
        keyPointCoverage * 0.2 +
        sampleConsistency * 0.1,
    );

    const improvementHint =
      completedLast7Days === 0
        ? "No new analyses in the last 7 days. Analyze more contracts to keep AI adaptation fresh."
        : learningScore >= 80
          ? "Great quality trend. Continue diverse analyses to keep adaptation robust."
          : learningScore >= 60
            ? "Stable quality. More varied document types can improve adaptation depth."
            : "Quality profile is still maturing. Analyze more files to improve extraction consistency.";

    return {
      success: true,
      stats: {
        totalContracts,
        analyzedContracts,
        processingContracts,
        uploadedContracts,
        failedContracts,
        analysisRate:
          totalContracts > 0
            ? Math.round((analyzedContracts / totalContracts) * 100)
            : 0,
      },
      chartData: {
        byType,
        byStatus,
        trends,
      },
      premiumInfo: {
        averagePremium: premiumStats._avg.premium
          ? Number(premiumStats._avg.premium)
          : 0,
        totalPremium: premiumStats._sum.premium
          ? Number(premiumStats._sum.premium)
          : 0,
        count: premiumStats._count._all,
      },
      aiLearningTelemetry: {
        completedSamples,
        completedLast7Days,
        avgSummaryLength,
        avgExtractedTextLength,
        avgKeyPointsPerContract,
        learningScore,
        improvementHint,
      },
      recentContracts: recentAnalyzedContracts.map((contract) => ({
        ...contract,
        premium: contract.premium ? Number(contract.premium) : null,
        createdAt: contract.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to get user stats:", error);
    return {
      success: false,
      error: "Failed to fetch statistics",
    };
  }
}
