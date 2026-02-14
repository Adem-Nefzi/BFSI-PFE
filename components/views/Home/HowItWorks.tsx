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

// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  delay: number;
  isLast?: boolean;
}

function StepCard({
  number,
  title,
  description,
  icon: Icon,
  gradient,
  delay,
  isLast = false,
}: StepCardProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  return (
    <div ref={ref} className="relative flex-1">
      {/* Connector Line - Desktop */}
      {!isLast && (
        <>
          {/* Horizontal connector for desktop */}
          <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5">
            <div className="relative w-full h-full overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-teal-500"
                style={{
                  transform: isVisible ? "translateX(0)" : "translateX(-100%)",
                  transition: `transform 1s ease-out ${delay + 0.3}s`,
                }}
              />
              {/* Animated dots */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500"
                style={{
                  animationName: isVisible ? "move-right" : "none",
                  animationDuration: isVisible ? "2s" : undefined,
                  animationTimingFunction: isVisible ? "linear" : undefined,
                  animationIterationCount: isVisible ? "infinite" : undefined,
                  animationFillMode: "forwards",
                  animationDelay: isVisible ? `${delay + 0.5}s` : undefined,
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.3s ease-out ${delay + 0.5}s`,
                }}
              />
            </div>
          </div>

          {/* Vertical connector for mobile */}
          <div className="md:hidden absolute top-20 left-8 w-0.5 h-[calc(100%-40px)]">
            <div
              className="w-full h-full bg-gradient-to-b from-blue-500 via-violet-500 to-teal-500"
              style={{
                transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "top",
                transition: `transform 1s ease-out ${delay + 0.3}s`,
              }}
            />
          </div>
        </>
      )}

      {/* Card */}
      <div
        className="relative"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: `all 0.6s ease-out ${delay}s`,
        }}
      >
        {/* Icon with Number */}
        <div className="relative inline-block mb-6">
          <div
            className={`w-24 h-24 rounded-full ${gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Number Badge */}
          <div
            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center shadow-lg"
            style={{
              animationName: isVisible ? "bounce-subtle" : "none",
              animationDuration: isVisible ? "0.5s" : undefined,
              animationTimingFunction: isVisible ? "ease-out" : undefined,
              animationDelay: `${delay + 0.2}s`,
            }}
          >
            <span className="text-lg font-bold text-white">{number}</span>
          </div>

          {/* Glow Effect */}
          <div
            className={`absolute inset-0 rounded-full ${gradient} blur-xl opacity-50`}
            style={{
              animationName: isVisible ? "pulse-glow" : "none",
              animationDuration: isVisible ? "3s" : undefined,
              animationTimingFunction: isVisible ? "ease-in-out" : undefined,
              animationIterationCount: isVisible ? "infinite" : undefined,
              animationFillMode: "forwards",
              animationDelay: isVisible ? `${delay + 0.5}s` : undefined,
            }}
          />
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6 hover-lift">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
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
    <div ref={ref} className="mt-6 glass rounded-xl p-4">
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "all 0.5s ease-out 0.3s",
        }}
      >
        <Upload
          className="w-8 h-8 mx-auto text-blue-500 mb-2"
          style={{
            animation: isVisible
              ? "bounce-subtle 2s ease-in-out infinite"
              : "none",
          }}
        />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drop files here or click to browse
        </p>
      </div>

      {/* File List */}
      <div className="mt-4 space-y-2">
        {[
          { name: "contract_v2.pdf", size: "2.4 MB", progress: 100 },
          { name: "agreement_scan.jpg", size: "1.8 MB", progress: 75 },
        ].map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.4s ease-out ${0.5 + i * 0.2}s`,
            }}
          >
            <FileText className="w-5 h-5 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{
                    width: isVisible ? `${file.progress}%` : "0%",
                    transitionDelay: `${0.8 + i * 0.2}s`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-slate-500">{file.size}</span>
            {file.progress === 100 && (
              <Check className="w-4 h-4 text-emerald-500" />
            )}
          </div>
        ))}
      </div>

      {/* Format Badges */}
      <div className="mt-4 flex gap-2 justify-center">
        {["PDF", "JPG", "PNG"].map((format, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            {format}
          </span>
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
    { label: "Clauses detected", value: "47", icon: Target },
    {
      label: "Risk assessment",
      value: "Low",
      icon: Shield,
      color: "text-emerald-500",
    },
    {
      label: "Processing time",
      value: "2.3s",
      icon: Zap,
      color: "text-amber-500",
    },
  ];

  return (
    <div ref={ref} className="mt-6 glass rounded-xl p-4">
      {/* AI Brain */}
      <div className="flex justify-center mb-4">
        <div
          className="relative"
          style={{
            animation: isVisible
              ? "pulse-glow 2s ease-in-out infinite"
              : "none",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Analysis Progress */}
      <div className="space-y-3">
        {analysisPoints.map((point, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-slate-800/50"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.4s ease-out ${0.3 + i * 0.15}s`,
            }}
          >
            <div className="flex items-center gap-2">
              <point.icon
                className={`w-4 h-4 ${point.color || "text-blue-500"}`}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {point.label}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {point.value}
            </span>
          </div>
        ))}
      </div>

      {/* Scanning Effect */}
      <div className="mt-4 relative h-20 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-30">
          {scanHeights.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-slate-400 dark:bg-slate-600 rounded-full"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent"
          style={{
            left: isVisible ? "100%" : "0%",
            transition: "left 2s ease-in-out 0.5s",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
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
    { text: "Explain the termination clause", isUser: true },
    {
      text: "Section 12.3: Either party may terminate with 30 days written notice...",
      isUser: false,
    },
  ];

  return (
    <div ref={ref} className="mt-6 glass rounded-xl p-4">
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.4s ease-out ${0.3 + i * 0.4}s`,
            }}
          >
            {!msg.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mr-2 flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
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
        className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.4s ease-out 1.2s",
        }}
      >
        <div className="flex gap-1">
          <span
            className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
        <span>Powered by RAG</span>
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
    <div ref={ref} className="mt-6 glass rounded-xl p-4">
      {/* Blockchain Visual */}
      <div className="relative h-24 mb-4">
        <div className="flex items-center justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative">
              <div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.8)",
                  transition: `all 0.4s ease-out ${0.2 + i * 0.2}s`,
                }}
              >
                <Link className="w-6 h-6 text-white" />
              </div>
              {i < 2 && (
                <div
                  className="absolute top-1/2 -right-4 w-8 h-0.5 bg-emerald-500/50"
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
      </div>

      {/* Certificate */}
      <div
        className="glass rounded-lg p-3 border border-emerald-500/30"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s ease-out 0.8s",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Verified on Polygon
            </p>
            <p className="text-xs font-mono text-slate-500">0x3f7a...9e2d</p>
          </div>
          <Check className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* Timestamp */}
      <div
        className="mt-3 text-center text-xs text-slate-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.4s ease-out 1.2s",
        }}
      >
        Timestamped: {new Date().toLocaleString()}
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
      title: "Upload Your Contract",
      description:
        "PDF, images, or scanned documents. Simply drag and drop or click to browse.",
      icon: Upload,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      animation: <UploadAnimation />,
    },
    {
      number: "02",
      title: "AI Extracts & Analyzes",
      description:
        "GPT-4 Turbo understands your contract deeply. Automatic extraction of all important clauses and terms.",
      icon: Cpu,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      animation: <AIAnalysisAnimation />,
    },
    {
      number: "03",
      title: "Chat with AI Assistant",
      description:
        "Get instant answers to any questions. Powered by RAG for precise, context-aware responses.",
      icon: MessageSquare,
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      animation: <ChatStepAnimation />,
    },
    {
      number: "04",
      title: "Immutable Certification",
      description:
        "Registered on Polygon blockchain. Legally valid timestamped proof of submission.",
      icon: Shield,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      animation: <BlockchainStepAnimation />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50">
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Simple Process
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            From Upload to Certification in{" "}
            <span className="gradient-text">4 Steps</span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our intelligent system handles everything automatically
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <StepCard
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                gradient={step.gradient}
                delay={index * 0.15}
                isLast={index === steps.length - 1}
              />
              {step.animation}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Animation Keyframes */}
      <style>{`
        @keyframes move-right {
          0% {
            left: 0;
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
