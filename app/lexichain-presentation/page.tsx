'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Shield,
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
  GitNetwork,
  Settings,
  Target,
  Star,
  Sparkles,
} from 'lucide-react';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
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
    transition: { duration: 0.6 },
  },
};

// Slide Components
const TitleSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center justify-center">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 text-center px-6 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl"
          >
            <GitNetwork className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 mb-6">
          LexiChain
        </h1>
        <p className="text-2xl md:text-3xl text-cyan-300 font-light">
          Révolutionner l&apos;analyse des documents financiers avec l&apos;IA et la Blockchain
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">15+</div>
            <p className="text-gray-400 text-sm">Fonctionnalités Innovantes</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-300 mb-2">99.9%</div>
            <p className="text-gray-400 text-sm">Précision d&apos;Analyse</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-300 mb-2">Web3</div>
            <p className="text-gray-400 text-sm">Technologie Blockchain</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-16">
        <p className="text-gray-400 text-lg">
          Plateforme d&apos;intelligence artificielle avancée pour l&apos;analyse,
          <br />
          la sécurisation et la certification des documents financiers
        </p>
      </motion.div>
    </motion.div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
    >
      <ChevronRight className="w-6 h-6 text-cyan-400 rotate-90" />
    </motion.div>
  </div>
);

const ChallengeSide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Le Défi</h2>
        <p className="text-xl text-gray-400">
          Les défis critiques du secteur financier moderne
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            icon: AlertCircle,
            title: 'Documents Statiques',
            description:
              'Les PDF et documents papier ne permettent pas une analyse intelligente en temps réel. Les données restent figées, sans contexte dynamique.',
            color: 'from-red-500 to-orange-500',
          },
          {
            icon: Lock,
            title: 'Intégrité Compromise',
            description:
              'Aucune garantie d\'authenticité pour les documents modifiés. Les fraudeurs exploitent l\'absence de notarisation numérique.',
            color: 'from-orange-500 to-yellow-500',
          },
          {
            icon: Zap,
            title: 'Friction Opérationnelle',
            description:
              'Les processus manuels d\'analyse consomment 40+ heures par semaine. Les délais de traitement affectent la conformité réglementaire.',
            color: 'from-yellow-500 to-amber-500',
          },
          {
            icon: Eye,
            title: 'Conformité Invisible',
            description:
              'Absence de traçabilité complète. Les auditeurs ne peuvent pas prouver l\'accès et les modifications des documents.',
            color: 'from-amber-500 to-red-500',
          },
        ].map((challenge, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-700/50 hover:border-gray-600/80 transition-all duration-300"
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${challenge.color} p-4 mb-6 flex items-center justify-center`}>
              <challenge.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{challenge.title}</h3>
            <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Impact Métier</h4>
            <p className="text-gray-300">
              Sans solution, les institutions financières restent vulnérables aux fraudes, aux non-conformités réglementaires et à l&apos;inefficacité opérationnelle. Le coût annuel atteint des millions pour les grandes organisations.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const SolutionSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-1/4 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-5xl"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">La Solution</h2>
        <p className="text-xl text-gray-400">
          Une plateforme intelligente et sécurisée pour transformer l&apos;analyse documentaire
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 overflow-hidden">
          <motion.div
            animate={{
              background: [
                'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
                'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0"
          />
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-6">
              Documents Vivants, Sécurisés et Vérifiés
            </h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              LexiChain transforme les documents statiques en actifs intelligents. Notre plateforme combine l&apos;intelligence artificielle avancée avec la technologie blockchain pour créer un écosystème où chaque document est analysé, compris, notarisé et certifié. Les institutions financières bénéficient d&apos;une analyse instantanée, d&apos;une traçabilité immuable et d&apos;une conformité réglementaire garantie.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Brain,
            title: 'Intelligence Artificielle',
            text: 'Analyse approfondie avec compréhension contextuelle',
            color: 'from-purple-500 to-pink-500',
          },
          {
            icon: Shield,
            title: 'Blockchain',
            text: 'Notarisation immuable et vérification d\'authenticité',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            icon: Zap,
            title: 'Automatisation',
            text: 'Traitement en temps réel sans intervention manuelle',
            color: 'from-yellow-500 to-orange-500',
          },
        ].map((pillar, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-2xl bg-gradient-to-br ${pillar.color}/5 border-2 border-${pillar.color.split(' ')[1]}/30`}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} p-3 mb-6 flex items-center justify-center`}>
              <pillar.icon className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{pillar.title}</h4>
            <p className="text-gray-300">{pillar.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const ArchitectureSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Architecture Système</h2>
        <p className="text-xl text-gray-400">
          5 couches intégrées pour une solution complète et robuste
        </p>
      </motion.div>

      <div className="space-y-6">
        {[
          {
            layer: '1. Couche Présentation',
            tech: 'Next.js 15 + React 19 + Tailwind CSS',
            desc: 'Interface utilisateur moderne et performante avec Server Components pour le rendu côté serveur optimal.',
            icon: Code,
            color: 'from-cyan-500 to-blue-500',
          },
          {
            layer: '2. Couche Application',
            tech: 'APIs RESTful + Authentification Enterprise',
            desc: 'Couche métier avec Clerk Auth pour gérer les sessions utilisateur sécurisées et les autorisations granulaires.',
            icon: Layers,
            color: 'from-blue-500 to-purple-500',
          },
          {
            layer: '3. Couche IA & RAG',
            tech: 'Gemini 2.0 Flash + LangChain + Embeddings',
            desc: 'Système de Retrieval-Augmented Generation pour une analyse documentaire précise sans hallucinations.',
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
          },
          {
            layer: '4. Couche Blockchain',
            tech: 'Ethereum + Solidity Smart Contracts',
            desc: 'Notarisation immuable et vérification d\'authenticité décentralisée pour chaque document.',
            icon: GitNetwork,
            color: 'from-pink-500 to-red-500',
          },
          {
            layer: '5. Couche Données',
            tech: 'PostgreSQL + Prisma ORM + Vector DB',
            desc: 'Stockage persistant avec ACID compliance, gestion des embeddings vectoriels et indexation optimisée.',
            icon: Database,
            color: 'from-red-500 to-orange-500',
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ x: 10 }}
            className="group"
          >
            <div className={`p-8 rounded-2xl bg-gradient-to-r ${item.color}/5 border-2 border-${item.color.split(' ')[1]}/20 group-hover:border-${item.color.split(' ')[1]}/50 transition-all duration-300`}>
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} p-3 flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.layer}</h3>
                  <p className="text-blue-300 font-semibold mb-3">{item.tech}</p>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const RAGSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/3 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">
          Retrieval-Augmented Generation
        </h2>
        <p className="text-xl text-gray-400">
          L&apos;intelligence au cœur de LexiChain
        </p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-4 mb-12">
        {[
          {
            step: '1',
            name: 'Ingestion',
            icon: FileText,
            desc: 'Upload et parsing intelligent',
            details:
              'Les documents sont téléchargés et parsés automatiquement. Extraction des textes, images et métadonnées structurées.',
          },
          {
            step: '2',
            name: 'Segmentation',
            icon: Layers,
            desc: 'Division stratégique',
            details:
              'Les documents volumineux sont divisés en chunks sémantiquement cohérents pour optimiser la recherche et la précision.',
          },
          {
            step: '3',
            name: 'Embedding',
            icon: Cpu,
            desc: 'Vecteurs intelligents',
            details:
              'Chaque segment est converti en embedding vectoriel haute-dimension capturant le sens sémantique profond.',
          },
          {
            step: '4',
            name: 'Stockage',
            icon: Database,
            desc: 'Vector DB indexée',
            details:
              'Les embeddings sont stockés dans une base de données vectorielle avec indexation pour la recherche ultra-rapide.',
          },
          {
            step: '5',
            name: 'Génération',
            icon: Brain,
            desc: 'Réponses précises',
            details:
              'Gemini 2.0 Flash génère des réponses basées sur les documents pertinents, sans hallucination.',
          },
        ].map((step, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-800/30 to-pink-800/20 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 font-bold text-white text-lg">
              {step.step}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{step.name}</h4>
            <p className="text-sm text-gray-400 mb-3">{step.desc}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{step.details}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <div className="p-12 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Pourquoi RAG ?</h4>
              <p className="text-gray-200 leading-relaxed mb-4">
                Contrairement aux modèles classiques qui peuvent générer du contenu inexact, RAG ancre chaque réponse dans les documents réels de l&apos;utilisateur. Cette approche élimine les hallucinations, garantit la traçabilité et permet aux auditeurs de vérifier chaque affirmation.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Zéro Hallucination</p>
                <p className="text-sm text-gray-400">Basé uniquement sur les données réelles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Traçabilité Complète</p>
                <p className="text-sm text-gray-400">Source de chaque information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Réponses Précises</p>
                <p className="text-sm text-gray-400">Contexte riche et pertinent</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const BlockchainSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">
          Blockchain & Notarisation
        </h2>
        <p className="text-xl text-gray-400">
          L&apos;immuabilité au service de la confiance
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div variants={itemVariants}>
          <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30">
            <h3 className="text-3xl font-bold text-white mb-6">Flux de Notarisation</h3>
            <div className="space-y-6">
              {[
                {
                  num: '1',
                  title: 'Hachage du Document',
                  desc: 'SHA-256 du contenu du document',
                },
                {
                  num: '2',
                  title: 'Création d\'un Smart Contract',
                  desc: 'Enregistrement sur Ethereum mainnet',
                },
                {
                  num: '3',
                  title: 'Signature Numérique',
                  desc: 'Clé privée de l\'institution',
                },
                {
                  num: '4',
                  title: 'Certificat Immuable',
                  desc: 'Preuve de l\'existence et de l\'authenticité',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 font-bold text-white">
                    {item.num}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="p-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
            <h3 className="text-3xl font-bold text-white mb-6">Avantages Blockchain</h3>
            <div className="space-y-6">
              {[
                {
                  icon: Shield,
                  title: 'Immuabilité Garantie',
                  desc: 'Impossible de modifier sans laisser de traces',
                },
                {
                  icon: Eye,
                  title: 'Transparence Vérifiable',
                  desc: 'Chacun peut vérifier l\'authenticité',
                },
                {
                  icon: Lock,
                  title: 'Non-Répudiation',
                  desc: 'Preuve cryptographique de propriété',
                },
                {
                  icon: TrendingUp,
                  title: 'Conformité Réglementaire',
                  desc: 'Répond aux exigences GDPR et MiFID II',
                },
              ].map((item, idx) => (
                <motion.div key={idx} className="flex gap-4">
                  <item.icon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <div className="p-10 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 border-2 border-blue-500/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Web3 Native</h4>
              <p className="text-gray-200 leading-relaxed">
                En leverageant Ethereum mainnet, LexiChain offre une solution Web3 native. Chaque document est notarisé dans un registre décentralisé, inattaquable et transparent. Cela établit un nouveau standard pour la certification des documents financiers en finance décentralisée.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const StackSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Stack Technologique</h2>
        <p className="text-xl text-gray-400">
          Les meilleurs outils sélectionnés pour la performance
        </p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            category: 'Frontend',
            color: 'from-cyan-500 to-blue-500',
            techs: [
              { name: 'Next.js 15', desc: 'App Router + Server Components' },
              { name: 'React 19', desc: 'UI dynamique et performante' },
              { name: 'TypeScript', desc: 'Type-safety et DX optimale' },
              { name: 'Tailwind CSS', desc: 'Styling moderno et responsive' },
            ],
          },
          {
            category: 'AI & ML',
            color: 'from-purple-500 to-pink-500',
            techs: [
              { name: 'Gemini 2.0 Flash', desc: 'LLM ultra-rapide' },
              { name: 'LangChain', desc: 'Orchestration RAG' },
              { name: 'Embeddings', desc: 'Vectorization sémantique' },
              { name: 'Vector DB', desc: 'Stockage haute-perf' },
            ],
          },
          {
            category: 'Backend',
            color: 'from-green-500 to-emerald-500',
            techs: [
              { name: 'Prisma ORM', desc: 'Query builder type-safe' },
              { name: 'PostgreSQL', desc: 'ACID compliance' },
              { name: 'Clerk Auth', desc: 'Identity management' },
              { name: 'APIs REST', desc: 'Endpoints sécurisés' },
            ],
          },
          {
            category: 'Blockchain',
            color: 'from-orange-500 to-red-500',
            techs: [
              { name: 'Ethereum', desc: 'Mainnet production-ready' },
              { name: 'Solidity', desc: 'Smart contracts sécurisés' },
              { name: 'Web3.js', desc: 'Interaction blockchain' },
              { name: 'Ethers.js', desc: 'Contrats & signatures' },
            ],
          },
        ].map((section, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} mb-6 flex items-center justify-center`}>
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">{section.category}</h3>
            <div className="space-y-4">
              {section.techs.map((tech, tidx) => (
                <div key={tidx} className="pb-4 border-b border-gray-700/50 last:border-0">
                  <p className="font-semibold text-white">{tech.name}</p>
                  <p className="text-sm text-gray-400">{tech.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const WorkflowSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/3 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-5xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Flux de Travail Complet</h2>
        <p className="text-xl text-gray-400">
          De l&apos;upload au rapport d&apos;analyse
        </p>
      </motion.div>

      <div className="space-y-6">
        {[
          {
            phase: 'Réception',
            icon: FileText,
            title: 'Upload Sécurisé',
            desc: 'L\'utilisateur importe son document PDF ou image. Validation et scanning viral effectués immédiatement.',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            phase: 'Analyse',
            icon: Brain,
            title: 'Intelligence Artificielle',
            desc: 'Gemini 2.0 analyse le document, extrait les entités clés, les données structurées et les insights financiers.',
            color: 'from-purple-500 to-pink-500',
          },
          {
            phase: 'Notarisation',
            icon: Shield,
            title: 'Certification Blockchain',
            desc: 'Le hash du document est enregistré sur Ethereum mainnet, créant une preuve immuable d\'authenticité.',
            color: 'from-orange-500 to-red-500',
          },
          {
            phase: 'Stockage',
            icon: Database,
            title: 'Archivage Sécurisé',
            desc: 'Les données analysées, les embeddings et les métadonnées sont sauvegardés dans PostgreSQL avec redondance.',
            color: 'from-green-500 to-emerald-500',
          },
          {
            phase: 'Restitution',
            icon: Eye,
            title: 'Rapport d\'Analyse',
            desc: 'L\'utilisateur reçoit un rapport détaillé avec résumé, risques identifiés, sources blockchain et audit trail.',
            color: 'from-yellow-500 to-amber-500',
          },
        ].map((step, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ x: 8 }}
            className="group"
          >
            <div className={`relative p-8 rounded-2xl bg-gradient-to-r ${step.color}/5 border-2 border-${step.color.split(' ')[1]}/20 group-hover:border-${step.color.split(' ')[1]}/50 transition-all duration-300 overflow-hidden`}>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full group-hover:scale-150 transition-transform duration-300" />
              <div className="relative z-10 flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} p-3 flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-500 flex-shrink-0" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const CompetitiveSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">
          Avantages Compétitifs
        </h2>
        <p className="text-xl text-gray-400">
          Pourquoi LexiChain est différent
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: 'Innovation IA',
            icon: Sparkles,
            points: [
              'RAG natif pour zéro hallucination',
              'Gemini 2.0 Flash ultra-rapide',
              'Compréhension contextuelle approfondie',
              'Extraction d\'entités et relations',
            ],
            color: 'from-purple-500 to-pink-500',
          },
          {
            title: 'Blockchain Native',
            icon: GitNetwork,
            points: [
              'Notarisation Ethereum mainnet',
              'Preuve immuable d\'authenticité',
              'Non-répudiation cryptographique',
              'Conformité Web3 complète',
            ],
            color: 'from-blue-500 to-cyan-500',
          },
          {
            title: 'Architecture Robuste',
            icon: Layers,
            points: [
              'Feature-Sliced Design pattern',
              'Scalabilité horizontale garantie',
              'ACID compliance PostgreSQL',
              'Type-safety TypeScript/Prisma',
            ],
            color: 'from-green-500 to-emerald-500',
          },
          {
            title: 'Prêt pour Production',
            icon: Target,
            points: [
              'Enterprise authentication (Clerk)',
              'GDPR et MiFID II compliance',
              'Security best practices',
              'Audit trail immuable',
            ],
            color: 'from-orange-500 to-red-500',
          },
        ].map((advantage, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`p-10 rounded-2xl bg-gradient-to-br ${advantage.color}/5 border-2 border-${advantage.color.split(' ')[1]}/30 hover:border-${advantage.color.split(' ')[1]}/60 transition-all duration-300`}
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${advantage.color} p-4 mb-6 flex items-center justify-center`}>
              <advantage.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">{advantage.title}</h3>
            <ul className="space-y-4">
              {advantage.points.map((point, pidx) => (
                <li key={pidx} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const UseCasesSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Cas d&apos;Usage Primaires</h2>
        <p className="text-xl text-gray-400">
          Applications concrètes dans les institutions financières
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Due Diligence M&A',
            desc: 'Analyse automatisée de contrats et états financiers pour accélérer les fusions-acquisitions.',
            metrics: ['50% moins de temps', 'Risques identifiés', 'Rapport automatisé'],
            icon: BarChart3,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            title: 'Conformité KYC/AML',
            desc: 'Vérification documentaire instantanée et détection d\'anomalies pour la compliance réglementaire.',
            metrics: ['Zéro faux négatif', 'Audit trail complet', 'Réponse immédiate'],
            icon: Shield,
            color: 'from-green-500 to-emerald-500',
          },
          {
            title: 'Audit & Assurance',
            desc: 'Extraction de données et génération de rapports d\'audit certifiés sur la blockchain.',
            metrics: ['Traçabilité totale', 'Certification immuable', 'Efficacité x10'],
            icon: Eye,
            color: 'from-purple-500 to-pink-500',
          },
        ].map((usecase, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className={`p-10 rounded-2xl bg-gradient-to-br ${usecase.color}/5 border-2 border-${usecase.color.split(' ')[1]}/30 hover:border-${usecase.color.split(' ')[1]}/60 transition-all duration-300`}
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${usecase.color} p-4 mb-6 flex items-center justify-center`}>
              <usecase.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{usecase.title}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{usecase.desc}</p>
            <div className="space-y-3">
              {usecase.metrics.map((metric, midx) => (
                <div key={midx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-200">{metric}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

const SecuritySlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-6xl w-full"
    >
      <motion.div variants={itemVariants} className="mb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">
          Sécurité & Conformité
        </h2>
        <p className="text-xl text-gray-400">
          Les standards les plus élevés de l&apos;industrie
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <motion.div variants={itemVariants}>
          <div className="p-10 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Lock className="w-8 h-8 text-red-400" />
              Sécurité Applicative
            </h3>
            <div className="space-y-6">
              {[
                {
                  title: 'Authentification Entreprise',
                  desc: 'Clerk Auth avec MFA, SAML et SSO support',
                },
                {
                  title: 'Chiffrement End-to-End',
                  desc: 'AES-256 pour les documents en transit et au repos',
                },
                {
                  title: 'RBAC Granulaire',
                  desc: 'Contrôle d\'accès basé sur les rôles (administrateur, auditeur, utilisateur)',
                },
                {
                  title: 'Audit Trail Immuable',
                  desc: 'Journalisation complète des accès et modifications',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              Conformité Réglementaire
            </h3>
            <div className="space-y-6">
              {[
                {
                  title: 'GDPR Compliant',
                  desc: 'Data minimization, consentement et droit à l\'oubli',
                },
                {
                  title: 'MiFID II Ready',
                  desc: 'Traçabilité et documentation réglementaires',
                },
                {
                  title: 'SOC 2 Type II',
                  desc: 'Contrôles de sécurité et de confidentialité certifiés',
                },
                {
                  title: 'ISO 27001 Standards',
                  desc: 'Gestion des risques de sécurité informatique',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <div className="p-10 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Architecture de Sécurité en Profondeur</h4>
              <p className="text-gray-200 leading-relaxed">
                La sécurité n&apos;est pas une couche supplémentaire mais intégrée à chaque niveau de l&apos;architecture. De l&apos;authentification frontend jusqu&apos;aux smart contracts blockchain, chaque composant suit les meilleures pratiques de sécurité. Les données sensibles ne transitent jamais en clair et sont toujours chiffrées avec des algorithmes modernes et validés.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const FutureSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 flex items-center justify-center py-20 px-6">
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-5xl w-full text-center"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6">
          Le Futur de la Finance
        </h2>
        <p className="text-2xl text-gray-300 leading-relaxed">
          LexiChain pose les fondations d&apos;une industrie financière où l&apos;intelligence artificielle
          et la blockchain travaillent ensemble pour créer une confiance vérifiable,
          une efficacité maximale et une conformité garantie.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        {[
          {
            icon: TrendingUp,
            title: 'Croissance Exponentielle',
            desc: 'Automatisation à 100% des analyses documentaires',
          },
          {
            icon: Sparkles,
            title: 'Innovation Continue',
            desc: 'Nouveaux modèles IA et cas d\'usage émergents',
          },
          {
            icon: GitNetwork,
            title: 'Adoption Web3',
            desc: 'Standard pour la certification des documents',
          },
        ].map((future, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 p-4 mb-6 flex items-center justify-center mx-auto">
              <future.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{future.title}</h3>
            <p className="text-gray-400">{future.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-16">
        <p className="text-gray-400 text-lg">
          Rejoignez-nous dans la révolution de l&apos;analyse documentaire financière
        </p>
      </motion.div>
    </motion.div>
  </div>
);

const ClosingSlide = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center justify-center">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 text-center max-w-4xl px-6"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">
          Merci
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <p className="text-2xl text-gray-200 leading-relaxed mb-8">
          LexiChain : Où l&apos;Intelligence Rencontre la Blockchain
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
          <p className="text-gray-300 text-lg leading-relaxed">
            Questions ? Discussions ? Intéressé par une intégration ?
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-cyan-400">Fin de la Présentation</div>
      </motion.div>
    </motion.div>
  </div>
);

const slides = [
  TitleSlide,
  ChallengeSide,
  SolutionSlide,
  ArchitectureSlide,
  RAGSlide,
  BlockchainSlide,
  StackSlide,
  WorkflowSlide,
  CompetitiveSlide,
  UseCasesSlide,
  SecuritySlide,
  FutureSlide,
  ClosingSlide,
];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideImageIndex = (index) => {
    return ((index % slides.length) + slides.length) % slides.length;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrent(slideImageIndex(current + newDirection));
  };

  const CurrentSlide = slides[current];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
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
              animate={{
                width: idx === current ? 32 : 8,
                backgroundColor: idx === current ? '#06b6d4' : '#ffffff20',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full transition-all duration-300"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-10 right-10 z-50">
        <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <p className="text-white font-semibold">
            {current + 1} / {slides.length}
          </p>
        </div>
      </div>
    </div>
  );
}
