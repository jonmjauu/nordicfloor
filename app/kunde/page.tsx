"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatCurrencyNOK, formatDate } from "@/lib/utils";

type CustomerData = {
  customer: { id: number; name: string; email: string };
  orders: Array<{
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{ id: number; productName: string; quantity: number; unitPrice: number }>;
  }>;
  refunds: Array<{
    id: number;
    orderId: number;
    status: string;
    reason: string;
    createdAt: string;
  }>;
  tickets: Array<{
    id: number;
    orderId: number | null;
    subject: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    messages: Array<{ id: number; authorRole: string; message: string; createdAt: string }>;
  }>;
};

export default function CustomerDashboardPage() {
  const [data, setData] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [refundOrderId, setRefundOrderId] = useState<number | "">("");
  const [refundReason, setRefundReason] = useState("");
  const [ticketOrderId, setTicketOrderId] = useState<number | "">("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [replyTextByTicket, setReplyTextByTicket] = useState<Record<number, string>>({});

  async function reload() {
    setLoading(true);
    const response = await fetch("/api/customer/me");

    if (!response.ok) {
      setError("Du må være logget inn for å se denne siden.");
      setData(null);
      setLoading(false);
      return;
    }

    const json = (await response.json()) as CustomerData;
    setData(json);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const paidOrders = useMemo(() => data?.orders.filter((order) => order.status === "paid") ?? [], [data]);

  async function submitRefund(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!refundOrderId) return;

    const response = await fetch("/api/customer/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: Number(refundOrderId), reason: refundReason })
    });

    if (!response.ok) {
      alert("Kunne ikke sende refusjonsforespørsel.");
      return;
    }

    setRefundOrderId("");
    setRefundReason("");
    await reload();
  }

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: { orderId?: number; subject: string; message: string } = {
      subject: ticketSubject,
      message: ticketMessage
    };

    if (ticketOrderId) payload.orderId = Number(ticketOrderId);

    const response = await fetch("/api/customer/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert("Kunne ikke opprette ticket.");
      return;
    }

    setTicketOrderId("");
    setTicketSubject("");
    setTicketMessage("");
    await reload();
  }

  async function sendReply(ticketId: number) {
    const text = replyTextByTicket[ticketId]?.trim();
    if (!text) return;

    const response = await fetch(`/api/customer/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      alert("Kunne ikke sende melding.");
      return;
    }

    setReplyTextByTicket((prev) => ({ ...prev, [ticketId]: "" }));
    await reload();
  }

  if (loading) {
    return (
      <section className="container-x py-12">
        <p className="text-nordic-600">Laster kundeside...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="container-x py-12">
        <div className="card max-w-xl p-6">
          <p className="text-nordic-700">{error ?? "Ukjent feil"}</p>
          <Link href="/kunde/login" className="mt-4 inline-block rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white">
            Gå til innlogging
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-nordic-900">Hei, {data.customer.name}</h1>
        <p className="text-sm text-nordic-600">{data.customer.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-semibold text-nordic-900">Mine ordrer</h2>
          <div className="mt-4 space-y-3 text-sm">
            {data.orders.length === 0 ? (
              <p className="text-nordic-600">Ingen ordrer enda.</p>
            ) : (
              data.orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-nordic-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-nordic-900">Ordre #{order.id}</p>
                    <p className="text-xs uppercase text-nordic-500">{order.status}</p>
                  </div>
                  <p className="text-nordic-600">{formatDate(order.createdAt)}</p>
                  <p className="mt-1 font-medium text-nordic-800">{formatCurrencyNOK(order.total)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={submitRefund} className="card grid gap-3 p-5">
          <h2 className="text-xl font-semibold text-nordic-900">Be om refusjon</h2>
          <label className="text-sm text-nordic-700">
            Velg betalt ordre
            <select
              required
              value={refundOrderId}
              onChange={(event) => setRefundOrderId(event.target.value ? Number(event.target.value) : "")}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            >
              <option value="">Velg ordre</option>
              {paidOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} — {formatCurrencyNOK(order.total)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-nordic-700">
            Årsak
            <textarea
              required
              rows={4}
              value={refundReason}
              onChange={(event) => setRefundReason(event.target.value)}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          <button type="submit" className="rounded-full bg-nordic-800 px-4 py-2.5 text-sm font-semibold text-white">
            Send forespørsel
          </button>

          {data.refunds.length > 0 ? (
            <div className="mt-3 space-y-2 text-sm text-nordic-700">
              <p className="font-semibold text-nordic-900">Tidligere refusjoner</p>
              {data.refunds.map((refund) => (
                <div key={refund.id} className="rounded-lg border border-nordic-100 p-2">
                  <p>
                    Refusjon #{refund.id} · ordre #{refund.orderId}
                  </p>
                  <p className="text-xs uppercase text-nordic-500">{refund.status}</p>
                </div>
              ))}
            </div>
          ) : null}
        </form>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={submitTicket} className="card grid gap-3 p-5">
          <h2 className="text-xl font-semibold text-nordic-900">Nytt support ticket</h2>

          <label className="text-sm text-nordic-700">
            Relatert ordre (valgfritt)
            <select
              value={ticketOrderId}
              onChange={(event) => setTicketOrderId(event.target.value ? Number(event.target.value) : "")}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            >
              <option value="">Ingen</option>
              {data.orders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-nordic-700">
            Emne
            <input
              required
              value={ticketSubject}
              onChange={(event) => setTicketSubject(event.target.value)}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-nordic-700">
            Melding
            <textarea
              required
              rows={4}
              value={ticketMessage}
              onChange={(event) => setTicketMessage(event.target.value)}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          <button type="submit" className="rounded-full bg-nordic-800 px-4 py-2.5 text-sm font-semibold text-white">
            Opprett ticket
          </button>
        </form>

        <div className="card p-5">
          <h2 className="text-xl font-semibold text-nordic-900">Mine tickets</h2>
          <div className="mt-4 space-y-4">
            {data.tickets.length === 0 ? (
              <p className="text-sm text-nordic-600">Ingen tickets enda.</p>
            ) : (
              data.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-nordic-100 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-nordic-900">#{ticket.id} · {ticket.subject}</p>
                    <p className="text-xs uppercase text-nordic-500">{ticket.status}</p>
                  </div>
                  <p className="text-xs text-nordic-500">Oppdatert {formatDate(ticket.updatedAt)}</p>

                  <div className="mt-3 space-y-2 rounded-lg bg-nordic-50 p-2">
                    {ticket.messages.map((message) => (
                      <div key={message.id} className="text-xs text-nordic-700">
                        <p className="font-semibold">{message.authorRole}</p>
                        <p>{message.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={replyTextByTicket[ticket.id] ?? ""}
                      onChange={(event) =>
                        setReplyTextByTicket((prev) => ({ ...prev, [ticket.id]: event.target.value }))
                      }
                      placeholder="Skriv svar..."
                      className="flex-1 rounded-xl border border-nordic-200 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => sendReply(ticket.id)}
                      className="rounded-full border border-nordic-200 px-3 py-2 text-xs font-semibold text-nordic-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
