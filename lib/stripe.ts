import Stripe from "stripe";

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia"
  });
}
