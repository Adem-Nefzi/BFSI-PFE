"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/views/Home/Navbar";
import { Hero } from "@/components/views/Home/Hero";
import { Features } from "@/components/views/Home/Features";
import { HowItWorks } from "@/components/views/Home/HowItWorks";
import { Stats } from "@/components/views/Home/Stats";
import { CTA } from "@/components/views/Home/CTA";
import { Footer } from "@/components/views/Home/Footer";
import { Sparkles } from "lucide-react";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
        <Sparkles
          className="w-16 h-16 text-blue-500 relative z-10"
          style={{ animation: "spin-slow 3s linear infinite" }}
        />
      </div>

      <h1 className="text-2xl font-bold gradient-text mb-8">
        Smart-Admin Copilot
      </h1>

      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500 rounded-full transition-all duration-200"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Loading amazing experience...
      </p>
    </div>
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgressBar />

      <Navbar />

      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
        <Footer />
      </main>

      <BackToTop />
    </div>
  );
}
