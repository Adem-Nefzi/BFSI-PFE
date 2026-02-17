"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  ClipboardList,
  Link as LinkIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
  },
  {
    label: "AI Assistant",
    href: "/dashboard/assistant",
    icon: MessageSquare,
  },
  {
    label: "Claims",
    href: "/dashboard/claims",
    icon: ClipboardList,
  },
  {
    label: "Blockchain",
    href: "/dashboard/blockchain",
    icon: LinkIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 z-30 flex flex-col border-r border-border bg-white dark:bg-slate-900 transition-all duration-300 lg:static lg:top-0 shadow-lg lg:shadow-none",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Tooltip key={item.href} delayDuration={collapsed ? 0 : 1000}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 transition-all duration-200 relative group",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">Help & Support</span>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Help & Support</TooltipContent>
            )}
          </Tooltip>

          <Button
            className={cn(
              "w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105",
              collapsed && "p-0 h-10"
            )}
          >
            <Zap className="w-4 h-4 flex-shrink-0 animate-pulse" />
            {!collapsed && <span className="text-sm">Upgrade Pro</span>}
          </Button>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex m-4 h-10 w-10"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  );
}
