"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTheme } from "@/hooks/useTheme";
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

// Footer Link Component
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200"
    >
      <span>{children}</span>
      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
    </a>
  );
}

// Social Icon Component
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
      className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300/50 dark:border-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all duration-200"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

export function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { theme, toggleTheme, mounted } = useTheme();

  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Documentation", href: "#" },
    { label: "API Access", href: "#" },
    { label: "Updates", href: "#" },
  ];

  const resourceLinks = [
    { label: "Blog", href: "#" },
    { label: "Guides", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Support", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
  ];

  return (
    <footer
      id="footer"
      ref={ref}
      className="relative bg-white dark:bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50"
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div
        className="max-w-6xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s ease-out",
        }}
      >
        {/* Centered Logo Section */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          {/* Logo */}
          <a href="#" className="inline-flex items-center gap-2 group mb-4">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              Smart-Admin Copilot
            </span>
          </a>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
            AI-powered contract intelligence
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed max-w-md mb-6">
            Transform your contract management with cutting-edge AI and
            blockchain technology. Built for banking, financial services, and
            insurance.
          </p>

          {/* Social Icons - Centered */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <SocialIcon
              icon={Github}
              href="https://github.com"
              label="GitHub"
            />
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
              icon={Mail}
              href="mailto:contact@smartadmin.com"
              label="Email"
            />
          </div>
        </div>

        {/* Navigation Links - Centered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 text-center sm:text-left">
          {/* Product Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 mb-8" />

        {/* Bottom Bar - Centered */}
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2024 Smart-Admin Copilot. All rights reserved.
          </p>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Language Selector */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all duration-200">
              <span className="text-lg">🇬🇧</span>
              <span>English</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "light" ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </>
                )
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Theme</span>
                </>
              )}
            </button>
          </div>

          {/* Made With Love */}
          <p className="text-xs text-slate-500 dark:text-slate-600 mt-4">
            Made with <span className="text-red-500">♥</span> for your PFE
            project
          </p>
        </div>
      </div>
    </footer>
  );
}
