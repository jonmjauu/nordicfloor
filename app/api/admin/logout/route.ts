import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    ...adminCookieOptions,
    maxAge: 0
  });

  return NextResponse.json({ ok: true });
}
