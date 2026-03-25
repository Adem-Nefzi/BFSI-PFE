/**
 * Notification Bar Component
 *
 * Displays a beautiful notification bar/dropdown for showing:
 * - Unread notifications count
 * - Recent notifications from users' actions
 * - Deadline/renewal alerts
 * - Notification management (mark as read, delete)
 *
 * Features:
 * - Real-time badge count
 * - Smooth animations
 * - Theme support (dark/light mode)
 * - Responsive design
 * - Auto-refresh on intervals
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  checkDeadlineNotifications,
} from "@/lib/actions/notification.action";
import { cn } from "@/lib/utils";

/**
 * Notification type interface matching the database structure
 */
interface Notification {
  id: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO" | "DEADLINE";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  icon?: string;
  actionType?: string;
  contractId?: string;
  contract?: {
    id: string;
    title: string;
    fileName: string;
    endDate?: string;
  };
}

/**
 * Returns the appropriate icon component based on notification type
 *
 * Mapping:
 * - SUCCESS: CheckCircle2 (green)
 * - WARNING: AlertTriangle (yellow/orange)
 * - ERROR: AlertCircle (red)
 * - INFO: Info (blue)
 * - DEADLINE: Clock (critical/urgent)
 */
const getNotificationIcon = (type: Notification["type"], icon?: string) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "WARNING":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "ERROR":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "DEADLINE":
      return <Clock className="h-5 w-5 text-red-500" />;
    case "INFO":
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

/**
 * Returns the color styling based on notification type
 * Used for background and border colors in the notification card
 */
const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "SUCCESS":
      return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
    case "WARNING":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
    case "ERROR":
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
    case "DEADLINE":
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
    case "INFO":
    default:
      return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800";
  }
};

