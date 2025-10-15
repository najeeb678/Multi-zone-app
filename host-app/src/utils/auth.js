import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export function getBackendTokenFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token");
  return token?.value || null;
}

export async function clearSessionAndRedirect() {
  const cookieStore = await cookies();

  // Clear all NextAuth-related cookies
  [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
  ].forEach((cookie) => cookieStore.delete(cookie));

  // Redirect to /login
  return NextResponse.redirect(new URL("/login", process.env.HOST_URL || "http://localhost:5801"));
}
