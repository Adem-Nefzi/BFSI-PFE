"use client";

import { useMemo } from "react";
import {
  Upload,
  Cpu,
  MessageSquare,
  Shield,
  FileText,
  Check,
  Sparkles,
  Zap,
  Link,
  Target,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Step Card Component with Glowing Effect
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  delay: number;
  children?: React.ReactNode;
}

function StepCard({
  number,
  title,
  description,
  icon: Icon,
  gradient,
  glowColor,
  delay,
  children,
}: StepCardProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  });

  return (
    <div
      ref={ref}
      className="relative h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {/* Glowing Border Card */}
      <div className="relative h-full rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-2 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-colors duration-500 overflow-hidden">
        {/* Rainbow Glowing Effect */}
        <GlowingEffect
          spread={60}
          glow={true}
          disabled={false}
          proximity={100}
          inactiveZone={0.01}
          borderWidth={2}
          variant="default"
        />

        <div className="relative h-full flex flex-col rounded-xl p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg">
          {/* Modern Number Badge */}
          <div className="absolute -top-3 -right-3 z-10">
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className={`absolute inset-0 ${gradient} rounded-2xl blur-xl opacity-60 animate-pulse-glow`}
                style={{ padding: "4px" }}
              />

              {/* Badge container */}
              <div className="relative">
                {/* Glass background */}
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl" />

                {/* Gradient border */}
                <div
                  className={`absolute inset-0 ${gradient} rounded-2xl p-[2px]`}
                >
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl" />
                </div>

                {/* Number */}
                <div className="relative px-4 py-2 flex items-center justify-center">
                  <span
                    className={`text-2xl font-black bg-gradient-to-br ${gradient.replace("bg-", "from-")} to-transparent bg-clip-text text-transparent`}
                  >
                    {number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Icon with Glow */}
          <div className="relative inline-flex mb-6">
            <div
              className={`absolute inset-0 ${gradient} rounded-2xl blur-2xl opacity-40 animate-pulse-glow`}
            />
            <div
              className={`relative w-20 h-20 rounded-2xl ${gradient} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 leading-tight">
              {title}
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {description}
            </p>
          </div>

          {/* Animation Content */}
          {children && <div className="mt-auto">{children}</div>}
        </div>
      </div>
    </div>
  );
}

// Upload Animation
function UploadAnimation() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <div ref={ref} className="mt-4">
      {/* Drop Zone */}
      <div
        className="relative border-2 border-dashed border-blue-400/60 dark:border-blue-500/60 rounded-xl p-4 text-center overflow-hidden group hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "all 0.5s ease-out 0.3s",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Upload
          className="w-6 h-6 mx-auto text-blue-500 mb-2 relative z-10"
          style={{
            animation: isVisible
              ? "bounce-subtle 2s ease-in-out infinite"
              : "none",
          }}
        />
        <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">
          Drop files here
        </p>
      </div>

      {/* File List */}
      <div className="mt-3 space-y-2">
        {[
          { name: "contract.pdf", size: "2.4 MB", progress: 100 },
          { name: "agreement.jpg", size: "1.8 MB", progress: 75 },
        ].map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.4s ease-out ${0.5 + i * 0.2}s`,
            }}
          >
            <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500 rounded-full transition-all duration-1000"
                  style={{
                    width: isVisible ? `${file.progress}%` : "0%",
                    transitionDelay: `${0.8 + i * 0.2}s`,
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500">{file.size}</span>
            {file.progress === 100 && (
              <Check className="w-3 h-3 text-emerald-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Analysis Animation
function AIAnalysisAnimation() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  const scanHeights = useMemo(
    () => [
      22, 38, 55, 40, 62, 30, 70, 45, 58, 35, 66, 28, 52, 48, 60, 33, 57, 41,
      64, 36,
    ],
    [],
  );

  const analysisPoints = [
    { label: "Clauses", value: "47", icon: Target, color: "text-blue-500" },
    { label: "Risk", value: "Low", icon: Shield, color: "text-emerald-500" },
    { label: "Speed", value: "2.3s", icon: Zap, color: "text-amber-500" },
  ];

  return (
    <div ref={ref} className="mt-4">
      {/* AI Brain */}
      <div className="flex justify-center mb-3">
        <div className="relative">
          <div
            className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-60"
            style={{
              animation: isVisible
                ? "pulse-glow 2s ease-in-out infinite"
                : "none",
            }}
          />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Analysis Points */}
      <div className="grid grid-cols-3 gap-2">
        {analysisPoints.map((point, i) => (
          <div
            key={i}
            className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.9)",
              transition: `all 0.4s ease-out ${0.3 + i * 0.15}s`,
            }}
          >
            <point.icon className={`w-4 h-4 mx-auto mb-1 ${point.color}`} />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {point.value}
            </p>
            <p className="text-[10px] text-slate-500">{point.label}</p>
          </div>
        ))}
      </div>

      {/* Scanning Bar with Waveform */}
      <div className="mt-3 relative h-12 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 overflow-hidden">
        {/* Background waveform */}
        <div className="absolute inset-0 flex items-center justify-center gap-0.5 opacity-20">
          {scanHeights.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-slate-400 dark:bg-slate-600 rounded-full"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        {/* Scanning line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-transparent"
          style={{
            left: isVisible ? "100%" : "0%",
            transition: "left 2s ease-in-out 0.5s",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
          }}
        />
      </div>
    </div>
  );
}

