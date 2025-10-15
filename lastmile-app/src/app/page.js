import OrdersClient from "@/components/Clients/OrdersClient";
import { ssrAPI } from "@/utils/ssrAPI";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const api = await ssrAPI();
    const res = await api.get("api/MAN/client/get/as/list");
    const clients = res.data.data || [];
    console.log("SSR : ", clients);
    return <OrdersClient clients={clients} />;
  } catch (error) {
    console.error("Error fetching client data:", error.message);
    // Return component with empty clients array to avoid breaking the UI
    return <OrdersClient clients={[]} />;
  }
}
