import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listOrders } from "@/lib/db/queries";
import { AdminOrderFilters } from "@/components/admin-order-filters";

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

      <div className="mt-6">
        <AdminOrderFilters
          orders={orders.map((order) => ({
            id: order.id,
            createdAt: String(order.createdAt),
            customerName: order.customerName,
            total: order.total,
            status: order.status,
            paymentProvider: order.paymentProvider
          }))}
        />
      </div>
    </section>
  );
}
