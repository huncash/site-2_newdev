// Anonimizált, valósághű mintaadatok az utángyártott modulok ár-arányához
// képest az OEM cseremodulhoz. A márkanevek és cikkszámok tudatosan
// elhagyva — csak a kategória és a relatív ár (OEM = 100%) jelenik meg.
// Az értékek tájékoztató jellegűek; a konkrét árajánlat ettől eltérhet.

export type SavingsRow = {
  /** Anonim azonosító az x tengelyen — pl. "1", "2", … */
  id: string;
  /** Projektorkategória, pl. "Üzleti / hordozható" */
  segment: string;
  /** Izzótípus, pl. "UHP 210 W" */
  bulbSpec: string;
  /** Eredeti izzó gyártója — Philips / Osram / Ushio / Phoenix */
  bulbBrand: "Philips" | "Osram" | "Ushio" | "Phoenix";
  /** Az utángyártott modul ára az OEM ár %-ában (1–100). */
  aftermarketPct: number;
};

/**
 * 10 anonim mintatétel, vegyes szegmensekből és izzógyártóktól. Az értékek
 * a piacon megfigyelhető, jellemző tartományt tükrözik (~25–55% az OEM
 * cseremodul árához viszonyítva).
 */
export const savingsSamples: SavingsRow[] = [
  { id: "1",  segment: "Üzleti / hordozható",        bulbSpec: "UHP 210 W",  bulbBrand: "Philips", aftermarketPct: 32 },
  { id: "2",  segment: "Üzleti — kompakt",           bulbSpec: "UHP 190 W",  bulbBrand: "Osram",   aftermarketPct: 26 },
  { id: "3",  segment: "Oktatási — rövid vetítésű",  bulbSpec: "UHP 280 W",  bulbBrand: "Philips", aftermarketPct: 35 },
  { id: "4",  segment: "Oktatási — interaktív",      bulbSpec: "UHP 260 W",  bulbBrand: "Ushio",   aftermarketPct: 33 },
  { id: "5",  segment: "Házimozi",                   bulbSpec: "UHP 200 W",  bulbBrand: "Osram",   aftermarketPct: 38 },
  { id: "6",  segment: "Házimozi — 4K",              bulbSpec: "UHP 250 W",  bulbBrand: "Philips", aftermarketPct: 42 },
  { id: "7",  segment: "Konferencia / installációs", bulbSpec: "UHP 330 W",  bulbBrand: "Phoenix", aftermarketPct: 45 },
  { id: "8",  segment: "Konferencia — wide",         bulbSpec: "UHP 310 W",  bulbBrand: "Ushio",   aftermarketPct: 44 },
  { id: "9",  segment: "Installációs — 24/7",        bulbSpec: "UHP 360 W",  bulbBrand: "Philips", aftermarketPct: 49 },
  { id: "10", segment: "Nagy fényerő — rendezvény",  bulbSpec: "UHP 400 W",  bulbBrand: "Osram",   aftermarketPct: 52 },
];

export function averageAftermarketPct(rows: SavingsRow[] = savingsSamples): number {
  const sum = rows.reduce((a, r) => a + r.aftermarketPct, 0);
  return Math.round(sum / rows.length);
}

export function averageSavingsPct(rows: SavingsRow[] = savingsSamples): number {
  return 100 - averageAftermarketPct(rows);
}