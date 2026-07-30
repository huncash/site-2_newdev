"use client";

import Link from "next/link";
import { canonical, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { TanevkezdesBanner } from "@/components/TanevkezdesBanner";
import { campaignPhase } from "@/lib/tanevkezdes";

const CHECKLIST = [
  "Bekapcsolás és felfutás — a vetítő elindul-e, hozza-e a névleges fényerőt?",
  "OSD üzemóra kiolvasása — az izzó a névleges élettartam 80%-a felett jár-e?",
  "Fehér kép teszt — nem sárgás, halványuló vagy foltos-e a kép?",
  "Színhőmérséklet — a fehér tartalom marad-e semleges, vagy zöldes/sárgás?",
  "Ventilátorzaj — érezhetően hangosabb-e Eco módban, mint korábban?",
  "Légszűrő állapota — porral eltömődött-e, tisztításra vagy cserére szorul-e?",
  '„Lamp" / „Warning" üzenet — a menü figyelmeztet-e a közeli lámpacserére?',
  "Távirányító — reagál-e minden gomb, van-e benne friss elem?",
  "Kábelek — HDMI/VGA/táp csatlakozók stabilak-e, nem lazultak-e meg?",
  "Cseremodul-tartalék — van-e a szertárban 1-1 db a leggyakoribb 2-3 vetítőtípusból?",
];

function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/oktatas" className="hover:text-foreground">Oktatási intézményeknek</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tanévkezdés</span>
      </nav>

      <div className="mt-6">
        <TanevkezdesBanner variant="iskola" />
      </div>
      <div className="text-xs tracking-[0.25em] text-primary font-medium">TANÉVKEZDÉS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Tanévkezdés előtti projektor ellenőrzés és soron kívüli lámpacsere
      </h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Ha a nyári karbantartási ablakból kifutottak, a tanévkezdés első
        két hete még mindig alkalmas az akadozó vetítők soron kívüli
        cseréjére — a készletes tételek 1–2 munkanap alatt a helyszínre
        érnek. A készlet nélküli, egyedi beszerzésű típusokra jellemzően
        6–12 munkanap az átfutás; ezt már érdemes az első tanítási hét
        előtt megrendelni, hogy szeptember második felére a park teljesen
        rendben legyen.
      </p>

      <h2 className="mt-10 text-xl font-semibold">10 pontos AV-check-lista</h2>
      <ol className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
        {CHECKLIST.map((item, i) => (
          <li key={i} className="border border-border rounded p-3 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
              {i + 1}
            </span>
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-semibold">Tipikus szeptemberi hibák</h2>
      <ul className="mt-3 list-disc pl-5 text-sm text-foreground space-y-2">
        <li><strong>Halvány, sárgás kép:</strong> az izzó a nyári üzemszünet után „bemelegedik", és láthatóvá válik, hogy a névleges élettartam vége felé jár. Tervezett csere még ezen a héten megoldható.</li>
        <li><strong>Nem indul, csak villog a jelzőfény:</strong> jellemzően a lámpamodul kiégett — soron kívüli csere kell, a készletes típusok másnapra a helyszínen vannak.</li>
        <li><strong>Hangosabb, gyakran leálló vetítő:</strong> eltömődött légszűrő + elhasználódott izzó együttese; a szűrő tisztításával, a modul cseréjével együtt oldható meg.</li>
        <li><strong>Nincs jel / távirányító nem reagál:</strong> a legolcsóbb tétel, gyakran csak új elem vagy pótolható távirányító — <Link href="/szolgaltatas/projektor-tavkapcsolo" className="text-primary hover:underline">részletek</Link>.</li>
      </ul>

      <div className="mt-10 border border-border rounded p-5 bg-surface">
        <h2 className="text-base font-semibold">Soron kívüli ajánlat egy munkanapon belül</h2>
        <p className="mt-2 text-sm text-foreground leading-relaxed">
          Küldje el a hibás vetítő pontos típusszámát (pl. „Epson EB-X05"),
          vagy fényképezze le a készülék típustábláját — a többit
          visszakapja tőlünk tételes áfás számla-ajánlattal, várható
          szállítási dátummal.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          onClick={() => trackEvent("cta_quote_click_oktatas", { source: "tanevkezdes" })}
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          Tanévkezdéshez ajánlatot kérek
        </Link>
        <Link
          href="/blog/av-karbantartasi-ellenorzo-lista"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          Részletes AV-check-lista blogposzt
        </Link>
      </div>
    </div>
  );
}
export default Page;
