import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/db/queries";
import { formatCurrencyNOK, packagePrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) {
    notFound();
  }

  const image = product.images[0] ?? "https://picsum.photos/seed/nordicfloor-product/1200/800";

  return (
    <section className="container-x py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card relative h-[440px] overflow-hidden">
          <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>

        <div className="space-y-5">
          <p className="text-sm uppercase tracking-wide text-nordic-500">{product.category.name}</p>
          <h1 className="text-4xl font-semibold text-nordic-900">{product.name}</h1>
          <p className="leading-relaxed text-nordic-600">{product.description}</p>

          <div className="card grid gap-4 p-5 text-sm text-nordic-700 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-nordic-500">Pris per m²</p>
              <p className="mt-1 text-lg font-semibold text-nordic-900">{formatCurrencyNOK(product.price)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-nordic-500">M² per pakke</p>
              <p className="mt-1 text-lg font-semibold text-nordic-900">{product.sqmPerPackage} m²</p>
            </div>
            <div>
              <p className="text-xs uppercase text-nordic-500">Dimensjoner</p>
              <p className="mt-1">{product.dimensions}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-nordic-500">Lager</p>
              <p className="mt-1">{product.stock} pakker</p>
            </div>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              pricePerSqm: product.price,
              packagePrice: packagePrice(product.price, Number(product.sqmPerPackage)),
              image,
              sqmPerPackage: Number(product.sqmPerPackage)
            }}
          />
        </div>
      </div>
    </section>
  );
}
