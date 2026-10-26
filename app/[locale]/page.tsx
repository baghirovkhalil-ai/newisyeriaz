import type { Metadata } from "next";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import VacancyCard from "@/components/VacancyCard";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { karyeraLink } from "@/lib/cv-samples";
import { getCategories, getCategoryCounts, getCities, getVacancies } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";
import { getCandidates } from "@/lib/candidates";
import CandidateCard from "@/components/CandidateCard";
import { PostCard } from "@/components/BlogParts";
import { getPosts } from "@/lib/blog";
import { categoryIcons } from "@/lib/icons";
import { alternates, localePath, type Locale } from "@/lib/i18n";

type Props = { params: { locale: Locale } };

export function generateMetadata({ params }: Props): Metadata {
  return { alternates: alternates(params.locale, "/") };
}

export default async function Home({ params }: Props) {
  const locale = params.locale;
  const t = getDict(locale);
  const x = getExtra(locale);
  const [categories, cities, all, counts, cands] = await Promise.all([getCategories(locale), getCities(locale), getVacancies(locale), getCategoryCounts(), getCandidates(locale)]);
  const gold = all.filter((v) => v.tier === "gold");
  const rest = all.filter((v) => v.tier !== "gold");
  const goldCands = cands.filter((c) => c.tier === "gold").slice(0, 2);
  const list = localePath(locale, "/vakansiyalar");
  const stats = [
    { n: all.length, label: t.home.stats.jobs },
    { n: cities.length, label: t.home.stats.cities },
    { n: categories.length, label: t.home.stats.fields },
  ];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-brand-soft p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="dot-grid absolute inset-0" />
          <div className="absolute -left-10 -top-16 h-56 w-56 animate-float rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-64 w-64 animate-float-slow rounded-full bg-brand-dark/15 blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="animate-fade-up text-3xl font-medium sm:text-4xl">
            <span className="animate-gradient bg-gradient-to-r from-brand-dark via-brand to-brand-dark bg-[length:200%_100%] bg-clip-text text-transparent">{t.home.h1}</span>
          </h1>
          <p className="mb-5 mt-2 max-w-xl animate-fade-up text-body" style={{ animationDelay: "120ms" }}>{t.home.sub}</p>
          <div className="animate-fade-up" style={{ animationDelay: "220ms" }}>
            <SearchForm categories={categories} cities={cities} locale={locale} t={t} />
          </div>
          <div className="mt-5 flex animate-fade-up flex-wrap gap-2 text-sm" style={{ animationDelay: "320ms" }}>
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5 rounded-full border border-brand-line bg-surface/70 px-3.5 py-1.5 backdrop-blur">
                <span className="text-base font-medium text-brand-dark"><CountUp value={s.n} locale={locale} /></span>
                <span className="text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {gold.length > 0 && (
        <section aria-labelledby="gold-h" className="rounded-2xl border-2 border-gold-line bg-gold-soft/40 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="gold-h" className="flex items-center gap-2 text-lg font-medium">
              <svg width="20" height="20" viewBox="0 0 24 24" className="fill-gold" aria-hidden="true"><path d="M3 8l4.5 4L12 4l4.5 8L21 8l-2 11H5z" /></svg>
              {x.home.goldTitle}
            </h2>
            <Link href={`${localePath(locale, "/one-cixar")}?type=vacancy&plan=gold`} className="text-sm font-medium text-gold hover:underline">{x.home.goldCta} →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {gold.slice(0, 6).map((v, i) => (
              <Reveal key={v.id} delay={(i % 2) * 80} className="h-full"><VacancyCard v={v} locale={locale} t={t} /></Reveal>
            ))}
          </div>
        </section>
      )}

      <Reveal>
        <section>
          <h2 className="mb-3 text-lg font-medium">{t.home.byCategory}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.id} href={`${list}?category=${c.slug}`} className="group flex min-h-[3.5rem] items-center justify-between gap-2 rounded-lg border border-brand-line px-3 py-2.5 text-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft hover:shadow-md hover:shadow-brand/10 active:scale-[.98]">
                <span className="flex min-w-0 items-center gap-2.5 leading-tight">
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-base transition duration-300 group-hover:-rotate-6 group-hover:scale-125">{categoryIcons[c.slug] ?? "💼"}</span>
                  <span className="min-w-0 break-words">{c.name}</span>
                </span>
                <span className="shrink-0 rounded-md bg-brand-soft px-1.5 text-xs text-brand-dark transition group-hover:bg-surface">{counts[c.slug] ?? 0}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section>
          <h2 className="mb-3 text-lg font-medium">{t.home.byCity}</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link key={c.id} href={`${list}?city=${c.slug}`} className="rounded-full border border-brand-line px-4 py-1.5 text-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft active:scale-95">{c.name}</Link>
            ))}
          </div>
        </section>
      </Reveal>

      <section>
        <Reveal>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-medium">{t.home.latest}</h2>
            <Link href={list} className="text-sm text-brand-dark hover:underline">{t.home.viewAll}</Link>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.slice(0, 10).map((v, i) => (
            <Reveal key={v.id} delay={(i % 2) * 80} className="h-full"><VacancyCard v={v} locale={locale} t={t} /></Reveal>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href={list} className="inline-block rounded-lg border border-brand px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand-soft active:scale-95">{t.home.viewAllN.replace("{n}", String(all.length))}</Link>
        </div>
      </section>

      <Reveal>
        <section className="flex flex-col gap-4 rounded-2xl bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/15 text-xl">📄</span>
            <div>
              <h2 className="text-lg font-medium">{t.home.cvTitle}</h2>
              <p className="text-sm text-body">{t.home.cvText}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href={karyeraLink("home_banner")} target="_blank" rel="noopener" className="inline-block rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95">{t.home.cvBtn} ↗</a>
            <Link href={localePath(locale, "/cv-yarat")} className="inline-block rounded-lg border border-brand bg-surface px-5 py-3 text-sm font-medium text-brand-dark transition hover:bg-surface/70 active:scale-95">{t.home.cvSamples}</Link>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="rounded-2xl border border-brand-line p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-medium">{x.home.cvdbTitle}</h2>
              <p className="mt-1 text-sm text-body">{x.home.cvdbText}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href={localePath(locale, "/cv-bazasi")} className="inline-block rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95">{x.home.cvdbBtn}</Link>
              <Link href={localePath(locale, "/cv-yerlesdir")} className="inline-block rounded-lg border border-brand px-5 py-3 text-sm font-medium text-brand-dark transition hover:bg-brand-soft active:scale-95">{x.home.cvdbPost}</Link>
            </div>
          </div>
          {goldCands.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {goldCands.map((c) => <CandidateCard key={c.id} c={c} locale={locale} t={t} x={x} />)}
            </div>
          )}
        </section>
      </Reveal>

      <section>
        <Reveal>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-medium">{x.blog.latest}</h2>
            <Link href={localePath(locale, "/blog")} className="text-sm text-brand-dark hover:underline">{x.blog.latestAll}</Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {getPosts(locale).slice(0, 3).map((p, i) => <Reveal key={p.slug} delay={i * 70} className="h-full"><PostCard p={p} locale={locale} x={x} /></Reveal>)}
        </div>
      </section>

      <Reveal>
        <section className="relative overflow-hidden rounded-2xl border border-brand-line p-6 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-brand/15 blur-3xl" />
          <h2 className="relative text-lg font-medium">{t.home.employerTitle}</h2>
          <p className="relative mb-3 mt-1 text-body">{t.home.employerText}</p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <Link href={localePath(locale, "/elan-yerlesdir")} className="inline-block rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95">{t.home.employerBtn}</Link>
            <Link href={localePath(locale, "/qiymetler")} className="inline-block rounded-lg border border-brand px-5 py-3 text-sm font-medium text-brand-dark transition hover:bg-brand-soft active:scale-95">{t.nav.pricing}</Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
