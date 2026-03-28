"use client";

import { useEffect, useState, useRef } from "react";
import {
  Target,
  Zap,
  Shield,
  Lock,
  TrendingUp,
  Award,
  Check,
} from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Spotlight } from "@/components/ui/spotlight-new";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Count Up Hook
function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nextValue = end * easeOut;
      const formattedValue = Number.isInteger(end)
        ? Math.floor(nextValue)
        : Number(nextValue.toFixed(1));
      setCount(formattedValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Stat Card Component
interface StatCardProps {
  value: string;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
  className?: string;
  cardColor?: string;
  glowColor?: string;
  spotlight?: {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    duration?: number;
    xOffset?: number;
  };
  delay: number;
  additional?: string;
  isText?: boolean;
}

function StatCard({
  value,
  numericValue,
  suffix = "",
  prefix = "",
  label,
  icon: Icon,
  gradient,
  className,
  cardColor,
  glowColor,
  spotlight,
  delay,
  additional,
  isText = false,
}: StatCardProps) {
  const { ref: scrollRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });
  const { count, ref: countRef } = useCountUp(numericValue || 0, 2000);

  return (
    <div
      ref={scrollRef}
      className={`relative ${className || ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease-out ${delay}s`,
      }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-2xl border border-border/60 p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur group ${cardColor || "bg-card/80"}`}
      >
        {/* Glowing Effect */}
        <GlowingEffect
          disabled={false}
          blur={40}
          spread={60}
          proximity={80}
          variant="default"
          borderWidth={2}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="absolute inset-0">
          <Spotlight
            gradientFirst={spotlight?.gradientFirst}
            gradientSecond={spotlight?.gradientSecond}
            gradientThird={spotlight?.gradientThird}
            duration={spotlight?.duration ?? 8}
            xOffset={spotlight?.xOffset ?? 120}
          />
        </div>

        {/* Hover Glow */}
        {glowColor && (
          <div
            className={`absolute -inset-1 ${glowColor} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-2xl`}
          />
        )}

        {/* Background Icon */}
        <div className="absolute -top-6 -right-6 opacity-10">
          <Icon className="w-28 h-28 text-foreground" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            {/* Icon */}
            <div
              className={`inline-flex items-center gap-2 rounded-full ${gradient} px-4 py-2 text-foreground shadow-lg`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-widest uppercase text-foreground/80">
                Performance
              </span>
            </div>

            {/* Value */}
            <div ref={countRef} className="mt-6">
              {isText ? (
                <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight">
                  {value}
                </span>
              ) : (
                <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight">
                  {prefix}
                  {numericValue !== undefined && !Number.isInteger(numericValue)
                    ? count.toFixed(1)
                    : numericValue !== undefined
                      ? count
                      : value}
                  {suffix}
                </span>
              )}
            </div>

            {/* Label */}
            <p className="mt-4 text-base md:text-lg font-medium text-foreground/90">
              {label}
            </p>
          </div>

          {/* Additional Info */}
          {additional && (
            <div className="flex items-center gap-2 pt-6">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">
                {additional}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Stats() {
  const { ref: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();

  interface StatItem {
    value: string;
    numericValue?: number;
    suffix?: string;
    prefix?: string;
    label: string;
    icon: React.ElementType;
    gradient: string;
    className?: string;
    cardColor?: string;
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

  const stats: StatItem[] = [
    {
      value: "99.9",
      numericValue: 99.9,
      suffix: "%",
      label: "OCR + AI Accuracy",
      icon: Target,
      gradient: "bg-gradient-to-r from-blue-500 to-indigo-600",
      cardColor:
        "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30",
      glowColor: "bg-blue-500",
      className: "md:col-span-2",
      spotlight: {
        gradientFirst:
          "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(217, 91%, 60%, .28) 0, hsla(217, 91%, 60%, .12) 55%, hsla(217, 91%, 60%, 0) 80%)",
        gradientSecond:
          "radial-gradient(50% 50% at 50% 50%, hsla(258, 90%, 66%, .24) 0, hsla(258, 90%, 66%, .08) 80%, transparent 100%)",
        gradientThird:
          "radial-gradient(50% 50% at 50% 50%, hsla(217, 91%, 60%, .18) 0, hsla(217, 91%, 60%, .06) 80%, transparent 100%)",
      },
      additional: "+0.3% this month",
    },
    {
      value: "< 3",
      label: "Average AI Response Time",
      icon: Zap,
      gradient: "bg-gradient-to-r from-amber-500 to-orange-600",
      cardColor:
        "bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30",
      glowColor: "bg-amber-500",
      spotlight: {
        gradientFirst:
          "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(48, 96%, 53%, .28) 0, hsla(48, 96%, 53%, .12) 55%, hsla(48, 96%, 53%, 0) 80%)",
      },
      additional: "Average under 3 seconds",
      isText: true,
    },
    {
      value: "100",
      numericValue: 100,
      suffix: "%",
      label: "Blockchain Verified",
      icon: Shield,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-600",
      cardColor:
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30",
      glowColor: "bg-emerald-500",
      spotlight: {
        gradientFirst:
          "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(158, 64%, 52%, .28) 0, hsla(158, 64%, 52%, .12) 55%, hsla(158, 64%, 52%, 0) 80%)",
      },
      additional: "All documents certified",
    },
    {
      value: "GDPR",
      label: "Full European Compliance",
      icon: Lock,
      gradient: "bg-gradient-to-r from-violet-500 to-purple-600",
      cardColor:
        "bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/30",
      glowColor: "bg-violet-500",
      className: "md:col-span-2",
      spotlight: {
        gradientFirst:
          "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(258, 90%, 66%, .28) 0, hsla(258, 90%, 66%, .12) 55%, hsla(258, 90%, 66%, 0) 80%)",
      },
      additional: "ISO 27001 certified",
      isText: true,
    },
  ];

  return (
    <section
      id="stats"
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/40 to-background">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-15" />

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.2)_0%,transparent_55%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Platform Metrics
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Corporate-Grade Results, Measured.
          </h2>

          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent performance benchmarks that prove reliability, accuracy,
            and compliance at enterprise scale.
          </p>
        </div>

        {/* Stats Grid */}
        <BentoGrid className="max-w-6xl gap-6 md:auto-rows-[16rem]">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              numericValue={stat.numericValue}
              suffix={stat.suffix || ""}
              prefix={stat.prefix || ""}
              label={stat.label}
              icon={stat.icon}
              gradient={stat.gradient}
              className={stat.className}
              cardColor={stat.cardColor}
              glowColor={stat.glowColor}
              spotlight={stat.spotlight}
              delay={index * 0.1}
              additional={stat.additional}
              isText={stat.isText}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
