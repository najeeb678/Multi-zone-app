import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.APP_BASE_URL || "https://devapi.techship.me";

export async function handler(req, { params }) {
  let finalUrl = ""; // Declare finalUrl for error handling

  try {
    // 🔹 Await params for Next.js 15 compatibility
    const resolvedParams = await params;

    // 🔹 Check authentication first
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.log("❌ No authentication token found");
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Authentication required" },
        { status: 401 }
      );
    }

    // 🔹 Extract dynamic path after /v2/api/ and reconstruct proper backend URL
    const apiPath = resolvedParams.path.join("/"); // e.g. "LM/order/get/for/admin"    // 🔹 Transform URL: /v2/api/LM/... -> BACKEND_URL/api/LM/...
    const targetUrl = `${BACKEND_URL}/api/${apiPath}`;

    // 🔹 Get query parameters from original request
    const url = new URL(req.url);
    const queryString = url.search; // includes the '?' if params exist
    finalUrl = `${targetUrl}${queryString}`;

    console.log("🌍 Proxying:", req.method, finalUrl);
    console.log("🔧 Backend URL:", BACKEND_URL);
    console.log("📍 API Path:", apiPath);
    console.log("🎫 Has Token:", !!token.backendToken);

    // 🔹 Prepare headers - preserve original headers and add auth
    const headers = new Headers();

    // Copy important headers from original request
    req.headers.forEach((value, key) => {
      // Skip problematic headers but keep important ones
      const lowerKey = key.toLowerCase();
      if (!["host", "connection", "upgrade"].includes(lowerKey)) {
        headers.set(key, value);
      }
    });

    // 🔹 Add required headers for backend
    headers.set("Content-Type", "application/json");
    headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");
    headers.set("User-Agent", "MultiZone-Proxy/1.0");

    // 🔹 Add authentication from NextAuth session
    if (token.backendToken) {
      if (token.backendToken.startsWith("connect.sid=")) {
        // Session cookie authentication
        headers.set("Cookie", token.backendToken);
        console.log("🍪 Using session cookie authentication");
      } else {
        // Bearer token authentication
        headers.set("Authorization", `Bearer ${token.backendToken}`);
        console.log("🔑 Using bearer token authentication");
      }
    }

    // 🔹 Prepare request body for non-GET requests
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    // 🔹 Prepare proxy request
    const init = {
      method: req.method,
      headers: headers,
      body: body,
    };

    // 🔹 Make backend request
    console.log("📡 Making fetch request to:", finalUrl);
    console.log("📋 Request headers:", Object.fromEntries(headers.entries()));

    const response = await fetch(finalUrl, init);

    // 🔹 Get response body
    const resBody = await response.text();

    // 🔹 Log response for debugging
    console.log("✅ Backend Response:", response.status, finalUrl);

    // 🔹 Create response with proper headers
    const responseHeaders = new Headers();

    // Copy response headers (excluding problematic ones)
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["content-encoding", "transfer-encoding", "connection", "keep-alive"].includes(lowerKey)) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(resBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("❌ Proxy Error Details:");
    console.error("- Error message:", err.message);
    console.error("- Error code:", err.code);
    console.error("- Error cause:", err.cause);
    console.error("- Final URL was:", finalUrl || "URL not set");
    console.error("- Backend URL:", BACKEND_URL);

    return NextResponse.json(
      {
        error: "Proxy failed to reach backend",
        details: err.message,
        backendUrl: BACKEND_URL,
        finalUrl: finalUrl || "URL not set",
        errorCode: err.code,
      },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
