import OrdersClient from "@/components/Clients/OrdersClient";
import { ssrAPI } from "@/utils/ssrAPI";
import { redirect } from "next/navigation";
import { Navbar } from "app-tship";
import { globalLogout } from "@/utils/auth";
export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const api = await ssrAPI();
    const res = await api.get("api/MAN/client/get/as/list");
    const clients = res.data.data || [];
    console.log("Clients in SSR", clients);

    return (
      <>
        <OrdersClient clientsData={clients} />
      </>
    );
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return redirect(`${process.env.NEXT_PUBLIC_HOST_URL}/api/auth/signout`);
    }
    console.error("Error fetching client data:", error);

    return (
      <>
        <OrdersClient clients={[]} />
      </>
    );
  }
}
