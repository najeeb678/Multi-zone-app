"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

const Home = () => {
  const { data: session, status } = useSession();


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
