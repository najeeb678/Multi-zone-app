"use client";

import Api from "@/services/api";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await Api.getApi(`api/MAN/client/get/as/list`);
      setClients(response?.data?.data || []);
    } catch (error) {
      console.error("❌ Error loading clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              columnGap: "15px",
            }}
          >
            <h1 style={{ color: "#c4b7b7ff", flex: 1 }}>📦 Fulfillment Dashboard (Zone v3)</h1>
            <div style={{ width: "40px", height: "40px" }}>
              <LoadingSpinner isLoading={loading} />
            </div>
          </div>

          <p style={{ color: "#777", marginBottom: "20px" }}>
            Testing real API connection through host middleware.
          </p>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => (window.location.href = "v3/inventory")}
            disabled={loading.clients || loading.orders}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading.clients || loading.orders ? "wait" : "pointer",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            {"Inventory Page"}
          </button>

          <button
            onClick={loadClients}
            disabled={loading.clients}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading.clients ? "wait" : "pointer",
              marginBottom: "20px",
            }}
          >
            {loading.clients ? "Loading..." : "🔄 Refresh Clients"}
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
