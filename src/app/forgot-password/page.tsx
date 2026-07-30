"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setMsg({
        type: "info",
        text: "Amennyiben a megadott cím szerepel a rendszerünkben, rövidesen levelet küldünk a jelszó visszaállításához szükséges hivatkozással. Kérjük, ellenőrizze a beérkezett üzeneteket — szükség esetén a kéretlen levelek mappát is.",
      });
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Ismeretlen hiba történt." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Jelszó visszaállítása</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Adja meg a fiókhoz tartozó e-mail címet. A megadott címre elküldjük a jelszó visszaállításához szükséges hivatkozást.
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
          {busy ? "Folyamatban…" : "Visszaállító hivatkozás kérése"}
        </button>
      </form>

      <div className="mt-6 text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground underline">
          Vissza a bejelentkezéshez
        </Link>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;
