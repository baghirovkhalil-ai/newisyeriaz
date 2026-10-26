import Link from "next/link";
import type { Block, CtaKind } from "@/lib/blog";
import type { PostView } from "@/lib/blog";
import { karyeraLink } from "@/lib/cv-samples";
import type { Extra } from "@/lib/dict-extra";
import { fmt, localePath, type Locale } from "@/lib/i18n";

export const headingId = (s: string) =>
  s.toLowerCase().replace(/[əƏ]/g, "e").replace(/[ıİ]/g, "i").replace(/[öÖ]/g, "o").replace(/[üÜ]/g, "u").replace(/[şŞ]/g, "s").replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g")
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Şəkilsiz örtük: məqalənin rəngi + ikon */
export function Cover({ p, big = false }: { p: Pick<PostView, "hue" | "icon">; big?: boolean }) {
  return (
    <div aria-hidden="true" className={`relative grid place-items-center overflow-hidden ${big ? "h-40 rounded-2xl sm:h-52" : "h-32 rounded-t-xl"}`}
      style={{ background: `linear-gradient(135deg, hsl(${p.hue} 85% 60% / .22), hsl(${(p.hue + 40) % 360} 85% 55% / .10))` }}>
      <div className="dot-grid absolute inset-0 opacity-60" />
      <span className={`relative transition duration-500 group-hover:-rotate-6 group-hover:scale-110 ${big ? "text-6xl" : "text-5xl"}`}>{p.icon}</span>
    </div>
  );
}

export function PostCard({ p, locale, x }: { p: PostView; locale: Locale; x: Extra }) {
  return (
    <Link href={localePath(locale, `/blog/${p.slug}`)} className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg hover:shadow-brand/15">
      <Cover p={p} />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-brand-dark">{p.category === "employers" ? x.blog.employers : x.blog.seekers}</p>
        <h3 className="mt-1 text-base font-medium leading-snug text-ink">{p.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-body">{p.excerpt}</p>
        <p className="mt-3 text-xs text-muted">{fmtDate(p.date, locale)} · {fmt(x.blog.readMin, { n: p.readMin })}</p>
      </div>
    </Link>
  );
}

const MONTHS: Record<Locale, string[]> = {
  az: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
export function fmtDate(iso: string, l: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return l === "en" ? `${MONTHS.en[m - 1]} ${d}, ${y}` : `${d} ${MONTHS[l][m - 1]} ${y}`;
}

function ctaHref(kind: CtaKind, locale: Locale, slug: string) {
  const p = (path: string) => localePath(locale, path);
  switch (kind) {
    case "cv": case "interview": return { href: karyeraLink(`blog_${slug}`), ext: true };
    case "jobs": return { href: p("/vakansiyalar"), ext: false };
    case "remote": return { href: `${p("/vakansiyalar")}?schedule=remote`, ext: false };
    case "post": return { href: p("/elan-yerlesdir"), ext: false };
    case "boost": return { href: `${p("/qiymetler")}#one-cixar`, ext: false };
    case "cvdb": return { href: p("/cv-bazasi"), ext: false };
    case "cvpost": return { href: p("/cv-yerlesdir"), ext: false };
  }
}

export function Cta({ kind, locale, x, slug }: { kind: CtaKind; locale: Locale; x: Extra; slug: string }) {
  const c = x.blog.cta[kind], { href, ext } = ctaHref(kind, locale, slug);
  const gold = kind === "boost";
  const cls = `inline-flex shrink-0 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition active:scale-95 hover:opacity-90 ${gold ? "bg-gold text-surface" : "bg-brand text-on-brand"}`;
  return (
    <aside className={`not-prose my-6 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between ${gold ? "border-2 border-gold-line bg-gold-soft" : "bg-brand-soft"}`}>
      <div>
        <p className="text-base font-medium text-ink">{c.title}</p>
        <p className="mt-0.5 text-sm text-body">{c.text}</p>
      </div>
      {ext ? <a href={href} target="_blank" rel="noopener" className={cls}>{c.btn} ↗</a> : <Link href={href} className={cls}>{c.btn}</Link>}
    </aside>
  );
}

export function Body({ blocks, locale, x, slug }: { blocks: Block[]; locale: Locale; x: Extra; slug: string }) {
  return (
    <div className="space-y-4 text-[1.05rem] leading-relaxed text-body">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p": return <p key={i}>{b.x}</p>;
          case "h": return <h2 key={i} id={headingId(b.x)} className="scroll-mt-24 pt-4 text-xl font-medium text-ink">{b.x}</h2>;
          case "ul": return <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-brand">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
          case "ol": return <ol key={i} className="list-decimal space-y-2 pl-5 marker:font-medium marker:text-brand-dark">{b.items.map((it) => <li key={it} className="pl-1">{it}</li>)}</ol>;
          case "quote": return <blockquote key={i} className="rounded-r-xl border-l-4 border-brand bg-brand-soft px-4 py-3 italic text-ink">{b.x}</blockquote>;
          case "tip": return (
            <div key={i} className="flex gap-3 rounded-xl border border-gold-line bg-gold-soft/60 px-4 py-3 text-[0.98rem]">
              <span aria-hidden="true" className="text-lg">💡</span>
              <p><b className="font-medium text-ink">{x.blog.tip}: </b>{b.x}</p>
            </div>
          );
          case "cta": return <Cta key={i} kind={b.kind} locale={locale} x={x} slug={slug} />;
        }
      })}
    </div>
  );
}
