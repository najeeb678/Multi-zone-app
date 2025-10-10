"use client";
import React, { useState, useEffect } from "react";
import { signIn, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User already authenticated, redirecting to home...");
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders();
        console.log("Available providers:", res);
        setProviders(res);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setError("Failed to load authentication providers");
      }
    };
    fetchProviders();
  }, []);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.title}>Loading...</h2>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (status === "authenticated") {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Starting login process with:", formData.email);

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        setError(result.error);
      } else if (result?.ok) {
        console.log("Login successful, redirecting...");
        // Use Next.js router for better navigation
        router.push("/");
      } else {
        console.error("Unexpected result:", result);
        setError("Login failed - unexpected response");
      }
    } catch (error) {
      console.error("Login exception:", error);
      setError(`Login failed: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        {/* Debug info */}
        <div style={{ marginBottom: "1rem", fontSize: "0.8rem", color: "#ccc" }}>
          <div>Providers loaded: {providers ? "Yes" : "No"}</div>
          <div>NextAuth available: {typeof signIn !== "undefined" ? "Yes" : "No"}</div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email (try: test@example.com)"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (try: 12345)"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
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
