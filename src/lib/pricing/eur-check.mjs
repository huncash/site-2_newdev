/**
 * Közös árrés-szabály az /admin/arres-kalkulacio és a publikus ár-ellenőrzés számára.
 *
 * Modul: eladási nettó = konkurens nettó × (1 − undercut), alapból 20%.
 * Izzó keret nélkül: ha van konkurens nettó, ugyanaz az undercut; különben beszerzés × 2.
 * Elvárt árrés: 40% (admin pricing API alapértelmezése).
 * Veszteségküszöb: 15% markup alatt az árfolyam már elviszi a fedezetet.
 * ÁFA: 27%.
 */

export const VAT_MULTIPLIER = 1.27;
export const DEFAULT_UNDERCUT_PCT = 20;
export const DEFAULT_TARGET_MARGIN_PCT = 40;
export const MIN_MARKUP_PCT = 15;

export function hufFromEur(costEur, rate) {
  if (!Number.isFinite(costEur) || costEur < 0) return null;
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return costEur * rate;
}

export function undercutNet(competitorNetHuf, undercutPct = DEFAULT_UNDERCUT_PCT) {
  return competitorNetHuf * (1 - undercutPct / 100);
}

/** Nettó eladási ár, amelyen a beszerzésre pontosan a cél árrés % marad. */
export function netForTargetMargin(costHuf, targetMarginPct = DEFAULT_TARGET_MARGIN_PCT) {
  if (!Number.isFinite(costHuf) || costHuf <= 0) return null;
  const target = Math.min(90, Math.max(1, targetMarginPct));
  return costHuf / (1 - target / 100);
}

export function marginOf(sellNet, costHuf) {
  const marginHuf = sellNet - costHuf;
  return {
    marginHuf,
    marginPct: sellNet > 0 ? (marginHuf / sellNet) * 100 : Number.NaN,
    markupPct: costHuf > 0 ? (marginHuf / costHuf) * 100 : Number.NaN,
  };
}

/** Keret nélküli izzó: konkurens undercut, különben beszerzés × 2. */
export function bulbSellNet({ costHuf, competitorNetHuf, undercutPct = DEFAULT_UNDERCUT_PCT }) {
  if (typeof competitorNetHuf === "number" && Number.isFinite(competitorNetHuf)) {
    return { price: undercutNet(competitorNetHuf, undercutPct), mode: "undercut" };
  }
  if (typeof costHuf === "number" && Number.isFinite(costHuf)) {
    return { price: costHuf * 2, mode: "double" };
  }
  return { price: null, mode: "none" };
}

const FAIL_FLAGS = new Set([
  "missing-rate",
  "missing-eur-cost",
  "loss",
  "below-min-markup",
  "above-competitor",
]);

/**
 * Publikus nettó HUF ár a mai EUR árfolyammal és a céges szabályokkal.
 * costEur hiányában a sor bukik: az árfolyam-fedezet nem bizonyítható.
 */
export function evaluateListedPrice(input) {
  const undercutPct = input.undercutPct ?? DEFAULT_UNDERCUT_PCT;
  const targetMarginPct = input.targetMarginPct ?? DEFAULT_TARGET_MARGIN_PCT;
  const minMarkupPct = input.minMarkupPct ?? MIN_MARKUP_PCT;
  const flags = [];
  const rateOk = Number.isFinite(input.rate) && input.rate > 0;
  if (!rateOk) flags.push("missing-rate");

  const publicNet = input.publicNetHuf;
  const competitor = input.competitorNetHuf;
  const hasCompetitor =
    typeof competitor === "number" && Number.isFinite(competitor) && competitor > 0;
  const targetNet = hasCompetitor ? undercutNet(competitor, undercutPct) : null;
  const gapVsUndercutHuf = targetNet == null ? null : publicNet - targetNet;

  if (hasCompetitor && publicNet > competitor) flags.push("above-competitor");
  else if (targetNet != null && publicNet > targetNet * 1.02) flags.push("undercut-drift");

  const hasCost =
    typeof input.costEur === "number" && Number.isFinite(input.costEur) && input.costEur > 0;
  const costHuf = hasCost && rateOk ? hufFromEur(input.costEur, input.rate) : null;

  let marginPct = null;
  let markupPct = null;
  if (!hasCost) {
    flags.push("missing-eur-cost");
  } else if (costHuf != null) {
    const stats = marginOf(publicNet, costHuf);
    marginPct = stats.marginPct;
    markupPct = stats.markupPct;
    if (stats.marginHuf <= 0) flags.push("loss");
    else if (markupPct < minMarkupPct) flags.push("below-min-markup");
    else if (marginPct < targetMarginPct) flags.push("below-target-margin");
  }

  const maxCostEurForTargetMargin = rateOk
    ? (publicNet * (1 - targetMarginPct / 100)) / input.rate
    : null;
  const maxCostEurForMinMarkup = rateOk ? publicNet / (1 + minMarkupPct / 100) / input.rate : null;
  const breakEvenRateForMinMarkup = hasCost
    ? publicNet / (1 + minMarkupPct / 100) / input.costEur
    : null;

  const severity = flags.some((flag) => FAIL_FLAGS.has(flag))
    ? "fail"
    : flags.length > 0
      ? "warn"
      : "ok";

  return {
    flags,
    severity,
    costHuf,
    marginPct,
    markupPct,
    targetNetFromCompetitor: targetNet,
    gapVsUndercutHuf,
    maxCostEurForTargetMargin,
    maxCostEurForMinMarkup,
    breakEvenRateForMinMarkup,
  };
}
