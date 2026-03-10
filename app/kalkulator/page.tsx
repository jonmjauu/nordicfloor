"use client";

import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrencyNOK, packagePrice } from "@/lib/utils";

interface ProductOption {
  id: number;
  name: string;
  slug: string;
  price: number;
  sqmPerPackage: string;
  images: string[];
}

export default function KalkulatorPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [area, setArea] = useState<number>(20);
  const [wastePercent, setWastePercent] = useState<number>(8);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        const list = data.products as ProductOption[];
        setProducts(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const selected = useMemo(() => products.find((product) => product.id === selectedId) ?? null, [products, selectedId]);

  const computed = useMemo(() => {
    if (!selected) return null;

    const sqmPerPackage = Number(selected.sqmPerPackage);
    const effectiveSqm = area * (1 + wastePercent / 100);
    const packages = Math.ceil(effectiveSqm / sqmPerPackage);
    const packageCost = packagePrice(selected.price, sqmPerPackage);
    const total = packages * packageCost;

    return {
      sqmPerPackage,
      effectiveSqm,
      packages,
      packageCost,
      total
    };
  }, [selected, area, wastePercent]);

  return (
    <section className="container-x py-12">
      <h1 className="text-3xl font-semibold text-nordic-900">Kalkulator</h1>
      <p className="mt-2 text-nordic-600">Beregn m²-behov, antall pakker og estimert materialkostnad.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="card grid gap-4 p-6">
          <label className="text-sm text-nordic-700">
            Produkt
            <select
              value={selectedId ?? undefined}
              onChange={(event) => setSelectedId(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-nordic-700">
            Romareal (m²)
            <input
              type="number"
              min={1}
              step="0.1"
              value={area}
              onChange={(event) => setArea(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-nordic-700">
            Svinn (%)
            <input
              type="number"
              min={5}
              max={10}
              value={wastePercent}
              onChange={(event) => setWastePercent(Number(event.target.value))}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>
        </div>

        <aside className="card p-6">
          <h2 className="text-lg font-semibold text-nordic-900">Resultat</h2>
          {computed && selected ? (
            <div className="mt-4 space-y-2 text-sm text-nordic-700">
              <p>
                Behov inkl. svinn: <span className="font-semibold">{computed.effectiveSqm.toFixed(2)} m²</span>
              </p>
              <p>
                Antall pakker: <span className="font-semibold">{computed.packages}</span>
              </p>
              <p>
                Pris per pakke: <span className="font-semibold">{formatCurrencyNOK(computed.packageCost)}</span>
              </p>
              <p className="pt-2 text-base font-semibold text-nordic-900">
                Estimert kostnad: {formatCurrencyNOK(computed.total)}
              </p>

              <div className="pt-3">
                <AddToCartButton
                  product={{
                    id: selected.id,
                    name: selected.name,
                    slug: selected.slug,
                    pricePerSqm: selected.price,
                    packagePrice: computed.packageCost,
                    image: selected.images[0] ?? "https://picsum.photos/seed/nordicfloor/900/700",
                    sqmPerPackage: computed.sqmPerPackage
                  }}
                  quantity={computed.packages}
                />
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-nordic-600">Laster produkter...</p>
          )}
        </aside>
      </div>
    </section>
  );
}
