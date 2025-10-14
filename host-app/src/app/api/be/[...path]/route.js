import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const BACKEND_URL = process.env.APP_BASE_URL || "https://devapi.techship.me";

export async function handler(req) {
  try {
    console.log("➡️ API call received:", req.method);

    // ✅ Get token from cookie/session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("🔑 Token from cookie:", token);

    // ✅ Get backend token either from header or session
    const authHeader = req.headers.get("authorization");
    let sessionToken = authHeader?.split(" ")[1];
    if (!sessionToken && token?.backendToken) {
      sessionToken = token.backendToken;
    }

    if (!sessionToken) {
      console.log("❌ No session token found");
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Authentication required" },
        { status: 401 }
      );
    }

    // ✅ Construct backend URL
    const url = new URL(req.url);
    const apiPath = url.pathname.replace("/api/be/", "");
    const finalUrl = `${BACKEND_URL}/${apiPath}${url.search}`;
    console.log("📍 Target backend URL:", finalUrl);

    // ✅ Clone and forward important headers
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["host", "connection", "upgrade"].includes(lowerKey)) {
        headers.set(key, value);
      }
    });

    headers.set("Content-Type", "application/x-www-form-urlencoded");
    headers.set("Authorization", `Bearer ${sessionToken}`);
    headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");
  

    if (req.headers.get("cookie")) {
      headers.set("Cookie", req.headers.get("cookie"));
    }

    // ✅ Forward body for non-GET/HEAD
    const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

    // ✅ Make the request
    const response = await fetch(finalUrl, { method: req.method, headers, body });
    console.log("✅ Backend response status:", response.status);

    // ✅ Pass response through
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

// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const BACKEND_URL = process.env.APP_BASE_URL;

// export async function handler(req) {
//   try {
//     console.log("➡️ API call received:", req.method);

//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     console.log("🔑 Token from cookie:", token);

//     const authHeader = req.headers.get("authorization");

//     let sessionToken = authHeader?.split(" ")[1];
//     if (!sessionToken && token?.backendToken) {
//       sessionToken = token.backendToken;
//     }

//     const url = new URL(req.url);
//     const apiPath = url.pathname.replace("/api/be/", "");
//     const queryString = url.search;
//     const finalUrl = `${BACKEND_URL}/${apiPath}${queryString}`;
//     console.log("📍 Target backend URL:", finalUrl);

//     const headers = new Headers();
//     headers.set("Content-Type", "application/json");
//     headers.set("Authorization", `Bearer ${sessionToken}`);
//     headers.set("x-host", process.env.DEV_HOST || "basit.techship.me");

//     const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

//     const response = await fetch(finalUrl, { method: req.method, headers, body });
//     console.log("✅ Backend response status:", response.status);

//     const responseBody = await response.text();
//     return new NextResponse(responseBody, {
//       status: response.status,
//       headers: response.headers,
//     });
//   } catch (err) {
//     console.error("❌ Proxy Error:", err);
//     return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
//   }
// }

// export const GET = handler;
// export const POST = handler;
// export const PUT = handler;
// export const DELETE = handler;
// export const PATCH = handler;
