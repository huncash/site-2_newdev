"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listCompetitorSamples } from "@/lib/admin-pricing.functions";

type CompetitorRow = {
  id: string;
  model: string;
  competitorNetHuf: number;
  competitorGrossHuf: number;
  stockStatus: "in-stock" | "out-of-stock";
  leadTime: "7 munkanap" | "14 nap";
  competitorWarranty: string;
  segment: string;
};

/* -------------------------------------------------------------------------- */
/*  BELSŐ HASZNÁLATRA — NEM PUBLIKUS                                            */
/*                                                                              */
/*  Ez az oldal kizárólag a tulajdonos belső döntéstámogatására szolgál.       */
/*  • A főnavigációból nem linkelhető.                                          */
/*  • A `head()` `noindex, nofollow` robots metát állít be.                     */
/*  • Beszerzési árak NINCSENEK a kódban — a tulajdonos élőben tölti ki őket   */
/*    input mezőkben; az adat csak a böngésző state-jében létezik, sehol sem    */
/*    perzisztálódik.                                                           */
/*  • A beszerzési forrás megnevezése sehol nem jelenik meg — sem itt,          */
/*    sem a kliens-bundle-ben.                                                  */
/* -------------------------------------------------------------------------- */

const fmt = new Intl.NumberFormat("hu-HU");
const huf = (n: number) => `${fmt.format(Math.round(n))} Ft`;

/** A tulajdonos által beírt EUR-ban megadott beszerzési ár. */
type CostMap = Record<string, number | "">;

/**
 * Csak eredeti gyári izzó (foglalat/keret nélkül) árazási stratégia:
 *  – alap eset: eladási ár = beszerzési ár × 2 (a moduloknál megszokott
 *    nyers markup-elv);
 *  – ha a konkurens publikus nettó árat ad ugyanerre az izzóra, akkor a
 *    lámpamodul-logika érvényes: a beállított undercut %-kal a konkurens
 *    nettó ára alatt árazunk.
 */

type RateState =
  | { status: "loading" }
  | { status: "ready"; rate: number; date: string; source: "frankfurter" | "manual" }
  | { status: "error"; message: string };

