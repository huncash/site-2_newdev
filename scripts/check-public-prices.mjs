import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_TARGET_MARGIN_PCT,
  DEFAULT_UNDERCUT_PCT,
  MIN_MARKUP_PCT,
  VAT_MULTIPLIER,
  evaluateListedPrice,
  hufFromEur,
  marginOf,
  undercutNet,
} from "../src/lib/pricing/eur-check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

function assertRules() {
  if (undercutNet(100_000, 20) !== 80_000) throw new Error("undercut szabály elcsúszott");
  if (hufFromEur(100, 400) !== 40_000) throw new Error("EUR átváltás elcsúszott");
  const margin = marginOf(80_000, 40_000);
  if (margin.marginHuf !== 40_000 || margin.marginPct !== 50 || margin.markupPct !== 100) {
    throw new Error("árrés képlet elcsúszott");
  }
  const healthy = evaluateListedPrice({
    publicNetHuf: 80_000,
    rate: 400,
    costEur: 100,
    competitorNetHuf: 100_000,
  });
  if (healthy.severity !== "ok") throw new Error("egészséges minta nem ok");
  const loss = evaluateListedPrice({ publicNetHuf: 80_000, rate: 400, costEur: 200 });
  if (!loss.flags.includes("loss")) throw new Error("veszteséges minta nem bukik");
}

function loadFeatured(source) {
  const found = [];
  const re = /featuredPrice:\s*\{\s*netHuf:\s*(\d+)\s*,\s*variant:\s*"([^"]+)"\s*\}/g;
  for (const match of source.matchAll(re)) {
    const before = source.slice(Math.max(0, match.index - 1800), match.index);
    const skus = [...before.matchAll(/sku:\s*"([^"]+)"/g)];
    const names = [...before.matchAll(/\n\s*name:\s*"([^"]+)"/g)];
    const sku = skus.at(-1)?.[1];
    const name = names.at(-1)?.[1];
    if (!sku || !name) throw new Error("publikus ár sorhoz nem tartozik cikkszám");
    found.push({
      sku,
      name,
      netHuf: Number(match[1]),
      variant: match[2],
    });
  }
  return found;
}

function loadCompetitors(source) {
  const rows = [];
  const re = /model:\s*"([^"]+)"\s*,\s*competitorNetHuf:\s*(\d+)/g;
  for (const match of source.matchAll(re)) {
    rows.push({ model: match[1], competitorNetHuf: Number(match[2]) });
  }
  return rows;
}

function matchCompetitor(sku, samples) {
  const key = sku.toLowerCase();
  return samples.find((row) => row.model.toLowerCase().includes(key)) ?? null;
}

function loadCosts() {
  const path = join(root, "private_data", "supplier-eur.json");
  if (!existsSync(path)) return { path, costs: {} };
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("private_data/supplier-eur.json objektum kell: { \"CIKKSZAM\": 123.45 }");
  }
  return { path, costs: parsed };
}

async function loadRate() {
  const response = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=HUF");
  if (!response.ok) throw new Error(`EUR árfolyam HTTP ${response.status}`);
  const body = await response.json();
  const rate = body?.rates?.HUF;
  if (typeof rate !== "number" || !Number.isFinite(rate)) {
    throw new Error("Hiányzó HUF árfolyam");
  }
  return { rate, date: body.date ?? "" };
}

const FLAG_TEXT = {
  "missing-rate": "nincs érvényes EUR árfolyam",
  "missing-eur-cost": "nincs rögzített beszállítói EUR alapár — az árfolyam-fedezet nem bizonyítható",
  loss: "a publikus ár a mai árfolyamon a beszerzés alatt van",
  "below-min-markup": `markup ${MIN_MARKUP_PCT}% alatt — árfolyamkockázat`,
  "below-target-margin": `árrés a ${DEFAULT_TARGET_MARGIN_PCT}%-os cél alatt`,
  "above-competitor": "drágább, mint a konkurens nettó — az undercut szabály sérül",
  "undercut-drift": `a publikus ár több mint 2%-kal a −${DEFAULT_UNDERCUT_PCT}% undercut cél fölött van`,
};

