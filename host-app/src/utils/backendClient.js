// Utility for making authenticated backend API calls
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

/**
 * Creates an authenticated axios client for backend API calls
 * This should only be used server-side (API routes or Server Components)
 */
export async function getBackendClient() {
  // Get the session (which includes the JWT with our backend token)
  const session = await getServerSession(authOptions);

  // Get the token from the session (this is server-side only)
  const token = session?.backendToken;

  // Create axios instance with baseURL
  const client = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to all requests if available
  client.interceptors.request.use((config) => {
    if (token) {
      // Inject the backend JWT into the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

/**
 * Example usage:
 *
 * // In a server component or API route:
 * const client = await getBackendClient();
 * const response = await client.get('/users/profile');
 */
