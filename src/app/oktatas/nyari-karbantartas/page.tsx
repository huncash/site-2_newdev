"use client";

import Link from "next/link";
import { canonical, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { TanevkezdesBanner } from "@/components/TanevkezdesBanner";
import { campaignPhase } from "@/lib/tanevkezdes";

function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/oktatas" className="hover:text-foreground">Oktatási intézményeknek</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Nyári karbantartás</span>
      </nav>

      <div className="mt-6">
        <TanevkezdesBanner variant="iskola" />
      </div>
      <div className="text-xs tracking-[0.25em] text-primary font-medium">NYÁRI KARBANTARTÁSI ABLAK</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Nyári projektor lámpacsere iskoláknak
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        A tanévvégi zárás és a szeptemberi indulás közötti 8–10 hét a hazai
        oktatási parkban a legkedvezőbb karbantartási ablak: ilyenkor a
        tantermek szabadok, az üzemeltetés zavarás nélkül dolgozhat, és egy
        összevont szállítmányban valamennyi cseremodul a helyszínen lehet
        szeptember 1-re. Cikk célja: egyetlen dokumentumból tervezhető
        legyen egy 30–150 vetítős intézményi park nyári lámpacseréje.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Miért éppen nyáron</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-foreground space-y-2">
        <li>A tantermi vetítők túlnyomó része az iskolai időszakban 4–8 üzemórát dolgozik naponta; a nyár az egyetlen olyan időablak, amikor a park érdemben nyugvópontra kerül.</li>
        <li>A karbantartó szakember hozzáférése a tantermekhez zavartalan — nem kell órarendhez, cseppgyakorlathoz igazodni.</li>
        <li>A szeptember 1-i indulás a legfontosabb fix határidő: egy elmaradó modul a tanévkezdés első hetét is ellehetetlenítheti.</li>
        <li>A júniusi–júliusi rendelésnél még a nem készletes, egyedi beszerzésű típusokra is bőven belefér a 6–12 munkanapos beszerzési átfutás.</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Tervezési ütemezés</h2>
      <ol className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
        <Step n="1" title="Június eleje — leltár" body="A park típusonkénti bontásban rögzítve (gyártó, típusszám, üzemóra, utolsó lámpacsere dátuma). Az üzemóra jellemzően a projektor OSD menüjében kiolvasható." />
        <Step n="2" title="Június vége — ajánlatkérés" body="Egyetlen összevont ajánlatkérés a teljes csereigényre. Tételes visszaigazolás egy munkanapon belül, típusonkénti egységárral és szállítási határidővel." />
        <Step n="3" title="Július eleje — megrendelés" body="Számlázz.hu díjbekérő + banki átutalás. A jóváírás után indul a beszerzés; készletes tételek 1–2, egyedi típusok 6–12 munkanap." />
        <Step n="4" title="Augusztus közepe — szállítás és beépítés" body="Összevont kézbesítés a karbantartó címére. A beépítés a szeptemberi indulásig kényelmesen befér a rendelkezésre álló időbe." />
      </ol>

      <div className="mt-10 border border-border rounded p-5 bg-surface">
        <h2 className="text-base font-semibold">Mit kell egy ajánlatkéréshez tudni?</h2>
        <p className="mt-2 text-sm text-foreground leading-relaxed">
          Minimum a projektor pontos típusszáma (pl. „Epson EB-X05"), vagy a
          régi lámpamodul cikkszáma (pl. „ELPLP96"). Ha egyik sem áll
          rendelkezésre, a projektor típustábláját (a készülék alján vagy
          hátulján) elég lefényképezni és mellékelni az ajánlatkéréshez —
          a többit tőlünk visszakapja tételesen.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Számlázás és fizetés</h2>
      <p className="mt-3 text-sm text-foreground leading-relaxed">
        Tételes áfás számla az intézmény nevére (27% ÁFA), a Számlázz.hu
        rendszerből kiállított díjbekérő banki átutalással történő
        teljesítése után indul a szállítás. A megrendelt tétel egy összegben
        vagy — több vetítőtípus esetén — tételesen elszámolható. Nagyobb
        mennyiségnél (10 db feletti tétel) mennyiségi kedvezményt biztosítunk;
        a konkrét mértéket az ajánlat rögzíti.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          onClick={() => trackEvent("cta_quote_click_oktatas", { source: "nyari_karbantartas" })}
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          Nyári csereigényre ajánlatot kérek
        </Link>
        <Link
          href="/oktatas"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          Vissza az oktatási aloldalra
        </Link>
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border border-border rounded p-4 flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
        {n}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
export default Page;
