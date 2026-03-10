import Link from "next/link";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <section className="container-x py-20">
      <div className="card mx-auto max-w-2xl p-10 text-center">
        <h1 className="text-3xl font-semibold text-nordic-900">Takk for bestillingen!</h1>
        <p className="mt-3 text-nordic-600">
          Betalingen er registrert. Vi sender ordrebekreftelse så snart alt er klart.
        </p>
        {orderId ? <p className="mt-2 text-sm text-nordic-500">Ordrenummer: #{orderId}</p> : null}
        <Link href="/" className="mt-6 inline-block rounded-full bg-nordic-800 px-5 py-2.5 text-sm font-semibold text-white">
          Til forsiden
        </Link>
      </div>
    </section>
  );
}
