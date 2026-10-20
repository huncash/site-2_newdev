import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mennyit takarít meg eredeti diszkont modullal? — projektorlampacsere.hu",
  description: "Az utángyártott projektor lámpamodul tipikusan az OEM cseremodul árának 25–55%-a — eredeti gyári izzóval, utángyártott műanyag kerettel. 16 anonim mintatétel %-os összehasonlítása.",
};

import {
  savingsSamples,
  averageAftermarketPct,
  averageSavingsPct,
} from "@/data/savings";
import { canonical } from "@/lib/seo";
import { chartColors, chartSurfaceProps } from "@/components/ui/chart-surface";

function MegtakaritasPage() {
  const avgAfter = averageAftermarketPct();
  const avgSave = averageSavingsPct();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">
        ÁRARÁNY
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        Mennyit takarít meg eredeti diszkont modullal?
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Az <strong>eredeti diszkont lámpamodul</strong> tipikusan a teljes
        gyári cseremodul árának{" "}
        <strong>{avgAfter}%-át</strong> teszi ki — a fennmaradó{" "}
        <strong>~{avgSave}% megtakarítás</strong> a Vevőnél marad, azonos
        műszaki paraméterek mellett (ugyanaz az eredeti gyári Philips / Osram /
        Ushio / Phoenix izzó, csak méretpontos utángyártott kerettel). Az
        alábbi összehasonlítás {savingsSamples.length} anonim mintatételen
        mutatja az ár-arányt; az értékek tájékoztató jellegűek, az adott típusra
        vonatkozó pontos árat az árajánlat tartalmazza.
      </p>

      {/* Magyarázó: miből áll a modul */}
      <section className="mt-10 grid md:grid-cols-[1.1fr_1fr] gap-8 items-start border border-border rounded-lg p-6 bg-card">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Miért lehet jelentősen olcsóbb?
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            A projektor házán belül a lámpamodul egy önálló, kicserélhető
            részegység — egy kompakt kazetta, amely a{" "}
            <strong>fényforrást (izzó)</strong> tartja egy{" "}
            <strong>műanyag keretben</strong>, a tükörrel és a csatlakozóval
            együtt. A projektor többi alkatrésze (optika, panelek, ház)
            változatlan marad. A fényforrás szabványosított: néhány nagy
            gyártó — Philips, Osram, Ushio, Phoenix — szállítja az iparág
            egészének, így az OEM cseremodulba és az utángyártott modulba is
            jellemzően <strong>ugyanaz az izzó</strong> kerül.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Az érdemi különbség a kazetta keretében van: a gyári logózott
            ház jelentős felárat hordoz, miközben funkcionálisan azonos egy
            méretpontos, fröccsöntött utángyártott kerettel. A piacon ezért
            elérhető — és általunk forgalmazott — az <strong>eredeti gyári
            izzót utángyártott házban tartalmazó modul</strong>: a fényerő,
            élettartam és színhőmérséklet megegyezik a gyári cseremodul
            értékével, az ár viszont töredéke. A modulokat készre szerelt
            formában szerezzük be a gyártói / forgalmazói láncból; saját
            műhelyi szerelést nem végzünk.
          </p>
        </div>
        <ModuleDiagram />
      </section>

      {/* Halmozott oszlopdiagram */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          Ár-arány mintatételeken — OEM = 100%
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Minden oszlop egy-egy anonim mintatétel. A teljes oszlop az OEM
          cseremodul árának felel meg (100%); az alsó, sárga szegmens mutatja
          az általunk kínált utángyártott modul árát ennek az
          arányában. A felső, sötét szegmens a megtakarítás. Az oszlopok alatt
          az adott modulba kerülő eredeti izzó gyártóját is feltüntettük.
        </p>
        <SavingsChart />
        <p className="text-[11px] italic text-muted-foreground mt-3 leading-snug">
          A diagram tájékoztató jellegű, anonim mintán alapul. Konkrét
          típushoz kapcsolódó árat és megtakarítást az egyedi árajánlatban
          adunk meg.
        </p>
      </section>

      {/* Konklúzió */}
      <section className="mt-10 border border-border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-semibold tracking-tight">Összegzés</h2>
        <p className="text-sm text-muted-foreground mt-3">
          A bemutatott mintán az utángyártott modulok átlagosan az OEM
          cseremodul árának <strong>{avgAfter}%-át</strong> teszik ki — vagyis
          típustól függően <strong>~{avgSave}% megtakarítás</strong> érhető el
          azonos műszaki paraméterek mellett. Mivel az izzó mindkét esetben
          ugyanattól a néhány gyártótól (Philips, Osram, Ushio, Phoenix)
          származik, a fényerő, élettartam és színhőmérséklet az OEM-mel
          megegyezik; a különbség kizárólag a foglalat keretének eredetében
          van.
        </p>
      </section>

      {/* Mennyiségi és törzsvásárlói kedvezmény */}
      <section className="mt-6 border border-border rounded-lg p-6 bg-surface">
        <h2 className="text-lg font-semibold tracking-tight">
          Mennyiségi és törzsvásárlói kedvezmények
        </h2>
        <p className="text-sm text-muted-foreground mt-3">
          Nagyobb darabszámú megrendelés esetén, valamint visszatérő,
          rendszeresen rendelő partnereink — intézmények, integrátorok és
          üzemeltetők — számára az itt bemutatott árszinten felül további
          kedvezményeket biztosítunk. A pontos feltételeket egyedi keret-
          megállapodásban rögzítjük.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="bg-cta text-cta-foreground hover:bg-cta-hover rounded px-5 py-2.5 text-sm font-medium"
        >
          Árajánlatot kérek a saját típusomra
        </Link>
        <Link
          href="/katalogus"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Katalógus
        </Link>
        <Link
          href="/b2b"
          className="border border-border rounded px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          B2B és intézményi feltételek
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SVG: vonalrajz arról, miből áll egy modul                                  */
/* -------------------------------------------------------------------------- */

function ModuleDiagram() {
  const surface = chartSurfaceProps({ className: "rounded-md p-3" });
  const c = chartColors;

  return (
    <figure className="m-0">
      <div className={surface.className} style={surface.style} data-chart-surface="light">
      <svg
        viewBox="0 0 380 260"
        role="img"
        aria-label="A projektoron belül a lámpamodul egy kis cserélhető kazetta: az eredeti gyári izzó utángyártott műanyag keretbe szerelve."
        className="w-full h-auto"
      >
        {/* ===== Projektor teste (a teljes készülék körvonala) ===== */}
        <rect
          x="30" y="70" width="190" height="120" rx="10"
          fill={c.wash}
          stroke={c.ink} strokeWidth="1.5"
        />
        {/* Lencse a projektor elején */}
        <circle
          cx="220" cy="130" r="14"
          fill={c.lens}
          stroke={c.ink} strokeWidth="1.2"
        />
        <circle
          cx="220" cy="130" r="7"
          fill="none" stroke={c.muted} strokeWidth="0.8"
        />
        {/* Szellőzőrácsok jelzése a házon */}
        <line x1="42" y1="80" x2="42" y2="180" stroke={c.muted} strokeWidth="0.5" />
        <line x1="48" y1="80" x2="48" y2="180" stroke={c.muted} strokeWidth="0.5" />
        {/* Lábak */}
        <rect x="60"  y="190" width="14" height="6" rx="1" fill={c.muted} />
        <rect x="180" y="190" width="14" height="6" rx="1" fill={c.muted} />
        {/* Halvány fénykúp a lencséből */}
        <path
          d="M 234 122 L 295 98 L 295 162 L 234 138 Z"
          fill={c.cta}
          fillOpacity="0.35"
          stroke={c.muted} strokeWidth="0.6"
          strokeDasharray="3 3"
        />

        {/* ===== Kiemelt kis lámpamodul (kazetta) a projektoron belül ===== */}
        {/* A modul a projektor hátsó felében, kicsi a teljes házhoz képest */}
        <g>
          {/* Kazetta keret (utángyártott műanyag) */}
          <rect
            x="78" y="108" width="64" height="58" rx="3"
            fill={c.amberWash}
            stroke={c.amber} strokeWidth="1.6"
          />
          {/* Kis tükör/reflektor a kazettán belül */}
          <path
            d="M 86 118 Q 80 137 86 156 L 112 152 Q 108 137 112 122 Z"
            fill="none"
            stroke={c.muted} strokeWidth="0.9"
          />
          {/* Eredeti gyári izzó (kerámia talp + égő) */}
          <rect
            x="116" y="129" width="8" height="16" rx="1"
            fill={c.primaryWash}
            stroke={c.ink} strokeWidth="0.9"
          />
          <ellipse
            cx="132" cy="137" rx="9" ry="6"
            fill={c.cta}
            stroke={c.ink} strokeWidth="0.9"
          />
          <line x1="127" y1="137" x2="137" y2="137"
                stroke={c.ctaDeep} strokeWidth="1.2" />
        </g>

        {/* ===== Hívóvonalak és feliratok ===== */}
        {/* Kazetta (utángyártott keret) */}
        <line x1="110" y1="166" x2="110" y2="210" stroke={c.amber} strokeWidth="0.9" />
        <text x="60" y="222" fontSize="10" fontWeight={600} fill={c.ink} fontFamily="ui-sans-serif, system-ui">
          Lámpamodul-kazetta
        </text>
        <text x="60" y="234" fontSize="9" fill={c.muted} fontFamily="ui-sans-serif, system-ui">
          (utángyártott műanyag keret)
        </text>

        {/* Eredeti izzó */}
        <line x1="132" y1="127" x2="132" y2="42" stroke={c.muted} strokeWidth="0.7" />
        <polygon points="132,131 128,123 136,123" fill={c.muted} />
        <text x="132" y="20" textAnchor="middle" fontSize="10" fontWeight={600} fill={c.ink} fontFamily="ui-sans-serif, system-ui">
          Eredeti gyári izzó
        </text>
        <text x="132" y="32" textAnchor="middle" fontSize="9" fill={c.muted} fontFamily="ui-sans-serif, system-ui">
          (Philips / Osram / Ushio / Phoenix)
        </text>
      </svg>
      <figcaption className="mt-2 text-[11px] italic leading-snug" style={{ color: c.muted }}>
        Sematikus illusztráció. A lámpamodul a projektor házán belül egy
        kicsi, cserélhető kazetta — az utángyártás csak ezt a kazettát érinti,
        a benne lévő izzó az eredeti gyári alkatrész. Az adott típus
        tényleges geometriája eltérhet.
      </figcaption>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  SVG: halmozott oszlopdiagram, OEM = 100%                                   */
/* -------------------------------------------------------------------------- */

function SavingsChart() {
  const surface = chartSurfaceProps({
    className: "mt-4 rounded-lg border border-[#E2E5EB] p-3",
  });
  const c = chartColors;
  const W = 640;
  const H = 340;
  const padL = 40;
  const padR = 14;
  const padT = 28;
  const padB = 72;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const n = savingsSamples.length;
  const gap = 12;
  const barW = (chartW - gap * (n - 1)) / n;

  const yFor = (pct: number) => padT + (chartH * (100 - pct)) / 100;

  const ticks = [0, 25, 50, 75, 100];
  const chipW = 36;
  const chipH = 14;
  const chipGap = 4;

  return (
    <div className={surface.className} style={surface.style} data-chart-surface="light">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Halmozott oszlopdiagram: OEM cseremodul ára 100%, az utángyártott modul ára ennek az arányában 10 mintatételen, az eredeti izzó gyártójával."
        className="w-full h-auto"
      >
        {/* Y tengely rácsvonalak + címkék */}
        {ticks.map((t) => {
          const y = yFor(t);
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke={c.grid}
                strokeWidth="0.5"
              />
              <text
                x={padL - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill={c.muted}
                fontFamily="ui-sans-serif, system-ui"
              >
                {t}%
              </text>
            </g>
          );
        })}

        {/* Oszlopok */}
        {savingsSamples.map((row, i) => {
          const x = padL + i * (barW + gap);
          const yTop = yFor(100); // teteje (OEM = 100%)
          const ySplit = yFor(row.aftermarketPct); // megtakarítás / utángyártott határa
          const yBase = yFor(0);
          const savePct = 100 - row.aftermarketPct;
          const cx = x + barW / 2;
          const chipY = yTop - chipGap - chipH;

          return (
            <g key={row.id}>
              {/* Felső szegmens: megtakarítás (OEM felárrész) */}
              <rect
                x={x}
                y={yTop}
                width={barW}
                height={ySplit - yTop}
                fill={c.savings}
              />
              {/* Alsó szegmens: utángyártott ár */}
              <rect
                x={x}
                y={ySplit}
                width={barW}
                height={yBase - ySplit}
                fill={c.cta}
              />
              {/* Értékfelirat az oszlop fölött, fix papírháttérrel — nem érhet bele a sávba */}
              <rect
                x={cx - chipW / 2}
                y={chipY}
                width={chipW}
                height={chipH}
                rx={2}
                fill={c.paper}
              />
              <text
                x={cx}
                y={chipY + 11}
                textAnchor="middle"
                fontSize="10"
                fontWeight={600}
                fill={c.ink}
                fontFamily="ui-sans-serif, system-ui"
              >
                −{savePct}%
              </text>
              {/* x tengely — sorszám */}
              <text
                x={cx}
                y={H - padB + 14}
                textAnchor="middle"
                fontSize="9"
                fill={c.muted}
                fontFamily="ui-sans-serif, system-ui"
              >
                #{row.id}
              </text>
              {/* Izzó gyártója */}
              <text
                x={cx}
                y={H - padB + 26}
                textAnchor="middle"
                fontSize="9"
                fontWeight={600}
                fill={c.ink}
                fontFamily="ui-sans-serif, system-ui"
              >
                {row.bulbBrand}
              </text>
              {/* Izzótípus */}
              <text
                x={cx}
                y={H - padB + 37}
                textAnchor="middle"
                fontSize="8"
                fill={c.muted}
                fontFamily="ui-sans-serif, system-ui"
              >
                {row.bulbSpec}
              </text>
            </g>
          );
        })}

        {/* X tengely */}
        <line
          x1={padL}
          x2={W - padR}
          y1={yFor(0)}
          y2={yFor(0)}
          stroke={c.grid}
          strokeWidth="1"
        />

        {/* Jelmagyarázat */}
        <g transform={`translate(${padL}, ${H - 14})`}>
          <rect width="12" height="10" fill={c.cta} />
          <text x="18" y="9" fontSize="9" fill={c.ink} fontFamily="ui-sans-serif, system-ui">
            Utángyártott modul ár (% az OEM-ből)
          </text>
          <rect x="220" width="12" height="10" fill={c.savings} />
          <text x="238" y="9" fontSize="9" fill={c.ink} fontFamily="ui-sans-serif, system-ui">
            Megtakarítás
          </text>
        </g>
      </svg>
    </div>
  );
}
export default MegtakaritasPage;
