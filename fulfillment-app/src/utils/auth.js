import { toast } from "react-toastify";

export async function globalLogout() {
  try {
    const hostUrl = window.location.origin.replace(/:\d+/, ":5801");
    const res = await fetch(`${hostUrl}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Logged out successfully!");

      setTimeout(() => {
        if (data?.redirect) {
          window.location.href = `${hostUrl}${data.redirect}`;
        } else {
          window.location.href = hostUrl;
        }
      }, 500);
    } else {
      toast.error(data?.error || "Logout failed. Please try again.");
    }
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Something went wrong while logging out.");
  }
}
