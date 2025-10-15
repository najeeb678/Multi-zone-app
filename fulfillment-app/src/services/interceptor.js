import axios from "axios";
import { toast } from "react-toastify";

const gltAPI = () => {
  const instance = axios.create({
    baseURL: "",
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
        console.log("error111", error?.response);
        const message =
          status === 401
            ? error?.response?.data?.message || "Access denied."
            : "Session expired. Redirecting to login...";

        if (typeof window !== "undefined") {
          toast.error(message);
          setTimeout(() => {
            window.location.href = "/api/auth/signout";
          }, 1500);
        }

        // Stop further axios execution
        return new Promise(() => {}); // never resolve
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export { gltAPI };
