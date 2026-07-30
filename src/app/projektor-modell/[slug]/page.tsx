import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPopularModel, popularModels } from "@/data/popular-models";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getPopularModel(slug);
  if (!model) return {};
  const title = `${model.brand} ${model.model} projektor izzó és lámpamodul | projektorlampacsere.hu`;
  const desc = `${model.brand} ${model.model} projektor lámpamodul beszerzés${model.lampPart ? ` (cikkszám: ${model.lampPart})` : ""}: ${model.resolution}, ${model.brightness}. Eredeti gyári izzó, tételes árajánlat áfás számlával.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `${SITE_URL}/projektor-modell/${model.slug}` },
    openGraph: {
      title: `${model.brand} ${model.model} — projektor lámpamodul`,
      description: desc,
      url: `${SITE_URL}/projektor-modell/${model.slug}`,
      locale: "hu_HU",
    },
  };
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-foreground ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = getPopularModel(slug);
  if (!model) notFound();

  const related = popularModels
    .filter((p) => p.brand === model.brand && p.slug !== model.slug)
    .slice(0, 6);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Főoldal
        </Link>
        <span className="mx-2">/</span>
        <Link href="/projektor-modell" className="hover:text-foreground">
          Modellek
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/markak/${model.brandSlug}`} className="hover:text-foreground">
          {model.brand}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{model.model}</span>
      </nav>

      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium uppercase">
        {model.brand} projektor lámpamodul
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">
        {model.brand} {model.model} — projektor izzó és lámpamodul
      </h1>
      <p className="text-muted-foreground mt-4 text-base leading-relaxed">{model.context}</p>

      <dl className="mt-8 border border-border rounded text-sm divide-y divide-border bg-card">
        <Row label="Márka és modell" value={`${model.brand} ${model.model}`} />
        <Row label="Natív felbontás" value={model.resolution} />
        <Row label="Fényerő (gyári)" value={model.brightness} />
        {model.lampPart ? <Row label="Tipikus lámpa cikkszám" value={model.lampPart} mono /> : null}
        {model.wattage ? <Row label="Lámpa teljesítmény" value={model.wattage} /> : null}
      </dl>

      <p className="mt-4 text-xs text-muted-foreground">
        A fenti adatok a {model.brand} gyártói dokumentációja alapján kerültek feltüntetésre,
        tájékoztató jelleggel. A megrendelésre kerülő konkrét lámpamodul cikkszámát a tételes
        árajánlatban véglegesítjük; a teljes gyári (OEM) és az eredeti diszkont kivitel árát
        egyaránt megadjuk.
      </p>

      <div className="mt-8 border border-border rounded p-5 bg-surface">
        <h2 className="text-base font-semibold">
          Mit szállítunk a {model.brand} {model.model}-hez?
        </h2>
        <p className="mt-2 text-sm text-foreground leading-relaxed">
          Eredeti gyári izzó (Philips UHP, Osram P-VIP, Ushio NSH vagy Phoenix SHP — a{" "}
          {model.brand} eredeti specifikációjának megfelelően), méretpontos, utángyártott
          modulkeretbe szerelve. Műszakilag azonos fényerő, színhőmérséklet és élettartam a
          teljes gyári cseremodullal, jellemzően annak 25–55%-áért. Garancia: 6 hónap,
          legfeljebb 500 üzemóra. Áfás számla, tételes magyar nyelvű egyenértékűségi
          nyilatkozat — beszerzési eljárásban is benyújtható.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/ajanlatkeres"
          className="px-5 py-2.5 bg-cta text-cta-foreground hover:bg-cta-hover rounded font-medium text-sm"
        >
          {model.brand} {model.model} árajánlatot kérek
        </Link>
        <Link
          href={`/markak/${model.brandSlug}`}
          className="px-5 py-2.5 border border-border rounded text-sm font-medium hover:bg-surface"
        >
          {model.brand} márkaoldal
        </Link>
      </div>

      {related.length > 0 && (
        <>
          <h2 className="mt-14 text-lg font-semibold">További {model.brand} modellek</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/projektor-modell/${p.slug}`}
                className="block border border-border rounded p-3 bg-card hover:bg-surface transition-colors text-sm"
              >
                <span className="font-medium text-foreground">
                  {p.brand} {p.model}
                </span>
                <span className="text-muted-foreground"> — {p.resolution}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
