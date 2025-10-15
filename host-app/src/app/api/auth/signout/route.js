// hostapp/app/api/auth/signout/route.js
import { clearSessionAndRedirect } from "@/utils/auth";

export async function GET(request) {
  return clearSessionAndRedirect();
}

export async function POST(request) {
  return clearSessionAndRedirect();
}
