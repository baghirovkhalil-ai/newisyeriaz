import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import VacancyCard from "@/components/VacancyCard";
import { getCategoryBySlug, getCityBySlug, getNonEmptyCombos, getVacancies } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { alternates, fmt, locales, type Locale } from "@/lib/i18n";

type Props = { params: { locale: Locale; city: string; category: string } };

export async function generateStaticParams() {
  const combos = await getNonEmptyCombos();
  return locales.flatMap((locale) => combos.map((c) => ({ locale, ...c })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = getDict(locale);
  const [city, category] = await Promise.all([getCityBySlug(locale, params.city), getCategoryBySlug(locale, params.category)]);
  if (!city || !category) return {};
  const count = (await getVacancies(locale, { city: city.slug, category: category.slug }, { external: true })).length;
  const vars = { loc: city.loc, city: city.name, cat: category.name.toLocaleLowerCase(locale) };
  return {
    robots: count === 0 ? { index: false, follow: true } : undefined,
    title: fmt(t.landing.metaTitle, vars),
    description: fmt(t.landing.metaDesc, vars),
    alternates: alternates(locale, `/is-elanlari/${city.slug}/${category.slug}`),
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = params;
  const t = getDict(locale);
  const [city, category] = await Promise.all([getCityBySlug(locale, params.city), getCategoryBySlug(locale, params.category)]);
  if (!city || !category) notFound();

  const list = await getVacancies(locale, { city: city.slug, category: category.slug }, { external: true });
  const vars = { loc: city.loc, city: city.name, cat: category.name.toLocaleLowerCase(locale) };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium">{fmt(t.landing.h1, vars)}</h1>
      <p className="text-body">{list.length > 0 ? fmt(t.landing.count, { n: list.length }) : t.landing.none}</p>
      <div className="grid gap-3 sm:grid-cols-2">{list.map((v, i) => <Reveal key={v.id} delay={(i % 2) * 70} className="h-full"><VacancyCard v={v} locale={locale} t={t} /></Reveal>)}</div>
    </div>
  );
}
