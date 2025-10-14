import axios from "axios";
import { toast } from "react-toastify";

const gltAPI = () => {
  const instance = axios.create({
    baseURL: "", // proxy (host app)
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;

      // 🔹 Unauthorized or Forbidden
      if (status === 401 || status === 403) {
        console.log("message11122");
        const message =
          status === 401
            ? "Session expired. Redirecting to login..."
            : error?.response?.data?.message || "Access denied.";

        if (typeof window !== "undefined") {
          toast.error(message);
        }

        try {
          await fetch("/api/auth/signout", { method: "POST" });
        } catch (logoutErr) {
          console.error("❌ Error during logout:", logoutErr);
        }

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export { gltAPI };
