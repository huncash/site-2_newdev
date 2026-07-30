import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Árképzés és átfutási idő — minőség, ár, idő hármasa | projektorlampacsere.hu",
  description: "Hogyan alakul a projektor lámpamodul ára és átfutási ideje? A minőség–ár–átfutási idő háromszög közgazdasági logikája, és miért éri meg időben tervezni a karbantartást.",
};

import { canonical } from "@/lib/seo";

function ArazasPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">
        ÁRKÉPZÉS · TANULMÁNY
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Minőség, ár és átfutási idő — a projektorlámpa-csere három alapváltozója
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        A projektor lámpamodul kereskedelmében három tényező alkotja az
        árképzés alapját: a fényforrás <strong>minősége</strong>, a tétel
        <strong> ára</strong>, és a vevőhöz történő eljuttatás{" "}
        <strong>átfutási ideje</strong>. Ez a három változó nem mozog
        egymástól függetlenül — közöttük közgazdasági értelemben kompromisszum
        van, amelyet érdemes tudatosan kezelni.
      </p>

      {/* Háromszög illusztráció */}
      <section className="mt-10 grid md:grid-cols-[1fr_1fr] gap-8 items-center border border-border rounded-lg p-6 bg-card">
        <TriangleDiagram />
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            A klasszikus „pick two” logika
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            A háromszög csúcsai a három cél: <strong>gyári minőség</strong>,{" "}
            <strong>kedvező ár</strong>, <strong>azonnali kiszállítás</strong>.
            Egy adott megrendelésnél jellemzően kettőt lehet maradéktalanul
            teljesíteni — a harmadik részben mindig elcsúszik.
          </p>
          <ul className="text-sm text-muted-foreground mt-3 space-y-1.5 list-disc pl-5">
            <li>
              <strong>Gyári minőség + azonnali csere</strong> — magasabb ár
              (készleten tartott, eredeti gyári izzós modul gyorsított
              kiszállítással).
            </li>
            <li>
              <strong>Gyári minőség + kedvező ár</strong> — tervezhető átfutási
              idő (jellemzően 6–12 munkanap). Elsődlegesen ajánlott választás:
              az eredeti diszkont lámpamodul.
            </li>
            <li>
              <strong>Kedvező ár + azonnali csere</strong> — kompromisszum a
              minőségben (nem ellenőrzött forrású, kompatibilis kategóriájú
              izzó), amit éppen ezért nem forgalmazunk. Kompatibilis (nem
              gyári márkájú) izzót elvi okból sem szerzünk be.
            </li>
          </ul>
          <div className="mt-5 border border-border rounded p-4 bg-surface">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Választható kivitelek — kizárólag eredeti gyári fényforrással
            </div>
            <ol className="mt-2 space-y-2 text-sm text-foreground leading-snug list-decimal pl-5">
              <li>
                <strong>Csak eredeti gyári izzó</strong> — foglalat / keret
                nélkül, AV-integrátor és márkaszerviz részére. A beépítés
                kockázata a Vevőt terheli.
              </li>
              <li>
                <strong>Eredeti diszkont lámpamodul</strong> — eredeti gyári
                izzó méretpontos utángyártott kerettel. Intézményi
                környezetben ajánlott alapértelmezett választás.
              </li>
              <li>
                <strong>Teljes gyári (OEM) cseremodul</strong> — gyári
                cikkszámmal és eredeti kerettel, magasabb árkategóriában;
                külön kérésre.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Magyarázó bekezdések */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          Miért olcsóbb a tervezett karbantartás?
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Egy modern projektor lámpamodulja a gyártó által megadott névleges
          élettartammal rendelkezik — ez jellemzően 2 000–6 000 üzemóra között
          mozog, üzemmódtól függően. A projektor a hátralévő óraszámot
          folyamatosan visszajelzi, így az élettartam végéhez közeledve
          előre látható, hogy mikor válik szükségessé a csere. Ez a
          tervezhetőség jelentős kereskedelmi értéket képvisel mindkét
          oldalon.
        </p>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          A piacon jelenleg több mint <strong>15 000 különböző projektor
          lámpamodul-cikkszám</strong> van forgalomban — ennek a teljes
          spektrumnak a folyamatos készleten tartása gazdaságilag nem
          racionális. A nagyobb forgalmú típusokból raktárkészletet képezünk;
          a ritkább modulokat a beszerzési csatornákon keresztül, célzott
          rendeléssel hozzuk be. Ha az ügyfél a karbantartást előre
          tervezi — például szemeszter vége előtt egy oktatási intézményben,
          vagy nyári leállás idejére egy konferenciaközpontban —, a
          6–12 munkanapos átfutási idő nem érinti a működést, viszont az
          árban érvényesíthetők a normál beszerzési láncon elérhető
          kondíciók. Ez tipikusan jelentős, kétszámjegyű százalékos
          megtakarítást jelent ahhoz az esethez képest, amikor sürgősen,
          prémium logisztikával kell pótolni egy kiégett izzót.
        </p>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          A „másnapra mindenképp legyen ott” forgatókönyv ezzel szemben
          szűkíti a választható forrásokat: csak az adott pillanatban
          készleten lévő, gyors logisztikát kínáló disztribútor jöhet szóba,
          jellemzően magasabb felárral. A minőségből nem engedünk — eredeti
          gyári izzó marad —, de az ár ilyenkor érzékelhetően emelkedik, és
          bizonyos ritkább típusoknál egyszerűen nincs is realisztikus
          „azonnali” opció.
        </p>
      </section>

      {/* Praktikus javaslat */}
      <section className="mt-10 border border-border rounded-lg p-6 bg-surface">
        <h2 className="text-lg font-semibold tracking-tight">
          Mit javaslunk a gyakorlatban?
        </h2>
        <ul className="text-sm text-muted-foreground mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>Olvassa le a hátralévő üzemórát</strong> a projektor
            menüjéből legalább félévente. A legtöbb modell figyelmeztet,
            amikor az élettartam 90%-át elérte — ez bőven elég idő a
            tervezett rendelésre.
          </li>
          <li>
            <strong>Több projektoros környezetben</strong> (intézmény,
            integrátor, üzemeltető) érdemes negyedévente átnézni az
            állományt és csoportos rendelést leadni a közelgő cserékre.
            Erre keret-megállapodással egyedi feltételeket biztosítunk.
          </li>
          <li>
            <strong>Sürgős cserénél</strong> is állunk rendelkezésre: a
            készleten lévő modulok 1–2 munkanapon belül kiszállíthatók.
            Ezt minden esetben tételes ajánlatban írásban rögzítjük.
          </li>
        </ul>
      </section>

      {/* Megrendelési menet */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          Hogyan rendelhet?
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          A megrendelés menete minden ügyfél számára egységes, egy egyszerű
          webáruházi B2B folyamatot követve.
        </p>
        <div className="mt-5 grid md:grid-cols-1 gap-4">
          <div className="border border-border rounded p-5">
            <div className="w-8 h-0.5 bg-primary mb-3" />
            <div className="font-medium text-foreground">Díjbekérő + banki átutalás</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Az ajánlat elfogadása után a Számlázz.hu rendszerből díjbekérőt
              állítunk ki a teljes összegről, banki átutalásra. A teljesítést a
              jóváírás visszaigazolása után indítjuk — munkaidőben (H–P 10–18)
              beérkezett utalás esetén akár az adott munkanapon. Áfás végszámla
              a teljesítéssel egyidejűleg, NAV Online Számla rendszerbe
              automatikusan továbbítva.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/ajanlatkeres"
            className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
          >
            Árajánlatot kérek (új ügyfél)
          </Link>
          <Link
            href="/b2b#partneri-ellatas"
            className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
          >
            Partneri konstrukció egyeztetése
          </Link>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
        >
          Tervezett árajánlat kérése
        </Link>
        <Link
          href="/megtakaritas"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Ár-arány bontás
        </Link>
        <Link
          href="/b2b"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          B2B keret-megállapodás
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SVG: Minőség — Ár — Átfutási idő háromszög (vonalrajz)                     */
/* -------------------------------------------------------------------------- */

function TriangleDiagram() {
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 360 320"
        role="img"
        aria-label="Minőség, ár és átfutási idő közötti kompromisszum: háromszög, melynek csúcsain a három cél, középen a tervezett karbantartás kompromisszuma."
        className="w-full h-auto"
      >
        {/* Külső háromszög */}
        <polygon
          points="180,40 320,270 40,270"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-foreground"
        />

        {/* Belső, halvány segédháromszög (súlypont jelzés) */}
        <polygon
          points="180,110 250,240 110,240"
          fill="color-mix(in oklab, var(--accent-amber) 10%, transparent)"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="3 3"
          className="text-muted-foreground"
        />

        {/* Csúcspontok – kis körök */}
        <circle cx="180" cy="40" r="4" fill="var(--accent-amber)" />
        <circle cx="320" cy="270" r="4" fill="var(--accent-amber)" />
        <circle cx="40" cy="270" r="4" fill="var(--accent-amber)" />

        {/* Súlypont a tervezett karbantartás jelölésére */}
        <circle
          cx="180"
          cy="195"
          r="6"
          fill="var(--accent-amber)"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-foreground"
        />

        {/* Csúcspont feliratok */}
        <text
          x="180"
          y="26"
          textAnchor="middle"
          fontSize="13"
          fontWeight={600}
          fill="currentColor"
          className="text-foreground"
          fontFamily="ui-sans-serif, system-ui"
        >
          Gyári minőség
        </text>

        <text
          x="320"
          y="290"
          textAnchor="middle"
          fontSize="13"
          fontWeight={600}
          fill="currentColor"
          className="text-foreground"
          fontFamily="ui-sans-serif, system-ui"
        >
          Kedvező ár
        </text>

        <text
          x="40"
          y="290"
          textAnchor="middle"
          fontSize="13"
          fontWeight={600}
          fill="currentColor"
          className="text-foreground"
          fontFamily="ui-sans-serif, system-ui"
        >
          Rövid átfutás
        </text>

        {/* Súlypont címke */}
        <text
          x="180"
          y="218"
          textAnchor="middle"
          fontSize="10"
          fontWeight={600}
          fill="var(--accent-amber)"
          fontFamily="ui-sans-serif, system-ui"
        >
          tervezett
        </text>
        <text
          x="180"
          y="230"
          textAnchor="middle"
          fontSize="10"
          fontWeight={600}
          fill="var(--accent-amber)"
          fontFamily="ui-sans-serif, system-ui"
        >
          karbantartás
        </text>

        {/* Élek menti címkék — melyik kettő kombináció jár együtt */}
        {/* Bal él: minőség + rövid átfutás */}
        <text
          x="92"
          y="155"
          fontSize="9"
          fill="currentColor"
          className="text-muted-foreground"
          fontFamily="ui-sans-serif, system-ui"
          transform="rotate(-58 92 155)"
        >
          minőség + gyors = magasabb ár
        </text>
        {/* Jobb él: minőség + kedvező ár */}
        <text
          x="220"
          y="138"
          fontSize="9"
          fill="currentColor"
          className="text-muted-foreground"
          fontFamily="ui-sans-serif, system-ui"
          transform="rotate(58 220 138)"
        >
          minőség + ár = tervezett átfutás
        </text>
        {/* Alsó él: ár + gyors */}
        <text
          x="180"
          y="284"
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          className="text-muted-foreground"
          fontFamily="ui-sans-serif, system-ui"
        >
          ár + gyors = minőségi kompromisszum (nem forgalmazzuk)
        </text>
      </svg>
      <figcaption className="mt-2 text-[11px] italic text-muted-foreground leading-snug">
        Sematikus ábra. A három cél közül egyszerre tipikusan kettő
        teljesíthető maradéktalanul; a középső, sárgával jelölt pont a
        tervezett karbantartás kiegyensúlyozott kompromisszuma.
      </figcaption>
    </figure>
  );
}

export default ArazasPage;
