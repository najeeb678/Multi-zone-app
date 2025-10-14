import OrdersClient from "@/components/Clients/OrdersClient";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value;
  // console.log("sessionToken", sessionToken);

  // use sessionToken in fetch headers
  const hostUrl = process.env.HOST_URL || "http://localhost:5801";
  const res = await fetch(`${hostUrl}/api/be/MAN/client/get/as/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  const data = await res.json();
  const clients = data?.data || [];
  console.log("clients11", clients);
  return <OrdersClient clientsData={clients} />;
}
