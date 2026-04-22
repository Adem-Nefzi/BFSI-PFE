'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Brain, Blocks, FileText, Lock, Cpu, BarChart3, Network, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  gradient: string;
}

const slideVariants = {
  enter: {
    opacity: 0,
    x: 1000,
  },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: -1000,
    transition: { duration: 0.3 },
  },
};

export default function PresentationModern() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // Slide 1: Title
    {
      id: 1,
      title: 'LEXICHAIN',
      subtitle: 'Intelligent Financial Document Intelligence Platform',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            LEXICHAIN
          </h1>
          <p className="text-2xl text-gray-600 mb-2 font-light">Intelligent Financial Document Intelligence Platform</p>
          <p className="text-lg text-gray-500 mb-12">Powered by AI, Secured by Blockchain</p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">AI Powered</p>
            </div>
            <div className="text-center">
              <Blocks className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Blockchain Secured</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Enterprise Grade</p>
            </div>
          </div>
        </div>
      ),
      gradient: 'from-blue-50 to-cyan-50',
    },

    // Slide 2: The Challenge
    {
      id: 2,
      title: 'The Challenge',
      subtitle: 'Why Traditional Document Management Falls Short',
      content: (
        <div className="grid grid-cols-2 gap-8 px-12 py-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 rounded-2xl p-8 border border-red-200"
          >
            <FileText className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Static Documents</h3>
            <p className="text-gray-700 leading-relaxed">
              PDF files remain inert repositories of data. No intelligent analysis, no real-time insights, no capability to extract meaningful patterns from complex financial documents.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 rounded-2xl p-8 border border-orange-200"
          >
            <Lock className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Integrity Gaps</h3>
            <p className="text-gray-700 leading-relaxed">
              Without cryptographic proof of existence, documents lack non-repudiation. No audit trail of modifications. Organizations cannot definitively prove document authenticity or timeline.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200"
          >
            <Cpu className="w-10 h-10 text-yellow-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Operational Friction</h3>
            <p className="text-gray-700 leading-relaxed">
              Manual document review consumes weeks. Knowledge workers spend 40% of their time searching and extracting data. Errors propagate through downstream processes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 rounded-2xl p-8 border border-red-200"
          >
            <BarChart3 className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance Risk</h3>
            <p className="text-gray-700 leading-relaxed">
              GDPR, SOX, and regulatory frameworks demand document traceability. Current systems struggle to provide transparent, auditable evidence of data handling compliance.
            </p>
          </motion.div>
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },

    // Slide 3: The Solution
    {
      id: 3,
      title: 'The Solution',
      subtitle: 'From Static PDFs to Intelligent, Blockchain-Verified Assets',
      content: (
        <div className="flex items-center justify-center h-full px-12">
          <motion.div className="max-w-4xl">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-12 text-white shadow-2xl">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <Lightbulb className="w-16 h-16" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-6">LexiChain transforms financial documents into intelligent, verifiable assets</h2>
                  <div className="space-y-4">
                    <p className="text-xl leading-relaxed font-light">
                      <span className="font-semibold">Intelligent Analysis:</span> Advanced AI models understand document context, extract critical data points, and provide instant insights—seconds instead of weeks.
                    </p>
                    <p className="text-xl leading-relaxed font-light">
                      <span className="font-semibold">Cryptographic Verification:</span> Every document is notarized on Ethereum blockchain, creating immutable proof of existence and enabling non-repudiation.
                    </p>
                    <p className="text-xl leading-relaxed font-light">
                      <span className="font-semibold">Semantic Understanding:</span> Retrieval-Augmented Generation (RAG) ensures contextually accurate answers without hallucinations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ),
      gradient: 'from-blue-50 to-cyan-50',
    },

    // Slide 4: Core Principles
    {
      id: 4,
      title: 'Three Pillars of LexiChain',
      subtitle: 'The Strategic Foundation',
      content: (
        <div className="grid grid-cols-3 gap-8 px-12 py-8 h-full items-center">
          {[
            {
              icon: Brain,
              title: 'Intelligence',
              description: 'AI-driven analysis that understands nuance, extracts relationships, and delivers contextual insights from complex financial documents.',
              color: 'from-blue-500 to-blue-600',
              light: 'bg-blue-50',
              border: 'border-blue-200',
            },
            {
              icon: Blocks,
              title: 'Immutability',
              description: 'Blockchain notarization ensures cryptographic proof of document existence, creation timestamp, and integrity—enabling regulatory compliance and non-repudiation.',
              color: 'from-cyan-500 to-teal-600',
              light: 'bg-cyan-50',
              border: 'border-cyan-200',
            },
            {
              icon: Shield,
              title: 'Security',
              description: 'Enterprise-grade authentication, encryption-at-rest, and zero-knowledge architecture protect sensitive financial data across all layers.',
              color: 'from-emerald-500 to-green-600',
              light: 'bg-emerald-50',
              border: 'border-emerald-200',
            },
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`${pillar.light} rounded-2xl p-8 border ${pillar.border} hover:shadow-lg transition-shadow`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                <pillar.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },

    // Slide 5: System Architecture
    {
      id: 5,
      title: 'System Architecture',
      subtitle: 'Five-Tier Distributed Intelligence',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <motion.div className="space-y-4">
            {[
              {
                layer: 'Presentation Layer',
                tech: 'Next.js 15 + React 19',
                desc: 'Server Components for performance, dynamic client interactions',
                icon: '🎨',
                color: 'from-purple-500 to-pink-500',
              },
              {
                layer: 'Application Layer',
                tech: 'Node.js + Express',
                desc: 'RESTful APIs, business logic orchestration, request validation',
                icon: '⚙️',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                layer: 'AI/ML Services Layer',
                tech: 'Gemini 2.0 Flash + LangChain',
                desc: 'Document analysis, RAG pipeline, embedding generation, inference',
                icon: '🧠',
                color: 'from-amber-500 to-orange-500',
              },
              {
                layer: 'Blockchain Layer',
                tech: 'Ethereum + Solidity Smart Contracts',
                desc: 'Document notarization, immutable audit trail, non-repudiation',
                icon: '⛓️',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                layer: 'Data Layer',
                tech: 'PostgreSQL + Prisma ORM',
                desc: 'Relational data, ACID compliance, vector embeddings',
                icon: '💾',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-r ${item.color} rounded-xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-start gap-6">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold mb-1">{item.layer}</h4>
                    <p className="text-sm font-semibold opacity-90 mb-2">{item.tech}</p>
                    <p className="text-sm opacity-85">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },

    // Slide 6: Technology Stack - Frontend
    {
      id: 6,
      title: 'Technology Stack',
      subtitle: 'Frontend: Performance & User Experience',
      content: (
        <div className="grid grid-cols-2 gap-8 px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Next.js 15 App Router</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-gray-700">Server Components for zero-JS overhead on initial load</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-gray-700">Incremental Static Regeneration for dynamic content</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-gray-700">Turbopack bundler for sub-second builds</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-gray-700">Built-in Image Optimization via next/image</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">React 19 + Tailwind CSS</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <p className="text-gray-700">React Compiler for automatic optimization</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <p className="text-gray-700">Actions API for seamless client-server communication</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <p className="text-gray-700">Utility-first CSS for rapid, maintainable UI</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                <p className="text-gray-700">Responsive design out of the box</p>
              </div>
            </div>
          </motion.div>
        </div>
      ),
      gradient: 'from-blue-50 to-indigo-50',
    },

    // Slide 7: Technology Stack - AI
    {
      id: 7,
      title: 'Technology Stack',
      subtitle: 'AI & ML: Intelligent Document Processing',
      content: (
        <div className="px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-10 border border-amber-200 mb-8"
          >
            <div className="flex items-start gap-8">
              <Zap className="w-12 h-12 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Google Gemini 2.0 Flash</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Why Gemini 2.0?</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Sub-second latency on 50k+ token documents</li>
                      <li>✓ Superior understanding of tables & financial data</li>
                      <li>✓ Multimodal: processes PDFs, images, structured data</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Architecture</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Streaming responses for real-time feedback</li>
                      <li>✓ Function calling for structured extraction</li>
                      <li>✓ Parallel processing for batch operations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-200"
            >
              <Brain className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-4">LangChain + LangGraph</h4>
              <p className="text-gray-700">
                Orchestrates multi-step document analysis workflows, manages context windows, implements agentic loops for iterative refinement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-cyan-50 rounded-2xl p-8 border border-cyan-200"
            >
              <Network className="w-10 h-10 text-cyan-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-4">Vector Embeddings & Semantic Search</h4>
              <p className="text-gray-700">
                Converts documents into semantic vectors using Gemini embeddings API. Enables similarity-based retrieval for RAG pipeline.
              </p>
            </motion.div>
          </div>
        </div>
      ),
      gradient: 'from-amber-50 to-orange-50',
    },

    // Slide 8: Technology Stack - Backend & Data
    {
      id: 8,
      title: 'Technology Stack',
      subtitle: 'Backend Infrastructure & Data Persistence',
      content: (
        <div className="grid grid-cols-2 gap-8 px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">PostgreSQL + Prisma ORM</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">PostgreSQL</p>
                <p className="text-gray-700 text-sm mb-4">Relational database with ACID compliance. pgvector extension enables vector similarity search within database—reducing network overhead.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Prisma ORM</p>
                <p className="text-gray-700 text-sm">Type-safe database access, automatic migrations, real-time subscriptions, and type inference for queries.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Clerk Authentication</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Enterprise Auth</p>
                <p className="text-gray-700 text-sm mb-4">Multi-factor authentication, SSO, SAML integration. Passwordless sign-in for enhanced security and user experience.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Compliance Ready</p>
                <p className="text-gray-700 text-sm">SOC 2, GDPR, HIPAA compliant. Session management with secure HTTP-only cookies.</p>
              </div>
            </div>
          </motion.div>
        </div>
      ),
      gradient: 'from-emerald-50 to-teal-50',
    },

    // Slide 9: Blockchain Integration
    {
      id: 9,
      title: 'Blockchain Architecture',
      subtitle: 'Ethereum + Solidity Smart Contracts',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl mb-8"
          >
            <Blocks className="w-16 h-16 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Document Notarization Protocol</h2>
            <p className="text-lg font-light leading-relaxed">
              Every document is registered on Ethereum blockchain via custom smart contract. Creates cryptographic proof of document existence, timestamp, and integrity—enabling regulatory compliance and non-repudiation in dispute scenarios.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                title: 'Contract Registration',
                desc: 'Document hash stored immutably with creation timestamp',
              },
              {
                title: 'Proof of Existence',
                desc: 'Cryptographic commitment prevents backdating or modification',
              },
              {
                title: 'Audit Trail',
                desc: 'Transparent blockchain history for regulatory verification',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      gradient: 'from-indigo-50 to-purple-50',
    },

    // Slide 10: RAG Pipeline
    {
      id: 10,
      title: 'Retrieval-Augmented Generation',
      subtitle: 'The Engine Behind Contextual Intelligence',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <motion.div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Document Ingestion',
                desc: 'PDF parsed into semantic chunks. Preserves document structure, tables, and relationships.',
                icon: FileText,
              },
              {
                step: '2',
                title: 'Semantic Embedding',
                desc: 'Each chunk converted to vector representation using Gemini embeddings API. Captures semantic meaning.',
                icon: Brain,
              },
              {
                step: '3',
                title: 'Vector Storage',
                desc: 'Embeddings stored in PostgreSQL pgvector extension. Enables lightning-fast similarity search.',
                icon: Cpu,
              },
              {
                step: '4',
                title: 'Intelligent Retrieval',
                desc: 'User query converted to vector. K-nearest neighbors search returns contextually relevant chunks.',
                icon: Search,
              },
              {
                step: '5',
                title: 'Grounded Generation',
                desc: 'LLM synthesizes answer from retrieved context. No hallucinations, only document-backed responses.',
                icon: Lightbulb,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-grow bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
      gradient: 'from-blue-50 to-cyan-50',
    },

    // Slide 11: Why RAG Matters
    {
      id: 11,
      title: 'Why RAG Eliminates Hallucinations',
      subtitle: 'Grounding LLM Responses in Ground Truth',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-300"
            >
              <h3 className="text-2xl font-bold text-red-900 mb-6">Without RAG: The Problem</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-gray-700">LLM generates plausible but false answers based on training data patterns</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-gray-700">Financial domain requires 100% accuracy—no room for confident guesses</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <p className="text-gray-700">Cannot cite document sources or provide audit trail for answers</p>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-300"
            >
              <h3 className="text-2xl font-bold text-emerald-900 mb-6">With RAG: The Solution</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <p className="text-gray-700">LLM only combines explicitly retrieved document chunks—verifiable answers</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <p className="text-gray-700">100% accuracy: never generates information outside document scope</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <p className="text-gray-700">Full provenance: cite exact document sections, enable audit compliance</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },

    // Slide 12: Document Processing Flow
    {
      id: 12,
      title: 'End-to-End Document Workflow',
      subtitle: 'From Upload to Verified Intelligence',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <motion.div className="space-y-4">
            {[
              {
                phase: 'Upload & Validation',
                items: ['User uploads PDF', 'Virus scan', 'File type verification', 'Size validation (max 100MB)'],
                color: 'from-blue-500 to-cyan-500',
              },
              {
                phase: 'AI Analysis',
                items: ['Gemini processes entire document', 'Extracts structured data', 'Identifies key entities', 'Generates semantic summary'],
                color: 'from-amber-500 to-orange-500',
              },
              {
                phase: 'Blockchain Registration',
                items: ['Document hash created', 'Smart contract deployment', 'Transaction on Ethereum', 'Proof of existence recorded'],
                color: 'from-indigo-500 to-purple-500',
              },
              {
                phase: 'Storage & Indexing',
                items: ['Raw document in PostgreSQL', 'Embeddings in pgvector', 'Metadata indexed', 'Ready for query'],
                color: 'from-emerald-500 to-green-500',
              },
            ].map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-r ${phase.color} rounded-xl p-6 text-white shadow-lg`}
              >
                <h4 className="text-xl font-bold mb-4">{phase.phase}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-light">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },

    // Slide 13: Architecture Pattern - Feature-Sliced Design
    {
      id: 13,
      title: 'Enterprise Architecture Pattern',
      subtitle: 'Feature-Sliced Design for Scalability',
      content: (
        <div className="px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 border border-slate-200 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Modular, Scalable Structure</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              LexiChain uses Feature-Sliced Architecture (FSA)—a methodology that organizes code by feature domains rather than technical layers. Each feature is self-contained with its own UI, logic, API routes, and database models.
            </p>
            <div className="grid grid-cols-4 gap-4">
              {['Documents', 'Analytics', 'Blockchain', 'Users'].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 text-center">
                  <p className="font-semibold text-gray-900">{feature}</p>
                  <p className="text-xs text-gray-600 mt-2">Self-contained feature</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                title: 'Benefits',
                items: ['Parallel team development', 'Feature isolation', 'Easy testing'],
              },
              {
                title: 'Code Organization',
                items: ['UI Components', 'Business Logic', 'API Routes', 'Database Models'],
              },
              {
                title: 'Scalability',
                items: ['Add features without refactoring', 'Micro-feature deployment', 'Independent versioning'],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <h4 className="font-bold text-gray-900 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      gradient: 'from-slate-50 to-slate-100',
    },

    // Slide 14: Security & Compliance
    {
      id: 14,
      title: 'Security & Privacy Architecture',
      subtitle: 'Enterprise-Grade Protection',
      content: (
        <div className="grid grid-cols-2 gap-8 px-12 py-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200"
          >
            <Shield className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Authentication & Authorization</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                Multi-factor authentication (MFA) required
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                Role-based access control (RBAC)
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                OAuth2 + OpenID Connect
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                Passwordless authentication option
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200"
          >
            <Lock className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Protection & Compliance</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                Encryption at rest (AES-256)
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                TLS 1.3 for data in transit
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                GDPR data deletion workflows
              </li>
              <li className="flex gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                SOX audit log retention
              </li>
            </ul>
          </motion.div>
        </div>
      ),
      gradient: 'from-blue-50 to-cyan-50',
    },

    // Slide 15: Why LexiChain - Impact
    {
      id: 15,
      title: 'Why LexiChain Wins',
      subtitle: 'Competitive Advantages & Market Position',
      content: (
        <div className="px-12 py-8 h-full flex flex-col justify-center">
          <motion.div className="grid grid-cols-2 gap-8 mb-8">
            {[
              {
                category: 'AI Innovation',
                points: [
                  'Gemini 2.0 processes 50k+ token documents in <1 second',
                  'RAG eliminates hallucinations with document-grounded answers',
                  'Multi-modal understanding of tables, charts, and text',
                ],
              },
              {
                category: 'Blockchain Integration',
                points: [
                  'First financial platform with Ethereum document notarization',
                  'Immutable proof of existence for regulatory compliance',
                  'Non-repudiation capabilities for dispute resolution',
                ],
              },
              {
                category: 'Architecture Excellence',
                points: [
                  'Feature-Sliced Design for enterprise scalability',
                  'Type-safe full-stack with TypeScript end-to-end',
                  'Server Components reduce client-side JS by 70%',
                ],
              },
              {
                category: 'Market Readiness',
                points: [
                  'SOX, GDPR, HIPAA compliant infrastructure',
                  'Enterprise authentication with Clerk SSO',
                  'Zero-knowledge data architecture',
                ],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.category}</h3>
                <ul className="space-y-2">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-10 text-white text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-3">LexiChain: The Future of Financial Intelligence</h2>
            <p className="text-lg font-light">
              Where AI meets blockchain to transform financial document intelligence into a competitive advantage.
            </p>
          </motion.div>
        </div>
      ),
      gradient: 'from-gray-50 to-gray-100',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentSlideData.gradient} overflow-hidden`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-gray-900">LexiChain Presentation</span>
        </div>
        <div className="text-sm text-gray-600">
          {currentSlide + 1} / {slides.length}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-24 h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full flex flex-col justify-center"
          >
            {/* Slide Title */}
            <div className="text-center mb-8">
              {currentSlideData.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-2"
                >
                  {currentSlideData.subtitle}
                </motion.p>
              )}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold text-gray-900 mb-8"
              >
                {currentSlideData.title}
              </motion.h1>
            </div>

            {/* Slide Content */}
            <div className="flex-grow flex items-center">{currentSlideData.content}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 px-8 py-6 flex items-center justify-between">
        <button
          onClick={prevSlide}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 w-3 hover:bg-gray-400'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}

// Add the missing Search icon
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
