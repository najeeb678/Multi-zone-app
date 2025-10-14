// app/api/be/[...path]/route.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.APP_BASE_URL;

export async function handler(req, { params }) {
    console.log("req",req)
    console.log("params11",params)
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.backendToken) {
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Authentication required" },
        { status: 401 }
      );
    }

    const apiPath = params.path.join("/");
    const queryString = new URL(req.url).search;
    const finalUrl = `${BACKEND_URL}/${apiPath}${queryString}`;

    // Build headers for backend
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token.backendToken}`);
    headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");
    headers.set("User-Agent", "MultiZone-Proxy/1.0");

    // Copy body if POST/PUT/PATCH
    const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

    const response = await fetch(finalUrl, { method: req.method, headers, body });
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: response.headers,
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
