"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Sparkles,
  Rocket,
  Play,
  Lock,
  Check,
  Zap,
  Link,
  FileText,
  MessageSquare,
  Shield,
  TrendingUp,
  Bell,
} from "lucide-react";

// Floating Orb Component
function FloatingOrb({
  size,
  color,
  delay,
  duration,
  left,
  top,
}: {
  size: number;
  color: string;
  delay: number;
  duration: number;
  left: string;
  top: string;
}) {
  return (
    <div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left,
        top,
        animation: `float-slow ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.4,
      }}
    />
  );
}

// Particle Component
function Particle({
  delay,
  left,
  size,
  duration,
}: {
  delay: number;
  left: string;
  size: number;
  duration: number;
}) {
  return (
    <div
      className="absolute rounded-full bg-blue-500/30 dark:bg-blue-400/30 pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        bottom: "-10px",
        animation: `particle-float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Mockup Card Component
function MockupCard({
  icon: Icon,
  title,
  value,
  trend,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: string;
  delay: number;
}) {
  return (
    <div
      className="glass rounded-xl p-4 hover-lift cursor-pointer"
      style={{
        animation: `slide-up 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {title}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          {value}
        </span>
        <span className="text-xs text-emerald-500 font-medium">{trend}</span>
      </div>
    </div>
  );
}

// Chat Message Component
function ChatMessage({
  message,
  isAI,
  delay,
}: {
  message: string;
  isAI: boolean;
  delay: number;
}) {
  return (
    <div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-3`}
      style={{
        animation: `slide-up 0.4s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          isAI
            ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm"
            : "bg-blue-600 text-white rounded-tr-sm"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export function Hero() {
  const [isLoaded] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () => [
      { left: "8%", size: 3, duration: 9 },
      { left: "18%", size: 4, duration: 10 },
      { left: "28%", size: 2, duration: 8 },
      { left: "38%", size: 5, duration: 11 },
      { left: "48%", size: 3, duration: 9 },
      { left: "58%", size: 4, duration: 10 },
      { left: "68%", size: 2, duration: 8 },
      { left: "78%", size: 5, duration: 11 },
      { left: "88%", size: 3, duration: 9 },
      { left: "12%", size: 4, duration: 10 },
      { left: "22%", size: 2, duration: 8 },
      { left: "32%", size: 5, duration: 11 },
      { left: "52%", size: 3, duration: 9 },
      { left: "72%", size: 4, duration: 10 },
      { left: "92%", size: 2, duration: 8 },
    ],
    [],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 10, y: y * 10 });
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const trustBadges = [
    { icon: Lock, label: "Bank-Level Security" },
    { icon: Check, label: "GDPR Certified" },
    { icon: Zap, label: "Real-Time AI" },
    { icon: Link, label: "Blockchain Verified" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Layer 1 - Animated Gradient Mesh */}
      <div className="absolute inset-0 gradient-bg-mesh animate-gradient-shift" />

      {/* Background Layer 2 - Grid Pattern */}
      <div
        className="absolute inset-0 grid-pattern"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />

      {/* Background Layer 3 - Floating Orbs */}
      <FloatingOrb
        size={200}
        color="rgba(59, 130, 246, 0.3)"
        delay={0}
        duration={8}
        left="10%"
        top="20%"
      />
      <FloatingOrb
        size={150}
        color="rgba(139, 92, 246, 0.3)"
        delay={2}
        duration={10}
        left="70%"
        top="15%"
      />
      <FloatingOrb
        size={180}
        color="rgba(20, 184, 166, 0.3)"
        delay={1}
        duration={9}
        left="80%"
        top="60%"
      />
      <FloatingOrb
        size={120}
        color="rgba(59, 130, 246, 0.25)"
        delay={3}
        duration={7}
        left="15%"
        top="70%"
      />
      <FloatingOrb
        size={100}
        color="rgba(139, 92, 246, 0.2)"
        delay={4}
        duration={11}
        left="50%"
        top="80%"
      />

      {/* Background Layer 4 - Spotlight Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <Particle
            key={`${particle.left}-${particle.size}-${i}`}
            delay={i * 0.5}
            left={particle.left}
            size={particle.size}
            duration={particle.duration}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Announcement Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            New: GPT-4 Turbo + Blockchain Integration
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight max-w-6xl mx-auto transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-slate-900 dark:text-white">
            Transform Your Contracts
          </span>
          <span className="block mt-2 gradient-text">
            Into Actionable Intelligence
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mt-6 text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          AI-Powered contract analysis meets blockchain verification. The only
          platform that truly understands your banking and insurance documents.
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Secure, transparent, instant.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mt-10 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Primary CTA */}
          <button className="group relative px-8 py-4 text-base md:text-lg font-bold text-white btn-gradient rounded-2xl overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
              <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 animate-shimmer opacity-30" />
          </button>

          {/* Secondary CTA */}
          <button className="group flex items-center gap-2 px-8 py-4 text-base md:text-lg font-semibold text-slate-900 dark:text-white bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="p-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            Watch Demo
          </button>
        </div>

        {/* Trust Indicators */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 mt-12 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {trustBadges.map((badge, index) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass hover-lift cursor-default"
              style={{
                animation: isLoaded
                  ? `slide-up 0.5s ease-out forwards`
                  : "none",
                animationDelay: `${0.5 + index * 0.1}s`,
                opacity: 0,
              }}
            >
              <badge.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Hero Visual - Dashboard Mockup */}
        <div
          className={`mt-16 lg:mt-20 perspective-1000 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div
            className="relative max-w-5xl mx-auto transform-3d"
            style={{
              transform: `rotateX(-5deg) rotateY(${mousePosition.x * 0.3}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Main Dashboard Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.25)] border border-slate-200/50 dark:border-slate-700/50">
              {/* Dashboard Header */}
              <div className="bg-slate-50 dark:bg-slate-900/90 backdrop-blur-xl px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Stats */}
                <div className="space-y-4">
                  <MockupCard
                    icon={FileText}
                    title="Total Contracts"
                    value="1,247"
                    trend="+12%"
                    delay={0.6}
                  />
                  <MockupCard
                    icon={Shield}
                    title="Verified"
                    value="98.5%"
                    trend="+2.1%"
                    delay={0.7}
                  />
                  <MockupCard
                    icon={TrendingUp}
                    title="Processing"
                    value="24ms"
                    trend="-15%"
                    delay={0.8}
                  />
                </div>

                {/* Center Column - Chat Interface */}
                <div className="md:col-span-1 glass rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="p-2 rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
                      <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      AI Assistant
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <ChatMessage
                      message="What are the key clauses in Contract #4521?"
                      isAI={false}
                      delay={0.9}
                    />
                    <ChatMessage
                      message="I've analyzed the contract. Key clauses include: Termination (Section 4.2), Liability Cap ($2M), and Governing Law (Delaware)."
                      isAI={true}
                      delay={1.1}
                    />
                    <ChatMessage
                      message="When does it expire?"
                      isAI={false}
                      delay={1.3}
                    />
                  </div>
                </div>

                {/* Right Column - Notifications */}
                <div className="space-y-4">
                  <div
                    className="glass rounded-xl p-4"
                    style={{
                      animation: `slide-up 0.6s ease-out forwards`,
                      animationDelay: `1s`,
                      opacity: 0,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Recent Activity
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          text: "Contract #4521 verified",
                          time: "2m ago",
                          color: "bg-emerald-500",
                        },
                        {
                          text: "New AI analysis complete",
                          time: "5m ago",
                          color: "bg-blue-500",
                        },
                        {
                          text: "Blockchain timestamp added",
                          time: "12m ago",
                          color: "bg-violet-500",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${item.color}`}
                          />
                          <span className="text-slate-600 dark:text-slate-400 flex-1">
                            {item.text}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div
                    className="glass rounded-xl p-4"
                    style={{
                      animation: `slide-up 0.6s ease-out forwards`,
                      animationDelay: `1.2s`,
                      opacity: 0,
                    }}
                  >
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                      Processing Volume
                    </span>
                    <div className="flex items-end gap-1 h-16">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                        (height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-violet-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                            style={{
                              height: `${height}%`,
                              animation: `slide-up 0.4s ease-out forwards`,
                              animationDelay: `${1.3 + i * 0.05}s`,
                              opacity: 0,
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 dark:from-slate-900/50 to-transparent pointer-events-none" />
            </div>

            {/* Floating Elements Around Mockup */}
            <div
              className="absolute -top-4 -right-4 glass rounded-lg px-3 py-2 shadow-lg animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Contract Verified!
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass rounded-lg px-3 py-2 shadow-lg animate-float-delayed">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  +1 Document
                </span>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 glass rounded-full p-3 shadow-lg animate-bounce-subtle">
              <Lock className="w-5 h-5 text-violet-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
