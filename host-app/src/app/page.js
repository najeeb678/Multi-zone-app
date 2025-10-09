"use client";
import React from "react";
import { AUTH_CONFIG } from "../utils/auth";

const Home = () => {
  const handleLogout = () => {
    // Remove cookie properly for both localhost and production
    const currentDomain = window.location.hostname;
    const isLocalhost = currentDomain === "localhost" || currentDomain === "127.0.0.1";

    if (isLocalhost) {
      // For localhost development
      document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } else {
      // For production - clear cookie with domain
      const rootDomain = currentDomain.split(".").slice(-2).join(".");
      document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    console.log("🚪 Authentication cookie cleared - user logged out from all zones");

    // Redirect to login page after logout
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.loggedInBox}>
        <h2 style={styles.successText}>✅ Logged in successfully!</h2>
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
