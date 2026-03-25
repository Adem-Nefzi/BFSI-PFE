"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserStats } from "@/lib/services/stats.service";

export async function getStatsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  return await getUserStats(userId);
}
