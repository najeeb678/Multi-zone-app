import { NextResponse } from "next/server";
import { isAuthenticated, AUTH_CONFIG } from "./utils/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log(`🛡️ Host Middleware: ${pathname}`);

  // Skip authentication for static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes("/_next/static") ||
    pathname.includes("/_next/image")
  ) {
    return NextResponse.next();
  }

  // Public routes (completely skip auth)
  const publicRoutes = [
    "/v3/publicPage", // ✅ your new public page
    "/login",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`🟢 Public route detected: ${pathname}`);
    return NextResponse.next();
  }

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    return handleApiAuthentication(req);
  }




    const authenticated = isAuthenticated(req);

    if (!authenticated) {
      console.log(`🔒 Access denied to ${pathname} - redirecting to host login`);
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`✅ Access granted to ${pathname} - user authenticated`);
  }



function handleApiAuthentication(req) {
  const { pathname } = req.nextUrl;

  console.log(`🔐 API Auth check: ${pathname}`);

  // Skip auth for public API endpoints
  const publicEndpoints = ["/api/health", "/api/public"];
  if (publicEndpoints.some((endpoint) => pathname.startsWith(endpoint))) {
    return NextResponse.next();
  }

  // All other API calls require authentication
  const authenticated = isAuthenticated(req);

  if (!authenticated) {
    console.log(`❌ API access denied: ${pathname} - no valid session`);
    return NextResponse.json(
      {
        STATUS: "FAILED",
        MESSAGE: "authentication required to access the resource",
      },
      { status: 401 }
    );
  }

  console.log(`✅ API access granted: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
