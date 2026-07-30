import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektor márkák — lámpamodulok márkák szerint | projektorlampacsere.hu",
  description: "Projektor lámpamodulok márkák szerint: Epson, BenQ, NEC, Optoma, Acer, ViewSonic, Panasonic, Sony, Hitachi. Tipikus cikkszámok, modellek, eredeti gyári izzó.",
};

import { brandPages } from "@/data/brand-pages";
import { canonical, SITE_URL } from "@/lib/seo";

function MarkakIndex() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Márkák</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">PROJEKTOR MÁRKÁK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Projektor lámpamodulok márkák szerint</h1>
      <p className="text-muted-foreground mt-3 max-w-3xl">
        Válasszon márkát a hozzá tartozó tipikus cikkszámrendszer, népszerű
        vetítőtípusok és gyári fényforrás megismeréséhez. Minden márkához
        eredeti gyári izzós, méretpontos utángyártott keretbe szerelt
        lámpamodult szállítunk, áfás számlával.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandPages.map((b) => (
          <Link
            key={b.slug}
            href={`/markak/${b.slug}`}
            className="block border border-border rounded p-5 bg-card hover:bg-surface transition-colors"
          >
            <div className="text-xs tracking-[0.25em] text-primary font-medium uppercase">
              {b.brand}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-foreground">{b.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.intro}</p>
            <div className="mt-3 text-xs text-primary">{b.popularModels.length} jellemző modell →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default MarkakIndex;
