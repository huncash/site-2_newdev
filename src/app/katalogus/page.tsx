import { Suspense } from "react";
import { categories } from "@/data/catalog";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { publicProducts } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  const products = publicProducts();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogBrowser categories={categories} products={products} />
    </Suspense>
  );
}
