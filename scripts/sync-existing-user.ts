// One-time script to sync existing Clerk user to database
// Run this once: npx tsx scripts/sync-existing-user.ts

import "dotenv/config";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncExistingUser() {
  try {
    console.log("🔄 Starting one-time user sync...\n");

    // Get all users from Clerk
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList();

    console.log(`📋 Found ${users.data.length} user(s) in Clerk\n`);

    for (const user of users.data) {
      try {
        // Check if user already exists in database
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: user.id },
        });

        if (existingUser) {
          console.log(
            `⏭️  User already synced: ${user.emailAddresses[0]?.emailAddress}`,
          );
          continue;
        }

        // Create user in database
        const newUser = await prisma.user.create({
          data: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            imageUrl: user.imageUrl || null,
          },
        });

        console.log(
          `✅ Synced user: ${newUser.email} (Database ID: ${newUser.id})`,
        );
      } catch (error) {
        console.error(`❌ Error syncing user ${user.id}:`, error);
      }
    }

    console.log("\n✨ User sync completed!");
    console.log("🎉 You can now upload contracts!");
  } catch (error) {
    console.error("❌ Error in sync process:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncExistingUser();