function money(n) {
  return new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function eur(n) {
  return new Intl.NumberFormat("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

assertRules();

const featured = loadFeatured(read("src/data/catalog.ts"));
const competitors = loadCompetitors(read("src/data/competitor.server.ts"));
if (featured.length === 0) {
  console.error("nincs publikus featuredPrice a katalógusban");
  process.exit(1);
}
if (competitors.length === 0) {
  console.error("nincs konkurens minta az admin árrés modulban");
  process.exit(1);
}

const { rate, date } = await loadRate();
const { path: costPath, costs } = loadCosts();

console.log(`EUR/HUF ${date}: 1 € = ${rate.toFixed(2)} Ft (ECB, frankfurter.dev)`);
console.log(
  `Szabály: undercut ${DEFAULT_UNDERCUT_PCT}%, cél árrés ${DEFAULT_TARGET_MARGIN_PCT}%, minimum markup ${MIN_MARKUP_PCT}%, ÁFA ×${VAT_MULTIPLIER}`,
);
console.log(
  existsSync(costPath)
    ? `Beszállítói EUR alapár: ${costPath}`
    : "Beszállítói EUR alapár nincs megadva (private_data/supplier-eur.json). Minden publikus ár ellenőrizetlen.",
);
console.log("");

let fails = 0;
let warns = 0;

for (const product of featured) {
  const competitor = matchCompetitor(product.sku, competitors);
  const rawCost = costs[product.sku];
  const costEur = typeof rawCost === "number" ? rawCost : null;
  const verdict = evaluateListedPrice({
    publicNetHuf: product.netHuf,
    rate,
    costEur,
    competitorNetHuf: competitor?.competitorNetHuf ?? null,
  });
  if (verdict.severity === "fail") fails += 1;
  if (verdict.severity === "warn") warns += 1;

  const gross = Math.round(product.netHuf * VAT_MULTIPLIER);
  console.log(
    `${verdict.severity.toUpperCase()}  ${product.sku}  nettó ${money(product.netHuf)} Ft  bruttó ${money(gross)} Ft  (${product.variant})`,
  );
  if (competitor) {
    console.log(
      `       konkurens nettó ${money(competitor.competitorNetHuf)} Ft → −${DEFAULT_UNDERCUT_PCT}% cél ${money(verdict.targetNetFromCompetitor)} Ft`,
    );
  } else {
    console.log("       nincs párosított konkurens minta az admin árrés listában");
  }
  if (verdict.costHuf != null && verdict.markupPct != null && verdict.marginPct != null) {
    console.log(
      `       beszerzés ${eur(costEur)} € = ${money(verdict.costHuf)} Ft, árrés ${verdict.marginPct.toFixed(1)}%, markup ${verdict.markupPct.toFixed(0)}%`,
    );
  }
  if (verdict.maxCostEurForTargetMargin != null && verdict.maxCostEurForMinMarkup != null) {
    console.log(
      `       mai árfolyamon a ${DEFAULT_TARGET_MARGIN_PCT}% árréshez max ${eur(verdict.maxCostEurForTargetMargin)} €, a ${MIN_MARKUP_PCT}% markuphoz max ${eur(verdict.maxCostEurForMinMarkup)} €`,
    );
  }
  if (verdict.breakEvenRateForMinMarkup != null) {
    console.log(
      `       ${MIN_MARKUP_PCT}% markup töréspontja: 1 € = ${verdict.breakEvenRateForMinMarkup.toFixed(2)} Ft`,
    );
  }
  for (const flag of verdict.flags) {
    console.log(`       • ${FLAG_TEXT[flag] ?? flag}`);
  }
  console.log("");
}

console.log(`${featured.length} publikus ár, ${fails} hiba, ${warns} figyelmeztetés.`);
if (fails === 0) console.log("public price check ok");
process.exitCode = fails > 0 ? 1 : 0;
