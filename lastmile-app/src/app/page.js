import OrdersClient from "@/components/Clients/OrdersClient";
import { ssrAPI } from "@/utils/ssrAPI";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const api = await ssrAPI();
    const res = await api.get("MAN/client/get/as/list");
    const clients = res.data.data || [];
    return <OrdersClient clients={clients} />;
  } catch (error) {
    if (error.redirect) {
      // Use redirect to navigate to login page when unauthorized
      redirect(error.redirect);
    }
    throw error; // Let Next.js error boundary handle other errors
  }
}
