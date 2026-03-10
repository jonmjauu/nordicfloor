import { NextResponse } from "next/server";
import { attachStripeSession, createPendingOrder } from "@/lib/db/queries";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { order, lineItems } = await createPendingOrder(parsed.data);

  // Use Stripe-hosted checkout for easiest secure deployment on Vercel/Cloudflare.
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.customerEmail,
    metadata: {
      orderId: String(order.id)
    },
    line_items: lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "nok",
        unit_amount: item.unitPrice * 100,
        product_data: {
          name: item.product.name,
          description: item.product.description
        }
      }
    })),
    success_url: `${env.NEXT_PUBLIC_SITE_URL}/success?orderId=${order.id}`,
    cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/cancel?orderId=${order.id}`
  });

  await attachStripeSession(order.id, session.id);

  return NextResponse.json({
    checkoutUrl: session.url,
    orderId: order.id
  });
}
