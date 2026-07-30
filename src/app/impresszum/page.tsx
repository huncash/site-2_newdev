import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impresszum — projektorlampacsere.hu | ADP-TOP Kft.",
  description: "A projektorlampacsere.hu webhely üzemeltetőjének nyilvános adatai: ADP-TOP Kft., székhely, adószám, kapcsolat.",
};

import { company } from "@/data/company";
import { canonical } from "@/lib/seo";

function ImpresszumPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">IMPRESSZUM</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Impresszum</h1>
      <p className="text-muted-foreground mt-3 text-sm">
        A jelen weboldalt a {company.brandName} márkanév alatt az alábbi gazdasági társaság üzemelteti.
      </p>

      <dl className="mt-8 border-t border-border text-sm">
        <Row label="Üzemeltető cég" value={company.legalName} />
        <Row label="Rövidített név" value={company.shortName} />
        <Row label="Székhely" value={company.address.full} />
        <Row label="Adószám" value={company.taxNumber} />
        <Row label="Közösségi adószám" value={company.euVatNumber} />
        <Row
          label="Cégjegyzékszám"
          value={`${company.registryNumberPlaceholder} (${company.registryAuthority})`}
        />
        <Row label="Főtevékenység (TEÁOR)" value={company.mainActivity} />
        <Row label="Alapítás éve" value={String(company.foundedYear)} />
        <Row label="E-mail" value={company.email} />
        <Row label="Telefon" value={company.phone} />
      </dl>

      <h2 className="mt-12 text-lg font-semibold">Tárhelyszolgáltató</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A weboldal tárhelyszolgáltatójának adatai a hatályos tárhely-szolgáltatási
        szerződés szerint kerülnek feltüntetésre. A tárhelyszolgáltató pontos
        megnevezését, székhelyét és elérhetőségét az üzemeltető kérésre
        haladéktalanul rendelkezésre bocsátja.
      </p>

      <h2 className="mt-12 text-lg font-semibold">Felelős kapcsolattartás</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A weboldal tartalmával, megrendelésekkel és adatkezeléssel összefüggő
        megkereséseket az
        <a href={`mailto:${company.email}`} className="text-primary hover:underline"> {company.email}</a> címen fogadjuk.
      </p>

      <div className="mt-10 text-xs text-muted-foreground">
        További részleteket az{" "}
        <Link href="/aszf" className="text-primary hover:underline">Általános Szerződési Feltételekben</Link>{" "}
        és az{" "}
        <Link href="/adatvedelem" className="text-primary hover:underline">Adatkezelési tájékoztatóban</Link>{" "}
        olvashat.
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-border">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

export default ImpresszumPage;
