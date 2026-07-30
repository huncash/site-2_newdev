import type { Product } from "@/data/catalog";

/**
 * Nettó Ft formázás magyar tipográfiával (keskeny non-breaking szóköz ezreseknél).
 */
function formatNetHuf(value: number): string {
  return `${value.toLocaleString("hu-HU").replace(/\u00A0/g, "\u202F")}\u202FFt`;
}

const VAT_RATE = 0.27;

type Variant = "card" | "detail";

export function PriceBadge({
  product,
  variant = "card",
}: {
  product: Product;
  variant?: Variant;
}) {
  const fp = product.featuredPrice;
  if (!fp) return null;
  const gross = Math.round(fp.netHuf * (1 + VAT_RATE));

  if (variant === "detail") {
    return (
      <div className="border border-border rounded p-4 bg-surface">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Eredeti diszkont lámpamodul
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {formatNetHuf(fp.netHuf)}
          </div>
          <div className="text-xs text-muted-foreground">+ ÁFA</div>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Bruttó: {formatNetHuf(gross)}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
      <div className="text-base font-semibold text-foreground">
        {formatNetHuf(fp.netHuf)}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        + ÁFA
      </div>
    </div>
  );
}