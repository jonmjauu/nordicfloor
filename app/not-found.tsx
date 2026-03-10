import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-20">
      <div className="card mx-auto max-w-xl p-10 text-center">
        <h1 className="text-3xl font-semibold text-nordic-900">Fant ikke siden</h1>
        <p className="mt-2 text-nordic-600">Beklager, denne siden finnes ikke.</p>
        <Link href="/" className="mt-5 inline-block rounded-full bg-nordic-800 px-5 py-2.5 text-sm font-semibold text-white">
          Til forsiden
        </Link>
      </div>
    </section>
  );
}
