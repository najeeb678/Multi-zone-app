"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
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

      {/* Simple Zone Information */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          border: "2px solid #0284c7",
          borderRadius: "8px",
          padding: "15px",
          margin: "20px 0",
          maxWidth: "600px",
        }}
      >
        <h3 style={{ color: "#0c4a6e", margin: "0 0 10px 0" }}>� Fulfillment Zone Information</h3>
        <p style={{ color: "#0c4a6e", margin: "5px 0" }}>
          <strong>Zone:</strong> v3 - Fulfillment App
        </p>
        <p style={{ color: "#0c4a6e", margin: "5px 0" }}>
          <strong>Port:</strong> 3001 (when running independently)
        </p>
        <p style={{ color: "#0c4a6e", margin: "5px 0" }}>
          <strong>Purpose:</strong> Order fulfillment and warehouse management
        </p>
        <p style={{ color: "#0c4a6e", margin: "5px 0", fontSize: "14px" }}>
          Authentication is handled by the host app at the proxy level.
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
