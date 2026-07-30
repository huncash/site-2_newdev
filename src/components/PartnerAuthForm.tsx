"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  getCartItems,
  mergeCart,
  replaceCart,
  setCartUserId,
} from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export type PartnerAuthMode = "login" | "register";

export interface PartnerAuthFormProps {
  mode: PartnerAuthMode;
  className?: string;
  onSuccessRedirect?: string;
}

async function syncCartAfterAuth(
  userId: string,
  serverCart: unknown
): Promise<void> {
  setCartUserId(userId);
  const remote = Array.isArray(serverCart) ? serverCart : [];
  const local = getCartItems();
  if (remote.length === 0 && local.length > 0) {
    await fetch("/api/partner/cart", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: local }),
    });
    return;
  }
  if (local.length === 0 && remote.length > 0) {
    replaceCart(remote as Parameters<typeof replaceCart>[0]);
    return;
  }
  if (remote.length > 0) {
    const merged = mergeCart(remote as Parameters<typeof mergeCart>[0]);
    await fetch("/api/partner/cart", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: merged }),
    });
  }
}

export function PartnerAuthForm({
  mode,
  className,
  onSuccessRedirect = "/",
}: PartnerAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(
        isRegister ? "/api/partner/register" : "/api/partner/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        user?: { id: string };
        cart?: unknown;
      };
      if (!res.ok) {
        setError(
          data.error ||
            (res.status === 401
              ? "Érvénytelen e-mail vagy jelszó."
              : res.status === 409
                ? "Ez az e-mail már regisztrálva van."
                : "Sikertelen művelet.")
        );
        return;
      }
      if (data.user?.id) {
        await syncCartAfterAuth(data.user.id, data.cart);
      }
      setPassword("");
      window.location.assign(onSuccessRedirect);
    } catch {
      setError("Hálózati hiba.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div className="mb-8 text-center">
        <div className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Partner / ügyfél
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {isRegister ? "Regisztráció" : "Belépés"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kosár mentése a fiókodhoz. Nincs ügyvezetői / admin hozzáférés.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">E-mail</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Jelszó</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {pending
              ? "…"
              : isRegister
                ? "Fiók létrehozása"
                : "Belépés"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {isRegister ? (
          <>
            Már van fiókod?{" "}
            <Link href="/partner/login" className="underline hover:text-foreground">
              Belépés
            </Link>
          </>
        ) : (
          <>
            Nincs még fiókod?{" "}
            <Link
              href="/partner/register"
              className="underline hover:text-foreground"
            >
              Regisztráció
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
