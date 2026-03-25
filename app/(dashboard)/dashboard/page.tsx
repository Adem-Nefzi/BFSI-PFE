"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStatsAction } from "@/lib/actions/stats.action";
import { checkDeadlineNotifications } from "@/lib/actions/notification.action";
import {
  ContractStatusChart,
  ContractTypeChart,
  TrendChart,
} from "@/components/views/dashboard/charts";

interface DashboardStats {
  totalContracts: number;
  analyzedContracts: number;
  processingContracts: number;
  uploadedContracts: number;
  failedContracts: number;
  analysisRate: number;
}

interface ChartData {
  byType: Array<{ type: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
  trends: Array<{ date: string; count: number }>;
}

interface PremiumInfo {
  averagePremium: number;
  totalPremium: number;
  count: number;
}

interface RecentContract {
  id: string;
  title: string | null;
  type: string | null;
  createdAt: string;
  premium: number | null;
}

interface AILearningTelemetry {
  completedSamples: number;
  completedLast7Days: number;
  avgSummaryLength: number;
  avgExtractedTextLength: number;
  avgKeyPointsPerContract: number;
  learningScore: number;
  improvementHint: string;
}

interface StatsActionResult {
  success: boolean;
  stats?: DashboardStats;
  chartData?: ChartData;
  premiumInfo?: PremiumInfo;
  aiLearningTelemetry?: AILearningTelemetry;
  recentContracts?: RecentContract[];
  error?: string;
}

const numberFormatter = new Intl.NumberFormat("en-US");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const defaultStats: DashboardStats = {
  totalContracts: 0,
  analyzedContracts: 0,
  processingContracts: 0,
  uploadedContracts: 0,
  failedContracts: 0,
  analysisRate: 0,
};

const formatLastUpdated = (date: Date | null): string => {
  if (!date) {
    return "Just now";
  }

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

const clampPercent = (value: number): number =>
  Math.max(0, Math.min(100, value));

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [premiumInfo, setPremiumInfo] = useState<PremiumInfo>({
    averagePremium: 0,
    totalPremium: 0,
    count: 0,
  });
  const [recentContracts, setRecentContracts] = useState<RecentContract[]>([]);
  const [aiLearningTelemetry, setAiLearningTelemetry] =
    useState<AILearningTelemetry>({
      completedSamples: 0,
      completedLast7Days: 0,
      avgSummaryLength: 0,
      avgExtractedTextLength: 0,
      avgKeyPointsPerContract: 0,
      learningScore: 0,
      improvementHint: "Analyze contracts to build your AI quality profile.",
    });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadStats = useCallback(async (options?: { silent?: boolean }) => {
    const isSilentRefresh = options?.silent ?? false;

    if (isSilentRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = (await getStatsAction()) as StatsActionResult;

      if (!result.success) {
        return;
      }

      if (result.stats) setStats(result.stats);
      if (result.chartData) setChartData(result.chartData);
      if (result.premiumInfo) setPremiumInfo(result.premiumInfo);
      if (result.aiLearningTelemetry) {
        setAiLearningTelemetry(result.aiLearningTelemetry);
      }
      if (result.recentContracts) setRecentContracts(result.recentContracts);

      setLastUpdated(new Date());
    } finally {
      if (isSilentRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadStats();
    // Check for upcoming contract deadlines and create notifications
    void checkDeadlineNotifications();
  }, [loadStats]);

  useEffect(() => {
    if (stats.processingContracts === 0 && stats.uploadedContracts === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadStats({ silent: true });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadStats, stats.processingContracts, stats.uploadedContracts]);

  const hasChartData = useMemo(() => {
    if (!chartData) return false;

    const trendsCount = chartData.trends.reduce(
      (total, entry) => total + entry.count,
      0,
    );
    const byStatusCount = chartData.byStatus.reduce(
      (total, entry) => total + entry.count,
      0,
    );
    const byTypeCount = chartData.byType.reduce(
      (total, entry) => total + entry.count,
      0,
    );

    return trendsCount + byStatusCount + byTypeCount > 0;
  }, [chartData]);

  const pendingContracts = stats.processingContracts + stats.uploadedContracts;

  const analyzedPercent =
    stats.totalContracts > 0
      ? clampPercent((stats.analyzedContracts / stats.totalContracts) * 100)
      : 0;

  const pendingPercent =
    stats.totalContracts > 0
      ? clampPercent((pendingContracts / stats.totalContracts) * 100)
      : 0;

  const failedPercent =
    stats.totalContracts > 0
      ? clampPercent((stats.failedContracts / stats.totalContracts) * 100)
      : 0;

  const statusRows = [
    {
      label: "Uploaded",
      value: stats.uploadedContracts,
      colorClass: "bg-amber-500",
    },
    {
      label: "Processing",
      value: stats.processingContracts,
      colorClass: "bg-primary",
    },
    {
      label: "Analyzed",
      value: stats.analyzedContracts,
      colorClass: "bg-emerald-500",
    },
    {
      label: "Failed",
      value: stats.failedContracts,
      colorClass: "bg-destructive",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Card className="rounded-3xl border-border/60 p-10">
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Building your analytics workspace...
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.22),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.16),transparent_40%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)/0.95))]" />
        <svg
          viewBox="0 0 640 320"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute right-[-140px] top-[-50px] h-[340px] w-[540px] opacity-50"
        >
          <path
            d="M12 290C96 240 128 112 228 110C300 108 336 206 412 206C492 206 524 138 628 132"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 250C86 200 150 74 238 74C322 74 350 170 430 170C502 170 560 108 636 104"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          <circle cx="228" cy="110" r="8" fill="hsl(var(--primary))" />
          <circle cx="412" cy="206" r="7" fill="hsl(var(--secondary))" />
          <circle cx="430" cy="170" r="7" fill="hsl(var(--accent))" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 xl:grid-cols-[1.45fr,0.95fr] xl:items-end"
          >
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Performance Overview
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Financial Contracts Analytics
              </h1>
              <p className="max-w-2xl text-muted-foreground md:text-base">
                A reliable command center for uploaded documents, AI analysis
                throughput, and portfolio quality across your BFSI workflow.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Live metrics
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-secondary" />
                  {isRefreshing
                    ? "Syncing..."
                    : `Updated ${formatLastUpdated(lastUpdated)}`}
                </span>
              </div>
            </div>

