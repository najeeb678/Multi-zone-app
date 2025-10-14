// subapp/app/v2/orders/page.js
import OrdersClient from "@/components/Clients/OrdersClient";

export const dynamic = "force-dynamic"; // ensures fresh SSR fetch

export default async function Page() {
  let clients = [];

  try {
    const hostUrl = process.env.HOST_URL || "http://localhost:5801";

    // Server-to-server request to host, bypassing auth middleware
    const res = await fetch(`${hostUrl}/api/be/MAN/client/get/as/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
