// components/OrderCard.js
"use client";
import React from "react";

export default function OrderCard({ order }) {
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
        #{order.trackingNumber || order.id}
      </div>
      <div>Customer: {order.customerName}</div>
      <div>City: {order.deliveryCity}</div>
      <div>Status: {order.status}</div>
      <div>COD: {order.codAmount}</div>
      <div>Date: {order.createdDate}</div>
    </div>
  );
}
