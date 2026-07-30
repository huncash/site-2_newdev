"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, products, type Product } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

function CatalogPageInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") ?? "";

  function setSearch(next: { q?: string; cat?: string }) {
    const params = new URLSearchParams();
    const nq = next.q ?? q;
    const nc = next.cat ?? cat;
    if (nq) params.set("q", nq);
    if (nc) params.set("cat", nc);
    const qs = params.toString();
    router.push(qs ? `/katalogus?${qs}` : "/katalogus");
  }

  const filtered = products.filter((p: Product) => {
    if (cat && p.categorySlug !== cat) return false;
    if (q) {
      const needle = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle)
      );
    }
    return true;
  });

  return (
    <div className="w-full px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">KATALÓGUS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Projektor lámpamodulok cikkszám szerint</h1>
      <p className="text-muted-foreground mt-2">
        Keressen cikkszámra, gyártóra vagy projektor típusra, illetve szűrjön
        kategória szerint. A katalógus a leggyakoribb intézményi és vállalati
        típusokat tartalmazza; a forgalmazott modulokban a fényforrás minden
        esetben eredeti gyári gyártmány (Philips, Osram, Ushio, Phoenix),
        méretpontos utángyártott kerettel. A választott kivitelt és a hozzá
        tartozó garanciát az árajánlat tételesen rögzíti.
      </p>

      <div className="mt-8 grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <label className="text-xs font-medium text-foreground tracking-wide uppercase">
              Keresés
            </label>
            <input
              value={q}
              onChange={(e) => setSearch({ q: e.target.value })}
              placeholder="Cikkszám, gyártó, modell…"
              className="mt-2 w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="text-xs font-medium text-foreground tracking-wide uppercase mb-2">
              Kategória
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setSearch({ cat: "" })}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    cat === "" ? "bg-primary-soft text-primary-deep font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Összes kategória
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setSearch({ cat: c.slug })}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      cat === c.slug ? "bg-primary-soft text-primary-deep font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} {filtered.length === 1 ? "termék" : "termék"}
            </span>
            {(q || cat) && (
              <Link href="/katalogus" className="text-primary hover:underline text-xs">
                Szűrők törlése
              </Link>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="border border-border rounded p-10 text-center text-muted-foreground text-sm">
              Erre a keresésre nincs találat a katalógusban. Pontosítsa a cikkszámot,
              vagy <Link href="/ajanlatkeres" className="text-primary hover:underline">kérjen tételes ajánlatot</Link> —
              a katalóguson kívüli típusok túlnyomó többsége egyedi beszerzéssel szállítható.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogPageInner />
    </Suspense>
  );
}
