'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Zap, Brain, Network, Lock, FileText, CheckCircle, AlertCircle, ArrowRight, Sparkles, Code2, Database, Layers, Globe, Cpu, Blocks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PresentationPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  // Slide 1: Hero
  const Slide1 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex justify-center mb-8"
          >
            <Shield className="w-24 h-24 text-cyan-400" strokeWidth={1.5} />
          </motion.div>
          
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 mb-6 leading-tight">
            LexiChain
          </h1>
          
          <p className="text-2xl text-slate-300 mb-8 max-w-3xl font-light">
            La Convergence de l&apos;Intelligence Artificielle et de la Blockchain pour la Conformité Documentaire
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <div className="px-6 py-2 bg-cyan-500/20 rounded-full border border-cyan-400/50">
              <p className="text-cyan-300 font-semibold">AI-Powered</p>
            </div>
            <div className="px-6 py-2 bg-purple-500/20 rounded-full border border-purple-400/50">
              <p className="text-purple-300 font-semibold">Blockchain</p>
            </div>
            <div className="px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50">
              <p className="text-emerald-300 font-semibold">Enterprise</p>
            </div>
          </div>

          <motion.p
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-slate-400 text-sm"
          >
            Scroll ou cliquez pour explorer →
          </motion.p>
        </motion.div>
      </div>
    </div>
  );

  // Slide 2: Le Problème
  const Slide2 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-20 right-0 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 py-20 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-16 text-center">
            Le Problème Actuel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {[
              {
                icon: FileText,
                title: 'Documents Statiques',
                desc: 'Les documents PDF et papier ne permettent pas l\'analyse intelligente ou la validation automatisée des données critiques.'
              },
              {
                icon: AlertCircle,
                title: 'Risques d\'Intégrité',
                desc: 'Absence de traçabilité immuable. Les modifications documentaires ne peuvent pas être détectées ou validées de manière cryptographique.'
              },
              {
                icon: Lock,
                title: 'Complexité Réglementaire',
                desc: 'Les institutions financières font face à des défis de conformité avec des processus manuels, lents et sujets aux erreurs humaines.'
              },
              {
                icon: Zap,
                title: 'Inefficacité Opérationnelle',
                desc: 'L\'analyse manuelle de documents complexes prend du temps, consomme les ressources et crée des goulots d\'étranglement.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
              >
                <item.icon className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Slide 3: La Solution
  const Slide3 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-12 text-center">
            La Solution : LexiChain
          </h2>

          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 text-center mb-12 leading-relaxed font-light"
            >
              LexiChain transforme les documents statiques en intelligence dynamique. Grâce à la fusion de l&apos;IA générative avancée et de la technologie blockchain immuable, nous créons un écosystème où chaque document devient une source fiable de vérité, analysée, validée et notarisée en temps réel.
            </motion.p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Intelligence', desc: 'Analyse autonome avec Gemini 2.0' },
                { label: 'Immuabilité', desc: 'Notarisation blockchain décentralisée' },
                { label: 'Sécurité', desc: 'Chiffrement et contrôle d\'accès avancé' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-center"
                >
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">{item.label}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Slide 4: Les Trois Piliers
  const Slide4 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-20 text-center"
        >
          Les Trois Piliers de l&apos;Architecture
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {[
            {
              icon: Brain,
              title: 'Pilier Intelligence',
              points: [
                'Gemini 2.0 Flash pour l\'analyse documentaire',
                'RAG (Retrieval-Augmented Generation) propriétaire',
                'Extraction intelligente d\'entités et de relations',
                'Validation sémantique automatisée'
              ],
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Blocks,
              title: 'Pilier Immuabilité',
              points: [
                'Smart contracts Ethereum notariants',
                'Blockchain publique pour la transparence',
                'Cryptographie SHA-256 pour l\'intégrité',
                'Preuve de non-répudiation légale'
              ],
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: Shield,
              title: 'Pilier Sécurité',
              points: [
                'Authentification Clerk enterprise-grade',
                'Chiffrement end-to-end des données',
                'Contrôle d\'accès granulaire (RBAC)',
                'Conformité RGPD et réglementation bancaire'
              ],
              color: 'from-emerald-500 to-teal-500'
            }
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${pillar.color} rounded-3xl blur-xl opacity-20`}></div>
              <div className="relative p-8 rounded-3xl bg-slate-900/80 border border-slate-700 backdrop-blur-sm">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${pillar.color} p-4 mb-6`}>
                  <pillar.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">{pillar.title}</h3>
                <ul className="space-y-3">
                  {pillar.points.map((point, pidx) => (
                    <li key={pidx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 5: Architecture Système
  const Slide5 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-16 text-center"
        >
          Architecture Système : 5 Couches
        </motion.h2>

        <div className="max-w-4xl w-full space-y-4">
          {[
            { level: 1, name: 'Couche Présentation', tech: 'Next.js 15 + React 19 + Tailwind CSS', desc: 'Interface utilisateur moderne et réactive', color: 'from-cyan-500 to-blue-500' },
            { level: 2, name: 'Couche API', tech: 'Route Handlers + Server Actions', desc: 'Endpoints RESTful sécurisés et optimisés', color: 'from-blue-500 to-indigo-500' },
            { level: 3, name: 'Couche Métier', tech: 'Services AI + RAG + Blockchain', desc: 'Logique applicative complexe et orchestration', color: 'from-indigo-500 to-purple-500' },
            { level: 4, name: 'Couche Données', tech: 'PostgreSQL + Prisma ORM', desc: 'Stockage relationnel ACID-compliant', color: 'from-purple-500 to-pink-500' },
            { level: 5, name: 'Couche Blockchain', tech: 'Ethereum + Solidity Smart Contracts', desc: 'Notarisation immuable et décentralisée', color: 'from-pink-500 to-rose-500' }
          ].map((layer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-4 items-center"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center font-bold text-white flex-shrink-0`}>
                {layer.level}
              </div>
              <div className="flex-1 p-4 rounded-xl bg-slate-900/50 border border-slate-700 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">{layer.tech}</span>
                </div>
                <p className="text-sm text-slate-400">{layer.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 6: Stack Frontend
  const Slide6 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-12"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-16 text-center"
        >
          Stack Frontend & Présentation
        </motion.h2>

        <div className="max-w-4xl space-y-6">
          {[
            {
              tech: 'Next.js 15',
              why: 'Framework React de nouvelle génération avec Server Components, permettant un rendu côté serveur optimisé et une réduction drastique de JavaScript client. App Router pour un routage moderne et intuitif.',
              icon: Code2
            },
            {
              tech: 'React 19 + Hooks',
              why: 'Composants réactifs modernes avec gestion d\'état avancée. useEffectEvent et Activity pour le contrôle granulaire du rendu et de l\'UI.',
              icon: Zap
            },
            {
              tech: 'Tailwind CSS 4',
              why: 'Utility-first CSS framework pour un styling cohérent, responsive et maintenable. Thèmes personnalisés avec design tokens pour la marque.',
              icon: Sparkles
            },
            {
              tech: 'Framer Motion',
              why: 'Animations déclaratives pour les transitions fluides, parallaxe et microinteractions. Améliore l\'expérience utilisateur et l\'engagement.',
              icon: Sparkles
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30 hover:border-cyan-500/60 transition-all"
            >
              <div className="flex gap-4">
                <item.icon className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.tech}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.why}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 7: Stack IA & ML
  const Slide7 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-12"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-16 text-center"
        >
          Stack IA & Machine Learning
        </motion.h2>

        <div className="max-w-4xl space-y-6">
          {[
            {
              tech: 'Google Gemini 2.0 Flash',
              why: 'Modèle multimodal ultra-rapide avec fenêtre de contexte de 1 million de tokens. Analyse complexe de documents longs sans latence critique. Supérieur à GPT-4 pour l\'extraction de données structurées.',
              icon: Brain
            },
            {
              tech: 'LangChain',
              why: 'Framework orchestration pour chaîner appels IA, gérer la mémoire conversationnelle et implémenter des agents autonomes complexes.',
              icon: Network
            },
            {
              tech: 'Embeddings & Vector Store',
              why: 'Stockage vectoriel pour la recherche sémantique. Transforme documents en représentations numériques pour le RAG efficace et précis.',
              icon: Cpu
            },
            {
              tech: 'RAG Pipeline Propriétaire',
              why: 'Système de récupération-augmentation-génération custom. Élimine les hallucinations IA, garantit l\'exactitude avec citations et traçabilité complète.',
              icon: Zap
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-purple-500/30 hover:border-purple-500/60 transition-all"
            >
              <div className="flex gap-4">
                <item.icon className="w-10 h-10 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.tech}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.why}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 8: Stack Backend & Données
  const Slide8 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-12"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-16 text-center"
        >
          Stack Backend & Stockage Données
        </motion.h2>

        <div className="max-w-4xl space-y-6">
          {[
            {
              tech: 'PostgreSQL 16',
              why: 'Base de données relationnelle ACID-compliant. Stockage sécurisé des documents, métadonnées, historiques et logs de conformité réglementaire.',
              icon: Database
            },
            {
              tech: 'Prisma ORM',
              why: 'ORM type-safe avec migrations automatiques. Réduit les risques de vulnérabilités SQL injection et améliore la maintenabilité du code.',
              icon: Code2
            },
            {
              tech: 'Clerk Authentication',
              why: 'Plateforme d\'authentification enterprise-grade. Single Sign-On, 2FA, gestion des sessions sécurisées avec tokens JWT httpOnly.',
              icon: Lock
            },
            {
              tech: 'Server Actions & Route Handlers',
              why: 'API sécurisée côté serveur. Validation données, authentification, et logique métier isolée du client pour la sécurité maximale.',
              icon: Shield
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 transition-all"
            >
              <div className="flex gap-4">
                <item.icon className="w-10 h-10 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.tech}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.why}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 9: Architecture Blockchain
  const Slide9 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-40 right-20 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-12"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-16 text-center"
        >
          Architecture Blockchain & Notarisation
        </motion.h2>

        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30"
          >
            <h3 className="text-2xl font-bold text-amber-300 mb-4 flex items-center gap-3">
              <Blocks className="w-8 h-8" />
              Ethereum Smart Contracts
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Contrats intelligents déployés sur mainnet Ethereum. Chaque document est notarisé avec un hash cryptographique SHA-256, créant une preuve immuable de son existence et intégrité à une date/heure spécifique.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-amber-400 font-semibold mb-2">Chaîne: Ethereum</p>
                <p className="text-xs text-slate-400">Mainnet pour production, Sepolia pour tests</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-amber-400 font-semibold mb-2">Consensus: Proof of Stake</p>
                <p className="text-xs text-slate-400">Sécurisé par +1M validateurs mondiaux</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30"
          >
            <h3 className="text-2xl font-bold text-amber-300 mb-4 flex items-center gap-3">
              <Lock className="w-8 h-8" />
              Processus de Notarisation
            </h3>
            <ol className="space-y-3">
              {[
                'Document chargé → Extraction du hash SHA-256',
                'Signature avec clé privée de l\'utilisateur',
                'Envoi transaction blockchain via web3.py',
                'Smart contract enregistre hash + timestamp',
                'Confirmation réseau (2-3 blocs)',
                'Certificat immuable généré'
              ].map((step, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold flex-shrink-0 text-xs">{idx + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Slide 10: Pipeline RAG
  const Slide10 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-16 text-center"
        >
          Pipeline RAG : De la Donnée à l&apos;Intelligence
        </motion.h2>

        <div className="max-w-5xl">
          <div className="space-y-4">
            {[
              {
                phase: 'INGESTION',
                desc: 'Document PDF/DOCX uploadé. Extraction du texte brut avec OCR pour documents scannés. Validation format et encodage UTF-8.',
                details: [
                  'Support multi-format: PDF, DOCX, TXT, images',
                  'OCR Tesseract pour texte scanné',
                  'Validation intégrité fichier SHA-256'
                ]
              },
              {
                phase: 'SEGMENTATION',
                desc: 'Chunking intelligent du document en segments de 512-1024 tokens. Stratégie sliding window pour préserver contexte.',
                details: [
                  'Chunks avec chevauchement 20% pour continuité',
                  'Métadonnées preservées (page, section, type)',
                  'Nettoyage whitespace et caractères spéciaux'
                ]
              },
              {
                phase: 'EMBEDDING',
                desc: 'Chaque chunk converti en vecteur 768D via embeddings. Stockage dans base vecteurs pour recherche sémantique rapide.',
                details: [
                  'Modèle: all-MiniLM-L6-v2 (léger & rapide)',
                  'Indexation HNSW pour recherche O(log n)',
                  'Similarity score normalisé 0-1'
                ]
              },
              {
                phase: 'STOCKAGE',
                desc: 'Métadonnées + vectors stockés PostgreSQL. Index optimisés pour requêtes parallèles massives.',
                details: [
                  'Table documents: id, contenu, hash, timestamp',
                  'Table embeddings: chunk, vector_id, cosine_similarity',
                  'Backup journalier encrypted'
                ]
              },
              {
                phase: 'RÉCUPÉRATION',
                desc: 'Requête utilisateur convertie en embedding. Recherche cosine similarity sur base. Top-K chunks (k=5-10) retournés.',
                details: [
                  'Requête: "Quels sont les risques mentionnés?"',
                  'Similarité minimum: 0.7',
                  'Reranking par pertinence Gemini'
                ]
              },
              {
                phase: 'GÉNÉRATION',
                desc: 'Chunks + contexte + requête envoyés à Gemini. LLM génère réponse grounded. Citations automatiques des sources.',
                details: [
                  'Prompt engineering pour factualité',
                  'Chains of thought explicites',
                  'Vérification anti-hallucination'
                ]
              }
            ].map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500/30"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 flex items-center">{stage.phase}</h3>
                </div>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">{stage.desc}</p>
                <ul className="space-y-2 border-t border-slate-700 pt-4">
                  {stage.details.map((detail, didx) => (
                    <li key={didx} className="flex gap-2 text-xs text-slate-400">
                      <ArrowRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 11: Pourquoi RAG Importe
  const Slide11 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-16 text-center"
        >
          Pourquoi le RAG Change la Donne
        </motion.h2>

        <div className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: 'Élimination des Hallucinations',
                desc: 'Les réponses sont grounded dans le document réel. Aucune génération d\'informations fictives. Traçabilité 100% des sources.',
                icon: CheckCircle
              },
              {
                title: 'Réponses Instantanées',
                desc: 'Pas besoin de relire 100 pages de contrats. Questions complexes résolues en secondes avec citations exactes.',
                icon: Zap
              },
              {
                title: 'Légalité & Conformité',
                desc: 'Chaque réponse est vérifiable et citée. Admissible en tant que preuve légale avec chaîne de traçabilité blockchain.',
                icon: Shield
              },
              {
                title: 'Sécurité des Données',
                desc: 'Documents jamais envoyés aux serveurs tiers. RAG intégré. RGPD compliant. Confidentialité garantie.',
                icon: Lock
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/30"
              >
                <item.icon className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-2 border-green-500/50"
          >
            <p className="text-lg text-green-300 font-semibold mb-4">Le Défi des LLMs Classiques :</p>
            <p className="text-slate-300 leading-relaxed">
              Les LLMs génèrent du texte basé sur patterns d&apos;entraînement. Ils peuvent {'"'}halluciner{'"')} des informations plausibles mais fausses. Pour les documents réglementaires en finance, c&apos;est inacceptable. RAG résout ce problème en ancrages la génération dans les données réelles.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Slide 12: Flux Document Utilisateur
  const Slide12 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-16 text-center"
        >
          Flux Utilisateur : Journey Complet
        </motion.h2>

        <div className="max-w-5xl">
          <div className="space-y-4">
            {[
              {
                step: 'AUTHENTIFICATION',
                user: 'Analyste Financier',
                action: 'Se connecte via Clerk SSO',
                result: 'Session sécurisée + permissions RBAC appliquées'
              },
              {
                step: 'UPLOAD DOCUMENT',
                user: 'Analyste',
                action: 'Sélectionne contrat/rapport PDF (max 50MB)',
                result: 'Validation intégrité + scan anti-malware'
              },
              {
                step: 'TRAITEMENT IA',
                user: 'Système',
                action: 'OCR + Extraction entités + Segmentation',
                result: 'Document indexé et searchable en 10-30s'
              },
              {
                step: 'NOTARISATION',
                user: 'Système',
                action: 'Calcul hash SHA-256 + soumission blockchain',
                result: 'Certificat Ethereum enregistré immuablement'
              },
              {
                step: 'INTERROGATION',
                user: 'Analyste',
                action: 'Pose questions naturelles au document',
                result: 'Réponses instantanées avec citations exactes'
              },
              {
                step: 'AUDIT & CONFORMITÉ',
                user: 'Compliance Officer',
                action: 'Exporte audit trail complet + certificats',
                result: 'Documentation légale admissible en tribunal'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 p-5 rounded-2xl bg-slate-900/60 border border-rose-500/30 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-rose-300">{item.step}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">{item.user}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">
                    <span className="text-slate-500">Action:</span> {item.action}
                  </p>
                  <p className="text-emerald-400/80 text-sm flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    {item.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 13: Pattern Architecture
  const Slide13 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-16 text-center"
        >
          Feature-Sliced Design Architecture
        </motion.h2>

        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-indigo-500/30 mb-8"
          >
            <p className="text-slate-300 leading-relaxed mb-6">
              Feature-Sliced Design (FSD) est une architecture moderne et scalable. Chaque feature est autonomous avec sa logique, API et UI encapsulées. Cela élimine le spaghetti code et facilite la collaboration équipe.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="font-semibold text-indigo-300 mb-1">Avantages FSD:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>✓ Scalabilité à 200+ devs</li>
                  <li>✓ Zero conflits merge</li>
                  <li>✓ Tests isolés par feature</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="font-semibold text-indigo-300 mb-1">Structure:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>📁 app/ (pages)</li>
                  <li>📁 features/ (modules)</li>
                  <li>📁 shared/ (utils)</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {[
              { name: 'Document Feature', modules: ['Upload', 'Parser', 'Storage', 'Versioning'] },
              { name: 'AI Analysis Feature', modules: ['RAG Pipeline', 'Embeddings', 'Q&A', 'Extraction'] },
              { name: 'Blockchain Feature', modules: ['Notarization', 'Verification', 'Certificates'] },
              { name: 'Auth Feature', modules: ['Login', 'Sessions', 'Permissions', 'Audit'] }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-5 rounded-xl bg-slate-900/50 border border-indigo-500/20"
              >
                <h3 className="text-indigo-300 font-bold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  {feature.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {feature.modules.map((mod, midx) => (
                    <span key={midx} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {mod}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Slide 14: Sécurité & Conformité
  const Slide14 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute top-40 left-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-16 text-center"
        >
          Sécurité & Conformité
        </motion.h2>

        <div className="max-w-5xl space-y-6">
          {[
            {
              category: 'AUTHENTIFICATION & AUTORISATION',
              items: [
                'Clerk SSO pour authentification centralisée',
                'JWT tokens avec signature RS256',
                'RBAC (Role-Based Access Control) granulaire',
                'Sessions httpOnly cookies + CSRF protection'
              ]
            },
            {
              category: 'CHIFFREMENT DES DONNÉES',
              items: [
                'TLS 1.3 pour toutes communications réseau',
                'AES-256-GCM pour chiffrement at-rest',
                'Clés de chiffrement stockées dans secrets manager',
                'Zero-knowledge architecture pour données sensibles'
              ]
            },
            {
              category: 'CONFORMITÉ RÉGLEMENTAIRE',
              items: [
                'RGPD: Droit à l\'oubli, consent management',
                'PSD2: Authentification forte requise',
                'Normes bancaires: Audit trails immuables',
                'SOC 2 Type II compliance ready'
              ]
            },
            {
              category: 'BLOCKCHAIN & NOTARISATION',
              items: [
                'Smart contracts audités par firmes tierces',
                'Signatures Ethereum avec clés privées user',
                'Immuabilité cryptographique SHA-256',
                'Public ledger = transparence maximale'
              ]
            }
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30"
            >
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, iidx) => (
                  <li key={iidx} className="flex gap-3 text-slate-300 text-sm">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Slide 15: Pourquoi LexiChain Gagne
  const Slide15 = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-12 z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 mb-16 text-center"
        >
          Pourquoi LexiChain Gagne
        </motion.h2>

        <div className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'Innovation IA',
                points: [
                  'Gemini 2.0 Flash 10x plus rapide que concurrents',
                  'RAG propriétaire eliminant hallucinations',
                  'Analyse documents financiers complexes',
                  'Extraction entités légales automatisée'
                ],
                icon: Brain
              },
              {
                title: 'Blockchain Immuable',
                points: [
                  'Ethereum mainnet pour notarisation',
                  'Preuve cryptographique d\'intégrité',
                  'Transparence complète sans tiers',
                  'Compliance légale démontrée'
                ],
                icon: Blocks
              },
              {
                title: 'Architecture Enterprise',
                points: [
                  'Feature-Sliced Design pour scalabilité',
                  'PostgreSQL ACID-compliant',
                  'Microservices-ready avec APIs',
                  'Zero technical debt'
                ],
                icon: Layers
              },
              {
                title: 'Prêt pour le Marché',
                points: [
                  'Full-stack integration sans dépendances externes',
                  'Security & Compliance au cœur',
                  'Performance optimisée (< 2s réponses)',
                  'Roadmap clair pour unicorn 🦄'
                ],
                icon: Sparkles
              }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-7 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/50 group-hover:border-cyan-500/50 transition-all">
                  <pillar.icon className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-4">{pillar.title}</h3>
                  <ul className="space-y-2">
                    {pillar.points.map((point, pidx) => (
                      <li key={pidx} className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                        <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-2 border-emerald-500/50 text-center"
          >
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 mb-4">
              LexiChain : La Transformation Digitale du Secteur BFSI
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Une plateforme intelligente, immuable, sécurisée et compliant qui réinvente comment les institutions financières gèrent et analysent les documents. Pas juste un produit, une révolution. 🚀
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const slides = [
    Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15
  ];

  const CurrentSlide = slides[currentSlide];

  return (
    <div className="relative w-full bg-slate-950 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="w-full"
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-between items-center px-8 z-50">
        <button
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-slate-900/80 border border-slate-700 hover:border-cyan-500 text-white hover:text-cyan-400 transition-all backdrop-blur-sm"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-cyan-400 w-8' : 'bg-slate-700 w-2 hover:bg-slate-600'
              }`}
              aria-label={`Aller au slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-slate-900/80 border border-slate-700 hover:border-cyan-500 text-white hover:text-cyan-400 transition-all backdrop-blur-sm"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="fixed top-8 right-8 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-sm z-50">
        <p className="text-slate-400 text-sm">
          <span className="text-cyan-400 font-bold">{currentSlide + 1}</span> / {slides.length}
        </p>
      </div>
    </div>
  );
};

export default PresentationPage;
