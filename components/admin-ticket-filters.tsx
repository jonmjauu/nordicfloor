"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";

type TicketRow = {
  id: number;
  customer: { name: string };
  subject: string;
  status: string;
  updatedAt: string;
};

export function AdminTicketFilters({ tickets }: { tickets: TicketRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return tickets.filter((ticket) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        q.length === 0 ||
        String(ticket.id).includes(q) ||
        ticket.customer.name.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q);
      const matchStatus = status === "all" || ticket.status === status;
      return matchQuery && matchStatus;
    });
  }, [tickets, query, status]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            placeholder="Søk ticket-id, kunde eller emne"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
          >
            <option value="all">Alle statuser</option>
            <option value="open">open</option>
            <option value="pending">pending</option>
            <option value="closed">closed</option>
          </select>
          <p className="self-center text-sm text-nordic-600">Viser {filtered.length} av {tickets.length} tickets</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
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
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">#{ticket.id}</td>
                <td className="px-4 py-3">{ticket.customer.name}</td>
                <td className="px-4 py-3">{ticket.subject}</td>
                <td className="px-4 py-3">{ticket.status}</td>
                <td className="px-4 py-3">{formatDate(ticket.updatedAt)}</td>
                <td className="px-4 py-3">
                  <a href={`/admin/tickets/${ticket.id}`} className="underline">
                    Åpne
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
