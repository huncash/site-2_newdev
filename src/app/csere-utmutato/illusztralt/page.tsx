import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Illusztrált lámpamodul csere — képes lépéssor | projektorlampacsere.hu",
  description: "Általános, típusfüggetlen képes lépéssor projektor lámpamodul cseréjéhez: fedél nyitása, modul kiemelése, új modul beépítése, fedél visszahelyezése.",
};

import { canonical } from "@/lib/seo";

const collage1 = "/assets/csere/epson-steps-1-6.png";
const collage2 = "/assets/csere/epson-steps-7-11.png";

function IllustratedGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">CSERE ÚTMUTATÓ · ILLUSZTRÁLT</div>
      <div className="mt-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Lámpamodul csere — általános képes lépéssor
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Az alábbi leírás típusfüggetlen, általános érvényű útmutató. A konkrét
          modellek szervizfedele, csavarkiosztása és modulrögzítése apró
          részletekben eltérhet, de a műveleti sor lényege azonos. A kiegészítő
          lépéseket — lépésszámláló nullázása, beégetés — a{" "}
          <Link href="/csere-utmutato" className="text-primary hover:underline">
            csere útmutató főoldalán
          </Link>{" "}
          találja.
        </p>
      </div>

      <div className="mt-8 border-l-2 border-primary pl-4 text-sm text-foreground bg-surface py-3 rounded-r">
        <strong>Biztonsági figyelmeztetés:</strong> a csere megkezdése előtt
        kapcsolja ki a készüléket és húzza ki a hálózati kábelt. A lámpa
        biztonságos kezeléséhez hagyjon legalább egy óra hűlési időt — a forró
        lámpa égési sérülést okozhat. A csere a mennyezetre szerelt készüléken
        is elvégezhető, ha a hozzáférés ezt megengedi. Sérült lámpa esetén a
        lámpaházban üvegszilánkok maradhatnak; ezeket fokozott óvatossággal
        távolítsa el. A lámpa üvegfelületét ne érintse meg csupasz kézzel — a
        bőrről származó zsír forró pontot képez és lerövidíti az élettartamot.
        A használt lámpa higanyt tartalmaz; a hulladékkezelésre vonatkozó helyi
        előírások szerint, elkülönített gyűjtésben adja le, kommunális hulladék
        közé ne tegye.
      </div>

      <section className="mt-10">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Szükséges és javasolt eszközök
        </h2>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ToolItem
            icon={<ScrewdriverBitIcon />}
            label="Mellékelt csavarhúzó"
            note="Ha a cserelámpához adott szerelőszerszám rendelkezésre áll."
          />
          <ToolItem
            icon={<PhillipsScrewdriverIcon />}
            label="Általános keresztcsavarhúzó"
            note="Bármely közepes méretű, jó állapotú PH2 keresztcsavarhúzó megfelel."
          />
          <ToolItem
            icon={<GloveIcon />}
            label="Pamut- vagy szövetkesztyű"
            note="A lámpa üvegfelületének zsírmentes kezeléséhez."
          />
        </ul>
      </section>

      <ol className="mt-10 space-y-10">
        <Step
          label="1–6. lépés"
          title="A szervizfedél nyitása és a használt lámpamodul kiemelése"
          items={[
            "1. Kapcsolja ki a projektort és húzza ki a hálózati kábelt.",
            "2. Hagyja a lámpát legalább egy órán át hűlni.",
            "3. A cserelámpához mellékelt — vagy egy közönséges — keresztcsavarhúzóval lazítsa ki a szervizfedelet rögzítő csavart. Figyelmeztetés: ha a lámpa eltört, a lámpaházban üvegszilánkok maradhatnak; ezeket fokozott óvatossággal távolítsa el.",
            "4. Csúsztassa ki, majd emelje le a szervizfedelet.",
            "5. Lazítsa ki a lámpamodult a projektorhoz rögzítő csavarokat. A csavarok nem jönnek ki teljesen a helyükről.",
            "6. Kialakítástól függően a modul fogantyúja kihajtható: ez esetben hajtsa fel a fogantyút és óvatosan emelje ki a lámpát. Ha a modul nem rendelkezik fogantyúval, a kiemelkedő peremnél fogva, óvatos mozdulattal húzza ki a készülékből. Megjegyzés: a termék lámpája higanyt tartalmaz; a hulladékkezelésre vonatkozó helyi előírások szerint, elkülönített gyűjtésben adja le, kommunális hulladék közé ne tegye.",
          ]}
          img={collage1}
          footnote="Javasolt a művelet teljes ideje alatt tiszta pamut- vagy szövetkesztyűt viselni: így elkerülhető, hogy a bőrről származó zsír a lámpa üvegfelületére vagy a belső optikai elemekre kerüljön. A zsíros lenyomat a működés során forró pontot képez, amely jelentősen lerövidíti a lámpa élettartamát."
        />
        <Step
          label="7–9. lépés"
          title="Az új lámpamodul behelyezése és a szervizfedél visszazárása"
          items={[
            "7. Óvatosan illessze az új lámpát a projektorba. Ha az illesztés nem könnyű, ne erőltesse — ellenőrizze, hogy a megfelelő irányban áll-e. Kialakítástól függően a behelyezést követően hajtsa le a modul fogantyúját. Vigyázat: a lámpa üvegfelületét ne érintse meg, mert az a lámpa idő előtti tönkremenetelét okozhatja.",
            "8. Nyomja a helyére ütközésig a lámpát, és húzza meg a rögzítő csavarokat.",
            "9. Helyezze vissza a szervizfedelet, és húzza meg a rögzítőcsavart. Megjegyzés: ügyeljen rá, hogy a fedél megfelelően illeszkedjen — ha nincs a helyén, a lámpa nem fog bekapcsolni. A nyilvántartás pontossága érdekében ezt követően nullázza a lámpa üzemóra-számlálóját.",
          ]}
          img={collage2}
        />
      </ol>

      <p className="mt-6 text-xs text-muted-foreground">
        A fenti illusztrációk forrása: Epson America, Inc. —{" "}
        <a
          href="https://files.support.epson.com/docid/cpd5/cpd52412/source/maintenance/tasks/replacing_lamp_pl975w_2265u.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          PowerLite 2140W/2155W/2245U/2250U/2255U/2265U lámpacsere útmutató
        </a>
        . A képek a gyártó hivatalos szervizdokumentációjából származnak,
        szemléltető célból.
      </p>

      <section className="mt-14 border border-border rounded p-6 bg-surface">
        <h2 className="text-xl font-semibold tracking-tight">A művelet után</h2>
        <p className="text-sm text-muted-foreground mt-3">
          A csere fizikai része ezzel kész. A megbízható nyilvántartáshoz és az
          új lámpa hosszú élettartamához két további lépés szükséges: a
          készülék menüjében a lámpa üzemórájának nullázása, valamint az új
          lámpa megszakítás nélküli, 30–60 perces beégetése. Ezek részletes
          menetét a főoldali útmutató tartalmazza.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/csere-utmutato"
            className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-background"
          >
            Vissza a fő útmutatóhoz
          </Link>
          <Link
            href="/ajanlatkeres"
            className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded text-sm font-medium"
          >
            Árajánlatot kérek
          </Link>
        </div>
      </section>
    </div>
  );
}

