'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Zap,
  Brain,
  Lock,
  Network,
  FileText,
  BarChart3,
  Lightbulb,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Workflow,
  Eye,
  Database,
  Code,
  Cpu,
  Settings,
  Target,
  Star,
  Sparkles,
  Shield,
  Play,
} from 'lucide-react';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function LexiChainPresentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: 'LexiChain',
      subtitle: 'Intelligence Artificielle & Blockchain pour la Finance',
      bg: 'from-blue-900 via-cyan-800 to-teal-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center h-full gap-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-7xl font-black text-white mb-4 tracking-tighter">
              LexiChain
            </h1>
            <p className="text-2xl text-cyan-100 font-light">
              Révolutionner l&apos;analyse documentaire en finance
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 mt-8"
          >
            {[
              { icon: Brain, label: 'Intelligence', color: 'bg-blue-500' },
              { icon: Shield, label: 'Sécurité', color: 'bg-cyan-500' },
              { icon: Network, label: 'Blockchain', color: 'bg-teal-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center gap-3"
              >
                <div className={`${item.color} p-4 rounded-2xl`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-cyan-200 text-lg max-w-2xl">
              Analyse intelligente des documents financiers avec immuabilité
              blockchain et audit trail complet
            </p>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 2: The Challenge
    {
      id: 2,
      title: 'Le Défi du Marché',
      subtitle: 'Problèmes actuels en Finance',
      bg: 'from-red-900 via-red-800 to-pink-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-8 h-full items-center"
        >
          {[
            {
              icon: FileText,
              title: 'Documents Statiques',
              desc: 'Les PDFs offrent zéro analyse intelligente et requièrent une vérification manuelle coûteuse',
            },
            {
              icon: AlertCircle,
              title: 'Lacunes d\'Intégrité',
              desc: 'Impossible de vérifier l\'authenticité des documents ou de détecter les modifications',
            },
            {
              icon: TrendingUp,
              title: 'Friction Opérationnelle',
              desc: 'Les processus manuels ralentissent les deals, retardent la conformité et augmentent les risques',
            },
            {
              icon: Lock,
              title: 'Défis de Conformité',
              desc: 'GDPR, MiFID II, AML/KYC nécessitent des audit trails immuables et traçables',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 p-6 rounded-2xl hover:bg-opacity-20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-500 bg-opacity-80 p-3 rounded-xl flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-red-100 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 3: The Solution
    {
      id: 3,
      title: 'La Solution',
      subtitle: 'De Documents Statiques à Analyse Dynamique',
      bg: 'from-green-900 via-emerald-800 to-teal-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 h-full justify-center"
        >
          <motion.div variants={itemVariants} className="text-center mb-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              La Transformation LexiChain
            </h2>
            <p className="text-emerald-100 text-lg">
              Convertissez les documents en intelligence actionnable
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-around gap-8">
            <div className="text-center">
              <div className="bg-red-500 bg-opacity-60 p-8 rounded-3xl mb-4">
                <FileText className="w-12 h-12 text-white mx-auto" />
              </div>
              <p className="text-white font-semibold text-lg">Avant</p>
              <p className="text-emerald-100 text-sm mt-2">PDFs statiques</p>
              <p className="text-emerald-100 text-sm">Vérification manuelle</p>
            </div>

            <div className="mt-8">
              <ArrowRight className="w-12 h-12 text-emerald-300 animate-bounce" />
            </div>

            <div className="text-center">
              <div className="bg-emerald-500 bg-opacity-60 p-8 rounded-3xl mb-4">
                <Brain className="w-12 h-12 text-white mx-auto" />
              </div>
              <p className="text-white font-semibold text-lg">Après</p>
              <p className="text-emerald-100 text-sm mt-2">Analyse IA intelligente</p>
              <p className="text-emerald-100 text-sm">Blockchain notarisation</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-8">
            {[
              { label: 'Extraction 10x plus rapide', icon: Zap },
              { label: 'Audit trail immuable', icon: Lock },
              { label: 'Conformité garantie', icon: CheckCircle2 },
            ].map((item, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 p-4 rounded-xl text-center">
                <item.icon className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 4: Three Pillars
    {
      id: 4,
      title: 'Les Trois Piliers',
      subtitle: 'Architecture Fondamentale',
      bg: 'from-purple-900 via-purple-800 to-pink-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-8 h-full items-center"
        >
          {[
            {
              icon: Brain,
              title: 'Intelligence',
              color: 'from-blue-500 to-cyan-400',
              points: [
                'Gemini 2.0 Flash pour l\'extraction précise',
                'Traitement de documents longs (100k+ tokens)',
                'Extraction d\'entités financières complexes',
                'Validation croisée multi-modèle',
              ],
            },
            {
              icon: Lock,
              title: 'Immuabilité',
              color: 'from-purple-500 to-pink-400',
              points: [
                'Blockchain Ethereum pour la notarisation',
                'Hash SHA-256 des documents',
                'Proof of Existence immuable',
                'Non-repudiation légale',
              ],
            },
            {
              icon: Shield,
              title: 'Sécurité',
              color: 'from-green-500 to-emerald-400',
              points: [
                'Chiffrement end-to-end des données',
                'Authentification Clerk enterprise',
                'Row-Level Security PostgreSQL',
                'Conformité SOC 2 Type II',
              ],
            },
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`bg-gradient-to-b ${pillar.color} p-8 rounded-3xl text-white transform hover:scale-105 transition-transform duration-300`}
            >
              <pillar.icon className="w-12 h-12 mb-4 text-white opacity-90" />
              <h3 className="text-2xl font-bold mb-6">{pillar.title}</h3>
              <ul className="space-y-3">
                {pillar.points.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 5: Architecture
    {
      id: 5,
      title: 'Architecture Système',
      subtitle: 'Design 5 couches',
      bg: 'from-slate-900 via-slate-800 to-blue-900',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 h-full justify-center"
        >
          {[
            {
              layer: 'Présentation',
              tech: 'Next.js 15 + React 19 + Tailwind CSS',
              icon: Code,
              color: 'from-blue-600 to-blue-400',
            },
            {
              layer: 'Application',
              tech: 'API Routes + Server Actions',
              icon: Layers,
              color: 'from-cyan-600 to-cyan-400',
            },
            {
              layer: 'Intelligence',
              tech: 'Gemini 2.0 Flash + LangChain + RAG',
              icon: Brain,
              color: 'from-purple-600 to-purple-400',
            },
            {
              layer: 'Immuabilité',
              tech: 'Smart Contracts Solidity + Ethereum',
              icon: Network,
              color: 'from-orange-600 to-orange-400',
            },
            {
              layer: 'Données',
              tech: 'PostgreSQL + Prisma + Row-Level Security',
              icon: Database,
              color: 'from-green-600 to-green-400',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex items-center gap-6 bg-gradient-to-r ${item.color} p-6 rounded-2xl`}
            >
              <item.icon className="w-8 h-8 text-white flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg">{item.layer}</h4>
                <p className="text-white text-sm opacity-90">{item.tech}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-white opacity-60 flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 6: RAG Pipeline
    {
      id: 6,
      title: 'RAG Pipeline',
      subtitle: 'Retrieval-Augmented Generation',
      bg: 'from-indigo-900 via-purple-900 to-pink-800',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              Pipeline RAG 5 Étapes
            </h2>
            <p className="text-purple-200">
              Pas d&apos;hallucinations, réponses précises et défendables juridiquement
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-5 gap-4">
            {[
              {
                step: '1',
                title: 'Ingestion',
                desc: 'Upload PDF → Parsing chimique et structurel',
              },
              {
                step: '2',
                title: 'Chunking',
                desc: 'Segmentation intelligente → Chunks contextuels',
              },
              {
                step: '3',
                title: 'Embedding',
                desc: 'Vecteurs haute dimension → Semantic search',
              },
              {
                step: '4',
                title: 'Retrieval',
                desc: 'Recherche vectorielle → Context window',
              },
              {
                step: '5',
                title: 'Génération',
                desc: 'Gemini + context → Réponse précise',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 p-4 rounded-2xl text-center hover:bg-opacity-15 transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full text-white font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-purple-200 text-xs leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white bg-opacity-5 border border-pink-400 border-opacity-30 p-6 rounded-2xl mt-8">
            <div className="flex gap-4">
              <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h4 className="text-white font-bold mb-2">Avantage RAG</h4>
                <p className="text-purple-200 text-sm">
                  Le RAG garantit que les réponses sont ancrées dans les documents fournis,
                  éliminant les hallucinations et fournissant une traçabilité complète pour
                  l&apos;audit et la conformité réglementaire.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 7: Blockchain Flow
    {
      id: 7,
      title: 'Flux Blockchain',
      subtitle: 'Notarisation & Immuabilité',
      bg: 'from-orange-900 via-amber-800 to-yellow-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-8"
          >
            {[
              {
                title: 'Document Upload',
                desc: 'Utilisateur upload un PDF',
              },
              {
                title: 'Hash Calculation',
                desc: 'Calcul SHA-256 du contenu',
              },
              {
                title: 'Smart Contract Call',
                desc: 'Appel de registerDocument()',
              },
              {
                title: 'Block Confirmation',
                desc: 'Confirmation blockchain Ethereum',
              },
              {
                title: 'Immutable Record',
                desc: 'Enregistrement permanent cryptographique',
              },
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  variants={itemVariants}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-2xl text-white"
                >
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-orange-100 text-sm">{item.desc}</p>
                </motion.div>
                {idx < 4 && (
                  <motion.div
                    variants={itemVariants}
                    className="text-3xl text-amber-400"
                  >
                    ↓
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white bg-opacity-10 border border-amber-400 border-opacity-30 p-6 rounded-2xl"
          >
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <div>
                <h4 className="text-white font-bold mb-2">Avantages Web3</h4>
                <ul className="text-orange-100 text-sm space-y-1">
                  <li>✓ Preuve de l&apos;existence à une date donnée</li>
                  <li>✓ Non-repudiation légale (impossible de nier l&apos;upload)</li>
                  <li>✓ Détection de modification (hash change)</li>
                  <li>✓ Audit trail transparent et immuable</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 8: Technology Stack
    {
      id: 8,
      title: 'Stack Technologique',
      subtitle: 'Pourquoi chaque technologie',
      bg: 'from-cyan-900 via-teal-800 to-blue-900',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-8"
        >
          {[
            {
              category: 'Frontend',
              techs: [
                { name: 'Next.js 15', why: 'Server Components + performance maximale' },
                { name: 'React 19', why: 'Hooks modernes et optimisations' },
                { name: 'Tailwind CSS', why: 'Thèming cohérent et responsive design' },
              ],
            },
            {
              category: 'IA & ML',
              techs: [
                { name: 'Gemini 2.0 Flash', why: 'Traitement documents longs ultra-rapide' },
                { name: 'LangChain', why: 'Orchestration RAG et chaînes d\'appels' },
                { name: 'Embeddings Google', why: 'Vectorisation de haute qualité' },
              ],
            },
            {
              category: 'Backend',
              techs: [
                { name: 'PostgreSQL', why: 'Conformité ACID et RLS pour sécurité' },
                { name: 'Prisma ORM', why: 'Type-safe queries et migrations' },
                { name: 'Clerk Auth', why: 'Enterprise-grade auth avec MFA' },
              ],
            },
            {
              category: 'Blockchain',
              techs: [
                { name: 'Ethereum L2', why: 'Frais bas et transactions rapides' },
                { name: 'Solidity', why: 'Smart contracts pour registre immuable' },
                { name: 'Web3.js', why: 'Interaction avec la blockchain' },
              ],
            },
          ].map((category, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.techs.map((tech, i) => (
                  <div
                    key={i}
                    className="bg-white bg-opacity-10 backdrop-blur-lg p-4 rounded-xl hover:bg-opacity-15 transition-all"
                  >
                    <p className="text-white font-semibold mb-1">{tech.name}</p>
                    <p className="text-cyan-200 text-sm">{tech.why}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 9: Document Workflow
    {
      id: 9,
      title: 'Flux de Travail Complet',
      subtitle: 'De l\'Upload à l\'Analyse',
      bg: 'from-green-900 via-emerald-800 to-cyan-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {[
            {
              num: '1',
              phase: 'Upload & Validation',
              details: [
                'PDF upload via interface sécurisée',
                'Vérification du format et de la taille',
                'Scan anti-malware',
              ],
            },
            {
              num: '2',
              phase: 'Traitement Blockchain',
              details: [
                'Calcul du hash SHA-256',
                'Enregistrement smart contract',
                'Attente de confirmation (2-5min)',
              ],
            },
            {
              num: '3',
              phase: 'Extraction Intelligente',
              details: [
                'Parsing avec Gemini 2.0 Flash',
                'Extraction d\'entités clés',
                'Validation de conformité',
              ],
            },
            {
              num: '4',
              phase: 'Indexation RAG',
              details: [
                'Découpage en chunks contextuels',
                'Génération de vecteurs embeddings',
                'Stockage en base vectorielle',
              ],
            },
            {
              num: '5',
              phase: 'Rapports & Insights',
              details: [
                'Génération de rapport d\'analyse',
                'Dashboard avec métriques clés',
                'Audit trail traçable',
              ],
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex gap-6 items-start"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {item.num}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-3">{item.phase}</h3>
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                      <span className="text-green-100 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 10: Competitive Advantages
    {
      id: 10,
      title: 'Avantages Compétitifs',
      subtitle: 'Pourquoi LexiChain gagne',
      bg: 'from-violet-900 via-purple-800 to-pink-700',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-8 h-full items-center"
        >
          {[
            {
              title: 'Innovation IA',
              icon: Brain,
              points: [
                'Gemini 2.0 Flash pour documents longs',
                'RAG élimine les hallucinations',
                'Extraction 10x plus rapide que manuelle',
              ],
            },
            {
              title: 'Innovation Blockchain',
              icon: Network,
              points: [
                'Smart contracts pour immuabilité',
                'Preuve cryptographique de date',
                'Audit trail transparent',
              ],
            },
            {
              title: 'Architecture Enterprise',
              icon: Layers,
              points: [
                'Feature-Sliced Design scalable',
                'Row-Level Security PostgreSQL',
                'Zero-Knowledge authentification',
              ],
            },
            {
              title: 'Prêt Production',
              icon: CheckCircle2,
              points: [
                'Conformité GDPR/MiFID II/SOC 2',
                'Déploiement Vercel enterprise',
                'Monitoring et alertes 24/7',
              ],
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-br from-white from-10% to-transparent p-8 rounded-3xl border border-white border-opacity-20"
            >
              <item.icon className="w-12 h-12 text-violet-400 mb-4" />
              <h3 className="text-white font-bold text-2xl mb-6">{item.title}</h3>
              <ul className="space-y-4">
                {item.points.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-100 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 11: Use Cases
    {
      id: 11,
      title: 'Cas d\'Usage Clés',
      subtitle: 'Secteurs d\'Application',
      bg: 'from-sky-900 via-blue-800 to-indigo-900',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-8 h-full items-center"
        >
          {[
            {
              title: 'Due Diligence M&A',
              icon: Eye,
              description:
                'Analyse rapide des data rooms, identification des risques légaux, vérification de conformité',
              roi: 'Gain: 200+ heures par deal',
            },
            {
              title: 'KYC / AML',
              icon: Shield,
              description:
                'Vérification documentaire automatisée, détection d\'incohérences, alertes conformité',
              roi: 'Gain: 50% temps auditeur',
            },
            {
              title: 'Audit & Compliance',
              icon: CheckCircle2,
              description:
                'Audit trail immuable, traçabilité complète des modifications, rapports automatisés',
              roi: 'Gain: 80% audit manuel',
            },
          ].map((usecase, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-gradient-to-b from-blue-600 to-indigo-600 p-8 rounded-3xl text-white hover:shadow-2xl transition-shadow"
            >
              <usecase.icon className="w-14 h-14 mb-6 text-cyan-300" />
              <h3 className="text-2xl font-bold mb-4">{usecase.title}</h3>
              <p className="text-blue-100 mb-6 leading-relaxed text-sm">
                {usecase.description}
              </p>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center">
                <p className="text-cyan-200 font-semibold text-sm">{usecase.roi}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ),
    },

    // Slide 12: Sécurité & Conformité
    {
      id: 12,
      title: 'Sécurité & Conformité',
      subtitle: 'Standards Enterprise',
      bg: 'from-red-950 via-red-900 to-orange-900',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6">
            {[
              { label: 'GDPR', icon: Lock },
              { label: 'MiFID II', icon: CheckCircle2 },
              { label: 'SOC 2 Type II', icon: Shield },
              { label: 'ISO 27001', icon: Eye },
            ].map((item, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 p-4 rounded-xl text-center">
                <item.icon className="w-8 h-8 text-red-300 mx-auto mb-3" />
                <p className="text-white font-bold text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
            {[
              {
                title: 'Chiffrement',
                items: [
                  'TLS 1.3 en transit',
                  'AES-256 au repos',
                  'End-to-end pour sensibles',
                ],
              },
              {
                title: 'Authentification',
                items: [
                  'Clerk with MFA',
                  'OAuth 2.0 / OIDC',
                  'Session management sécurisé',
                ],
              },
              {
                title: 'Base de Données',
                items: [
                  'Row-Level Security',
                  'Parameterized queries',
                  'Backup & recovery 24h',
                ],
              },
              {
                title: 'Monitoring',
                items: [
                  'Sentry pour erreurs',
                  'PostHog analytics',
                  'Alertes temps réel',
                ],
              },
            ].map((category, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white bg-opacity-10 p-6 rounded-2xl border border-red-500 border-opacity-30"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-red-100 text-sm flex gap-2">
                      <span className="text-red-400">•</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 13: Future Vision
    {
      id: 13,
      title: 'Vision Futur',
      subtitle: 'Roadmap 2026-2027',
      bg: 'from-indigo-950 via-purple-900 to-violet-800',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {[
            {
              period: 'Q2 2026',
              items: [
                'Support multi-chain (Polygon, Arbitrum)',
                'Intégration Reuters / Bloomberg API',
                'Dashboard analytics avancé',
              ],
            },
            {
              period: 'H2 2026',
              items: [
                'Vision IA (document scanning)',
                'Signature digitale blockchain',
                'API publique et marketplace',
              ],
            },
            {
              period: '2027',
              items: [
                'DAO governance pour évolution',
                'Token économique et staking',
                'Expansion APAC & Europe de l\'Est',
              ],
            },
          ].map((roadmap, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                {roadmap.period}
              </h3>
              <ul className="space-y-3">
                {roadmap.items.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-3 h-3 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                    <span className="text-purple-100 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 p-6 rounded-2xl mt-8"
          >
            <p className="text-white font-bold text-lg text-center">
              "Révolutionner la finance digitale avec IA & Blockchain"
            </p>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 14: Conclusion
    {
      id: 14,
      title: 'Conclusion',
      subtitle: 'Pourquoi Maintenant ?',
      bg: 'from-black via-slate-900 to-blue-900',
      content: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center h-full gap-8"
        >
          <motion.div variants={itemVariants} className="text-center max-w-2xl">
            <h2 className="text-5xl font-black text-white mb-6">
              LexiChain est Prêt
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Une combinaison unique d&apos;innovation IA, blockchain, et architecture
              enterprise. Pas de prototype — production-ready avec conformité complète.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6">
            {[
              { num: '5', label: 'Couches Architecture' },
              { num: '10x', label: 'Plus Rapide' },
              { num: '0', label: 'Hallucinations' },
              { num: '∞', label: 'Audit Trail' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <p className="text-5xl font-black text-cyan-400 mb-2">
                  {item.num}
                </p>
                <p className="text-slate-300 text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-slate-400 text-center">
              Questions ? Contactez-nous pour une démo technique
            </p>
          </motion.div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slides[current].bg} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex flex-col p-20 relative z-10"
        >
          {/* Header */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-white mb-2"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white text-opacity-70"
            >
              {slides[current].subtitle}
            </motion.p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent mt-4 rounded-full" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{slides[current].content}</div>

          {/* Footer */}
          <div className="mt-12 flex justify-between items-center">
            <p className="text-white text-opacity-60 text-sm font-medium">
              LexiChain Présentation Technique
            </p>
            <p className="text-white text-opacity-60 font-mono">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8 items-center z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="bg-white bg-opacity-20 hover:bg-opacity-40 backdrop-blur-lg border border-white border-opacity-30 p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current
                  ? 'bg-white w-8'
                  : 'bg-white bg-opacity-40 hover:bg-opacity-60'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="bg-white bg-opacity-20 hover:bg-opacity-40 backdrop-blur-lg border border-white border-opacity-30 p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Keyboard Navigation */}
      {typeof window !== 'undefined' &&
        React.useEffect(() => {
          const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') paginate(-1);
            if (e.key === 'ArrowRight') paginate(1);
          };
          window.addEventListener('keydown', handleKeyPress);
          return () => window.removeEventListener('keydown', handleKeyPress);
        }, [current])}
    </div>
  );
}
