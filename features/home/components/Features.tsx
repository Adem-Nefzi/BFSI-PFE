"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  MessageSquare,
  Brain,
  Shield,
  BarChart3,
  Bell,
  Lock,
  Sparkles,
  Link,
  Zap,
  Check,
  TrendingUp,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
// Feature Card Component with Glowing Effect and Dotted Background
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  gridArea: string;
  children?: React.ReactNode;
  delay?: number;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  gridArea,
  children,
  delay = 0,
}: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLLIElement>({
    threshold: 0.2,
  });

  return (
    <li
      ref={ref}
      className={`min-h-[16rem] list-none ${gridArea}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div className="relative h-full rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-1.5 md:rounded-2xl md:p-2 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-colors duration-500 overflow-hidden">
        {/* Glowing Effect */}
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={60}
          inactiveZone={0.01}
          borderWidth={1.5}
        />
        <div className="relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-lg md:rounded-xl p-4 md:p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg dark:shadow-[0px_0px_30px_0px_rgba(59,130,246,0.08)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {/* Icon Container */}
            <div className="relative inline-flex w-fit">
              <div
                className={`p-2.5 rounded-xl ${gradient} shadow-md group-hover:shadow-lg transition-all duration-500`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Animated Content */}
            {children && <div className="mt-auto">{children}</div>}
          </div>
        </div>
      </div>
    </li>
  );
}

// Animated Chat Messages (Compact)
function ChatAnimation() {
  const messages = [
    { text: "What's the liability cap?", isUser: true },
    { text: "$5M per Section 8.3", isUser: false },
  ];

  return (
    <div className="mt-2 space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          style={{
            animation: `slide-up 0.3s ease-out forwards`,
            animationDelay: `${i * 0.6 + 1}s`,
            opacity: 0,
          }}
        >
          <div
            className={`max-w-[90%] px-3 py-1.5 rounded-xl text-xs shadow-sm ${
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
  );
}

// Document Extraction Animation (Compact)
function ExtractionAnimation() {
  const fields = [
    { label: "Contract Type", value: "Service", status: "done" },
    { label: "Parties", value: "3 found", status: "done" },
    { label: "Term", value: "24 mo", status: "processing" },
  ];

  return (
    <div className="mt-2 space-y-1.5">
      {fields.map((field, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          style={{
            animation: `slide-up 0.3s ease-out forwards`,
            animationDelay: `${i * 0.2 + 0.5}s`,
            opacity: 0,
          }}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {field.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {field.value}
            </span>
            {field.status === "done" && (
              <Check className="w-3 h-3 text-emerald-500" />
            )}
            {field.status === "processing" && (
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Blockchain Animation (Compact)
function BlockchainAnimation() {
  return (
    <div className="mt-2 relative h-24">
      {/* Nodes */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          style={{
            left: `${i * 33}%`,
            top: i % 2 === 0 ? "20%" : "50%",
            animation: `float 3s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <Link className="w-4 h-4 text-white" />
        </div>
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[0, 1].map((i) => (
          <line
            key={i}
            x1={`${i * 33 + 12}%`}
            y1={i % 2 === 0 ? "35%" : "65%"}
            x2={`${(i + 1) * 33 + 12}%`}
            y2={i % 2 === 0 ? "65%" : "35%"}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="4,4"
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Transaction Hash */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-violet-500/15 dark:bg-violet-500/25 backdrop-blur-sm"
        style={{
          animation: `slide-up 0.4s ease-out forwards`,
          animationDelay: "1.2s",
          opacity: 0,
        }}
      >
        <span className="text-[10px] font-mono font-semibold text-violet-600 dark:text-violet-400">
          0x7f8a...9b2c ✓
        </span>
      </div>
    </div>
  );
}

// Dashboard Mini Preview (Compact)
function DashboardPreview() {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {/* Mini Chart */}
      <div className="col-span-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        <div className="flex items-end gap-0.5 h-14">
          {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:opacity-80"
              style={{
                height: `${h}%`,
                animation: `slide-up 0.3s ease-out forwards`,
                animationDelay: `${i * 0.08 + 0.4}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1.5">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-500 mb-0.5" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            +24%
          </span>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm">
          <Zap className="w-4 h-4 mx-auto text-amber-500 mb-0.5" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            98.9%
          </span>
        </div>
      </div>
    </div>
  );
}

// Notification Animation (Compact)
function NotificationAnimation() {
  const notifications = [
    { icon: Bell, text: "Renewal in 7 days", color: "text-amber-500" },
    { icon: Check, text: "Doc verified", color: "text-emerald-500" },
  ];

  return (
    <div className="mt-2 space-y-1.5">
      {notifications.map((notif, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          style={{
            animation: `slide-up 0.3s ease-out forwards`,
            animationDelay: `${i * 0.4 + 0.6}s`,
            opacity: 0,
          }}
        >
          <notif.icon className={`w-4 h-4 flex-shrink-0 ${notif.color}`} />
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
            {notif.text}
          </span>
        </div>
      ))}
    </div>
  );
}

// Security Animation (Compact)
function SecurityAnimation() {
  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl animate-pulse-glow">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      </div>
      <div className="mt-3 flex gap-1.5 flex-wrap justify-center">
        {["AES-256", "GDPR", "ISO"].map((badge, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400"
            style={{
              animation: `slide-up 0.3s ease-out forwards`,
              animationDelay: `${i * 0.15 + 0.4}s`,
              opacity: 0,
            }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const { ref: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();

  const features = [
    {
      title: "AI-Powered Assistant",
      description:
        "Ask questions about your contracts and get instant, precise answers with legal context.",
      icon: MessageSquare,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      gridArea: "md:[grid-area:1/1/2/3]",
      content: <ChatAnimation />,
    },
    {
      title: "Document Extraction",
      description:
        "Advanced OCR + AI extracts and structures information from PDFs automatically.",
      icon: Brain,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
      gridArea: "md:[grid-area:1/3/2/4]",
      content: <ExtractionAnimation />,
    },
    {
      title: "Blockchain Proof",
      description:
        "Immutable timestamping on Polygon with cryptographic verification.",
      icon: Shield,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      gridArea: "md:[grid-area:2/3/3/4]",
      content: <BlockchainAnimation />,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Visualize contracts, renewals, and analytics in one interface.",
      icon: BarChart3,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      gridArea: "md:[grid-area:2/1/3/3]",
      content: <DashboardPreview />,
    },
    {
      title: "Smart Alerts",
      description:
        "Automated notifications for renewals, deadlines, and key events.",
      icon: Bell,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      gridArea: "md:[grid-area:3/3/4/4]",
      content: <NotificationAnimation />,
    },
    {
      title: "Enterprise Security",
      description: "AES-256 encryption, GDPR compliant with secure hosting.",
      icon: Lock,
      gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      gridArea: "md:[grid-area:3/1/4/3]",
      content: <SecurityAnimation />,
    },
  ];

  return (
    <section
      id="features"
      className="relative pt-16 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-mesh opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-slate-900/50" />

      <div className="relative max-w-6xl mx-auto pb-6">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Features
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">Manage Contracts</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Powerful AI combined with blockchain security.
          </p>
        </div>

        {/* Bento Grid - Compact */}
        <ul className="grid grid-cols-1 grid-rows-none gap-3 md:grid-cols-3 md:grid-rows-3 lg:gap-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
              gridArea={feature.gridArea}
              delay={index * 0.08}
            >
              {feature.content}
            </FeatureCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
