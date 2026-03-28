/**
 * Notification Server Actions
 *
 * Handles all notification-related server actions including:
 * - Fetching notifications
 * - Marking notifications as read
 * - Deleting notifications
 * - Checking for deadline notifications
 *
 * These actions are called from client components and provide real-time
 * notification management with Clerk authentication.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { ContractService } from "@/lib/services/contract.service";
import { NotificationService } from "@/lib/services/notification.service";

const isNotificationTableMissingError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const maybePrismaError = error as {
    code?: string;
    meta?: { table?: string };
    message?: string;
  };

  if (maybePrismaError.code !== "P2021") return false;

  const tableFromMeta = maybePrismaError.meta?.table ?? "";
  const message = maybePrismaError.message ?? "";

  return (
    tableFromMeta.includes("Notification") ||
    message.includes("public.Notification")
  );
};

/**
 * Fetches all unread notifications for the current authenticated user
 *
 * Uses Clerk authentication to get the current user's ID
 *
 * @param limit - Maximum number of notifications to return (default: 10)
 * @returns Object with success status and notifications array
 *
 * Steps:
 * 1. Authenticate user via Clerk
 * 2. Get internal user ID from database using Clerk ID
 * 3. Fetch unread notifications from database
 * 4. Include contract details (title, endDate)
 * 5. Return sorted by creation date (newest first)
 *
 * Example usage in component:
 * ```typescript
 * const { unreadNotifications } = await getNotifications();
 * ```
 */
export async function getNotifications(limit: number = 10) {
  try {
    // Step 1: Authenticate user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Step 2: Get internal user ID from database
    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Step 3: Enforce cleanup policy for seen non-deadline notifications
    await NotificationService.cleanupReadNonDeadline(user.id);

    // Step 4: Fetch unread notifications
    const result = await NotificationService.getUnread(user.id, limit);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: [],
      };
    }

    console.error("Get notifications error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches complete notification history for the current user
 *
 * Returns both read and unread notifications for notification center/log view
 *
 * @param limit - Maximum number of notifications to return (default: 50)
 * @returns Object with success status and all notifications array
 */
export async function getAllNotifications(limit: number = 50) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    await NotificationService.cleanupReadNonDeadline(user.id);

    const result = await NotificationService.getAll(user.id, limit);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: [],
      };
    }

    console.error("Get all notifications error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Gets count of unread notifications for badge display
 *
 * Used to show badge count on notification icon in the UI
 *
 * @returns Object with unread notification count
 *
 * Example usage:
 * ```typescript
 * const { data } = await getUnreadNotificationCount();
 * // Display data.count as badge on notification bell icon
 * ```
 */
export async function getUnreadNotificationCount() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    await NotificationService.cleanupReadNonDeadline(user.id);

    const result = await NotificationService.getUnreadCount(user.id);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: { count: 0 },
      };
    }

    console.error("Get unread count error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Marks a single notification as read
 *
 * @param notificationId - The ID of the notification to mark as read
 * @returns Object with success status
 *
 * Security: Verifies the notification belongs to the current user
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await NotificationService.markAsRead(notificationId);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
      };
    }

    console.error("Mark notification as read error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Marks all unread notifications as read for the current user
 *
 * @returns Object with success status and count of updated notifications
 */
export async function markAllNotificationsAsRead() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const result = await NotificationService.markAllAsRead(user.id);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: { count: 0 },
      };
    }

    console.error("Mark all notifications as read error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Force cleanup of seen non-deadline notifications for current user.
 * Useful as a maintenance endpoint from UI hooks.
 */
export async function cleanupSeenNotifications() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return await NotificationService.cleanupReadNonDeadline(user.id);
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: { count: 0 },
      };
    }

    console.error("Cleanup seen notifications error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deletes a notification
 *
 * @param notificationId - The ID of the notification to delete
 * @returns Object with success status
 *
 * Security: Verifies the notification belongs to the current user before deletion
 */
export async function deleteNotification(notificationId: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await NotificationService.delete(notificationId);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
      };
    }

    console.error("Delete notification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks for upcoming contract deadlines and creates notifications
 *
 * Scans all user's contracts and creates DEADLINE type notifications for:
 * - 30 days before expiration (CRITICAL - 🔴)
 * - 15 days before expiration (WARNING - 🟠)
 * - 7 days before expiration (URGENT - 🟡)
 *
 * @returns Object with success status and count of created notifications
 *
 * Should be called:
 * - On dashboard page load (to refresh deadline list)
 * - Once per day at a scheduled time via cron job
 * - When monitoring upcoming deadlines
 *
 * Example usage:
 * ```typescript
 * // In dashboard page effect
 * useEffect(() => {
 *   checkDeadlineNotifications();
 * }, []);
 * ```
 */
export async function checkDeadlineNotifications() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const user = await ContractService.getUserByClerkId(clerkId);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const result = await NotificationService.checkUpcomingDeadlines(user.id);

    return result;
  } catch (error: unknown) {
    if (isNotificationTableMissingError(error)) {
      return {
        success: true,
        data: { count: 0, contractIds: [] },
      };
    }

    console.error("Check deadline notifications error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
