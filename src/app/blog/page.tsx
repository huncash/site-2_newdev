import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tudásbázis — projektor izzó és lámpamodul cikkek | projektorlampacsere.hu",
  description: "Szakmai cikkek projektor lámpamodul cseréhez: árak, élettartam, technológiai különbségek (UHP, UHE, NSH, P-VIP) és az elhasználódott izzó felismerhető jelei.",
};

import { canonical, SITE_URL } from "@/lib/seo";
import { sortedPosts } from "@/data/blog";

function BlogIndex() {
  const posts = sortedPosts();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Főoldal</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tudásbázis</span>
      </nav>
      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">Tudásbázis</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Szakmai írások projektor lámpamodul választásához, cseréjéhez és üzemeltetéséhez —
          intézményi karbantartók, AV-integrátorok és vállalati üzemeltetők részére.
        </p>
      </header>

      <ul className="mt-10 space-y-8 border-t border-border pt-8">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-border pb-8">
            <article>
              <div className="text-xs text-muted-foreground">
                <time dateTime={p.publishedAt}>
                  {new Date(p.publishedAt).toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="mx-2">·</span>
                <span>{p.readingMinutes} perc olvasás</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                <Link href={`/blog/${p.slug }`}
                  className="hover:text-primary"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-foreground/80">{p.excerpt}</p>
              <Link href={`/blog/${p.slug }`}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Tovább olvasom →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BlogIndex;
