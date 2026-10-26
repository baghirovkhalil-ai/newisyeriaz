import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Cover, PostCard, fmtDate } from "@/components/BlogParts";
import { getPosts, isCategory } from "@/lib/blog";
import { getExtra } from "@/lib/dict-extra";
import { alternates, fmt, localePath, type Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const b = getExtra(params.locale).blog;
  return { title: b.metaTitle, description: b.metaDesc, alternates: alternates(params.locale, "/blog") };
}

export default function BlogPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { k?: string } }) {
  const locale = params.locale;
  const x = getExtra(locale);
  const cat = isCategory(searchParams.k) ? searchParams.k : undefined;
  const posts = getPosts(locale, cat);
  const [first, ...rest] = posts;
  const base = localePath(locale, "/blog");
  const tabs: [string | undefined, string][] = [[undefined, x.blog.all], ["seekers", x.blog.seekers], ["employers", x.blog.employers]];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-medium">{x.blog.h1}</h1>
        <p className="mt-1 text-body">{x.blog.sub}</p>
      </header>

      <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" aria-label={x.blog.h1}>
        {tabs.map(([k, label]) => (
          <Link key={label} href={k ? `${base}?k=${k}` : base} aria-current={cat === k ? "page" : undefined}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${cat === k ? "border-brand bg-brand text-on-brand" : "border-brand-line hover:border-brand hover:bg-brand-soft"}`}>{label}</Link>
        ))}
      </nav>

      {first && (
        <Reveal>
          <Link href={localePath(locale, `/blog/${first.slug}`)} className="group grid overflow-hidden rounded-2xl border border-brand-line bg-surface transition hover:border-brand hover:shadow-lg hover:shadow-brand/15 md:grid-cols-[1.1fr_1fr]">
            <Cover p={first} big />
            <div className="flex flex-col justify-center p-5 sm:p-6">
              <p className="text-xs font-medium text-brand-dark">{first.category === "employers" ? x.blog.employers : x.blog.seekers}</p>
              <h2 className="mt-1 text-xl font-medium leading-snug text-ink sm:text-2xl">{first.title}</h2>
              <p className="mt-2 text-body">{first.excerpt}</p>
              <p className="mt-3 text-xs text-muted">{fmtDate(first.date, locale)} · {fmt(x.blog.readMin, { n: first.readMin })}</p>
              <span className="mt-4 text-sm font-medium text-brand-dark">{x.blog.read} →</span>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => <Reveal key={p.slug} delay={(i % 3) * 70} className="h-full"><PostCard p={p} locale={locale} x={x} /></Reveal>)}
      </div>
    </div>
  );
}
