import { cookies } from "next/headers";

export async function ssrFetch(url, options = {}) {
  try {
    // 🧠 Get cookies on the server
    const cookieStore = cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    const hostUrl = process.env.HOST_URL || "http://localhost:5801";

    const res = await fetch(`${hostUrl}/api/be/${url}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...options.headers,
      },
      cache: "no-store",
      ...options,
    });

    if (!res.ok) {
      console.error("❌ SSR Fetch Error:", res.status, res.statusText);
      throw new Error(`SSR Fetch failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("🔥 ssrFetch error:", error);
    return { data: null, error: error.message };
  }
}
