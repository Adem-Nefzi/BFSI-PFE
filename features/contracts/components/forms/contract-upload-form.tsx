"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import {
  AlertCircle,
  Sparkles,
  Wand2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { saveContract } from "@/features/contracts/api/contract.action";
import { toast } from "sonner";
import type { OurFileRouter } from "@/lib/upload";
import { useRouter } from "next/navigation";

export function ContractUploadForm({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) {
  const router = useRouter();
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);

  const emitNotificationRefresh = () => {
    window.dispatchEvent(new Event("notifications:refresh"));
    const channel = new BroadcastChannel("notifications-channel");
    channel.postMessage({ type: "notifications:refresh" });
    channel.close();
  };

  return (
    <Card className="relative overflow-hidden border border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.1),transparent_42%)] p-0">
      <div className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 480 220"
          fill="none"
          aria-hidden="true"
          className="absolute -right-8 top-0 h-40 w-80 opacity-45"
        >
          <path
            d="M8 176C76 140 114 68 198 68C260 68 286 116 346 116C394 116 430 88 474 74"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 204C72 174 122 146 186 146C250 146 294 178 350 178C400 178 434 162 474 146"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Ready Intake
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              Upload contracts for structured extraction
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Clean intake pipeline for contract parsing, validation, and
              analysis.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Theme-aware secure upload
          </div>
        </div>

        <UploadDropzone<OurFileRouter, "contractUploader">
          endpoint="contractUploader"
          onClientUploadComplete={async (res) => {
            if (!res || res.length === 0) {
              toast.error("Upload failed");
              return;
            }

            const file = res[0];
            setIsAutoAnalyzing(true);

            try {
              // Save to database
              const result = await saveContract({
                fileName: file.name,
                fileUrl: file.url,
                fileSize: file.size,
                mimeType: file.type,
              });

              if (result.success) {
                if (
                  (result as { analysisSuccess?: boolean }).analysisSuccess ===
                  false
                ) {
                  toast.warning(
                    (result as { analysisError?: string }).analysisError ||
                      "Contract uploaded, but analysis failed.",
                  );
                } else {
                  toast.success("Contract uploaded and analyzed successfully!");
                }

                emitNotificationRefresh();
                onUploadSuccess();
                router.refresh();
              } else {
                const fallbackError =
                  "error" in result ? result.error : "Failed to save contract";
                toast.error(fallbackError);
              }
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Unexpected error during analysis",
              );
            } finally {
              setIsAutoAnalyzing(false);
            }
          }}
          onUploadError={(error: Error) => {
            setIsAutoAnalyzing(false);
            toast.error(`Upload failed: ${error.message}`);
          }}
          appearance={{
            container:
              "w-full cursor-pointer rounded-2xl border border-dashed border-primary/35 bg-background/85 px-4 py-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/55 hover:bg-background ut-uploading:cursor-not-allowed",
            button:
              "bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:from-primary/90 hover:to-accent/90 ut-uploading:cursor-not-allowed",
            label: "text-base md:text-lg text-foreground font-semibold",
            uploadIcon: "w-11 h-11 text-primary",
            allowedContent: "mt-2 text-sm text-muted-foreground",
          }}
          content={{
            label: "Upload Your Contract",
            allowedContent: "PDF, JPG, PNG, WEBP up to 8MB",
          }}
        />

        <div className="mt-6 grid gap-3 border-t border-border/50 pt-5 sm:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Formats</div>
            <div>PDF, JPG, PNG, WEBP</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">Max Size</div>
            <div>8 MB</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2 text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <div>
              <div className="mb-1 font-semibold text-foreground">AI Flow</div>
              <div>Upload starts instant AI analysis + RAG indexing</div>
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <Wand2 className="h-3.5 w-3.5 text-secondary" />
          Extraction quality improves as more contracts are analyzed.
        </div>
      </div>

      {isAutoAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="mx-4 max-w-md rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.22),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.16),transparent_45%),hsl(var(--background))] p-8 shadow-2xl md:p-10 zoom-in-95 animate-in duration-300">
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
                  Analyzing And Building RAG
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your contract is being analyzed and indexed for chat...
                </p>
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Processing</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                  </span>
                </div>

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
    </Card>
  );
}
