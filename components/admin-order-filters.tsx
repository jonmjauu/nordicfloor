"use client";

import { useMemo, useState } from "react";
import { formatCurrencyNOK, formatDate } from "@/lib/utils";

type OrderRow = {
  id: number;
  createdAt: string;
  customerName: string;
  total: number;
  status: string;
  paymentProvider: string;
};

export function AdminOrderFilters({ orders }: { orders: OrderRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        q.length === 0 ||
        String(order.id).includes(q) ||
        order.customerName.toLowerCase().includes(q);
      const matchStatus = status === "all" || order.status === status;
      return matchQuery && matchStatus;
    });
  }, [orders, query, status]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            placeholder="Søk ordre-id eller kunde"
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
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="cancelled">cancelled</option>
            <option value="refunded">refunded</option>
          </select>
          <p className="self-center text-sm text-nordic-600">Viser {filtered.length} av {orders.length} ordrer</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nordic-100 bg-nordic-50 text-nordic-700">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Dato</th>
              <th className="px-4 py-3">Kunde</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Betaling</th>
              <th className="px-4 py-3">Handling</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">#{order.id}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{formatCurrencyNOK(order.total)}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3">{order.paymentProvider}</td>
                <td className="px-4 py-3">
                  <a href={`/admin/orders/${order.id}`} className="underline">
                    Vis detaljer
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
