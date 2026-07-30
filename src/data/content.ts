export interface ContentLink {
  label: string;
  href: string;
}

export interface ContentCategory {
  slug: string;
  name: string;
  technology: string;
  description: string;
  href: string;
}

export interface ContentFixedPriceProduct {
  slug: string;
  name: string;
  priceNetHuf: number;
  variant?: "standard" | "marketing";
}

export const CONTENT = {
  hero: {
    badge: "megbízható fényforrás beszállító · 15 000+ cikkszám",
    title: "A megfelelő projektor lámpamodul — kerülőutak nélkül.",
    subtitle:
      "Intézményi, vállalati és viszonteladói partnereinknek eredeti diszkont lámpamodult szállítunk: eredeti gyári izzó (Philips, Osram, Ushio, Phoenix) méretpontos utángyártott kerettel — átlagosan ~40% árelénnyel a teljes gyári cseremodulhoz képest, változatlan műszaki paraméterekkel.",
    deliveryNote: "A megrendeléstől a kézbesítésig jellemzően 6–12 munkanap.",
    image: "/projector-lamp-module.jpg",
    ctaPrimary: { label: "Katalógus megtekintése", href: "/katalogus" },
    ctaSecondary: { label: "Árajánlatot kérek", href: "/ajanlatkeres" },
  },

  fixedPrice: {
    badge: "AZONNAL RENDELHETŐ — FIX NETTÓ ÁR",
    heading: "Kiemelt lámpamodulok árajánlatkérés nélkül",
    description:
      "Ezekre a típusokra rögzített nettó árat adunk — áfás számlával, futárszolgálati kiszállítással. Egyedi tételekre továbbra is árajánlatot készítünk.",
    items: [
      { slug: "epson-elplp78", name: "Epson ELPLP78", priceNetHuf: 69400, variant: "standard" },
      { slug: "epson-elplp88", name: "Epson ELPLP88", priceNetHuf: 65200, variant: "marketing" },
      { slug: "optoma-bl-fp240d", name: "Optoma BL-FP240D", priceNetHuf: 97300, variant: "standard" },
      { slug: "viewsonic-rlc-118", name: "ViewSonic RLC-118", priceNetHuf: 112700, variant: "standard" },
      { slug: "nec-np15lp", name: "NEC NP15LP", priceNetHuf: 94500, variant: "standard" },
      { slug: "nec-np19lp", name: "NEC NP19LP", priceNetHuf: 99400, variant: "standard" },
    ] satisfies ContentFixedPriceProduct[],
  },

  valueProps: {
    heading: "Miért minket válasszon?",
    items: [
      {
        icon: "💰",
        title: "Beszerzés-optimalizálás",
        description:
          "Eredeti gyári izzós, méretpontos utángyártott kerettel készült lámpamodult kínálunk, dokumentált műszaki egyenértékűséggel — ugyanazt a fényerőt és élettartamot adja, mint a teljes gyári cseremodul, jelentősen kedvezőbb beszerzési költség mellett.",
      },
      {
        icon: "📦",
        title: "Ellátásbiztonság",
        description:
          "Nagyobb eszközparkot üzemeltető partnereinknek javasoljuk legalább 1 db tartalék cseremodul helyszíni tárolását. Egyedi szerződés keretében az eszközparkjukhoz illeszkedő készletet nálunk is előjegyezhetik.",
      },
      {
        icon: "🚚",
        title: "Logisztika",
        description:
          "Szerződött, megbízható futárszolgálati partnerrel a terméket a lehető leghamarabb a felhasználás helyére juttatjuk. Minden szállítmány áfás számlával, intézményi beszerzéshez igazodva.",
      },
    ],
  },

  audience: {
    badge: "KINEK DOLGOZUNK",
    heading: "Üzemeltetőknek, integrátoroknak, beszerzőknek",
    description:
      "Olyan szakembereknek dolgozunk, akik intézményi vagy vállalati környezetben felelnek a projektorok rendelkezésre állásáért. Kiszámítható átfutási idő, visszakereshető rendelési előzmény, számlázási és beszerzési folyamatokhoz igazított ügymenet.",
    items: [
      { icon: "🔧", title: "AV integrátorok", description: "Karbantartási szerződések kiszolgálása ismétlődő típusokkal, kiszámítható átfutással." },
      { icon: "🏫", title: "Intézményi üzemeltetők", description: "Felsőoktatás, közoktatás, képzési központok multimédiás technikusainak." },
      { icon: "🏢", title: "Vállalati karbantartók", description: "Tárgyalók, oktatótermek és ügyfélterek prezentációs technikájához." },
      { icon: "📋", title: "Beszerzők", description: "Tételes ajánlat, áfás számla. Egységes fizetési konstrukció: díjbekérő + banki átutalás." },
    ],
  },

  replacement: {
    badge: "CSERE NÉHÁNY PERC ALATT",
    heading: "Egy csavar, egy modul, kész.",
    description:
      "A modul mérete és csatlakozása megegyezik a gyári cseredarabbal: szervizfedél nyitása, régi modul kihúzása, új behelyezése, üzemórák nullázása. A típusspecifikus lépéseket a csere útmutató részletezi.",
    note: "A mechanikai elrendezés projektor-típusonként eltérhet az ábrán látható elvi vázlatnál.",
    image: "/lamp-replacement-diagram.png",
    ctaPrimary: { label: "Csere útmutató megnyitása", href: "/csere-utmutato" },
    ctaSecondary: { label: "Árajánlatot kérek", href: "/ajanlatkeres" },
  },

  categories: {
    badge: "KATEGÓRIÁK",
    heading: "Böngészés technológia szerint",
    items: [
      {
        slug: "uhp-uhe-projector-lamps",
        name: "UHP / UHE projektor izzók",
        technology: "Ultra-High Performance",
        description:
          "Higany rövid-ívű izzók egychipes és 3LCD projektorokhoz — előadótermek, tantermek, tárgyalók és digital signage rendszerek tipikus fényforrása.",
        href: "/kategoria/uhp-uhe-projector-lamps",
      },
      {
        slug: "nsh-projector-modules",
        name: "NSH projektor modulok",
        technology: "Neo Super High-pressure",
        description:
          "OEM-házas NSH lámpamodulok ellenőrzött ballaszt-kompatibilitással és integrált hőárnyékolással intézményi és vállalati telepítésekhez.",
        href: "/kategoria/nsh-projector-modules",
      },
      {
        slug: "xenon-short-arc",
        name: "Xenon rövid-ívű lámpák",
        technology: "Xenon Short-Arc",
        description:
          "Nagy fényerejű xenon lámpák digitális mozi projektorokhoz, fényszűrőkhöz és stúdiókhoz, ahol nappali fény színhűségére van szükség.",
        href: "/kategoria/xenon-short-arc",
      },
      {
        slug: "metal-halide-stage",
        name: "Fémhalogén és színpadi",
        technology: "HMI / MSR / MSD",
        description:
          "Kisülőlámpák színházi, építészeti és műsorszórási világítótestekhez, beleértve a HMI, MSR és MSD termékcsaládokat.",
        href: "/kategoria/metal-halide-stage",
      },
      {
        slug: "specialty-medical-uv",
        name: "Speciális orvosi és UV",
        technology: "Speciális kisülőlámpa",
        description:
          "Speciális izzók klinikai, laboratóriumi és ipari UV-szűrő berendezésekhez — visszakövethető specifikációval és tételes dokumentációval.",
        href: "/kategoria/specialty-medical-uv",
      },
    ] satisfies ContentCategory[],
  },

  cta: {
    heading: "Nem találja a cikkszámot?",
    description:
      "A katalóguson kívüli modulok túlnyomó többsége beszerezhető. Küldje el a projektor típusát vagy az izzó cikkszámát, és tételes ajánlattal válaszolunk.",
    cta: { label: "Árajánlatot kérek", href: "/ajanlatkeres" },
  },

  catalog: {
    heading: "Gyakran keresett lámpamodulok",
  },
} as const;
