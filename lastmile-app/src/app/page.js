import OrdersClient from "@/components/Clients/OrdersClient";
import { ssrAPI } from "@/utils/ssrAPI";

export const dynamic = "force-dynamic";

export default async function Page() {
  const api = await ssrAPI();
  const res = await api.get("MAN/client/get/as/list");
  const clients = res.data.data || [];
  return <OrdersClient clients={clients} />;
}
