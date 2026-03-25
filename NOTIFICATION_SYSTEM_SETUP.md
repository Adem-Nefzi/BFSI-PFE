# 🔔 Notification System Setup Guide

## Overview

The notification system has been implemented to notify users about:

- ✅ **Action Notifications**: When users upload, analyze, or delete contracts
- 🕐 **Deadline Notifications**: When contracts are expiring (30, 15, 7 days)
- 📱 **Toast Notifications**: Immediate UI feedback for all actions
- 🔔 **Notification Center**: Persistent notification history accessible from the dashboard

## Database Migration

### Step 1: Update Your Database Schema

Run the following Prisma command to create the necessary database tables:

```bash
npx prisma migrate dev --name add_notifications
```

This will:

1. Create the `Notification` table
2. Create the `NotificationType` enum
3. Add the `notifications` relationship to the `User` model
4. Add the `notifications` relationship to the `Contract` model

### Step 2: Database Schema Overview

The migration adds:

```sql
-- Notification table with indexes
CREATE TABLE "Notification" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  contractId TEXT,
  type "NotificationType" NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(100),
  actionType VARCHAR(100),
  actionData JSONB,
  read BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT now(),
  expiresAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
  FOREIGN KEY (contractId) REFERENCES "Contract"(id) ON DELETE SET NULL
);

-- Notification Type Enum
CREATE TYPE "NotificationType" AS ENUM (
  'SUCCESS',
  'WARNING',
  'ERROR',
  'INFO',
  'DEADLINE'
);
```

## Architecture Overview

### 1. **Notification Service** (`lib/services/notification.service.ts`)

Core service handling all notification operations:

- Create notifications
- Fetch unread/all notifications
- Mark as read
- Delete notifications
- Check for upcoming deadlines
- Cleanup expired notifications

**Key Methods:**

- `create(input)` - Create new notification
- `getUnread(userId, limit)` - Fetch unread notifications
- `getUnreadCount(userId)` - Get badge count
- `checkUpcomingDeadlines(userId)` - Scan contracts and create deadline notifications
- `cleanupExpired()` - Remove expired notifications (run periodically)

### 2. **Notification Actions** (`lib/actions/notification.action.ts`)

Server actions for client-side notification management:

- `getNotifications()` - Fetch unread notifications
- `getAllNotifications()` - Fetch notification history
- `getUnreadNotificationCount()` - Get badge count
- `markNotificationAsRead(id)` - Mark single as read
- `markAllNotificationsAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification
- `checkDeadlineNotifications()` - Check and create deadline notifications

### 3. **Notification Component** (`components/views/dashboard/notification-bar.tsx`)

Beautiful notification UI dropdown with:

- Bell icon with unread count badge
- Notification list with type-specific icons and colors
- Action buttons (mark as read, delete)
- Time formatting (e.g., "2m ago")
- Empty state
- Auto-refresh every 30 seconds when open
- Daily deadline check

### 4. **useNotifications Hook** (`hooks/useNotifications.ts`)

Custom React hook wrapping Sonner toast + persistent notifications:

- `notifySuccess()` - Green success toast + persistent notification
- `notifyError()` - Red error toast + persistent notification
- `notifyWarning()` - Yellow warning toast + persistent notification
- `notifyInfo()` - Blue info toast + persistent notification
- `notifyDeadline()` - Red deadline toast + persistent notification

## Integration Points

### 1. **Contract Actions** (`lib/actions/contract.action.ts`)

Updated to create notifications on:

- ✅ **Upload**: "Contract uploaded successfully"
- ✅ **Analysis**: "Contract analyzed successfully" or error message
- ✅ **Delete**: "Contract deleted successfully"
- ✅ **Ask Question**: Error notification if Q&A fails

### 2. **Dashboard** (`app/(dashboard)/dashboard/page.tsx`)

- Calls `checkDeadlineNotifications()` on page load
- Checks for contracts expiring in 30, 15, 7 days
- Creates notifications automatically

### 3. **Navigation** (`components/views/dashboard/navigation.tsx`)

- Added `NotificationBar` component to sidebar
- Positioned next to theme toggle in account section
- Accessible from all dashboard pages

## Usage Examples

### Creating a Notification in Server Actions

```typescript
import { NotificationService } from "@/lib/services/notification.service";

// In a server action
const user = await ContractService.getUserByClerkId(clerkId);

