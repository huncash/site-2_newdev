import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const css = read("src/styles/chart-surface.css");
expect(css.includes(".chart-container"), "chart-surface.css: hiányzik a .chart-container");
expect(/color-scheme:\s*light/.test(css), "chart-surface.css: hiányzik a color-scheme: light");
expect(/isolation:\s*isolate/.test(css), "chart-surface.css: hiányzik az isolation: isolate");
expect(css.includes("#f5d76e") && css.includes("#4caf6e"), "chart-surface.css: hiányoznak a rögzített diagramszínek");

const surface = read("src/components/ui/chart-surface.ts");
expect(
  surface.includes('CHART_SURFACE_CLASS = "chart-container"'),
  "chart-surface.ts: az osztálynév nem chart-container",
);
expect(surface.includes('colorScheme: "light"'), "chart-surface.ts: hiányzik a colorScheme inline stílus");
expect(surface.includes('isolation: "isolate"'), "chart-surface.ts: hiányzik az isolation inline stílus");
expect(
  surface.includes('import "@/styles/chart-surface.css"'),
  "chart-surface.ts: a védelem CSS-e nincs a modulhoz kötve",
);

const chart = read("src/components/ui/chart.tsx");
expect(
  chart.includes("chartSurfaceProps"),
  "ChartContainer nem örökli a chart-container védelmet",
);

const layout = read("src/app/layout.tsx");
expect(
  layout.includes('import "@/styles/chart-surface.css"'),
  "layout.tsx: a diagramvédelem nincs globálisan betöltve",
);

const altEntry = read("src/app/styles.css");
expect(
  altEntry.includes('@import "../styles/chart-surface.css"'),
  "styles.css: a másik témabelépés nem húzza be a diagramvédelmet",
);

const page = read("src/app/megtakaritas/page.tsx");
expect(page.includes("chartSurfaceProps"), "a megtakarítás oldal ábrái nincsenek a védőfelületen");
expect(
  (page.match(/data-chart-surface="light"/g) || []).length >= 2,
  "a projektorábrának és az oszlopdiagramnak is data-chart-surface kell",
);

const banned = [
  "currentColor",
  "var(--cta)",
  "var(--savings)",
  "var(--muted)",
  "var(--primary)",
  "var(--foreground)",
  "var(--accent-amber)",
  "var(--cta-hover)",
  "color-mix(",
];
for (const token of banned) {
  expect(!page.includes(token), `a megtakarítás oldal még témafüggő festést használ: ${token}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("chart surface check ok");
