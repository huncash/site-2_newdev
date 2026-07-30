// Kampány-fázisok a 2026-os évkezdő ciklushoz. SSR-biztos, időzóna-független.
//
//   leadas    : ma <= 2026-08-15    — "aug 15-ig adja le a rendelést, aug 20 miatt utána akadozás"
//   csend     : 2026-08-16..08-19   — állami ünnep körüli logisztikai szünet, kampány elrejtve
//   evkezdes  : 2026-08-20..09-15   — "még odaér az évkezdésre" sprint
//   off       : minden más          — standard főoldal, szezonális landingek noindex + kilistázva

export const LEADAS_DEADLINE_ISO = "2026-08-15";
export const EVKEZDES_START_ISO = "2026-08-20";
export const EVKEZDES_END_ISO = "2026-09-15";
export const TANEVKEZDES_ISO = "2026-09-01";

export type CampaignPhase = "leadas" | "csend" | "evkezdes" | "off";

function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
function iso(d: string): number {
  return new Date(`${d}T00:00:00Z`).getTime();
}

export function campaignPhase(now: Date = new Date()): CampaignPhase {
  const today = utcDay(now);
  if (today <= iso(LEADAS_DEADLINE_ISO)) return "leadas";
  if (today < iso(EVKEZDES_START_ISO)) return "csend";
  if (today <= iso(EVKEZDES_END_ISO)) return "evkezdes";
  return "off";
}

/** Napok száma egy jövőbeli ISO-dátumig; 0 vagy negatív, ha már elmúlt. */
export function daysUntil(isoDate: string, now: Date = new Date()): number {
  return Math.ceil((iso(isoDate) - utcDay(now)) / 86_400_000);
}

/** Hátralévő napok a szept. 1-i tanévkezdésig (kompat.). */
export function daysUntilTanevkezdes(now: Date = new Date()): number {
  return daysUntil(TANEVKEZDES_ISO, now);
}