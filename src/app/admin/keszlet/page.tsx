"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/catalog";
import { getSupabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  scrapeCompetitorsForModel,
  approveProductPrice,
  upsertProductStock,
  syncFeaturedStock,
} from "@/lib/admin.functions";
import { suggestPrice } from "@/lib/pricing/suggest";

const fmt = new Intl.NumberFormat("hu-HU");
const huf = (n: number) => `${fmt.format(Math.round(n))} Ft`;

type CompetitorHit = {
  url: string;
  hostname: string;
  priceNetHuf: number | null;
  stockStatus: "in_stock" | "lead_time" | "on_request" | "out_of_stock" | "unknown";
  stockRaw: string | null;
  leadTimeBusinessDays: number | null;
  leadTimeRaw: string | null;
};

function stockLabel(s: CompetitorHit["stockStatus"]): string {
  switch (s) {
    case "in_stock":
      return "Raktáron";
    case "lead_time":
      return "Átfutásos";
    case "on_request":
      return "Kérésre";
    case "out_of_stock":
      return "Elfogyott";
    default:
      return "ismeretlen";
  }
}

/**
 * Konkurens találatok rangsora: készlet (raktáron előre), átfutási idő, ár.
 * Az „Elfogyott" találatokat a végére teszi.
 */
function rankAlternatives(items: CompetitorHit[]): CompetitorHit[] {
  const stockRank: Record<CompetitorHit["stockStatus"], number> = {
    in_stock: 0,
    lead_time: 1,
    on_request: 2,
    unknown: 3,
    out_of_stock: 4,
  };
  return [...items].sort((a, b) => {
    const s = stockRank[a.stockStatus] - stockRank[b.stockStatus];
    if (s !== 0) return s;
    const la = a.leadTimeBusinessDays ?? 999;
    const lb = b.leadTimeBusinessDays ?? 999;
    if (la !== lb) return la - lb;
    const pa = a.priceNetHuf ?? Number.POSITIVE_INFINITY;
    const pb = b.priceNetHuf ?? Number.POSITIVE_INFINITY;
    return pa - pb;
  });
}

type StockRow = {
  slug: string;
  status: "in_stock" | "lead_time" | "on_request";
  lead_time_business_days: number | null;
  checked_at: string;
  source: string;
};
type PriceRow = {
  slug: string;
  public_price_huf: number;
  approved_at: string;
  note: string | null;
};

