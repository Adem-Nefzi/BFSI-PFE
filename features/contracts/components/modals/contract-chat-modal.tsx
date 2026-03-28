"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Briefcase, Scale, Bot, User, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askContractQuestionAction } from "@/features/contracts/api/contract.action";

interface Contract {
  id: string;
  fileName: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ContractChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  renderRichParagraphs: (text: string, prefix: string) => React.ReactNode[];
}

export function ContractChatModal({
  isOpen,
  onOpenChange,
  contract,
  renderRichParagraphs,
}: ContractChatModalProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me anything about this contract. I will answer based on the file analysis.",
    },
  ]);

  const quickQuestions = [
    "What are the main obligations and deadlines?",
    "What are the non-compliance risks under general EU/US principles?",
    "What are the most important exclusions and liabilities?",
  ];

  const handleAskQuestion = async () => {
    if (!contract) return;

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmedQuestion }]);
    setQuestion("");
    setIsAsking(true);

    try {
      const result = await askContractQuestionAction(contract.id, trimmedQuestion);

      if (result.success && result.answer) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.answer as string }]);
      } else {
        const errorMessage = result.error || "Failed to get AI response";
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${errorMessage}` }]);
      }
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${fallbackMessage}` }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/60 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.12),transparent_45%)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ask About This File
          </DialogTitle>
        </DialogHeader>

        {contract && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-background/40 p-4 shadow-xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5 transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Contract Intelligence Assistant
                  </p>
                  <p className="text-sm font-medium truncate mt-1">{contract.fileName}</p>
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

            <div className="h-80 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/5 dark:bg-white/5 p-4 shadow-inner backdrop-blur-md">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex max-w-[88%] items-start gap-2">
                    {message.role === "assistant" && (
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
                        <Bot className="h-4 w-4" />
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words shadow-sm transition-all duration-300 hover:shadow-md ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-primary/25"
                          : "border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
                      }`}
                    >
                      {message.role === "assistant"
                        ? renderRichParagraphs(message.content, `chat-assistant-${index}`)
                        : message.content}
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
                className="rounded-2xl border-white/20 dark:border-white/10 bg-background/50 backdrop-blur-md focus:bg-background/80 transition-all duration-300 shadow-inner"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !isAsking && question.trim()) {
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
  );
}
