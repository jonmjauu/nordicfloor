import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { createRefundRequest, getOrderById } from "@/lib/db/queries";
import { refundRequestSchema } from "@/lib/validators";
import { formatZodError } from "@/lib/validation";
import { logInfo } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Du må logge inn for å sende refusjonsforespørsel." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = refundRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ugyldig refusjonsdata", ...formatZodError(parsed.error) }, { status: 400 });
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order) {
    return NextResponse.json({ error: "Ordren ble ikke funnet." }, { status: 404 });
  }

  if (order.customerId !== session.customerId && order.customerEmail !== session.email) {
    return NextResponse.json({ error: "Du har ikke tilgang til denne ordren." }, { status: 403 });
  }

  const refund = await createRefundRequest({
    customerId: session.customerId,
    orderId: parsed.data.orderId,
    reason: parsed.data.reason
  });

  logInfo("customer.refund.requested", {
    customerId: session.customerId,
    orderId: parsed.data.orderId,
    refundId: refund.id
  });

  return NextResponse.json({ refund }, { status: 201 });
}
