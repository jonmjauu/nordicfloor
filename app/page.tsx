import Link from "next/link";
import { ContactOfferForm } from "@/components/contact-offer-form";
import { FAQAccordion } from "@/components/faq-accordion";
import { ProductCard } from "@/components/product-card";
import { BENEFITS, FAQ_ITEMS, INSPIRATION_ROOMS } from "@/lib/constants";
import { getActiveProducts, getCategories } from "@/lib/db/queries";

export const revalidate = 120;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);

  return (
    <>
      <section className="border-b border-nordic-100 bg-white py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-nordic-500">NordicFloor</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-nordic-900 sm:text-6xl">
              Premium klikk-vinyl for norske hjem
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-nordic-600">
              Norsk leverandør med fokus på varige gulv fra europeiske produsenter — utviklet for
              skandinavisk design, høy slitestyrke og hverdager med tempo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#produkter"
                className="rounded-full bg-nordic-800 px-6 py-3 text-sm font-semibold text-white hover:bg-nordic-700"
                aria-label="Gå til produktseksjon"
              >
                Se produkter
              </a>
              <a
                href="#kontakt"
                className="rounded-full border border-nordic-200 px-6 py-3 text-sm font-semibold text-nordic-700 hover:bg-nordic-50"
                aria-label="Gå til kontaktseksjon"
              >
                Få tilbud
              </a>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-sm text-nordic-600">Populære kolleksjoner</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category.id} className="rounded-full bg-nordic-100 px-3 py-1 text-sm text-nordic-700">
                  {category.name}
                </span>
              ))}
            </div>
            <div className="mt-6 text-sm text-nordic-600">
              Fra <span className="font-semibold text-nordic-900">184 kr/m²</span> · HD Mineral Core · EIR-overflate
            </div>
          </div>
        </div>
      </section>

      <section id="produkter" className="container-x py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title text-nordic-900">Kolleksjoner</h2>
            <p className="mt-2 text-nordic-600">Premium, fiskebensmønster, stein & betong, tredesign og budsjettvennlig.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, sqmPerPackage: String(product.sqmPerPackage) }} />
          ))}
        </div>
      </section>

      <section className="border-y border-nordic-100 bg-white py-16">
        <div className="container-x">
          <h2 className="section-title text-nordic-900">Hvorfor klikk-vinyl?</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="card p-4 text-sm font-medium text-nordic-700">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="card flex flex-col items-start justify-between gap-4 p-8 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-nordic-900">Beregn ditt behov – fra 184 kr/m²</h3>
            <p className="mt-2 text-nordic-600">Finn antall pakker og estimert pris på få sekunder.</p>
          </div>
          <Link href="/kalkulator" className="rounded-full bg-nordic-800 px-5 py-3 text-sm font-semibold text-white">
            Gå til kalkulator
          </Link>
        </div>
      </section>

      <section className="border-y border-nordic-100 bg-white py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-nordic-900">Om NordicFloor</h2>
            <p className="mt-4 leading-relaxed text-nordic-600">
              Vi er en norsk gulvleverandør med fokus på moderne klikk-vinyl tilpasset nordiske hjem.
              Kolleksjonene våre produseres hos nøye utvalgte europeiske partnere og kombinerer
              HD Mineral Core-stabilitet, realistisk EIR-struktur og slitesterke toppsjikt for lang levetid.
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

      <section id="faq" className="container-x py-16">
        <h2 className="section-title text-nordic-900">Ofte stilte spørsmål</h2>
        <div className="mt-8">
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      <section id="kontakt" className="container-x pb-20">
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
