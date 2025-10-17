"use client";
import Api from "@/services/api";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { globalLogout } from "@/utils/auth";
import { Navbar } from "app-tship";
export default function Page() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await Api.getApi(`api/MAN/client/get/as/list`);
      console.log("✅ Clients API Response:", response?.data?.data);

      const clientsData = response?.data?.data || [];

      setClients(clientsData);
    } catch (error) {
      console.error("❌ Error loading clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 style={{ color: "#c4b7b7ff" }}>📦 Fulfillment Dashboard (Zone v3)</h1>
          <p style={{ color: "#777", marginBottom: "20px" }}>
            Testing real API connection through host middleware.
          </p>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => (window.location.href = "/")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "wait" : "pointer",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            Host App
          </button>
          <button
            onClick={() => (window.location.href = "/v2")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "wait" : "pointer",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            Last-Mile App
          </button>
          <button
            onClick={loadClients}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "wait" : "pointer",
              marginBottom: "20px",
            }}
          >
            {loading ? "Loading..." : "🔄 Refresh Clients"}
          </button>
          <button
            onClick={globalLogout}
            disabled={loggingOut}
            style={{ ...buttonStyle, backgroundColor: "#ef4444", marginLeft: "10px" }}
          >
            {loggingOut ? "Logging out..." : "🚪 Logout"}
          </button>
        </div>
        {clients.length > 0 ? (
          <div className={styles.clients}>
            {clients.map((client) => (
              <div
                key={client.id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#333",
                  color: "#afa3a3ff",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                  {client.name} (#{client.id})
                </div>
                <div>Type: {client.clientType}</div>
                <div>Inventory Alert Threshold: {client.inventoryAlertThreshold}</div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p style={{ color: "#999", fontStyle: "italic" }}>No clients found. Try refreshing.</p>
          )
        )}
      </div>
    </>
  );
}
const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "20px",
  marginRight: "10px",
};
