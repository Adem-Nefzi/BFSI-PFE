import { ReactNode } from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export const metadata = {
  title: "Dashboard | Smart-Admin Copilot",
  description: "Manage your contracts with AI-powered insights",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gradient-bg-mesh dark:bg-gradient-bg-mesh relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blue Gradient Orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
        
        {/* Teal Gradient Orb */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        
        {/* Violet Gradient Orb */}
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30 dark:opacity-20" />
      </div>

      {/* Content Layer */}
      <div className="flex flex-col h-screen relative z-10">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 bg-slate-50/50 dark:bg-slate-950/50">
            {children}
          </main>
        </div>
        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
