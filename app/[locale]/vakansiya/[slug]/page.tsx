import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVacancies, getVacancyBySlug } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { alternates, fmt, localePath, type Locale } from "@/lib/i18n";
import { formatDate, formatSalary, jobPostingJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import ShareButton from "@/components/ShareButton";
import VacancyCard from "@/components/VacancyCard";
import TierBadge from "@/components/TierBadge";
import { getExtra } from "@/lib/dict-extra";
import { BOOSTS, fmtPrice } from "@/lib/boosts";

type Props = { params: { locale: Locale; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = getDict(locale);
  const v = await getVacancyBySlug(locale, params.slug);
  if (!v) return {};
  const where = v.district ? `${v.district}, ${v.city.name}` : v.city.name;
  return {
    title: fmt(t.vacancy.metaTitle, { title: v.title, company: v.company.name, where }),
    description: fmt(t.vacancy.metaDesc, { title: v.title, where, salary: formatSalary(t.salary, v.salaryMin, v.salaryMax), schedule: t.schedule[v.schedule] }),
    alternates: alternates(locale, `/vakansiya/${v.slug}`),
  };
}

export default async function VacancyPage({ params }: Props) {
  const { locale } = params;
  const t = getDict(locale);
  const x = getExtra(locale);
  const v = await getVacancyBySlug(locale, params.slug);
  if (!v) notFound();

  const similar = (await getVacancies(locale, { category: v.category.slug }, { external: true })).filter((x) => x.id !== v.id).slice(0, 2);
  const tel = v.contactPhone?.replace(/\s/g, "");

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(v, locale)) }} />

      <nav className="text-sm text-muted" aria-label={t.vacancy.navAria}>
        <Link href={localePath(locale, "/")} className="hover:underline">{t.vacancy.home}</Link> /{" "}
        <Link href={localePath(locale, `/is-elanlari/${v.city.slug}/${v.category.slug}`)} className="hover:underline">{v.category.name}</Link>
      </nav>

      <header className={`animate-fade-up rounded-2xl p-5 ${v.tier === "gold" ? "border-2 border-gold-line bg-gold-soft" : "bg-brand-soft"}`}>
        {v.tier && <TierBadge tier={v.tier} label={x.card[v.tier]} className="mb-2" />}
        <h1 className="text-2xl font-medium text-brand-dark">{v.title}</h1>
        <p className="mt-1 text-body">{v.company.name}</p>
        <p className="mt-3 text-lg font-medium">{formatSalary(t.salary, v.salaryMin, v.salaryMax)}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-body">
          <span>{v.district ? `${v.district}, ${v.city.name}` : v.city.name}</span>
          <span>{t.schedule[v.schedule]}</span>
          <span>{v.experienceYears > 0 ? fmt(t.vacancy.expYears, { n: v.experienceYears }) : t.vacancy.noExp}</span>
          <span>{formatDate(t.date, v.publishedAt)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tel && <a href={`tel:${tel}`} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95">{t.vacancy.call}</a>}
          {v.contactTelegram && <a href={`https://t.me/${v.contactTelegram}`} className="rounded-lg border border-brand bg-surface px-5 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand-soft active:scale-95">{t.vacancy.telegram}</a>}
          <ShareButton title={v.title} label={t.vacancy.share} doneLabel={t.vacancy.copied} />
        </div>
      </header>

      {v.tier !== "gold" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-gold-line px-4 py-3 text-sm">
          <span className="text-body">{x.boost.ownerVacancy}</span>
          <Link href={`${localePath(locale, "/one-cixar")}?type=vacancy&plan=premium&item=${encodeURIComponent(`${v.title} — ${v.company.name}`)}`} className="font-medium text-gold hover:underline">
            {x.boost.ctaVacancy} · {fmt(x.boost.fromPrice, { p: fmtPrice(BOOSTS.vacancy.bump.price) })}
          </Link>
        </div>
      )}

      <section>
        <h2 className="mb-2 text-lg font-medium">{t.vacancy.description}</h2>
        <p className="whitespace-pre-line leading-relaxed text-body">{v.description}</p>
      </section>

      {v.requirements && (
        <section>
          <h2 className="mb-2 text-lg font-medium">{t.vacancy.requirements}</h2>
          <ul className="list-disc space-y-1 pl-5 text-body">
            {v.requirements.split("\n").map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">{t.vacancy.similar}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{similar.map((s, i) => <Reveal key={s.id} delay={i * 80} className="h-full"><VacancyCard v={s} locale={locale} t={t} /></Reveal>)}</div>
        </section>
      )}
    </article>
  );
}
