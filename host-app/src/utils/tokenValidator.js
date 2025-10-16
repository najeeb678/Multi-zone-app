import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Helper function to check if token needs refreshing and trigger refresh if needed
 * This function is called by the API route handler
 */
export async function getValidatedToken(req) {
  try {
    // Get token from session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.log("❌ No token found");
      return { isValid: false, status: 401, message: "Authentication required" };
    }

    // Check if refresh failed or token has error
    if (token.error) {
      console.log(`❌ Token has error: ${token.error}`);
      return { isValid: false, status: 401, message: "Session expired, please login again" };
    }

    // Check if token is expired (JWT callback in [...nextauth] will refresh it)
    const isExpired = token.accessTokenExpires ? Date.now() >= token.accessTokenExpires : false;

    if (isExpired) {
      console.log("⚠️ Token expired, JWT callback should refresh it");
      // The JWT callback will handle refreshing the token
      // If it fails, token.error will be set and caught in next request
    }

    return { isValid: true, token };
  } catch (error) {
    console.error("❌ Error validating token:", error);
    return { isValid: false, status: 500, message: "Internal server error" };
  }
}
