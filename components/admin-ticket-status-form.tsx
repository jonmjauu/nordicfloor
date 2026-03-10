"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TicketStatus = "open" | "pending" | "closed";

export function AdminTicketStatusForm({
  ticketId,
  currentStatus
}: {
  ticketId: number;
  currentStatus: TicketStatus;
}) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      className="card grid gap-3 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          setError(json.error ?? "Kunne ikke oppdatere status");
          setLoading(false);
          return;
        }

        setLoading(false);
        router.refresh();
      }}
    >
      <p className="text-sm font-semibold text-nordic-900">Ticket status</p>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as TicketStatus)}
        className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
      >
        <option value="open">open</option>
        <option value="pending">pending</option>
        <option value="closed">closed</option>
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full border border-nordic-200 px-4 py-2 text-sm font-semibold text-nordic-700 disabled:opacity-70"
      >
        {loading ? "Lagrer..." : "Lagre status"}
      </button>
    </form>
  );
}
