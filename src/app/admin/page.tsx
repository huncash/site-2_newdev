import Link from "next/link";

const MODULES = [
  {
    href: "/admin/katalogus",
    badge: "Katalógus",
    title: "Termékkatalógus kezelő",
    body: "Új lámpamodul / izzó rögzítése, meglévők szerkesztése a private source-on.",
  },
  {
    href: "/admin/arres-kalkulacio",
    badge: "Árrés",
    title: "Árrés-kalkulátor",
    body: "Konkurens nettó, EUR beszerzés, élő árfolyam, undercut, margin/markup, készlet.",
  },
  {
    href: "/admin/ajanlat",
    badge: "Ajánlat",
    title: "Ajánlatkezelő",
    body: "Web3Forms beillesztés, A/B/C csomagok, PDF és kísérő e-mail sablon.",
  },
  {
    href: "/admin/marketing",
    badge: "Marketing",
    title: "Marketing kezelő",
    body: "Landing választó, AI hirdetés-tervező, konverzió és Search Console tabok.",
  },
  {
    href: "/admin/keszlet",
    badge: "Készlet",
    title: "Készletkezelő",
    body: "Kereső panel, kiemelt modellek frissítése, publikus ár / készlet mentés.",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
        Irányítópult
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ügyvezetői adminisztráció</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        JWT session + middleware védelem. Konkurens / beszállítói adatok csak szerveroldali
        admin API-n — publikus DTO-kba nem szivárognak.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="block rounded-lg border border-border bg-card p-5 transition hover:border-primary"
          >
            <div className="text-[10px] font-medium uppercase tracking-widest text-primary">
              {m.badge}
            </div>
            <h2 className="mt-2 text-lg font-semibold">{m.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
