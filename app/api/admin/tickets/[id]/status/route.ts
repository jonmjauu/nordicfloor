import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateSupportTicketStatus } from "@/lib/db/queries";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["open", "pending", "closed"])
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const ticket = await updateSupportTicketStatus(Number(id), parsed.data.status);
  return NextResponse.json({ ticket });
}
