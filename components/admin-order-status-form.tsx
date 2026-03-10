"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "cancelled", "refunded"];

export function AdminOrderStatusForm({ orderId, currentStatus }: { orderId: number; currentStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
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

        const response = await fetch(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note })
        });

        if (!response.ok) {
          const json = await response.json().catch(() => ({}));
          setError(json.error ?? "Kunne ikke oppdatere status");
          setLoading(false);
          return;
        }

        setLoading(false);
        setNote("");
        router.refresh();
      }}
    >
      <p className="text-sm font-semibold text-nordic-900">Endre ordrestatust</p>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as OrderStatus)}
        className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
      >
        {ORDER_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={3}
        placeholder="Valgfri notat"
        className="rounded-xl border border-nordic-200 px-3 py-2 text-sm"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {loading ? "Lagrer..." : "Oppdater"}
      </button>
    </form>
  );
}
