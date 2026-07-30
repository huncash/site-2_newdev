import Link from "next/link";
import type { Metadata } from "next";
import { CONTENT } from "@/data/content";
import { products } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

const lampDiagram = "/assets/lamp-replacement-diagram.png";
const lampModuleImg = "/assets/projector-lamp-module.jpg";

export const metadata: Metadata = {
  title: "Projektor izzó és lámpamodul B2B — projektorlampacsere.hu",
  description:
    "Projektor izzó és lámpamodul beszerzés intézményeknek: Epson, BenQ, NEC, Sony, Philips UHP, Osram, Ushio. Tételes árajánlat, 6–12 munkanap.",
};

function Home() {
  const featured = products.slice(0, 4);
  const fixedPriced = CONTENT.fixedPrice.items
    .map((item) => products.find((p) => p.slug === item.slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs tracking-[0.25em] text-primary-soft font-medium uppercase">
              {CONTENT.hero.badge}
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
              {CONTENT.hero.title}
            </h1>
            <p className="mt-4 text-primary-soft text-sm md:text-base max-w-xl">
              {CONTENT.hero.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={CONTENT.hero.ctaPrimary.href}
                className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
              >
                {CONTENT.hero.ctaPrimary.label}
              </Link>
              <Link
                href={CONTENT.hero.ctaSecondary.href}
                className="px-5 py-2.5 border border-primary-foreground/30 rounded text-sm font-medium hover:bg-primary-foreground/10"
              >
                {CONTENT.hero.ctaSecondary.label}
              </Link>
            </div>
            <p className="mt-4 text-xs text-primary-soft">{CONTENT.hero.deliveryNote}</p>
          </div>
          <div className="bg-primary-deep/40 rounded p-4 flex items-center justify-center">
            <img
              src={lampModuleImg}
              alt="Eredeti diszkont projektor lámpamodul — gyári izzóval"
              width={1280}
              height={960}
              className="w-full max-w-md rounded"
            />
          </div>
        </div>
      </section>

      {fixedPriced.length > 0 && (
        <section className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <div className="text-xs tracking-[0.25em] text-primary font-medium">
                  {CONTENT.fixedPrice.badge}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mt-2">
                  {CONTENT.fixedPrice.heading}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  {CONTENT.fixedPrice.description}
                </p>
              </div>
              <Link href="/katalogus" className="text-sm text-primary hover:underline">
                Teljes katalógus →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fixedPriced.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
          {CONTENT.valueProps.items.map((item) => (
            <ValueBlock key={item.title} title={item.title} body={item.description} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-xs tracking-[0.25em] text-primary font-medium">
          {CONTENT.audience.badge}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mt-2">{CONTENT.audience.heading}</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl">{CONTENT.audience.description}</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {CONTENT.audience.items.map((a) => (
            <Audience key={a.title} title={a.title} body={a.description} />
          ))}
        </div>
        <div className="mt-6">
          <Link href="/b2b" className="text-sm text-primary hover:underline">
            B2B feltételek és mennyiségi kedvezmények →
          </Link>
        </div>
        <div className="mt-2">
          <Link href="/b2b#partneri-ellatas" className="text-sm text-primary hover:underline">
            Partneri ellátási modell — készletre szerződött ellátás és előrejelzéses kiszállítás →
          </Link>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs tracking-[0.25em] text-primary font-medium">KIEMELT TERMÉKEK</div>
              <h2 className="text-2xl font-semibold tracking-tight mt-2">
                {CONTENT.catalog.heading}
              </h2>
            </div>
            <Link href="/katalogus" className="text-sm text-primary hover:underline hidden md:inline">
              Összes termék →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <div className="text-xs tracking-[0.25em] text-primary font-medium">
            {CONTENT.replacement.badge}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-2">{CONTENT.replacement.heading}</h2>
          <p className="text-muted-foreground mt-3">{CONTENT.replacement.description}</p>
          <p className="text-xs text-muted-foreground mt-2">{CONTENT.replacement.note}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={CONTENT.replacement.ctaPrimary.href}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded font-medium text-sm"
            >
              {CONTENT.replacement.ctaPrimary.label}
            </Link>
            <Link
              href={CONTENT.replacement.ctaSecondary.href}
              className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
            >
              {CONTENT.replacement.ctaSecondary.label}
            </Link>
          </div>
        </div>
        <div className="bg-surface border border-border rounded p-6 flex items-center justify-center">
          <img
            src={lampDiagram}
            alt="Projektor lámpamodul csere sematikus vázlata — szervizfedél, modul, kioldó"
            width={1280}
            height={960}
            loading="lazy"
            className="w-full max-w-md"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-xs tracking-[0.25em] text-primary font-medium">
          {CONTENT.categories.badge}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mt-2 mb-8">
          {CONTENT.categories.heading}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTENT.categories.items.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              className="border border-border rounded p-5 hover:border-primary transition group"
            >
              <div className="text-[10px] tracking-widest text-primary font-medium">{c.technology}</div>
              <div className="font-medium text-foreground mt-1 group-hover:text-primary">{c.name}</div>
              <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{CONTENT.cta.heading}</h2>
            <p className="mt-2 text-primary-soft text-sm max-w-2xl">{CONTENT.cta.description}</p>
          </div>
          <Link
            href={CONTENT.cta.cta.href}
            className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
          >
            {CONTENT.cta.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}

function ValueBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="w-8 h-0.5 bg-primary mb-3" />
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{body}</p>
    </div>
  );
}

function Audience({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border rounded p-4">
      <div className="font-medium text-foreground">{title}</div>
      <p className="text-muted-foreground mt-2 text-xs">{body}</p>
    </div>
  );
}

export default Home;
