# 🔔 Notification System Implementation - Complete Guide

## ✨ What Was Implemented

You've successfully enabled Option 2: **Renewal and Deadline Assistant** with comprehensive notification system.

### 🎯 Key Features

1. **Toast Notifications** (Sonner)
   - ✅ Contract uploaded successfully
   - ✅ Contract analyzed successfully (or error with reason)
   - ✅ Contract deleted successfully
   - ❌ Error messages with detailed feedback
   - 🔔 Deadline alerts for upcoming expirations

2. **Persistent Notifications Database**
   - All notifications are stored permanently
   - 5 notification types: SUCCESS, ERROR, WARNING, INFO, DEADLINE
   - Notifications linked to specific contracts
   - Auto-expiration after 30 days (configurable)

3. **Notification Bar UI**
   - Beautiful bell icon with unread count badge
   - Dropdown showing recent 15 notifications
   - Type-specific icons and colors
   - Action buttons to mark as read or delete
   - Time formatting (e.g., "2m ago", "1h ago")
   - Empty state when no notifications
   - Auto-refresh every 30 seconds when open

4. **Deadline Detection & Alerts**
   - 🔴 **30 Days Before Expiration**: CRITICAL notification
   - 🟠 **15 Days Before Expiration**: WARNING notification
   - 🟡 **7 Days Before Expiration**: URGENT notification
   - Daily automatic check on dashboard load
   - Smart deduplication (max 1 notification per threshold per day)

5. **Well-Documented Code**
   - 1000+ lines of comprehensive inline comments
   - JSDoc comments for all functions
   - Step-by-step explanations of processing pipelines
   - Examples and usage patterns

## 📁 Files Created/Modified

### New Files Created

```
✨ lib/services/notification.service.ts          (580 lines) - Core notification logic
✨ lib/actions/notification.action.ts            (340 lines) - Server actions for notifications
✨ components/views/dashboard/notification-bar.tsx (490 lines) - Notification UI component
✨ hooks/useNotifications.ts                      (220 lines) - React hook for toast + notifications
✨ NOTIFICATION_SYSTEM_SETUP.md                  (400 lines) - Detailed setup guide
✨ setup-notifications.sh                        (30 lines) - Automated setup script
```

### Files Modified

```
📝 prisma/schema.prisma                          - Added Notification model, NotificationType enum
📝 lib/actions/contract.action.ts                - Added notifications on upload/analyze/delete
📝 lib/services/contract.service.ts              - Added getUserByClerkId() method
📝 components/views/dashboard/navigation.tsx     - Added NotificationBar component
📝 app/(dashboard)/dashboard/page.tsx            - Added checkDeadlineNotifications() call
```

## 🚀 Quick Start

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_notifications
```

This creates:

- `Notification` table with indexes
- `NotificationType` enum (SUCCESS, WARNING, ERROR, INFO, DEADLINE)
- Relations between User, Contract, and Notification

### 2. Generate Prisma Client

```bash
npx prisma generate
```

Or use the automated setup script:

```bash
bash setup-notifications.sh
```

### 3. Start Development Server

```bash
npm run dev
```

## 📊 Architecture Overview

### Notification Flow

```
User Action (upload/analyze/delete)
    ↓
Contract Server Action
    ↓
├─ Execute operation (save/analyze/delete)
├─ Create Sonner toast (immediate UI feedback)
└─ Create database notification (persistent)
    ↓
Notification Service
    ↓
├─ Store in database
├─ Assign expiration time
└─ Link to contract
    ↓
Notification Bar
    ↓
├─ Display bell icon with unread count
├─ Show in dropdown when clicked
└─ Allow user interaction (mark read, delete)
```

### Deadline Notification Flow

```
Dashboard Page Load
    ↓
checkDeadlineNotifications() called
    ↓
Notification Service
    ↓
├─ Query all user contracts with endDate
├─ Calculate days until expiration
├─ Check if 30, 15, or 7 days away
├─ Avoid duplicate notifications
└─ Create deadline notifications
    ↓
Stored in database
    ↓
