"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg-mesh opacity-40" />
      
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ready to transform your business?
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight max-w-3xl mx-auto mb-6">
            <span className="block text-slate-900 dark:text-white">
              Start Your Free Trial
            </span>
            <span className="block mt-2 gradient-text">
              No credit card required
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the power of AI-driven contract intelligence. Get instant access to all features and see why thousands of professionals trust Smart-Admin Copilot.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <button className="group relative px-8 py-4 text-base md:text-lg font-bold text-white btn-gradient rounded-2xl overflow-hidden w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </button>

            {/* Secondary CTA */}
            <button className="group flex items-center justify-center gap-2 px-8 py-4 text-base md:text-lg font-semibold text-slate-900 dark:text-white bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
              <span>Schedule Demo</span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Trusted by industry leaders
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                "🏦 Banking",
                "💰 Finance",
                "🛡️ Insurance",
                "⚖️ Legal",
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full glass"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
