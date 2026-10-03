
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // These routes must remain accessible so users can authenticate.
  const isAuthRoute =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/waitlist");

  if (isAuthRoute) return;

  // Protect all other pages and API routes, including "/".
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};