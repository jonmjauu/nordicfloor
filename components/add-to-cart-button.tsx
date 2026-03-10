"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

interface Props {
  product: {
    id: number;
    name: string;
    slug: string;
    pricePerSqm: number;
    packagePrice: number;
    image: string;
    sqmPerPackage: number;
  };
  quantity?: number;
  className?: string;
}

export function AddToCartButton({ product, quantity = 1, className }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            pricePerSqm: product.pricePerSqm,
            packagePrice: product.packagePrice,
            image: product.image,
            sqmPerPackage: product.sqmPerPackage
          },
          quantity
        );

        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={
        className ??
        "rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white hover:bg-nordic-700"
      }
    >
      {added ? "Lagt til" : "Legg i handlekurv"}
    </button>
  );
}
