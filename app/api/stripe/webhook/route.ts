import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getOrderByStripeSession, setOrderStripePaymentIntent, updateOrderStatus } from "@/lib/db/queries";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid Stripe signature", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await getOrderByStripeSession(session.id);

    if (order) {
      if (typeof session.payment_intent === "string") {
        await setOrderStripePaymentIntent(order.id, session.payment_intent);
      }

      await updateOrderStatus(order.id, "paid", "Payment received via Stripe Checkout", session.payment_intent as string | undefined);

      await sendOrderConfirmationEmail({
        to: order.customerEmail,
        orderId: order.id,
        customerName: order.customerName,
        total: order.total
      });
    }
  }

  return NextResponse.json({ received: true });
}
