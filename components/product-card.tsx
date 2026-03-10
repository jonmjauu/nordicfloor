import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { formatCurrencyNOK, packagePrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    dimensions: string;
    sqmPerPackage: string;
    images: string[];
    category?: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0] ?? "https://picsum.photos/seed/nordicfloor/900/700";

  return (
    <article className="card overflow-hidden">
      <div className="relative h-48 bg-nordic-100">
        <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-nordic-500">{product.category?.name ?? "Kolleksjon"}</p>
          <h3 className="mt-1 text-lg font-semibold text-nordic-900">{product.name}</h3>
          <p className="mt-1 text-sm text-nordic-600">{product.description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm text-nordic-700">
          <div>
            <dt className="text-xs uppercase text-nordic-500">Pris</dt>
            <dd className="font-semibold">{formatCurrencyNOK(product.price)}/m²</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-nordic-500">Format</dt>
            <dd>{product.dimensions}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-nordic-500">Pakke</dt>
            <dd>{product.sqmPerPackage} m²</dd>
          </div>
        </dl>
        <div className="flex items-center gap-2">
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
          <Link
            href={`/produkter/${product.slug}`}
            className="rounded-full border border-nordic-200 px-4 py-2 text-sm font-semibold text-nordic-700 hover:bg-nordic-50"
          >
            Detaljer
          </Link>
        </div>
      </div>
    </article>
  );
}
