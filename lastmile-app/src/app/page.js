"use client";
import { useState } from "react";
import Api from "@/services/api";

export default function Page() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWarehouses = async () => {
    console.log("Loading warehouses...");
    setLoading(true);
    try {
      const response = await Api.getApi("/warehouse/get/list");
      console.log("Warehouses loaded:", response?.data?.data?.data);
      setWarehouses(response?.data?.data?.data);
    } catch (error) {
      console.error("Error loading warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Last Mile Delivery Zone</h1>
      <p>This is the lastmile zone running on localhost:3001 but accessible through localhost:3000/v2</p>
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
          href="/v3"
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Fulfillment App →
        </a>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={loadWarehouses}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Load Warehouses (API Demo)"}
        </button>
      </div>

      {warehouses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Warehouse Data (via Host API):</h3>
          <ul>
            {warehouses.map((warehouse) => (
              <li key={warehouse.id} style={{ marginBottom: "10px" }}>
                <strong>{warehouse.name}</strong> - {warehouse.location}
                <br />
                <small>Capacity: {warehouse.capacity} packages</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
