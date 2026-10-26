import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { Body, Cover, PostCard, fmtDate, headingId } from "@/components/BlogParts";
import { getPost, getPostSlugs, getPosts } from "@/lib/blog";
import { getExtra } from "@/lib/dict-extra";
import { alternates, fmt, localeMeta, localePath, locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

type Props = { params: { locale: Locale; slug: string } };

export function generateStaticParams() {
  return locales.flatMap((locale) => getPostSlugs().map((p) => ({ locale, slug: p.slug })));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getPost(params.locale, params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: alternates(params.locale, `/blog/${p.slug}`),
    openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date, modifiedTime: p.updated ?? p.date, locale: localeMeta[params.locale].og },
  };
}

export default function PostPage({ params }: Props) {
  const { locale } = params;
  const x = getExtra(locale);
  const p = getPost(locale, params.slug);
  if (!p) notFound();
  const heads = p.body.filter((b): b is { t: "h"; x: string } => b.t === "h");
  const related = getPosts(locale).filter((r) => r.slug !== p.slug).sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, 3);
  const url = SITE_URL + localePath(locale, `/blog/${p.slug}`);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        inLanguage: locale,
        datePublished: p.date,
        dateModified: p.updated ?? p.date,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "İşYeri.az", url: SITE_URL },
        publisher: { "@type": "Organization", name: "İşYeri.az", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: x.blog.h1, item: SITE_URL + localePath(locale, "/blog") },
          { "@type": "ListItem", position: 2, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-3xl space-y-5">
        <nav className="text-sm text-muted">
          <Link href={localePath(locale, "/blog")} className="hover:underline">← {x.blog.back}</Link>
        </nav>
        <header className="animate-fade-up space-y-3">
          <p className="text-sm font-medium text-brand-dark">{p.category === "employers" ? x.blog.employers : x.blog.seekers}</p>
          <h1 className="text-3xl font-medium leading-tight text-ink sm:text-4xl">{p.title}</h1>
          <p className="text-lg text-body">{p.excerpt}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted"><time dateTime={p.date}>{fmtDate(p.date, locale)}</time> · {fmt(x.blog.readMin, { n: p.readMin })}</p>
            <ShareButton title={p.title} label={x.blog.share} doneLabel={x.blog.copied} />
          </div>
        </header>
        <Cover p={p} big />

        {heads.length >= 3 && (
          <nav aria-label={x.blog.toc} className="rounded-xl border border-brand-line p-4">
            <p className="mb-2 text-sm font-medium text-ink">{x.blog.toc}</p>
            <ol className="space-y-1 text-sm">
              {heads.map((h) => <li key={h.x}><a href={`#${headingId(h.x)}`} className="text-body hover:text-brand-dark hover:underline">{h.x}</a></li>)}
            </ol>
          </nav>
        )}

        <Body blocks={p.body} locale={locale} x={x} slug={p.slug} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-brand-line pt-8">
          <h2 className="mb-4 text-lg font-medium">{x.blog.related}</h2>
          <div className="grid gap-4 sm:grid-cols-3">{related.map((r) => <PostCard key={r.slug} p={r} locale={locale} x={x} />)}</div>
        </section>
      )}
    </article>
  );
}
