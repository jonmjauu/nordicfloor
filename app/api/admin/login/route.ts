import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminSessionValue, ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";
import { env } from "@/lib/env";
import { adminLoginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSessionValue();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, adminCookieOptions);

  return NextResponse.json({ ok: true });
}
