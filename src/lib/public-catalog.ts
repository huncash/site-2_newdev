import { unstable_noStore as noStore } from "next/cache";

import { products, type Product } from "@/data/catalog";
import { loadApprovedPrices, overlayFeaturedPrices } from "@/lib/pricing/approved-prices.mjs";

/** Kérésenként olvassa a gitignore-olt árjegyzéket. A katalógus forrása a tartalék ár. */
export function publicProducts(): Product[] {
  noStore();
  const { record, warning } = loadApprovedPrices(process.cwd());
  if (warning) console.error("approved-prices", warning);
  return overlayFeaturedPrices(products, record);
}

export function publicProduct(slug: string): Product | undefined {
  return publicProducts().find((product) => product.slug === slug);
}

export function publicProductsByCategory(slug: string): Product[] {
  return publicProducts().filter((product) => product.categorySlug === slug);
}
