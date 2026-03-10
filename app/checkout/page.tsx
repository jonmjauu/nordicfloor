"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatCurrencyNOK } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Handlekurven er tom.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        city: String(formData.get("city") ?? ""),
        country: String(formData.get("country") ?? "Norge")
      },
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    setLoading(true);

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error ?? "Noe gikk galt under checkout.");
      setLoading(false);
      return;
    }

    if (!json.checkoutUrl) {
      setError("Mangler checkout-url fra Stripe.");
      setLoading(false);
      return;
    }

    router.push(json.checkoutUrl);
  }

  return (
    <section className="container-x py-12">
      <h1 className="text-3xl font-semibold text-nordic-900">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <form className="card grid gap-4 p-6" onSubmit={onSubmit}>
          <h2 className="text-xl font-semibold text-nordic-900">Kontakt og levering</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-nordic-700">
              Navn
              <input required name="name" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
            <label className="text-sm text-nordic-700">
              E-post
              <input required type="email" name="email" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-nordic-700">
              Telefon
              <input required name="phone" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
            <label className="text-sm text-nordic-700">
              Adresse
              <input required name="address" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm text-nordic-700">
              Postnummer
              <input required name="postalCode" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
            <label className="text-sm text-nordic-700">
              By
              <input required name="city" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
            <label className="text-sm text-nordic-700">
              Land
              <input required defaultValue="Norge" name="country" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-nordic-800 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sender til Stripe..." : "Fortsett til betaling"}
          </button>
        </form>

        <aside className="card h-fit p-5">
          <h2 className="text-lg font-semibold text-nordic-900">Ordresammendrag</h2>
          <ul className="mt-3 space-y-2 text-sm text-nordic-700">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrencyNOK(item.packagePrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-nordic-100 pt-3 text-sm">
            <div className="flex justify-between font-semibold text-nordic-900">
              <span>Total</span>
              <span>{formatCurrencyNOK(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
