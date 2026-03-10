import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { createRefundRequest, getOrderById } from "@/lib/db/queries";
import { refundRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = refundRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.customerId !== session.customerId && order.customerEmail !== session.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const refund = await createRefundRequest({
    customerId: session.customerId,
    orderId: parsed.data.orderId,
    reason: parsed.data.reason
  });

  return NextResponse.json({ refund }, { status: 201 });
}
