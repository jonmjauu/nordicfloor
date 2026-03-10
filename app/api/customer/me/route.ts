import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerById, listOrdersByCustomer, listRefundRequestsByCustomer, listSupportTicketsByCustomer } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await getCustomerById(session.customerId);
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, refunds, tickets] = await Promise.all([
    listOrdersByCustomer(customer.id, customer.email),
    listRefundRequestsByCustomer(customer.id),
    listSupportTicketsByCustomer(customer.id)
  ]);

  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email
    },
    orders,
    refunds,
    tickets
  }, {
    headers: {
      "Cache-Control": "private, no-store"
    }
  });
}
