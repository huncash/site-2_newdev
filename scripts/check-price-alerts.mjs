/**
 * Heti árfigyelő. Publikus árat NEM ír át — a webhook a private_data/approved-prices.json fájlba ír, kattintásra.
 *
 * Crontab — hétfő 07:15, Europe/Budapest (a szerveren egyszer):
 *
 *   CRON_TZ=Europe/Budapest
 *   15 7 * * 1 cd /var/www/site-2 && /usr/bin/node scripts/check-price-alerts.mjs >> /var/log/site-2-price-alert.log 2>&1
 *
 * A `node` útvonalát a szerveren `command -v node` adja. Kilépés: 0 nincs teendő,
 * 1 volt riasztás és az email kiment (vagy --dry-run), 2 riasztás volt, de az email nem ment ki.
 *
 * Beszállítói ár: private_data/supplier-eur.json
 *   { "ELPLP78": 120.5 }
 * Árfolyam: ECB napi XML, hiba esetén open.er-api.com, majd 363,40 Ft/€.
 * Cél árrés 40%, minimum markup 15%, ÁFA 27%.
 * SMTP a .env-ből (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM).
 * Ha nincs SMTP, a QuoteForm Web3Forms kulcsán megy a levél (a sablon a jóváhagyó URL-t kapja).
 * A token a gitignore-olt .env.local PRICE_APPROVE_TOKEN_ENC mezőjében van, AES-256-GCM-mel.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_TARGET_MARGIN_PCT,
  MIN_MARKUP_PCT,
  hufFromEur,
  marginOf,
  netForTargetMargin,
} from "../src/lib/pricing/eur-check.mjs";
import {
  FALLBACK_EUR_HUF_RATE,
  approveUrl,
  buildProposal,
  ceilForint,
  eur,
  fetchEurHufRate,
  loadProjectEnv,
  rateLabel,
  readApproveToken,
  redactSecrets,
  renderAlertEmail,
} from "../src/lib/pricing/price-approve.mjs";
import { applyApprovedNets, loadApprovedPrices } from "../src/lib/pricing/approved-prices.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALERT_TO = "adptopkft@gmail.com";
const COSTS_PATH = join(root, "private_data", "supplier-eur.json");
const BASELINE_PATH = join(root, "private_data", "price-monitor-baseline.json");
const PENDING_PATH = join(root, "private_data", "price-approve-pending.json");
const CATALOG_PATH = join(root, "src", "data", "catalog.ts");
const dryRun = process.argv.includes("--dry-run");

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
    found.push({ sku, name, netHuf: Number(match[1]), variant: match[2] });
  }
  return found;
}

function loadCosts() {
  if (!existsSync(COSTS_PATH)) return null;
  const parsed = JSON.parse(readFileSync(COSTS_PATH, "utf8"));
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("private_data/supplier-eur.json objektum kell: { \"CIKKSZAM\": 123.45 }");
  }
  return parsed;
}

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null;
  try {
    const parsed = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
    if (!parsed || typeof parsed !== "object" || typeof parsed.costs !== "object" || parsed.costs === null) {
      return null;
    }
    return parsed.costs;
  } catch {
    return null;
  }
}

function writeBaseline(rateInfo, costs) {
  mkdirSync(dirname(BASELINE_PATH), { recursive: true });
  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        rateHufPerEur: rateInfo.rate,
        rateSource: rateInfo.source,
        costs,
      },
      null,
      2,
    ),
  );
}

function web3formsKey() {
  if (process.env.WEB3FORMS_ACCESS_KEY) return process.env.WEB3FORMS_ACCESS_KEY;
  const source = readFileSync(join(root, "src", "components", "QuoteForm.tsx"), "utf8");
  const match = source.match(/WEB3FORMS_ACCESS_KEY\s*=\s*"([^"]+)"/);
  return match?.[1] ?? null;
}

function smtpConfig() {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST || "";
  const user = process.env.SMTP_USER || process.env.MAIL_USER || "";
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.MAIL_PASSWORD || "";
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || user;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
  if (!host || !user || !pass) return null;
  return { host, user, pass, from, port };
}

async function sendEmail(subject, text, html) {
  const to = process.env.PRICE_ALERT_EMAIL || ALERT_TO;
  const smtp = smtpConfig();
  if (smtp) {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    await transport.sendMail({ from: smtp.from, to, subject, text, html });
    return `smtp ${smtp.host}`;
  }

  const accessKey = web3formsKey();
  if (!accessKey) {
    throw new Error(
      "Nincs SMTP a .env-ben (SMTP_HOST, SMTP_USER, SMTP_PASS) és Web3Forms kulcs sem található.",
    );
  }
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject,
      from_name: "projektorlampacsere.hu árfigyelő",
      email: to,
      message: text,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Web3Forms HTTP ${response.status}`);
  }
  return "web3forms";
}

function buildAlerts(products, costs, previousCosts, rate) {
  const alerts = [];
  for (const product of products) {
    const raw = costs ? costs[product.sku] : undefined;
    const costEur = typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : null;
    const previous =
      previousCosts && typeof previousCosts[product.sku] === "number" ? previousCosts[product.sku] : null;
    const costIncreased = costEur != null && previous != null && costEur > previous + 0.009;
    const costHuf = costEur == null ? null : hufFromEur(costEur, rate);
    const stats = costHuf == null ? null : marginOf(product.netHuf, costHuf);
    const targetNet = costHuf == null ? null : ceilForint(netForTargetMargin(costHuf));
    const raiseNet = targetNet == null ? null : Math.max(0, targetNet - product.netHuf);
    const reasons = [];
    if (costEur == null) reasons.push("nincs rögzített beszállítói EUR alapár");
    if (stats && stats.marginHuf <= 0) reasons.push("a publikus ár a bekerülési ár alatt van");
    else if (stats && stats.markupPct < MIN_MARKUP_PCT) {
      reasons.push(`markup ${stats.markupPct.toFixed(1)}% — a ${MIN_MARKUP_PCT}% minimum alatt`);
    }
    if (stats && stats.marginPct < DEFAULT_TARGET_MARGIN_PCT && stats.marginHuf > 0) {
      reasons.push(`árrés ${stats.marginPct.toFixed(1)}% — a ${DEFAULT_TARGET_MARGIN_PCT}% cél alatt`);
    }
    if (costIncreased) reasons.push(`beszerzés drágult: ${eur(previous)} → ${eur(costEur)}`);
    if (reasons.length === 0) continue;
    alerts.push({ product, costEur, costHuf, stats, targetNet, raiseNet, reasons, previous });
  }
  return alerts;
}

function assertFormula() {
  const costHuf = hufFromEur(100, FALLBACK_EUR_HUF_RATE);
  const target = netForTargetMargin(costHuf);
  if (costHuf !== 36340) throw new Error("363,40-es átváltás elcsúszott");
  if (Math.round(target) !== 60567) throw new Error("40%-os célár képlet elcsúszott");
}

assertFormula();
loadProjectEnv(root);

const rateInfo = await fetchEurHufRate();
const approved = loadApprovedPrices(root);
if (approved.warning) console.error(approved.warning);
const products = applyApprovedNets(loadFeatured(readFileSync(CATALOG_PATH, "utf8")), approved.record);
if (products.length === 0) {
  console.error("nincs publikus featuredPrice");
  process.exitCode = 2;
} else {
  const costs = loadCosts();
  const previousCosts = loadBaseline();
  const alerts = buildAlerts(products, costs, previousCosts, rateInfo.rate);
  const proposal = buildProposal({
    products,
    costs,
    rate: rateInfo.rate,
    rateSource: rateInfo.source,
    asOf: rateInfo.asOf,
  });
  console.log(
    `Árfigyelő: ${products.length} publikus ár, ${rateLabel(rateInfo)}, ${alerts.length} tétel kér beavatkozást. Publikus ár nem változott.`,
  );

  if (alerts.length === 0) {
    if (!dryRun && costs) writeBaseline(rateInfo, costs);
    console.log("nincs riasztás");
    process.exitCode = 0;
  } else {
    let href = null;
    let missingButtonReason = null;
    if (proposal.changes.length === 0) {
      missingButtonReason =
        "Jóváhagyó gomb nincs: egyetlen tételnél sem számolható új nettó ár. Hiányzik az EUR alapár, vagy a publikus ár már a 40% célon van.";
    } else {
      try {
        const token = readApproveToken();
        if (token) href = approveUrl(token);
        else missingButtonReason = "Jóváhagyó gomb nincs: a PRICE_APPROVE_TOKEN_ENC nincs beállítva a .env.local fájlban.";
      } catch (error) {
        console.error(error instanceof Error ? error.message : "a jóváhagyó token nem olvasható");
        missingButtonReason = "Jóváhagyó gomb nincs: a titkosított token nem olvasható.";
      }
    }
    const subject = `[projektorlampacsere.hu] Heti árfigyelő — ${alerts.length} tétel beavatkozást kér`;
    const mail = renderAlertEmail({ rateInfo, rows: alerts, approveUrl: href, missingButtonReason });
    console.log(redactSecrets(mail.text));
    if (dryRun) {
      console.log("dry-run: email nem ment ki, baseline és jóváhagyási csomag nem frissült");
      process.exitCode = 1;
    } else {
      if (href) {
        mkdirSync(dirname(PENDING_PATH), { recursive: true });
        writeFileSync(PENDING_PATH, JSON.stringify(proposal, null, 2));
      }
      try {
        const channel = await sendEmail(subject, mail.text, mail.html);
        console.log(`email elküldve (${channel}) → ${process.env.PRICE_ALERT_EMAIL || ALERT_TO}`);
        process.exitCode = 1;
      } catch (error) {
        if (href && existsSync(PENDING_PATH)) rmSync(PENDING_PATH, { force: true });
        console.error(error instanceof Error ? error.message : "email küldés sikertelen");
        console.error("baseline nem frissült, a következő futás újra jelzi a drágulást");
        process.exitCode = 2;
      }
    }
  }
}
