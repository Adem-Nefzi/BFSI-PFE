'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Brain, Lock, Zap, Shield, GitBranch, Server, Database, Code2, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfessionalPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      title: 'LexiChain',
      subtitle: 'Plateforme Intelligente d\'Analyse de Documents BFSI',
      content: (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-blue-900 mb-4">LexiChain</h1>
            <p className="text-2xl text-gray-700 mb-8">Plateforme Intelligente d'Analyse de Documents pour le Secteur BFSI</p>
            <div className="flex gap-4 justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-900" />
                <span className="text-gray-800">Intelligence Artificielle</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                <Lock className="w-5 h-5 text-purple-900" />
                <span className="text-gray-800">Sécurité Blockchain</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-900" />
                <span className="text-gray-800">Conformité GDPR</span>
              </div>
            </div>
          </div>
          <div className="text-center max-w-2xl">
            <p className="text-lg text-gray-600">
              Un projet de fin d'études (PFE) qui transforme les documents statiques en assets numériques intelligents, 
              sécurisés et traçables pour les institutions financières.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 2: What is the Platform
    {
      title: 'Qu\'est-ce que LexiChain?',
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              LexiChain est une plateforme web construite pour transformer les documents PDF complexes (contrats, polices d'assurance, accords financiers) 
              en assets numériques intelligents et sécurisés. Au lieu de laisser les documents rester des "boîtes noires" statiques, 
              nous créons un système où les utilisateurs peuvent poser des questions naturelles à leurs documents et obtenir des réponses 
              précises et vérifiables.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-blue-900">Upload</h3>
              </div>
              <p className="text-sm text-gray-700">
                Les utilisateurs importent leurs documents PDF ou images scannées dans la plateforme de manière sécurisée.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-900" />
                <h3 className="font-bold text-purple-900">Analyse</h3>
              </div>
              <p className="text-sm text-gray-700">
                L'IA analyse le document, extrait les données clés et construit un index de recherche sémantique.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-emerald-900" />
                <h3 className="font-bold text-emerald-900">Notarisation</h3>
              </div>
              <p className="text-sm text-gray-700">
                Le hash du document est enregistré sur la blockchain Ethereum comme preuve immuable d'existence.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="font-bold text-gray-900 mb-2">Objectif Principal</h3>
            <p className="text-gray-700">
              Créer un système où les documents financiers deviennent transparents, interrogeables et infalsifiables, 
              tout en maintenant la conformité avec les réglementations (GDPR, MiFID II, etc.).
            </p>
          </div>
        </div>
      ),
    },

    // Slide 3: The Problem
    {
      title: 'Le Problème',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 font-semibold mb-8">
            Le secteur BFSI (Banque, Services Financiers, Assurance) fait face à des défis majeurs avec la gestion des documents.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-xl">1.</span> Le Manque de Transparence
              </h3>
              <p className="text-gray-700">
                Les clients signent des contrats sans comprendre les clauses d'exclusion, les dates de renouvellement, 
                ou les frais cachés. Les PDF sont souvent trop longs (50+ pages) et inaccessibles au client moyen.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
              <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <span className="text-xl">2.</span> Le Travail Manuel et Répétitif
              </h3>
              <p className="text-gray-700">
                Les agents d'assurance passent des milliers d'heures par an à vérifier manuellement les PDF pour la conformité 
                (signatures présentes, dates valides). Cette tâche est coûteuse et sujette aux erreurs humaines.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                <span className="text-xl">3.</span> Le Risque d'Intégrité des Documents
              </h3>
              <p className="text-gray-700">
                En cas de litige légal, prouver qu'une version spécifique d'un document est celle réellement signée peut être difficile 
                et coûteux. Les documents peuvent être modifiés sans preuve irréfutable.
              </p>
            </div>

            <div className="p-4 bg-pink-50 border-l-4 border-pink-500">
              <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                <span className="text-xl">4.</span> La Surcharge d'Information
              </h3>
              <p className="text-gray-700">
                Les utilisateurs sont submergés par le volume de texte. Trouver une information spécifique dans un contrat 
                de 100 pages demande du temps et n'est pas user-friendly.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: The Idea / Solution
    {
      title: 'L\'Idée et la Solution',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-300">
            <h3 className="font-bold text-blue-900 mb-4 text-xl">Comment LexiChain Résout Ces Problèmes</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transparence via l'IA</h4>
                  <p className="text-gray-700">
                    Utilisez Gemini pour analyser automatiquement les documents. Les utilisateurs peuvent poser des questions 
                    naturelles ("Quel est le taux d'intérêt?", "Quand ce contrat expire-t-il?") et obtenir des réponses instantanées 
                    basées uniquement sur le contenu du document.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">2</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Automatisation des Vérifications</h4>
                  <p className="text-gray-700">
                    Le système extrait automatiquement 15+ données clés (signatures, dates, montants, parties, etc.). 
                    Les agents peuvent en une minute faire ce qui prenait autrefois une heure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white font-bold">3</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sécurité Immuable via Blockchain</h4>
                  <p className="text-gray-700">
                    Chaque document reçoit un "hash" (empreinte digitale). Ce hash est enregistré sur Ethereum, créant une 
                    preuve cryptographique immuable que le document existait à une date donnée et qu'il n'a pas été modifié.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-600 text-white font-bold">4</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Conversational UX</h4>
                  <p className="text-gray-700">
                    Au lieu de lire 100 pages, les utilisateurs "discutent" avec leur contrat. Le système utilise la technologie RAG 
                    (Retrieval-Augmented Generation) pour garantir que les réponses viennent du document, sans hallucinations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800 font-semibold">
              Résultat: Documents statiques → Assets numériques intelligents, sécurisés et interrogeables
            </p>
          </div>
        </div>
      ),
    },

    // Slide 5: Architecture Overview
    {
      title: 'Architecture Générale',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold">
            LexiChain est construit selon une architecture en 5 couches, chacune avec une responsabilité claire.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Couche 1: Frontend (Présentation)</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Interface utilisateur construite avec Next.js 15 et React 19. C'est ce que les utilisateurs voient et avec quoi ils interagissent.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">Couche 2: Service Logic (Business)</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Contient la logique métier: extraction de données, validation, coordination entre les modules IA et Blockchain.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-600">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900">Couche 3: AI & RAG (Intelligence)</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Module spécialisé pour l'analyse des documents et la recherche sémantique. Utilise Gemini et les embeddings.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-orange-900">Couche 4: Blockchain (Sécurité)</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Enregistrement des hashs sur Ethereum. Garantit que les documents ne peuvent pas être modifiés après inscription.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-600">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Couche 5: Data (Persistance)</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Base de données PostgreSQL qui stocke les métadonnées des utilisateurs, documents et logs. Le contenu est chiffré.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 6: Technology Stack - Part 1
    {
      title: 'Stack Technologique - Partie 1',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">Pourquoi ces technologies ont été choisies</p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <Code2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-blue-900 mb-2">Next.js 15 (Frontend)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Framework React moderne qui supporte React Server Components et Server Actions.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> Performance optimale, SEO natif, déploiement facile sur Vercel, 
                    possibilité d'exécuter du code serveur directement dans les composants React sans API externe.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Les appels au blockchain et à l'IA peuvent rester sécurisés côté serveur, 
                    sans exposer les clés privées au navigateur.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-purple-900 mb-2">Google Gemini 2.0 Flash (LLM)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Modèle d'IA haute performance pour la compréhension des documents longs.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> Vitesse exceptionnelle (idéale pour UX temps-réel), 
                    fenêtre de contexte massive (1M tokens = 100+ documents), gratuit avec Vercel AI Gateway.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Peut analyser un document complet sans le découper, 
                    ce qui améliore l'accuracy de l'extraction et de la recherche RAG.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-emerald-900 mb-2">Ethereum + Solidity (Blockchain)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Blockchain décentralisée avec smart contracts programmables.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> Industrie-standard pour les contrats intelligents, sécurité cryptographique prouvée, 
                    mainnet établi + testnet Sepolia pour développement.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Les institutions financières font confiance à Ethereum. 
                    La preuve d'existence sur Ethereum est légalement reconnue et infalsifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Technology Stack - Part 2
    {
      title: 'Stack Technologique - Partie 2',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-orange-900 mb-2">PostgreSQL + Prisma (Base de Données)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Base de données relationnelle robuste avec ORM type-safe.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> PostgreSQL offre ACID compliance (garantit l'intégrité des données), 
                    Prisma fournit un ORM moderne avec auto-completion TypeScript.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Stockage sécurisé des métadonnées utilisateur, logs d'audit complets, 
                    migrations de schéma versionnées et reproductibles.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-pink-900 mb-2">Clerk (Authentication)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Plateforme d'authentification moderne et sécurisée.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> Sécurité niveau entreprise (conformité SOC 2, GDPR), 
                    MFA intégré, gestion de sessions robuste, intégration Native Next.js.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Les utilisateurs ne voient que leurs propres documents. 
                    Pas de gestion manuelle de sessions risquée.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-4">
                <GitBranch className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-bold text-indigo-900 mb-2">Feature-Sliced Design (Architecture)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Choix:</strong> Pattern architectural moderne pour organiser le code.
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pourquoi:</strong> Décorellation entre modules (IA ≠ Blockchain), 
                    scalabilité professionnelle, facilite les tests et la maintenance.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Bénéfice:</strong> Si Gemini doit être remplacé par Claude à l'avenir, 
                    le changement impacte seulement le module IA, pas l'architecture entière.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 8: How the App Works - Overview
    {
      title: 'Comment l\'Application Fonctionne',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">Le flux complet d'un utilisateur</p>

          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Authentification</h3>
                <p className="text-gray-700 text-sm">
                  L'utilisateur se connecte via Clerk. Chaque session est sécurisée avec des tokens JWT. 
                  Les données sensibles (clés privées, tokens) restent côté serveur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Upload du Document</h3>
                <p className="text-gray-700 text-sm">
                  L'utilisateur upload un PDF ou une image. Le fichier est stocké temporairement, 
                  puis traité par le système. Un hash SHA-256 est généré pour le traçage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Analyse par Gemini</h3>
                <p className="text-gray-700 text-sm">
                  Le système envoie le document à Gemini qui (a) extrait 15+ données clés (montants, dates, signatures) 
                  et (b) crée des embeddings (représentations numériques) de chaque section du texte.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Indexation RAG</h3>
                <p className="text-gray-700 text-sm">
                  Les embeddings sont stockés dans un index (vector store). Cela permet les recherches sémantiques 
                  ultra-rapides ("Le taux d'intérêt est?") sans refaire appel à Gemini chaque fois.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white font-bold flex-shrink-0">5</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Notarisation Blockchain</h3>
                <p className="text-gray-700 text-sm">
                  Le hash du document est signé avec une clé privée (gardée sécurisée) et enregistré dans un smart contract Ethereum. 
                  Ceci crée une preuve immuable d'existence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold flex-shrink-0">6</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Interaction Conversationnelle</h3>
                <p className="text-gray-700 text-sm">
                  L'utilisateur pose des questions. Le système cherche les sections pertinentes dans l'index RAG 
                  et demande à Gemini de formuler une réponse basée SEULEMENT sur ces extraits. Zéro hallucination.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 9: RAG Deep Dive
    {
      title: 'RAG Expliqué Simplement',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            RAG = Retrieval-Augmented Generation. C'est le cœur technologique de LexiChain.
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-300 mb-4">
            <h3 className="font-bold text-blue-900 mb-3">Le Problème des LLMs</h3>
            <p className="text-gray-700 text-sm">
              Un LLM classique (comme ChatGPT) a une limitation majeure: <strong>il peut halluciner</strong> (inventer des faits). 
              Si vous demandez "Quel est le taux d'intérêt du contrat?", il pourrait inventer une réponse plausible 
              qui n'existe pas dans votre document.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-3">Comment RAG Résout Cela (4 étapes)</h3>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-600">
              <h4 className="font-bold text-purple-900 mb-2">Étape 1: Chunking (Découpe)</h4>
              <p className="text-gray-700 text-sm">
                Le document est divisé en petits morceaux sémantiquement cohérents (ex: 1 clause = 1 chunk). 
                Chaque chunk conserve le sens d'une phrase ou d'une idée complète.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600">
              <h4 className="font-bold text-emerald-900 mb-2">Étape 2: Embedding (Vectorisation)</h4>
              <p className="text-gray-700 text-sm">
                Chaque chunk est converti en "embedding" (vecteur numérique 384D). Des chunks similaires ont des embeddings proches. 
                Les embeddings capturent le SENS du texte, pas juste les mots.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-600">
              <h4 className="font-bold text-orange-900 mb-2">Étape 3: Retrieval (Recherche)</h4>
              <p className="text-gray-700 text-sm">
                Quand l'utilisateur pose une question, elle est convertie en embedding. On cherche les chunks 
                avec les embeddings les plus proches (recherche vectorielle). Seuls les TOP 3-5 chunks pertinents sont retournés.
              </p>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-red-600">
              <h4 className="font-bold text-red-900 mb-2">Étape 4: Generation (Génération)</h4>
              <p className="text-gray-700 text-sm">
                Gemini reçoit: (question de l'user + chunks pertinents). Elle formule une réponse basée SEULEMENT 
                sur ces chunks. Impossible d'halluciner car la réponse doit exister dans les données.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800 font-semibold text-sm">
              ✓ Résultat: Réponses 100% fidèles au document, vérifié légalement, zéro hallucination
            </p>
          </div>
        </div>
      ),
    },

    // Slide 10: Blockchain Deep Dive
    {
      title: 'Blockchain Expliquée Simplement',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            Pourquoi LexiChain utilise Ethereum et comment cela fonctionne.
          </p>

          <div className="p-4 bg-red-50 rounded-lg border border-red-300 mb-4">
            <h3 className="font-bold text-red-900 mb-3">Le Problème</h3>
            <p className="text-gray-700 text-sm">
              Imaginons: un utilisateur sign un contrat avec votre banque. Deux ans plus tard, la banque dit 
              "Le taux d'intérêt était 5%". L'utilisateur répond "Non, c'était 3%!". Sans preuve immuable, 
              c'est un conflit non-résolvable. Les documents peuvent être modifiés, les serveurs peuvent être hacké.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-3">Comment LexiChain Résout Cela</h3>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
              <h4 className="font-bold text-blue-900 mb-2">Étape 1: Hashing (Empreinte Digitale)</h4>
              <p className="text-gray-700 text-sm">
                Chaque document reçoit un hash SHA-256 (empreinte de 64 caractères hexadécimaux). 
                Si 1 seul bit du document change, le hash entier change. Impossible de modifier le document sans changer le hash.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-600">
              <h4 className="font-bold text-purple-900 mb-2">Étape 2: Smart Contract</h4>
              <p className="text-gray-700 text-sm">
                Un smart contract Solidity enregistre le hash dans la blockchain Ethereum avec un timestamp. 
                Ethereum vérifie la signature avec une clé privée sécurisée (stockée côté serveur).
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600">
              <h4 className="font-bold text-emerald-900 mb-2">Étape 3: Immuabilité</h4>
              <p className="text-gray-700 text-sm">
                Une fois enregistré sur Ethereum, le hash ne peut JAMAIS être changé. Ethereum est sécurisé par 1000s de nodes 
                partout dans le monde. Hacker un seul node ne change rien car les autres verificateurs le rejetteront.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-600">
              <h4 className="font-bold text-orange-900 mb-2">Étape 4: Vérification</h4>
              <p className="text-gray-700 text-sm">
                2 ans plus tard, l'utilisateur télécharge son document. On recalcule le hash. Si le hash égale celui enregistré 
                sur Ethereum, on sait avec 100% de certitude que le document n'a pas été modifié.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800 font-semibold text-sm">
              ✓ Résultat: Preuve cryptographique immuable que le document existait à telle date et qu'il n'a pas été modifié
            </p>
          </div>
        </div>
      ),
    },

    // Slide 11: Layers Communication
    {
      title: 'Comment les Couches Communiquent',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            L'orchestration entre Frontend, IA, Blockchain et Base de Données
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">1️⃣ Frontend → Service Layer</h3>
              <p className="text-gray-700 text-sm mb-3">
                L'utilisateur clique "Analyser Document". Le Frontend envoie le fichier via une "Server Action" (Next.js). 
                Aucun API REST traditionnel. C'est sécurisé et direct.
              </p>
              <div className="bg-white p-3 rounded border border-blue-300 text-xs font-mono text-gray-700">
                User Click → Server Action → Service Layer (TypeScript)
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3">2️⃣ Service Layer → IA Service</h3>
              <p className="text-gray-700 text-sm mb-3">
                Le Service Layer décide: "Ce document a besoin d'être analysé". Il crée une instance du module IA 
                et lui passe le contenu du document.
              </p>
              <div className="bg-white p-3 rounded border border-purple-300 text-xs font-mono text-gray-700">
                await aiService.analyzeDocument(documentContent)
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-3">3️⃣ IA Service → Gemini API</h3>
              <p className="text-gray-700 text-sm mb-3">
                Le module IA formatte le document et l'envoie à Gemini via Vercel AI Gateway. 
                Gemini retourne l'extraction des données et les embeddings.
              </p>
              <div className="bg-white p-3 rounded border border-emerald-300 text-xs font-mono text-gray-700">
                generateObject() → Gemini → RAG Index
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3">4️⃣ Service Layer → Blockchain Service</h3>
              <p className="text-gray-700 text-sm mb-3">
                Une fois l'analyse terminée, le Service Layer enregistre le hash sur le blockchain via le module Blockchain. 
                Le module Blockchain signe et envoie à Ethereum.
              </p>
              <div className="bg-white p-3 rounded border border-orange-300 text-xs font-mono text-gray-700">
                await blockchainService.registerDocument(hash, userId)
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
              <h3 className="font-bold text-gray-900 mb-3">5️⃣ Service Layer → Database</h3>
              <p className="text-gray-700 text-sm mb-3">
                Les métadonnées (utilisateur, document, hash, status) sont sauvegardées dans PostgreSQL via Prisma. 
                Logs d'audit complets pour la conformité.
              </p>
              <div className="bg-white p-3 rounded border border-gray-300 text-xs font-mono text-gray-700">
                await db.document.create({...metadata})
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-100 rounded-lg border border-indigo-300">
            <p className="text-indigo-900 font-semibold text-sm">
              🔄 Résultat: Flux séquentiel, chaque couche indépendante, communication claire et type-safe via TypeScript
            </p>
          </div>
        </div>
      ),
    },

    // Slide 12: Security & Compliance
    {
      title: 'Sécurité et Conformité',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            LexiChain est construit avec une approche "Security by Design".
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
              <h3 className="font-bold text-blue-900 mb-2">🔐 Authentification (Clerk)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Chaque utilisateur a une session cryptographique. Multi-factor authentication optionnelle. 
                Pas de stockage de mots de passe en clair.
              </p>
              <p className="text-gray-700 text-sm text-xs">
                <strong>Conformité:</strong> SOC 2 Type II, GDPR-compliant
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-600">
              <h3 className="font-bold text-green-900 mb-2">🔒 Chiffrement des Données</h3>
              <p className="text-gray-700 text-sm mb-2">
                Les documents sont chiffrés en transit (HTTPS/TLS 1.3) et au repos dans PostgreSQL. 
                Les clés privées Ethereum sont gardées dans des variables d'environnement sécurisées.
              </p>
              <p className="text-gray-700 text-sm text-xs">
                <strong>Conformité:</strong> ISO 27001, PCI DSS
              </p>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-600">
              <h3 className="font-bold text-purple-900 mb-2">📋 GDPR & Droit à l'Oubli</h3>
              <p className="text-gray-700 text-sm mb-2">
                Les données personnelles (noms, emails) ne sont jamais stockées sur la blockchain, seulement le hash. 
                Les utilisateurs peuvent demander la suppression de leurs données (suppression des records PostgreSQL).
              </p>
              <p className="text-gray-700 text-sm text-xs">
                <strong>Bonus:</strong> Les hashes sur Ethereum restent comme preuve historique, mais aucune donnée personnelle n'y est associée
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-600">
              <h3 className="font-bold text-orange-900 mb-2">📊 Logs d'Audit Complets</h3>
              <p className="text-gray-700 text-sm mb-2">
                Chaque action (upload, analyse, vérification blockchain) est loggée avec timestamp, utilisateur, et résultat. 
                Les logs aident en cas d'investigation légale ou d'audit.
              </p>
              <p className="text-gray-700 text-sm text-xs">
                <strong>Utile pour:</strong> MiFID II, Directive sur la Monnaie Électronique
              </p>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">🛡️ Non-Repudiation (Blockchain)</h3>
              <p className="text-gray-700 text-sm mb-2">
                Une fois un document notarié sur Ethereum, ni l'utilisateur ni la plateforme ne peut nier l'existence 
                du document à une date donnée. Cela crée une "Preuve Légale".
              </p>
              <p className="text-gray-700 text-sm text-xs">
                <strong>Valeur Légale:</strong> Reconnue dans les litiges financiers (e-IDAS, EU Digital Signature Directive)
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 13: Use Cases
    {
      title: 'Cas d\'Usage',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            Secteurs où LexiChain crée une valeur immédiate
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">1</div>
                <div className="flex-grow">
                  <h3 className="font-bold text-blue-900 mb-2">Fusions & Acquisitions (M&A)</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Lors d'une acquisition, les audits doivent vérifier des 1000s de contrats. 
                    Au lieu de 6 mois de travail manuel, LexiChain extrait les données critiques en heures.
                  </p>
                  <div className="bg-blue-100 p-2 rounded text-xs text-blue-900">
                    💰 ROI: Économies de coûts d'audit × 10
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold flex-shrink-0">2</div>
                <div className="flex-grow">
                  <h3 className="font-bold text-purple-900 mb-2">KYC / AML (Anti-Blanchiment)</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Les banques doivent vérifier que chaque client est conforme (documents d'identité, vérifications). 
                    LexiChain vérifie automatiquement les documents fournis.
                  </p>
                  <div className="bg-purple-100 p-2 rounded text-xs text-purple-900">
                    💰 ROI: Temps KYC réduit de 50%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold flex-shrink-0">3</div>
                <div className="flex-grow">
                  <h3 className="font-bold text-emerald-900 mb-2">Assurance & Sinistres</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Quand un client demande un dédommagement, l'assureur doit vérifier les conditions du sinistre. 
                    LexiChain répond en secondes: "Couvre-t-il ce type de dommage?"
                  </p>
                  <div className="bg-emerald-100 p-2 rounded text-xs text-emerald-900">
                    💰 ROI: Traitement des sinistres 3× plus rapide
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold flex-shrink-0">4</div>
                <div className="flex-grow">
                  <h3 className="font-bold text-orange-900 mb-2">Audit Légal</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Les auditeurs doivent vérifier que tous les contrats signés sont correctement stockés et inchangés. 
                    La blockchain fournit la preuve.
                  </p>
                  <div className="bg-orange-100 p-2 rounded text-xs text-orange-900">
                    💰 ROI: Certitude légale, 100% traçabilité
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 14: Why This Matters
    {
      title: 'Pourquoi C\'est Important',
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 font-semibold mb-4">
            Un résumé des innovations et de la valeur
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Innovation IA
              </h3>
              <p className="text-gray-700 text-sm">
                RAG + Gemini crée une expérience conversationnelle inédite avec les contrats. 
                Zéro hallucinations, 100% fidèle aux documents.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Innovation Blockchain
              </h3>
              <p className="text-gray-700 text-sm">
                Ethereum + Smart Contracts crée une "Digital Notary" immuable. 
                Première solution BFSI qui combine IA + Blockchain.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Conformité
              </h3>
              <p className="text-gray-700 text-sm">
                GDPR, MiFID II, ISO 27001, SOC 2. Construit avec sécurité dès le départ. 
                Aucun donnée personnelle sur blockchain.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Production-Ready
              </h3>
              <p className="text-gray-700 text-sm">
                Feature-Sliced Design, type-safe TypeScript, architecture scalable. 
                Prêt pour une adoption enterprise immédiate.
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-300">
            <h3 className="font-bold text-gray-900 mb-3">Impact sur le Marché</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Réduction de 70% du temps de vérification des contrats
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Élimination de 95% des erreurs humaines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Preuve légale immuable pour tous les contrats
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Conformité réglementaire garantie
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 15: Conclusion
    {
      title: 'Conclusion',
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">LexiChain: Une Plateforme Révolutionnaire</h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                <strong>LexiChain</strong> n'est pas seulement un projet de fin d'études. C'est une solution 
                production-ready qui résout des problèmes réels dans le secteur BFSI.
              </p>

              <div className="space-y-2">
                <p className="text-gray-700 flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">→</span>
                  <span><strong>Pour les Utilisateurs:</strong> Accès transparent et conversationnel à leurs contrats</span>
                </p>
                <p className="text-gray-700 flex items-start gap-3">
                  <span className="font-bold text-purple-600 flex-shrink-0">→</span>
                  <span><strong>Pour les Institutions:</strong> Automatisation massive, conformité garantie, efficacité accrue</span>
                </p>
                <p className="text-gray-700 flex items-start gap-3">
                  <span className="font-bold text-emerald-600 flex-shrink-0">→</span>
                  <span><strong>Pour la Technologie:</strong> Fusion unique d'IA (RAG) et Blockchain (Notarisation)</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-300 my-6"></div>

            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Le Stack Technique En Résumé</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Frontend:</strong> Next.js 15 + React 19 (Performance, SSR, Server Actions)</p>
                <p><strong>IA:</strong> Gemini 2.0 Flash + RAG (Analyse sans hallucinations)</p>
                <p><strong>Blockchain:</strong> Ethereum + Solidity (Notarisation immuable)</p>
                <p><strong>Backend:</strong> PostgreSQL + Prisma (Données sécurisées)</p>
                <p><strong>Auth:</strong> Clerk (Sécurité enterprise)</p>
                <p><strong>Architecture:</strong> Feature-Sliced Design (Scalabilité)</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="text-gray-900 font-semibold text-center">
                LexiChain = Intelligence + Immuabilité + Transparence + Conformité
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm italic">
              Merci d'avoir exploré LexiChain. Prêt à transformer les documents statiques en assets intelligents? 🚀
            </p>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center" onKeyDown={handleKeyDown} tabIndex="0">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LexiChain</h1>
            <p className="text-gray-600">Présentation Technique Professionnelle</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Slide {currentSlide + 1} / {slides.length}</p>
          </div>
        </div>

        {/* Main Slide Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-2xl p-12 min-h-[600px] flex flex-col"
          >
            {/* Slide Title */}
            <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-blue-600 pb-4">
              {slide.title}
            </h2>

            {/* Slide Content */}
            <div className="flex-grow overflow-y-auto">
              {slide.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Précédent
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Suivant
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Utilisez les flèches du clavier (← →) pour naviguer | Cliquez sur les points pour aller à une slide</p>
        </div>
      </div>
    </div>
  );
}
