# API & Routing Endpoints

## API Endpoints

### 1. Clerk Webhook
- **Path:** `/api/webhooks/clerk`
- **Method:** `POST`
- **Purpose:** Handles Clerk webhook events (authentication, user sync, etc.)

### 2. File Upload (UploadThing)
- **Path:** `/api/uploadthing`
- **Methods:** `GET`, `POST`
- **Purpose:** Handles file uploads (contracts, images) with authentication

---

## Protected App Routes (Require Login)

Defined in middleware ([proxy.ts](../proxy.ts)):
- `/dashboard` and all sub-pages
- `/contracts` and all sub-pages
- `/chat` and all sub-pages
- `/claims` and all sub-pages
- `/blockchain` and all sub-pages
- `/settings` and all sub-pages
- `/api/contracts` and all sub-pages
- `/api/chat`
- `/api/claims`

---

## Feature API Actions (Server Actions)

These are called from the frontend, not as REST endpoints:
- `/features/contracts/api/contract.action.ts` (contract CRUD, AI analysis)
- `/features/analytics/api/stats.action.ts` (dashboard stats)
- `/features/notifications/api/notification.action.ts` (notifications)
- `/features/auth/api/user.action.ts` (user sync)

---

**Note:**
- All `/dashboard`, `/contracts`, `/chat`, `/claims`, `/blockchain`, `/settings` routes are protected and require authentication.
- API endpoints under `/api/` may also be protected by middleware.
- For more details, see the middleware configuration in [proxy.ts](../proxy.ts).
