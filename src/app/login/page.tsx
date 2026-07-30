"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin/keszlet" },
        });
        if (error) throw error;
        setMsg({
          type: "info",
          text: "Megerősítő e-mailt küldtünk. Kattints a benne lévő hivatkozásra a fiók aktiválásához.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(`/katalogus?` + new URLSearchParams({ to: "/admin/keszlet" } as Record<string, string>).toString());
      }
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Ismeretlen hiba" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Belső bejelentkezés</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Az adminisztrációs felület kizárólag a tulajdonos részére érhető el.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-medium tracking-wide text-muted-foreground">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-border rounded px-3 py-2 bg-background"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wide text-muted-foreground">Jelszó</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-border rounded px-3 py-2 bg-background"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {msg && (
          <div
            className={
              "text-sm rounded border px-3 py-2 " +
              (msg.type === "error"
                ? "border-destructive/40 bg-destructive/5 text-destructive"
                : "border-border bg-surface text-muted-foreground")
            }
          >
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary text-primary-foreground rounded py-2 font-medium disabled:opacity-50"
        >
          {busy ? "Folyamatban…" : mode === "signin" ? "Belépés" : "Fiók létrehozása"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === "signin" ? "signup" : "signin"));
          setMsg(null);
        }}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground underline"
      >
        {mode === "signin" ? "Még nincs fiókom — regisztráció" : "Már van fiókom — belépés"}
      </button>

      {mode === "signin" && (
        <div className="mt-3 text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground underline"
          >
            Elfelejtett jelszó?
          </Link>
        </div>
      )}
    </div>
  );
}
export default LoginPage;
