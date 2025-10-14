import OrdersClient from "@/components/Clients/OrdersClient";
import { cookies } from "next/headers";

export default async function Page() {
  // 🧠 Read cookies on the server
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value;

  const hostUrl = process.env.HOST_URL || "http://localhost:5801";

  // 🧩 Send token manually so proxy can validate
  const res = await fetch(`${hostUrl}/api/be/MAN/client/get/as/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const clients = data?.data || [];
  console.log("✅ SSR clients:", clients);

  return <OrdersClient clientsData={clients} />;
}
