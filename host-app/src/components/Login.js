"use client";
import React, { useState, useEffect } from "react";
import { checkClientAuth, generateSessionToken, AUTH_CONFIG } from "../utils/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "abc@gmail.com", password: "12345" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookieValue, setCookieValue] = useState("");

  // Check if sessionToken cookie exists on mount
  useEffect(() => {
    const isAuth = checkClientAuth();

    if (isAuth) {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});

      setLoggedIn(true);
      setCookieValue(cookies[AUTH_CONFIG.COOKIE_NAME] || "");
      console.log("User is already authenticated");

      // Check if there's a redirect URL and redirect automatically
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        console.log(`Redirecting authenticated user to: ${redirectUrl}`);
        window.location.href = redirectUrl;
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    // Generate a secure session token using our auth utility
    const sessionToken = generateSessionToken();

    // Get the current domain for cookie sharing
    const currentDomain = window.location.hostname;

    // Set secure cookie that will be shared across all zones
    const isLocalhost = currentDomain === "localhost" || currentDomain === "127.0.0.1";

    if (isLocalhost) {
      // For localhost development - cookie without domain (will work for same origin)
      document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=${sessionToken}; path=/; SameSite=Lax; ${
        window.location.protocol === "https:" ? "Secure" : ""
      }`;
    } else {
      // For production - use domain to share across subdomains
      const rootDomain = currentDomain.split(".").slice(-2).join("."); // Get root domain
      // document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=${sessionToken}; path=/; domain=.${rootDomain}; SameSite=None; Secure`;
      document.cookie = `${AUTH_CONFIG.COOKIE_NAME}=${sessionToken}; path=/; domain=${currentDomain}; SameSite=None; Secure`;
    }

    console.log(`✅ Authentication cookie set successfully!`);
    console.log(`Token: ${sessionToken}`);
    console.log(
      `Domain: ${
        isLocalhost ? "localhost (no domain)" : "." + currentDomain.split(".").slice(-2).join(".")
      }`
    );
    console.log(`This cookie will be accessible across all zones`);

    setLoggedIn(true);
    setCookieValue(sessionToken);

    // Check if there's a redirect URL and redirect after login
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect");
    if (redirectUrl) {
      console.log(`Redirecting after login to: ${redirectUrl}`);
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000); // Small delay to show success message
    }
  };

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
    setLoggedIn(false);
    setCookieValue("");
  };

  return (
    <div style={styles.container}>
      {!loggedIn ? (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
          <div style={styles.navigationLinks}>
            <h3 style={styles.navHeading}>Navigate to:</h3>
            <a href="/v2" style={styles.navLink}>
              📦 Lastmile App (Zone v2)
            </a>
            <a href="/v3" style={styles.navLink}>
              🚚 Fulfillment App (Zone v3)
            </a>
            <a href="/v3/publicPage" style={styles.navLink}>
              🚚 Public Page
            </a>
          </div>
        </>
      ) : (
        <div style={styles.loggedInBox}>
          <h2 style={styles.successText}>✅ Logged in successfully!</h2>
          <p style={styles.cookieText}>
            <strong>Cookie Value:</strong> {cookieValue}
          </p>
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
      )}
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

export default LoginPage;
