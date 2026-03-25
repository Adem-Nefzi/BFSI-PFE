// src/app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 1: Get the webhook secret from environment
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET in environment variables");
    return new Response("Server configuration error", { status: 500 });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 2: Get headers needed for verification
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 3: Get the request body
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 4: Verify the webhook signature
  // This ensures the webhook is actually from Clerk
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 5: Handle different webhook events
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const eventType = evt.type;

  console.log(`📥 Webhook received: ${eventType}`);

  switch (eventType) {
    // ═══════════════════════════════════════════════════
    // USER CREATED
    // ═══════════════════════════════════════════════════
    case "user.created": {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: id },
        });

        if (existingUser) {
          console.log(`⚠️  User already exists: ${id}`);
          return new Response("User already exists", { status: 200 });
        }

        // Create user in database
        const user = await prisma.user.create({
          data: {
            clerkId: id,
            email: email_addresses[0]?.email_address ?? "",
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            imageUrl: image_url ?? null,
          },
        });

        console.log(`✅ User created: ${user.email} (${user.id})`);

        return new Response("User created successfully", { status: 201 });
      } catch (error) {
        console.error("❌ Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    // ═══════════════════════════════════════════════════
    // USER UPDATED
    // ═══════════════════════════════════════════════════
    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      try {
        const user = await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: email_addresses[0]?.email_address ?? "",
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            imageUrl: image_url ?? null,
          },
        });

        console.log(`✅ User updated: ${user.email} (${user.id})`);

        return new Response("User updated successfully", { status: 200 });
      } catch (error) {
        console.error("❌ Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    // ═══════════════════════════════════════════════════
    // USER DELETED
    // ═══════════════════════════════════════════════════
    case "user.deleted": {
      const { id } = evt.data;

      if (!id) {
        console.error("❌ No user ID provided in deletion event");
        return new Response("No user ID provided", { status: 400 });
      }

      try {
        // Delete user (CASCADE will delete all related contracts)
        await prisma.user.delete({
          where: { clerkId: id },
        });

        console.log(`✅ User deleted: ${id}`);

        return new Response("User deleted successfully", { status: 200 });
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        return new Response("Error deleting user", { status: 500 });
      }
    }

    // ═══════════════════════════════════════════════════
    // OTHER EVENTS (ignore)
    // ═══════════════════════════════════════════════════
    default: {
      console.log(`ℹ️  Unhandled webhook event: ${eventType}`);
      return new Response("Event type not handled", { status: 200 });
    }
  }
}
