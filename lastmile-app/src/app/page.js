import OrdersClient from "@/components/Clients/OrdersClient";

export default async function Page() {
  let clients = [];

  try {
    // ✅ Call the host proxy directly

    // HOST_URL points to the host app (e.g., "http://localhost:5801")

    const hostUrl = process.env.HOST_URL || "http://localhost:5801";

    const res = await fetch(`${hostUrl}/v2/api/MAN/client/get/as/list`, {
      method: "GET",

      credentials: "include", // include cookies if any (client-side)
    });

    if (!res.ok) {
      throw new Error(`Host proxy fetch failed: ${res.status}`);
    }

    const data = await res.json();

    clients = data?.data || [];
  } catch (error) {
    console.error("❌ Server fetch failed:", error);
  }

  return <OrdersClient clientsData={clients} />;
}
