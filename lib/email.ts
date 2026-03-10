export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: number;
  customerName: string;
  total: number;
}) {
  // Placeholder: replace with real provider (Resend, Postmark, SES, etc.)
  console.log("[email placeholder] order confirmation", params);
}
