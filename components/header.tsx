"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "./cart-provider";
import { CustomerAuthActions } from "./customer-auth-actions";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-nordic-100 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-nordic-800">
          NordicFloor
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-nordic-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-nordic-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CustomerAuthActions />
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-nordic-200 px-4 py-2 text-sm font-medium text-nordic-800 hover:bg-nordic-50"
          >
            Handlekurv
            <span className="rounded-full bg-nordic-800 px-2 py-0.5 text-xs text-white">{totalItems}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
