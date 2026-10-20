/**
 * ECB EUR/HUF, jóváhagyási csomag és katalógus-ármódosítás.
 * A heti figyelő csak csomagot készít. Publikus árat a webhook ír, emberi kattintásra.
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DEFAULT_TARGET_MARGIN_PCT,
  VAT_MULTIPLIER,
  hufFromEur,
  netForTargetMargin,
} from "./eur-check.mjs";

export const FALLBACK_EUR_HUF_RATE = 363.4;
export const APPROVE_BASE_URL = "https://projektorlampacsere.hu";
const RATE_MIN = 300;
const RATE_MAX = 500;
const MAX_NET_HUF = 2_000_000;
const TOKEN_MIN = 24;
const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

const ECB_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const ER_API_URL = "https://open.er-api.com/v6/latest/EUR";

export function loadProjectEnv(root) {
  readEnv(join(root, ".env"), false);
  readEnv(join(root, ".env.local"), true);
}

function readEnv(path, override) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (override || process.env[key] == null || process.env[key] === "") process.env[key] = value;
  }
}

function secretKey() {
  const secret = process.env.SECRET_KEY?.trim();
  if (!secret || secret.length < 16) throw new Error("SECRET_KEY hiányzik");
  if (/^[0-9a-fA-F]{64}$/.test(secret)) return Buffer.from(secret, "hex");
  return createHash("sha256").update(secret, "utf8").digest();
}

export function sealApproveToken(plain) {
  if (typeof plain !== "string" || plain.length < TOKEN_MIN) {
    throw new Error("a token legalább 24 karakter");
  }
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, secretKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

export function openApproveToken(encoded) {
  const payload = Buffer.from(encoded, "base64url");
  if (payload.length < IV_LEN + TAG_LEN + 1) throw new Error("hibás token-titkosítás");
  const iv = payload.subarray(0, IV_LEN);
  const tag = payload.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = payload.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, secretKey(), iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  if (plain.length < TOKEN_MIN) throw new Error("a token túl rövid");
  return plain;
}

export function readApproveToken() {
  const encrypted = process.env.PRICE_APPROVE_TOKEN_ENC?.trim();
  if (encrypted) return openApproveToken(encrypted);
  return process.env.PRICE_APPROVE_TOKEN?.trim() ?? "";
}

export function approveTokenMatches(provided) {
  if (typeof provided !== "string" || provided.length < TOKEN_MIN) return false;
  let expected = "";
  try {
    expected = readApproveToken();
  } catch {
    return false;
  }
  if (expected.length < TOKEN_MIN) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function approveUrl(token, baseUrl = process.env.PRICE_APPROVE_BASE_URL || APPROVE_BASE_URL) {
  const base = String(baseUrl || APPROVE_BASE_URL).replace(/\/+$/, "");
  return `${base}/api/admin/price-approve?token=${encodeURIComponent(token)}`;
}

export function redactSecrets(text) {
  return String(text).replace(/token=[^&\s"'<>]+/g, "token=(rejtett)");
}

function inRange(rate) {
  return typeof rate === "number" && Number.isFinite(rate) && rate >= RATE_MIN && rate <= RATE_MAX;
}

async function loadEcb() {
  const response = await fetch(ECB_URL, {
    signal: AbortSignal.timeout(8000),
    headers: { accept: "application/xml,text/xml" },
  });
  if (!response.ok) throw new Error(`ECB HTTP ${response.status}`);
  const xml = await response.text();
  const dated = xml.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/);
  const rateMatch = xml.match(/currency=['"]HUF['"]\s+rate=['"]([0-9]+(?:\.[0-9]+)?)['"]/);
  if (!rateMatch) throw new Error("ECB válaszban nincs HUF");
  return { rate: Number(rateMatch[1]), source: "ecb.europa.eu", asOf: dated?.[1] ?? null };
}

async function loadOpenEr() {
  const response = await fetch(ER_API_URL, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`open.er-api HTTP ${response.status}`);
  const body = await response.json();
  const rate = body?.rates?.HUF;
  if (typeof rate !== "number") throw new Error("open.er-api válaszban nincs HUF");
  const asOf = typeof body.time_last_update_utc === "string" ? body.time_last_update_utc : null;
  return { rate, source: "open.er-api.com", asOf };
}

export async function fetchEurHufRate(loaders = [loadEcb, loadOpenEr]) {
  for (const load of loaders) {
    try {
      const got = await load();
      if (inRange(got.rate)) return { ...got, fallback: false };
    } catch {
      // a következő forrás, végül a rögzített 363,40
    }
  }
  return { rate: FALLBACK_EUR_HUF_RATE, source: "fallback", asOf: null, fallback: true };
}

export function ceilForint(value) {
  if (!Number.isFinite(value)) return null;
  const nearest = Math.round(value);
  if (Math.abs(value - nearest) < 1e-6) return nearest;
  return Math.ceil(value);
}

export function buildProposal({ products, costs, rate, rateSource, asOf }) {
  const now = new Date();
  const safeCosts = {};
  const changes = [];
  for (const product of products) {
    const raw = costs ? costs[product.sku] : undefined;
    if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) continue;
    safeCosts[product.sku] = raw;
    const costHuf = hufFromEur(raw, rate);
    const target = costHuf == null ? null : netForTargetMargin(costHuf);
    const newNetHuf = target == null ? null : ceilForint(target);
    if (newNetHuf == null || newNetHuf <= product.netHuf) continue;
    if (newNetHuf > MAX_NET_HUF) continue;
    changes.push({
      sku: product.sku,
      name: product.name,
      oldNetHuf: product.netHuf,
      newNetHuf,
      costEur: raw,
      costHuf,
      variant: product.variant,
    });
  }
  return {
    version: 1,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    rateHufPerEur: rate,
    rateSource,
    asOf: asOf ?? null,
    targetMarginPct: DEFAULT_TARGET_MARGIN_PCT,
    costs: safeCosts,
    changes,
  };
}

export function assertProposalApplicable(proposal, products, costs) {
  if (!proposal || proposal.version !== 1) throw new Error("ismeretlen jóváhagyási csomag");
  const expires = Date.parse(proposal.expiresAt);
  if (!Number.isFinite(expires) || expires < Date.now()) throw new Error("a jóváhagyási link lejárt");
  if (!inRange(proposal.rateHufPerEur)) throw new Error("a csomag árfolyama érvénytelen");
  if (!Array.isArray(proposal.changes) || proposal.changes.length === 0) {
    throw new Error("nincs jóváhagyható árváltozás");
  }
  const seen = new Set();
  for (const change of proposal.changes) {
    if (!change || typeof change.sku !== "string" || !/^[A-Z0-9][A-Z0-9-]{1,32}$/.test(change.sku)) {
      throw new Error("érvénytelen cikkszám a csomagban");
    }
    if (seen.has(change.sku)) throw new Error(`${change.sku} kétszer szerepel a csomagban`);
    seen.add(change.sku);
    const product = products.find((item) => item.sku === change.sku);
    if (!product) throw new Error(`${change.sku} nincs a publikus katalógusban`);
    if (product.netHuf !== change.oldNetHuf) {
      throw new Error(`${change.sku} publikus ára a levél óta megváltozott`);
    }
    const liveCost = costs ? costs[change.sku] : undefined;
    if (liveCost !== change.costEur) {
      throw new Error(`${change.sku} beszállítói EUR ára a levél óta megváltozott`);
    }
    const costHuf = hufFromEur(change.costEur, proposal.rateHufPerEur);
    const expected = costHuf == null ? null : ceilForint(netForTargetMargin(costHuf));
    if (expected == null || expected !== change.newNetHuf || expected > MAX_NET_HUF) {
      throw new Error(`${change.sku} célára nem egyezik a ${DEFAULT_TARGET_MARGIN_PCT}% képlettel`);
    }
  }
}

export function applyFeaturedNets(source, changes) {
  let next = source;
  for (const change of changes) {
    next = replaceFeaturedNet(next, change.sku, change.oldNetHuf, change.newNetHuf);
  }
  return next;
}

function replaceFeaturedNet(source, sku, oldNet, newNet) {
  const marker = `sku: "${sku}"`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`${sku} cikkszám hiányzik a katalógusból`);
  if (source.indexOf(marker, start + marker.length) >= 0) {
    throw new Error(`${sku} többször szerepel a katalógusban`);
  }
  const nextSku = source.indexOf("\n    sku:", start + marker.length);
  const end = nextSku < 0 ? source.length : nextSku;
  const region = source.slice(start, end);
  const match = region.match(/featuredPrice:\s*\{\s*netHuf:\s*(\d+)/);
  if (!match || match.index == null) throw new Error(`${sku}: nincs publikus nettó ár`);
  const current = Number(match[1]);
  if (current !== oldNet) throw new Error(`${sku} nettó ára ${current}, a csomag ${oldNet}-t vár`);
  const digitsAt = start + match.index + match[0].length - match[1].length;
  return source.slice(0, digitsAt) + String(newNet) + source.slice(digitsAt + match[1].length);
}

export function huf(value) {
  return `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(Math.round(value))} Ft`;
}

export function eur(value) {
  return `${new Intl.NumberFormat("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} €`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function rateLabel(rateInfo) {
  const rate = rateInfo.rate.toLocaleString("hu-HU");
  if (rateInfo.fallback) return `1 € = ${rate} Ft (ECB nem elérhető, rögzített tartalék)`;
  const when = rateInfo.asOf ? `, ${rateInfo.asOf}` : "";
  return `1 € = ${rate} Ft (${rateInfo.source}${when})`;
}

export function renderAlertEmail({ rateInfo, rows, approveUrl: href, missingButtonReason }) {
  const rule = `Szabály: cél árrés ${DEFAULT_TARGET_MARGIN_PCT}%, minimum markup 15%, ÁFA ${Math.round((VAT_MULTIPLIER - 1) * 100)}%.`;
  const intro =
    "A figyelő nem módosított publikus árat. Az élesítés a gomb kattintásakor indul.";
  const text = [
    "projektorlampacsere.hu heti árfigyelő",
    `Árfolyam: ${rateLabel(rateInfo)}`,
    rule,
    intro,
    "",
    ...rows.flatMap((row) => renderTextRow(row)),
    href
      ? `Árak elfogadása és élesítése: ${href}`
      : missingButtonReason || "Jóváhagyó gomb nincs: nincs kiszámolható áremelés.",
    "",
  ].join("\n");

  const bodyRows = rows
    .map((row) => {
      const cost =
        row.costEur == null
          ? "nincs EUR alapár"
          : `${esc(eur(row.costEur))}<br>${esc(huf(row.costHuf))}`;
      const margin =
        row.stats == null
          ? "—"
          : `${esc(row.stats.marginPct.toFixed(1))}%<br>markup ${esc(row.stats.markupPct.toFixed(1))}%`;
      const raise =
        row.raiseNet == null
          ? "nem számolható"
          : row.raiseNet === 0
            ? "emelés nem kell"
            : `+${esc(huf(row.raiseNet))}<br>cél ${esc(huf(row.targetNet))}`;
      return `<tr>
        <td><strong>${esc(row.product.sku)}</strong><br>${esc(row.product.name)}</td>
        <td>${cost}</td>
        <td>${esc(huf(row.product.netHuf))}</td>
        <td>${margin}</td>
        <td>${raise}</td>
      </tr>
      <tr><td colspan="5" style="color:#3d4654;padding-top:0;">${row.reasons.map((reason) => esc(reason)).join(" · ")}</td></tr>`;
    })
    .join("");

  const button = href
    ? `<p style="margin:24px 0;"><a href="${esc(href)}" style="display:inline-block;background:#1f7a3a;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:8px;">✅ Árak elfogadása és élesítése</a></p>
       <p style="font-size:13px;color:#3d4654;">A gomb a jóváhagyó címre visz. Ár, build és újraindítás csak ebből a kattintásból indul.</p>`
    : `<p>${esc(missingButtonReason || "Jóváhagyó gomb nincs ebben a levélben.")}</p>`;

  const html = `<!DOCTYPE html>
<html lang="hu"><body style="margin:0;background:#f4f6f8;color:#1a1f2e;font-family:Segoe UI,Arial,sans-serif;">
  <div style="max-width:720px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border:1px solid #e2e5eb;border-radius:12px;padding:24px;">
      <h1 style="font-size:20px;margin:0 0 8px;">Heti árfigyelő</h1>
      <p style="margin:0 0 4px;">Árfolyam: ${esc(rateLabel(rateInfo))}</p>
      <p style="margin:0 0 4px;">${esc(rule)}</p>
      <p style="margin:0 0 16px;">${esc(intro)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr>
          <th align="left">Cikkszám</th><th align="left">Beszerzés</th><th align="left">Publikus nettó</th><th align="left">Árrés</th><th align="left">Emelés a célhoz</th>
        </tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      ${button}
    </div>
  </div>
</body></html>`;
  return { text, html };
}

function renderTextRow(row) {
  const { product, costEur, costHuf, stats, targetNet, raiseNet, reasons } = row;
  const lines = [`${product.sku} — ${product.name}`];
  if (costEur == null) {
    lines.push("  Beszerzés: nincs adat a private_data/supplier-eur.json fájlban");
    lines.push(`  Publikus nettó: ${huf(product.netHuf)} (bruttó ${huf(product.netHuf * VAT_MULTIPLIER)})`);
    lines.push("  Áremelés nem számolható, amíg az EUR alapár hiányzik.");
  } else {
    lines.push(`  Beszerzés: ${eur(costEur)} = ${huf(costHuf)}`);
    lines.push(`  Publikus nettó: ${huf(product.netHuf)} (bruttó ${huf(product.netHuf * VAT_MULTIPLIER)})`);
    lines.push(
      `  Aktuális árrés: ${stats.marginPct.toFixed(1)}% (${huf(stats.marginHuf)}), markup: ${stats.markupPct.toFixed(1)}%`,
    );
    lines.push(
      raiseNet === 0
        ? `  A ${DEFAULT_TARGET_MARGIN_PCT}% cél árréshez emelés nem kell (cél nettó ${huf(targetNet)}).`
        : `  A ${DEFAULT_TARGET_MARGIN_PCT}% cél árréshez a nettó ár ${huf(targetNet)} legyen: +${huf(raiseNet)} (bruttó ${huf(targetNet * VAT_MULTIPLIER)}).`,
    );
  }
  for (const reason of reasons) lines.push(`  • ${reason}`);
  lines.push("");
  return lines;
}

function pageShell(title, body) {
  return `<!DOCTYPE html>
<html lang="hu"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f4f6f8;color:#1a1f2e;font-family:Segoe UI,Arial,sans-serif;">
  <main style="max-width:720px;margin:32px auto;background:#fff;border:1px solid #e2e5eb;border-radius:12px;padding:24px;">
    <h1 style="font-size:22px;margin:0 0 12px;">${esc(title)}</h1>
    ${body}
  </main>
</body></html>`;
}

export function renderConfirmHtml(proposal, token) {
  const rows = proposal.changes
    .map(
      (change) => `<tr>
        <td>${esc(change.sku)}</td>
        <td>${esc(eur(change.costEur))}</td>
        <td>${esc(huf(change.oldNetHuf))}</td>
        <td><strong>${esc(huf(change.newNetHuf))}</strong></td>
      </tr>`,
    )
    .join("");
  const body = `
    <p>Árfolyam a levélben: 1 € = ${esc(proposal.rateHufPerEur.toLocaleString("hu-HU"))} Ft (${esc(proposal.rateSource)}).</p>
    <p>Ez a lépés írja be az alábbi nettó árakat, lefut a build, majd a site-2 folyamat újraindul.</p>
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr><th align="left">Cikkszám</th><th align="left">EUR</th><th align="left">Most</th><th align="left">Új nettó</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <form method="POST" action="/api/admin/price-approve" style="margin-top:24px;">
      <input type="hidden" name="token" value="${esc(token)}">
      <button type="submit" style="background:#1f7a3a;color:#fff;border:0;font-weight:700;padding:12px 18px;border-radius:8px;cursor:pointer;">✅ Árak elfogadása és élesítése</button>
    </form>`;
  return pageShell("Árak jóváhagyása", body);
}

export function renderSuccessHtml(proposal) {
  const rows = proposal.changes
    .map(
      (change) =>
        `<li>${esc(change.sku)}: ${esc(huf(change.oldNetHuf))} → ${esc(huf(change.newNetHuf))}</li>`,
    )
    .join("");
  const body = `
    <p>A publikus nettó árak bekerültek a katalógusba, a build lefutott. A site-2 újraindítása most indul.</p>
    <ul>${rows}</ul>
    <p>Az eseménynapló a sikeres újraindítás után készül el.</p>`;
  return pageShell("Az árak élesítve", body);
}

export function renderMessageHtml(title, message) {
  return pageShell(title, `<p>${esc(message)}</p>`);
}
