import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kapcsolat — projektorlampacsere.hu projektor izzó és fényforrás",
  description: "Vegye fel velünk a kapcsolatot projektor lámpamodul beszerzéshez intézménynek vagy vállalatnak. Tételes, írásos ajánlattal válaszolunk.",
};

import { QuoteForm } from "@/components/QuoteForm";
import { canonical } from "@/lib/seo";

function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">KAPCSOLAT</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Vegye fel velünk a kapcsolatot</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Intézményi és vállalati ügyfeleinkkel közvetlenül dolgozunk együtt. Írjon, ha projektor izzó,
        speciális fényforrás vagy ipari világítás beszerzésére van szüksége.
      </p>
      <div className="mt-10 border border-border rounded p-6 bg-card text-sm">
        <div>
          <div className="font-medium text-foreground">Árajánlat kérés</div>
          <div className="mt-4">
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
