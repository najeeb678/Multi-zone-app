"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { checkClientAuth, AUTH_CONFIG } from "../utils/auth";
import { useState, useEffect } from "react";

export default function Home() {
  const [authStatus, setAuthStatus] = useState({ isAuth: false, token: "" });

  useEffect(() => {
    const isAuth = checkClientAuth();
    if (isAuth) {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});
      setAuthStatus({
        isAuth: true,
        token: cookies[AUTH_CONFIG.COOKIE_NAME] || "",
      });
    }
  }, []);

  const handleTestClick = () => {
    window.location.reload();
  };

  const handleNavigation = () => {
    window.location.href = window.location.href;
  };

  return (
    <div className={styles.page}>
      <h1>📦 Fulfillment Dashboard (Zone v3)</h1>
      <p style={{ fontSize: "18px", margin: "20px 0" }}>Welcome to the Fulfillment application zone!</p>

      {/* Authentication Status */}
      <div
        style={{
          backgroundColor: authStatus.isAuth ? "#dcfce7" : "#fef2f2",
          border: "2px solid " + (authStatus.isAuth ? "#16a34a" : "#ef4444"),
          borderRadius: "8px",
          padding: "15px",
          margin: "20px 0",
          maxWidth: "600px",
        }}
      >
        <h3 style={{ color: authStatus.isAuth ? "#166534" : "#991b1b", margin: "0 0 10px 0" }}>
          🔐 Authentication Status
        </h3>
        <p style={{ color: authStatus.isAuth ? "#166534" : "#991b1b", margin: "5px 0" }}>
          <strong>Status:</strong> {authStatus.isAuth ? "✅ Authenticated" : "❌ Not Authenticated"}
        </p>
        {authStatus.isAuth && (
          <p style={{ color: "#166534", margin: "5px 0", wordBreak: "break-all" }}>
            <strong>Token:</strong> {authStatus.token}
          </p>
        )}
        <p
          style={{ color: authStatus.isAuth ? "#166534" : "#991b1b", margin: "5px 0", fontSize: "14px" }}
        >
          This cookie is shared across all zones in the multi-zone application.
        </p>
      </div>

      {/* Navigation back to host */}
      <div style={{ marginTop: "40px" }}>
        <a
          href="/"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          ← Back to Host App
        </a>
        <a
          href="/v2"
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Lastmile App →
        </a>
      </div>

    </div>
  );
}
