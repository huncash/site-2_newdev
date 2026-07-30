import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projektor lámpamodul csere — útmutató percek alatt | projektorlampacsere.hu",
  description: "Lépésenkénti útmutató a projektor lámpamodul házon belüli cseréjéhez: típusazonosítás, biztonság, beépítés, óraszámláló nullázás, beégetés.",
};

import { canonical } from "@/lib/seo";

function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">CSERE ÚTMUTATÓ</div>
      <div className="mt-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Lámpamodul csere házon belül — hét lépésben
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          A művelet eszközigénye és menete típusonként minimálisan eltér; szemléltetésként
          saját, általános képes változatunkat lásd az{" "}
        <Link href="/csere-utmutato/illusztralt" className="text-primary hover:underline">
          illusztrált lépéssor
        </Link>{" "}
        oldalon.
        </p>
      </div>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        A forgalmazott modulok mérete és csatlakozása megegyezik a gyári
        cseredarabéval, így a csere egy keresztcsavarhúzóval, szerviz nélkül,
        általában 5–10 perc alatt elvégezhető; az intézmény üzemeltetője,
        gondnoka vagy IT-munkatársa is végrehajthatja.
      </p>

      <div className="mt-8 border-l-2 border-primary pl-4 text-sm text-foreground bg-surface py-3 rounded-r">
        <strong>Biztonság:</strong> a csere előtt áramtalanítsa a készüléket és várjon legalább
        30 percet, amíg az izzó és környezete lehűl. Az izzó üvegét ne érintse csupasz kézzel —
        a bőrről származó zsír forró pontot okoz.
      </div>

      <ol className="mt-10 grid gap-6">
        <Step
          n="1"
          title="Azonosítsa a projektor és az izzó típusát"
          body="A projektor matricáján szerepel a modell (pl. Epson EB-X41), a régi modulon a cikkszám (pl. ELPLP96, NP41LP, 5J.J7L05.001). Az egyezést a katalógusban ellenőrizheti — kétség esetén küldje el az adatokat ajánlatkéréskor."
        />
        <Step
          n="2"
          title="Áramtalanítson és várja meg a lehűlést"
          body="Húzza ki a tápkábelt és várjon 30 percet. A forró izzó érintése sérülést okoz, a meleg készülék pedig megrövidítheti az új izzó élettartamát."
        />
        <Step
          n="3"
          title="Nyissa ki a szervizfedelet"
          body="A fedél a projektor tetején vagy oldalán található, 1–2 keresztcsavarral. A csavarok többnyire fogva maradnak — ügyeljen, hogy ne essenek a készülékbe."
        />
        <Step
          n="4"
          title="Húzza ki a régi modult"
          body="A modult 1–3 csavar tartja. Lazítás után a fogantyúnál vagy a felfogó füleknél egyenesen, oldalsó feszítés nélkül húzza ki a helyéről."
        />
        <Step
          n="5"
          title="Helyezze be az új modult"
          body="A modul csak egyféleképpen illeszthető. Nyomja a helyére ütközésig, húzza meg a csavart, majd tegye vissza a szervizfedelet. Az izzó üvegét ne érintse meg."
        />
        <Step
          n="6"
          title="Nullázza az üzemóra-számlálót"
          body="A menüben (Beállítások → Információ, vagy Karbantartás → Lámpa órák visszaállítása) nullázza a számlálót. Enélkül a projektor a régi izzó óráit folytatja és korán figyelmeztet a cserére."
        />
        <Step
          n="7"
          title="Égesse be az új izzót"
          body="Az első bekapcsoláskor hagyja működni a projektort megszakítás nélkül 30–60 percig. Ez stabilizálja a gőznyomást és érdemben növeli az élettartamot."
        />
      </ol>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">Amit érdemes előre tudni</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>· <strong className="text-foreground">Élettartam:</strong> normál módban 2 000–4 000, eco módban 4 000–8 000 üzemóra; az aktuális érték a projektor menüjében olvasható.</li>
          <li>· <strong className="text-foreground">Tárolás:</strong> beépítésig eredeti csomagolásában, fektetve, száraz helyen.</li>
          <li>· <strong className="text-foreground">Azonosíthatóság:</strong> minden modul gyári címkével és belső sorszámmal érkezik — leltárba könnyen felvehető.</li>
          <li>· <strong className="text-foreground">Csere visszáru:</strong> téves típusazonosítás esetén a bontatlan modult cseréljük.</li>
        </ul>
      </section>

      <div className="mt-12 border border-border rounded p-6 bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="font-medium text-foreground">Bizonytalan a típusazonosításban?</div>
          <p className="text-sm text-muted-foreground mt-1">
            Küldje el a projektor modellszámát vagy a régi modul cikkszámát — visszaigazoljuk a megfelelő darabot.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/katalogus" className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-background">
            Katalógus
          </Link>
          <Link href="/ajanlatkeres" className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded text-sm font-medium">
            Árajánlatot kérek
          </Link>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border border-border rounded p-5 flex gap-4">
      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
        {n}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <p className="text-muted-foreground mt-1.5 text-sm">{body}</p>
      </div>
    </li>
  );
}

export default GuidePage;
