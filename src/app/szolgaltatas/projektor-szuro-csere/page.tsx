import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektor légszűrő csere és pótlás — projektorlampacsere.hu",
  description: "Projektor légszűrő (luchtfilter) beszerzés és csere intézményi vetítőkhöz. A szűrő rendszeres cseréje a lámpamodul élettartamának egyik legfontosabb előfeltétele. Tételes árajánlat, áfás számla.",
};

import { canonical } from "@/lib/seo";

function SzuroCserePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Projektor légszűrő csere</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">SZOLGÁLTATÁS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Projektor légszűrő csere és pótlás
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        A projektor légszűrője a hűtőlevegő útjába épített, rendszeres cserét
        igénylő alkatrész. A telített szűrő csökkenti a hűtés hatékonyságát,
        ami a lámpa-üzemhőmérséklet emelkedéséhez és — időben fel nem ismerve —
        akár az izzó idő előtti tönkremeneteléhez vezet. A rendszeres
        szűrőcsere ezért a lámpamodul élettartamának egyik legfontosabb,
        ugyanakkor leginkább alulértékelt karbantartási tétele.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Mikor szükséges szűrőcsere</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A gyártói előírás jellemzően <strong>500–1 000 üzemóra</strong>, illetve évi
        egy alkalom — amelyik előbb bekövetkezik. Poros környezetben (műhely,
        szakképző, ipari előadóterem) ez az időköz felére csökken. A vetítő
        legtöbb modellnél figyelmeztet, amint a szűrő-üzemóraszámláló elérte a
        gyári küszöböt — a karbantartó számára ez a riasztás az időben
        ütemezett szűrőcsere bevett triggere.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Mit szállítunk</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A hazai oktatási és intézményi parkban leggyakoribb légszűrőket
        készletről, illetve 1–6 munkanapos beszerzési idővel szállítjuk:
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside marker:text-primary">
        <li><strong>Hitachi / Dukane / Christie</strong> nagy installációs vetítők közös szűrői (pl. UX39551, MU06641 — CP-X / CP-WX / CP-HD szériák)</li>
        <li><strong>Panasonic PT-D, PT-DZ, PT-EX, PT-EZ</strong> installációs vetítők ET-RFM szűrői</li>
        <li><strong>NEC NP-P, NP-PA, NP-V</strong> széria szűrők (NP02FT, NP03FT)</li>
        <li><strong>Epson EB-1, EB-9, EB-19, EB-G</strong> széria ELPAF-szűrői</li>
        <li><strong>Sanyo / Eiki PLC, LC-szériák</strong> 610-cikkszámos szűrőtípusok</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Megrendelés és számlázás</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A megrendelés előkészítéséhez a vetítő pontos típusszáma (pl. Hitachi
        CP-X3041WN, Panasonic PT-EX620, NEC NP-P502W) szükséges; ennek
        alapján egy munkanapon belül tételes árajánlatot küldünk. Az árazás a
        szűrőre, a csomagolásra és a magyarországi kiszállításra terjed ki;
        bruttó áfás számlával számolunk el. A szűrőcserét magát a vetítő
        karbantartója pár perc alatt elvégzi — útmutatót a csomaghoz mellékelünk.
      </p>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Kapcsolódó: a tantermi vetítők megelőző karbantartási ütemezését az{" "}
          <Link href={`/blog/${"projektor-karbantartas-iskolaban" }`} className="text-primary hover:underline">
            iskolai karbantartási bejegyzésünk
          </Link>{" "}
          foglalja össze; a lámpamodul-csere ársávjait pedig a{" "}
          <Link href={`/blog/${"mennyibe-kerul-projektor-izzo-csere" }`} className="text-primary hover:underline">
            projektor izzó ár áttekintő
          </Link>{" "}
          mutatja.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/ajanlatkeres" className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          Tételes árajánlat kérése
        </Link>
        <Link href="/kapcsolat" className="inline-flex items-center px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-accent">
          Kapcsolatfelvétel
        </Link>
      </div>
    </div>
  );
}
export default SzuroCserePage;
