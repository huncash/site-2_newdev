import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { applyApprovedNets, readApprovedPrices, writeApprovedPrices } from "@/lib/pricing/approved-prices.mjs";
import {
  approveTokenMatches,
  assertProposalApplicable,
  renderConfirmHtml,
  renderMessageHtml,
  renderSuccessHtml,
} from "@/lib/pricing/price-approve.mjs";

type PriceProposal = {
  version: 1;
  expiresAt: string;
  rateHufPerEur: number;
  rateSource: string;
  costs: Record<string, number>;
  changes: {
    sku: string;
    name: string;
    oldNetHuf: number;
    newNetHuf: number;
    costEur: number;
    costHuf: number;
  }[];
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOCK_MS = 20 * 60 * 1000;

function privateDir() {
  return join(process.cwd(), "private_data");
}

function html(status: number, body: string) {
  return new NextResponse(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

function humanNavigation(request: Request) {
  const purpose = `${request.headers.get("sec-purpose") ?? ""} ${request.headers.get("purpose") ?? ""}`.toLowerCase();
  if (purpose.includes("prefetch") || purpose.includes("preview")) return false;
  return (
    request.headers.get("sec-fetch-user") === "?1" &&
    request.headers.get("sec-fetch-mode") === "navigate"
  );
}

function readPending(): PriceProposal | null {
  const path = join(privateDir(), "price-approve-pending.json");
  if (!existsSync(path)) return null;
  const parsed = JSON.parse(readFileSync(path, "utf8")) as PriceProposal;
  return parsed;
}

function loadFeatured(source: string) {
  const found: { sku: string; name: string; netHuf: number; variant: string }[] = [];
  const re = /featuredPrice:\s*\{\s*netHuf:\s*(\d+)\s*,\s*variant:\s*"([^"]+)"\s*\}/g;
  for (const match of source.matchAll(re)) {
    const before = source.slice(Math.max(0, (match.index ?? 0) - 1800), match.index);
    const skus = [...before.matchAll(/sku:\s*"([^"]+)"/g)];
    const names = [...before.matchAll(/\n\s*name:\s*"([^"]+)"/g)];
    const sku = skus.at(-1)?.[1];
    const name = names.at(-1)?.[1];
    if (!sku || !name) throw new Error("publikus ár sorhoz nem tartozik cikkszám");
    found.push({ sku, name, netHuf: Number(match[1]), variant: match[2] });
  }
  return found;
}

function loadCosts() {
  const path = join(privateDir(), "supplier-eur.json");
  if (!existsSync(path)) return null;
  const parsed = JSON.parse(readFileSync(path, "utf8")) as Record<string, number>;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("private_data/supplier-eur.json objektum kell");
  }
  return parsed;
}

function acquireLock() {
  const path = join(privateDir(), "price-approve.lock");
  mkdirSync(privateDir(), { recursive: true });
  if (existsSync(path)) {
    const started = Number(readFileSync(path, "utf8"));
    if (Number.isFinite(started) && Date.now() - started < LOCK_MS) {
      return false;
    }
  }
  writeFileSync(path, String(Date.now()));
  return true;
}

function releaseLock() {
  const path = join(privateDir(), "price-approve.lock");
  if (existsSync(path)) rmSync(path, { force: true });
}

function writeBaseline(proposal: PriceProposal) {
  writeFileSync(
    join(privateDir(), "price-monitor-baseline.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        rateHufPerEur: proposal.rateHufPerEur,
        rateSource: proposal.rateSource,
        costs: proposal.costs,
      },
      null,
      2,
    ),
  );
}

function writeEventLog(proposal: PriceProposal, baseline: "ok" | "hiba") {
  const skus = proposal.changes.map((change) => `${change.sku} ${change.oldNetHuf}→${change.newNetHuf}`).join(", ");
  appendFileSync(
    join(privateDir(), "price-approve.log"),
    `${new Date().toISOString()} elfogadva ${skus} árfolyam=${proposal.rateHufPerEur} forrás=${proposal.rateSource} tárolás=private_data/approved-prices.json baseline=${baseline}\n`,
  );
}

async function executeApproval() {
  if (process.env.NODE_ENV !== "production" && process.env.PRICE_APPROVE_ALLOW_LOCAL !== "1") {
    return html(
      403,
      renderMessageHtml(
        "Helyi védelem",
        "Fejlesztői módban az élesítés nem fut. A szerveren a kattintás a private_data/approved-prices.json fájlba írja a nettó árakat.",
      ),
    );
  }
  if (!acquireLock()) {
    return html(409, renderMessageHtml("Élesítés már fut", "Egy korábbi jóváhagyás még dolgozik. Várd meg a végét."));
  }
  let pricesWritten = false;
  try {
    const proposal = readPending();
    if (!proposal) {
      return html(404, renderMessageHtml("Nincs várakozó árazás", "Nincs élő jóváhagyási csomag. A heti figyelő új levele hoz újat."));
    }
    const source = readFileSync(join(process.cwd(), "src", "data", "catalog.ts"), "utf8");
    const products = applyApprovedNets(loadFeatured(source), readApprovedPrices(process.cwd()));
    assertProposalApplicable(proposal, products, loadCosts());
    writeApprovedPrices(process.cwd(), proposal.changes);
    pricesWritten = true;
    let baseline: "ok" | "hiba" = "ok";
    try {
      writeBaseline(proposal);
    } catch (error) {
      baseline = "hiba";
      console.error("price-approve", error instanceof Error ? error.message : "baseline nem frissült");
    }
    writeEventLog(proposal, baseline);
    rmSync(join(privateDir(), "price-approve-pending.json"), { force: true });
    return html(200, renderSuccessHtml(proposal));
  } catch (error) {
    const message = error instanceof Error ? error.message : "az élesítés megállt";
    if (pricesWritten && existsSync(join(privateDir(), "price-approve-pending.json"))) {
      rmSync(join(privateDir(), "price-approve-pending.json"), { force: true });
    }
    if (!pricesWritten) console.error("price-approve", message);
    return html(
      500,
      renderMessageHtml(
        pricesWritten ? "Az árjegyzék megvan, a napló hiányzik" : "Az élesítés megállt",
        message,
      ),
    );
  } finally {
    releaseLock();
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!approveTokenMatches(token)) {
    return html(401, renderMessageHtml("Érvénytelen token", "A jóváhagyó link tokenje nem egyezik."));
  }
  if (!humanNavigation(request)) {
    try {
      const proposal = readPending();
      if (!proposal) {
        return html(404, renderMessageHtml("Nincs várakozó árazás", "Nincs élő jóváhagyási csomag."));
      }
      return html(200, renderConfirmHtml(proposal, token));
    } catch (error) {
      const message = error instanceof Error ? error.message : "a csomag nem olvasható";
      return html(500, renderMessageHtml("A csomag hibás", message));
    }
  }
  return executeApproval();
}

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  if (!approveTokenMatches(token)) {
    return html(401, renderMessageHtml("Érvénytelen token", "A jóváhagyó link tokenje nem egyezik."));
  }
  return executeApproval();
}
