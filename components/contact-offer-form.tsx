"use client";

import { useState } from "react";
import { PROJECT_TYPES } from "@/lib/constants";

export function ContactOfferForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <form
      className="card grid gap-4 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("success");
      }}
    >
      <h3 className="text-xl font-semibold text-nordic-900">Få et uforpliktende tilbud</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-nordic-700">
          Navn
          <input required name="name" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
        <label className="text-sm text-nordic-700">
          E-post
          <input type="email" required name="email" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-nordic-700">
          Telefon
          <input name="phone" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
        <label className="text-sm text-nordic-700">
          Postnummer/sted
          <input name="place" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
      </div>

      <label className="text-sm text-nordic-700">
        Type prosjekt
        <select name="projectType" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2">
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-nordic-700">
          Ønsket kolleksjon / produkt
          <input name="product" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
        <label className="text-sm text-nordic-700">
          Areal (m²)
          <input name="area" type="number" min="0" step="0.1" className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
        </label>
      </div>

      <label className="text-sm text-nordic-700">
        Melding
        <textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2" />
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-nordic-700">
        <input type="checkbox" name="sample" className="rounded border-nordic-300" />
        Jeg ønsker gratis vareprøve
      </label>

      <button type="submit" className="rounded-full bg-nordic-800 px-5 py-2.5 font-semibold text-white hover:bg-nordic-700">
        Send forespørsel
      </button>

      {status === "success" ? (
        <p className="text-sm text-green-700">Takk! Vi tar kontakt med deg innen kort tid.</p>
      ) : null}
    </form>
  );
}
