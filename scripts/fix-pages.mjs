/**
 * Fix pass: rebuild broken dynamic pages + katalogus from Lovable sources
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");
const ROUTES = path.join(SRC, "routes_lovable");
const APP = path.join(SRC, "app");

function convertLinks(s) {
  return s
    .replace(/to="\/catalog"/g, 'href="/katalogus"')
    .replace(/to="\/quote"/g, 'href="/ajanlatkeres"')
    .replace(/to="\/contact"/g, 'href="/kapcsolat"')
    .replace(/to="\/category\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g, 'href={`/kategoria/${$1}`}')
    .replace(/to="\/product\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g, 'href={`/product/${$1}`}')
    .replace(/to="\/blog\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g, 'href={`/blog/${$1}`}')
    .replace(/to="\/markak\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g, 'href={`/markak/${$1}`}')
    .replace(/to="\/projektor-modell\/\$slug"\s+params=\{\{\s*slug:\s*([^}]+)\}\}/g, 'href={`/projektor-modell/${$1}`}')
    .replace(/\bto="/g, 'href="')
    .replace(/\bto=\{/g, "href={")
    .replace(/\s*search=\{\{[^}]*\}\}/g, "")
    .replace(/\s*activeProps=\{\{[^}]*\}\}/g, "");
}

function stripRouteExport(src) {
  // Remove from `export const Route =` through the matching `});` before component
  const start = src.indexOf("export const Route =");
  if (start < 0) return src;
  // Find component: function after Route block
  const compMatch = src.slice(start).match(/\nfunction ([A-Z]\w+)/);
  if (!compMatch) return src;
  const compIdx = start + src.slice(start).indexOf(compMatch[0]);
  return src.slice(0, start) + src.slice(compIdx + 1);
}

function stripTanstackImports(src) {
  return src
    .replace(/^import\s+\{[^}]*\}\s+from\s+"@tanstack\/react-router";\s*\n/gm, "")
    .replace(/^import\s+\{[^}]*\}\s+from\s+"@tanstack\/zod-adapter";\s*\n/gm, "")
    .replace(/^import\s+\{\s*z\s*\}\s+from\s+"zod";\s*\n/gm, "")
    .replace(/^import\s+\{[^}]*\}\s+from\s+"@tanstack\/react-start";\s*\n/gm, "");
}

// --- katalogus ---
{
  const body = `"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, products, type Product } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

export default function CatalogPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") ?? "";

  function setSearch(next: { q?: string; cat?: string }) {
    const params = new URLSearchParams();
    const nq = next.q ?? q;
    const nc = next.cat ?? cat;
    if (nq) params.set("q", nq);
    if (nc) params.set("cat", nc);
    const qs = params.toString();
    router.push(qs ? \`/katalogus?\${qs}\` : "/katalogus");
  }

  const filtered = products.filter((p: Product) => {
    if (cat && p.categorySlug !== cat) return false;
    if (q) {
      const needle = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.shortDescription.toLowerCase().includes(needle)
      );
    }
    return true;
  });

  return (
    <div className="w-full px-6 py-12">
      <div className="text-xs tracking-[0.25em] text-primary font-medium">KATALÓGUS</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Projektor lámpamodulok cikkszám szerint</h1>
      <p className="text-muted-foreground mt-2">
        Keressen cikkszámra, gyártóra vagy projektor típusra, illetve szűrjön
        kategória szerint. A katalógus a leggyakoribb intézményi és vállalati
        típusokat tartalmazza; a forgalmazott modulokban a fényforrás minden
        esetben eredeti gyári gyártmány (Philips, Osram, Ushio, Phoenix),
        méretpontos utángyártott kerettel. A választott kivitelt és a hozzá
        tartozó garanciát az árajánlat tételesen rögzíti.
      </p>

      <div className="mt-8 grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <label className="text-xs font-medium text-foreground tracking-wide uppercase">
              Keresés
            </label>
            <input
              value={q}
              onChange={(e) => setSearch({ q: e.target.value })}
              placeholder="Cikkszám, gyártó, modell…"
              className="mt-2 w-full border border-input rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="text-xs font-medium text-foreground tracking-wide uppercase mb-2">
              Kategória
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setSearch({ cat: "" })}
                  className={\`w-full text-left px-2 py-1.5 rounded \${
                    cat === "" ? "bg-primary-soft text-primary-deep font-medium" : "text-muted-foreground hover:text-foreground"
                  }\`}
                >
                  Összes kategória
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setSearch({ cat: c.slug })}
                    className={\`w-full text-left px-2 py-1.5 rounded \${
                      cat === c.slug ? "bg-primary-soft text-primary-deep font-medium" : "text-muted-foreground hover:text-foreground"
                    }\`}
                  >
                    {c.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>
              {filtered.length} {filtered.length === 1 ? "termék" : "termék"}
            </span>
            {(q || cat) && (
              <Link href="/katalogus" className="text-primary hover:underline text-xs">
                Szűrők törlése
              </Link>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="border border-border rounded p-10 text-center text-muted-foreground text-sm">
              Erre a keresésre nincs találat a katalógusban. Pontosítsa a cikkszámot,
              vagy <Link href="/ajanlatkeres" className="text-primary hover:underline">kérjen tételes ajánlatot</Link> —
              a katalóguson kívüli típusok túlnyomó többsége egyedi beszerzéssel szállítható.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(APP, "katalogus/page.tsx"), body);
  console.log("fixed katalogus");
}

// --- product/[slug] ---
{
  let raw = fs.readFileSync(path.join(ROUTES, "product.$slug.tsx"), "utf8");
  raw = stripTanstackImports(raw);
  raw = stripRouteExport(raw);
  raw = convertLinks(raw);
  raw = raw.replace(
    /function ProductPage\(\) \{\s*const \{ product, category \} = Route\.useLoaderData\(\);/,
    `function ProductView({ product, category }: { product: Product; category: Category | undefined }) {`
  );
  raw = raw.replace(/from "next\/link";\n/, "");
  const wrapper = `import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getProduct, getProductStock, type Category, type Product } from "@/data/catalog";
import { getDeliveryPromise } from "@/data/shipping";
import { PriceBadge } from "@/components/PriceBadge";
import lampModuleImg from "@/assets/projector-lamp-module.jpg";
import uhpUheLampLineDrawing from "@/assets/uhp-uhe-lamp-line-drawing.png";
import nshLampLineDrawing from "@/assets/nsh-lamp-line-drawing.png";
import xenonLampLineDrawing from "@/assets/xenon-lamp-line-drawing.png";
import metalHalideLampLineDrawing from "@/assets/metal-halide-lamp-line-drawing.png";
import uvMedicalLampLineDrawing from "@/assets/uv-medical-lamp-line-drawing.png";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: \`\${product.sku} \${product.brand} projektor izzó / lámpamodul — projektorlampacsere.hu\`,
    description: \`\${product.sku} \${product.brand} projektor lámpamodul eredeti gyári izzóval (\${product.wattage}).\`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  return <ProductView product={product} category={category} />;
}

`;
  // Remove duplicate imports from raw
  raw = raw.replace(/^import .*\n/gm, "");
  fs.writeFileSync(path.join(APP, "product/[slug]/page.tsx"), wrapper + raw);
  console.log("fixed product/[slug]");
}

// --- kategoria/[slug] ---
{
  let raw = fs.readFileSync(path.join(ROUTES, "category.$slug.tsx"), "utf8");
  raw = stripTanstackImports(raw);
  raw = stripRouteExport(raw);
  raw = convertLinks(raw);
  raw = raw.replace(
    /function CategoryPage\(\) \{\s*const data = Route\.useLoaderData\(\);\s*const category = data\.category;\s*const products: Product\[\] = data\.products;/,
    `function CategoryView({ category, products }: { category: Category; products: Product[] }) {`
  );
  const wrapper = `import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, productsByCategory, type Category, type Product } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: \`\${category.name} — projektorlampacsere.hu\`, description: category.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return <CategoryView category={category} products={productsByCategory(slug)} />;
}

`;
  raw = raw.replace(/^import .*\n/gm, "");
  fs.writeFileSync(path.join(APP, "kategoria/[slug]/page.tsx"), wrapper + raw);
  console.log("fixed kategoria/[slug]");
}

// --- blog/[slug] ---
{
  let raw = fs.readFileSync(path.join(ROUTES, "blog_.$slug.tsx"), "utf8");
  raw = stripTanstackImports(raw);
  raw = stripRouteExport(raw);
  raw = convertLinks(raw);
  raw = raw.replace(
    /function BlogPostPage\(\) \{\s*const \{ post \} = Route\.useLoaderData\(\);/,
    `function BlogPostView({ post }: { post: BlogPost }) {`
  );
  const wrapper = `import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, sortedPosts, type BlogPost } from "@/data/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}

`;
  raw = raw.replace(/^import .*\n/gm, "");
  // Keep helper functions that were before BlogPostPage
  fs.writeFileSync(path.join(APP, "blog/[slug]/page.tsx"), wrapper + raw);
  console.log("fixed blog/[slug]");
}

// markak / projektor-modell slug
for (const [file, out, loaderHint] of [
  ["markak_.$slug.tsx", "markak/[slug]/page.tsx", "BrandPage"],
  ["projektor-modell_.$slug.tsx", "projektor-modell/[slug]/page.tsx", "PopularModel"],
]) {
  let raw = fs.readFileSync(path.join(ROUTES, file), "utf8");
  const imports = [...raw.matchAll(/^import .+$/gm)].map((m) => m[0]).filter((l) => !l.includes("@tanstack"));
  raw = stripTanstackImports(raw);
  raw = stripRouteExport(raw);
  raw = convertLinks(raw);
  raw = raw.replace(/Route\.useLoaderData\(\) as \{[^}]+\}/g, "props");
  raw = raw.replace(/const data = props;/g, "const data = props;");
  // Simpler: inject props via wrapper if we detect pattern
  raw = raw.replace(
    /function (\w+)\(\) \{\s*const data = Route\.useLoaderData\(\) as \{ (\w+): (\w+) \};/,
    "function $1({ data }: { data: { $2: $3 } }) {"
  );
  raw = raw.replace(
    /function (\w+)\(\) \{\s*const data = props as \{ (\w+): (\w+) \};/,
    "function $1({ data }: { data: { $2: $3 } }) {"
  );
  // Fallback broken Route refs
  if (raw.includes("Route.")) {
    console.warn("still has Route.", file);
  }
  raw = raw.replace(/^import .*\n/gm, "");
  const header = `import Link from "next/link";\nimport { notFound } from "next/navigation";\n${imports.filter(i => !i.includes("Link")).join("\n")}\n\n`;
  // Manual simpler stubs if still broken — write with notFound pattern from get fns
  fs.writeFileSync(path.join(APP, out), header + raw + "\nexport default function Page() { return null; }\n");
  console.log("partial", out);
}

console.log("done fix-pass");
