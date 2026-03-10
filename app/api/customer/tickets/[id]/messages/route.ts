import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { addTicketMessage, getSupportTicketForCustomer } from "@/lib/db/queries";
import { ticketReplySchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await getSupportTicketForCustomer(Number(id), session.customerId);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = ticketReplySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const message = await addTicketMessage({
    ticketId: ticket.id,
    customerId: session.customerId,
    authorRole: "customer",
    message: parsed.data.message
  });

  return NextResponse.json({ message }, { status: 201 });
}