function KeszletPage() {
  const { accessToken } = useAuth();
  const scrapeFn = scrapeCompetitorsForModel;
  const approveFn = approveProductPrice;
  const stockFn = upsertProductStock;
  const syncFeaturedFn = syncFeaturedStock;

  // Embed mód (iframe-ben az ajánlatadó oldalról): elrejt admin keretet,
  // és minden termékhez „→ Ajánlat" gombot ad, ami postMessage-szel küldi az árat.
  const [embed, setEmbed] = useState(false);
  // Embed módban: az ajánlatadóból átadott SKU/modell-listák, és toggle, hogy
  // csak ezekre szűrjünk-e (alapból igen). A teljes katalógusra való átkapcsolás
  // egy kattintással elérhető.
  const [embedSkus, setEmbedSkus] = useState<string[]>([]);
  const [embedModels, setEmbedModels] = useState<string[]>([]);
  const [onlyOffer, setOnlyOffer] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmbed(params.get("embed") === "1");
      const norm = (s: string) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      setEmbedSkus(norm(params.get("skus") ?? ""));
      setEmbedModels(norm(params.get("models") ?? ""));
    }
  }, []);

  // Ha változik az URL (a szülő iframe.src átírja), olvassuk újra a listákat.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reread = () => {
      const params = new URLSearchParams(window.location.search);
      const norm = (s: string) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      setEmbedSkus(norm(params.get("skus") ?? ""));
      setEmbedModels(norm(params.get("models") ?? ""));
    };
    window.addEventListener("popstate", reread);
    return () => window.removeEventListener("popstate", reread);
  }, []);

  const sendPriceToParent = (
    prod: { slug: string; brand: string; name: string; sku: string },
    grossHuf: number,
  ) => {
    if (typeof window === "undefined" || !window.parent || window.parent === window) return;
    const netPrice = Math.round(grossHuf / 1.27);
    window.parent.postMessage(
      {
        type: "lovable:price-pick",
        slug: prod.slug,
        brand: prod.brand,
        model: prod.name,
        sku: prod.sku,
        netPrice,
      },
      window.location.origin,
    );
  };

  const [stocks, setStocks] = useState<Record<string, StockRow>>({});
  const [prices, setPrices] = useState<Record<string, PriceRow>>({});
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState<Record<string, string | null>>({});
  const [scrapeOut, setScrapeOut] = useState<
    Record<
      string,
      {
        url: string;
        hostname: string;
        priceNetHuf: number | null;
        stockStatus: "in_stock" | "lead_time" | "on_request" | "out_of_stock" | "unknown";
        stockRaw: string | null;
        leadTimeBusinessDays: number | null;
        leadTimeRaw: string | null;
      }[] | null
    >
  >({});
  /** Termékenként: az admin manuálisan jelölte, hogy az elsődleges forrásnál nincs készleten. */
  const [primaryOut, setPrimaryOut] = useState<Record<string, boolean>>({});
  const [syncBusy, setSyncBusy] = useState(false);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(`${label} a vágólapra másolva.`);
      setTimeout(() => setCopyMsg(null), 2500);
    } catch {
      setCopyMsg("A másolás nem sikerült — jelölje ki és másolja kézzel.");
    }
  }
  const [syncSummary, setSyncSummary] = useState<
    Array<{
      slug: string;
      status: "in_stock" | "lead_time" | "unchanged";
      leadTimeBusinessDays: number | null;
      note: string;
    }> | null
  >(null);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    (async () => {
      const [s, p] = await Promise.all([
        client.from("product_stock").select("*"),
        client.from("product_pricing").select("*"),
      ]);
      if (s.data) setStocks(Object.fromEntries(s.data.map((r) => [r.slug, r as StockRow])));
      if (p.data) setPrices(Object.fromEntries(p.data.map((r) => [r.slug, r as PriceRow])));
    })();
  }, [accessToken]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = products;
    if (embed && onlyOffer && (embedSkus.length > 0 || embedModels.length > 0)) {
      const skuSet = new Set(embedSkus.map((s) => s.toLowerCase()));
      const modelTokens = embedModels.map((m) => m.toLowerCase()).filter(Boolean);
      list = list.filter((p) => {
        const sku = p.sku.toLowerCase();
        if (skuSet.has(sku)) return true;
        const name = p.name.toLowerCase();
        return modelTokens.some((m) => name.includes(m) || m.includes(sku));
      });
    }
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, embed, onlyOffer, embedSkus, embedModels]);

  const setBusyFor = (slug: string, label: string | null) =>
    setBusy((b) => ({ ...b, [slug]: label }));

  const onScrape = async (slug: string, model: string) => {
    setBusyFor(slug, "Versenytárs lekérdezése…");
    try {
      const r = await scrapeFn({ data: { model } });
      setScrapeOut((o) => ({ ...o, [slug]: r.results }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hiba");
    } finally {
      setBusyFor(slug, null);
    }
  };

  const onApprovePrice = async (slug: string, suggestedGross: number | null, customRaw: string) => {
    const custom = Number(customRaw.replace(/[ \u00a0.]/g, "").replace(/,/g, "."));
    const value = Number.isFinite(custom) && custom > 0 ? Math.round(custom) : suggestedGross;
    if (!value || value <= 0) {
      alert("Adj meg érvényes árat (vagy generálj javaslatot előbb).");
      return;
    }
    setBusyFor(slug, "Ár jóváhagyása…");
    try {
      await approveFn({ data: { slug, publicPriceHuf: value } });
      const client = getSupabase();
      if (client) {
        const { data } = await client.from("product_pricing").select("*").eq("slug", slug).maybeSingle();
        if (data) setPrices((p) => ({ ...p, [slug]: data as PriceRow }));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hiba");
    } finally {
      setBusyFor(slug, null);
    }
  };

  const onSetStock = async (
    slug: string,
    status: "in_stock" | "lead_time" | "on_request",
    leadTime?: number | null,
  ) => {
    setBusyFor(slug, "Készlet mentése…");
    try {
      await stockFn({
        data: { slug, status, leadTimeBusinessDays: leadTime ?? null, source: "manual" },
      });
      const client = getSupabase();
      if (client) {
        const { data } = await client.from("product_stock").select("*").eq("slug", slug).maybeSingle();
        if (data) setStocks((s) => ({ ...s, [slug]: data as StockRow }));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hiba");
    } finally {
      setBusyFor(slug, null);
    }
  };

  const onSyncFeatured = async () => {
    if (syncBusy) return;
    if (!confirm("Lefuttatod a kiemelt modellek készlet-szinkronját? Ez Firecrawl-hívásokat indít.")) return;
    setSyncBusy(true);
    setSyncSummary(null);
    try {
      const res = await syncFeaturedFn();
      setSyncSummary(res.summary);
      const client = getSupabase();
      if (client) {
        const { data } = await client.from("product_stock").select("*");
        if (data) setStocks(Object.fromEntries(data.map((r) => [r.slug, r as StockRow])));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hiba");
    } finally {
      setSyncBusy(false);
    }
  };

  return (
    <div className={embed ? "px-3 py-3" : "max-w-[1280px] mx-auto px-6 py-10"}>
      {!embed && (
        <>
      <AdminHeader badge="Belső · nem publikus" title="Készlet és publikus árazás" />
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
        <div className="font-semibold text-destructive">Belső használatra — nem publikus</div>
        <p className="text-muted-foreground mt-1">
          A jóváhagyott publikus árak és a készletállapot itt mentésre kerülnek a háttéradatbázisba —
          ezek a katalóguson amúgy is megjelenő publikus információk. A versenytárs-árak <em>nem</em> kerülnek
          mentésre: minden lekérdezés alkalmi, csak a döntéshez szükséges idő erejéig él.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mt-4 max-w-3xl">
        Termékenként lekérheted az aktuális versenytárs-árat a konfigurált hazai konkurens oldalakról,
        a kalkulátor javaslatot ad a publikus bruttó árra (alapértelmezetten 20% undercut + 27% ÁFA),
        és egy kattintással jóváhagyhatod. A készletállapot és átfutási idő ugyanitt frissíthető.
        <br />
        <span className="block mt-2">
          Ha az <strong>elsődleges forrásnál nincs készleten</strong> a tétel, jelöld be a termék kártyáján;
          ekkor megjelenik az <em>alternatíva-keresés</em> blokk, ami a két konkurens oldalról ár, készlet
          és becsült kiszállítási idő alapján rangsorolja a lehetőségeket.
        </span>
      </p>

      <div className="mt-6 border border-border rounded-lg p-4 bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <div className="font-medium">Kiemelt modellek készletének automatikus frissítése</div>
            <p className="text-xs text-muted-foreground mt-1">
              A katalógusban kiemelt ({products.filter((p) => p.autoStockCheck).length} db) modellre lefuttatja
              az elsődleges forrás és a konfigurált hazai konkurens oldalak készletellenőrzését, és frissíti
              a publikus készletállapotot. Havonta egyszer automatikusan is fut; itt kézzel is elindíthatod.
            </p>
          </div>
          <button
            type="button"
            onClick={onSyncFeatured}
            disabled={syncBusy}
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {syncBusy ? "Szinkronizálás folyamatban…" : "Frissítés most"}
          </button>
        </div>
        {syncSummary && (
          <ul className="mt-3 text-xs space-y-1">
            {syncSummary.map((row) => (
              <li key={row.slug} className="flex items-center justify-between gap-2 border-t border-border pt-1">
                <span className="font-mono text-muted-foreground">{row.slug}</span>
                <span>
                  {row.status === "in_stock" && <strong className="text-foreground">Raktáron</strong>}
                  {row.status === "lead_time" && (
                    <strong className="text-foreground">
                      Átfutásos {row.leadTimeBusinessDays ? `(${row.leadTimeBusinessDays} munkanap)` : ""}
                    </strong>
                  )}
                  {row.status === "unchanged" && (
                    <span className="text-muted-foreground">változatlan</span>
                  )}
                  <span className="text-muted-foreground ml-2">{row.note}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
        </>
      )}

      <div className={embed ? "" : "mt-6"}>
        {embed && (embedSkus.length > 0 || embedModels.length > 0) && (
          <div className="mb-2 flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setOnlyOffer((v) => !v)}
              className={
                "rounded-full px-3 py-1 border transition-colors " +
                (onlyOffer
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent")
              }
              title={onlyOffer ? "Kattints a teljes katalógus mutatásához" : "Kattints a szűréshez"}
            >
              {onlyOffer
                ? `Csak ajánlat-tételek (${filtered.length})`
                : "Teljes katalógus — kattints a szűréshez"}
            </button>
            <span className="text-muted-foreground truncate">
              {[...embedSkus, ...embedModels].slice(0, 5).join(", ")}
              {embedSkus.length + embedModels.length > 5 ? "…" : ""}
            </span>
          </div>
        )}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Szűrés modell vagy SKU alapján…"
          className="w-full max-w-md border border-border rounded px-3 py-2 bg-background"
        />
        {copyMsg && <div className="text-xs text-primary mt-1">{copyMsg}</div>}
      </div>

      <section className={(embed ? "mt-3 " : "mt-6 ") + "space-y-4"}>
        {filtered.map((prod) => {
          const stock = stocks[prod.slug];
          const price = prices[prod.slug];
          const scraped = scrapeOut[prod.slug];
          const competitorBest =
            scraped && scraped.length > 0
              ? Math.min(
                  ...scraped
                    .map((r) => r.priceNetHuf ?? Infinity)
                    .filter((n) => Number.isFinite(n)),
                )
              : null;
          const suggestion = suggestPrice({
            competitorNetHuf: Number.isFinite(competitorBest as number)
              ? (competitorBest as number)
              : null,
          });
          const isBusy = busy[prod.slug];
          const isPrimaryOut = !!primaryOut[prod.slug];
          const ranked = scraped ? rankAlternatives(scraped) : [];
          const recommendedUrl = ranked[0]?.url ?? null;

          return (
            <article key={prod.slug} className="border border-border rounded-lg bg-card p-4">
              <header className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">{prod.name}</h2>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    SKU: {prod.sku} · {prod.brand}
                  </div>
                </div>
                {price && (
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Aktuális publikus ár
                    </div>
                    <div className="text-base font-semibold tabular-nums">{huf(price.public_price_huf)}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Jóváhagyva: {new Date(price.approved_at).toLocaleString("hu-HU")}
                    </div>
                    {(() => {
                      const net = Math.round(price.public_price_huf / 1.27);
                      return (
                        <div className="mt-1">
                          <div className="text-[11px] text-muted-foreground">
                            Nettó: <span className="tabular-nums font-medium text-foreground">{huf(net)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(String(net), "Nettó ár")}
                            className="mt-0.5 text-[10px] border border-input rounded px-1.5 py-0.5 hover:bg-accent"
                            title={`Nettó ${net} Ft másolása a vágólapra`}
                          >
                            Másol nettót
                          </button>
                        </div>
                      );
                    })()}
                    {embed && (
                      <button
                        type="button"
                        onClick={() => sendPriceToParent(prod, price.public_price_huf)}
                        className="mt-1 text-[11px] bg-primary text-primary-foreground rounded px-2 py-1 hover:opacity-90"
                        title={`Nettó ${huf(Math.round(price.public_price_huf / 1.27))} az ajánlatba`}
                      >
                        → Ajánlat (nettó {huf(Math.round(price.public_price_huf / 1.27))})
                      </button>
                    )}
                  </div>
                )}
                {embed && !price && (
                  <div className="text-right text-[11px] text-muted-foreground">
                    Még nincs jóváhagyott publikus ár
                  </div>
                )}
              </header>

              <div className="mt-4 grid lg:grid-cols-2 gap-4">
                <div className="border border-border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Publikus ár
                    </div>
                    <button
                      type="button"
                      onClick={() => onScrape(prod.slug, prod.name)}
                      disabled={!!isBusy}
                      className="text-xs border border-border rounded px-2 py-1 hover:bg-surface disabled:opacity-50"
                    >
                      {isBusy === "Versenytárs lekérdezése…" ? "Lekérdezés…" : "Versenytárs lekérdezése"}
                    </button>
                  </div>

                  {scraped && (
                    <ul className="mt-3 text-xs space-y-1">
                      {scraped.length === 0 && (
                        <li className="text-muted-foreground">Nem találtam találatot.</li>
                      )}
                      {scraped.map((r, i) => (
                        <li key={i} className="flex items-center justify-between gap-2">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline truncate max-w-[60%]"
                          >
                            {r.hostname}
                          </a>
                          <span className="tabular-nums text-muted-foreground">
                            {r.priceNetHuf ? huf(r.priceNetHuf) + " (nettó)" : "ár nem olvasható"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {suggestion.suggestedGrossHuf && (
                    <div className="mt-3 rounded bg-surface px-3 py-2 text-sm">
                      Javasolt publikus bruttó ár (−20% a legolcsóbb versenytárs nettó árából, +27% ÁFA):{" "}
                      <strong className="tabular-nums">{huf(suggestion.suggestedGrossHuf)}</strong>
                    </div>
                  )}

                  <PriceApproval
                    suggestedGross={suggestion.suggestedGrossHuf}
                    busy={!!isBusy}
                    onApprove={(custom) =>
                      onApprovePrice(prod.slug, suggestion.suggestedGrossHuf, custom)
                    }
                  />
                </div>

                <div className="border border-border rounded p-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Készlet
                  </div>
                  <div className="mt-1 text-sm">
                    {stock ? (
                      <span>
                        Aktuális:{" "}
                        <strong>
                          {stock.status === "in_stock" && "Raktáron"}
                          {stock.status === "lead_time" &&
                            `Átfutásos (${stock.lead_time_business_days ?? 7} munkanap)`}
                          {stock.status === "on_request" && "Egyedi kérésre"}
                        </strong>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({new Date(stock.checked_at).toLocaleString("hu-HU")})
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Még nincs rögzítve.</span>
                    )}
                  </div>

                  <StockEditor
                    initialStatus={stock?.status ?? "lead_time"}
                    initialLeadTime={stock?.lead_time_business_days ?? 7}
                    busy={!!isBusy}
                    onSave={(status, lt) => onSetStock(prod.slug, status, lt)}
                  />

                  <div className="mt-4 pt-3 border-t border-border">
                    <label className="flex items-start gap-2 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={isPrimaryOut}
                        onChange={(e) =>
                          setPrimaryOut((p) => ({ ...p, [prod.slug]: e.target.checked }))
                        }
                      />
                      <span>
                        <span className="font-medium">Elsődleges forrásnál nincs készleten</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          Ha sürgős az ügyfélnek, alternatívaként a hazai konkurencia készletét és
                          átfutási idejét vesszük figyelembe.
                        </span>
                      </span>
                    </label>

                    {isPrimaryOut && (
                      <div className="mt-3">
                        {!scraped ? (
                          <button
                            type="button"
                            onClick={() => onScrape(prod.slug, prod.name)}
                            disabled={!!isBusy}
                            className="text-xs border border-border rounded px-2 py-1 hover:bg-surface disabled:opacity-50"
                          >
                            {isBusy === "Versenytárs lekérdezése…"
                              ? "Lekérdezés…"
                              : "Alternatíva keresése"}
                          </button>
                        ) : ranked.length === 0 ? (
                          <div className="text-xs text-muted-foreground">
                            A konkurens oldalakon nem találtam használható alternatívát.
                          </div>
                        ) : (
                          <ul className="text-xs space-y-2">
                            {ranked.map((r) => (
                              <li
                                key={r.url}
                                className={
                                  "border rounded p-2 " +
                                  (r.url === recommendedUrl
                                    ? "border-primary bg-primary/5"
                                    : "border-border")
                                }
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline truncate max-w-[60%]"
                                  >
                                    {r.hostname}
                                  </a>
                                  {r.url === recommendedUrl && (
                                    <span className="text-[10px] uppercase tracking-wide bg-primary text-primary-foreground rounded px-1.5 py-0.5">
                                      Ajánlott
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
                                  <div>
                                    <div className="text-muted-foreground">Ár (nettó)</div>
                                    <div className="tabular-nums">
                                      {r.priceNetHuf ? huf(r.priceNetHuf) : "—"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Készlet</div>
                                    <div>{stockLabel(r.stockStatus)}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Átfutás</div>
                                    <div>
                                      {r.leadTimeBusinessDays != null
                                        ? `~${r.leadTimeBusinessDays} munkanap`
                                        : r.stockStatus === "in_stock"
                                        ? "azonnal"
                                        : "—"}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          A rangsor a készletállapotot (raktáron előrébb), majd a becsült átfutási
                          időt, végül a nettó árat veszi figyelembe — ár-érték arányban a leggyorsabb
                          opciót emeli ki.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function PriceApproval({
  suggestedGross,
  busy,
  onApprove,
}: {
  suggestedGross: number | null;
  busy: boolean;
  onApprove: (customRaw: string) => void;
}) {
  const [custom, setCustom] = useState("");
  return (
    <div className="mt-3 flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
          Egyedi ár (Ft, bruttó) — felülírja a javaslatot
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={suggestedGross ? String(suggestedGross) : "—"}
          className="mt-1 w-40 text-right border border-border rounded px-2 py-1 bg-background tabular-nums"
        />
      </div>
      <button
        type="button"
        disabled={busy || (!suggestedGross && !custom)}
        onClick={() => onApprove(custom)}
        className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm font-medium disabled:opacity-50"
      >
        Ár jóváhagyása és publikálása
      </button>
    </div>
  );
}

function StockEditor({
  initialStatus,
  initialLeadTime,
  busy,
  onSave,
}: {
  initialStatus: "in_stock" | "lead_time" | "on_request";
  initialLeadTime: number;
  busy: boolean;
  onSave: (
    status: "in_stock" | "lead_time" | "on_request",
    lt: number | null,
  ) => void;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [lt, setLt] = useState<number>(initialLeadTime);
  return (
    <div className="mt-3 flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
          Státusz
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="mt-1 border border-border rounded px-2 py-2 bg-background text-sm"
        >
          <option value="in_stock">Raktáron</option>
          <option value="lead_time">Átfutásos</option>
          <option value="on_request">Egyedi kérésre</option>
        </select>
      </div>
      {status === "lead_time" && (
        <div>
          <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
            Átfutás (munkanap)
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={lt}
            onChange={(e) => setLt(Number(e.target.value))}
            className="mt-1 w-24 border border-border rounded px-2 py-2 bg-background text-sm tabular-nums"
          />
        </div>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => onSave(status, status === "lead_time" ? lt : null)}
        className="border border-border rounded px-3 py-2 text-sm hover:bg-surface disabled:opacity-50"
      >
        Készlet mentése
      </button>
    </div>
  );
}
export default KeszletPage;
