import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCustomerByEmail } from "@/lib/db/queries";
import { createCustomerSessionValue, CUSTOMER_COOKIE_NAME, customerCookieOptions } from "@/lib/customer-auth";
import { customerLoginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = customerLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await getCustomerByEmail(parsed.data.email);
  if (!customer) {
    return NextResponse.json({ error: "Ugyldig e-post eller passord" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, customer.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Ugyldig e-post eller passord" }, { status: 401 });
  }

  const sessionToken = await createCustomerSessionValue(customer.id, customer.email);
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, sessionToken, customerCookieOptions);

  return NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email } });
}
