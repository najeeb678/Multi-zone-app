import { NextResponse } from "next/server";
import { isAuthenticated, AUTH_CONFIG } from "./utils/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log(`🚛 Lastmile Zone - Middleware triggered for: ${pathname}`);

  // Skip authentication for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes("/api/")
  ) {
    return NextResponse.next();
  }

  // Check authentication for all other routes
  const authenticated = isAuthenticated(req);

  if (!authenticated) {
    console.log(`🔒 Lastmile Zone - Access denied to ${pathname} - redirecting to login`);
    // Get the base domain for redirect
    const url = new URL("/", req.url);
    url.hostname = req.headers.get("host")?.split(":")[0] || "localhost";
    url.port = "3000"; // Host app port
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  console.log(`✅ Lastmile Zone - Access granted to ${pathname} - user authenticated`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*|_next/image).*)"],
};
