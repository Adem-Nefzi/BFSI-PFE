"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#stats" },
  { label: "Contact", href: "#footer" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveLink(href);
      setIsMobileMenuOpen(false);
    }
  };
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "mt-0 px-0" : "mt-6 px-4"
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled ? "max-w-full" : "max-w-6xl"
          }`}
        >
          <div
            className={`glass rounded-full px-4 md:px-8 py-3 md:py-4 transition-all duration-500 ${
              isScrolled
                ? "rounded-none shadow-lg backdrop-blur-2xl"
                : "shadow-xl hover:shadow-2xl"
            } ${
              isScrolled
                ? "border-b border-slate-200/50 dark:border-slate-700/50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a
                href="#"
                className="flex items-center gap-3 group"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Image
                    src="/LexiChain.png"
                    alt="LexiChain Logo"
                    width={34}
                    height={34}
                    className="relative z-10 w-8 h-8 object-contain transition-all duration-300 ease-out group-hover:scale-110"
                  />
                </div>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                      activeLink === link.href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {link.label}
                    {activeLink === link.href && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    )}
                  </a>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2 md:gap-3">
                <ModeToggle />
                {/* Global Clerk context usage */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="hidden md:flex">
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button className="hidden md:flex btn-gradient">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="hidden md:inline-block">
                    <Button variant="outline">Dashboard</Button>
                  </Link>

                  <UserButton afterSignOutUrl="/" />
                </SignedIn>

                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden"
                  variant="ghost"
                  size="icon"
                >
                  <div className="relative w-6 h-6">
                    <span
                      className={`absolute left-0 w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? "top-3 rotate-45" : "top-1"}`}
                    />
                    <span
                      className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                    />
                    <span
                      className={`absolute left-0 w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? "top-3 -rotate-45" : "top-5"}`}
                    />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 pt-20">
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6"
              variant="ghost"
              size="icon"
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-4 py-3 text-lg font-medium"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-4 border-t border-slate-200/70 dark:border-slate-700/70 pt-5 space-y-3">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full btn-gradient">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full">Go to Dashboard</Button>
                  </Link>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-700/70 px-3 py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Account
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
