import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const gltAPI = () => {
  const instance = axios.create({
    baseURL: "http://localhost:3000", // Point to host app where proxy is located
    withCredentials: true, // include cookies for session-based auth
  });

  // 🔹 Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      // config.headers["x-device-id"] = AppUtils.getDeviceId();

      // console.groupCollapsed(
      //   `%c🚀 API REQUEST → ${config.method?.toUpperCase()} ${config.url}`,
      //   "color: #007bff; font-weight: bold;"
      // );
      // console.log("Payload11:", config.data || "(none)");
      // console.log("🧭 Base URL:", config.baseURL || "(default)");
      // console.log("🔖 Full URL:", `${config.baseURL || ""}${config.url}`);
      // console.log("🪪 Headers:", config.headers);
      console.groupEnd();

      return config;
    },
    (error) => {
      console.error("❌ Request setup error:", error);
      return Promise.reject(error);
    }
  );

  // 🔹 Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      console.groupCollapsed(
        `%c✅ API RESPONSE ← ${response.config.method?.toUpperCase()} ${response.config.url}`,
        "color: #28a745; font-weight: bold;"
      );
      console.log("📊 Status:", response.status);
      console.log("📨 Data:", response.data);
      console.log("🕓 Timestamp:", new Date().toLocaleTimeString());
      console.groupEnd();

      return response;
    },
    (error) => {
      console.groupCollapsed(
        `%c🔥 API ERROR ← ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        "color: #dc3545; font-weight: bold;"
      );
      console.log("❌ Error Message:", error.message);
      console.log("📊 Status:", error.response?.status || "No response");
      console.log("📨 Data:", error.response?.data || "(none)");
      console.groupEnd();

      if (error?.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else if (error?.response?.status === 503) {
        toast.error("Service unavailable. Please try again later.");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export { gltAPI };
