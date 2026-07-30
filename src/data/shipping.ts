// Szállítási ígéret-szöveg készlet státusz alapján. Egyetlen forrás —
// a termékkártya, termékoldal és ajánlatkérő ezt használja.

/**
 * Egységes szállítási ígéret-szöveg a készlet státusz alapján.
 */
export function getDeliveryPromise(
  status: "in_stock" | "lead_time" | "on_request",
  leadTimeBusinessDays?: number,
): { short: string; long: string } {
  if (status === "in_stock") {
    return {
      short: "Készletről — akár 2 munkanap",
      long: "Raktárkészletről futárszolgálattal akár 2 munkanap alatt kézbesítjük.",
    };
  }
  if (status === "lead_time") {
    return {
      short: "Jellemző átfutás — 6–12 munkanap",
      long: "Jellemző átfutási idő 6–12 munkanap, futárszolgálattal kézbesítve.",
    };
  }
  return {
    short: "Egyedi beszerzés",
    long: "Egyedi beszerzésű tétel — a pontos átfutási időt az árajánlatban visszaigazoljuk.",
  };
}
