import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektor modellek — lámpamodulok típus szerint | projektorlampacsere.hu",
  description: "Projektor lámpamodul beszerzés modellszinten: Epson EB-, BenQ MX/MW, NEC V/M, Optoma HD, Acer P/X, ViewSonic PA/PG, Panasonic PT-, Sony VPL-, Hitachi CP-. Tételes árajánlat.",
};

import { popularModels } from "@/data/popular-models";
import { canonical, SITE_URL } from "@/lib/seo";

function ModelsIndex() {
  const byBrand = popularModels.reduce<Record<string, typeof popularModels>>((acc, m) => {
    (acc[m.brand] ??= [] as unknown as typeof popularModels).push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Projektor modellek</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">PROJEKTOR MODELLEK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Projektor lámpamodulok modellek szerint
      </h1>
      <p className="text-muted-foreground mt-3 max-w-3xl">
        A leggyakrabban keresett hazai projektortípusokhoz előre összeállított
        adatlap, a tipikus gyári lámpacikkszámmal és technikai paraméterekkel.
        Az itt nem szereplő modellekre is állunk rendelkezésére — küldje el a
        vetítő típusszámát az árajánlat-kérőben.
      </p>

      <div className="mt-10 space-y-10">
        {Object.entries(byBrand).map(([brand, list]) => (
          <section key={brand}>
            <h2 className="text-lg font-semibold">{brand}</h2>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projektor-modell/${p.slug}`}
                  className="block border border-border rounded p-4 bg-card hover:bg-surface transition-colors"
                >
                  <div className="font-medium text-foreground">{p.brand} {p.model}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {p.resolution} · {p.brightness}
                    {p.lampPart ? <> · <span className="font-mono">{p.lampPart}</span></> : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
export default ModelsIndex;
