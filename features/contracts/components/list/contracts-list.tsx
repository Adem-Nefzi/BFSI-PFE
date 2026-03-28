"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Loader2,
  Sparkles,
  FileText,
  MessageSquare,
  Send,
  Scale,
  Briefcase,
  User,
  Bot,
  AlertTriangle,
  X,
  Search,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteContract,
  getContracts,
  analyzeContractAction,
  askContractQuestionAction,
} from "@/features/contracts/api/contract.action";
import { toast } from "sonner";
import { ContractChatModal } from "@/features/contracts/components/modals/contract-chat-modal";
import { ContractProofModal } from "@/features/contracts/components/modals/contract-proof-modal";

interface Contract {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  createdAt: string; // ISO string
  fileUrl: string;
  title?: string | null;
  type?: string | null;
  provider?: string | null;
  policyNumber?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  premium?: number | null;
  summary?: string | null;
  keyPoints?: Record<string, unknown> | null;
  extractedText?: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ExplainabilityEntry {
  field: string;
  why: string;
  sourceSnippet: string;
  sourceHints?: {
    page?: string | null;
    section?: string | null;
    confidence?: number | null;
  };
}

export function ContractsList({ refreshTrigger }: { refreshTrigger?: number }) {
  const emitNotificationRefresh = () => {
    window.dispatchEvent(new Event("notifications:refresh"));
    const channel = new BroadcastChannel("notifications-channel");
    channel.postMessage({ type: "notifications:refresh" });
    channel.close();
  };

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [chatContract, setChatContract] = useState<Contract | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(
    null,
  );
  const [invalidContractDialogOpen, setInvalidContractDialogOpen] =
    useState(false);
  const [invalidContractReason, setInvalidContractReason] = useState("");
  const [invalidContractFileName, setInvalidContractFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofData, setProofData] = useState<{
    fieldKey: string;
    field: string;
    sourceSnippet: string;
    confidence: number | null;
    page: string | null;
    section: string | null;
    lineNumber: number | null;
    contextStartLine: number | null;
    context: string[];
    resolutionMode: "exact" | "fuzzy" | "fallback";
  } | null>(null);

  const ENTITY_REGEX =
    /(\*\*[^*]+\*\*)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+?\d[\d\s().-]{7,}\d)|(\b\d{4}-\d{2}-\d{2}\b)|(\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b)|((?:€|\$|£)\s?\d[\d\s.,]*\d|\b\d[\d\s.,]*\d\s?(?:EUR|USD|TND|MAD|DZD|GBP)\b)|(\b\d+(?:[.,]\d+)?\s?%\b)|(\b\d{2,}(?:[.,]\d+)?\b)/g;

