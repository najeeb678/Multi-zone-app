import OrdersClient from "@/components/Clients/OrdersClient";
import { ssrFetch } from "@/utils/ssrFetch";

export default async function Page() {
  const res = await ssrFetch("MAN/client/get/as/list");
  const clients = res?.data || [];

  console.log("✅ SSR clients:", clients);

  return <OrdersClient clientsData={clients} />;
}
