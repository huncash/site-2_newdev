import Link from "next/link";
import type { Product } from "@/data/catalog";
import { getCategory, getProductStock } from "@/data/catalog";
import { PriceBadge } from "@/components/PriceBadge";

const lampLineDrawing = "/assets/lamp-line-drawing.png";
const uhpUheLampLineDrawing = "/assets/uhp-uhe-lamp-line-drawing.png";
const nshLampLineDrawing = "/assets/nsh-lamp-line-drawing.png";
const xenonLampLineDrawing = "/assets/xenon-lamp-line-drawing.png";
const metalHalideLampLineDrawing = "/assets/metal-halide-lamp-line-drawing.png";
const uvMedicalLampLineDrawing = "/assets/uv-medical-lamp-line-drawing.png";

export function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.categorySlug);
  const stock = getProductStock(product);
  const productImage =
    product.categorySlug === "uhp-uhe-projector-lamps"
      ? uhpUheLampLineDrawing
      : product.categorySlug === "nsh-projector-modules"
        ? nshLampLineDrawing
        : product.categorySlug === "xenon-short-arc"
          ? xenonLampLineDrawing
          : product.categorySlug === "metal-halide-stage"
            ? metalHalideLampLineDrawing
            : product.categorySlug === "specialty-medical-uv"
              ? uvMedicalLampLineDrawing
              : lampLineDrawing;
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-card border border-border rounded p-4 transition hover:border-primary hover:shadow-sm flex flex-col"
    >
      <div className="aspect-video bg-surface-muted rounded mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={productImage}
          alt={`${product.name} — illusztratív vonalrajz`}
          loading="lazy"
          width={768}
          height={512}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
      <div className="text-[10px] tracking-widest text-primary font-medium uppercase">
        {cat?.shortName ?? "Izzó"}
      </div>
      <div className="text-sm font-medium text-foreground mt-1 group-hover:text-primary">
        {product.name}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Cikkszám: {product.sku} · {product.wattage}
      </div>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{product.shortDescription}</p>
      <PriceBadge product={product} />
      <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-tight">
          eredeti diszkont lámpamodul
        </div>
        <StockBadge
          status={stock.status}
          leadTimeBusinessDays={stock.leadTimeBusinessDays}
          isFeatured={!!product.featuredPrice}
        />
      </div>
    </Link>
  );
}

function StockBadge({
  status,
  leadTimeBusinessDays,
  isFeatured,
}: {
  status: "in_stock" | "lead_time" | "on_request";
  leadTimeBusinessDays?: number;
  isFeatured?: boolean;
}) {
  if (isFeatured) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-100 text-green-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> 4–8 munkanap
      </span>
    );
  }
  if (status === "in_stock") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-soft text-primary-deep">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-deep" /> Raktáron
      </span>
    );
  }
  if (status === "lead_time") {
    return (
      <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground">
        Átfutás · 6–12 munkanap
        {leadTimeBusinessDays != null ? ` (${leadTimeBusinessDays})` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground">
      Egyedi beszerzés
    </span>
  );
}
