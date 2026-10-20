export const VAT_MULTIPLIER: number;
export const DEFAULT_UNDERCUT_PCT: number;
export const DEFAULT_TARGET_MARGIN_PCT: number;
export const MIN_MARKUP_PCT: number;

export function hufFromEur(costEur: number, rate: number): number | null;

export function undercutNet(competitorNetHuf: number, undercutPct?: number): number;

export function netForTargetMargin(costHuf: number, targetMarginPct?: number): number | null;

export function marginOf(
  sellNet: number,
  costHuf: number,
): { marginHuf: number; marginPct: number; markupPct: number };

export function bulbSellNet(input: {
  costHuf: number | null;
  competitorNetHuf: number | null;
  undercutPct?: number;
}): { price: number | null; mode: "undercut" | "double" | "none" };

export type ListedPriceFlag =
  | "missing-rate"
  | "missing-eur-cost"
  | "loss"
  | "below-min-markup"
  | "below-target-margin"
  | "above-competitor"
  | "undercut-drift";

export function evaluateListedPrice(input: {
  publicNetHuf: number;
  rate: number;
  costEur?: number | null;
  competitorNetHuf?: number | null;
  undercutPct?: number;
  targetMarginPct?: number;
  minMarkupPct?: number;
}): {
  flags: ListedPriceFlag[];
  severity: "ok" | "warn" | "fail";
  costHuf: number | null;
  marginPct: number | null;
  markupPct: number | null;
  targetNetFromCompetitor: number | null;
  gapVsUndercutHuf: number | null;
  maxCostEurForTargetMargin: number | null;
  maxCostEurForMinMarkup: number | null;
  breakEvenRateForMinMarkup: number | null;
};
