"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x py-20">
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h1 className="text-3xl font-semibold text-nordic-900">Noe gikk galt</h1>
        <p className="mt-2 text-sm text-nordic-600">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-full bg-nordic-800 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Prøv igjen
        </button>
      </div>
    </section>
  );
}
