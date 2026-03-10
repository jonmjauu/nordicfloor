import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createCustomer, getCustomerByEmail } from "@/lib/db/queries";
import { createCustomerSessionValue, CUSTOMER_COOKIE_NAME, customerCookieOptions } from "@/lib/customer-auth";
import { customerRegisterSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = customerRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getCustomerByEmail(parsed.data.email);
  if (existing) {
    return NextResponse.json({ error: "E-post er allerede registrert" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const customer = await createCustomer({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash
  });

  const sessionToken = await createCustomerSessionValue(customer.id, customer.email);
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, sessionToken, customerCookieOptions);

  return NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email } }, { status: 201 });
}
