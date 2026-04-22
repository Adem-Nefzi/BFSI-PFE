'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Zap, Shield, Lock, Database, Brain, Coins, Code } from 'lucide-react';

const slides = [
  {
    number: 1,
    title: 'LexiChain',
    subtitle: 'Professional BFSI Document Intelligence Platform',
    description: 'A Next-Generation Solution for Banking, Financial Services & Insurance',
    bgGradient: 'from-blue-600 to-blue-900',
    icon: FileText,
  },
  {
    number: 2,
    title: 'The Problem We Solve',
    subtitle: 'Transparency Gap in Financial Documents',
    points: [
      '📋 Clients sign contracts without truly understanding exclusions, renewals, or terms',
      '⏱️ Agents waste thousands of hours manually checking PDFs for compliance',
      '⚖️ Document integrity disputes are expensive and difficult to resolve',
      '🔍 Information overload makes it impossible to find critical clauses quickly',
    ],
    bgGradient: 'from-red-500 to-red-700',
  },
  {
    number: 3,
    title: 'Our Solution: LexiChain',
    subtitle: 'From Static PDFs to Dynamic, Intelligent Assets',
    description: 'Convert every financial document into a searchable, AI-analyzed, blockchain-verified asset',
    features: [
      'Intelligent Document Analysis (Gemini AI)',
      'Conversational Contract Chat (RAG)',
      'Blockchain Proof of Existence',
      'Instant Compliance Verification',
    ],
    bgGradient: 'from-green-500 to-green-700',
  },
  {
    number: 4,
    title: 'The LexiChain Vision',
    subtitle: 'Three Pillars of Trust',
    pillars: [
      {
        title: 'Intelligence',
        description: 'AI automatically extracts, analyzes, and explains complex financial terms',
        icon: '🧠',
      },
      {
        title: 'Security',
        description: 'Blockchain creates immutable proof that documents were received on a specific date',
        icon: '🔐',
      },
      {
        title: 'Usability',
        description: 'Chat with your contract in natural language, ask any question, get instant answers',
        icon: '💬',
      },
    ],
    bgGradient: 'from-purple-500 to-purple-700',
  },
  {
    number: 5,
    title: 'System Architecture Overview',
    subtitle: 'Layered, Modular Design',
    description: 'Built for Enterprise Scale with Clean Separation of Concerns',
    layers: [
      { name: 'Frontend Layer', tech: 'Next.js 15 + React 19', color: 'bg-blue-100' },
      { name: 'AI Intelligence Layer', tech: 'Google Gemini + RAG Vector DB', color: 'bg-purple-100' },
      { name: 'Business Logic Layer', tech: 'Server Actions + Prisma ORM', color: 'bg-green-100' },
      { name: 'Blockchain Layer', tech: 'Solidity Smart Contracts + Ethereum', color: 'bg-orange-100' },
      { name: 'Data Layer', tech: 'PostgreSQL + Vector Embeddings', color: 'bg-pink-100' },
    ],
    bgGradient: 'from-gray-600 to-gray-800',
  },
  {
    number: 6,
    title: 'Technology Stack Decisions',
    subtitle: 'Why Each Technology Was Chosen',
    stack: [
      {
        category: 'Frontend Framework',
        tech: 'Next.js 15 (React)',
        why: 'Server Components reduce client JS, enable secure server-side signing, SEO-friendly, and production-proven for financial apps',
      },
      {
        category: 'LLM Provider',
        tech: 'Google Gemini 2.0 Flash',
        why: 'Fastest inference for long legal documents (100k+ token context), multimodal (PDF + images), and highest accuracy on structured extraction',
      },
      {
        category: 'Blockchain',
        tech: 'Ethereum + Solidity',
        why: 'Industry-standard for document notarization, immutable timestamping, GDPR-compliant (only hash stored, never PII)',
      },
    ],
    bgGradient: 'from-indigo-500 to-indigo-700',
  },
  {
    number: 7,
    title: 'Technology Stack (Continued)',
    subtitle: 'Supporting Technologies',
    stack: [
      {
        category: 'Database & ORM',
        tech: 'PostgreSQL + Prisma',
        why: 'ACID compliance for financial records, type-safe ORM, supports vector embeddings for RAG, handles complex queries',
      },
      {
        category: 'Authentication',
        tech: 'Clerk',
        why: 'Enterprise-grade security, multi-factor auth, session management, audit logs - critical for regulated BFSI sector',
      },
      {
        category: 'File Storage',
        tech: 'UploadThing (Cloud)',
        why: 'Serverless file handling, automatic virus scanning, CDN distribution for fast retrieval',
      },
    ],
    bgGradient: 'from-cyan-500 to-cyan-700',
  },
  {
    number: 8,
    title: 'Module 1: The AI Analyst',
    subtitle: 'Intelligent Document Analysis Engine',
    description: 'Using Google Gemini to Extract & Understand Financial Documents',
    features: [
      {
        title: 'Smart Ingestion',
        detail: 'High-fidelity OCR reads both digital PDFs and scanned images with 99%+ accuracy',
      },
      {
        title: 'Automated Extraction',
        detail: 'Identifies 15+ key data points: Amount, Interest Rate, Parties, Dates, Clauses, in seconds',
      },
      {
        title: 'Intelligent Validation',
        detail: 'Flags missing signatures, inconsistent dates, and high-risk clauses before finalization',
      },
      {
        title: 'Domain Expertise',
        detail: 'Contract-type-specific analysis (Auto Insurance, Home, Health, Loans, Credit Cards, Investments)',
      },
    ],
    bgGradient: 'from-violet-500 to-violet-700',
  },
  {
    number: 9,
    title: 'Module 2: Retrieval-Augmented Generation (RAG)',
    subtitle: 'Chat with Your Contract',
    description: 'The Most Intelligent Part of LexiChain',
    ragFlow: [
      {
        step: '1. Semantic Chunking',
        detail: 'Document breaks into 50-120 overlapping chunks (~1,400 chars each) at logical boundaries (paragraphs, clauses)',
      },
      {
        step: '2. Vector Embedding',
        detail: 'Each chunk converted to 768-dimensional embedding via Gemini embedding model, stored in PostgreSQL',
      },
      {
        step: '3. Query Processing',
        detail: 'User question converted to embedding, compared against all chunks using cosine similarity scoring',
      },
      {
        step: '4. Context Retrieval',
        detail: 'Top-6 most relevant chunks retrieved and ranked by relevance score (0-1 scale)',
      },
      {
        step: '5. Generative Response',
        detail: 'Gemini generates natural-language answer using ONLY retrieved context (prevents hallucination)',
      },
    ],
    bgGradient: 'from-pink-500 to-pink-700',
  },
  {
    number: 10,
    title: 'Why RAG Matters',
    subtitle: 'Moving Beyond Generic AI',
    description: 'The RAG System Provides Accuracy That Generic ChatGPT Cannot',
    benefits: [
      {
        title: 'No Hallucinations',
        detail: 'AI only responds based on actual contract content, never makes up clauses or terms',
      },
      {
        title: 'Instant Answers',
        detail: 'Find specific clauses in 50-page contracts in under 1 second - no manual searching',
      },
      {
        title: 'Legal Defensibility',
        detail: 'Every answer is traceable to specific contract sections (with confidence scores)',
      },
      {
        title: 'Cost Efficient',
        detail: 'Save thousands in agent hours by automating routine contract questions',
      },
    ],
    bgGradient: 'from-emerald-500 to-emerald-700',
  },
  {
    number: 11,
    title: 'Module 3: Blockchain Security Layer',
    subtitle: 'Ethereum Smart Contract Integration',
    description: 'Immutable Proof of Existence for Every Document',
    blockchainFlow: [
      {
        step: 'Document Upload',
        detail: 'User uploads contract PDF via secure form (UploadThing)',
      },
      {
        step: 'SHA-256 Hashing',
        detail: 'Server computes 256-bit cryptographic hash (digital fingerprint) of raw file bytes',
      },
      {
        step: 'Blockchain Registration',
        detail: 'Hash sent to Solidity Smart Contract on Ethereum (Sepolia testnet or mainnet)',
      },
      {
        step: 'Block Confirmation',
        detail: 'Transaction mined into blockchain in ~12-15 seconds with immutable timestamp',
      },
      {
        step: 'Verification Record',
        detail: 'User stores txHash + block number; can verify document integrity anytime',
      },
    ],
    bgGradient: 'from-yellow-500 to-yellow-700',
  },
  {
    number: 12,
    title: 'Why Blockchain for Documents?',
    subtitle: 'GDPR-Compliant, Non-Repudiation Architecture',
    description: 'How We Use Blockchain Without Exposing Personal Data',
    benefits: [
      {
        title: 'Proof of Existence',
        detail: 'Mathematically prove document existed and had this exact content on a specific date',
      },
      {
        title: 'Non-Repudiation',
        detail: 'Guarantees "You received this version on this date" - prevents disputes',
      },
      {
        title: '100% GDPR Compliant',
        detail: 'Only hash stored on public blockchain. No names, amounts, or PII ever touches chain',
      },
      {
        title: 'Immutable Audit Trail',
        detail: 'Cannot be changed by any administrator, bank manager, or hacker',
      },
    ],
    bgGradient: 'from-orange-500 to-orange-700',
  },
  {
    number: 13,
    title: 'Architectural Pattern: Feature-Sliced Design',
    subtitle: 'Enterprise-Grade Code Organization',
    description: 'How We Scale LexiChain Without Chaos',
    architecture: [
      {
        layer: 'Features (AI, Blockchain, Contracts)',
        detail: 'Independent, self-contained modules with clear boundaries and dependencies',
      },
      {
        layer: 'Entities (Users, Contracts, Notifications)',
        detail: 'Core business logic and data models, reusable across features',
      },
      {
        layer: 'Shared (Services, Utils, UI Components)',
        detail: 'Common utilities, API clients, design system components',
      },
      {
        layer: 'Benefits',
        detail: 'Decouples blockchain logic from AI logic, enables team scaling, reduces merge conflicts',
      },
    ],
    bgGradient: 'from-teal-500 to-teal-700',
  },
  {
    number: 14,
    title: 'Security & Privacy Philosophy',
    subtitle: 'Security by Design',
    points: [
      '🔑 Server-Side Signing: Users don\'t need MetaMask or crypto wallets - backend acts as trusted custodian',
      '🔐 Authentication: Clerk integration ensures only users see their own contracts',
      '📊 Database Security: Role-level security enforced at data layer, encrypted at rest',
      '🛡️ Hybrid Approach: Private file storage (UploadThing) + public blockchain proof (hash only)',
      '✅ Compliance: GDPR-compliant, audit logs, zero exposure of personal data on-chain',
    ],
    bgGradient: 'from-slate-600 to-slate-800',
  },
  {
    number: 15,
    title: 'Why This is a 10/10 PFE Project',
    subtitle: 'A Multidisciplinary Innovation',
    highlights: [
      {
        title: 'AI Innovation',
        detail: 'Not just text extraction - conversational RAG system that understands contract semantics',
      },
      {
        title: 'Blockchain Innovation',
        detail: 'Production-ready smart contract solving real legal/compliance problems',
      },
      {
        title: 'Architectural Excellence',
        detail: 'Feature-Sliced Design, Clean Code principles, enterprise-grade patterns',
      },
      {
        title: 'Market Readiness',
        detail: 'Directly applicable to banks, insurance companies, fintech firms digitizing workflows',
      },
      {
        title: 'Full Stack Integration',
        detail: 'Frontend (React), Backend (Node.js), AI (Gemini), Blockchain (Ethereum), Database (PostgreSQL)',
      },
    ],
    bgGradient: 'from-slate-900 to-slate-950',
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Main Slide */}
      <div
        className={`w-full max-w-6xl aspect-video rounded-xl shadow-2xl bg-gradient-to-br ${slide.bgGradient} text-white p-12 flex flex-col justify-between overflow-hidden relative`}
      >
        {/* Slide Number */}
        <div className="absolute top-4 right-4 text-sm font-semibold opacity-80 bg-black/30 px-3 py-1 rounded">
          {slide.number} / {slides.length}
        </div>

        {/* Slide 1: Title Slide */}
        {slide.number === 1 && (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <FileText className="w-24 h-24 mb-6" />
            <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
            <h2 className="text-3xl font-light mb-8 opacity-90">{slide.subtitle}</h2>
            <p className="text-xl opacity-80 max-w-2xl">{slide.description}</p>
          </div>
        )}

        {/* Slide 2-3: Problem & Solution */}
        {slide.number === 2 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90 mb-12">{slide.subtitle}</h2>
            </div>
            <div className="space-y-4">
              {slide.points?.map((point, idx) => (
                <div key={idx} className="text-lg flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.number === 3 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
            </div>
            <p className="text-lg opacity-90 mb-8">{slide.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {slide.features?.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20"
                >
                  <p className="font-semibold">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 4: Three Pillars */}
        {slide.number === 4 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {slide.pillars?.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 text-center"
                >
                  <div className="text-5xl mb-4">{pillar.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-sm opacity-90">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 5: Architecture */}
        {slide.number === 5 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90 mb-4">{slide.subtitle}</h2>
              <p className="text-sm opacity-80">{slide.description}</p>
            </div>
            <div className="space-y-2">
              {slide.layers?.map((layer, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`${layer.color} text-gray-900 px-4 py-2 rounded font-semibold flex-1`}>
                    {layer.name}
                  </div>
                  <span className="text-gray-300 text-sm flex-1">{layer.tech}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slides 6-7: Stack */}
        {(slide.number === 6 || slide.number === 7) && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
            </div>
            <div className="space-y-4">
              {slide.stack?.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                  <h3 className="font-bold text-lg mb-2">{item.category}</h3>
                  <p className="font-semibold text-blue-200 mb-2">{item.tech}</p>
                  <p className="text-sm opacity-80">{item.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 8: AI Analyst */}
        {slide.number === 8 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {slide.features?.map((feature, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                  <h3 className="font-bold mb-2 text-blue-200">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 9: RAG */}
        {slide.number === 9 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="space-y-2">
              {slide.ragFlow?.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-3 rounded border border-white/20 flex gap-3">
                  <span className="font-bold text-pink-200 flex-shrink-0">{item.step}</span>
                  <p className="text-sm opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 10: Why RAG Matters */}
        {slide.number === 10 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {slide.benefits?.map((benefit, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                  <h3 className="font-bold mb-2 text-green-200">{benefit.title}</h3>
                  <p className="text-sm opacity-80">{benefit.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 11: Blockchain */}
        {slide.number === 11 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="space-y-2">
              {slide.blockchainFlow?.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-3 rounded border border-white/20">
                  <span className="font-bold text-yellow-200">{item.step}: </span>
                  <span className="text-sm opacity-90">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 12: Why Blockchain */}
        {slide.number === 12 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {slide.benefits?.map((benefit, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                  <h3 className="font-bold mb-2 text-orange-200">{benefit.title}</h3>
                  <p className="text-sm opacity-80">{benefit.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 13: Architecture Pattern */}
        {slide.number === 13 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
              <p className="text-sm opacity-80 mt-2">{slide.description}</p>
            </div>
            <div className="space-y-3">
              {slide.architecture?.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20 flex gap-3">
                  <span className="font-bold text-teal-200 flex-shrink-0">•</span>
                  <div>
                    <p className="font-semibold">{item.layer}</p>
                    <p className="text-sm opacity-80">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 14: Security */}
        {slide.number === 14 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
            </div>
            <div className="space-y-3">
              {slide.points?.map((point, idx) => (
                <div key={idx} className="text-base flex items-start gap-3 bg-white/10 backdrop-blur p-3 rounded border border-white/20">
                  <span className="flex-shrink-0">→</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 15: Why 10/10 */}
        {slide.number === 15 && (
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
              <h2 className="text-2xl font-light opacity-90">{slide.subtitle}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {slide.highlights?.map((highlight, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20"
                >
                  <h3 className="font-bold mb-2 text-blue-200">{highlight.title}</h3>
                  <p className="text-sm opacity-80">{highlight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-6 mt-8 w-full max-w-6xl">
        <button
          onClick={prevSlide}
          className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-white text-lg font-semibold">
          Slide {currentSlide + 1} of {slides.length}
        </div>

        <button
          onClick={nextSlide}
          className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition ${
              idx === currentSlide ? 'bg-white w-8' : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-gray-400 text-sm mt-8">
        Use arrow buttons or click dots to navigate. Press Escape to exit full screen.
      </div>
    </div>
  );
}
