import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.APP_BASE_URL || "https://devapi.techship.me";

export async function handler(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.backendToken) {
      // console.log("❌ No backend token found");
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionToken = token.backendToken;
    console.log("session token", sessionToken)
    let xyzToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiSDRzSUFBQUFBQUFBQTEyT3l3ckNNQkJGXzJYV1JWRGJUVmFLQ2dxS2dyZ1FLUkxUMFFiektKT1VJcVhfYmxJVnBNdDc1dHpMdENBTFlGbWFRTzJRRE5jSURPYUZsZ1lTUU0ybENwbkhQUFBvX0VoWUhRNE5KMXpiMEhEQUxua0NfbFhGM21wMzJPN1A0VDdZaVhyNXB3c2wwZmh2c0x6MjVhSW53TnItSGVBM0FUOXRzeHlBSXdyQzRNSjRNazJ6Z0JfRVAydFFjZWNhUzBXQWhIZENWMTY5ZmFLQlBJSkNFZ3BfSWhsY1V5dlZkV185VVVBbl9nQUFBQSIsImlhdCI6MTc2MDQ0OTk1OCwiZXhwIjoxNzYwNDkzMTU3fQ.hsw-YfKTXGsUKKiRzkLD-_l6WtV1wyitz1Gut866gPgs"
    // ✅ Construct backend URL
    const url = new URL(req.url);
    const apiPath = url.pathname.replace("/api/be/", "");
    const finalUrl = `${BACKEND_URL}/${apiPath}${url.search}`;
    console.log("📍 Target backend URL:", finalUrl);

    // ✅ Forward headers safely
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${xyzToken}`);
    headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");

    // ✅ Read body for non-GET requests
    const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

    // ✅ Make backend request
    const response = await fetch(finalUrl, { method: req.method, headers, body });
    console.log("✅ Backend response status:", response.status);
    // console.log("✅ Backend response proxy:", response);

    // ✅ Read and return body safely
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
