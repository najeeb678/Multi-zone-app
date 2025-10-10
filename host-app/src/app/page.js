"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

const Home = () => {
  const { data: session, status } = useSession();
  const [apiResult, setApiResult] = useState(null);
  const [testing, setTesting] = useState(false);

  // Show loading state
  if (status === "loading") {
    return (
      <div style={styles.container}>
        <div style={styles.loggedInBox}>
          <h2 style={styles.successText}>Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (middleware should handle this, but just in case)
  if (status === "unauthenticated") {
    return (
      <div style={styles.container}>
        <div style={styles.loggedInBox}>
          <h2 style={{ color: "#ff6b6b" }}>Not authenticated</h2>
          <p style={{ color: "#ccc" }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    console.log("🚪 Logging out...");

    // Sign out from NextAuth
    await signOut({ redirect: false });

    console.log("✅ User logged out");

    // Redirect to login page
    window.location.href = "/login";
  };

  const testApiProxy = async () => {
    setTesting(true);
    setApiResult(null);

    try {
      console.log("🧪 Testing API proxy with NextAuth...");

      // Test our API proxy with a simple endpoint
      const response = await axios.get("/api/v2/test");

      console.log("✅ API proxy test successful:", response.data);
      setApiResult({ success: true, data: response.data });
    } catch (error) {
      console.error("❌ API proxy test failed:", error);
      setApiResult({
        success: false,
        error: error.response?.data || error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loggedInBox}>
        <h2 style={styles.successText}>✅ Logged in successfully!</h2>

        {/* Session Information */}
        {session && (
          <div
            style={{
              margin: "1rem 0",
              padding: "1rem",
              backgroundColor: "#2c2c2c",
              borderRadius: "5px",
            }}
          >
            <h4 style={{ color: "#fff", marginBottom: "0.5rem" }}>Session Info:</h4>
            <p style={{ color: "#ccc", margin: "0.25rem 0" }}>Email: {session.user?.email}</p>
            <p style={{ color: "#ccc", margin: "0.25rem 0" }}>Name: {session.user?.name}</p>
            <p style={{ color: "#ccc", margin: "0.25rem 0" }}>Role: {session.user?.role}</p>
            <p style={{ color: "#ccc", margin: "0.25rem 0" }}>Tenant: {session.user?.tenant}</p>
          </div>
        )}

        {/* API Proxy Test */}
        <div style={{ margin: "1rem 0", textAlign: "center" }}>
          <button
            onClick={testApiProxy}
            disabled={testing}
            style={{
              ...styles.button,
              backgroundColor: testing ? "#666" : "#28a745",
              cursor: testing ? "not-allowed" : "pointer",
            }}
          >
            {testing ? "Testing..." : "🧪 Test API Proxy"}
          </button>

          {apiResult && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: apiResult.success ? "#1e4d2c" : "#4d1e1e",
                borderRadius: "5px",
                border: `1px solid ${apiResult.success ? "#28a745" : "#dc3545"}`,
              }}
            >
              <h5 style={{ color: apiResult.success ? "#28a745" : "#dc3545", margin: "0 0 0.5rem 0" }}>
                {apiResult.success ? "✅ API Test Success" : "❌ API Test Failed"}
              </h5>
              <pre style={{ color: "#ccc", fontSize: "0.8rem", textAlign: "left", margin: 0 }}>
                {JSON.stringify(apiResult.success ? apiResult.data : apiResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <p style={styles.cookieText}></p>
        <div style={styles.navigationLinks}>
          <h3 style={styles.navHeading}>Navigate to:</h3>
          <a href="/v2" style={styles.navLink}>
            📦 Lastmile App (Zone v2)
          </a>
          <a href="/v3" style={styles.navLink}>
            🚚 Fulfillment App (Zone v3)
          </a>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // dark background
    flexDirection: "column",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    borderRadius: "10px",
    backgroundColor: "#1e1e1e",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    width: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#fff",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    border: "1px solid #333",
    borderRadius: "5px",
    fontSize: "1rem",
    backgroundColor: "#2c2c2c",
    color: "#fff",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  loggedInBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    borderRadius: "10px",
    backgroundColor: "#1e1e1e",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    minWidth: "400px",
  },
  successText: {
    color: "#00ff99",
  },
  cookieText: {
    color: "#ccc",
  },
  navigationLinks: {
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  navHeading: {
    color: "#fff",
    marginBottom: "1rem",
  },
  navLink: {
    display: "block",
    margin: "0.5rem 0",
    padding: "0.75rem 1rem",
    backgroundColor: "#0d6efd",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  logoutButton: {
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Home;
