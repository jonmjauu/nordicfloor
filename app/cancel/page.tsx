import Link from "next/link";

export default async function CancelPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <section className="container-x py-20">
      <div className="card mx-auto max-w-2xl p-10 text-center">
        <h1 className="text-3xl font-semibold text-nordic-900">Betaling avbrutt</h1>
        <p className="mt-3 text-nordic-600">Ingen betaling ble trukket. Du kan prøve igjen når som helst.</p>
        {orderId ? <p className="mt-2 text-sm text-nordic-500">Foreløpig ordrenummer: #{orderId}</p> : null}
        <Link href="/checkout" className="mt-6 inline-block rounded-full border border-nordic-200 px-5 py-2.5 text-sm font-semibold text-nordic-700">
          Tilbake til checkout
        </Link>
      </div>
    </section>
  );
}
