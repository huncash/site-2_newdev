"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="rounded border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-50"
    >
      {pending ? "…" : "Kijelentkezés"}
    </button>
  );
}
