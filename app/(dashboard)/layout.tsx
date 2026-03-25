import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardNavigation } from "@/components/views/dashboard/navigation";

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
