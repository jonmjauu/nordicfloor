import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProductsForAdmin } from "@/lib/db/queries";
import { AdminProductTable } from "@/components/admin-product-table";

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

      <div className="mt-6">
        <AdminProductTable
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            category: { name: product.category.name },
            price: product.price,
            active: product.active,
            images: product.images
          }))}
        />
      </div>
    </section>
  );
}
