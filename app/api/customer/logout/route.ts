import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE_NAME, customerCookieOptions } from "@/lib/customer-auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, "", {
    ...customerCookieOptions,
    maxAge: 0
  });

  return NextResponse.json({ ok: true });
}
