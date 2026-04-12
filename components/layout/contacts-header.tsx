"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  FileText,
  Network,
} from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function ContractsHeader() {
  return (
    <div className="relative w-full overflow-hidden border-b border-border/40 bg-background/80 pt-8 pb-10 md:pt-10 md:pb-12 backdrop-blur-sm">
      {/* Background Beams - Opacity bumped slightly for better visibility */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams className="opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left Column: Typography & Badges */}
          <div className="flex-1 space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>

            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Contracts{" "}
                <span className="bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Manager
                </span>
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                Upload, review, and analyze your financial contracts with speed,
                transparency, and cryptographic security.
              </p>
            </div>

            {/* Glassmorphic Badges - Sized up slightly from the compact version */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary backdrop-blur-md transition-all hover:bg-primary/10 cursor-default">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </div>

              <div className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-md transition-all hover:bg-emerald-500/10 cursor-default">
                <ShieldCheck className="h-4 w-4" />
                Bank-Grade
              </div>
            </div>
          </div>

          {/* Right Column: Medium-Sized Graphic */}
          <div className="hidden md:block animate-in zoom-in-95 fade-in duration-1000 delay-150 relative h-40 w-64 shrink-0">
            {/* Glowing backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

            {/* Floating Medium Glass Cards */}
            <div className="absolute left-2 top-2 flex h-20 w-32 flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/50 transform -rotate-6 animate-[bounce_5s_infinite_ease-in-out]">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1.5">
                <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-1 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="absolute right-2 bottom-2 flex h-20 w-32 flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/50 transform rotate-6 animate-[bounce_6s_infinite_ease-in-out_reverse]">
              <Network className="h-5 w-5 text-primary" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <div className="h-1 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