function Step({
  label,
  title,
  body,
  items,
  img,
  footnote,
}: {
  label: string;
  title: string;
  body?: string;
  items?: string[];
  img: string;
  footnote?: string;
}) {
  return (
    <li className="border border-border rounded p-6">
      <div className="flex gap-4 items-start">
        <div className="px-3 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0 text-sm whitespace-nowrap">
          {label}
        </div>
        <div className="flex-1">
          <div className="font-medium text-foreground">{title}</div>
          {items ? (
            <ul className="text-muted-foreground mt-2 text-[13px] leading-relaxed space-y-1">
              {items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">{body}</p>
          )}
        </div>
      </div>
      <div className="mt-5 bg-white border border-border rounded overflow-hidden">
        <img
          src={img}
          alt={`${label} — ${title}`}
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-auto"
        />
      </div>
      {footnote ? (
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground border-l-2 border-primary pl-4">
          {footnote}
        </p>
      ) : null}
    </li>
  );
}

function ToolItem({
  icon,
  label,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
}) {
  return (
    <li className="border border-border rounded p-4 flex items-start gap-3 bg-surface">
      <div className="w-10 h-10 shrink-0 text-foreground">{icon}</div>
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <p className="text-[12px] leading-relaxed text-muted-foreground mt-1">{note}</p>
      </div>
    </li>
  );
}

/* Vékony vonalrajzos piktogramok — egységes stílus, currentColor. */

function ScrewdriverBitIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      {/* nyél */}
      <rect x="6" y="14" width="14" height="12" rx="2" />
      <line x1="9" y1="17" x2="9" y2="23" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="15" y1="17" x2="15" y2="23" />
      {/* tengely */}
      <line x1="20" y1="20" x2="30" y2="20" />
      {/* PH bit hegy */}
      <path d="M30 17.5 L34 17.5 L36 20 L34 22.5 L30 22.5 Z" />
      <line x1="32" y1="18.5" x2="32" y2="21.5" />
      <line x1="30.5" y1="20" x2="33.5" y2="20" />
    </svg>
  );
}

function PhillipsScrewdriverIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      {/* markolat — lekerekített */}
      <path d="M5 14 Q3 20 5 26 L14 26 L14 14 Z" />
      {/* gallér */}
      <rect x="14" y="16" width="3" height="8" />
      {/* tengely */}
      <line x1="17" y1="20" x2="32" y2="20" />
      {/* hegy — kereszt */}
      <path d="M32 18 L36 20 L32 22 Z" />
      <line x1="34" y1="19" x2="34" y2="21" />
    </svg>
  );
}

function GloveIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      {/* tenyér */}
      <path d="M14 34 L14 18 Q14 16 16 16 Q18 16 18 18 L18 22
               L20 22 L20 12 Q20 10 22 10 Q24 10 24 12 L24 22
               L26 22 L26 14 Q26 12 28 12 Q30 12 30 14 L30 22
               L32 22 Q34 22 34 24 L34 30 Q34 34 30 34 Z" />
      {/* mandzsetta */}
      <line x1="14" y1="32" x2="30" y2="32" />
    </svg>
  );
}

export default IllustratedGuide;
