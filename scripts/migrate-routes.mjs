/**
 * One-shot: routes_lovable → Next.js App Router pages
 * Run: node site-2/scripts/migrate-routes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, "..");
const SRC = path.join(SITE, "src");
const ROUTES = path.join(SRC, "routes_lovable");
const APP = path.join(SRC, "app");

/** @type {Record<string, string>} */
const MAP = {
  "index.tsx": "page.tsx",
  "catalog.tsx": "katalogus/page.tsx",
  "quote.tsx": "ajanlatkeres/page.tsx",
  "contact.tsx": "kapcsolat/page.tsx",
  "about.tsx": "about/page.tsx",
  "gyik.tsx": "gyik/page.tsx",
  "blog.tsx": "blog/page.tsx",
  "blog_.$slug.tsx": "blog/[slug]/page.tsx",
  "product.$slug.tsx": "product/[slug]/page.tsx",
  "category.$slug.tsx": "kategoria/[slug]/page.tsx",
  "markak.tsx": "markak/page.tsx",
  "markak_.$slug.tsx": "markak/[slug]/page.tsx",
  "projektor-modell.tsx": "projektor-modell/page.tsx",
  "projektor-modell_.$slug.tsx": "projektor-modell/[slug]/page.tsx",
  "csere-utmutato.tsx": "csere-utmutato/page.tsx",
  "csere-utmutato_.illusztralt.tsx": "csere-utmutato/illusztralt/page.tsx",
  "megtakaritas.tsx": "megtakaritas/page.tsx",
  "arazas.tsx": "arazas/page.tsx",
  "b2b.tsx": "b2b/page.tsx",
  "aszf.tsx": "aszf/page.tsx",
  "adatvedelem.tsx": "adatvedelem/page.tsx",
  "impresszum.tsx": "impresszum/page.tsx",
  "login.tsx": "login/page.tsx",
  "forgot-password.tsx": "forgot-password/page.tsx",
  "reset-password.tsx": "reset-password/page.tsx",
  "oktatas.tsx": "oktatas/page.tsx",
  "oktatas_.tanevkezdes.tsx": "oktatas/tanevkezdes/page.tsx",
  "oktatas_.egyetem.tsx": "oktatas/egyetem/page.tsx",
  "oktatas_.nyari-karbantartas.tsx": "oktatas/nyari-karbantartas/page.tsx",
  "oktatas_.tankeruleti-kozpont.tsx": "oktatas/tankeruleti-kozpont/page.tsx",
  "szolgaltatas.projektor-szuro-csere.tsx": "szolgaltatas/projektor-szuro-csere/page.tsx",
  "szolgaltatas.projektor-tavkapcsolo.tsx": "szolgaltatas/projektor-tavkapcsolo/page.tsx",
  "szolgaltatas.dmd-chip-csere.tsx": "szolgaltatas/dmd-chip-csere/page.tsx",
  "szinpadi-vilagitas-lampa.tsx": "szinpadi-vilagitas-lampa/page.tsx",
  "laboratoriumi-mikroszkop-lampa.tsx": "laboratoriumi-mikroszkop-lampa/page.tsx",
  "admin.keszlet.tsx": "admin/keszlet/page.tsx",
  "admin.ajanlat.tsx": "admin/ajanlat/page.tsx",
  "admin.arres-kalkulacio.tsx": "admin/arres-kalkulacio/page.tsx",
  "admin.marketing.tsx": "admin/marketing/page.tsx",
};

function extractMetaTitle(src) {
  const m = src.match(/\{\s*title:\s*"([^"]+)"/);
  return m?.[1] ?? null;
}

function extractMetaDescription(src) {
  const m = src.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
  return m?.[1] ?? null;
}

function stripRouteBoilerplate(src) {
  // Remove createFileRoute blocks — keep component functions
  let out = src;

  // Remove tanstack / zod-adapter imports
  out = out.replace(
    /^import\s+\{[^}]*\}\s+from\s+"@tanstack\/react-router";\s*\n/gm,
    ""
  );
  out = out.replace(
    /^import\s+\{[^}]*\}\s+from\s+"@tanstack\/zod-adapter";\s*\n/gm,
    ""
  );
  out = out.replace(/^import\s+\{\s*z\s*\}\s+from\s+"zod";\s*\n/gm, "");

  // Remove validateSearch / searchSchema blocks loosely
  out = out.replace(
    /const searchSchema = z\.object\(\{[\s\S]*?\}\);\s*\n/g,
    ""
  );

  // Remove export const Route = createFileRoute(...)({ ... });
  out = out.replace(
    /export const Route = createFileRoute\([^)]*\)\(\{[\s\S]*?\n\}\);\s*\n/g,
    ""
  );

  return out;
}

function addNextImports(src, opts) {
  const lines = [];
  if (opts.needsLink) {
    lines.push('import Link from "next/link";');
  }
  if (opts.needsClientNav) {
    lines.push('import { useRouter, useSearchParams } from "next/navigation";');
  }
  if (opts.needsParams) {
    lines.push('import { notFound } from "next/navigation";');
  }
  if (opts.metadata) {
    lines.push('import type { Metadata } from "next";');
  }
  if (!lines.length) return src;
  // Insert after first import block start
  return lines.join("\n") + "\n" + src;
}

