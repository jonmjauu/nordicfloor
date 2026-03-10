"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCurrencyNOK } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <section className="container-x py-12">
      <h1 className="text-3xl font-semibold text-nordic-900">Handlekurv</h1>

      {items.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="text-nordic-600">Handlekurven er tom.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white">
            Gå til produkter
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.productId} className="card flex gap-4 p-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-nordic-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-nordic-900">{item.name}</p>
                  <p className="text-sm text-nordic-600">{formatCurrencyNOK(item.pricePerSqm)} / m²</p>
                  <p className="text-xs text-nordic-500">Pakkepris: {formatCurrencyNOK(item.packagePrice)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <label htmlFor={`qty-${item.productId}`} className="text-sm text-nordic-600">
                      Antall pakker
                    </label>
                    <input
                      id={`qty-${item.productId}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                      className="w-20 rounded-lg border border-nordic-200 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Fjern
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="card h-fit p-5">
            <h2 className="text-lg font-semibold text-nordic-900">Oppsummering</h2>
            <dl className="mt-4 space-y-2 text-sm text-nordic-700">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrencyNOK(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Frakt</dt>
                <dd>{formatCurrencyNOK(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-nordic-100 pt-2 font-semibold text-nordic-900">
                <dt>Total</dt>
                <dd>{formatCurrencyNOK(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="mt-5 inline-block w-full rounded-full bg-nordic-800 px-4 py-2.5 text-center text-sm font-semibold text-white">
              Gå til checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
