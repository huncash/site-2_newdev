import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

const expected =
  "Köszönjük, az árajánlat-kérést rögzítettük. Írásos, tételes ajánlattal válaszolunk — benne a szállítási idővel és a mennyiségi árral. Jellemzően 24 órán belül válaszolunk.";

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const ack = read("src/lib/quote-request-ack.ts");
const title = ack.match(/QUOTE_REQUEST_ACK_TITLE =\s*"([^"]+)"/);
const detail = ack.match(/QUOTE_REQUEST_ACK_DETAIL =\s*"([^"]+)"/);
const copy = `${title?.[1] ?? ""} ${detail?.[1] ?? ""}`;
expect(copy === expected, `a rögzített szöveg eltér:\n${copy}`);
expect(!copy.includes("készlet"), "az ajánlat-visszajelzés még készletre utal");

const form = read("src/components/QuoteForm.tsx");
expect(form.includes("QUOTE_REQUEST_ACK_TITLE"), "az űrlap nem a közös köszönőszöveget használja");
expect(form.includes("QUOTE_REQUEST_ACK_DETAIL"), "az űrlap nem a közös részletező szöveget használja");
expect(!form.includes("készlettel"), "az űrlap még a készletes mondatot tartalmazza");

const api = read("src/contact-handler.ts");
expect(api.includes("QUOTE_REQUEST_ACK"), "az API siker-válasza nem a közös szöveget adja vissza");
expect(!api.includes("készlettel"), "az API válasz még készletre utal");

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("quote ack check ok");
