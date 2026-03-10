import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listSupportTicketsForAdmin } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";

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

      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nordic-100 bg-nordic-50 text-nordic-700">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Kunde</th>
              <th className="px-4 py-3">Emne</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Oppdatert</th>
              <th className="px-4 py-3">Handling</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">#{ticket.id}</td>
                <td className="px-4 py-3">{ticket.customer.name}</td>
                <td className="px-4 py-3">{ticket.subject}</td>
                <td className="px-4 py-3">{ticket.status}</td>
                <td className="px-4 py-3">{formatDate(ticket.updatedAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/tickets/${ticket.id}`} className="underline">
                    Åpne
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
