"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import NotificationBar from "@/features/notifications/components/notification-bar";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "View your statistics",
  },
  {
    href: "/contacts",
    label: "Contracts",
    icon: <FileText className="w-5 h-5" />,
    description: "Manage contracts",
  },
  {
    href: "/blockchain",
    label: "Blockchain",
    icon: <Link2 className="w-5 h-5" />,
    description: "On-chain proofs",
  },
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 border-r border-border/60 bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <svg
          viewBox="0 0 320 400"
          fill="none"
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full opacity-50"
        >
          <path
            d="M0 338C56 312 82 252 142 252C194 252 214 302 266 302C294 302 306 290 320 276"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 372C52 342 88 322 132 322C176 322 212 346 252 346C282 346 304 338 320 326"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 7"
          />
        </svg>
      </div>

      {/* Logo section */}
      <div className="relative z-10 p-6 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Image
            src="/LexiChain.png"
            alt="LexiCHAIN Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">LexiChain</span>
            <span className="text-xs text-muted-foreground">
              Operations Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={item.href}>
                <div
                  className={`relative p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/60 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-lg bg-primary/5"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <span
                      className={`transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div
                        className={`font-medium text-sm ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                      >
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="relative z-10 p-4 border-t border-border/40 space-y-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-r from-muted/35 via-background to-muted/25 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="flex items-center gap-2">
              <NotificationBar />
              <ModeToggle />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Trusted workspace
          </div>
        </div>
      </div>
    </div>
  );
}
