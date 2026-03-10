import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { createSupportTicket, getOrderById } from "@/lib/db/queries";
import { ticketCreateSchema } from "@/lib/validators";
import { formatZodError } from "@/lib/validation";
import { logInfo } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Du må logge inn for å opprette ticket." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ticketCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ugyldig ticket-data", ...formatZodError(parsed.error) }, { status: 400 });
  }

  if (parsed.data.orderId) {
    const order = await getOrderById(parsed.data.orderId);
    if (!order) {
      return NextResponse.json({ error: "Ordren ble ikke funnet." }, { status: 404 });
    }

    if (order.customerId !== session.customerId && order.customerEmail !== session.email) {
      return NextResponse.json({ error: "Du har ikke tilgang til denne ordren." }, { status: 403 });
    }
  }

  const ticket = await createSupportTicket({
    customerId: session.customerId,
    orderId: parsed.data.orderId,
    subject: parsed.data.subject,
    message: parsed.data.message
  });

  logInfo("customer.ticket.created", {
    customerId: session.customerId,
    ticketId: ticket.id,
    orderId: ticket.orderId
  });

  return NextResponse.json({ ticket }, { status: 201 });
}
