import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ssrAPI = async () => {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  const hostUrl = process.env.HOST_URL || "http://localhost:5801";

  const instance = axios.create({
    baseURL: `${hostUrl}/`,
    withCredentials: true,
    decompress: false, // Disable automatic decompression
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "identity", // Request uncompressed response
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    },
  });

  // 🛰️ Log requests (optional)
  instance.interceptors.request.use(
    (config) => {
      console.log(`➡️ [SSR Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🚨 Handle unauthorized responses automatically
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url;

      if (status === 401 || status === 403) {
        console.error(`🚫 [SSR ${status}] Unauthorized access to ${url}`);
        const hostUrl = process.env.HOST_URL || "http://localhost:5801";

        // ✅ Immediately redirect from here
        redirect(`${hostUrl}/api/auth/signout`);
      }

      throw error;
    }
  );

  return instance;
};
