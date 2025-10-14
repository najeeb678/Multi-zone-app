import { cookies } from "next/headers";

export function getBackendTokenFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get("next-auth.session-token");
  return token?.value || null;
}
