"use client";

import Link from "next/link";
import { canonical, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { TanevkezdesBanner } from "@/components/TanevkezdesBanner";

function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/oktatas" className="hover:text-foreground">Oktatási intézményeknek</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Egyetemi park</span>
      </nav>

      <div className="mt-6">
        <TanevkezdesBanner variant="egyetem" />
      </div>
      <div className="text-xs tracking-[0.25em] text-primary font-medium">FELSŐOKTATÁS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Egyetemi előadótermi projektor lámpamodulok
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Egyetemi karok és kutatóintézetek jellemzően 50–300 vetítős
        eszközparkot üzemeltetnek: nagyelőadókban közepes-felső kategóriás
        (Epson EB-2xxx, NEC NP-P, BenQ MH-széria), szemináriumtermekben
        belépő kategóriás készülékek. Éves szinten a park 15–25%-a igényel
        lámpacserét — ez egy 200 fős karnál 30–50 modul, amit legcélszerűbb
        a nyári karbantartási ablakban egyszerre beszerezni.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Amit egyetemi partnereink várnak tőlünk</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-foreground space-y-2">
        <li>Egy összevont ajánlat többféle projektortípusra, tételes egységárral.</li>
        <li>Áfás számla az egyetem gazdasági szervezetének nevére (27% ÁFA), díjbekérő + banki átutalás.</li>
        <li>Kari szintű összevont kiszállítás — a portára vagy a műszaki csoport címére.</li>
        <li>Eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH) minden modulban — kérésre az izzógyártó eredetigazolásával.</li>
        <li>6 hónap / 500 üzemóra jótállás valamennyi diszkont kivitelre; teljes gyári (OEM) kivitelre külön ajánlat.</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Tipikus egyetemi vetítőmodellek</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Epson EB-2065, EB-2155W, EB-2247U, EB-975W, EB-1795F; NEC NP-P502H,
        NP-P525UL, NP-M311X, ME402X; BenQ MH760, MH684, MW855UST; Panasonic
        PT-VW540, PT-VZ580; Sony VPL-EX295, VPL-FHZ65. Mindegyikre
        rendelkezésre állunk — a teljes lista a{" "}
        <Link href="/projektor-modell" className="text-primary hover:underline">projektor modell adatlapokon</Link>{" "}
        elérhető.
      </p>

      <div className="mt-10 border border-border rounded p-5 bg-surface">
        <h2 className="text-base font-semibold">Ütemezés a szeptemberi tanévkezdésre</h2>
        <p className="mt-2 text-sm text-foreground leading-relaxed">
          A tapasztalatunk szerint a karok műszaki csoportja június utolsó
          vagy július első hetében szokta összeállítani a cseremodul-listát.
          Egyetlen ajánlatkéréssel és megrendeléssel a szállítást augusztus
          második felére garantáljuk, így a beépítésre 1,5–2 hét
          nyugodt idő marad a szeptemberi indulás előtt.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          onClick={() => trackEvent("cta_quote_click_oktatas", { source: "egyetem" })}
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          Egyetemi ajánlatot kérek
        </Link>
        <Link
          href="/oktatas/nyari-karbantartas"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          Nyári karbantartási ütemezés
        </Link>
      </div>
    </div>
  );
}
export default Page;