function ArresKalkulacioPage() {
  // Szerveroldali admin-only forrás — a mintaadat NEM kerül a publikus bundle-be.
  const listSamples = listCompetitorSamples;
  const [competitorSamples, setCompetitorSamples] = useState<CompetitorRow[]>([]);
  const [samplesLoading, setSamplesLoading] = useState(true);
  const [samplesError, setSamplesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSamples()
      .then((data) => {
        if (cancelled) return;
        setCompetitorSamples(data as CompetitorRow[]);
        setSamplesLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setSamplesError(e instanceof Error ? e.message : "Ismeretlen hiba");
        setSamplesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [listSamples]);

  // A tulajdonos által beírt beszerzési árak (EUR, nettó). Csak böngésző-state.
  const [costs, setCosts] = useState<CostMap>({});
  // Csak eredeti izzó (foglalat nélkül) beszerzési ár, EUR. Opcionális.
  const [bulbCosts, setBulbCosts] = useState<CostMap>({});
  // Konkurens publikus nettó izzó-ár (Ft).
  const [bulbCompetitor, setBulbCompetitorMap] = useState<CostMap>({});

  useEffect(() => {
    if (competitorSamples.length === 0) return;
    const empty = Object.fromEntries(competitorSamples.map((r) => [r.id, ""])) as CostMap;
    setCosts(empty);
    setBulbCosts(empty);
    setBulbCompetitorMap(empty);
  }, [competitorSamples]);
  // Globális undercut % — mennyivel megyünk a konkurens nettó ára alá.
  const [undercutPct, setUndercutPct] = useState<number>(20);

  // EUR → HUF napi árfolyam. Forrás: frankfurter.dev (ECB-alapú, CORS-friendly).
  // Az MNB középárfolyamot a tulaj kézzel felülírhatja az input mezőben.
  const [rateState, setRateState] = useState<RateState>({ status: "loading" });
  const [manualRate, setManualRate] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=HUF")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j: { rates?: { HUF?: number }; date?: string }) => {
        if (cancelled) return;
        const rate = j.rates?.HUF;
        if (typeof rate !== "number" || !isFinite(rate)) {
          setRateState({ status: "error", message: "Hiányzó HUF árfolyam a válaszban." });
          return;
        }
        setRateState({ status: "ready", rate, date: j.date ?? "", source: "frankfurter" });
      })
      .catch((e) => {
        if (cancelled) return;
        setRateState({ status: "error", message: e instanceof Error ? e.message : "Ismeretlen hiba" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Effektív árfolyam: kézi felülírás (ha érvényes) > letöltött > 0
  const manualRateNum = Number(manualRate.replace(/\s/g, "").replace(/,/g, "."));
  const effectiveRate =
    Number.isFinite(manualRateNum) && manualRateNum > 0
      ? manualRateNum
      : rateState.status === "ready"
        ? rateState.rate
        : 0;

  const rows = useMemo(() => {
    return competitorSamples.map((r) => {
      const costEur = costs[r.id];
      const costEurNum = typeof costEur === "number" ? costEur : NaN;
      const costHufNum = isFinite(costEurNum) && effectiveRate > 0 ? costEurNum * effectiveRate : NaN;
      const ourPrice = r.competitorNetHuf * (1 - undercutPct / 100);
      const margin = isFinite(costHufNum) ? ourPrice - costHufNum : NaN;
      const marginPct = isFinite(margin) && ourPrice > 0 ? (margin / ourPrice) * 100 : NaN;
      const markupPct = isFinite(margin) && costHufNum > 0 ? (margin / costHufNum) * 100 : NaN;

      // Csak izzó (foglalat nélkül) — párhuzamos számítás.
      const bulbCostEur = bulbCosts[r.id];
      const bulbCostEurNum = typeof bulbCostEur === "number" ? bulbCostEur : NaN;
      const bulbCostHufNum =
        isFinite(bulbCostEurNum) && effectiveRate > 0 ? bulbCostEurNum * effectiveRate : NaN;
      const bulbCompetitorRaw = bulbCompetitor[r.id];
      const bulbCompetitorNet =
        typeof bulbCompetitorRaw === "number" ? bulbCompetitorRaw : NaN;
      const bulbPriceMode: "undercut" | "double" | "—" = isFinite(bulbCompetitorNet)
        ? "undercut"
        : isFinite(bulbCostHufNum)
          ? "double"
          : "—";
      const ourBulbPrice =
        bulbPriceMode === "undercut"
          ? bulbCompetitorNet * (1 - undercutPct / 100)
          : bulbPriceMode === "double"
            ? bulbCostHufNum * 2
            : NaN;
      const bulbMargin = isFinite(ourBulbPrice) && isFinite(bulbCostHufNum)
        ? ourBulbPrice - bulbCostHufNum
        : NaN;
      const bulbMarkupPct =
        isFinite(bulbMargin) && bulbCostHufNum > 0 ? (bulbMargin / bulbCostHufNum) * 100 : NaN;

      return {
        ...r,
        costEur: costEurNum,
        costHuf: costHufNum,
        ourPrice,
        margin,
        marginPct,
        markupPct,
        bulbCostEur: bulbCostEurNum,
        bulbCostHuf: bulbCostHufNum,
        bulbCompetitorNet,
        ourBulbPrice,
        bulbMargin,
        bulbMarkupPct,
        bulbPriceMode,
      };
    });
  }, [costs, bulbCosts, bulbCompetitor, undercutPct, effectiveRate]);

  // Összesítések — csak azokra a sorokra, ahol már be van írva a beszerzési ár.
  const filled = rows.filter((r) => isFinite(r.costHuf));
  const summary = useMemo(() => {
    if (filled.length === 0) {
      return { count: 0, totalMargin: 0, avgMarginPct: 0, avgMarkupPct: 0, avgUndercut: undercutPct };
    }
    const totalMargin = filled.reduce((a, r) => a + r.margin, 0);
    const avgMarginPct =
      filled.reduce((a, r) => a + r.marginPct, 0) / filled.length;
    const avgMarkupPct =
      filled.reduce((a, r) => a + r.markupPct, 0) / filled.length;
    return { count: filled.length, totalMargin, avgMarginPct, avgMarkupPct, avgUndercut: undercutPct };
  }, [filled, undercutPct]);

  const setCost = (id: string, raw: string) => {
    if (raw === "") {
      setCosts((c) => ({ ...c, [id]: "" }));
      return;
    }
    const n = Number(raw.replace(/\s/g, "").replace(/,/g, "."));
    if (Number.isFinite(n) && n >= 0) {
      setCosts((c) => ({ ...c, [id]: n }));
    }
  };

  const setBulbCost = (id: string, raw: string) => {
    if (raw === "") {
      setBulbCosts((c) => ({ ...c, [id]: "" }));
      return;
    }
    const n = Number(raw.replace(/\s/g, "").replace(/,/g, "."));
    if (Number.isFinite(n) && n >= 0) {
      setBulbCosts((c) => ({ ...c, [id]: n }));
    }
  };

  const setBulbCompetitor = (id: string, raw: string) => {
    if (raw === "") {
      setBulbCompetitorMap((c) => ({ ...c, [id]: "" }));
      return;
    }
    const n = Number(raw.replace(/\s/g, "").replace(/,/g, "."));
    if (Number.isFinite(n) && n >= 0) {
      setBulbCompetitorMap((c) => ({ ...c, [id]: n }));
    }
  };

  return (
    <div>
      {/* Banner — egyértelműen privát */}
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
        <div className="font-semibold text-destructive">
          Belső használatra — nem publikus
        </div>
        <p className="text-muted-foreground mt-1">
          Ez az oldal nincs indexelve és nem linkelhető a főnavigációból. A
          beírt beszerzési árak kizárólag a böngésződben élnek (oldalfrissítés
          után törlődnek). Ne küldd tovább a képernyőképet harmadik félnek.
        </p>
      </div>

      {samplesLoading && (
        <div className="mt-6 text-sm text-muted-foreground">Mintaadatok betöltése…</div>
      )}
      {samplesError && (
        <div className="mt-6 text-sm text-destructive">Betöltési hiba: {samplesError}</div>
      )}
      {!samplesLoading && !samplesError && (
        <>

      <h1 className="text-2xl font-semibold tracking-tight mt-6">
        Árrés-kalkulátor — versenyhírszerzés
      </h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
        {competitorSamples.length} valós mintatermék — mindegyik szerepel egy
        hazai konkurens nyilvános listáján <em>és</em> a beszállítónknál is
        rendelhető (880 átnézett tétel közül 144 metszet,
        ebből készleten lévő, gyártó- és árszint-szerint diverz minta;
        2026-04). Töltsd ki soronként a beszerzési árat (nettó{" "}
        <strong>EUR</strong>); a kalkulátor a napi EUR→HUF árfolyamon élőben
        átváltja, és megmutatja, hogy az alább megadott{" "}
        <strong>{undercutPct}%-kal a konkurens alatti</strong> eladási áron
        mekkora forint- és százalékos árrés marad.
      </p>

      {/* Árfolyam-vezérlő */}
      <section className="mt-6 border border-border rounded-lg bg-card p-4">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              EUR → HUF napi árfolyam
            </div>
            <div className="text-lg font-semibold tracking-tight mt-1 tabular-nums">
              {rateState.status === "loading" && "Betöltés…"}
              {rateState.status === "error" && (
                <span className="text-destructive">Hiba: {rateState.message}</span>
              )}
              {rateState.status === "ready" && (
                <>
                  1 € = {rateState.rate.toFixed(2)} Ft{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({rateState.date}, ECB)
                  </span>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
              Felülírás (pl. MNB középárfolyam)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={manualRate}
              onChange={(e) => setManualRate(e.target.value)}
              placeholder="—"
              className="mt-1 w-32 text-right border border-border rounded px-2 py-1 bg-background tabular-nums"
              aria-label="Kézi EUR/HUF árfolyam"
            />
          </div>
          <div className="text-xs text-muted-foreground max-w-md">
            Forrás: <a href="https://www.frankfurter.dev" target="_blank" rel="noopener noreferrer" className="underline">frankfurter.dev</a> (ECB-referencia, napi). Ha az
            <a href="https://www.mnb.hu/arfolyamok" target="_blank" rel="noopener noreferrer" className="underline mx-1">MNB középárfolyamot</a>
            szeretnéd használni, írd be kézzel — addig az ECB érték él.
            Effektív árfolyam most: <strong className="tabular-nums">{effectiveRate > 0 ? `${effectiveRate.toFixed(2)} Ft / €` : "—"}</strong>
          </div>
        </div>
      </section>

      {/* Vezérlők */}
      <section className="mt-6 grid sm:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <label className="block text-xs font-medium tracking-wide text-muted-foreground">
            Undercut a konkurens nettó árához képest:{" "}
            <span className="text-foreground font-semibold">{undercutPct}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={undercutPct}
            onChange={(e) => setUndercutPct(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0%</span><span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const empty = Object.fromEntries(competitorSamples.map((r) => [r.id, ""])) as CostMap;
            setCosts(empty);
            setBulbCosts(empty);
            setBulbCompetitorMap(empty);
          }}
          className="border border-border rounded px-4 py-2 text-sm hover:bg-surface"
        >
          Beszerzési árak ürítése (modul + izzó)
        </button>
      </section>

      {/* Összegzés */}
      <section className="mt-6 grid sm:grid-cols-4 gap-3">
        <Stat label="Kitöltött tételek" value={`${summary.count} / ${competitorSamples.length}`} />
        <Stat label="Átlagos árrés (%)" value={summary.count ? `${summary.avgMarginPct.toFixed(1)}%` : "—"} />
        <Stat label="Átlagos felár a beszerzésen (markup)" value={summary.count ? `${summary.avgMarkupPct.toFixed(0)}%` : "—"} />
        <Stat label={`Összesített forint-margin (${undercutPct}% undercut)`} value={summary.count ? huf(summary.totalMargin) : "—"} />
      </section>

      {/* Táblázat — oszlopsorrend: # | Modell | Konkurens nettó | Beszerzés € | Beszerzés Ft | Mi árunk | Margin Ft/% | Markup % | Készlet */}
      <section className="mt-6 overflow-x-auto border border-border rounded-lg bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Megnevezés / Modell</th>
              <th className="text-right px-3 py-2">Konkurens Nettó (Ft)</th>
              <th className="text-right px-3 py-2">Beszerzés (€)</th>
              <th className="text-right px-3 py-2">Beszerzés Átváltva (Ft)</th>
              <th className="text-right px-3 py-2">
                Mi Árunk (Ft)
                <br />
                <span className="font-normal normal-case">(−{undercutPct}%)</span>
              </th>
              <th className="text-right px-3 py-2">Margin (Ft / %)</th>
              <th className="text-right px-3 py-2">Markup (%)</th>
              <th className="text-left px-3 py-2">Készlet / Átfutási idő</th>
              <th className="text-right px-3 py-2 border-l border-border">Izzó beszerzés (€)</th>
              <th className="text-right px-3 py-2">Konkurens izzó nettó</th>
              <th className="text-right px-3 py-2">Mi izzó-árunk</th>
              <th className="text-right px-3 py-2">Izzó markup %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <Row
                key={r.id}
                row={r}
                undercutPct={undercutPct}
                costInput={costs[r.id]}
                onCostChange={(v) => setCost(r.id, v)}
                bulbCostInput={bulbCosts[r.id]}
                onBulbCostChange={(v) => setBulbCost(r.id, v)}
                bulbCompetitorInput={bulbCompetitor[r.id]}
                onBulbCompetitorChange={(v) => setBulbCompetitor(r.id, v)}
              />
            ))}
          </tbody>
        </table>
      </section>

      {/* Izzó-csak árazási stratégia */}
      <section className="mt-6 border border-border rounded-lg p-5 bg-surface">
        <h2 className="text-base font-semibold tracking-tight">
          Csak eredeti izzó (foglalat / keret nélkül) — árazási logika
        </h2>
        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            <strong>Alapeset:</strong> eladási izzó-ár = beszerzési ár ×{" "}
            <strong>2</strong> (a moduloknál megszokott nyers markup-elv).
          </li>
          <li>
            <strong>Ha van konkurens publikus nettó ár</strong> ugyanerre az
            izzóra: ugyanaz a logika, mint a lámpamoduloknál — a beállított{" "}
            <strong>{undercutPct}%-kal a konkurens nettó ára alatt</strong>{" "}
            árazunk; a 2×-es szabály csak akkor él, ha nincs hivatkozható
            publikus árszint.
          </li>
          <li>
            A táblázat „Konkurens izzó nettó (opc.)" oszlopa csak akkor
            kitöltendő, ha az adott típushoz tényleg van publikus izzó-ár;
            üresen hagyva a számítás automatikusan a beszerzés × 2 módra
            vált.
          </li>
        </ul>
      </section>

      {/* Megfigyelt árszintek — a konkurens sávos árazása */}
      <section className="mt-8 border border-border rounded-lg p-5 bg-surface">
        <h2 className="text-base font-semibold tracking-tight">
          Megfigyelés — a konkurens sávos átalányárakat használ
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          A 20 mintatermék mindössze 5 különböző nettó árszinten szerepel. Ez
          azt jelzi, hogy nincs típus-szintű precíz árazásuk, hanem
          kategória-átalányt alkalmaznak. Ez stratégiai rés: ha mi
          típus-pontos árazást vezetünk be (pontos beszerzési költség alapján),
          ott különösen, ahol a sáv felülárazza az adott modult, akár 25–35%
          alámenés is reális, miközben az árrésünk ép marad.
        </p>
        <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li><strong>10 864 Ft</strong> — alacsony / régi modulok</li>
          <li><strong>81 044 / 82 311 / 84 427 / 85 518 / 88 939 Ft</strong> — közép („üzleti") sáv</li>
          <li><strong>185 730 Ft</strong> — magas (300W+ vagy ritkább)</li>
        </ul>
      </section>

      {/* Tipp */}
      <p className="mt-6 text-xs italic text-muted-foreground">
        Tipp: a slider-rel többet érdemes próbálni — pl. 10% / 20% / 30%. Ahol
        20%-os undercut mellett még 35%+ markup marad a beszerzésen, ott
        kényelmesen lehetünk olcsóbbak; ahol a markup 15% alá esik, ott
        érdemesebb csak kis (5–10%) alámenéssel pozicionálni vagy egyáltalán
        nem versenyezni az adott típuson.
      </p>
      </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tracking-tight mt-1">{value}</div>
    </div>
  );
}

function Row({
  row,
  undercutPct,
  costInput,
  onCostChange,
  bulbCostInput,
  onBulbCostChange,
  bulbCompetitorInput,
  onBulbCompetitorChange,
}: {
  row: CompetitorRow & {
    costEur: number;
    costHuf: number;
    ourPrice: number;
    margin: number;
    marginPct: number;
    markupPct: number;
    bulbCostEur: number;
    bulbCostHuf: number;
    bulbCompetitorNet: number;
    ourBulbPrice: number;
    bulbMargin: number;
    bulbMarkupPct: number;
    bulbPriceMode: "undercut" | "double" | "—";
  };
  undercutPct: number;
  costInput: number | "";
  onCostChange: (v: string) => void;
  bulbCostInput: number | "";
  onBulbCostChange: (v: string) => void;
  bulbCompetitorInput: number | "";
  onBulbCompetitorChange: (v: string) => void;
}) {
  const filled = isFinite(row.costHuf);
  const positive = filled && row.margin > 0;
  const tight = filled && row.markupPct < 15;
  const bulbFilled = isFinite(row.ourBulbPrice);
  const bulbTight = bulbFilled && isFinite(row.bulbMarkupPct) && row.bulbMarkupPct < 60;
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-2 text-muted-foreground tabular-nums">{row.id}</td>
      <td className="px-3 py-2">
        <div className="font-medium">{row.model}</div>
        <div className="text-[10px] text-muted-foreground">{row.segment}</div>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">{huf(row.competitorNetHuf)}</td>
      <td className="px-3 py-2 text-right">
        <input
          type="text"
          inputMode="decimal"
          value={costInput === "" ? "" : String(costInput)}
          onChange={(e) => onCostChange(e.target.value)}
          placeholder="€"
          className="w-24 text-right border border-border rounded px-2 py-1 bg-background tabular-nums"
          aria-label={`Beszerzési ár EUR-ban — ${row.model}`}
        />
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
        {filled ? huf(row.costHuf) : "—"}
      </td>
      <td className="px-3 py-2 text-right tabular-nums font-medium">{huf(row.ourPrice)}</td>
      <td
        className={`px-3 py-2 text-right tabular-nums ${
          !filled ? "text-muted-foreground" : positive ? "text-foreground" : "text-destructive"
        }`}
      >
        {filled ? (
          <>
            <div className="font-medium">{huf(row.margin)}</div>
            <div className="text-[10px] text-muted-foreground">{row.marginPct.toFixed(1)}%</div>
          </>
        ) : (
          "—"
        )}
      </td>
      <td
        className={`px-3 py-2 text-right tabular-nums ${
          !filled ? "text-muted-foreground" : tight ? "text-destructive" : "text-foreground"
        }`}
      >
        {filled ? `${row.markupPct.toFixed(0)}%` : "—"}
      </td>
      <td className="px-3 py-2 text-xs whitespace-nowrap">
        {row.stockStatus === "in-stock" ? (
          <span className="text-foreground">Készleten · {row.leadTime}</span>
        ) : (
          <span className="text-muted-foreground">Nincs · {row.leadTime}</span>
        )}
      </td>
      <td className="px-3 py-2 text-right border-l border-border">
        <input
          type="text"
          inputMode="decimal"
          value={bulbCostInput === "" ? "" : String(bulbCostInput)}
          onChange={(e) => onBulbCostChange(e.target.value)}
          placeholder="€"
          className="w-24 text-right border border-border rounded px-2 py-1 bg-background tabular-nums"
          aria-label={`Izzó beszerzési ár EUR-ban — ${row.model}`}
        />
      </td>
      <td className="px-3 py-2 text-right">
        <input
          type="text"
          inputMode="decimal"
          value={bulbCompetitorInput === "" ? "" : String(bulbCompetitorInput)}
          onChange={(e) => onBulbCompetitorChange(e.target.value)}
          placeholder="Ft (opc.)"
          className="w-28 text-right border border-border rounded px-2 py-1 bg-background tabular-nums"
          aria-label={`Konkurens izzó nettó ár Ft-ban — ${row.model}`}
        />
      </td>
      <td
        className={`px-3 py-2 text-right tabular-nums font-medium ${
          !bulbFilled ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {bulbFilled ? huf(row.ourBulbPrice) : "—"}
        {bulbFilled && (
          <div className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
            {row.bulbPriceMode === "undercut" ? `−${undercutPct}% konk.` : "beszerzés × 2"}
          </div>
        )}
      </td>
      <td
        className={`px-3 py-2 text-right tabular-nums ${
          !bulbFilled || !isFinite(row.bulbMarkupPct)
            ? "text-muted-foreground"
            : bulbTight
              ? "text-destructive"
              : "text-foreground"
        }`}
      >
        {bulbFilled && isFinite(row.bulbMarkupPct) ? `${row.bulbMarkupPct.toFixed(0)}%` : "—"}
      </td>
    </tr>
  );
}

export default ArresKalkulacioPage;
