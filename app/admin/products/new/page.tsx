import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCategories } from "@/lib/db/queries";
import { AdminProductForm } from "@/components/admin-product-form";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const categories = await getCategories();

  return (
    <section className="container-x py-12">
      <div className="mb-4">
        <Link href="/admin/products" className="text-sm text-nordic-700 underline">
          ← Tilbake
        </Link>
      </div>
      <AdminProductForm mode="create" categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </section>
  );
}
