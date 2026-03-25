"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "@/lib/actions/contract.action";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const quickQuestions = [
    "What are the main obligations and deadlines?",
    "What are the non-compliance risks under general EU/US principles?",
    "What are the most important exclusions and liabilities?",
  ];

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
    setMessages([
      {
        role: "assistant",
        content:
          "Ask me anything about this contract. I will answer based on the file analysis.",
      },
    ]);
    setQuestion("");
    setAskOpen(true);
  };

  const handleAskQuestion = async () => {
    if (!chatContract) return;

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");
    setIsAsking(true);

    try {
      const result = await askContractQuestionAction(
        chatContract.id,
        trimmedQuestion,
      );

      if (result.success && result.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.answer as string },
        ]);
      } else {
        const errorMessage = result.error || "Failed to get AI response";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMessage}` },
        ]);
      }
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${fallbackMessage}` },
      ]);
    } finally {
      setIsAsking(false);
    }
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.1),transparent_42%)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Details
            </DialogTitle>
            <DialogClose />
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6 py-4">
              <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
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

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      File Size
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatFileSize(selectedContract.fileSize)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Mime Type
                    </p>
                    <p className="mt-1 font-medium text-foreground truncate">
                      {selectedContract.mimeType}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Uploaded
                    </p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatDate(selectedContract.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
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
                  <div className="space-y-3 rounded-2xl border border-border/60 bg-background/75 p-4">
                    <h3 className="text-base font-semibold text-foreground">
                      Extracted Contract Information
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Title
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.title || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Provider
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.provider || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Policy Number
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.policyNumber || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Start Date
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.startDate
                            ? formatDate(selectedContract.startDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          End Date
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.endDate
                            ? formatDate(selectedContract.endDate)
                            : "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Premium
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {selectedContract.premium
                            ? `€${selectedContract.premium.toFixed(2)}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedContract.summary && (
                    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/75 p-4">
                      <h3 className="text-base font-semibold text-foreground">
                        Summary
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedContract.summary}
                      </p>
                    </div>
                  )}

                  {selectedContract.keyPoints && (
                    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/75 p-4">
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
                              <ul className="list-disc list-inside ml-2 space-y-1">
                                {(
                                  (selectedContract.keyPoints as any)
                                    .guarantees as string[]
                                ).map((guarantee: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="text-muted-foreground"
                                  >
                                    {guarantee}
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
                              <ul className="list-disc list-inside ml-2 space-y-1">
                                {(
                                  (selectedContract.keyPoints as any)
                                    .exclusions as string[]
                                ).map((exclusion: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="text-muted-foreground"
                                  >
                                    {exclusion}
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
                            <p className="text-muted-foreground">
                              {String(
                                (selectedContract.keyPoints as any).franchise,
                              )}
                            </p>
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

      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.12),transparent_45%)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask About This File
            </DialogTitle>
          </DialogHeader>

          {chatContract && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Contract Intelligence Assistant
                    </p>
                    <p className="text-sm font-medium truncate mt-1">
                      {chatContract.fileName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-2 py-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      Business
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-2 py-1">
                      <Scale className="w-3.5 h-3.5" />
                      Legal Context
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Quick prompts</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((quickQuestion) => (
                    <Button
                      key={quickQuestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isAsking}
                      onClick={() => setQuestion(quickQuestion)}
                      className="border-primary/25 bg-background/80 text-xs hover:border-primary/50 hover:bg-primary/10"
                    >
                      {quickQuestion}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="h-80 space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/65 p-4 shadow-inner backdrop-blur-sm">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex max-w-[88%] items-start gap-2">
                      {message.role === "assistant" && (
                        <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
                          <Bot className="h-4 w-4" />
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                            : "border border-border/70 bg-background"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm shadow-sm">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground">
                        <Bot className="h-3.5 w-3.5" />
                      </span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing a professional legal-business answer...
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask about obligations, liabilities, legal exposure, compliance risks, or business impact..."
                  rows={3}
                  disabled={isAsking}
                  className="rounded-2xl border-border/70 bg-background/80"
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !isAsking &&
                      question.trim()
                    ) {
                      event.preventDefault();
                      void handleAskQuestion();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAskQuestion}
                    disabled={isAsking || !question.trim()}
                    className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-md hover:from-primary/90 hover:to-accent/90"
                  >
                    {isAsking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Tip: press Enter to send, Shift+Enter for a new line.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm duration-200">
          <div className="mx-4 max-w-md rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.22),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.16),transparent_45%),hsl(var(--background))] p-8 shadow-2xl md:p-10">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-br from-primary to-accent p-4">
                  <Sparkles className="h-8 w-8 animate-pulse text-white" />
                </div>
              </div>

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

              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Processing</span>
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse delay-75">●</span>
                    <span className="animate-pulse delay-150">●</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-primary to-accent"></div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This may take up to 10 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
