"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    // A Supabase a recovery linkről érkezve automatikusan beállítja a session-t.
    // Először az auth state változást figyeljük, majd lekérjük az aktuális session-t.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setHasSession(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session));
      setReady(true);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) {
      setMsg({ type: "error", text: "A jelszónak legalább 8 karakter hosszúnak kell lennie." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "A két megadott jelszó nem egyezik." });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg({
        type: "info",
        text: "A jelszó sikeresen módosítva. Átirányítjuk az adminisztrációs felületre.",
      });
      setTimeout(() => router.push(`/katalogus?` + new URLSearchParams({ to: "/admin/keszlet" } as Record<string, string>).toString()), 1500);
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Ismeretlen hiba történt." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Új jelszó megadása</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Kérjük, adja meg az új jelszót. Javasoljuk legalább 12 karakter hosszúságú, egyedi jelszó használatát, lehetőség szerint jelszókezelő alkalmazásban tárolva.
      </p>

      {ready && !hasSession && (
        <div className="mt-6 text-sm rounded border border-destructive/40 bg-destructive/5 text-destructive px-3 py-2">
          A visszaállító hivatkozás érvénytelen vagy lejárt. Kérjük, igényeljen új hivatkozást.
          <div className="mt-2">
            <Link href="/forgot-password" className="underline">
              Új hivatkozás kérése
            </Link>
          </div>
        </div>
      )}

      {ready && hasSession && (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground">Új jelszó</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-border rounded px-3 py-2 bg-background"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground">Új jelszó megerősítése</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full border border-border rounded px-3 py-2 bg-background"
              autoComplete="new-password"
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
            {busy ? "Mentés folyamatban…" : "Új jelszó mentése"}
          </button>
        </form>
      )}
    </div>
  );
}
export default ResetPasswordPage;
