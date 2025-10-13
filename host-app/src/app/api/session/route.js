import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  return new Response(JSON.stringify(session || null), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
