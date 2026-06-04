import { json } from "@/lib/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  return json({ status: "ok", service: "shop-finance-manager" });
}
