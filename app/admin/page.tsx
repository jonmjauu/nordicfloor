import { redirect } from "next/navigation";
import { getAdminSummary } from "@/lib/db/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { formatCurrencyNOK } from "@/lib/utils";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <section className="container-x py-12">
        <div className="mx-auto max-w-md">
          <AdminLoginForm />
        </div>
      </section>
    );
  }

  const summary = await getAdminSummary(30);

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Admin dashboard</h1>
        <div className="flex items-center gap-2">
          <a href="/admin/orders" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
            Ordrer
          </a>
          <a href="/admin/products" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
            Produkter
          </a>
          <a href="/admin/tickets" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
            Tickets
          </a>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-nordic-500">Totale ordrer</p>
          <p className="mt-2 text-2xl font-semibold text-nordic-900">{summary.totalOrders ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-nordic-500">Betalte</p>
          <p className="mt-2 text-2xl font-semibold text-nordic-900">{summary.paidOrders ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-nordic-500">Ubetalte</p>
          <p className="mt-2 text-2xl font-semibold text-nordic-900">{summary.unpaidOrders ?? 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-nordic-500">Omsetning (30 dager)</p>
          <p className="mt-2 text-2xl font-semibold text-nordic-900">{formatCurrencyNOK(summary.revenue ?? 0)}</p>
        </div>
      </div>
    </section>
  );
}
