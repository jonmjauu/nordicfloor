import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProductsForAdmin } from "@/lib/db/queries";
import { formatCurrencyNOK } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const products = await getProductsForAdmin();

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-nordic-900">Produkter</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700">
            Til admin
          </Link>
          <Link href="/admin/products/new" className="rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white">
            Nytt produkt
          </Link>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nordic-100 bg-nordic-50 text-nordic-700">
            <tr>
              <th className="px-4 py-3">Navn</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Pris</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Handling</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">{formatCurrencyNOK(product.price)}/m²</td>
                <td className="px-4 py-3">{product.active ? "Aktiv" : "Inaktiv"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="underline">
                    Rediger
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
