"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

/**
 * UX kapu a legacy admin oldalakhoz.
 * A valódi védelmet a middleware + admin layout session-ellenőrzés adja.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "forbidden">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/session", { credentials: "include" });
        if (cancelled) return;
        setState(res.ok ? "ok" : "forbidden");
      } catch {
        if (!cancelled) setState("forbidden");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "checking") {
    return <div className="min-h-[40vh] bg-background" aria-hidden="true" />;
  }

  if (state === "forbidden") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Az oldal nem található</h2>
          <div className="mt-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Belépés
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
