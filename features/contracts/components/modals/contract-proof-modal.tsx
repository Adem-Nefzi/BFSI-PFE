import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface ProofData {
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
}

interface ContractProofModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  proofData: ProofData | null;
}

export function ContractProofModal({
  isOpen,
  onOpenChange,
  proofData,
}: ContractProofModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_38%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.12),transparent_42%)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Field Proof
          </DialogTitle>
        </DialogHeader>

        {proofData && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-background/40 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5 md:p-6 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <div className="grid auto-rows-fr gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-xl border border-primary/25 bg-primary/10 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-primary/80">
                    Field
                  </p>
                  <p className="mt-1 text-xs font-semibold text-primary truncate">
                    {proofData.field}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Line
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {proofData.lineNumber ?? "Not found"}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Page
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground truncate">
                    {proofData.page ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Section
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground truncate">
                    {proofData.section ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 px-2.5 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    {proofData.confidence ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-background/40 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5 md:p-6 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Exact Source Snippet
              </p>
              <div className="mt-2 min-h-[92px] rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-sm italic text-muted-foreground whitespace-pre-wrap break-words">
                “{proofData.sourceSnippet}”
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-background/40 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5 md:p-6 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Contract Lines Context
                </p>
                <span
                  className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
                    proofData.context.length > 0 && proofData.lineNumber
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {proofData.context.length > 0 && proofData.lineNumber
                    ? "Resolved from extracted text"
                    : "Fallback snippet evidence"}
                </span>
              </div>

              {proofData.context.length > 0 && proofData.contextStartLine ? (
                <div className="mt-2 h-[320px] overflow-auto rounded-xl border border-border/60 bg-muted/20">
                  <pre className="p-3 text-xs leading-6 text-muted-foreground whitespace-pre-wrap break-words">
                    {proofData.context.map((line, idx) => {
                      const currentLineNumber =
                        proofData.contextStartLine! + idx;
                      const isMatch =
                        proofData.lineNumber === currentLineNumber;
                      return (
                        <span
                          key={idx}
                          className={
                            isMatch ? "font-bold text-primary block" : "block"
                          }
                        >
                          {String(currentLineNumber).padStart(4, " ")} | {line}
                        </span>
                      );
                    })}
                  </pre>
                </div>
              ) : (
                <div className="mt-2 h-[320px] rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                  <p>
                    Precise line mapping is unavailable for this field. The
                    quoted snippet remains the verified AI evidence.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/80">
                    This usually happens when OCR compressed multiple lines,
                    formatting changed, or the source value appears in a
                    table-like structure.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
