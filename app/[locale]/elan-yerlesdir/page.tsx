import type { Metadata } from "next";
import Link from "next/link";
import PostForm from "@/components/PostForm";
import { getBakuDistricts, getCategories, getCities } from "@/lib/data";
import { getDict } from "@/lib/dictionaries";
import { alternates, fmt, localePath, type Locale } from "@/lib/i18n";
import { isPlan } from "@/lib/plans";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = getDict(params.locale);
  return { title: t.post.metaTitle, description: t.post.metaDesc, alternates: alternates(params.locale, "/elan-yerlesdir") };
}

export default async function PostPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { plan?: string } }) {
  const locale = params.locale;
  const t = getDict(locale);
  const [categories, cities, districts] = await Promise.all([getCategories(locale), getCities(locale), getBakuDistricts(locale)]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium">{t.post.h1}</h1>
        <p className="mt-1 text-body">{t.post.sub}</p>
      </div>
      {isPlan(searchParams.plan) && (
        <div className="flex animate-fade-up flex-wrap items-center justify-between gap-2 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm">
          <span className="font-medium text-brand-dark">✦ {fmt(t.post.plan, { plan: t.pricing.plans[searchParams.plan].name })}</span>
          <Link href={localePath(locale, "/qiymetler")} className="text-body underline-offset-2 hover:underline">{t.post.changePlan}</Link>
        </div>
      )}
      <PostForm
        t={t.form}
        salaryT={t.salary}
        todayLabel={t.date.today}
        categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
        cities={cities.map((c) => ({ value: c.slug, label: c.name }))}
        schedules={Object.entries(t.schedule).map(([value, label]) => ({ value, label }))}
        districts={districts}
      />
    </div>
  );
}
