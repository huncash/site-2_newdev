"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuoteForm } from "@/components/QuoteForm";

function QuotePageInner() {
  const sp = useSearchParams();
  const product = sp.get("product") ?? "";
  const sku = sp.get("sku") ?? "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">ÁRAJÁNLAT</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Tételes árajánlat projektor lámpamodulra
      </h1>
      <p className="text-muted-foreground mt-3">
        Adja meg a projektor típusát vagy az izzó cikkszámát és a kívánt mennyiséget. Ajánlatunk
        tartalmazza a nettó és bruttó egységárat, a készletállapotot és a várható szállítási időt.
        A modulokban a fényforrás eredeti gyári gyártmány (Philips, Osram, Ushio vagy Phoenix). Ha a
        megrendelés teljes gyári (OEM) kivitelű cseremodult igényel — például élő márkaszerviz-szerződés
        vagy belső eszközszabályzat miatt —, kérjük, jelezze a megjegyzés rovatban; arra is adunk
        tételes ajánlatot.
      </p>
      <div className="mt-8 border border-border rounded p-6 bg-card">
        <QuoteForm productName={product || undefined} sku={sku || undefined} />
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-12">Betöltés…</div>}>
      <QuotePageInner />
    </Suspense>
  );
}
