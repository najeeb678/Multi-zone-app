import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.APP_BASE_URL || "https://devapi.techship.me";

export async function handler(req, { params }) {
  let finalUrl = "";

  try {
    // 🔹 Resolve dynamic route parameters
    const resolvedParams = await params;

    // 🔹 Get authentication token from NextAuth,The client never sees this token.
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.log("❌ Authentication failed111: no token found");
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Authentication required" },
        { status: 401 }
      );
    }
  let xyzToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiSDRzSUFBQUFBQUFBQTEyT3l3ckNNQkJGXzJYV1JWRGJUVmFLQ2dxS2dyZ1FLUkxUMFFiektKT1VJcVhfYmxJVnBNdDc1dHpMdENBTFlGbWFRTzJRRE5jSURPYUZsZ1lTUU0ybENwbkhQUFBvX0VoWUhRNE5KMXpiMEhEQUxua0NfbFhGM21wMzJPN1A0VDdZaVhyNXB3c2wwZmh2c0x6MjVhSW53TnItSGVBM0FUOXRzeHlBSXdyQzRNSjRNazJ6Z0JfRVAydFFjZWNhUzBXQWhIZENWMTY5ZmFLQlBJSkNFZ3BfSWhsY1V5dlZkV185VVVBbl9nQUFBQSIsImlhdCI6MTc2MDQ0OTk1OCwiZXhwIjoxNzYwNDkzMTU3fQ.hsw-YfKTXGsUKKiRzkLD-_l6WtV1wyitz1Gut866gPgs"
   
    // 🔹 Construct backend URL
    const apiPath = resolvedParams.path.join("/");
    const queryString = new URL(req.url).search;
    finalUrl = `${BACKEND_URL}/${apiPath}${queryString}`;

    console.log("🌍 Incoming request:", req.method, req.url);
    console.log("📍 Target backend URL:", finalUrl);

    // 🔹 Prepare headers for backend request
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["host", "connection", "upgrade"].includes(lowerKey)) {
        headers.set(key, value);
      }
    });
    headers.set("Content-Type", "application/json");

    headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");
    headers.set("User-Agent", "MultiZone-Proxy/1.0");

    if (token.backendToken) {
      headers.set("Authorization", `Bearer ${xyzToken}`);
      console.log("🔑 Using bearer token for authentication");
    }
    if (req.headers.get("cookie")) {
      headers.set("Cookie", req.headers.get("cookie"));
    }

    // 🔹 Prepare request body if not GET or HEAD
    const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;
    if (body) console.log("📦 Request body:", body);

    // 🔹 Make the backend request
    const response = await fetch(finalUrl, { method: req.method, headers, body });
    // console.log("✅ Backend response proxy :", response);
    console.log("✅ Backend response status:", response.status);
    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    return NextResponse.json({ error: "Proxy failed", finalUrl }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
