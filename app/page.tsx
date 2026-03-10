import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ContactOfferForm } from "@/components/contact-offer-form";
import { FAQAccordion } from "@/components/faq-accordion";
import { BENEFITS, FAQ_ITEMS, INSPIRATION_ROOMS } from "@/lib/constants";
import { getActiveProducts, getCategories } from "@/lib/db/queries";
import { formatCurrencyNOK, packagePrice } from "@/lib/utils";

export const revalidate = 120;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);
  const featuredProducts = products.slice(0, 8);
  const heroProduct = featuredProducts[0];

  return (
    <>
      <section className="border-b border-nordic-100 bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-nordic-600">
          <div className="flex items-center gap-4">
            <span className="font-medium text-nordic-800">NordicFloor</span>
            <span>Premium klikk-vinyl og gulvtilbehør</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <a href="#kontakt" className="hover:text-nordic-900">
              Kontakt
            </a>
            <a href="#om-oss" className="hover:text-nordic-900">
              Om oss
            </a>
            <a href="#faq" className="hover:text-nordic-900">
              FAQ
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-nordic-500">NÅR KVALITET GJELDER</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-nordic-900 sm:text-6xl">
              Se vårt utvalg av klikk-vinyl
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-nordic-600 sm:text-lg">
              Design inspirert av nordiske interiører, produsert i Europa og utviklet for norske hjem.
              Utforsk kolleksjoner i tre, stein og fiskebensmønster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#produkter"
                className="rounded-full bg-nordic-800 px-6 py-3 text-sm font-semibold text-white hover:bg-nordic-700"
                aria-label="Gå til produktseksjon"
              >
                Se produkter
              </a>
              <Link
                href="/kalkulator"
                className="rounded-full border border-nordic-200 px-6 py-3 text-sm font-semibold text-nordic-700 hover:bg-nordic-50"
              >
                Beregn behov
              </Link>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="relative h-80 sm:h-[420px]">
              <Image
                src={heroProduct?.images[0] ?? "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80"}
                alt={heroProduct?.name ?? "NordicFloor showroom"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-nordic-500">Utvalgt</p>
                <p className="font-semibold text-nordic-900">{heroProduct?.name ?? "Fine Finér-lignende uttrykk"}</p>
              </div>
              {heroProduct ? (
                <Link
                  href={`/produkter/${heroProduct.slug}`}
                  className="rounded-full border border-nordic-200 px-4 py-2 text-xs font-semibold text-nordic-700"
                >
                  Les mer
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-nordic-100 bg-nordic-50 py-6">
        <div className="container-x flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href="#produkter"
              className="rounded-full border border-nordic-200 bg-white px-4 py-2 text-sm text-nordic-700 hover:bg-nordic-100"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/kalkulator" className="rounded-full bg-nordic-800 px-4 py-2 text-sm font-semibold text-white">
            Showroom-prisguide
          </Link>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-wide text-nordic-500">Showroom i Oslo</p>
            <h2 className="mt-1 text-2xl font-semibold text-nordic-900">Besøk oss for prøver og rådgivning</h2>
            <p className="mt-2 text-sm text-nordic-600">Se overflater i naturlig lys og få hjelp til riktig kolleksjon.</p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-nordic-200 px-5 py-2.5 text-sm font-semibold text-nordic-700"
          >
            Besøk oss
          </a>
        </div>
      </section>

      <section id="produkter" className="container-x py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-nordic-500">PRODUKTER AV HØY KVALITET</p>
            <h2 className="section-title text-nordic-900">Utvalgte gulv</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => {
            const image = product.images[0] ?? "https://picsum.photos/seed/nordicfloor-home/900/700";
            const packPrice = packagePrice(product.price, Number(product.sqmPerPackage));

            return (
              <article key={product.id} className="card overflow-hidden">
                <div className="relative h-52 bg-nordic-100">
                  <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-xs uppercase tracking-wide text-nordic-500">{product.category.name}</p>
                  <h3 className="text-base font-semibold text-nordic-900">{product.name}</h3>
                  <p className="text-sm text-nordic-600 line-clamp-2">{product.description}</p>
                  <div className="text-sm">
                    <p className="font-semibold text-nordic-900">{formatCurrencyNOK(product.price)}/m²</p>
                    <p className="text-nordic-500">Pakke: {formatCurrencyNOK(packPrice)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        pricePerSqm: product.price,
                        packagePrice: packPrice,
                        image,
                        sqmPerPackage: Number(product.sqmPerPackage)
                      }}
                      className="rounded-full bg-nordic-800 px-3 py-2 text-xs font-semibold text-white hover:bg-nordic-700"
                    />
                    <Link
                      href={`/produkter/${product.slug}`}
                      className="rounded-full border border-nordic-200 px-3 py-2 text-xs font-semibold text-nordic-700"
                    >
                      Detaljer
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-nordic-100 bg-white py-14">
        <div className="container-x">
          <h2 className="section-title text-nordic-900">Hvorfor velge NordicFloor?</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="card p-4 text-sm font-medium text-nordic-700">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="om-oss" className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-nordic-900">Om NordicFloor</h2>
            <p className="mt-4 leading-relaxed text-nordic-600">
              Vi leverer klikk-vinyl med fokus på varighet, autentiske overflater og enkel installasjon.
              Våre produkter kombinerer HD Mineral Core, realistisk EIR-struktur og materialer valgt for
              nordisk klima og bruk.
            </p>
          </div>
          <div id="inspirasjon" className="space-y-3">
            <h3 className="text-xl font-semibold text-nordic-900">Inspirasjon</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INSPIRATION_ROOMS.map((room, index) => (
                <div
                  key={room}
                  className="flex h-24 items-end rounded-xl border border-nordic-100 bg-gradient-to-br from-white to-nordic-100 p-3 text-sm font-medium text-nordic-700"
                >
                  {room} #{index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="container-x py-10">
        <h2 className="section-title text-nordic-900">Ofte stilte spørsmål</h2>
        <div className="mt-7">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      <section id="kontakt" className="container-x pb-20 pt-10">
        <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-nordic-900">Kontakt</h3>
            <ul className="mt-4 space-y-2 text-sm text-nordic-600">
              <li>E-post: hei@nordicfloor.no</li>
              <li>Telefon: +47 22 40 20 20</li>
              <li>Oslo, Norge</li>
            </ul>
          </div>
          <ContactOfferForm />
        </div>
      </section>
    </>
  );
}