/**
 * Single Notification Item Component
 *
 * Displays an individual notification with:
 * - Type-specific icon and coloring
 * - Title and message
 * - Timestamp
 * - Action buttons (mark as read, delete)
 * - Visual indicator for unread status
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onRead, onDelete }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        "flex items-start gap-3 p-3 border transition-all hover:shadow-sm",
        getNotificationColor(notification.type),
        !notification.read && "ring-1 ring-primary/20",
      )}
    >
      {/* Notification Icon */}
      <div className="mt-1 flex-shrink-0">
        {getNotificationIcon(notification.type, notification.icon)}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm text-foreground line-clamp-1">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>

            {/* Contract link if available */}
            {notification.contract && (
              <p className="text-xs text-muted-foreground mt-2">
                📄 {notification.contract.title}
              </p>
            )}
          </div>

          {/* Unread dot indicator */}
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-2">
          {formatTime(notification.createdAt)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {!notification.read && (
          <button
            onClick={() => onRead(notification.id)}
            className="p-1.5 hover:bg-white/20 dark:hover:bg-white/10 rounded-md transition-colors"
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => onDelete(notification.id)}
          className="p-1.5 hover:bg-white/20 dark:hover:bg-white/10 rounded-md transition-colors"
          title="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
};

/**
 * Main Notification Bar Component
 *
 * Displays:
 * 1. Bell icon with unread count badge
 * 2. Dropdown showing recent notifications
 * 3. Ability to mark as read individually or all at once
 * 4. Action buttons and time formatting
 */
export default function NotificationBar() {
  // State management
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 70, left: 250 });
  const channelRef = useRef<BroadcastChannel | null>(null);

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const panelWidth = 420;
    const panelHeightEstimate = panelRef.current?.offsetHeight ?? 240;
    const viewportPadding = 12;

    const preferredLeft = rect.right + 14;
    const maxLeft = window.innerWidth - panelWidth - viewportPadding;
    const left = Math.max(viewportPadding, Math.min(preferredLeft, maxLeft));

    // Keep the panel visually balanced around the bell row,
    // with a slightly higher anchor so it does not feel too low.
    const triggerCenterY = (rect.top + rect.bottom) / 2;
    const preferredTop = triggerCenterY - panelHeightEstimate * 0.42;
    const maxTop = window.innerHeight - viewportPadding - panelHeightEstimate;
    const top = Math.max(viewportPadding, Math.min(preferredTop, maxTop));

    setPanelPosition({ top, left });
  }, []);

  /**
   * Fetches unread notifications and deadline checks
   *
   * Steps:
   * 1. Check for upcoming deadlines and create notifications
   * 2. Fetch unread notifications from database
   * 3. Update state with fresh notification data
   * 4. Get unread count for badge display
   */
  const fetchNotifications = useCallback(
    async (options?: { showLoader?: boolean }) => {
      const showLoader = options?.showLoader ?? false;

      try {
        if (showLoader) {
          setIsLoading(true);
        }

        // Fetch unread notifications
        const response = await getNotifications(15);
        if (response.success) {
          setNotifications(response.data || []);
        }

        // Update unread count
        const countResponse = await getUnreadNotificationCount();
        if (countResponse.success) {
          setUnreadCount(countResponse.data?.count || 0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const notifyRealtimeRefresh = useCallback(() => {
    void fetchNotifications({ showLoader: false });
  }, [fetchNotifications]);

  const broadcastRealtimeRefresh = useCallback(() => {
    const event = new Event("notifications:refresh");
    window.dispatchEvent(event);
    channelRef.current?.postMessage({ type: "notifications:refresh" });
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Cross-tab realtime notifications without polling loops.
    const channel = new BroadcastChannel("notifications-channel");
    channelRef.current = channel;

    const onMessage = (message: MessageEvent<{ type?: string }>) => {
      if (message.data?.type === "notifications:refresh") {
        void fetchNotifications({ showLoader: false });
      }
    };

    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
      channelRef.current = null;
    };
  }, [isMounted, fetchNotifications]);

  /**
   * Handles marking a notification as read
   *
   * For non-deadline notifications: Automatically deletes after marking as read to save storage
   * For deadline notifications: Keeps them to show ongoing contract expiry info
   *
   * Updates local state immediately for optimistic UI
   * Then calls server action to persist to database
   */
  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      // Find the notification to check its type
      const notification = notifications.find((n) => n.id === notificationId);
      const isDeadlineNotification = notification?.type === "DEADLINE";

      if (isDeadlineNotification) {
        // For DEADLINE notifications: just mark as read
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Persist to database
        await markNotificationAsRead(notificationId);
      } else {
        // For non-deadline notifications: delete after marking read (auto-cleanup)
        // Optimistic update: remove from UI immediately
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Persist to database: delete the notification
        await deleteNotification(notificationId);
      }

      broadcastRealtimeRefresh();
    },
    [notifications, broadcastRealtimeRefresh],
  );

  /**
   * Handles marking all notifications as read
   */
  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);

    await markAllNotificationsAsRead();
    broadcastRealtimeRefresh();
  }, [broadcastRealtimeRefresh]);

  /**
   * Handles deleting a notification
   *
   * Removes from UI immediately
   * Then calls server action to delete from database
   */
  const handleDelete = useCallback(
    async (notificationId: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId),
      );

      // Persist to database
      await deleteNotification(notificationId);

      // Refresh unread count
      const countResponse = await getUnreadNotificationCount();
      if (countResponse.success) {
        setUnreadCount(countResponse.data?.count || 0);
      }
      broadcastRealtimeRefresh();
    },
    [broadcastRealtimeRefresh],
  );

  /**
   * Effect: Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);

      if (!clickedTrigger && !clickedPanel) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  /**
   * Effect: Event-driven realtime updates (no intervals)
   *
   * Initial load: one fetch with loader
   * Refresh triggers:
   * - custom notifications:refresh event (same tab)
   * - BroadcastChannel message (cross-tab)
   * - focus/visibility return
   */
  useEffect(() => {
    if (!isMounted) return;

    // Initial load
    void fetchNotifications({ showLoader: true });

    // Deadline check runs once per mount (no loop)
    void checkDeadlineNotifications();

    const focusRefresh = () => void fetchNotifications({ showLoader: false });
    const visibilityRefresh = () => {
      if (document.visibilityState === "visible") {
        void fetchNotifications({ showLoader: false });
      }
    };

    window.addEventListener("focus", focusRefresh);
    document.addEventListener("visibilitychange", visibilityRefresh);
    window.addEventListener("notifications:refresh", notifyRealtimeRefresh);

    return () => {
      window.removeEventListener("focus", focusRefresh);
      document.removeEventListener("visibilitychange", visibilityRefresh);
      window.removeEventListener(
        "notifications:refresh",
        notifyRealtimeRefresh,
      );
    };
  }, [isMounted, fetchNotifications, notifyRealtimeRefresh]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isOpen) return;

    updatePanelPosition();
    const handleResize = () => updatePanelPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted, isOpen, updatePanelPosition]);

  if (!isMounted) {
    return (
      <div className="relative">
        <button
          className="relative rounded-xl border border-border/70 bg-background/95 p-2.5 text-foreground shadow-sm backdrop-blur"
          title="Notifications"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const toggleOpen = () => {
    if (!isOpen) {
      updatePanelPosition();
      void fetchNotifications({ showLoader: notifications.length === 0 });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon Button with Badge */}
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        className="relative rounded-xl border border-border/70 bg-background/95 p-2.5 text-foreground shadow-sm backdrop-blur hover:bg-accent transition-colors"
        title="Notifications"
        type="button"
      >
        <Bell className="h-5 w-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              top: `${panelPosition.top}px`,
              left: `${panelPosition.left}px`,
            }}
            className="fixed w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/80 bg-background/98 shadow-2xl backdrop-blur z-[90] max-h-[70vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-3">
              <div>
                <h2 className="font-semibold text-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground">
                  Renewal reminders and activity updates
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded-md transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto bg-background">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-muted/10">
                  <div className="mb-4 p-3 rounded-full bg-muted/50">
                    <Bell className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <p className="font-medium text-foreground">All caught up!</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    No new notifications right now. Non-deadline notifications
                    are auto-deleted after viewing.
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-3 px-2">
                    Deadline reminders for upcoming contract expirations will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div className="border-t border-border/70 bg-muted/20 p-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex-1"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Close
                </Button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
