/**
 * Notification Service
 *
 * Handles all notification-related operations including:
 * - Creating notifications for user actions
 * - Retrieving notifications with filtering
 * - Marking notifications as read
 * - Checking for upcoming contract renewals/deadlines
 * - Cleaning up expired notifications
 *
 * Integrates with Prisma ORM for database operations.
 * Supports multiple notification types: SUCCESS, WARNING, ERROR, INFO, DEADLINE
 */

import { prisma } from "@/lib/db/prisma";

let hasWarnedMissingNotificationTable = false;

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

const warnMissingNotificationTableOnce = () => {
  if (hasWarnedMissingNotificationTable) return;
  hasWarnedMissingNotificationTable = true;
  console.warn(
    "Notification table is missing. Notification features are temporarily disabled until schema is synced.",
  );
};

/**
 * Notification type for creating new notifications
 */
interface CreateNotificationInput {
  userId: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO" | "DEADLINE";
  title: string;
  message: string;
  contractId?: string;
  actionType?: string;
  actionData?: Record<string, any>;
  icon?: string;
  expiresIn?: number; // milliseconds
}

/**
 * Response type for notification operations
 */
interface NotificationResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export class NotificationService {
  static async cleanupReadNonDeadline(
    userId: string,
  ): Promise<NotificationResponse> {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          userId,
          read: true,
          NOT: {
            type: "DEADLINE",
          },
        },
      });

      return {
        success: true,
        message: `Cleaned ${result.count} seen non-deadline notifications`,
        data: { count: result.count },
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Read cleanup skipped.",
          data: { count: 0 },
        };
      }

      console.error("Error cleaning read non-deadline notifications:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cleanup seen notifications",
      };
    }
  }

  /**
   * Creates a new notification for a user
   *
   * @param input - Notification creation parameters
   * @returns Promise with success status and notification data
   *
   * Steps:
   * 1. Calculate expiration time if provided (default: 30 days)
   * 2. Insert notification into database
   * 3. Return created notification with metadata
   *
   * Example:
   * ```typescript
   * await NotificationService.create({
   *   userId: "user123",
   *   type: "SUCCESS",
   *   title: "Contract Uploaded",
   *   message: "Your contract has been uploaded successfully"
   * });
   * ```
   */
  static async create(
    input: CreateNotificationInput,
  ): Promise<NotificationResponse> {
    try {
      // Calculate expiration time: default to 30 days if not specified
      const expiresAt = input.expiresIn
        ? new Date(Date.now() + input.expiresIn)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Create notification in database
      const notification = await prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          contractId: input.contractId ?? undefined,
          actionType: input.actionType ?? undefined,
          actionData: input.actionData ?? undefined,
          icon: input.icon ?? undefined,
          expiresAt,
        },
      });

      return {
        success: true,
        data: notification,
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification skipped: table not available yet.",
        };
      }

      console.error("Error creating notification:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create notification",
      };
    }
  }

  /**
   * Retrieves all unread notifications for a user
   *
   * @param userId - The user's ID
   * @param limit - Maximum number of notifications to return (default: 10)
   * @returns Promise with array of notifications sorted by creation date (newest first)
   *
   * Steps:
   * 1. Query database for unread notifications
   * 2. Filter out expired notifications (expiresAt < now)
   * 3. Sort by creation date (descending)
   * 4. Limit results to specified count
   *
   * Example:
   * ```typescript
   * const notifications = await NotificationService.getUnread("user123", 15);
   * ```
   */
  static async getUnread(
    userId: string,
    limit: number = 10,
  ): Promise<NotificationResponse> {
    try {
      // Enforce retention policy on each read path.
      await this.cleanupReadNonDeadline(userId);

      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          read: false,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
          contract: {
            select: {
              id: true,
              title: true,
              fileName: true,
              endDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          data: [],
        };
      }

      console.error("Error fetching unread notifications:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
      };
    }
  }

  /**
   * Retrieves all notifications for a user (read and unread)
   *
   * @param userId - The user's ID
   * @param limit - Maximum number of notifications to return (default: 50)
   * @returns Promise with array of all notifications sorted by creation date
   *
   * Used for displaying complete notification history/log
   */
  static async getAll(
    userId: string,
    limit: number = 50,
  ): Promise<NotificationResponse> {
    try {
      // Enforce retention policy on each read path.
      await this.cleanupReadNonDeadline(userId);

      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
          contract: {
            select: {
              id: true,
              title: true,
              fileName: true,
              endDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          data: [],
        };
      }

      console.error("Error fetching all notifications:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
      };
    }
  }

  /**
   * Marks a notification as read
   *
   * @param notificationId - The ID of the notification to mark as read
   * @returns Promise with success status
   *
   * Steps:
   * 1. Update notification read flag to true
   * 2. Return updated notification
   */
  static async markAsRead(
    notificationId: string,
  ): Promise<NotificationResponse> {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });

      if (notification.type !== "DEADLINE") {
        await prisma.notification.delete({
          where: { id: notificationId },
        });

        return {
          success: true,
          message: "Notification marked as read and auto-deleted",
          data: {
            id: notificationId,
            deleted: true,
          },
        };
      }

      return {
        success: true,
        data: notification,
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Mark-as-read skipped.",
        };
      }

      console.error("Error marking notification as read:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      };
    }
  }

  /**
   * Marks all unread notifications as read for a user
   *
   * @param userId - The user's ID
   * @returns Promise with count of updated notifications
   */
  static async markAllAsRead(userId: string): Promise<NotificationResponse> {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: { read: true },
      });

      const cleanup = await this.cleanupReadNonDeadline(userId);
      const cleanupCount = cleanup.success ? cleanup.data?.count || 0 : 0;

      return {
        success: true,
        message: `Marked ${result.count} notifications as read and auto-deleted ${cleanupCount} non-deadline items`,
        data: { count: result.count, deletedCount: cleanupCount },
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Mark-all-as-read skipped.",
          data: { count: 0 },
        };
      }

      console.error("Error marking all notifications as read:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notifications as read",
      };
    }
  }

  /**
   * Deletes a notification
   *
   * @param notificationId - The ID of the notification to delete
   * @returns Promise with success status
   */
  static async delete(notificationId: string): Promise<NotificationResponse> {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });

      return {
        success: true,
        message: "Notification deleted successfully",
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Delete skipped.",
        };
      }

      console.error("Error deleting notification:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete notification",
      };
    }
  }

  /**
   * Cleans up expired notifications from the database
   *
   * Called periodically to remove old notifications
   * Only deletes notifications where expiresAt < current time
   *
   * @returns Promise with count of deleted notifications
   *
   * Example: Run daily via cron job or scheduled background task
   */
  static async cleanupExpired(): Promise<NotificationResponse> {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      return {
        success: true,
        message: `Cleaned up ${result.count} expired notifications`,
        data: { count: result.count },
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Cleanup skipped.",
          data: { count: 0 },
        };
      }

      console.error("Error cleaning up expired notifications:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cleanup notifications",
      };
    }
  }

  /**
   * Gets unread notification count for a user
   *
   * Used for badge display on notification icon
   *
   * @param userId - The user's ID
   * @returns Promise with unread count
   *
   * Example:
   * ```typescript
   * const count = await NotificationService.getUnreadCount("user123");
   * // Display badge with count on notification icon
   * ```
   */
  static async getUnreadCount(userId: string): Promise<NotificationResponse> {
    try {
      // Enforce retention policy on count path as well.
      await this.cleanupReadNonDeadline(userId);

      const count = await prisma.notification.count({
        where: {
          userId,
          read: false,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      return {
        success: true,
        data: { count },
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          data: { count: 0 },
        };
      }

      console.error("Error getting unread count:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get unread count",
      };
    }
  }

  /**
   * Checks for upcoming contract renewals/expirations and creates notifications
   *
   * Scans all contracts for a user and creates DEADLINE notifications for:
   * - 30 days before expiration (CRITICAL)
   * - 15 days before expiration (WARNING)
   * - 7 days before expiration (URGENT)
   *
   * @param userId - The user's ID
   * @returns Promise with count of created notifications
   *
   * Steps:
   * 1. Query all COMPLETED contracts with endDate for the user
   * 2. Calculate days until expiration
   * 3. Create notification if contract expiring in 30, 15, or 7 days
   * 4. Check for existing notification to avoid duplicates
   * 5. Return summary of created notifications
   *
   * Example: Run daily via cron job
   * ```typescript
   * await NotificationService.checkUpcomingDeadlines("user123");
   * ```
   */
  static async checkUpcomingDeadlines(
    userId: string,
  ): Promise<NotificationResponse> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Query all contracts with endDate for this user
      const contracts = await prisma.contract.findMany({
        where: {
          userId,
          status: "COMPLETED",
          endDate: {
            not: null,
          },
        },
        select: {
          id: true,
          title: true,
          endDate: true,
          provider: true,
        },
      });

      const createdNotifications: string[] = [];

      // Process each contract
      for (const contract of contracts) {
        if (!contract.endDate) continue;

        // Calculate days until expiration
        const contractEnd = new Date(contract.endDate);
        contractEnd.setHours(0, 0, 0, 0);
        const daysUntilExpiration = Math.ceil(
          (contractEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Define deadline thresholds and notification levels
        let shouldNotify = false;
        let level = "";

        if (daysUntilExpiration === 7) {
          shouldNotify = true;
          level = "URGENT";
        } else if (daysUntilExpiration === 15) {
          shouldNotify = true;
          level = "WARNING";
        } else if (daysUntilExpiration === 30) {
          shouldNotify = true;
          level = "CRITICAL";
        }

        if (shouldNotify) {
          // Check if notification already exists for this deadline
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId,
              contractId: contract.id,
              actionType: `RENEWAL_${level}`,
              createdAt: {
                gte: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Within last 24 hours
              },
            },
          });

          // Only create if not already notified today
          if (!existingNotification) {
            const notificationTitle =
              level === "CRITICAL"
                ? `🔴 Contract Expiring in 30 Days`
                : level === "WARNING"
                  ? `🟠 Contract Expiring in 15 Days`
                  : `🟡 Contract Expiring in 7 Days`;

            const notificationMessage =
              level === "CRITICAL"
                ? `${contract.title} from ${contract.provider} will expire on ${contractEnd.toLocaleDateString()}. Time to renew!`
                : level === "WARNING"
                  ? `${contract.title} from ${contract.provider} expires in 15 days. Consider scheduling renewal.`
                  : `${contract.title} from ${contract.provider} expires in 7 days. Renew now!`;

            const result = await this.create({
              userId,
              type: "DEADLINE",
              title: notificationTitle,
              message: notificationMessage,
              contractId: contract.id,
              actionType: `RENEWAL_${level}`,
              icon: level === "CRITICAL" ? "AlertCircle" : "AlertTriangle",
              expiresIn: 24 * 60 * 60 * 1000, // 24 hours
              actionData: {
                level,
                daysUntilExpiration,
                expirationDate: contractEnd.toISOString(),
                contractTitle: contract.title,
                contractProvider: contract.provider,
              },
            });

            if (result.success) {
              createdNotifications.push(contract.id);
            }
          }
        }
      }

      return {
        success: true,
        message: `Created ${createdNotifications.length} deadline notifications`,
        data: {
          count: createdNotifications.length,
          contractIds: createdNotifications,
        },
      };
    } catch (error) {
      if (isNotificationTableMissingError(error)) {
        warnMissingNotificationTableOnce();
        return {
          success: true,
          message: "Notification table missing. Deadline scan skipped.",
          data: { count: 0, contractIds: [] },
        };
      }

      console.error("Error checking upcoming deadlines:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to check deadlines",
      };
    }
  }
}
