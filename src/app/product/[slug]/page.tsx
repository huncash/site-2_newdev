import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getProduct, getProductStock, type Category, type Product } from "@/data/catalog";
import { getDeliveryPromise } from "@/data/shipping";
import { PriceBadge } from "@/components/PriceBadge";

const lampModuleImg = "/assets/projector-lamp-module.jpg";
const uhpUheLampLineDrawing = "/assets/uhp-uhe-lamp-line-drawing.png";
const nshLampLineDrawing = "/assets/nsh-lamp-line-drawing.png";
const xenonLampLineDrawing = "/assets/xenon-lamp-line-drawing.png";
const metalHalideLampLineDrawing = "/assets/metal-halide-lamp-line-drawing.png";
const uvMedicalLampLineDrawing = "/assets/uv-medical-lamp-line-drawing.png";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.sku} ${product.brand} projektor izzó / lámpamodul — projektorlampacsere.hu`,
    description: `${product.sku} ${product.brand} projektor lámpamodul eredeti gyári izzóval (${product.wattage}).`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  return <ProductView product={product} category={category} />;
}


function ProductView({ product, category }: { product: Product; category: Category | undefined }) {
  const stock = getProductStock(product);
  const promise = product.featuredPrice
    ? { short: "4–8 munkanap", long: "Raktárkészletről vagy gyors átfutással — jellemzően 4–8 munkanapon belül kézbesítjük futárszolgálattal." }
    : getDeliveryPromise(stock.status, stock.leadTimeBusinessDays);
  const isUhpUhe = product.categorySlug === "uhp-uhe-projector-lamps";
  const isNsh = product.categorySlug === "nsh-projector-modules";
  const isXenon = product.categorySlug === "xenon-short-arc";
  const isMetalHalide = product.categorySlug === "metal-halide-stage";
  const isUvMedical = product.categorySlug === "specialty-medical-uv";
  const isLineDrawing = isUhpUhe || isNsh || isXenon || isMetalHalide || isUvMedical;
  const productImage = isUhpUhe
    ? uhpUheLampLineDrawing
    : isNsh
      ? nshLampLineDrawing
      : isXenon
        ? xenonLampLineDrawing
        : isMetalHalide
          ? metalHalideLampLineDrawing
          : isUvMedical
            ? uvMedicalLampLineDrawing
            : lampModuleImg;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/katalogus" className="hover:text-foreground">Katalógus</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/kategoria/${category.slug }`} className="hover:text-foreground">
              {category.shortName}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.sku}</span>
      </nav>

      <div className="mt-6 grid lg:grid-cols-[1.1fr_1fr] gap-10">
        <figure className="m-0">
          <div className="bg-surface border border-border rounded aspect-square overflow-hidden flex items-center justify-center">
            <img
              src={productImage}
              alt={`${product.name} — eredeti diszkont projektor lámpamodul illusztráció`}
              width={1280}
              height={960}
              loading="lazy"
              className={
                isLineDrawing
                  ? "w-full h-full object-contain p-6 mix-blend-multiply"
                  : "w-full h-full object-contain p-6"
              }
            />
          </div>
          <figcaption className="mt-2 text-[11px] italic text-muted-foreground leading-snug">
            A termékkép kizárólag illusztráció. A tárgyban szereplő modul tényleges
            kialakítása — keret formája, csatlakozók elrendezése, izzó típusa — eltérhet a
            képen láthatótól. A pontos műszaki paramétereket az adatlap és az árajánlat rögzíti.
          </figcaption>
        </figure>

        <div>
          {category && (
            <div className="text-xs tracking-[0.25em] text-primary font-medium">{category.technology}</div>
          )}
          <h1 className="text-3xl font-semibold tracking-tight mt-2">{product.name}</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-mono">Cikkszám: {product.sku}</span> · {product.brand}
          </div>
          <p className="mt-4 text-foreground">{product.shortDescription}</p>

          {product.featuredPrice && (
            <div className="mt-5">
              <PriceBadge product={product} variant="detail" />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary-soft text-primary-deep text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-deep" />
              eredeti diszkont lámpamodul — 6 hó garancia
            </span>
          </div>

          <div className="mt-4 border border-border rounded p-4 bg-surface text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Választható kivitelek
            </div>
            <ol className="mt-2 space-y-2 text-foreground leading-snug">
              <li>
                <strong>Csak eredeti gyári izzó</strong> — foglalat / keret
                nélkül, kizárólag a fényforrás. AV-integrátor és márkaszerviz
                részére; a beépítés kockázata a Vevőt terheli.
              </li>
              <li>
                <strong>Eredeti diszkont lámpamodul</strong> — eredeti gyári
                izzó (Philips, Osram, Ushio vagy Phoenix) méretpontos
                utángyártott kerettel. Műszakilag egyenértékű, intézményi
                környezetben javasolt választás; ez az alapértelmezett ajánlott
                kivitel.
              </li>
              <li>
                <strong>Teljes gyári (OEM) cseremodul</strong> — gyári
                cikkszámmal és eredeti kerettel, magasabb árkategóriában;
                tipikusan élő márkaszerviz-szerződés vagy belső eszközszabályzat
                indokolja. Az ajánlatkérés megjegyzés rovatában jelezze.
              </li>
            </ol>
            <p className="mt-3 text-[11px] text-muted-foreground leading-snug">
              Kompatibilis (nem gyári márkájú) izzót nem szerzünk be és nem
              forgalmazunk — kizárólag eredeti gyári fényforrásra adunk
              ajánlatot. Részletek:{" "}
              <Link href="/gyik" className="text-primary hover:underline">GYIK</Link>.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-border pt-6">
            <SpecRow label="Teljesítmény" value={product.wattage} />
            <SpecRow label="Élettartam" value={product.lifespan} />
            <SpecRow label="Színhőmérséklet" value={product.colorTemperature} />
            <SpecRow label="Foglalat / ház" value={product.baseType} />
          </dl>

          <div className="mt-6 border border-border rounded p-4 bg-surface text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Készlet és szállítás
              </span>
              {product.featuredPrice ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> 4–8 munkanap
                </span>
              ) : stock.status === "in_stock" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-soft text-primary-deep">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-deep" /> Raktáron
                </span>
              ) : stock.status === "lead_time" ? (
                <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                  Átfutás · 6–12 munkanap
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                  Egyedi beszerzés
                </span>
              )}
            </div>
            <p className="mt-2 text-foreground">
              {product.featuredPrice
                ? "Raktárkészletről vagy gyors átfutással — jellemzően 4–8 munkanapon belül kézbesítjük futárszolgálattal."
                : promise.long}
            </p>
            {!product.featuredPrice && (
              <p className="mt-1 text-xs text-muted-foreground">
                Az ajánlatban a tételre szabott végleges szállítási időt visszaigazoljuk.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ajanlatkeres"
              className="bg-cta text-cta-foreground hover:bg-cta-hover font-medium rounded px-5 py-2.5 hover:opacity-90"
            >
              Árajánlatot kérek
            </Link>
            <Link
              href="/csere-utmutato"
              className="border border-border text-foreground font-medium rounded px-5 py-2.5 hover:bg-surface"
            >
              Csere útmutató
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-12 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Műszaki adatok</h2>
          <dl className="mt-4 border-t border-border">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[180px_1fr] gap-4 py-3 border-b border-border text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Kompatibilis projektor modellek</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Az aktuális OEM dokumentációhoz illesztve. Ha másik modellhez vagy revízióhoz keresi, írjon — visszaigazoljuk.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {product.compatibility.map((m: string) => (
              <li key={m} className="border border-border rounded px-3 py-2 bg-surface">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground mt-0.5">{value}</dd>
    </div>
  );
}
