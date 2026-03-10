import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listSupportTicketsForAdmin } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await listSupportTicketsForAdmin();
  return NextResponse.json({ tickets });
}
