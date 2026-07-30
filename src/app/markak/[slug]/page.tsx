import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brandPages, getBrandPage } from "@/data/brand-pages";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getBrandPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/markak/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/markak/${page.slug}`,
      locale: "hu_HU",
    },
  };
}

export default async function BrandPageView({ params }: Props) {
  const { slug } = await params;
  const page = getBrandPage(slug);
  if (!page) notFound();

  const others = brandPages.filter((b) => b.slug !== page.slug).slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Főoldal
        </Link>
        <span className="mx-2">/</span>
        <Link href="/markak" className="hover:text-foreground">
          Márkák
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{page.brand}</span>
      </nav>

      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium uppercase">
        {page.brand}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">{page.name}</h1>
      <p className="text-muted-foreground mt-4 text-base leading-relaxed">{page.intro}</p>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-foreground">
        {page.body.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-10 border border-border rounded p-5 bg-surface text-sm">
        <div className="text-xs tracking-[0.2em] text-primary font-medium uppercase">
          Technológia és cikkszám
        </div>
        <p className="mt-2 text-foreground">{page.technologyNote}</p>
      </div>

      <h2 className="mt-12 text-xl font-semibold">
        Jellemző {page.brand} modellek lámpamodul beszerzéshez
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Az alábbi típusok lámpamoduljára azonnal árajánlatot adunk. Egyéb {page.brand} típushoz is
        rendelkezésre állunk — küldje el a vetítő típusszámát az ajánlatkérő űrlapon.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {page.popularModels.map((m: string) => (
          <span
            key={m}
            className="inline-flex items-center rounded border border-border bg-card px-2.5 py-1 text-xs font-mono text-foreground"
          >
            {page.brand} {m}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          {page.brand} lámpamodul árajánlatot kérek
        </Link>
        <Link
          href="/katalogus"
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          Teljes katalógus
        </Link>
      </div>

      <h2 className="mt-16 text-xl font-semibold">További márkák</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {others.map((b) => (
          <Link
            key={b.slug}
            href={`/markak/${b.slug}`}
            className="block border border-border rounded p-4 bg-card hover:bg-surface transition-colors text-sm"
          >
            <span className="font-medium text-foreground">{b.brand}</span>
            <span className="text-muted-foreground">
              {" "}
              — {b.name.replace(/ projektor izzó és lámpamodul$/, "")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