            <Card className="rounded-2xl border-border/60 bg-card/80 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Pipeline Snapshot
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {numberFormatter.format(stats.totalContracts)} files
                  </p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5">
                  <Database className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border/60 bg-muted/25 p-3">
                <svg
                  viewBox="0 0 260 90"
                  fill="none"
                  aria-hidden="true"
                  className="h-[92px] w-full"
                >
                  <path
                    d="M4 72H256"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                  <rect
                    x="24"
                    y="32"
                    width="28"
                    height="40"
                    rx="8"
                    fill="hsl(var(--primary) / 0.85)"
                  />
                  <rect
                    x="76"
                    y="22"
                    width="28"
                    height="50"
                    rx="8"
                    fill="hsl(var(--secondary) / 0.8)"
                  />
                  <rect
                    x="128"
                    y="14"
                    width="28"
                    height="58"
                    rx="8"
                    fill="hsl(var(--accent) / 0.78)"
                  />
                  <rect
                    x="180"
                    y="44"
                    width="28"
                    height="28"
                    rx="8"
                    fill="hsl(var(--destructive) / 0.8)"
                  />
                  <path
                    d="M24 30C64 8 98 10 142 18C176 24 214 34 240 22"
                    stroke="hsl(var(--foreground) / 0.35)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <p className="text-muted-foreground">Analyzed</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {numberFormatter.format(stats.analyzedContracts)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <p className="text-muted-foreground">Pending</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {numberFormatter.format(pendingContracts)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => void loadStats()}
                  className="w-full rounded-xl"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button asChild className="w-full rounded-xl">
                  <Link href="/contacts">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border-border/60 bg-card/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Files</p>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-4xl font-semibold">
              {numberFormatter.format(stats.totalContracts)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Uploaded into your workspace
            </p>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Analyzed</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-4xl font-semibold">
              {numberFormatter.format(stats.analyzedContracts)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Completed by AI pipeline
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted/70">
              <div
                className="h-1.5 rounded-full bg-emerald-500"
                style={{ width: `${analyzedPercent}%` }}
              />
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pending Queue</p>
              <Clock3 className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-4xl font-semibold">
              {numberFormatter.format(pendingContracts)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Uploaded and processing files
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted/70">
              <div
                className="h-1.5 rounded-full bg-amber-500"
                style={{ width: `${pendingPercent}%` }}
              />
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Failed</p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="mt-2 text-4xl font-semibold">
              {numberFormatter.format(stats.failedContracts)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Items needing re-analysis
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted/70">
              <div
                className="h-1.5 rounded-full bg-destructive"
                style={{ width: `${failedPercent}%` }}
              />
            </div>
          </Card>
        </div>

        <Card className="mt-5 rounded-2xl border-border/60 p-5">
          <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Pipeline Pulse</h2>
              </div>
              <div className="space-y-3">
                {statusRows.map((row) => {
                  const rowPercent =
                    stats.totalContracts > 0
                      ? clampPercent((row.value / stats.totalContracts) * 100)
                      : 0;

                  return (
                    <div
                      key={row.label}
                      className="rounded-xl border border-border/50 bg-muted/25 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <p className="text-muted-foreground">{row.label}</p>
                        <p className="font-medium text-foreground">
                          {numberFormatter.format(row.value)}
                        </p>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted/70">
                        <div
                          className={`h-1.5 rounded-full ${row.colorClass}`}
                          style={{ width: `${rowPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {stats.analysisRate}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Completed vs total files
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
                <p className="text-xs text-muted-foreground">Avg Premium</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {currencyFormatter.format(premiumInfo.averagePremium)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Across {numberFormatter.format(premiumInfo.count)} analyzed
                  files
                </p>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
                <p className="text-xs text-muted-foreground">Total Premium</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {currencyFormatter.format(premiumInfo.totalPremium)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Portfolio value captured by AI
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-5 rounded-2xl border-border/60 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">AI Learning Telemetry</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              Score {aiLearningTelemetry.learningScore}/100
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
              <p className="text-xs text-muted-foreground">Completed Samples</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {numberFormatter.format(aiLearningTelemetry.completedSamples)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {numberFormatter.format(aiLearningTelemetry.completedLast7Days)}{" "}
                in last 7 days
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Avg Summary Length
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {numberFormatter.format(aiLearningTelemetry.avgSummaryLength)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">characters</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Avg Extracted Text
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {numberFormatter.format(
                  aiLearningTelemetry.avgExtractedTextLength,
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">characters</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
              <p className="text-xs text-muted-foreground">Avg Key Points</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {aiLearningTelemetry.avgKeyPointsPerContract.toFixed(1)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                items per analysis
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border/50 bg-muted/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Learning quality index</span>
              <span>{aiLearningTelemetry.learningScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
                style={{
                  width: `${Math.max(0, Math.min(100, aiLearningTelemetry.learningScore))}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {aiLearningTelemetry.improvementHint}
            </p>
          </div>
        </Card>

        {hasChartData ? (
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
            {chartData && chartData.trends.length > 0 && (
              <Card className="rounded-2xl border-border/60 p-5 xl:col-span-8">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-medium">
                    Upload Trend (30 days)
                  </h2>
                </div>
                <div className="h-[320px]">
                  <TrendChart data={chartData.trends} />
                </div>
              </Card>
            )}

            {chartData && chartData.byStatus.length > 0 && (
              <Card className="rounded-2xl border-border/60 p-5 xl:col-span-4">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-medium">Processing Status</h2>
                </div>
                <div className="h-[320px]">
                  <ContractStatusChart
                    data={chartData.byStatus.map((s) => ({
                      ...s,
                      name: s.status,
                    }))}
                  />
                </div>
              </Card>
            )}

            {chartData && chartData.byType.length > 0 && (
              <Card className="rounded-2xl border-border/60 p-5 xl:col-span-7">
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-medium">
                    Contract Type Distribution
                  </h2>
                </div>
                <div className="h-[300px]">
                  <ContractTypeChart data={chartData.byType} />
                </div>
              </Card>
            )}

            <Card className="rounded-2xl border-border/60 p-5 xl:col-span-5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-medium">Recent Analyses</h2>
              </div>

              {recentContracts.length > 0 ? (
                <div className="space-y-3">
                  {recentContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="rounded-xl border border-border/50 bg-muted/25 p-3"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {contract.title || "Untitled contract"}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{contract.type || "Unknown type"}</span>
                        <span>
                          {new Date(contract.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-foreground">
                        Premium:{" "}
                        {contract.premium !== null
                          ? currencyFormatter.format(contract.premium)
                          : "Not detected"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-center">
                  <div>
                    <p className="text-sm font-medium">
                      No recent analyses yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Analyze a contract to populate this activity feed.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card className="mt-6 rounded-2xl border-border/60 p-8">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <svg
                width="220"
                height="120"
                viewBox="0 0 220 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-5 opacity-80"
              >
                <rect
                  x="14"
                  y="26"
                  width="192"
                  height="78"
                  rx="14"
                  stroke="currentColor"
                  className="text-muted-foreground"
                />
                <path
                  d="M30 82L62 60L88 74L124 44L162 58L192 36"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary"
                />
                <circle
                  cx="62"
                  cy="60"
                  r="5"
                  fill="currentColor"
                  className="text-primary"
                />
                <circle
                  cx="124"
                  cy="44"
                  r="5"
                  fill="currentColor"
                  className="text-primary"
                />
                <circle
                  cx="192"
                  cy="36"
                  r="5"
                  fill="currentColor"
                  className="text-secondary"
                />
              </svg>
              <h3 className="text-xl font-semibold">
                Your analytics will appear here
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload and analyze contracts to unlock trend and distribution
                charts.
              </p>
              <Button asChild className="mt-5 rounded-xl">
                <Link href="/contacts">
                  Upload first contract
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
