/**
 * A webhook buildje után fut, a Next folyamattól külön. Naplót csak sikeres
 * pm2 restart után ír. Tokent nem olvas és nem ír.
 */
import { spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "private_data");
const jobPath = join(dir, "price-approve-job.json");
const lockPath = join(dir, "price-approve.lock");
const logPath = join(dir, "price-approve.log");
const baselinePath = join(dir, "price-monitor-baseline.json");

function releaseLock() {
  if (existsSync(lockPath)) rmSync(lockPath, { force: true });
}

if (!existsSync(jobPath)) {
  releaseLock();
  process.exitCode = 1;
} else {
  const job = JSON.parse(readFileSync(jobPath, "utf8"));
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const pm2 = process.platform === "win32" ? "pm2.cmd" : "pm2";
  const code = await new Promise((resolve) => {
    const child = spawn(pm2, ["restart", "site-2"], {
      cwd: root,
      shell: false,
      windowsHide: true,
    });
    child.on("error", () => resolve(1));
    child.on("close", (status) => resolve(status ?? 1));
  });
  if (code !== 0) {
    releaseLock();
    process.exitCode = code || 1;
  } else {
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      baselinePath,
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          rateHufPerEur: job.rateHufPerEur,
          rateSource: job.rateSource,
          costs: job.costs,
        },
        null,
        2,
      ),
    );
    const skus = Array.isArray(job.changes)
      ? job.changes.map((change) => `${change.sku} ${change.oldNetHuf}→${change.newNetHuf}`).join(", ")
      : "";
    appendFileSync(
      logPath,
      `${new Date().toISOString()} elfogadva ${skus} árfolyam=${job.rateHufPerEur} forrás=${job.rateSource} build=ok pm2=site-2\n`,
    );
    rmSync(jobPath, { force: true });
    releaseLock();
    process.exitCode = 0;
  }
}
