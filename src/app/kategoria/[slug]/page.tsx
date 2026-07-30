import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, productsByCategory, type Category, type Product } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return { title: `${category.name} — projektorlampacsere.hu`, description: category.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return <CategoryView category={category} products={productsByCategory(slug)} />;
}


function CategoryView({ category, products }: { category: Category; products: Product[] }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <Link href="/katalogus" className="hover:text-foreground">Katalógus</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.shortName}</span>
      </nav>
      <div className="mt-4 text-xs tracking-[0.25em] text-primary font-medium">{category.technology}</div>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">{category.name}</h1>
      <p className="text-muted-foreground mt-3 max-w-3xl">{category.description}</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="border border-border rounded p-10 text-center text-muted-foreground text-sm">
          Ebben a kategóriában jelenleg nincs feltöltött termék. Vegye fel velünk a kapcsolatot a beszerzéshez.
        </div>
      )}
    </div>
  );
}
