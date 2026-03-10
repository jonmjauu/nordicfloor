import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupportTicketByIdForAdmin } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { AdminTicketReplyForm } from "@/components/admin-ticket-reply-form";
import { AdminTicketStatusForm } from "@/components/admin-ticket-status-form";

export const dynamic = "force-dynamic";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const { id } = await params;
  const ticket = await getSupportTicketByIdForAdmin(Number(id));

  if (!ticket) {
    notFound();
  }

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Ticket #{ticket.id}</h1>
        <Link href="/admin/tickets" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
          Til tickets
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,340px]">
        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm text-nordic-500">Kunde</p>
            <p className="font-semibold text-nordic-900">{ticket.customer.name}</p>
            <p className="text-sm text-nordic-600">{ticket.customer.email}</p>
            <p className="mt-2 text-sm text-nordic-600">Emne: {ticket.subject}</p>
            <p className="text-xs text-nordic-500">Oppdatert: {formatDate(ticket.updatedAt)}</p>
          </div>

          <div className="space-y-3" role="log" aria-live="polite" aria-label="Ticket samtale">
            {ticket.messages.map((message) => (
              <div key={message.id} className="rounded-xl border border-nordic-100 p-3">
                <p className="text-xs uppercase tracking-wide text-nordic-500">{message.authorRole}</p>
                <p className="mt-1 text-sm text-nordic-700">{message.message}</p>
                <p className="mt-1 text-xs text-nordic-500">{formatDate(message.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AdminTicketStatusForm
            ticketId={ticket.id}
            currentStatus={ticket.status as "open" | "pending" | "closed"}
          />
          <AdminTicketReplyForm ticketId={ticket.id} />
        </div>
      </div>
    </section>
  );
}
