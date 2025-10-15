import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Helper function to handle signout logic for both GET and POST
async function handleSignout(request) {
  console.log("sign out api call");
  const cookieStore = await cookies();

  // Check if redirect=true is specified in the URL query
  const { searchParams } = new URL(request.url);
  const shouldRedirect = searchParams.has("redirect");

  // Clear all auth-related cookies
  [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
  ].forEach((cookie) => cookieStore.delete(cookie));

  // If redirect parameter is present, perform a server-side redirect
  if (shouldRedirect) {
    return NextResponse.redirect(
      new URL("/login?reset=1", process.env.HOST_URL || "http://localhost:5801")
    );
  }

  // Otherwise return JSON response (for client-side signout)
  return NextResponse.json({ success: true, redirect: "/login" });
}

// Support both GET and POST methods
export async function GET(request) {
  return handleSignout(request);
}

export async function POST(request) {
  return handleSignout(request);
}