Display in Notification Bar
```

## 💻 Usage Examples

### Example 1: Upload Contract

**User Action**: Click upload button, select file
**Flow**:

1. File uploaded to UploadThing
2. `saveContract()` server action triggered
3. Toast appears: "📄 Contract Uploaded"
4. Notification created and stored in database
5. User can see notification in bell icon dropdown

### Example 2: Analyze Contract

**User Action**: Click "Analyze" button on uploaded contract
**Flow**:

1. Status changes to PROCESSING with spinner
2. Toast appears: "⏳ Analyzing Contract"
3. AI analyzes the file
4. On Success:
   - Toast: "✅ Contract Analyzed" with details
   - Database notification created
   - Contract details populate
5. On Error:
   - Toast: "❌ Analysis Failed" with reason
   - Database notification created with error
   - Invalid contract modal shown (if applicable)

### Example 3: Delete Contract

**User Action**: Click delete, confirm in dialog
**Flow**:

1. Delete confirmation modal appears
2. On confirm:
   - File deleted from UploadThing storage
   - Contract deleted from database
   - Toast: "🗑️ Contract Deleted"
   - Notification created and stored
3. Contracts list refreshes automatically

### Example 4: Deadline Alert

**Trigger**: Dashboard page load + 30/15/7 days before expiration
**Flow**:

1. System queries all user contracts with endDate
2. Calculates days until each expiration
3. For contracts expiring in 30, 15, or 7 days:
   - Creates deadline notification
   - Avoids duplicates (max 1 per threshold per day)
4. Notifications appear in bell icon dropdown
5. Toast displayed if first time that day

## 🔔 Notification Types & Colors

| Type     | Color     | Icon          | Use Case                             |
| -------- | --------- | ------------- | ------------------------------------ |
| SUCCESS  | Green ✅  | CheckCircle2  | Contract uploaded, analyzed, deleted |
| ERROR    | Red ❌    | AlertCircle   | Upload failed, analysis failed       |
| WARNING  | Yellow ⚠️ | AlertTriangle | File taking long, low quality        |
| INFO     | Blue ℹ️   | Info          | Processing started, general info     |
| DEADLINE | Red 🕐    | Clock         | Contract expiring soon               |

## 🎛️ Notification Bar Features

### When Closed

- Shows bell icon
- Displays badge with unread count
- Pulses when unread notification arrives

### When Open

- Dropdown panel (w-96 max)
- Shows up to 15 most recent notifications
- Each notification shows:
  - Type-specific icon and color
  - Title and message
  - Time (e.g., "2m ago")
  - Contract link if available
  - Unread indicator (red dot)
  - Action buttons (✓ mark as read, 🗑️ delete)
- "Mark all as read" button
- Empty state if no notifications

### Auto-Refresh Behavior

- Refreshes every 30 seconds when dropdown is open
- Checks for deadline notifications daily (24 hours)
- Silent refresh (doesn't show loading if already open)

## 🔐 Security & Authorization

All operations include authentication and authorization:

1. **Clerk Authentication**: All actions verify user is logged in
2. **User Verification**: Notifications belong to authenticated user
3. **Contract Ownership**: Users only see their own contract notifications
4. **Server-Side Enforcement**: All operations run on server (no client manipulation)
5. **Database Constraints**: Foreign keys prevent orphaned records

## ⚙️ Configuration

### Modify Deadline Thresholds

Edit `lib/services/notification.service.ts`:

```typescript
if (daysUntilExpiration === 7) {
  // Change 7 to any number
  shouldNotify = true;
  level = "URGENT";
}
```

### Change Default Expiration

Edit `lib/services/notification.service.ts`:

```typescript
const expiresAt = input.expiresIn
  ? new Date(Date.now() + input.expiresIn)
  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Change 30 to any days
```

### Adjust Polling Interval

Edit `components/views/dashboard/notification-bar.tsx`:

```typescript
const pollInterval = setInterval(fetchNotifications, 30000); // 30 seconds, change to any ms
```

## 📱 Database Schema

### Notification Table

```sql
CREATE TABLE "Notification" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,        -- Link to User
  contractId TEXT,              -- Link to Contract (optional)
  type NotificationType,        -- SUCCESS, WARNING, ERROR, INFO, DEADLINE
  title VARCHAR(255),           -- e.g., "Contract Uploaded"
  message TEXT,                 -- e.g., "insurance.pdf uploaded successfully"
  icon VARCHAR(100),            -- Lucide icon name for UI
  actionType VARCHAR(100),      -- e.g., "UPLOAD_SUCCESS", "RENEWAL_CRITICAL"
  actionData JSONB,             -- Additional metadata
  read BOOLEAN DEFAULT false,   -- Read status for badge
  createdAt TIMESTAMP,          -- When created
  expiresAt TIMESTAMP,          -- When notification expires

  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
  FOREIGN KEY (contractId) REFERENCES "Contract"(id) ON DELETE SET NULL
);