// Chat Animation
function ChatStepAnimation() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  const messages = [
    { text: "Explain termination clause", isUser: true },
    { text: "Section 12.3: 30 days notice...", isUser: false },
  ];

  return (
    <div ref={ref} className="mt-4">
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"} items-end gap-2`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.4s ease-out ${0.3 + i * 0.4}s`,
            }}
          >
            {!msg.isUser && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-3 py-2 rounded-xl text-xs shadow-sm ${
                msg.isUser
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* RAG Indicator */}
      <div
        className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.4s ease-out 1.2s",
        }}
      >
        <div className="flex gap-0.5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <span>RAG Powered</span>
      </div>
    </div>
  );
}

// Blockchain Animation
function BlockchainStepAnimation() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <div ref={ref} className="mt-4">
      {/* Blockchain Chain */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.8)",
                transition: `all 0.4s ease-out ${0.2 + i * 0.2}s`,
              }}
            >
              <Link className="w-5 h-5 text-white" />
            </div>
            {i < 2 && (
              <div
                className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500"
                style={{
                  transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: `transform 0.3s ease-out ${0.4 + i * 0.2}s`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Certificate */}
      <div
        className="rounded-xl p-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200/50 dark:border-emerald-700/50"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s ease-out 0.8s",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
              Polygon Verified
            </p>
            <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 truncate">
              0x3f7a...9e2d
            </p>
          </div>
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();

  const steps = [
    {
      number: "01",
      title: "Upload Contract",
      description:
        "PDF, images, or scans. Drag and drop or browse to upload instantly.",
      icon: Upload,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      glowColor: "rgba(59, 130, 246, 0.5)",
      animation: <UploadAnimation />,
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "GPT-4 Turbo extracts and analyzes every clause, term, and detail automatically.",
      icon: Cpu,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      glowColor: "rgba(139, 92, 246, 0.5)",
      animation: <AIAnalysisAnimation />,
    },
    {
      number: "03",
      title: "Chat with AI",
      description:
        "Ask anything. Get instant, precise answers powered by RAG technology.",
      icon: MessageSquare,
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      glowColor: "rgba(20, 184, 166, 0.5)",
      animation: <ChatStepAnimation />,
    },
    {
      number: "04",
      title: "Blockchain Proof",
      description:
        "Immutable certification on Polygon. Legally valid timestamped proof.",
      icon: Shield,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      glowColor: "rgba(16, 185, 129, 0.5)",
      animation: <BlockchainStepAnimation />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background with Beams */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <BackgroundBeams className="opacity-55" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 shadow-lg">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Simple Process
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            From Upload to Certification in{" "}
            <span className="gradient-text">4 Easy Steps</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our intelligent system handles everything automatically
          </p>
        </div>

        {/* Steps Grid - Better Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              gradient={step.gradient}
              glowColor={step.glowColor}
              delay={index * 0.1}
            >
              {step.animation}
            </StepCard>
          ))}
        </div>
      </div>
    </section>
  );
}
