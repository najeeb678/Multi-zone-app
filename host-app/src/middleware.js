import { NextResponse } from "next/server";
import { isAuthenticated, AUTH_CONFIG } from "./utils/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip authentication for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes("/api/")
  ) {
    return NextResponse.next();
  }

  // Only check authentication for protected routes (zones)
  const isProtectedRoute = pathname.startsWith("/v2") || pathname.startsWith("/v3");

  if (isProtectedRoute) {
    const authenticated = isAuthenticated(req);

    if (!authenticated) {
      console.log(`🔒 Access denied to ${pathname} - redirecting to login`);
      // Redirect to home/login page
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log(`✅ Access granted to ${pathname} - user authenticated`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
