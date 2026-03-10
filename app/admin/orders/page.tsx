import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listOrders } from "@/lib/db/queries";
import { formatCurrencyNOK, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const orders = await listOrders();

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Ordrer</h1>
        <Link href="/admin" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
          Tilbake til admin
        </Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">#{order.id}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{formatCurrencyNOK(order.total)}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3">{order.paymentProvider}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-nordic-800 underline">
                    Vis detaljer
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
