import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { createSupportTicket, getOrderById } from "@/lib/db/queries";
import { ticketCreateSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ticketCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.orderId) {
    const order = await getOrderById(parsed.data.orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.customerId !== session.customerId && order.customerEmail !== session.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const ticket = await createSupportTicket({
    customerId: session.customerId,
    orderId: parsed.data.orderId,
    subject: parsed.data.subject,
    message: parsed.data.message
  });

  return NextResponse.json({ ticket }, { status: 201 });
}
