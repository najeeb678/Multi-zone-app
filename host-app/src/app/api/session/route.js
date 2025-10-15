import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * GET /api/session
 * Returns the current session and triggers a refresh if needed
 */
export async function GET(req) {
  try {
    // This will trigger the JWT callback which handles token refresh
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ status: "FAILED", message: "No active session" }, { status: 401 });
    }

    // Check if there was an error refreshing the token
    if (session.error) {
      return NextResponse.json(
        { status: "FAILED", message: "Session refresh failed", error: session.error },
        { status: 401 }
      );
    }

    // Remove sensitive data before returning session
    const safeSession = {
      ...session,
      user: {
        ...session.user,
        // Remove token from response for security
        backendToken: undefined,
      },
    };

    return NextResponse.json({
      status: "SUCCESS",
      session: safeSession,
      expires: session.user?.accessTokenExpires || null,
    });
  } catch (error) {
    console.error("❌ Session API error:", error);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
