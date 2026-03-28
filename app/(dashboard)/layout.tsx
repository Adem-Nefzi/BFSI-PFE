import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardNavigation } from "@/components/layout/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | LexiChain Contract Intelligence",
  description: "View and manage your AI-processed financial contracts, analytics, and metrics in real time.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      <div className="ml-72">{children}</div>
    </div>
  );
}
