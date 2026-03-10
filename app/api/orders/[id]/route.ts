import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrderById(Number(id));

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
