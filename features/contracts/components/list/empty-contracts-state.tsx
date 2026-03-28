"use client";

import { FileText, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyContractsState() {
  return (
    <Card className="border-dashed border-border hover:border-primary/50 transition-colors duration-300">
      <div className="p-12 md:p-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
          <div className="relative p-4 bg-background dark:bg-card rounded-full border border-border/50">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No contracts yet
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            Upload your first contract to get started.
          </p>
          <p className="text-xs text-muted-foreground">
            Our AI will automatically analyze and extract key information from
            your documents.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full text-center text-xs">
          <div className="p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <FileText className="w-5 h-5 mx-auto mb-2 text-primary" />
            <span className="text-muted-foreground">Fast Upload</span>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/20">
            <FileText className="w-5 h-5 mx-auto mb-2 text-accent" />
            <span className="text-muted-foreground">AI Analysis</span>
          </div>
          <div className="p-3 rounded-lg bg-secondary/5 dark:bg-secondary/10 border border-secondary/20">
            <FileText className="w-5 h-5 mx-auto mb-2 text-secondary" />
            <span className="text-muted-foreground">Blockchain</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
