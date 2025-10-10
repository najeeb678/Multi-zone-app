// API service for zones - all calls go through host app
class ApiService {
  constructor() {
    this.baseURL = process.env.BACKEND_URL || "http://localhost:3000";
  }

  // Main API method - equivalent to your postApi
  async postApi(endpoint, payload = {}) {
    try {
      console.log(`📡 API Call: POST ${endpoint}`);

      const response = await fetch(`${this.baseURL}/api/v2${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": this.getDeviceId(),
        },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      // Handle authentication errors
      if (response.status === 401) {
        console.log("🔒 Authentication failed, redirecting to login");
        this.redirectToLogin();
        throw new Error("Authentication required");
      }

      console.log(`✅ API Response: ${endpoint} -> ${response.status}`);
      return { data, status: response.status };
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      throw error;
    }
  }

  async getApi(endpoint, params = {}) {
    try {
      console.log(`📡 API Call: GET ${endpoint}`);

      const url = new URL(`${this.baseURL}/api/v2${endpoint}`);
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": this.getDeviceId(),
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        console.log("🔒 Authentication failed, redirecting to login");
        this.redirectToLogin();
        throw new Error("Authentication required");
      }

      console.log(`✅ API Response: ${endpoint} -> ${response.status}`);
      return { data, status: response.status };
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      throw error;
    }
  }

  getDeviceId() {
    if (typeof window !== "undefined") {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("deviceId", deviceId);
      }
      return deviceId;
    }
    return "server";
  }

  redirectToLogin() {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
}

// Export singleton instance
const Api = new ApiService();
export default Api;
