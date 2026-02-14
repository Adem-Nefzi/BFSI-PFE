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
      setCount(Math.floor(end * easeOut));

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
      className="relative group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease-out ${delay}s`,
      }}
    >
      <div className="relative glass rounded-3xl p-8 hover-lift overflow-hidden">
        {/* Background Icon */}
        <div className="absolute top-4 right-4 opacity-10">
          <Icon className="w-24 h-24 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`inline-flex p-3 rounded-2xl ${gradient} mb-6 shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Value */}
          <div ref={countRef} className="mb-2">
            {isText ? (
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-wider">
                {value}
              </span>
            ) : (
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white">
                {prefix}
                {numericValue !== undefined ? count : value}
                {suffix}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-lg md:text-xl font-medium text-white/90 mb-2">
            {label}
          </p>

          {/* Additional Info */}
          {additional && (
            <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/70">{additional}</span>
            </div>
          )}
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute -inset-px ${gradient} opacity-0 group-hover:opacity-30 rounded-3xl blur-xl transition-opacity duration-500`}
        />
      </div>
    </div>
  );
}

// Floating Badge Component
function FloatingBadge({
  text,
  icon: Icon,
  delay,
  position,
}: {
  text: string;
  icon: React.ElementType;
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className="absolute glass rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg"
      style={{
        ...position,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.5s ease-out ${delay}s`,
        animationName: isVisible ? "float" : "none",
        animationDuration: isVisible ? "4s" : undefined,
        animationTimingFunction: isVisible ? "ease-in-out" : undefined,
        animationIterationCount: isVisible ? "infinite" : undefined,
        animationFillMode: "forwards",
        animationDelay: isVisible ? `${delay}s` : undefined,
      }}
    >
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-xs font-medium text-white">{text}</span>
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
    additional?: string;
    isText?: boolean;
  }

  const stats: StatItem[] = [
    {
      value: "99.9",
      numericValue: 99,
      suffix: "%",
      label: "OCR + AI Accuracy",
      icon: Target,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      additional: "+0.3% this month",
    },
    {
      value: "< 3",
      label: "Average AI Response Time",
      icon: Zap,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      additional: "Lightning fast",
      isText: true,
    },
    {
      value: "100",
      numericValue: 100,
      suffix: "%",
      label: "Blockchain Verified",
      icon: Shield,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      additional: "All documents certified",
    },
    {
      value: "GDPR",
      label: "Full European Compliance",
      icon: Lock,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      additional: "ISO 27001 Certified",
      isText: true,
    },
  ];

  const floatingBadges = [
    {
      text: "+1 Verified",
      icon: Check,
      position: { top: "10%", left: "5%" },
      delay: 0.8,
    },
    {
      text: "99.9% Uptime",
      icon: Shield,
      position: { top: "20%", right: "8%" },
      delay: 1,
    },
    {
      text: "AI Powered",
      icon: Zap,
      position: { bottom: "15%", left: "10%" },
      delay: 1.2,
    },
    {
      text: "Secure",
      icon: Lock,
      position: { bottom: "25%", right: "5%" },
      delay: 1.4,
    },
  ];

  return (
    <section
      id="stats"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-teal-600">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      </div>

      {/* Floating Badges */}
      {floatingBadges.map((badge, i) => (
        <FloatingBadge
          key={i}
          text={badge.text}
          icon={badge.icon}
          delay={badge.delay}
          position={badge.position}
        />
      ))}

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <span className="inline-block text-sm uppercase tracking-widest text-white/70 mb-4">
            By The Numbers
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Results That{" "}
            <span className="relative">
              Speak
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
              delay={index * 0.1}
              additional={stat.additional}
              isText={stat.isText}
            />
          ))}
        </div>

        {/* Bottom Awards Row */}
        <div
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out 0.5s",
          }}
        >
          {[
            { icon: Award, text: "Best AI Solution 2024" },
            { icon: Shield, text: "SOC 2 Type II Certified" },
            { icon: Lock, text: "GDPR Compliant" },
            { icon: Check, text: "ISO 27001 Certified" },
          ].map((award, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <award.icon className="w-4 h-4 text-white/80" />
              <span className="text-sm font-medium text-white/90">
                {award.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
