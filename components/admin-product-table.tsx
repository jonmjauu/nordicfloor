"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatCurrencyNOK } from "@/lib/utils";

type ProductRow = {
  id: number;
  name: string;
  category: { name: string };
  price: number;
  active: boolean;
  images: string[];
};

export function AdminProductTable({ products }: { products: ProductRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.category.name.toLowerCase().includes(q) ||
        String(product.id).includes(q)
      );
    });
  }, [products, query]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          placeholder="Søk produktnavn, kategori eller id"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-nordic-200 px-3 py-2 text-sm md:w-96"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nordic-100 bg-nordic-50 text-nordic-700">
            <tr>
              <th className="px-4 py-3">Bilde</th>
              <th className="px-4 py-3">Navn</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Pris</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Handling</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-nordic-100 text-nordic-700">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-nordic-100">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">{formatCurrencyNOK(product.price)}/m²</td>
                <td className="px-4 py-3">{product.active ? "Aktiv" : "Inaktiv"}</td>
                <td className="px-4 py-3">
                  <a href={`/admin/products/${product.id}`} className="underline">
                    Rediger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
