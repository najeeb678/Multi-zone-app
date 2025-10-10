"use client";
import { useState, useEffect } from "react";
import Api from "@/services/api";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (page = 1, size = 20) => {
    console.log("🚀 Fetching orders from backend...");
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        timezone: "Asia/Karachi",
        size: size.toString(),
        page: page.toString(),
      });

      // Use your proxy (will go through middleware for auth)
      const response = await Api.getApi(`/LM/order/get/for/admin?${queryParams}`);

      console.log("✅ Orders API Response:", response?.data);

      const ordersData = response?.data?.data?.orders || [];
      const totalOrders = response?.data?.data?.count || 0;

      setOrders(ordersData);
      setPagination({ page, size, total: totalOrders });
    } catch (error) {
      console.error("❌ Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>🚛 Last Mile Orders</h1>
      <p style={{ color: "#777", marginBottom: "20px" }}>
        Testing real API connection through host middleware.
      </p>

      <button
        onClick={() => loadOrders()}
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
        {loading ? "Loading..." : "🔄 Refresh Orders"}
      </button>

      {orders.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
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
          ))}
        </div>
      ) : (
        !loading && (
          <p style={{ color: "#999", fontStyle: "italic" }}>No orders found. Try refreshing.</p>
        )
      )}
    </div>
  );
}
