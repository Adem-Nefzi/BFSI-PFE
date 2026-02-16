"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ClipboardList,
  Link as LinkIcon,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
  },
  {
    label: "Chat",
    href: "/dashboard/assistant",
    icon: MessageSquare,
  },
  {
    label: "Claims",
    href: "/dashboard/claims",
    icon: ClipboardList,
  },
  {
    label: "More",
    href: "/dashboard/more",
    icon: MoreHorizontal,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden h-20 border-t border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-40">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/dashboard/more" && !navItems.slice(0, -1).some(i => pathname === i.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-4 px-2 transition-all duration-200"
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
