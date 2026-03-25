// Script to sync existing Clerk users to database
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

async function syncUsers() {
  try {
    console.log("🔄 Starting user sync...");

    // Get all users from Clerk
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList();

    console.log(`📋 Found ${users.data.length} users in Clerk`);

    for (const user of users.data) {
      try {
        await prisma.user.upsert({
          where: { clerkId: user.id },
          create: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            imageUrl: user.imageUrl || null,
          },
          update: {
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            imageUrl: user.imageUrl || null,
          },
        });

        console.log(`✅ Synced user: ${user.emailAddresses[0]?.emailAddress}`);
      } catch (error) {
        console.error(`❌ Error syncing user ${user.id}:`, error);
      }
    }

    console.log("✨ User sync completed!");
  } catch (error) {
    console.error("❌ Error in sync process:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncUsers();