await NotificationService.create({
  userId: user.id,
  type: "SUCCESS",
  title: "Contract Uploaded",
  message: 'Your file "insurance.pdf" is ready for analysis',
  contractId: contractId,
  actionType: "UPLOAD_SUCCESS",
  icon: "FileCheck",
  expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Using Toast Notifications in Client Components

```typescript
import { useNotifications } from "@/hooks/useNotifications";

export function MyComponent() {
  const { notifySuccess, notifyError, notifyDeadline } = useNotifications();

  const handleUpload = async () => {
    try {
      await uploadFile();
      notifySuccess("Upload Complete", "Your file has been uploaded");
    } catch (error) {
      notifyError("Upload Failed", error.message);
    }
  };

  const handleDeadline = () => {
    notifyDeadline({
      title: "🔴 Contract Expiring Soon",
      message: "Insurance Auto from ACME expires in 7 days",
      contractId: "contract123",
      actionType: "RENEWAL_URGENT",
    });
  };

  return (
    <>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDeadline}>Test Deadline</button>
    </>
  );
}
```

## Notification Types

### SUCCESS (Green - ✅)

Used for:

- Contract uploaded
- Analysis completed
- Contract deleted
- Settings saved

### ERROR (Red - ❌)

Used for:

- Upload failed
- Analysis failed
- Network errors
- Invalid contract

### WARNING (Yellow - ⚠️)

Used for:

- File analysis slow
- Low quality extraction
- Missing permissions

### INFO (Blue - ℹ️)

Used for:

- Analysis started
- Processing updates
- General information

### DEADLINE (Red - 🕐)

Used for:

- Contract expiring in 30 days (CRITICAL 🔴)
- Contract expiring in 15 days (WARNING 🟠)
- Contract expiring in 7 days (URGENT 🟡)

## Scheduled Tasks

### Daily Deadline Check

The system checks for upcoming deadlines:

- **When**: Daily at any time (triggered on dashboard load)
- **What**: Scans all user contracts with endDate
- **Actions**:
  - Creates CRITICAL notification for 30-day threshold
  - Creates WARNING notification for 15-day threshold
  - Creates URGENT notification for 7-day threshold
  - Avoids duplicate notifications (max 1 per threshold per day)

### Running Deadline Checks Manually

```typescript
import { checkDeadlineNotifications } from "@/lib/actions/notification.action";

// Client-side
const result = await checkDeadlineNotifications();
console.log(`Created ${result.data.count} deadline notifications`);
```

### Cleanup Task (Recommended)

For production, set up a cron job to clean expired notifications:

```typescript
import { NotificationService } from "@/lib/services/notification.service";

// Example: Vercel Cron (serverless function every day at midnight)
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await NotificationService.cleanupExpired();
  return Response.json(result);
}

// Route: api/cron/cleanup-notifications
// Set Cron Job: 0 0 * * * (daily at midnight)
```

## Configurable Parameters

### Default Notification Expiration

```typescript
// In NotificationService.create()
const expiresAt = input.expiresIn
  ? new Date(Date.now() + input.expiresIn)
  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
```

### Deadline Thresholds

Located in `NotificationService.checkUpcomingDeadlines()`:

- 30 days: CRITICAL level
- 15 days: WARNING level
- 7 days: URGENT level

To modify, edit these lines in `notification.service.ts`:

```typescript
if (daysUntilExpiration === 7) {
  /* ... */
} else if (daysUntilExpiration === 15) {
  /* ... */
} else if (daysUntilExpiration === 30) {
  /* ... */
}
```

### Notification Bar Polling

```typescript
// In notification-bar.tsx
const pollInterval = setInterval(fetchNotifications, 30000); // 30 seconds
const dailyCheckInterval = setInterval(
  () => {
    checkDeadlineNotifications();
  },
  24 * 60 * 60 * 1000,
); // 24 hours
```

## Security & Authorization

All notification operations include authorization checks:

1. **User Verification**: Each action verifies the user owns the notification
2. **Contract Ownership**: Deadline checks only process user's contracts
3. **Input Validation**: Notification content isn't sanitized (all text)
4. **Server-Side Enforcement**: All operations run server-side (no client-side manipulation)

## Troubleshooting

### Migrations Don't Apply

```bash
# Reset migrations (for development only)
npx prisma migrate reset

# Or manually apply pending migrations
npx prisma migrate deploy
```

### Notifications Not Showing

1. Check database connection
2. Verify user exists in User table
3. Check browser console for errors
4. Verify `checkDeadlineNotifications` was called

### Deadline Notifications Not Triggering

1. Ensure contract has `endDate` set
2. Verify contract status is "COMPLETED"
3. Check date calculation (today at midnight)
4. Run manual check: `await checkDeadlineNotifications()`

## Future Enhancements

Potential improvements:

1. **Email Notifications**: Send deadline alerts via email
2. **Batch Operations**: Bulk mark/delete notifications
3. **Notification Preferences**: Let users disable certain types
4. **Snooze Feature**: Temporarily hide notifications
5. **Advanced Filtering**: Filter by type, date range, contract
6. **Export History**: Download notification log as CSV
7. **Push Notifications**: Web/mobile push for critical alerts
8. **Recurring Reminders**: Repeat deadline notifications if ignored

## Support

For issues or questions:

1. Check the notification service comments for implementation details
2. Review contracts-list.tsx for toast integration examples
3. Check notification-bar.tsx for UI implementation
4. See hooks/useNotifications.ts for hook usage
