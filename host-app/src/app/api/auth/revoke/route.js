// app/api/auth/revoke/route.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.refreshToken) {
    return NextResponse.json({ message: "No session found" }, { status: 401 });
  }

  // Call backend to revoke refresh/access tokens
  await fetch(`${process.env.APP_BASE_URL}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.refreshToken}` },
  });

  // Clear NextAuth session cookie
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set({
    name: "next-auth.session-token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