function convertLinks(src) {
  let out = src;
  // Link to="/product/$slug" params={{ slug: x }} → href={`/product/${x}`}
  out = out.replace(
    /<Link\s+to="\/product\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g,
    '<Link href={`/product/${$1}`}'
  );
  out = out.replace(
    /<Link\s+to="\/category\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g,
    '<Link href={`/kategoria/${$1}`}'
  );
  out = out.replace(
    /<Link\s+to="\/blog\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g,
    '<Link href={`/blog/${$1}`}'
  );
  out = out.replace(
    /<Link\s+to="\/markak\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g,
    '<Link href={`/markak/${$1}`}'
  );
  out = out.replace(
    /<Link\s+to="\/projektor-modell\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g,
    '<Link href={`/projektor-modell/${$1}`}'
  );

  // Simple to= → href=
  out = out.replace(/to="\/catalog"/g, 'href="/katalogus"');
  out = out.replace(/to="\/quote"/g, 'href="/ajanlatkeres"');
  out = out.replace(/to="\/contact"/g, 'href="/kapcsolat"');
  out = out.replace(/\bto="/g, 'href="');
  out = out.replace(/\bto=\{/g, "href={");

  // Remove activeProps
  out = out.replace(/\s*activeProps=\{\{[^}]*\}\}/g, "");

  return out;
}

function convertHooks(src) {
  let out = src;
  // Route.useSearch() → searchParams
  if (out.includes("Route.useSearch")) {
    out = out.replace(
      /const \{([^}]+)\} = Route\.useSearch\(\);/g,
      "const _sp = useSearchParams();\n  const {$1} = { q: _sp.get(\"q\") ?? \"\", cat: _sp.get(\"cat\") ?? \"\" };"
    );
  }
  if (out.includes("useNavigate")) {
    out = out.replace(
      /const navigate = useNavigate\([^)]*\);/g,
      "const router = useRouter();"
    );
    // navigate({ search: ... }) patterns — leave as TODO comments for manual fix
    out = out.replace(
      /navigate\(\{([^}]*)\}\)/g,
      "router.push(`/katalogus?` + new URLSearchParams({$1} as Record<string, string>).toString())"
    );
  }
  if (out.includes("Route.useParams")) {
    out = out.replace(
      /const \{([^}]+)\} = Route\.useParams\(\);/g,
      "// params from props\n  const {$1} = params;"
    );
  }
  return out;
}

function wrapPage(src, opts) {
  let out = convertLinks(stripRouteBoilerplate(src));
  out = convertHooks(out);

  const needsLink = /<Link[\s>]/.test(out) || /from "next\/link"/.test(out);
  const needsClient =
    /useState|useEffect|useRouter|useSearchParams|useNavigate|Route\.useSearch|onChange|onClick/.test(
      src
    ) || /useSearchParams|useRouter/.test(out);
  const needsParams = /\[slug\]/.test(opts.outRel) || /params/.test(out);

  // Remove leftover Link import from tanstack if any
  out = out.replace(
    /^import\s+\{[^}]*Link[^}]*\}\s+from\s+"@tanstack\/react-router";\s*\n/gm,
    ""
  );

  const title = extractMetaTitle(src);
  const desc = extractMetaDescription(src);

  let header = "";
  if (needsClient) {
    header += '"use client";\n\n';
  }
  header += 'import Link from "next/link";\n';
  if (needsClient && /useSearchParams|useRouter/.test(out)) {
    header +=
      'import { useRouter, useSearchParams } from "next/navigation";\n';
  }
  if (!needsClient && (title || desc)) {
    header += 'import type { Metadata } from "next";\n\n';
    header += "export const metadata: Metadata = {\n";
    if (title) header += `  title: ${JSON.stringify(title)},\n`;
    if (desc) header += `  description: ${JSON.stringify(desc)},\n`;
    header += "};\n\n";
  }

  // Ensure default export: find main page function
  // Many files export via Route.component — function Name remains
  if (!/export default/.test(out)) {
    // Prefer *Page function, else Home, else first function after strip
    const fn =
      out.match(/function (CatalogPage|Home|HomePage|\w+Page)\(/)?.[1] ||
      out.match(/function ([A-Z]\w+)\(/)?.[1];
    if (fn) {
      out += `\nexport default ${fn};\n`;
    }
  }

  // Dynamic slug pages: wrap for Next params
  if (opts.outRel.includes("[slug]") && !needsClient) {
    // server component with async params
    out = out.replace(
      /export default (\w+);/,
      `export default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return <$1 slug={slug} />;\n}\n`
    );
  }

  return header + out;
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

let count = 0;
for (const [from, to] of Object.entries(MAP)) {
  const srcPath = path.join(ROUTES, from);
  if (!fs.existsSync(srcPath)) {
    console.warn("MISSING", from);
    continue;
  }
  const raw = fs.readFileSync(srcPath, "utf8");
  const outRel = to;
  const converted = wrapPage(raw, { outRel });
  const dest = path.join(APP, outRel);
  ensureDir(dest);
  fs.writeFileSync(dest, converted, "utf8");
  console.log("OK", from, "→", outRel);
  count++;
}

// API route stub
const apiSrc = path.join(ROUTES, "api/public/hooks/sync-stock.ts");
if (fs.existsSync(apiSrc)) {
  const dest = path.join(APP, "api/public/hooks/sync-stock/route.ts");
  ensureDir(dest);
  let raw = fs.readFileSync(apiSrc, "utf8");
  raw =
    '"use server";\n// Migrated from Lovable — wire to Next Route Handler\n' +
    raw
      .replace(/@tanstack\/react-start[^\n]*/g, "next/server")
      .replace(/createAPIFileRoute[^\n]*/g, "// TODO: Next Route Handler");
  fs.writeFileSync(dest, raw, "utf8");
  console.log("OK api sync-stock");
}

console.log(`Migrated ${count} pages`);
