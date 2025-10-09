// Shared authentication utilities for multi-zone app
// This file should be identical across all zones

export const AUTH_CONFIG = {
  COOKIE_NAME: "sessionToken",
  // In production, set this to your actual domain (e.g., 'yourdomain.com')
  // For localhost development, this will be ignored
  PRODUCTION_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "yourdomain.com",
  SECURE_COOKIES: process.env.NODE_ENV === "production",
};

export function isAuthenticated(request) {
  const sessionToken = request.cookies.get(AUTH_CONFIG.COOKIE_NAME);

  if (!sessionToken || !sessionToken.value) {
    return false;
  }

  // In a real app, you would validate the token here
  // For now, we just check if it exists and starts with 'session_'
  return sessionToken.value.startsWith("session_");
}

export function getAuthCookie(request) {
  return request.cookies.get(AUTH_CONFIG.COOKIE_NAME);
}

export function createAuthCookie(token) {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost) {
    // For localhost development
    return `${AUTH_CONFIG.COOKIE_NAME}=${token}; path=/; SameSite=Lax; ${
      AUTH_CONFIG.SECURE_COOKIES ? "Secure" : ""
    }`;
  } else {
    // For production with domain sharing
    return `${AUTH_CONFIG.COOKIE_NAME}=${token}; path=/; domain=.${AUTH_CONFIG.PRODUCTION_DOMAIN}; SameSite=None; Secure`;
  }
}

export function clearAuthCookie() {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost) {
    return `${AUTH_CONFIG.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } else {
    return `${AUTH_CONFIG.COOKIE_NAME}=; path=/; domain=.${AUTH_CONFIG.PRODUCTION_DOMAIN}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

// Client-side authentication check
export function checkClientAuth() {
  if (typeof window === "undefined") return false;

  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies[AUTH_CONFIG.COOKIE_NAME];
  return token && token.startsWith("session_");
}

// Generate a secure session token (in production, this should be done server-side)
export function generateSessionToken() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
