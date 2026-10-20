/**
 * Jóváhagyott publikus nettó árak. A fájl a gitignore-olt private_data alatt van,
 * ezért a git reset --hard és a deploy nem írja felül.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SKU_RE = /^[A-Z0-9][A-Z0-9-]{1,32}$/;
const MAX_NET_HUF = 2_000_000;
const FILE_NAME = "approved-prices.json";

export function emptyApproved() {
  return { version: 1, updatedAt: null, prices: {} };
}

export function approvedPricesPath(root) {
  return join(root, "private_data", FILE_NAME);
}

export function parseApproved(parsed) {
  if (!parsed || parsed.version !== 1 || typeof parsed.prices !== "object" || parsed.prices === null || Array.isArray(parsed.prices)) {
    throw new Error("private_data/approved-prices.json érvénytelen");
  }
  const prices = {};
  for (const [sku, row] of Object.entries(parsed.prices)) {
    if (!SKU_RE.test(sku)) throw new Error("érvénytelen cikkszám az árjegyzékben");
    const net = row && row.netHuf;
    if (!Number.isInteger(net) || net < 1 || net > MAX_NET_HUF) {
      throw new Error(`${sku} jóváhagyott nettó ára érvénytelen`);
    }
    prices[sku] = { netHuf: net };
  }
  return {
    version: 1,
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    prices,
  };
}

export function readApprovedPrices(root) {
  const path = approvedPricesPath(root);
  if (!existsSync(path)) return emptyApproved();
  return parseApproved(JSON.parse(readFileSync(path, "utf8")));
}

export function loadApprovedPrices(root) {
  try {
    return { record: readApprovedPrices(root), warning: null };
  } catch (error) {
    const warning = error instanceof Error ? error.message : "az árjegyzék olvashatatlan";
    return { record: emptyApproved(), warning };
  }
}

export function applyApprovedNets(products, approved) {
  const prices = approved?.prices ?? {};
  return products.map((product) => {
    const row = prices[product.sku];
    if (!row) return product;
    return { ...product, netHuf: row.netHuf };
  });
}

export function overlayFeaturedPrices(products, approved) {
  const prices = approved?.prices ?? {};
  return products.map((product) => {
    if (!product.featuredPrice) return product;
    const row = prices[product.sku];
    if (!row) return product;
    return {
      ...product,
      featuredPrice: { ...product.featuredPrice, netHuf: row.netHuf },
    };
  });
}

export function writeApprovedPrices(root, changes) {
  const current = readApprovedPrices(root);
  const prices = { ...current.prices };
  for (const change of changes) {
    if (!change || !SKU_RE.test(change.sku)) throw new Error("érvénytelen cikkszám");
    if (!Number.isInteger(change.newNetHuf) || change.newNetHuf < 1 || change.newNetHuf > MAX_NET_HUF) {
      throw new Error(`${change.sku} új nettó ára érvénytelen`);
    }
    prices[change.sku] = { netHuf: change.newNetHuf };
  }
  const next = { version: 1, updatedAt: new Date().toISOString(), prices };
  const dir = join(root, "private_data");
  mkdirSync(dir, { recursive: true });
  const path = approvedPricesPath(root);
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`);
  renameSync(tmp, path);
  return next;
}
