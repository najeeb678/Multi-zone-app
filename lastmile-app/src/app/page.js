"use client";
import Api from "@/services/api";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

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
    // console.log("🚀 Fetching orders from backend...");
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        timezone: "Asia/Karachi",
        size: size.toString(),
        page: page.toString(),
      });

      // Use your proxy (will go through middleware for auth)
      const response = await Api.getApi(`v2/api/MAN/client/get/as/list`);
      // const response = await Api.postApi(`v2/api/LM/order/get/for/admin?${queryParams}`);
      // const response = await Api.getApi(`${ordersEndpoint}${queryParams}`);

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
    <div className={styles.page}>
      <div className={styles.header}>
      <h1 style={{ color: "#333" }}>🚛 Last Mile Orders</h1>
      <p style={{ color: "#777", marginBottom: "20px" }}>
        Testing real API connection through host middleware.
      </p></div>
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
        {"Host App"}
      </button>
      <button
        onClick={() => (window.location.href = "/v3")}
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
        {"Fulfillment App"}
      </button>
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
</div>
      {orders.length > 0 ? (
      <div className={styles.orders}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#333",
                color: "#afa3a3ff",
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
