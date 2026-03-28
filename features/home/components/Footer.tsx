"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

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
      className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

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
      className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease-out",
        }}
      >
        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <a href="#" className="inline-flex items-center gap-2 group">
            <div className="relative">
              <Image
                src="/LexiChain.png"
                alt="LexiChain Logo"
                width={48}
                height={48}
                className="
                      relative z-10
                      w-12 h-12 object-contain
                      transition-all duration-300 ease-out
                      group-hover:scale-110
                    "
              />
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-4xl h-px bg-slate-200 dark:bg-slate-800" />

          {/* Bottom Row */}
          <div className="flex items-center gap-8">
            {/* Copyright */}
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © LexiChain
            </p>

            {/* Social Icons */}
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
