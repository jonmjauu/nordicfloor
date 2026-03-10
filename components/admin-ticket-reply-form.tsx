"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminTicketReplyForm({ ticketId }: { ticketId: number }) {
  const [message, setMessage] = useState("");
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

        const response = await fetch(`/api/admin/tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          setError(json.error ?? "Kunne ikke sende svar");
          setLoading(false);
          return;
        }

        setMessage("");
        setLoading(false);
        router.refresh();
      }}
    >
      <p className="text-sm font-semibold text-nordic-900">Svar til kunde</p>
      <textarea
        required
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
        placeholder="Skriv svar..."
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {loading ? "Sender..." : "Send svar"}
      </button>
    </form>
  );
}
