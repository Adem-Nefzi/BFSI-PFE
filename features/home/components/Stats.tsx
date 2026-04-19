"use client";

import { useEffect, useState, useRef } from "react";
import { Target, Zap, Shield, Lock, TrendingUp } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Spotlight } from "@/components/ui/spotlight-new";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ==========================================
// Hooks (Kept your optimized hook)
// ==========================================
function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted || end === 0) return;
    let startTime: number | null = null;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4); // Smoother cubic out
      const nextValue = end * easeOut;
      setCount(
        Number.isInteger(end)
          ? Math.floor(nextValue)
          : Number(nextValue.toFixed(1)),
      );
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// ==========================================
// Types
// ==========================================
interface StatItem {
  value: string;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
  className?: string;
  glowColor?: string;
  spotlight?: {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    duration?: number;
    xOffset?: number;
  };
  additional?: string;
  isText?: boolean;
}

// ==========================================
// High-Impact Stat Card
// ==========================================
function StatCard({
  value,
  numericValue,
  suffix = "",
  prefix = "",
  label,
  icon: Icon,
  gradient,
  className,
  glowColor,
  spotlight,
  delay,
  additional,
  isText = false,
}: StatItem & { delay: number }) {
  const { ref: scrollRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { count, ref: countRef } = useCountUp(numericValue || 0, 2500);

  return (
    <div
      ref={scrollRef}
      className={`relative group h-full ${className || ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.95)",
        transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {/* Outer Glow behind the card */}
      <div
        className={`absolute -inset-0.5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${gradient}`}
      />

      {/* The Card Body: 
        Gradient border wrapper + inner glassmorphism 
      */}
      <div className="relative h-full rounded-[22px] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent overflow-hidden">
        <div className="relative h-full rounded-[21px] bg-card/60 dark:bg-black/40 backdrop-blur-2xl p-8 overflow-hidden shadow-2xl flex flex-col justify-between">
          <GlowingEffect
            blur={40}
            spread={60}
            proximity={80}
            variant="default"
            borderWidth={2}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />

          <div className="absolute inset-0 pointer-events-none mix-blend-screen">
            <Spotlight
              {...spotlight}
              duration={spotlight?.duration ?? 8}
              xOffset={spotlight?.xOffset ?? 120}
            />
          </div>

          {/* Majestic Background Icon */}
          <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 transition-transform duration-1000 ease-out group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
            <Icon
              className={`w-56 h-56 ${glowColor?.replace("bg-", "text-")}`}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            <div>
              {/* Vibrant Badge */}
              <div
                className={`inline-flex items-center gap-2 rounded-full ${gradient} px-4 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.3)] ring-1 ring-white/20`}
              >
                <Icon className="w-4 h-4 text-white drop-shadow-md" />
                <span className="text-[11px] font-black tracking-widest uppercase text-white drop-shadow-md">
                  Performance
                </span>
              </div>

              {/* Massive Gradient Text */}
              <div ref={countRef} className="mt-8 mb-2">
                {isText ? (
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                    {value}
                  </span>
                ) : (
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 flex items-baseline">
                    {prefix}
                    {numericValue !== undefined &&
                    !Number.isInteger(numericValue)
                      ? count.toFixed(1)
                      : numericValue !== undefined
                        ? count
                        : value}
                    <span className="text-4xl md:text-5xl text-foreground/40 ml-1 font-semibold">
                      {suffix}
                    </span>
                  </span>
                )}
              </div>

              <p className="text-lg font-medium text-foreground/80 tracking-wide">
                {label}
              </p>
            </div>

            {/* Glowing Additional Info */}
            {additional && (
              <div className="flex items-center gap-3 pt-8 mt-auto">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
                  <TrendingUp className="w-4 h-4 text-emerald-400 relative z-10" />
                </div>
                <span className="text-sm font-semibold text-foreground/70 tracking-wide uppercase">
                  {additional}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export function Stats() {
  const { ref: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();

  const stats: StatItem[] = [
    {
      value: "99.9",
      numericValue: 99.9,
      suffix: "%",
      label: "OCR + AI Accuracy",
      icon: Target,
      gradient: "bg-gradient-to-r from-cyan-500 to-blue-600",
      glowColor: "bg-cyan-500",
      className: "md:col-span-2",
      spotlight: {
        gradientFirst:
          "radial-gradient(68% 68% at 55% 31%, hsla(217, 100%, 60%, 0.4) 0, transparent 80%)",
      },
      additional: "+0.3% this month",
    },
    {
      value: "< 10",
      label: "Avg. AI Response Time",
      icon: Zap,
      gradient: "bg-gradient-to-r from-orange-500 to-amber-600",
      glowColor: "bg-orange-500",
      isText: true,
      spotlight: {
        gradientFirst:
          "radial-gradient(68% 68% at 55% 31%, hsla(30, 100%, 60%, 0.4) 0, transparent 80%)",
      },
      additional: "Under 10 seconds",
    },
    {
      value: "100",
      numericValue: 100,
      suffix: "%",
      label: "Blockchain Verified",
      icon: Shield,
      gradient: "bg-gradient-to-r from-emerald-400 to-teal-600",
      glowColor: "bg-emerald-500",
      spotlight: {
        gradientFirst:
          "radial-gradient(68% 68% at 55% 31%, hsla(150, 100%, 50%, 0.3) 0, transparent 80%)",
      },
      additional: "All docs certified",
    },
    {
      value: "GDPR",
      label: "European Compliance",
      icon: Lock,
      gradient: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      glowColor: "bg-fuchsia-500",
      className: "md:col-span-2",
      isText: true,
      spotlight: {
        gradientFirst:
          "radial-gradient(68% 68% at 55% 31%, hsla(280, 100%, 60%, 0.4) 0, transparent 80%)",
      },
      additional: "ISO 27001 Certified",
    },
  ];

  return (
    <section
      id="stats"
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background"
    >
      {/* Massive Aurora Background Effect 
        This replaces the simple gradient with deep, colorful glowing orbs
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-40 pointer-events-none blur-[120px] rounded-full mix-blend-screen bg-gradient-to-b from-primary/60 via-indigo-500/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none blur-[150px] rounded-full mix-blend-screen bg-purple-600/40" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/aceternity/image/upload/v1705626490/grid-pattern_q5ymq0.png')] opacity-[0.05] dark:opacity-[0.1]" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center mb-24"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Glowing Pill */}
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 rounded-full blur-md bg-primary/30 animate-pulse" />
            <span className="relative inline-flex items-center gap-2 rounded-full border border-primary/50 bg-background/80 backdrop-blur-xl px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              Platform Metrics
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tighter leading-[1.1]">
            Corporate-Grade Results, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
              Quantified.
            </span>
          </h2>

          <p className="mt-8 text-xl text-foreground/60 max-w-2xl mx-auto font-medium">
            Transparent performance benchmarks proving reliability, accuracy,
            and compliance at enterprise scale.
          </p>
        </div>

        {/* Stats Grid */}
        <BentoGrid className="max-w-6xl mx-auto gap-8 md:auto-rows-[22rem]">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index * 0.15} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
