import type { Metadata } from "next";
import SearchForm from "@/components/SearchForm";
import CategoryChips from "@/components/CategoryChips";
import Reveal from "@/components/Reveal";
import VacancyCard from "@/components/VacancyCard";
import Pagination from "@/components/Pagination";
import { getCategories, getCities, getVacancies } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { alternates, fmt, type Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = getDict(params.locale);
  return { title: t.list.metaTitle, description: t.list.metaDesc, alternates: alternates(params.locale, "/vakansiyalar") };
}

const PAGE_SIZE = 20;
type SP = { q?: string; category?: string; city?: string; schedule?: string; minSalary?: string; page?: string };

export default async function VacanciesPage({ params, searchParams }: { params: { locale: Locale }; searchParams: SP }) {
  const locale = params.locale;
  const t = getDict(locale);
  const { page: pageParam, ...filters } = searchParams;
  const [categories, cities, list] = await Promise.all([
    getCategories(locale),
    getCities(locale),
    getVacancies(locale, { ...filters, minSalary: filters.minSalary ? Number(filters.minSalary) : undefined }),
  ]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const visible = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-medium">{t.list.h1}</h1>
      <SearchForm categories={categories} cities={cities} locale={locale} t={t} values={filters} />
      <CategoryChips categories={categories} active={filters.category} params={filters} locale={locale} t={t} />
      <p className="text-sm text-muted">{fmt(t.list.results, { n: list.length })}</p>
      {list.length === 0 ? (
        <p className="rounded-xl border border-brand-line p-6 text-center text-muted">{t.list.empty}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">{visible.map((v, i) => <Reveal key={v.id} delay={(i % 2) * 70} className="h-full"><VacancyCard v={v} locale={locale} t={t} /></Reveal>)}</div>
      )}
      <Pagination page={page} totalPages={totalPages} params={filters} locale={locale} t={t} />
    </div>
  );
}
