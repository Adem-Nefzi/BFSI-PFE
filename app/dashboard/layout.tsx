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
    <div className="flex flex-col h-screen bg-gradient-bg-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <TopNav />
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
