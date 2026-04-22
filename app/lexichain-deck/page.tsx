'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Brain, Lock, Zap, Code, Database, Network, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: "LexiChain",
      subtitle: "Plateforme d'analyse intelligente et sécurisée de documents financiers",
      content: null,
      layout: "title"
    },

    // Slide 2: What is it?
    {
      id: 2,
      title: "Qu'est-ce que LexiChain ?",
      subtitle: "La plateforme",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-800 text-lg leading-relaxed">
              <strong>LexiChain</strong> est une plateforme qui aide les experts financiers à analyser rapidement et avec certitude des documents complexes (contrats, rapports, audits, etc.).
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
              <FileText className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold">Upload</p>
              <p className="text-xs">Importe ton document</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
              <Brain className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold">Analyse IA</p>
              <p className="text-xs">L'IA l'analyse</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
              <Lock className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold">Certifié</p>
              <p className="text-xs">Notarisé on-chain</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: The Problem
    {
      id: 3,
      title: "Le problème",
      subtitle: "Pourquoi avons-nous besoin de cela ?",
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-gray-800"><strong>❌ Manuelle et lente :</strong> Les analystes lisent document par document, cela prend des heures.</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-gray-800"><strong>❌ Pas de preuve :</strong> Il n'y a pas de trace de ce qui a été analysé et quand.</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-gray-800"><strong>❌ Risque d'erreur :</strong> Les humains se fatiguent et font des erreurs.</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-gray-800"><strong>❌ Pas d'audit :</strong> Impossible de prouver que l'analyse a été faite correctement.</p>
          </div>
        </div>
      )
    },

    // Slide 4: The Idea
    {
      id: 4,
      title: "L'idée",
      subtitle: "Comment LexiChain résout le problème",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-gray-800">Analyse automatique avec l'IA</p>
              <p className="text-gray-600 text-sm">L'IA lit et comprend tes documents en quelques secondes</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-gray-800">Réponses instant et précises</p>
              <p className="text-gray-600 text-sm">Pose une question, l'IA te répond immédiatement en citant les sources</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-gray-800">Enregistrement immuable</p>
              <p className="text-gray-600 text-sm">Chaque analyse est notarisée sur la blockchain, impossible à modifier</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Architecture
    {
      id: 5,
      title: "Architecture technique",
      subtitle: "Comment les couches fonctionnent ensemble",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <p className="font-semibold">Frontend (Web)</p>
            <p className="text-sm">Next.js 15 + React 19 - L'interface où l'utilisateur upload son document</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
            <p className="font-semibold">Backend (Serveur)</p>
            <p className="text-sm">Node.js - Reçoit le document, le traite, appelle l'IA et la blockchain</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <p className="font-semibold">IA / RAG (Cerveau)</p>
            <p className="text-sm">Gemini 2.0 + LangChain - Comprend et répond aux questions sur le document</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <p className="font-semibold">Blockchain (Sécurité)</p>
            <p className="text-sm">Ethereum - Enregistre une preuve que le document a été analysé</p>
          </div>
          <div className="bg-gradient-to-r from-slate-500 to-slate-600 text-white p-4 rounded-lg">
            <p className="font-semibold">Base de données</p>
            <p className="text-sm">PostgreSQL + Prisma - Stocke les documents et les analyses</p>
          </div>
        </div>
      )
    },

    // Slide 6: Stack Technologique
    {
      id: 6,
      title: "Stack technologique",
      subtitle: "Les outils et pourquoi on les utilise",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900">Next.js 15</p>
              <p className="text-sm text-gray-700">Server Components rapides, idéal pour traiter les documents</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900">Gemini 2.0 Flash</p>
              <p className="text-sm text-gray-700">IA très rapide pour lire et comprendre les textes longs</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-900">PostgreSQL</p>
              <p className="text-sm text-gray-700">Base de données fiable et sécurisée</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-900">Ethereum</p>
              <p className="text-sm text-gray-700">Blockchain pour certifier les analyses</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900">Clerk Auth</p>
              <p className="text-sm text-gray-700">Authentification sécurisée des utilisateurs</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <p className="font-semibold text-indigo-900">LangChain</p>
              <p className="text-sm text-gray-700">Framework pour utiliser l'IA de façon structurée</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: How it works - Flow
    {
      id: 7,
      title: "Comment ça marche",
      subtitle: "Le flux complet step-by-step",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">L'utilisateur upload un PDF</p>
              <p className="text-sm text-gray-600">Le fichier est envoyé au serveur</p>
            </div>
            <ArrowRight className="text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Le document est converti et découpé</p>
              <p className="text-sm text-gray-600">On le transforme en petits morceaux pour l'analyser</p>
            </div>
            <ArrowRight className="text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Chaque morceau est transformé en nombre (embedding)</p>
              <p className="text-sm text-gray-600">L'IA comprend le sens du texte et le représente en chiffres</p>
            </div>
            <ArrowRight className="text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Stockage en base de données</p>
              <p className="text-sm text-gray-600">Les morceaux et leurs représentations sont sauvegardés</p>
            </div>
            <ArrowRight className="text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">L'analyse est enregistrée sur la blockchain</p>
              <p className="text-sm text-gray-600">Preuve immuable que le document a été analysé</p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: RAG Explained
    {
      id: 8,
      title: "RAG (Retrieval Augmented Generation)",
      subtitle: "Comment l'IA répond aux questions sans halluciner",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-800 mb-2"><strong>Qu'est-ce que RAG ?</strong></p>
            <p className="text-gray-700">C'est un technique qui permet à l'IA de chercher dans ton document avant de répondre, au lieu d'inventer. Elle ne dit que ce qu'elle a vraiment trouvé.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">1️⃣ Tu poses une question</p>
              <p className="text-sm text-gray-600">"Quel est le revenu total de l'entreprise en 2024 ?"</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">2️⃣ L'IA cherche la réponse dans le document</p>
              <p className="text-sm text-gray-600">Elle trouve les parties pertinentes du PDF</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">3️⃣ L'IA donne la réponse avec la source</p>
              <p className="text-sm text-gray-600">"50 milliards d'euros (page 45, section Résultats Financiers)"</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
            <p className="text-sm text-green-900"><strong>Avantage :</strong> Zéro hallucination - l'IA ne dit que ce qui existe vraiment dans le document</p>
          </div>
        </div>
      )
    },

    // Slide 9: Blockchain Explained
    {
      id: 9,
      title: "Blockchain (Ethereum)",
      subtitle: "Comment on certifie que l'analyse a eu lieu",
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
            <p className="text-gray-800 mb-2"><strong>Pourquoi utiliser la blockchain ?</strong></p>
            <p className="text-gray-700">Pour laisser une trace permanente et immuable que ton document a été analysé à une date et heure précises.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">🔐 Création d'un hash du document</p>
              <p className="text-sm text-gray-600">On crée une "empreinte" unique du document (impossible à modifier)</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">⛓️ Enregistrement sur Ethereum</p>
              <p className="text-sm text-gray-600">Ce hash est enregistré de façon permanente sur la blockchain</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">✅ Preuve vérifiable</p>
              <p className="text-sm text-gray-600">N'importe qui peut vérifier : "Oui, ce document a vraiment été analysé le 22/04/2026 à 14:30"</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
            <p className="text-sm text-green-900"><strong>Cas d'usage :</strong> Audit trail pour la conformité légale, preuve dans les audits externes</p>
          </div>
        </div>
      )
    },

    // Slide 10: Communication entre les couches
    {
      id: 10,
      title: "Comment les couches communiquent",
      subtitle: "L'intégration technique",
      content: (
        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 mb-3"><strong>Frontend → Backend :</strong> L'utilisateur envoie le PDF via HTTP</p>
            <div className="bg-white p-2 rounded text-xs font-mono text-blue-600">POST /api/upload → Fichier + UserID</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 mb-3"><strong>Backend → IA (Gemini) :</strong> Traite le document et crée des embeddings</p>
            <div className="bg-white p-2 rounded text-xs font-mono text-purple-600">LangChain → Gemini API → Vecteurs stockés</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 mb-3"><strong>Backend → Database :</strong> Sauvegarde les documents et analyses</p>
            <div className="bg-white p-2 rounded text-xs font-mono text-green-600">Prisma ORM → PostgreSQL</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 mb-3"><strong>Backend → Blockchain :</strong> Crée une transaction Ethereum</p>
            <div className="bg-white p-2 rounded text-xs font-mono text-orange-600">Web3.js → Ethereum Smart Contract → Enregistrement</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800 mb-3"><strong>Backend → Frontend :</strong> Retour les résultats</p>
            <div className="bg-white p-2 rounded text-xs font-mono text-red-600">API Response → JSON avec status + results</div>
          </div>
        </div>
      )
    },

    // Slide 11: Résumé
    {
      id: 11,
      title: "En résumé",
      subtitle: "Les 3 points clés à retenir",
      content: (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg"
          >
            <p className="font-semibold text-lg mb-2">🧠 Analyse intelligente avec l'IA</p>
            <p className="text-sm">Gemini comprend les documents complexes et répond aux questions sans inventer (RAG)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg"
          >
            <p className="font-semibold text-lg mb-2">🔒 Sécurité et traçabilité</p>
            <p className="text-sm">Chaque analyse est enregistrée sur la blockchain - preuve permanente et immuable</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg"
          >
            <p className="font-semibold text-lg mb-2">⚡ Architecture scalable</p>
            <p className="text-sm">Next.js + PostgreSQL + Ethereum = Une solution moderne, rapide et production-ready</p>
          </motion.div>
        </div>
      )
    },

    // Slide 12: Conclusion
    {
      id: 12,
      title: "Conclusion",
      subtitle: "Pourquoi c'est important",
      content: (
        <div className="space-y-4">
          <div className="bg-white border-2 border-blue-600 p-6 rounded-lg">
            <p className="text-lg text-gray-800 leading-relaxed">
              <strong>LexiChain transforme la façon dont les experts analysent les documents financiers.</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">Au lieu de perdre des jours à lire, l'équipe gagne du temps et de la précision. Et grâce à la blockchain, tout est traçable et certifié.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">10x</p>
              <p className="text-sm text-gray-700 mt-2">Plus rapide</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-700 mt-2">Traçable</p>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 rounded-lg text-center">
            <p className="font-semibold">Une solution moderne pour des problèmes complexes</p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Slide */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 min-h-[600px] flex flex-col justify-between"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Slide {currentSlide + 1} / {slides.length}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">{slide.title}</h1>
              {slide.subtitle && (
                <p className="text-lg text-gray-600 mt-3">{slide.subtitle}</p>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            {slide.content}
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Keyboard Navigation Info */}
        <p className="text-center text-gray-400 text-sm mt-6">Utilisez les flèches ← → pour naviguer | ou cliquez sur les points</p>
      </div>

      {/* Keyboard Navigation */}
      <KeyboardNavigation onNext={nextSlide} onPrev={prevSlide} />
    </div>
  );
};

// Keyboard Navigation
const KeyboardNavigation = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrev]);

  return null;
};

export default Presentation;
