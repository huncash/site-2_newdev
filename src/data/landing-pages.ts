// Kampányra alkalmas landing oldalak listája — a /admin/marketing AI
// hirdetéstervezet választója ebből dolgozik. Új landinget ide vegyünk fel.

export interface LandingPage {
  path: string;
  title: string;
  audience: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  brief: string;
}

export const landingPages: LandingPage[] = [
  {
    path: "/oktatas/nyari-karbantartas",
    title: "Nyári projektor lámpacsere iskoláknak",
    audience: "Iskolai IT / gondnok / karbantartó",
    primaryKeyword: "iskolai projektor lámpacsere nyár",
    supportingKeywords: [
      "tantermi vetítő lámpamodul",
      "iskola projektor karbantartás",
      "nyári karbantartási ablak",
    ],
    brief:
      "30–150 tantermi vetítő lámpamoduljának összevont cseréje a nyári szünetben, garantált szeptemberi szállítással.",
  },
  {
    path: "/oktatas/egyetem",
    title: "Egyetemi projektor lámpamodul beszerzés",
    audience: "Egyetemi kar műszaki csoport, AV-referens",
    primaryKeyword: "egyetemi projektor lámpamodul",
    supportingKeywords: [
      "kari projektor karbantartás",
      "előadóterem vetítő lámpa",
      "egyetemi AV karbantartás",
    ],
    brief:
      "Kari szintű, összevont cseremodul-lista tételes áfás számlával, az őszi félév kezdetére.",
  },
  {
    path: "/oktatas/tankeruleti-kozpont",
    title: "Tankerületi projektor lámpacsere",
    audience: "Tankerületi műszaki csoportvezető",
    primaryKeyword: "tankerület projektor beszerzés",
    supportingKeywords: [
      "tankerületi projektor karbantartás",
      "összevont iskolai igény",
      "tankerület AV beszerzés",
    ],
    brief:
      "Összevont tankerületi igény kezelése egy szállítmányban, intézményenkénti számlázással.",
  },
  {
    path: "/oktatas/tanevkezdes",
    title: "Tanévkezdő projektor-ellenőrzés",
    audience: "Iskolai IT-koordinátor, gondnok",
    primaryKeyword: "tanévkezdés projektor karbantartás",
    supportingKeywords: [
      "szeptemberi projektor csere iskola",
      "AV ellenőrzés tanévkezdés előtt",
      "projektor izzó szeptember",
    ],
    brief:
      "10 pontos tanévkezdő AV check-lista, tipikus szeptemberi projektorproblémák és sürgős lámpacsere.",
  },
  {
    path: "/oktatas",
    title: "Oktatási intézményeknek — projektor lámpacsere",
    audience: "Oktatási intézményi döntéshozó",
    primaryKeyword: "iskolai projektor lámpa",
    supportingKeywords: [
      "oktatási projektor karbantartás",
      "iskolai AV eszköz",
      "intézményi projektor beszerzés",
    ],
    brief:
      "Áttekintő oldal intézményi vásárlóknak: nyári karbantartás, egyetemi, tankerületi és tanévkezdő szegmens.",
  },
  {
    path: "/szolgaltatas/projektor-szuro-csere",
    title: "Projektor szűrő csere",
    audience: "IT üzemeltető, karbantartó",
    primaryKeyword: "projektor porszűrő csere",
    supportingKeywords: [
      "projektor filter tisztítás",
      "projektor karbantartás",
      "porszűrő pótlás",
    ],
    brief:
      "Projektor porszűrő csere és tisztítás — a lámpaélettartam meghosszabbításának leggyorsabb módja.",
  },
  {
    path: "/szolgaltatas/dmd-chip-csere",
    title: "DMD chip csere",
    audience: "AV szerviz, IT üzemeltető",
    primaryKeyword: "DMD chip csere",
    supportingKeywords: [
      "projektor kép hibás pixel",
      "DLP chip csere",
      "projektor javítás",
    ],
    brief:
      "DMD/DLP chip csere kiégett tükrökkel jelentkező pixelhibákra — lámpacseréhez kapcsolt szolgáltatás.",
  },
  {
    path: "/szolgaltatas/projektor-tavkapcsolo",
    title: "Projektor távkapcsoló pótlás",
    audience: "IT üzemeltető, oktatási intézmény",
    primaryKeyword: "projektor távirányító pótlás",
    supportingKeywords: [
      "elveszett projektor távirányító",
      "projektor remote csere",
      "kompatibilis távirányító",
    ],
    brief:
      "Eredeti és kompatibilis projektor távirányítók pótlása — lámpacsere-rendeléshez csomagolva.",
  },
];