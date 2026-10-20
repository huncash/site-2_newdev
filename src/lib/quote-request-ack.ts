/**
 * Sikeres árajánlat-kérés visszajelzése.
 * A válasz a szállítási időt, a mennyiségi árat és a jellemző 24 órás visszajelzést ígéri.
 */
export const QUOTE_REQUEST_ACK_TITLE =
  "Köszönjük, az árajánlat-kérést rögzítettük.";

export const QUOTE_REQUEST_ACK_DETAIL =
  "Írásos, tételes ajánlattal válaszolunk — benne a szállítási idővel és a mennyiségi árral. Jellemzően 24 órán belül válaszolunk.";

export const QUOTE_REQUEST_ACK = `${QUOTE_REQUEST_ACK_TITLE} ${QUOTE_REQUEST_ACK_DETAIL}`;

if (
  QUOTE_REQUEST_ACK !==
  "Köszönjük, az árajánlat-kérést rögzítettük. Írásos, tételes ajánlattal válaszolunk — benne a szállítási idővel és a mennyiségi árral. Jellemzően 24 órán belül válaszolunk."
) {
  throw new Error("QUOTE_REQUEST_ACK failed its fixed-copy guard.");
}
