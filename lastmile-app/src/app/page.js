"use client";
import { useState, useEffect } from "react";
import Api from "@/services/api";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState({ orders: false, warehouses: false });
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // Load initial data when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (page = 1, size = 10) => {
    console.log("Loading orders...");
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      // Call the real backend endpoint for orders
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const response = await Api.postApi(`/LM/order/get/for/admin?${queryParams}`, {
        // You can add filters here as needed
        statusFilter: [],
        dateRange: null,
      });

      console.log("Orders loaded:", response?.data);

      const ordersData = response?.data?.data?.orders || [];
      const totalOrders = response?.data?.data?.count || 0;

      setOrders(ordersData);
      setPagination({
        page,
        size,
        total: totalOrders,
      });
    } catch (error) {
      console.error("Error loading orders:", error);
      // Show some mock data if backend fails
      setOrders([
        { id: "ORD001", customer: "Alice Brown", status: "pending", amount: 150 },
        { id: "ORD002", customer: "Bob Wilson", status: "delivered", amount: 230 },
      ]);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const loadWarehouses = async () => {
    console.log("Loading warehouses...");
    setLoading((prev) => ({ ...prev, warehouses: true }));
    try {
      const response = await Api.getApi("/MAN/warehouse/get/list");
      console.log("Warehouses loaded:", response?.data?.data?.data);
      setWarehouses(response?.data?.data?.data || []);
    } catch (error) {
      console.error("Error loading warehouses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, warehouses: false }));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "10px" }}>🚛 Last Mile Delivery Zone</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        This is the lastmile zone running on localhost:3002 but accessible through localhost:3000/v2
      </p>

      {/* Navigation Links */}
      <div style={{ marginBottom: "30px" }}>
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

      {/* API Demo Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => loadOrders()}
          disabled={loading.orders}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff6b35",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading.orders ? "wait" : "pointer",
            marginRight: "10px",
          }}
        >
          {loading.orders ? "Loading..." : "🔄 Refresh Orders"}
        </button>

        <button
          onClick={loadWarehouses}
          disabled={loading.warehouses}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading.warehouses ? "wait" : "pointer",
          }}
        >
          {loading.warehouses ? "Loading..." : "📦 Load Warehouses"}
        </button>
      </div>

      {/* Orders Section */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ color: "#333", marginBottom: "20px" }}>📋 Orders ({pagination.total} total)</h3>

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
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Order #{order.id || order.orderId}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  Customer: {order.customer || order.customerName || "N/A"}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  Status:{" "}
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        order.status === "delivered"
                          ? "#d4edda"
                          : order.status === "pending"
                          ? "#fff3cd"
                          : "#f8d7da",
                      color:
                        order.status === "delivered"
                          ? "#155724"
                          : order.status === "pending"
                          ? "#856404"
                          : "#721c24",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div>Amount: ₹{order.amount || order.totalAmount || "0"}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No orders loaded. Click "Refresh Orders" to load data from backend.
          </p>
        )}
      </div>

      {/* Warehouses Section */}
      {warehouses.length > 0 && (
        <div>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>🏢 Warehouses ({warehouses.length})</h3>
          <div
            style={{
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
          >
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                style={{
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f0f8ff",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>{warehouse.name}</div>
                <div style={{ marginBottom: "5px" }}>📍 {warehouse.location}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Capacity: {warehouse.capacity} packages
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
