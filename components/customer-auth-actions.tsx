"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerState {
  id: number;
  name: string;
  email: string;
}

export function CustomerAuthActions() {
  const [customer, setCustomer] = useState<CustomerState | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/customer/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.customer) {
          setCustomer(json.customer);
        }
      })
      .catch(() => {
        setCustomer(null);
      });
  }, []);

  if (!customer) {
    return (
      <Link
        href="/kunde/login"
        className="inline-flex items-center rounded-full border border-nordic-200 px-4 py-2 text-sm font-medium text-nordic-700 hover:bg-nordic-50"
      >
        Logg inn
      </Link>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Link
        href="/kunde"
        className="inline-flex items-center rounded-full border border-nordic-200 px-4 py-2 text-sm font-medium text-nordic-700 hover:bg-nordic-50"
      >
        Min side
      </Link>
      <button
        type="button"
        onClick={async () => {
          await fetch("/api/customer/logout", { method: "POST" });
          setCustomer(null);
          router.push("/");
          router.refresh();
        }}
        className="inline-flex items-center rounded-full border border-nordic-200 px-4 py-2 text-sm font-medium text-nordic-700 hover:bg-nordic-50"
      >
        Logg ut
      </button>
    </div>
  );
}