  const renderHighlightedText = (
    text: string,
    keyPrefix: string,
  ): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = ENTITY_REGEX.exec(text)) !== null) {
      const [token] = match;
      const start = match.index;

      if (start > lastIndex) {
        nodes.push(text.slice(lastIndex, start));
      }

      const tokenKey = `${keyPrefix}-token-${index}`;
      index += 1;

      if (token.startsWith("**") && token.endsWith("**")) {
        nodes.push(
          <strong key={tokenKey} className="font-semibold text-foreground">
            {token.slice(2, -2)}
          </strong>,
        );
      } else if (match[2]) {
        nodes.push(
          <span
            key={tokenKey}
            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-700 dark:text-emerald-300"
          >
            {token}
          </span>,
        );
      } else if (match[3]) {
        nodes.push(
          <span
            key={tokenKey}
            className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1 py-0.5 font-medium text-cyan-700 dark:text-cyan-300"
          >
            {token}
          </span>,
        );
      } else if (match[4] || match[5]) {
        nodes.push(
          <span
            key={tokenKey}
            className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 font-medium text-amber-700 dark:text-amber-300"
          >
            {token}
          </span>,
        );
      } else if (match[6] || match[7]) {
        nodes.push(
          <span
            key={tokenKey}
            className="rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 px-1 py-0.5 font-medium text-fuchsia-700 dark:text-fuchsia-300"
          >
            {token}
          </span>,
        );
      } else {
        nodes.push(
          <span key={tokenKey} className="font-medium text-foreground">
            {token}
          </span>,
        );
      }

      lastIndex = start + token.length;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  const renderRichParagraphs = (
    text: string,
    keyPrefix: string,
  ): ReactNode[] => {
    const cleaned = text.replace(/\u2022/g, "•").trim();
    if (!cleaned) return [];

    const lines = cleaned
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line, idx) => {
      const isList = /^[-*•]\s+/.test(line);
      const content = line.replace(/^[-*•]\s+/, "");

      return (
        <div
          key={`${keyPrefix}-line-${idx}`}
          className={isList ? "flex items-start gap-2" : ""}
        >
          {isList && (
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/80" />
          )}
          <p className="leading-7 text-muted-foreground">
            {renderHighlightedText(content, `${keyPrefix}-${idx}`)}
          </p>
        </div>
      );
    });
  };

  // Helper: Find source snippet in extracted text and get line number + context
  const findSourceSnippetInText = (
    sourceSnippet: string,
    extractedText: string | null | undefined,
    fieldKey?: string,
    fallbackNeedles?: string[],
  ): {
    lineNumber: number | null;
    contextStartLine: number | null;
    context: string[];
    resolutionMode: "exact" | "fuzzy" | "fallback";
  } => {
    if (!extractedText || !sourceSnippet) {
      return {
        lineNumber: null,
        contextStartLine: null,
        context: [],
        resolutionMode: "fallback",
      };
    }

    const normalizeForMatch = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");

    const buildDateNeedles = (isoDate: string): string[] => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return [isoDate];

      const [year, month, day] = isoDate.split("-");
      const monthIndex = Number(month) - 1;

      const frMonths = [
        "janvier",
        "fevrier",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "aout",
        "septembre",
        "octobre",
        "novembre",
        "decembre",
      ];
      const enMonths = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      const numericDay = String(Number(day));
      const numericMonth = String(Number(month));

      return [
        isoDate,
        `${day}/${month}/${year}`,
        `${day}-${month}-${year}`,
        `${numericDay}/${numericMonth}/${year}`,
        `${numericDay}-${numericMonth}-${year}`,
        `${numericDay} ${frMonths[monthIndex]} ${year}`,
        `${numericDay} ${enMonths[monthIndex]} ${year}`,
      ];
    };

    const tokenize = (value: string) =>
      normalizeForMatch(value)
        .split(" ")
        .filter((token) => token.length >= 3 || /^\d+$/.test(token));

    const lines = extractedText.split(/\r?\n/);
    const normalizedLines = lines.map((line) => normalizeForMatch(line));
    const snippetNormalized = normalizeForMatch(sourceSnippet);
    const snippetTokens = tokenize(sourceSnippet);
    const resolvedFallbackNeedles = [...(fallbackNeedles ?? [])];

    if (
      (fieldKey === "startDate" || fieldKey === "endDate") &&
      fallbackNeedles?.[0]
    ) {
      resolvedFallbackNeedles.push(...buildDateNeedles(fallbackNeedles[0]));
    }

    const needleTokens = resolvedFallbackNeedles.flatMap((needle) =>
      tokenize(needle),
    );

    const snippetNeedle = snippetNormalized.slice(0, 90);
    const isDateField = fieldKey === "startDate" || fieldKey === "endDate";

    // Stage 1: strict exact matching to avoid false positives.
    const exactIndex = normalizedLines.findIndex((line) =>
      snippetNeedle.length >= 25 ? line.includes(snippetNeedle) : false,
    );

    if (exactIndex >= 0) {
      const contextStart = Math.max(0, exactIndex - 3);
      const contextEnd = Math.min(lines.length, exactIndex + 4);
      return {
        lineNumber: exactIndex + 1,
        contextStartLine: contextStart + 1,
        context: lines.slice(contextStart, contextEnd),
        resolutionMode: "exact",
      };
    }

    // Stage 2: deterministic date/value lookup for date fields.
    if (isDateField && resolvedFallbackNeedles.length > 0) {
      const normalizedNeedles = resolvedFallbackNeedles
        .map((value) => normalizeForMatch(value))
        .filter((value) => value.length >= 6);

      const dateCandidates = normalizedLines
        .map((line, idx) => {
          const needleHits = normalizedNeedles.filter((needle) =>
            line.includes(needle),
          ).length;
          if (needleHits === 0) return null;

          const genericTemporalBoost =
            /(effet|debut|start|commence|expiration|expire|echeance|fin|periode|garantie|validite|prend effet)/.test(
              line,
            )
              ? 15
              : 0;

          const fieldSpecificBoost =
            fieldKey === "endDate"
              ? /(expiration|expire|echeance|fin|expire le|date d expiration)/.test(
                  line,
                )
                ? 28
                : 0
              : /(prend effet|debut|commence|start date|date d effet)/.test(
                    line,
                  )
                ? 24
                : 0;

          const score =
            needleHits * 40 + genericTemporalBoost + fieldSpecificBoost;
          return { idx, score };
        })
        .filter((item): item is { idx: number; score: number } => item !== null)
        .sort((a, b) => b.score - a.score);

      const bestDateCandidate = dateCandidates[0];

      if (bestDateCandidate) {
        const contextStart = Math.max(0, bestDateCandidate.idx - 3);
        const contextEnd = Math.min(lines.length, bestDateCandidate.idx + 4);
        return {
          lineNumber: bestDateCandidate.idx + 1,
          contextStartLine: contextStart + 1,
          context: lines.slice(contextStart, contextEnd),
          resolutionMode: "exact",
        };
      }
    }

    const windows: { start: number; end: number; text: string }[] = [];
    for (let start = 0; start < normalizedLines.length; start++) {
      for (let length = 1; length <= 4; length++) {
        const end = start + length;
        if (end > normalizedLines.length) break;
        windows.push({
          start,
          end,
          text: normalizedLines.slice(start, end).join(" "),
        });
      }
    }

    let bestMatch: { start: number; score: number } | null = null;

    const hasDateHint = isDateField;
    const hasPremiumHint = fieldKey === "premium";

    for (const window of windows) {
      const windowTokens = window.text.split(" ").filter(Boolean);
      const tokenSet = new Set(windowTokens);

      let score = 0;

      if (
        snippetNormalized &&
        window.text.includes(snippetNormalized.slice(0, 60))
      ) {
        score += 45;
      }

      if (snippetTokens.length > 0) {
        const overlap = snippetTokens.filter((token) =>
          tokenSet.has(token),
        ).length;
        score += (overlap / snippetTokens.length) * 40;
      }

      if (needleTokens.length > 0) {
        const overlap = needleTokens.filter((token) =>
          tokenSet.has(token),
        ).length;
        score += (overlap / needleTokens.length) * 35;
      }

      if (hasDateHint) {
        const containsYear = /\b(19|20)\d{2}\b/.test(window.text);
        const temporalKeywords =
          /(effet|debut|start|commence|expiration|expire|echeance|fin|periode|garantie|validite|prend effet)/.test(
            window.text,
          );
        if (containsYear) score += 12;
        if (temporalKeywords) score += 20;
        if (
          fieldKey === "endDate" &&
          /(expiration|expire|echeance|fin|date d effet|expire le)/.test(
            window.text,
          )
        ) {
          score += 22;
        }
      }

      if (hasPremiumHint) {
        if (
          /(prime|cotisation|premium|montant|cout|cost|total)/.test(window.text)
        ) {
          score += 18;
        }
        if (/(eur|usd|tnd|mad|dzd|gbp|€|\$|£)/.test(window.text)) {
          score += 12;
        }
      }

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { start: window.start, score };
      }
    }

    if (bestMatch && bestMatch.score >= 32) {
      const contextStart = Math.max(0, bestMatch.start - 3);
      const contextEnd = Math.min(lines.length, bestMatch.start + 4);
      const context = lines.slice(contextStart, contextEnd);

      return {
        lineNumber: bestMatch.start + 1,
        contextStartLine: contextStart + 1,
        context,
        resolutionMode: "fuzzy",
      };
    }

    return {
      lineNumber: null,
      contextStartLine: null,
      context: [],
      resolutionMode: "fallback",
    };
  };

  // Handler: Open proof modal when clicking info icon
  const handleProofClick = (
    fieldKey: string,
    entry: ExplainabilityEntry,
    fieldValueFallback?: string,
    sectionHint?: string | null,
  ) => {
    const proofHints = [fieldValueFallback, sectionHint]
      .filter((hint): hint is string => Boolean(hint && hint.trim()))
      .map((hint) => hint.trim());

    const { lineNumber, contextStartLine, context, resolutionMode } =
      findSourceSnippetInText(
        entry.sourceSnippet,
        selectedContract?.extractedText,
        fieldKey,
        proofHints,
      );

    setProofData({
      fieldKey,
      field: entry.field,
      sourceSnippet: entry.sourceSnippet,
      confidence: entry.sourceHints?.confidence ?? null,
      page: entry.sourceHints?.page ?? null,
      section: entry.sourceHints?.section ?? null,
      lineNumber,
      contextStartLine,
      context,
      resolutionMode,
    });

    setProofModalOpen(true);
  };

  const getExplainabilityItems = (
    contract: Contract | null,
  ): ExplainabilityEntry[] => {
    const raw = (contract?.keyPoints as any)?.explainability;
    if (!Array.isArray(raw)) return [];

    return raw
      .map((item: any) => ({
        field: String(item?.field ?? "").trim(),
        why: String(item?.why ?? "").trim(),
        sourceSnippet: String(item?.sourceSnippet ?? "").trim(),
        sourceHints: {
          page:
            item?.sourceHints?.page === null ||
            item?.sourceHints?.page === undefined
              ? null
              : String(item?.sourceHints?.page),
          section:
            item?.sourceHints?.section === null ||
            item?.sourceHints?.section === undefined
              ? null
              : String(item?.sourceHints?.section),
          confidence:
            typeof item?.sourceHints?.confidence === "number"
              ? item.sourceHints.confidence
              : null,
        },
      }))
      .filter((item: ExplainabilityEntry) => {
        return item.field && item.why && item.sourceSnippet;
      })
      .slice(0, 24);
  };

  const explainabilityItems = useMemo(
    () => getExplainabilityItems(selectedContract),
    [selectedContract],
  );

  const getProofForField = useCallback(
    (fieldKey: string): ExplainabilityEntry | null => {
      const normalize = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9]/g, "");

      const aliases: Record<string, string[]> = {
        title: ["title", "contracttitle"],
        provider: ["provider", "institution", "insurer", "company"],
        policyNumber: [
          "policynumber",
          "policyno",
          "contractnumber",
          "reference",
        ],
        startDate: ["startdate", "effectivedate", "start"],
        endDate: ["enddate", "expirationdate", "expirydate", "maturitydate"],
        premium: ["premium", "amount", "totalcost", "fee", "price"],
      };

      const normalizedTargets = new Set(
        (aliases[fieldKey] ?? [fieldKey]).map((item) => normalize(item)),
      );

      const ranked = explainabilityItems
        .map((entry) => {
          const normalizedField = normalize(entry.field);
          const isExact = normalizedTargets.has(normalizedField);
          const isPartial = Array.from(normalizedTargets).some(
            (target) =>
              normalizedField.includes(target) ||
              target.includes(normalizedField),
          );
          const confidence = entry.sourceHints?.confidence ?? 0;
          const score = (isExact ? 100 : 0) + (isPartial ? 40 : 0) + confidence;
          return { entry, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const match = ranked[0]?.entry;

      return match ?? null;
    },
    [explainabilityItems],
  );

  const getFieldValueForProof = useCallback(
    (fieldKey: string): string => {
      if (!selectedContract) return "";

      switch (fieldKey) {
        case "title":
          return selectedContract.title ?? "";
        case "provider":
          return selectedContract.provider ?? "";
        case "policyNumber":
          return selectedContract.policyNumber ?? "";
        case "startDate":
          return selectedContract.startDate ?? "";
        case "endDate":
          return selectedContract.endDate ?? "";
        case "premium":
          return selectedContract.premium
            ? selectedContract.premium.toString()
            : "";
        default:
          return "";
      }
    },
    [selectedContract],
  );

  const resolvePremiumCurrency = useCallback((contract: Contract | null) => {
    if (!contract) return null;

    const fromMeta = String(
      (contract.keyPoints as any)?.aiMeta?.premiumCurrency ?? "",
    ).trim();
    if (fromMeta) return fromMeta;

    const explainability = getExplainabilityItems(contract);
    const premiumEvidence = explainability.find((item) => {
      const normalized = item.field.toLowerCase();
      return normalized.includes("premium") || normalized.includes("prime");
    });

    const currencyRegex = /(EUR|USD|TND|MAD|DZD|GBP|CHF|CAD|AUD|€|\$|£)/i;
    const snippetCurrency =
      premiumEvidence?.sourceSnippet.match(currencyRegex)?.[0];
    if (snippetCurrency) return snippetCurrency.toUpperCase();

    const textCurrency = contract.extractedText?.match(currencyRegex)?.[0];
    if (textCurrency) return textCurrency.toUpperCase();

    return null;
  }, []);

  const formatPremiumWithSourceCurrency = useCallback(
    (contract: Contract | null) => {
      if (
        !contract ||
        contract.premium === null ||
        contract.premium === undefined
      ) {
        return "N/A";
      }

      const currency = resolvePremiumCurrency(contract) ?? "EUR";
      const numeric = new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(contract.premium);

      if (currency === "€" || currency === "$" || currency === "£") {
        return `${currency}${numeric}`;
      }

      return `${numeric} ${currency}`;
    },
    [resolvePremiumCurrency],
  );

  const handleOpenFieldProof = (fieldKey: string, label: string) => {
    const fieldValueFallback = getFieldValueForProof(fieldKey);
    const proof = getProofForField(fieldKey);

    if (!proof) {
      if (fieldValueFallback) {
        handleProofClick(
          fieldKey,
          {
            field: label,
            why: "Resolved using extracted field value fallback when explicit explainability evidence is missing.",
            sourceSnippet: fieldValueFallback,
            sourceHints: {
              confidence: null,
              page: null,
              section: null,
            },
          },
          fieldValueFallback,
          null,
        );
        return;
      }

      toast.error(`No proof snippet is available for ${label}`);
      return;
    }

    handleProofClick(
      fieldKey,
      proof,
      fieldValueFallback,
      proof.sourceHints?.section ?? null,
    );
  };

  const loadContracts = useCallback(
    async (options?: { silent?: boolean; search?: string }) => {
      const isSilentRefresh = options?.silent ?? false;

      if (!isSilentRefresh) {
        setIsLoading(true);
      }

      try {
        const result = await getContracts({
          search: options?.search?.trim() || undefined,
        });
        if (result.success && Array.isArray(result.contracts)) {
          setContracts(result.contracts);
        }
      } catch (error) {
        console.error("Failed to load contracts:", error);
        toast.error("Failed to load contracts");
      } finally {
        if (!isSilentRefresh) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    void loadContracts({ search: debouncedSearchQuery });
  }, [loadContracts, refreshTrigger, debouncedSearchQuery]);

  useEffect(() => {
    const hasPendingContracts = contracts.some(
      (contract) =>
        contract.status === "PROCESSING" || contract.status === "UPLOADED",
    );

    if (!hasPendingContracts) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadContracts({
        silent: true,
        search: debouncedSearchQuery,
      });
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [contracts, loadContracts, debouncedSearchQuery]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteContract(id);
      if (result.success) {
        setContracts(contracts.filter((c) => c.id !== id));
        toast.success("Contract deleted successfully");
        emitNotificationRefresh();
      } else {
        toast.error(result.error || "Failed to delete contract");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const requestDeleteContract = (contract: Contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContract = async () => {
    if (!contractToDelete) return;
    await handleDelete(contractToDelete.id);
    setDeleteDialogOpen(false);
    setContractToDelete(null);
  };

  const handleAnalyze = async (id: string) => {
    const selected = contracts.find((contract) => contract.id === id);
    setAnalyzingId(id);
    setIsAnalyzing(true);
    try {
      const result = await analyzeContractAction(id);
      if (result.success) {
        // Reload contracts to get all AI analysis data
        await loadContracts();
        toast.success("Contract analyzed successfully!");
        emitNotificationRefresh();
      } else {
        const errorCode = (result as { errorCode?: string }).errorCode;
        if (errorCode === "INVALID_CONTRACT") {
          const reason =
            result.error ||
            "This uploaded file is not recognized as a valid contract.";
          setInvalidContractReason(reason);
          setInvalidContractFileName(selected?.fileName || "Unknown file");
          setInvalidContractDialogOpen(true);
          toast.error("Invalid contract file detected");
        } else {
          toast.error(result.error || "Failed to analyze contract");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setAnalyzingId(null);
      setIsAnalyzing(false);
    }
  };

  const handleOpenDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsOpen(true);
  };

  const handleOpenAsk = (contract: Contract) => {
    setChatContract(contract);
    setAskOpen(true);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "🖼️";
    }
    if (mimeType === "application/pdf") {
      return "📄";
    }
    return "📋";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
      case "PROCESSING":
        return "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30";
      case "UPLOADED":
        return "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30";
      case "FAILED":
        return "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30";
      default:
        return "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Loading contracts...</span>
        </div>
      </Card>
    );
  }

  if (contracts.length === 0 && !debouncedSearchQuery) {
    return null;
  }

  return (
    <>
      {invalidContractReason && (
        <Card className="mb-4 border border-destructive/30 bg-destructive/5">
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Invalid contract upload detected
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {invalidContractFileName
                    ? `${invalidContractFileName}: `
                    : ""}
                  {invalidContractReason}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setInvalidContractReason("");
                setInvalidContractFileName("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by contract title or provider..."
            className="pl-9"
          />
        </div>
        {debouncedSearchQuery && (
          <p className="text-xs text-muted-foreground">
            Showing results for: "{debouncedSearchQuery}"
          </p>
        )}
      </div>

      <Card className="border-border/50 overflow-hidden">
        <div className="divide-y divide-border/50">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-4 md:p-6 hover:bg-primary/2 dark:hover:bg-primary/5 transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
                <div className="text-2xl flex-shrink-0">
                  {getFileIcon(contract.mimeType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground truncate">
                      {contract.fileName}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(contract.status)}`}
                    >
                      {contract.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>{formatFileSize(contract.fileSize)}</span>
                    <span>•</span>
                    <span>{formatDate(contract.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                  title="View contract"
                  onClick={() => {
                    if (contract.fileUrl) {
                      window.open(contract.fileUrl, "_blank");
                    }
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                  title="Download contract"
                  onClick={() => {
                    if (contract.fileUrl) {
                      const downloadUrl = contract.fileUrl + "?download=1";

                      const link = document.createElement("a");
                      link.href = downloadUrl;
                      link.download =
                        contract.fileUrl.split("/").pop() || "contract";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10"
                  title="Analyze with AI"
                  disabled={analyzingId === contract.id}
                  onClick={() => handleAnalyze(contract.id)}
                >
                  {analyzingId === contract.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleOpenAsk(contract)}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask about this file
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenDetails(contract)}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => requestDeleteContract(contract)}
                      disabled={deletingId === contract.id}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      {deletingId === contract.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {contracts.length === 0 && debouncedSearchQuery && (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-foreground">
                No contracts found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try different keywords from the title or provider name.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.14),transparent_38%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.12),transparent_42%)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Details
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6 py-4">
              <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-background/40 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5 md:p-6 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Document Profile
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-foreground">
                      {selectedContract.fileName}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(selectedContract.status)}`}
                  >
                    {selectedContract.status}
                  </span>
                </div>

                <div className="mt-5 grid auto-rows-fr gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="min-h-[94px] rounded-xl border border-border/30 bg-muted/20 px-3 py-2 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      File Size
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatFileSize(selectedContract.fileSize)}
                    </p>
                  </div>
                  <div className="min-h-[94px] rounded-xl border border-border/30 bg-muted/20 px-3 py-2 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Mime Type
                    </p>
                    <p className="mt-1 font-medium text-foreground truncate">
                      {selectedContract.mimeType}
                    </p>
                  </div>
                  <div className="min-h-[94px] rounded-xl border border-border/30 bg-muted/20 px-3 py-2 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Uploaded
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatDate(selectedContract.createdAt)}
                    </p>
                  </div>
                  <div className="min-h-[94px] rounded-xl border border-border/30 bg-muted/20 px-3 py-2 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Category
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedContract.type || "Pending analysis"}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Analysis Results */}
              {selectedContract.status === "COMPLETED" && (
                <>
                  <div className="space-y-4 rounded-3xl border border-border/60 bg-background/85 p-5 shadow-sm backdrop-blur-sm md:p-6">
                    <h3 className="text-base font-semibold text-foreground">
                      Extracted Contract Information
                    </h3>
                    <div className="grid auto-rows-fr gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Title
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof("title", "Title")
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show title proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {selectedContract.title || "N/A"}
                        </p>
                      </div>
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Provider
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof("provider", "Provider")
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show provider proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {selectedContract.provider || "N/A"}
                        </p>
                      </div>
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Policy Number
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof(
                                "policyNumber",
                                "Policy Number",
                              )
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show policy number proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {selectedContract.policyNumber || "N/A"}
                        </p>
                      </div>
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Start Date
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof("startDate", "Start Date")
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show start date proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {selectedContract.startDate
                            ? formatDate(selectedContract.startDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            End Date
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof("endDate", "End Date")
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show end date proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {selectedContract.endDate
                            ? formatDate(selectedContract.endDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex min-h-[120px] flex-col rounded-2xl border border-border/30 bg-muted/20 px-3 py-3 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            Premium
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenFieldProof("premium", "Premium")
                            }
                            className="rounded-lg border border-transparent p-1 text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                            aria-label="Show premium proof"
                            title="Show proof"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[62px] rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-3 py-2 font-medium text-foreground whitespace-pre-wrap break-words shadow-inner">
                          {formatPremiumWithSourceCurrency(selectedContract)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedContract.summary && (
                    <div className="space-y-2 rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
                      <h3 className="text-base font-semibold text-foreground">
                        Summary
                      </h3>
                      <div className="space-y-2 rounded-xl border border-border/50 bg-muted/20 p-3 text-sm whitespace-pre-wrap break-words">
                        {renderRichParagraphs(
                          selectedContract.summary,
                          `summary-${selectedContract.id}`,
                        )}
                      </div>
                    </div>
                  )}

                  {selectedContract.keyPoints && (
                    <div className="space-y-2 rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
                      <h3 className="text-base font-semibold text-foreground">
                        Key Points
                      </h3>
                      <div className="space-y-3 text-sm">
                        {(selectedContract.keyPoints as any)?.guarantees &&
                          Array.isArray(
                            (selectedContract.keyPoints as any).guarantees,
                          ) && (
                            <div>
                              <p className="text-muted-foreground font-medium">
                                Guarantees:
                              </p>
                              <ul className="ml-1 space-y-2">
                                {(
                                  (selectedContract.keyPoints as any)
                                    .guarantees as string[]
                                ).map((guarantee: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                                  >
                                    {renderRichParagraphs(
                                      guarantee,
                                      `guarantee-${selectedContract.id}-${idx}`,
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {(selectedContract.keyPoints as any)?.exclusions &&
                          Array.isArray(
                            (selectedContract.keyPoints as any).exclusions,
                          ) && (
                            <div>
                              <p className="text-muted-foreground font-medium">
                                Exclusions:
                              </p>
                              <ul className="ml-1 space-y-2">
                                {(
                                  (selectedContract.keyPoints as any)
                                    .exclusions as string[]
                                ).map((exclusion: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                                  >
                                    {renderRichParagraphs(
                                      exclusion,
                                      `exclusion-${selectedContract.id}-${idx}`,
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {(selectedContract.keyPoints as any)?.franchise && (
                          <div>
                            <p className="text-muted-foreground font-medium">
                              Deductible:
                            </p>
                            <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 whitespace-pre-wrap break-words">
                              {renderRichParagraphs(
                                String(
                                  (selectedContract.keyPoints as any).franchise,
                                ),
                                `franchise-${selectedContract.id}`,
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedContract.status === "PROCESSING" && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-200/40 bg-blue-50/60 p-4 dark:border-blue-800/40 dark:bg-blue-950/30">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    AI analysis is in progress...
                  </p>
                </div>
              )}

              {selectedContract.status === "UPLOADED" && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200/40 bg-amber-50/60 p-4 dark:border-amber-800/40 dark:bg-amber-950/30">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Click the Sparkles button to analyze this contract
                  </p>
                </div>
              )}

              {selectedContract.status === "FAILED" && (
                <div className="space-y-2 rounded-xl border border-red-200/40 bg-red-50/60 p-4 dark:border-red-800/40 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                    Analysis failed
                  </p>
                  <p className="text-sm text-red-700/90 dark:text-red-300/90 leading-relaxed">
                    {selectedContract.summary ||
                      "The uploaded file could not be processed as a valid contract. Please upload a clearer contract document and try again."}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ContractProofModal
        isOpen={proofModalOpen}
        onOpenChange={setProofModalOpen}
        proofData={proofData}
      />

      <ContractChatModal
        isOpen={askOpen}
        onOpenChange={setAskOpen}
        contract={chatContract}
        renderRichParagraphs={renderRichParagraphs}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this contract?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the selected contract and its
              associated file.
              {contractToDelete ? `\n\nFile: ${contractToDelete.fileName}` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setContractToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void confirmDeleteContract()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {contractToDelete && deletingId === contractToDelete.id
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={invalidContractDialogOpen}
        onOpenChange={setInvalidContractDialogOpen}
      >
        <DialogContent className="max-w-md border-border/70">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Invalid Contract File
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The AI could not validate this file as a real contract.
            </p>
            <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-3">
              <p className="text-xs font-semibold text-foreground">Reason</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {invalidContractReason ||
                  "This uploaded file does not appear to be a valid contract."}
              </p>
            </div>
            {invalidContractFileName && (
              <p className="text-xs text-muted-foreground">
                File:{" "}
                <span className="font-medium text-foreground">
                  {invalidContractFileName}
                </span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Please upload a contract or policy document with readable legal
              terms and agreement details.
            </p>
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              onClick={() => setInvalidContractDialogOpen(false)}
              className="rounded-xl"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="mx-4 max-w-md rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.22),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.16),transparent_45%),hsl(var(--background))] p-8 shadow-2xl md:p-10 zoom-in-95 animate-in duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Glow Effect */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-br from-primary to-accent p-4">
                  <Sparkles className="h-8 w-8 animate-pulse text-white" />
                </div>
              </div>

              {/* Spinner */}
              <div className="relative">
                <Loader2 className="h-11 w-11 animate-spin text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Analyzing Contract
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is carefully reviewing your document...
                </p>
              </div>

              {/* Progress Section */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Processing</span>
                  <span className="flex items-center gap-1.5">
                    {/* Use inline styles for delays if they aren't in your config */}
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                  </span>
                </div>

                {/* Moving Progress Bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-accent animate-progress-loading origin-left"></div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">
                This may take up to 10 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
