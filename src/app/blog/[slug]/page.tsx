import Link from "next/link";
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

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${j}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      if (isInternal) {
        return (
          <Link key={`${keyPrefix}-${j}`} href={href} className="text-primary hover:underline">
            {label}
          </Link>
        );
      }
      return (
        <a
          key={`${keyPrefix}-${j}`}
          href={href}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    }
    return <span key={`${keyPrefix}-${j}`}>{part}</span>;
  });
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-semibold tracking-tight mt-10 mb-3">
          {block.replace(/^## /, "")}
        </h2>
      );
    }
    const img = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      return (
        <figure key={i} className="my-8">
          <img
            src={img[2]}
            alt={img[1]}
            loading="lazy"
            width={1536}
            height={896}
            className="w-full h-auto rounded border border-border bg-surface"
          />
        </figure>
      );
    }
    const lines = block.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith("|"))) {
      const rows = lines
        .filter((l) => !/^\s*\|?[\s\-:|]+\|?\s*$/.test(l))
        .map((l) =>
          l
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim()),
        );
      if (rows.length >= 1) {
        const [header, ...bodyRows] = rows;
        return (
          <div key={i} className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-border">
              <thead className="bg-surface">
                <tr>
                  {header.map((cell, h) => (
                    <th
                      key={h}
                      className="border-b border-border px-3 py-2 text-left align-top font-semibold text-foreground"
                    >
                      {renderInline(cell, `h-${i}-${h}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="border-b border-border px-3 py-2 text-left align-top text-foreground/90"
                      >
                        {renderInline(cell, `c-${i}-${r}-${c}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    return (
      <p key={i} className="text-foreground/90 leading-relaxed mt-4">
        {renderInline(block, `p-${i}`)}
      </p>
    );
  });
}

function BlogPostView({ post }: { post: BlogPost }) {
  const related = sortedPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Főoldal
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-foreground">
          Tudásbázis
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{post.title}</span>
      </nav>

      <article className="mt-6">
        <header>
          <div className="text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="mx-2">·</span>
            <span>{post.readingMinutes} perc olvasás</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        </header>

        <div className="mt-8 border-t border-border pt-2">{renderBody(post.body)}</div>

        <aside className="mt-12 border-t border-border pt-8">
          <div className="rounded border border-border bg-surface p-5">
            <h2 className="text-base font-semibold">Konkrét projektor lámpamodult keres?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adja meg projektorának típusszámát vagy a jelenlegi modul cikkszámát; tételes, áfás
              árajánlattal és visszaigazolt szállítási idővel válaszolunk.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ajanlatkeres"
                className="bg-cta text-cta-foreground hover:bg-cta-hover font-medium rounded px-4 py-2 text-sm hover:opacity-90"
              >
                Árajánlatot kérek
              </Link>
              <Link
                href="/katalogus"
                className="border border-border text-foreground font-medium rounded px-4 py-2 text-sm hover:bg-surface"
              >
                Katalógus
              </Link>
            </div>
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold tracking-tight">További cikkek</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <li key={p.slug} className="border border-border rounded p-4 bg-surface">
                <Link
                  href={`/blog/${p.slug}`}
                  className="font-medium text-foreground hover:text-primary"
                >
                  {p.title}
                </Link>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{p.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
