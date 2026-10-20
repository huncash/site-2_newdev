/**
 * A jóváhagyott ár a private_data/approved-prices.json fájlban él, a webhook
 * kérésenként olvastatja, és ezt a szkriptet nem hívja. PM2 újraindítás nincs.
 * Egy korábbi futás lockját feloldja, árjegyzéket nem ír.
 */
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "private_data");
for (const name of ["price-approve.lock", "price-approve-job.json"]) {
  const path = join(dir, name);
  if (existsSync(path)) rmSync(path, { force: true });
}
console.log("árjóváhagyás: PM2 újraindítás nincs, az ár a private_data/approved-prices.json fájlban van");
process.exitCode = 0;
