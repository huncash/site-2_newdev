import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektor távirányító pótlás — eredeti és kompatibilis | projektorlampacsere.hu",
  description: "Projektor távirányító (afstandsbediening) pótlása intézményi vetítőkhöz: Epson, Hitachi, NEC, Panasonic, BenQ, Sanyo, Mitsubishi. Eredeti és kompatibilis kivitel, tételes áfás számlával.",
};

import { canonical } from "@/lib/seo";

function TavkapcsoloPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Projektor távirányító pótlás</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">SZOLGÁLTATÁS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Projektor távirányító pótlás — eredeti és kompatibilis kivitel
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Az intézményi vetítőparkban a távirányító elvesztése vagy meghibásodása
        a leggyakoribb, mégis észrevétlen üzemeltetési akadály. Bizonyos
        gyártói menüpontok (lámpaszámláló-nullázás csere után, geometriai
        korrekció, hálózati beállítások) kizárólag a távirányítóról
        érhetők el — a karbantartás és a lámpamodul-csere ezért gyakran a
        pótlással kezdődik.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Tipikusan szállított típusok</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside marker:text-primary">
        <li><strong>Epson EB-S / EB-X / EB-W / EB-9 / EB-19</strong> széria távirányítók (153510800, 154346800, 162175400)</li>
        <li><strong>Hitachi / Dukane / Christie CP-X, CP-WX, CP-HD</strong> széria (HL02771, R002, R012)</li>
        <li><strong>NEC NP-V, NP-P, NP-PA, NP-M</strong> széria (RD-448E, RD-450C, RD-457E)</li>
        <li><strong>Panasonic PT-VX, PT-VW, PT-EX, PT-EZ</strong> széria (N2QAYA000093, N2QAYB000993)</li>
        <li><strong>BenQ MS / MX / MW / MH / TH</strong> széria (5J.J5G06.001, 5J.JCY06.001)</li>
        <li><strong>Sanyo PLC, Eiki LC, Mitsubishi XD/HD</strong> klasszikus szériák</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Eredeti vs kompatibilis</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Az eredeti gyári távirányító valamennyi vetítőfunkciót támogatja és
        gyári garanciával érkezik. A kompatibilis kivitel a tipikus napi
        üzemeltetési funkciókat (be-/kikapcsolás, bemenetválasztás, menü,
        nyilak, OK) lefedi, ára azonban töredéke az eredetinek. Iskolai
        és önkormányzati intézményi környezetben legtöbbször ez a megfelelő
        választás; a kettő közötti különbséget az ajánlatban tételesen
        kiajánljuk.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Megrendelés és számlázás</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A megrendelés előkészítéséhez a vetítő teljes típusszáma (pl. Epson
        EB-535W, NEC NP-P502W, Panasonic PT-VX610) szükséges; ennek alapján
        egy munkanapon belül tételes árajánlatot küldünk. Az ár a
        távirányítóra és a magyarországi kiszállításra terjed ki; bruttó
        áfás számlával számolunk el az ADP-TOP Kft. neve alatt.
      </p>

      <div className="mt-10 rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Kapcsolódó: a lámpamodul cseréje utáni{" "}
          <Link href="/csere-utmutato" className="text-primary hover:underline">
            lámpaszámláló-nullázás
          </Link>{" "}
          a legtöbb modellnél csak a távirányítóról végezhető el — ezért érdemes a két tételt egyszerre rendezni.
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
export default TavkapcsoloPage;
