import { toast } from "react-toastify";

export async function globalLogout() {
  try {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

    // Hit the host’s logout endpoint — it will clear cookies and redirect to /login
    const res = await fetch(`${hostUrl}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
      redirect: "follow",
    });

    // Since host returns HTML redirect, don't try to parse JSON
    if (res.redirected) {
      toast.success("Logging out...");
      window.location.href = res.url; // follow the redirect target (e.g., /login)
      return;
    }

    // Fallback if not redirected automatically
    if (res.ok) {
      toast.success("Logged out successfully!");
      window.location.href = `${hostUrl}/login`;
    } else {
      toast.error("Logout failed. Please try again.");
    }
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Something went wrong while logging out.");
  }
}
