import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ssrAPI = async () => {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  const hostUrl = process.env.HOST_URL || "http://localhost:5801";

  const instance = axios.create({
    baseURL: `${hostUrl}/api/be/`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    },
  });

  instance.interceptors.request.use(
    (config) => {
      console.log(`➡️ [SSR Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url;

      if (status === 401 || status === 403) {
        const hostUrl = process.env.HOST_URL || "http://localhost:5801";
        console.error(`🚫 [SSR ${status}] Unauthorized access to ${url}`);

        // Use the existing signout endpoint with redirect=true parameter
        // to trigger server-side redirect after clearing session
        error.redirect = `${hostUrl}/api/auth/signout?redirect=true`;
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
