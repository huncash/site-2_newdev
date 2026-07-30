import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iskolai és felsőoktatási projektor lámpacsere | projektorlampacsere.hu",
  description: "Projektor lámpamodul beszerzés általános iskoláknak, középiskoláknak, felsőoktatási intézményeknek. Költségvetés-barát ár, áfás számla, beszerzési (műszaki) egyenértékűségi nyilatkozat.",
};

import { canonical, SITE_URL } from "@/lib/seo";
import { TanevkezdesBanner } from "@/components/TanevkezdesBanner";
import { campaignPhase } from "@/lib/tanevkezdes";

const FAQ = [
  {
    q: "Milyen fizetési módot fogadnak el oktatási intézményektől?",
    a: "Minden ügyfél számára egységesen a Számlázz.hu rendszerből kiállított díjbekérő banki átutalással történő teljesítése után indítjuk a szállítást. Tételes áfás számla az intézmény nevére (27% ÁFA).",
  },
  {
    q: "Mennyi idő alatt szállítanak egy 30-50 vetítős iskolai park lámpamoduljait?",
    a: "Készletes tételek 1-2 munkanap, egyedi beszerzésű típusok 6-12 munkanap. Vegyes megrendelés esetén összevont szállítást vállalunk, jellemzően 2 hét alatt a teljes tétel a helyszínen van.",
  },
  {
    q: "Kapunk-e mennyiségi kedvezményt nagyobb tétel esetén?",
    a: "Igen. 10 darabot meghaladó tétel esetén típusfüggő mértékű mennyiségi kedvezményt biztosítunk; a konkrét érték az ajánlatban tételesen szerepel.",
  },
  {
    q: "Eredeti gyári izzót kapunk a modulban?",
    a: "Igen. A forgalmazott cseremodulokban minden esetben eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH, Phoenix) van; kérésre az izzógyártó eredetigazolását is mellékeljük.",
  },
  {
    q: "Mikor a legkedvezőbb egy iskolai park lámpacseréjét beütemezni?",
    a: "A nyári és a féléves szünet — ilyenkor a tantermek szabadok, és egy összevont szállítmányban valamennyi cseremodul időben a helyszínen lehet a tanévkezdésre.",
  },
];

function OktatasPage() {
  const phase = campaignPhase();
  const seasonalVisible = phase === "leadas" || phase === "evkezdes";
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Oktatási intézményeknek</span>
      </nav>
      <div className="mt-6">
        <TanevkezdesBanner variant="iskola" />
      </div>
      <div className="text-xs tracking-[0.25em] text-primary font-medium">OKTATÁSI INTÉZMÉNYEKNEK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Iskolai és felsőoktatási projektor lámpacsere
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Általános iskolák, középiskolák, szakképző központok és felsőoktatási
        intézmények tantermi és előadótermi projektorparkjához szállítunk
        eredeti gyári izzós lámpamodult. Egy mérsékelt méretű középiskola
        20–40 db, egy egyetemi kar 50–150 db vetítőt üzemeltet — éves szinten
        jellemzően 10–25%-uk lámpacsere-igényes. Az ellátást ehhez az
        ütemhez igazítjuk: tételesen árazott, áfás számlás, és a beszerzési
        szabályoknak megfelelő dokumentációval.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Tipikus oktatási vetítőtípusok</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        A hazai oktatási parkban a leggyakoribb cseretételek az Epson EB-X05,
        EB-X41, EB-S05, EB-W05, BenQ MS524, MX525, MW526, NEC V260, M300X,
        Acer X1240, P1500, Hitachi CP-X3041WN, CP-EX251N, valamint az
        interaktív, ultra-rövid távolságú Epson EB-685Wi, EB-595Wi és Hitachi
        iPJ-AW250N készülékek modulja. Mindegyikre rendelkezésre állunk —
        a teljes listát a{" "}
        <Link href="/projektor-modell" className="text-primary hover:underline">projektor modell adatlapokon</Link>{" "}
        találja.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Számlázás, fizetés, szállítás</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-foreground space-y-2">
        <li>Tételes, áfás számla az ADP-TOP Kft. nevére (27% ÁFA).</li>
        <li>Fizetés minden ügyfél számára egységesen: díjbekérő számla (Számlázz.hu) + banki átutalás; a jóváírás után indul a teljesítés.</li>
        <li>Készletes tételeknél 1–2 munkanapos belföldi kiszállítás, egyedi beszerzésnél 6–12 munkanap.</li>
        <li>Több vetítőtípushoz egyszerre érkező megrendelést egy összevont szállítmányban kézbesítjük.</li>
      </ul>

      <div className="mt-10 border border-border rounded p-5 bg-surface">
        <h2 className="text-base font-semibold">Tanévkezdés és karbantartási ablak</h2>
        <p className="mt-2 text-sm text-foreground leading-relaxed">
          A nyári és a féléves szünet a legkedvezőbb karbantartási ablak az
          intézményi parkok átfogó lámpacseréjére. Júniusi és januári hónapokra
          átlagosan 30–40%-kal nagyobb intézményi rendelési mennyiséget
          kezelünk; ezekre az időszakokra előzetes készletbiztosítást is
          tudunk vállalni. Kérjük, a tervezett mennyiséget legalább 3–4 héttel
          a karbantartási ablak előtt egyeztesse velünk.
        </p>
      </div>

      <h2 className="mt-14 text-xl font-semibold">Intézménytípus szerinti aloldalak</h2>
      <div className={`mt-4 grid md:grid-cols-2 ${seasonalVisible ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-4`}>
        {seasonalVisible ? (
          <>
            <Link href="/oktatas/tanevkezdes" className="border border-border rounded p-4 hover:bg-surface">
              <div className="text-sm font-medium text-foreground">Tanévkezdés</div>
              <p className="text-xs text-muted-foreground mt-2">Szeptember 1-i indulás előtti AV-ellenőrzés és soron kívüli lámpacsere.</p>
            </Link>
            <Link href="/oktatas/nyari-karbantartas" className="border border-border rounded p-4 hover:bg-surface">
              <div className="text-sm font-medium text-foreground">Nyári karbantartás</div>
              <p className="text-xs text-muted-foreground mt-2">Iskolai park cseremodul-tervezése a tanévvégi és a szeptemberi indulás közötti ablakra.</p>
            </Link>
          </>
        ) : null}
        <Link href="/oktatas/egyetem" className="border border-border rounded p-4 hover:bg-surface">
          <div className="text-sm font-medium text-foreground">Egyetemi park</div>
          <p className="text-xs text-muted-foreground mt-2">Karok és kutatóintézetek előadótermi vetítőinek összevont beszerzése.</p>
        </Link>
        <Link href="/oktatas/tankeruleti-kozpont" className="border border-border rounded p-4 hover:bg-surface">
          <div className="text-sm font-medium text-foreground">Tankerületi központ</div>
          <p className="text-xs text-muted-foreground mt-2">Több iskolát érintő összevont ajánlatkérés, iskolánkénti szállítás.</p>
        </Link>
      </div>

      <h2 className="mt-14 text-xl font-semibold">Gyakori kérdések</h2>
      <div className="mt-4 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="border border-border rounded p-4 group">
            <summary className="text-sm font-medium text-foreground cursor-pointer list-none flex justify-between items-center">
              <span>{f.q}</span>
              <span className="text-muted-foreground text-xs ml-3 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          Intézményi ajánlatot kérek
        </Link>
        <Link
          href="/b2b"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          B2B feltételek
        </Link>
      </div>
    </div>
  );
}
export default OktatasPage;
