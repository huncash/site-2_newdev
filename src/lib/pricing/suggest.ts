/**
 * Árképzési javaslat — a versenytárs nettó ára alapján kalkulálja
 * a publikus bruttó eladási árat.
 *
 * Bemenet (mind opcionális, ahol nincs adat, ott a megfelelő mező null):
 *  - competitorNetHuf: a versenytárs nyilvános NETTÓ ára (Ft).
 *  - undercutPct:      hány %-kal menjünk a versenytárs nettó ára alá (default 20).
 *  - vatMultiplier:    bruttó szorzó (default 1.27).
 *  - costHuf:          beszerzési ár Ft-ban (csak a margin/markup számításhoz; SOSEM perzisztálódik).
 *
 * Kimenet:
 *  - suggestedNetHuf / suggestedGrossHuf: javasolt nettó és bruttó eladási ár.
 *  - marginHuf, marginPct, markupPct: csak ha költség is jött (egyébként null).
 */
export type SuggestInput = {
  competitorNetHuf: number | null;
  undercutPct?: number;
  vatMultiplier?: number;
  costHuf?: number | null;
};

export type SuggestResult = {
  suggestedNetHuf: number | null;
  suggestedGrossHuf: number | null;
  marginHuf: number | null;
  marginPct: number | null;
  markupPct: number | null;
  basis: "competitor-undercut" | "target-margin" | "blended" | "no-data";
};

export function suggestPrice(input: SuggestInput): SuggestResult {
  const undercut = input.undercutPct ?? 20;
  const vat = input.vatMultiplier ?? 1.27;

  if (!input.competitorNetHuf || input.competitorNetHuf <= 0) {
    return {
      suggestedNetHuf: null,
      suggestedGrossHuf: null,
      marginHuf: null,
      marginPct: null,
      markupPct: null,
      basis: "no-data",
    };
  }

  const suggestedNet = Math.round(input.competitorNetHuf * (1 - undercut / 100));
  const suggestedGross = Math.round(suggestedNet * vat);

  let marginHuf: number | null = null;
  let marginPct: number | null = null;
  let markupPct: number | null = null;

  if (input.costHuf && input.costHuf > 0) {
    marginHuf = suggestedNet - input.costHuf;
    marginPct = (marginHuf / suggestedNet) * 100;
    markupPct = (marginHuf / input.costHuf) * 100;
  }

  return {
    suggestedNetHuf: suggestedNet,
    suggestedGrossHuf: suggestedGross,
    marginHuf,
    marginPct,
    markupPct,
    basis: "competitor-undercut",
  };
}

/**
 * Optimális nettó eladási ár elvárt árrés % alapján:
 *   suggestedNet = cost / (1 - targetMarginPct/100)
 * Ha van konkurens nettó is, opcionálisan undercut-tel is számol, és a
 * magasabb (biztonságosabb árrés) ajánlatot adja vissza.
 */
export function suggestOptimalPrice(input: {
  costHuf: number | null;
  targetMarginPct: number;
  competitorNetHuf?: number | null;
  undercutPct?: number;
  vatMultiplier?: number;
}): SuggestResult {
  const vat = input.vatMultiplier ?? 1.27;
  const target = Math.min(90, Math.max(1, input.targetMarginPct));
  const cost = input.costHuf && input.costHuf > 0 ? input.costHuf : null;

  let marginBased: number | null = null;
  if (cost) {
    marginBased = Math.round(cost / (1 - target / 100));
  }

  const competitorBased =
    input.competitorNetHuf && input.competitorNetHuf > 0
      ? Math.round(input.competitorNetHuf * (1 - (input.undercutPct ?? 20) / 100))
      : null;

  let suggestedNet: number | null = null;
  let basis: SuggestResult["basis"] = "no-data";

  if (marginBased != null && competitorBased != null) {
    suggestedNet = Math.max(marginBased, competitorBased);
    basis = "blended";
  } else if (marginBased != null) {
    suggestedNet = marginBased;
    basis = "target-margin";
  } else if (competitorBased != null) {
    suggestedNet = competitorBased;
    basis = "competitor-undercut";
  }

  if (suggestedNet == null) {
    return {
      suggestedNetHuf: null,
      suggestedGrossHuf: null,
      marginHuf: null,
      marginPct: null,
      markupPct: null,
      basis: "no-data",
    };
  }

  const marginHuf = cost ? suggestedNet - cost : null;
  const marginPct = cost && suggestedNet > 0 ? (marginHuf! / suggestedNet) * 100 : null;
  const markupPct = cost && cost > 0 && marginHuf != null ? (marginHuf / cost) * 100 : null;

  return {
    suggestedNetHuf: suggestedNet,
    suggestedGrossHuf: Math.round(suggestedNet * vat),
    marginHuf,
    marginPct,
    markupPct,
    basis,
  };
}