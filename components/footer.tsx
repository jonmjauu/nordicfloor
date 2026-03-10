import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-nordic-100 bg-white">
      <div className="container-x grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-nordic-800">NordicFloor</p>
          <p className="mt-2 text-sm text-nordic-600">
            Premium klikk-vinyl for norske hjem. Designet for skandinavisk hverdag og bygget for lang levetid.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-nordic-700">Kontakt</p>
          <ul className="mt-3 space-y-2 text-sm text-nordic-600">
            <li>E-post: hei@nordicfloor.no</li>
            <li>Telefon: +47 22 40 20 20</li>
            <li>Oslo, Norge</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-nordic-700">Lenker</p>
          <ul className="mt-3 space-y-2 text-sm text-nordic-600">
            <li>
              <Link href="/kalkulator">Kalkulator</Link>
            </li>
            <li>
              <Link href="/admin">Admin</Link>
            </li>
            <li>
              <Link href="/cart">Handlekurv</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
