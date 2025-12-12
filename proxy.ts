import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// PUBLIC ROUTES (anyone can access)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
]);

// PROTECTED ROUTES (require auth)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/editor(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes ALWAYS
  if (isPublicRoute(req)) return;

  const { userId } = await auth();

  // If accessing protected route without authentication → redirect
  if (isProtectedRoute(req) && !userId) {
    return (await auth()).redirectToSignIn({
      returnBackUrl: req.url,
    });
  }
});

export const config = {
  matcher: [
    // Run middleware for all routes except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API & TRPC routes
    "/(api|trpc)(.*)",
  ],
};
