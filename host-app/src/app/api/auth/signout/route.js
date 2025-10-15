import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = await cookies();

  // Clear all NextAuth-related cookies
  [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
  ].forEach((cookie) => cookieStore.delete(cookie));

  // Redirect to /login after clearing session
  return NextResponse.redirect(
    new URL("/login", process.env.HOST_URL || "http://localhost:5801")
  );
}

export async function POST(request) {
  return GET(request);
}
