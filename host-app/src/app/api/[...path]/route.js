import { NextResponse } from "next/server";
import { getValidatedToken } from "@/utils/tokenValidator";

const BACKEND_URL = process.env.APP_BASE_URL || "https://devapi.techship.me";

export async function handler(req, { params }) {
  let finalUrl = "";

  try {
    // 🔹 Resolve dynamic route parameters
    const resolvedParams = await params;

    // 🔹 Get and validate authentication token with refresh handling
    const tokenValidation = await getValidatedToken(req);

    if (!tokenValidation.isValid) {
      console.log(`❌ Authentication failed: ${tokenValidation.message}`);
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: tokenValidation.message },
        { status: tokenValidation.status || 401 }
      );
    }

    const token = tokenValidation.token;
    console.log("🔐 Using authenticated token");

    // For debugging - remove in production
    // console.log("token11", token);

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
      headers.set("Authorization", `Bearer ${token.backendToken}`);
      // headers.set("Authorization", `Bearer ${xyzToken}`);
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
