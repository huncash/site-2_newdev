// BELSŐ HASZNÁLATRA — versenyhírszerzési minta a /admin/arres-kalkulacio
// oldalhoz. NEM publikus, NEM mehet ki ügyfél elé, NEM linkelhető a fő
// navigációból. A konkrét konkurens hostnevek bizalmasak: a futásidőben
// szerveroldalon, a `COMPETITOR_SITES` env változóból töltődnek
// (lásd src/server/competitors.ts). Itt csak árszint- és kategória-minta
// szerepel, hostnév nélkül. Mintavétel: 2026-04.

export type CompetitorRow = {
  id: string;
  model: string;
  competitorNetHuf: number;
  competitorGrossHuf: number;
  stockStatus: "in-stock" | "out-of-stock";
  leadTime: "7 munkanap" | "14 nap";
  competitorWarranty: string;
  segment: "Üzleti / hordozható" | "Üzleti / standard" | "Oktatási" | "Házimozi" | "Konferencia / installációs" | "Egyéb";
};

export const competitorSamples: CompetitorRow[] = [
  { id: "1",  model: "VIVITEK D-859",                       competitorNetHuf: 21444,  competitorGrossHuf: 27234,  stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Üzleti / standard" },
  // 2–11.: a saját katalógusunk termékei — összevethető hazai konkurens
  // árszintekkel (sávos árazás alapján becsült értékek; a beszerzési árat
  // itt is élőben tölti ki a tulajdonos).
  { id: "2",  model: "Epson ELPLP96",                       competitorNetHuf: 81044,  competitorGrossHuf: 102926, stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Üzleti / standard" },
  { id: "3",  model: "NEC NP41LP",                          competitorNetHuf: 88939,  competitorGrossHuf: 112953, stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Konferencia / installációs" },
  { id: "4",  model: "BenQ 5J.J7L05.001",                   competitorNetHuf: 82311,  competitorGrossHuf: 104535, stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Házimozi" },
  { id: "5",  model: "Osram XBO 4000W/HS XL OFR",           competitorNetHuf: 185730, competitorGrossHuf: 235877, stockStatus: "in-stock", leadTime: "14 nap",     competitorWarranty: "3 hónap", segment: "Egyéb" },
  { id: "6",  model: "Philips MSR Gold 700/2 MiniFastFit",  competitorNetHuf: 84427,  competitorGrossHuf: 107222, stockStatus: "in-stock", leadTime: "14 nap",     competitorWarranty: "3 hónap", segment: "Egyéb" },
  { id: "7",  model: "Ushio UXL-200HO",                     competitorNetHuf: 85518,  competitorGrossHuf: 108608, stockStatus: "in-stock", leadTime: "14 nap",     competitorWarranty: "3 hónap", segment: "Egyéb" },
  { id: "8",  model: "Heraeus Noblelight 400W UV",          competitorNetHuf: 81044,  competitorGrossHuf: 102926, stockStatus: "in-stock", leadTime: "14 nap",     competitorWarranty: "3 hónap", segment: "Egyéb" },
  { id: "9",  model: "Panasonic ET-LAV400",                 competitorNetHuf: 84427,  competitorGrossHuf: 107222, stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Üzleti / standard" },
  { id: "10", model: "Osram HMI 1200W/SE XS",               competitorNetHuf: 185730, competitorGrossHuf: 235877, stockStatus: "in-stock", leadTime: "14 nap",     competitorWarranty: "3 hónap", segment: "Egyéb" },
  { id: "11", model: "Sony LMP-H220",                       competitorNetHuf: 82311,  competitorGrossHuf: 104535, stockStatus: "in-stock", leadTime: "7 munkanap", competitorWarranty: "3 hónap", segment: "Házimozi" },
];

/** A jelenlegi mintában előforduló nettó árszintek (Ft). */
export const competitorPriceTiers = [21444, 63148, 66270, 67627, 69259, 69861, 81210, 102190, 104031, 133147, 333202] as const;

/** Bruttó kulcs Magyarországon: 27% ÁFA. */
export const VAT_MULTIPLIER = 1.27;
