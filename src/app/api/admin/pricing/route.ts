import { NextResponse } from "next/server";

import { getRawProducts } from "@/lib/data-provider";
import { competitorSamples } from "@/data/competitor.server";
import { adminAuthResponse, requireAdminUser } from "@/lib/admin-auth";
import { suggestOptimalPrice } from "@/lib/pricing/suggest";
import {
  DEFAULT_TARGET_MARGIN_PCT,
  DEFAULT_UNDERCUT_PCT,
} from "@/lib/pricing/eur-check.mjs";

export async function GET(request: Request) {
  try {
    await requireAdminUser();
    const { searchParams } = new URL(request.url);
    const targetMarginPct = Number(
      searchParams.get("targetMarginPct") ?? String(DEFAULT_TARGET_MARGIN_PCT),
    );
    const undercutPct = Number(searchParams.get("undercutPct") ?? String(DEFAULT_UNDERCUT_PCT));

    const products = getRawProducts();

    const rows = competitorSamples.map((sample) => {
      const matched = products.find((p) => {
        const name = String(p.name ?? "").toLowerCase();
        const slug = String(p.slug ?? "").toLowerCase();
        const model = sample.model.toLowerCase();
        return name.includes(model) || model.includes(name) || slug && model.includes(slug);
      });

      const costHuf =
        typeof matched?.costPrice === "number"
          ? matched.costPrice
          : typeof matched?.purchasePrice === "number"
            ? matched.purchasePrice
            : null;

      const suggestion = suggestOptimalPrice({
        costHuf,
        targetMarginPct,
        competitorNetHuf: sample.competitorNetHuf,
        undercutPct,
      });

      return {
        id: sample.id,
        model: sample.model,
        segment: sample.segment,
        stockStatus: sample.stockStatus,
        leadTime: sample.leadTime,
        currentPublicNetHuf: typeof matched?.price === "number" ? matched.price : null,
        productId: typeof matched?.id === "number" ? matched.id : null,
        hasCost: costHuf != null,
        competitorNetHuf: sample.competitorNetHuf,
        competitorGrossHuf: sample.competitorGrossHuf,
        suggestedNetHuf: suggestion.suggestedNetHuf,
        suggestedGrossHuf: suggestion.suggestedGrossHuf,
        achievedMarginPct:
          suggestion.marginPct != null ? Math.round(suggestion.marginPct * 10) / 10 : null,
        basis: suggestion.basis,
        targetMarginPct,
      };
    });

    return NextResponse.json({
      targetMarginPct,
      undercutPct,
      rows,
      note: "Beszállítói alapár (cost) soha nem szerepel a válaszban; csak hasCost flag.",
    });
  } catch (error) {
    return adminAuthResponse(error);
  }
}
