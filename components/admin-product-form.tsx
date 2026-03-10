"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: number;
  categories: Array<{ id: number; name: string }>;
  defaultValues?: {
    name: string;
    slug: string;
    categoryId: number;
    description: string;
    price: number;
    dimensions: string;
    sqmPerPackage: number;
    stock: number;
    images: string[];
    featured: boolean;
    active: boolean;
  };
};

export function AdminProductForm({ mode, productId, categories, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = useMemo(
    () =>
      defaultValues ?? {
        name: "",
        slug: "",
        categoryId: categories[0]?.id ?? 1,
        description: "",
        price: 0,
        dimensions: "",
        sqmPerPackage: 2.0,
        stock: 0,
        images: ["https://picsum.photos/seed/nordicfloor/900/700"],
        featured: false,
        active: true
      },
    [defaultValues, categories]
  );

  const [form, setForm] = useState(initial);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "create" ? "/api/products" : `/api/products/${productId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images.filter(Boolean)
      })
    });

    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      setError(json.error ?? "Kunne ikke lagre produktet");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  }

  async function removeProduct() {
    if (!productId) return;
    if (!confirm("Slette produktet?")) return;

    setLoading(true);
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE"
    });

    setLoading(false);

    if (!response.ok) {
      setError("Kunne ikke slette produktet");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6">
      <h1 className="text-2xl font-semibold text-nordic-900">
        {mode === "create" ? "Nytt produkt" : "Rediger produkt"}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-nordic-700">
          Navn
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-nordic-700">
          Slug
          <input
            required
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="text-sm text-nordic-700">
        Kategori
        <select
          value={form.categoryId}
          onChange={(event) => setForm((prev) => ({ ...prev, categoryId: Number(event.target.value) }))}
          className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-nordic-700">
        Beskrivelse
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="text-sm text-nordic-700">
          Pris (NOK/m²)
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-nordic-700">
          Dimensjoner
          <input
            required
            value={form.dimensions}
            onChange={(event) => setForm((prev) => ({ ...prev, dimensions: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-nordic-700">
          m² / pakke
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.sqmPerPackage}
            onChange={(event) => setForm((prev) => ({ ...prev, sqmPerPackage: Number(event.target.value) }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-nordic-700">
          Lager (pakker)
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
            className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
          />
        </label>
      </div>

      <label className="text-sm text-nordic-700">
        Bilde-URLer (én per linje)
        <textarea
          rows={4}
          value={form.images.join("\n")}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              images: event.target.value.split("\n").map((line) => line.trim())
            }))
          }
          className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
        />
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-nordic-700">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-nordic-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
          />
          Aktiv
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-nordic-800 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Lagrer..." : "Lagre"}
        </button>

        {mode === "edit" ? (
          <button
            type="button"
            onClick={removeProduct}
            disabled={loading}
            className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700"
          >
            Slett produkt
          </button>
        ) : null}
      </div>
    </form>
  );
}
