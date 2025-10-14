import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // List of possible NextAuth cookies
    const nextAuthCookies = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.callback-url",
      "next-auth.csrf-token",
    ];

    // List of possible backend or custom cookies
    const backendCookies = ["connect.sid", "access_token", "refresh_token", "jwt"];

    // Combine and delete all
    [...nextAuthCookies, ...backendCookies].forEach((cookieName) => {
      cookieStore.delete(cookieName);
    });

    // Return a clean response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Signout failed:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
