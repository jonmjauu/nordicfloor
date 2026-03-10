import { NextResponse } from "next/server";
import { createPendingOrder, listOrders } from "@/lib/db/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { checkoutSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET() {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const order = await createPendingOrder(parsed.data);
  return NextResponse.json(order, { status: 201 });
}
