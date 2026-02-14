'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
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
  TrendingUp
} from 'lucide-react';

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  size?: 'normal' | 'large' | 'wide';
  children?: React.ReactNode;
  delay?: number;
}

function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  size = 'normal',
  children,
  delay = 0
}: FeatureCardProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  const sizeClasses = {
    normal: 'md:col-span-1 aspect-square',
    large: 'md:col-span-2 md:row-span-2',
    wide: 'md:col-span-2',
  };

  return (
    <div
      ref={ref}
      className={`relative group ${sizeClasses[size]} rounded-3xl overflow-hidden cursor-pointer hover-lift`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s ease-out ${delay}s`,
      }}
    >
      <div className={`absolute inset-0 ${gradient} backdrop-blur-xl`} />
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl" />
      <div className="absolute inset-0 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30 transition-colors duration-300" />
      
      <div className="relative h-full p-6 md:p-8 flex flex-col">
        {/* Icon */}
        <div className="mb-4">
          <div className="relative inline-flex p-3 rounded-2xl bg-gradient-to-br from-white/50 to-white/20 dark:from-slate-800/50 dark:to-slate-800/20 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        {/* Custom Content */}
        {children && (
          <div className="mt-auto pt-4">
            {children}
          </div>
        )}

        {/* Hover Glow */}
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-violet-500/0 to-teal-500/0 group-hover:from-blue-500/20 group-hover:via-violet-500/20 group-hover:to-teal-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      </div>
    </div>
  );
}

// Animated Chat Messages
function ChatAnimation() {
  const messages = [
    { text: "What's the liability cap?", isUser: true },
    { text: "The liability cap is $5M per Section 8.3", isUser: false },
    { text: "When does this contract expire?", isUser: true },
    { text: "December 31, 2024 - 45 days remaining", isUser: false },
  ];

  return (
    <div className="mt-6 space-y-3">
      {messages.map((msg, i) => (
        <div 
          key={i}
          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          style={{
            animation: `slide-up 0.4s ease-out forwards`,
            animationDelay: `${i * 0.8 + 1}s`,
            opacity: 0,
          }}
        >
          <div 
            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.isUser 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {/* Typing Indicator */}
      <div 
        className="flex justify-start"
        style={{
          animation: `fade-in 0.3s ease-out forwards`,
          animationDelay: '4.5s',
          opacity: 0,
        }}
      >
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Document Extraction Animation
function ExtractionAnimation() {
  const fields = [
    { label: 'Contract Type', value: 'Service Agreement', status: 'done' },
    { label: 'Parties', value: '3 identified', status: 'done' },
    { label: 'Effective Date', value: 'Jan 1, 2024', status: 'done' },
    { label: 'Term', value: '24 months', status: 'processing' },
    { label: 'Value', value: 'Analyzing...', status: 'pending' },
  ];

  return (
    <div className="mt-6 space-y-2">
      {fields.map((field, i) => (
        <div 
          key={i}
          className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50"
          style={{
            animation: `slide-up 0.4s ease-out forwards`,
            animationDelay: `${i * 0.3 + 0.5}s`,
            opacity: 0,
          }}
        >
          <span className="text-xs text-slate-500 dark:text-slate-400">{field.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{field.value}</span>
            {field.status === 'done' && <Check className="w-4 h-4 text-emerald-500" />}
            {field.status === 'processing' && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            {field.status === 'pending' && (
              <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Blockchain Animation
function BlockchainAnimation() {
  return (
    <div className="mt-6 relative h-32">
      {/* Nodes */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          style={{
            left: `${i * 25}%`,
            top: i % 2 === 0 ? '20%' : '50%',
            animation: `float 3s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <Link className="w-5 h-5 text-white" />
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
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={`${i * 25 + 12}%`}
            y1={i % 2 === 0 ? '35%' : '65%'}
            x2={`${(i + 1) * 25 + 12}%`}
            y2={i % 2 === 0 ? '65%' : '35%'}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>

      {/* Transaction Hash */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20"
        style={{
          animation: `slide-up 0.5s ease-out forwards`,
          animationDelay: '1.5s',
          opacity: 0,
        }}
      >
        <span className="text-xs font-mono text-violet-600 dark:text-violet-400">
          0x7f8a...9b2c ✓
        </span>
      </div>
    </div>
  );
}

// Dashboard Mini Preview
function DashboardPreview() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {/* Mini Chart */}
      <div className="col-span-2 glass rounded-xl p-3">
        <div className="flex items-end gap-1 h-16">
          {[30, 50, 40, 70, 55, 80, 65, 90, 75, 85].map((h, i) => (
            <div 
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500 to-violet-500 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-2">
        <div className="glass rounded-lg p-2 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">+24%</span>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <Zap className="w-4 h-4 mx-auto text-amber-500 mb-1" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">98.9%</span>
        </div>
      </div>
    </div>
  );
}

// Notification Animation
function NotificationAnimation() {
  const notifications = [
    { icon: Bell, text: 'Contract renewal in 7 days', color: 'text-amber-500' },
    { icon: Check, text: 'Document verified', color: 'text-emerald-500' },
    { icon: Sparkles, text: 'AI analysis complete', color: 'text-blue-500' },
  ];

  return (
    <div className="mt-6 space-y-2">
      {notifications.map((notif, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50"
          style={{
            animation: `slide-up 0.4s ease-out forwards`,
            animationDelay: `${i * 0.5 + 0.8}s`,
            opacity: 0,
          }}
        >
          <notif.icon className={`w-5 h-5 ${notif.color}`} />
          <span className="text-sm text-slate-700 dark:text-slate-300">{notif.text}</span>
        </div>
      ))}
    </div>
  );
}

// Security Animation
function SecurityAnimation() {
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg animate-pulse-glow">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap justify-center">
        {['AES-256', 'GDPR', 'ISO 27001'].map((badge, i) => (
          <span 
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>();

  const features = [
    {
      title: 'AI-Powered Conversational Assistant',
      description: 'Ask any question about your contracts. Our AI understands legal context and responds in seconds with precise answers.',
      icon: MessageSquare,
      gradient: 'card-gradient-blue',
      size: 'large' as const,
      content: <ChatAnimation />,
    },
    {
      title: 'Intelligent Document Extraction',
      description: 'Advanced OCR + AI automatically extracts and structures all information from your PDF documents.',
      icon: Brain,
      gradient: 'card-gradient-teal',
      content: <ExtractionAnimation />,
    },
    {
      title: 'Blockchain Proof of Submission',
      description: 'Immutable timestamping on Polygon. Cryptographic proof that\'s legally valid and instantly verifiable.',
      icon: Shield,
      gradient: 'card-gradient-violet',
      content: <BlockchainAnimation />,
    },
    {
      title: 'Comprehensive Dashboard & Analytics',
      description: 'Visualize all contracts, renewal alerts, and detailed analytics in one beautiful interface.',
      icon: BarChart3,
      gradient: 'from-blue-500/10 via-violet-500/10 to-teal-500/10',
      size: 'wide' as const,
      content: <DashboardPreview />,
    },
    {
      title: 'Smart Notifications',
      description: 'Automated alerts for renewals, deadlines, and important contract events. Never miss a date.',
      icon: Bell,
      gradient: 'card-gradient-amber',
      content: <NotificationAnimation />,
    },
    {
      title: 'Enterprise Security',
      description: 'AES-256 encryption, GDPR compliant, secure hosting. Your data is protected at every level.',
      icon: Lock,
      gradient: 'card-gradient-emerald',
      content: <SecurityAnimation />,
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-mesh opacity-50" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Manage Contracts</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful AI combined with blockchain security. Built for professionals.
          </p>
        </div>

        {/* Bento Grid - Professional Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-auto">
          {/* AI Assistant Card - Large (2x2) */}
          <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <FeatureCard
              key={features[0].title}
              title={features[0].title}
              description={features[0].description}
              icon={features[0].icon}
              gradient={features[0].gradient}
              size="large"
              delay={0}
            >
              {features[0].content}
            </FeatureCard>
          </div>

          {/* Column 2 - Stack of small cards */}
          <div className="sm:col-span-1 lg:col-span-1">
            <FeatureCard
              key={features[1].title}
              title={features[1].title}
              description={features[1].description}
              icon={features[1].icon}
              gradient={features[1].gradient}
              size="normal"
              delay={0.1}
            >
              {features[1].content}
            </FeatureCard>
          </div>

          <div className="sm:col-span-1 lg:col-span-1">
            <FeatureCard
              key={features[2].title}
              title={features[2].title}
              description={features[2].description}
              icon={features[2].icon}
              gradient={features[2].gradient}
              size="normal"
              delay={0.2}
            >
              {features[2].content}
            </FeatureCard>
          </div>

          {/* Full width Dashboard Card */}
          <div className="sm:col-span-2 lg:col-span-2">
            <FeatureCard
              key={features[3].title}
              title={features[3].title}
              description={features[3].description}
              icon={features[3].icon}
              gradient={features[3].gradient}
              size="wide"
              delay={0.3}
            >
              {features[3].content}
            </FeatureCard>
          </div>

          {/* Notification Card */}
          <div className="sm:col-span-1 lg:col-span-1">
            <FeatureCard
              key={features[4].title}
              title={features[4].title}
              description={features[4].description}
              icon={features[4].icon}
              gradient={features[4].gradient}
              size="normal"
              delay={0.4}
            >
              {features[4].content}
            </FeatureCard>
          </div>

          {/* Security Card */}
          <div className="sm:col-span-1 lg:col-span-1">
            <FeatureCard
              key={features[5].title}
              title={features[5].title}
              description={features[5].description}
              icon={features[5].icon}
              gradient={features[5].gradient}
              size="normal"
              delay={0.5}
            >
              {features[5].content}
            </FeatureCard>
          </div>
        </div>
      </div>
    </section>
  );
}
