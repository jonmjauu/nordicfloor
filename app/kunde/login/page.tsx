"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(json.error ?? "Innlogging feilet");
      setLoading(false);
      return;
    }

    router.push("/kunde");
    router.refresh();
  }

  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-md">
        <form onSubmit={onSubmit} className="card grid gap-4 p-6">
          <h1 className="text-2xl font-semibold text-nordic-900">Logg inn</h1>
          <label className="text-sm text-nordic-700">
            E-post
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-nordic-700">
            Passord
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-nordic-200 px-3 py-2"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-nordic-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Logger inn..." : "Logg inn"}
          </button>

          <p className="text-sm text-nordic-600">
            Har du ikke konto? <Link href="/kunde/register" className="underline">Registrer deg</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
