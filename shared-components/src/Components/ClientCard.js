// components/ClientCard.js
"use client";
import React from "react";

export default function ClientCard({ client }) {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#333",
        color: "#afa3a3ff",
        transition: "transform 0.2s ease",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
        {client.name} (#{client.id})
      </div>
      <div>Type: {client.clientType}</div>
      <div>Inventory Alert Threshold: {client.inventoryAlertThreshold}</div>
    </div>
  );
}
