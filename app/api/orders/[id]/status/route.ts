import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { orderStatusSchema } from "@/lib/validators";
import { updateOrderStatus } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await updateOrderStatus(
    Number(id),
    parsed.data.status,
    parsed.data.note ?? `Status changed to ${parsed.data.status}`
  );

  return NextResponse.json({ order: updated });
}