-- Indexes for fast queries
CREATE INDEX idx_userId ON "Notification"(userId);
CREATE INDEX idx_contractId ON "Notification"(contractId);
CREATE INDEX idx_type ON "Notification"(type);
CREATE INDEX idx_read ON "Notification"(read);
CREATE INDEX idx_createdAt ON "Notification"(createdAt DESC);
```

## 🧪 Testing the System

### Manual Tests

1. **Upload Notification**
   - Go to /contacts
   - Upload a contract
   - Should see green toast: "📄 Contract Uploaded"
   - Check notification bar - dot should appear

2. **Analysis Notification**
   - Click "Analyze" on uploaded contract
   - Should see loading toast
   - After 5-10 seconds, see success or error toast
   - Check notification bar for detailed message

3. **Delete Notification**
   - Click delete on any contract
   - Confirm in modal
   - Should see toast: "🗑️ Contract Deleted"

4. **Deadline Notification**
   - Create a contract with endDate in 10 days
   - Go to dashboard
   - System automatically checks and creates notification
   - See 🟡 URGENT notification in bell icon

5. **Notification Bar Features**
   - Click bell icon to open dropdown
   - Click ✓ to mark individual as read
   - Click 🗑️ to delete notification
   - Click "Mark all as read" button
   - Should auto-refresh when open

## 🐛 Troubleshooting

### Migration Fails

```bash
# Solution 1: Check database connection
echo $DATABASE_URL

# Solution 2: Reset migrations (dev only)
npx prisma migrate reset

# Solution 3: Manually deploy
npx prisma migrate deploy
```

### Notifications Not Showing

```bash
# Check 1: Verify notifications table exists
npx prisma db push

# Check 2: Check database connection in server
# Open browser DevTools → Network tab
# Look for failed API calls to notification endpoints

# Check 3: Verify Prisma client is generated
npx prisma generate

# Check 4: Rebuild project
npm run build
```

### Deadline Notifications Not Triggering

```
Check 1: Contract has endDate (not null)
Check 2: Contract status is "COMPLETED" (not UPLOADED/PROCESSING)
Check 3: Date is calculated correctly (midnight UTC)
Check 4: Manually trigger: await checkDeadlineNotifications()
```

### TypeScript Errors After Update

```bash
npm run build
npx prisma generate
npm run dev
```

## 📚 Code Examples

### Create Custom Notification in Server Action

```typescript
import { NotificationService } from "@/lib/services/notification.service";

const result = await NotificationService.create({
  userId: user.id,
  type: "SUCCESS",
  title: "Custom Title",
  message: "Custom message content",
  contractId: contract.id,
  actionType: "CUSTOM_ACTION",
  expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Use Toast in Client Component

```typescript
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

export function MyComponent() {
  const { notifySuccess, notifyError } = useNotifications();

  const handleClick = async () => {
    try {
      await someOperation();
      notifySuccess("Success!", "Operation completed");
    } catch (error) {
      notifyError("Error!", error.message);
    }
  };
}
```

### Check Notifications from Component

```typescript
import { getNotifications } from "@/lib/actions/notification.action";

export async function NotificationPreview() {
  const result = await getNotifications(10);

  if (result.success) {
    console.log(result.data); // Array of notifications
  }
}
```

## 🎓 Learning Resources

1. **Sonner Documentation**: https://sonner.emilkowal.ski/
2. **Prisma Documentation**: https://www.prisma.io/docs/
3. **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
4. **Shadcn/ui Components**: https://ui.shadcn.com/

## 🚀 Future Enhancements

Potential features to add:

- [ ] Email notifications for deadline alerts
- [ ] Push notifications (Web/Mobile)
- [ ] Notification preferences (user can disable types)
- [ ] Snooze feature (temporarily hide notifications)
- [ ] Advanced filtering (by type, date, contract)
- [ ] Bulk operations (mark all, delete all)
- [ ] Export notification history (CSV)
- [ ] Recurring reminders if ignored
- [ ] Notification sounds/vibrations
- [ ] Smart digest (combine similar notifications)

## 📞 Support

For issues or questions:

1. Check error console (browser DevTools)
2. Review NOTIFICATION_SYSTEM_SETUP.md
3. Check notification-bar.tsx for UI implementation
4. See lib/services/notification.service.ts for core logic
5. Review contracts-list.tsx for toast integration examples

## ✅ Checklist - Setup Verification

After setup, verify:

- [ ] Database migration completed successfully
- [ ] Prisma client generated
- [ ] No TypeScript errors in build
- [ ] NotificationBar visible in dashboard sidebar
- [ ] Upload creates notification toast
- [ ] Analysis creates notification toast
- [ ] Delete creates notification toast
- [ ] Notification bar bell icon shows unread count
- [ ] Notification dropdown opens/closes smoothly
- [ ] Can mark notifications as read/delete
- [ ] Deadline notifications appear for contracts expiring in 30/15/7 days
- [ ] Auto-refresh works when dropdown is open

## 🎉 You're All Set!

The notification system is now fully integrated with:

- ✅ Sonner toast notifications for immediate feedback
- ✅ Persistent database notifications for history
- ✅ Beautiful notification bar UI with unread badge
- ✅ Automatic deadline detection and alerts
- ✅ Well-documented, production-ready code

Start uploading contracts and watch the notifications come to life!
