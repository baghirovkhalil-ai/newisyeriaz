import type { Metadata } from "next";
import Link from "next/link";
import CandidateCard from "@/components/CandidateCard";
import Reveal from "@/components/Reveal";
import { getCandidates } from "@/lib/candidates";
import { karyeraLink } from "@/lib/cv-samples";
import { getCategories, getCities } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";
import { alternates, fmt, localePath, type Locale } from "@/lib/i18n";
import { IS_DEMO } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const x = getExtra(params.locale).cvdb;
  return { title: x.metaTitle, description: x.metaDesc, alternates: alternates(params.locale, "/cv-bazasi") };
}

type SP = { q?: string; category?: string; city?: string };
const input = "w-full rounded-lg border border-brand-line bg-surface px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm focus:border-brand";

export default async function CvDbPage({ params, searchParams }: { params: { locale: Locale }; searchParams: SP }) {
  const locale = params.locale;
  const t = getDict(locale);
  const x = getExtra(locale);
  const [list, categories, cities] = await Promise.all([getCandidates(locale, searchParams), getCategories(locale), getCities(locale)]);
  const btn = "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition active:scale-95";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">{x.cvdb.h1}</h1>
          <p className="mt-1 text-body">{x.cvdb.sub}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={localePath(locale, "/cv-yerlesdir")} className={`${btn} bg-brand text-on-brand hover:opacity-90`}>{x.cvdb.postBtn}</Link>
          <a href={karyeraLink("cvdb")} target="_blank" rel="noopener" className={`${btn} border border-brand text-brand-dark hover:bg-brand-soft`}>{x.cvdb.createBtn} ↗</a>
        </div>
      </div>

      <form method="get" className="grid gap-2 rounded-xl bg-brand-soft p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input name="q" defaultValue={searchParams.q} placeholder={x.cvdb.searchPh} aria-label={x.cvdb.searchPh} className={input} />
        <select name="category" defaultValue={searchParams.category ?? ""} aria-label={x.cvdb.allCategories} className={input}>
          <option value="">{x.cvdb.allCategories}</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="city" defaultValue={searchParams.city ?? ""} aria-label={x.cvdb.allCities} className={input}>
          <option value="">{x.cvdb.allCities}</option>
          {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95 sm:py-2.5">{x.cvdb.search}</button>
      </form>

      <p className="text-sm text-muted">{fmt(x.cvdb.results, { n: list.length })}</p>
      {list.length === 0 ? (
        <p className="rounded-xl border border-brand-line p-6 text-center text-muted">{x.cvdb.empty}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((c, i) => <Reveal key={c.id} delay={(i % 2) * 70} className="h-full"><CandidateCard c={c} locale={locale} t={t} x={x} /></Reveal>)}
        </div>
      )}
      {IS_DEMO && <p className="text-center text-xs text-muted">{x.cvdb.sampleNote}</p>}

      <section className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-gold-line p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">{x.cvdb.seekerTitle}</h2>
          <p className="text-sm text-body">{x.cvdb.seekerText}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={localePath(locale, "/cv-yerlesdir")} className={`${btn} bg-brand text-on-brand hover:opacity-90`}>{x.cvdb.postBtn}</Link>
          <Link href={`${localePath(locale, "/qiymetler")}#one-cixar`} className={`${btn} border border-gold-line text-gold hover:bg-gold-soft`}>{x.boost.ctaCv}</Link>
        </div>
      </section>
    </div>
  );
}
