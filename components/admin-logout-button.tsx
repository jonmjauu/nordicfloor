"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-full border border-nordic-200 px-4 py-2 text-sm text-nordic-700"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
        router.refresh();
      }}
    >
      Logg ut
    </button>
  );
}
