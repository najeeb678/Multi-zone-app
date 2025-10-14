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

    // ✅ Construct backend URL
    const url = new URL(req.url);
    const apiPath = url.pathname.replace("/api/be/", "");
    const finalUrl = `${BACKEND_URL}/${apiPath}${url.search}`;
    console.log("📍 Target backend URL:", finalUrl);

    // ✅ Forward headers safely
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${sessionToken}`);
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
