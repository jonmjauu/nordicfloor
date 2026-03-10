"use client";

import { useState } from "react";
import { formatCurrencyNOK, formatDate } from "@/lib/utils";

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export function CustomerOrderDetailModal({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 rounded-full border border-nordic-200 px-3 py-1 text-xs font-semibold text-nordic-700"
      >
        Se detaljer
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Ordredetaljer for ordre ${order.id}`}
        >
          <div className="card max-h-[85vh] w-full max-w-2xl overflow-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-nordic-900">Ordre #{order.id}</h3>
                <p className="text-sm text-nordic-600">{formatDate(order.createdAt)}</p>
                <p className="text-xs uppercase text-nordic-500">{order.status}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-nordic-200 px-3 py-1 text-sm text-nordic-700"
                aria-label="Lukk ordredetaljer"
              >
                Lukk
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-nordic-700">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-nordic-100 p-3">
                  <p className="font-medium text-nordic-900">{item.productName}</p>
                  <p>
                    {item.quantity} × {formatCurrencyNOK(item.unitPrice)}
                  </p>
                  <p className="font-semibold text-nordic-900">{formatCurrencyNOK(item.quantity * item.unitPrice)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-nordic-100 pt-3 text-right">
              <p className="text-sm text-nordic-600">Total</p>
              <p className="text-xl font-semibold text-nordic-900">{formatCurrencyNOK(order.total)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
