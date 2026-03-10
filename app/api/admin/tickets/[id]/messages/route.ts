import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addAdminTicketMessage } from "@/lib/db/queries";
import { ticketReplySchema } from "@/lib/validators";
import { formatZodError } from "@/lib/validation";
import { logInfo } from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const allowed = await isAdminAuthenticated();
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = ticketReplySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Ugyldig melding", ...formatZodError(parsed.error) }, { status: 400 });
  }

  const message = await addAdminTicketMessage(Number(id), parsed.data.message);

  logInfo("admin.ticket.reply", {
    ticketId: Number(id),
    messageId: message.id
  });

  return NextResponse.json({ message }, { status: 201 });
}
