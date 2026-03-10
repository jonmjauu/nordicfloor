import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrderById } from "@/lib/db/queries";
import { formatCurrencyNOK, formatDate } from "@/lib/utils";
import { AdminOrderStatusForm } from "@/components/admin-order-status-form";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const { id } = await params;
  const order = await getOrderById(Number(id));

  if (!order) {
    notFound();
  }

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Ordre #{order.id}</h1>
        <Link href="/admin/orders" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
          Tilbake til ordrer
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,340px]">
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-nordic-900">Shipping info</h2>
            <dl className="mt-3 grid gap-2 text-sm text-nordic-700">
              <div className="flex justify-between gap-3">
                <dt>Navn</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>E-post</dt>
                <dd>{order.customerEmail}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Telefon</dt>
                <dd>{order.customerPhone}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Adresse</dt>
                <dd className="text-right">{order.address}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Postnummer/by</dt>
                <dd>
                  {order.postalCode} {order.city}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Land</dt>
                <dd>{order.country}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-nordic-900">Linjeelementer</h2>
            <div className="mt-3 space-y-3 text-sm text-nordic-700">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 border-b border-nordic-100 pb-2">
                  <div>
                    <p className="font-medium text-nordic-900">{item.productName}</p>
                    <p>
                      {item.quantity} × {formatCurrencyNOK(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrencyNOK(item.lineTotal)}</p>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-semibold text-nordic-900">
                <p>Total</p>
                <p>{formatCurrencyNOK(order.total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5 text-sm text-nordic-700">
            <h2 className="text-lg font-semibold text-nordic-900">Betaling</h2>
            <p className="mt-2">Provider: {order.paymentProvider}</p>
            <p>Stripe session: {order.stripeSessionId ?? "-"}</p>
            <p>Stripe payment ID: {order.stripePaymentId ?? "-"}</p>
            <p>Status: {order.status}</p>
            <p>Opprettet: {formatDate(order.createdAt)}</p>
          </div>

          <AdminOrderStatusForm orderId={order.id} currentStatus={order.status as "pending" | "paid" | "cancelled" | "refunded"} />

          <div className="card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-nordic-700">Timeline</h3>
            <ul className="mt-3 space-y-2 text-sm text-nordic-700">
              {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 ? (
                order.statusHistory.map((entry, index) => (
                  <li key={index}>
                    <p className="font-medium text-nordic-900">{entry.status}</p>
                    <p className="text-xs text-nordic-500">{formatDate(entry.at)}</p>
                    <p>{entry.note}</p>
                  </li>
                ))
              ) : (
                <li>Ingen historikk enda.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
