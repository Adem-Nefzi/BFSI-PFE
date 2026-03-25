// src/middleware.ts
// ─────────────────────────────────────────────────────
// This is the BOUNCER of your entire app.
// It runs BEFORE any page loads and checks if
// the user is allowed to access that route.
// ─────────────────────────────────────────────────────

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes REQUIRE login
// Anyone hitting these without being logged in
// gets automatically redirected to /sign-in
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", // /dashboard and all sub-pages
  "/contracts(.*)", // /contracts and all sub-pages
  "/chat(.*)", // /chat and all sub-pages
  "/claims(.*)", // /claims and all sub-pages
  "/blockchain(.*)", // /blockchain and all sub-pages
  "/settings(.*)", // /settings and all sub-pages
  "/api/contracts(.*)", // Protect API routes too!
  "/api/chat(.*)",
  "/api/claims(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is protected, enforce authentication
  // auth.protect() will:
  // → Redirect to /sign-in if not logged in
  // → Do nothing if logged in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes EXCEPT:
    // - Next.js internal files (_next)
    // - Static files (images, fonts, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run on API routes
    "/(api|trpc)(.*)",
  ],
};
