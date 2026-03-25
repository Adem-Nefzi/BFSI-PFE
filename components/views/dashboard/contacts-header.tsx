"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function ContactsHeader() {
  return (
    <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <BackgroundBeams className="opacity-70" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Contracts Manager
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Upload, review, and analyze your financial contracts with a focused
            workspace built for speed and clarity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            AI-powered review
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            Compliance-focused workflow
          </div>
        </div>
      </div>
    </div>
  );
}
