import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listSupportTicketsForAdmin } from "@/lib/db/queries";
import { AdminTicketFilters } from "@/components/admin-ticket-filters";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const tickets = await listSupportTicketsForAdmin();

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Tickets</h1>
        <Link href="/admin" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
          Til admin
        </Link>
      </div>

      <div className="mt-6">
        <AdminTicketFilters
          tickets={tickets.map((ticket) => ({
            id: ticket.id,
            customer: { name: ticket.customer.name },
            subject: ticket.subject,
            status: ticket.status,
            updatedAt: String(ticket.updatedAt)
          }))}
        />
      </div>
    </section>
  );
}
