import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCategories, getProductById } from "@/lib/db/queries";
import { AdminProductForm } from "@/components/admin-product-form";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin");
  }

  const { id } = await params;

  const [categories, product] = await Promise.all([getCategories(), getProductById(Number(id))]);

  if (!product) {
    notFound();
  }

  return (
    <section className="container-x py-12">
      <div className="mb-4">
        <Link href="/admin/products" className="text-sm text-nordic-700 underline">
          ← Tilbake
        </Link>
      </div>

      <AdminProductForm
        mode="edit"
        productId={product.id}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          description: product.description,
          price: product.price,
          dimensions: product.dimensions,
          sqmPerPackage: Number(product.sqmPerPackage),
          stock: product.stock,
          images: product.images,
          featured: product.featured,
          active: product.active
        }}
      />
    </section>
  );
}
