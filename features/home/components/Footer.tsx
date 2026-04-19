"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

// ==========================================
// Composant : Icône Sociale Premium
// ==========================================
function SocialIcon({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]"
    >
      {/* Lueur d'arrière-plan au survol */}
      <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />

      {/* Icône */}
      <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-primary relative z-10 transition-colors duration-300" />
    </a>
  );
}

// ==========================================
// Composant Principal : Footer
// ==========================================
export function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <footer
      id="footer"
      ref={ref}
      className="relative overflow-hidden bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Effet Wow 1 : Ligne de démarcation en dégradé */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 dark:via-foreground/15 to-transparent" />

      {/* Effet Wow 2 : Lueur d'ambiance à la base de la page */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,hsla(var(--primary),0.15)_0%,transparent_60%)] pointer-events-none" />

      <div
        className="relative z-10 max-w-7xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div className="flex flex-col items-center space-y-10">
          {/* Logo & Nom de la marque avec Lueur */}
          <a href="#" className="inline-flex flex-col items-center gap-3 group">
            <div className="relative">
              {/* Lueur sous le logo */}
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="/LexiChain.png"
                alt="LexiChain Logo"
                width={56}
                height={56}
                className="relative z-10 w-14 h-14 object-contain transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-300">
              LexiChain
            </span>
          </a>

          {/* Liens de Navigation avec animation de soulignement */}
          <nav className="flex items-center gap-8 md:gap-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group py-1"
              >
                {link.label}
                {/* Ligne d'animation au survol */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-out group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Séparateur minimaliste */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Section Inférieure (Copyright & Réseaux) */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-6">
            <p className="text-sm font-medium text-muted-foreground/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
              © {new Date().getFullYear()} LexiChain. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <SocialIcon
                icon={Twitter}
                href="https://twitter.com"
                label="Twitter"
              />
              <SocialIcon
                icon={Linkedin}
                href="https://linkedin.com"
                label="LinkedIn"
              />
              <SocialIcon
                icon={Github}
                href="https://github.com"
                label="GitHub"
              />
              <SocialIcon
                icon={Mail}
                href="mailto:contact@lexichain.com"
                label="Email"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
