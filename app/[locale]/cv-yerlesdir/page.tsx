import type { Metadata } from "next";
import CvPostForm from "@/components/CvPostForm";
import { karyeraLink } from "@/lib/cv-samples";
import { getCategories, getCities } from "@/lib/data";
import { getExtra } from "@/lib/dict-extra";
import { alternates, type Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const x = getExtra(params.locale).cvpost;
  return { title: x.metaTitle, description: x.metaDesc, alternates: alternates(params.locale, "/cv-yerlesdir") };
}

export default async function CvPostPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const x = getExtra(locale);
  const [categories, cities] = await Promise.all([getCategories(locale), getCities(locale)]);
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-medium">{x.cvpost.h1}</h1>
        <p className="mt-1 text-body">{x.cvpost.sub}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <span className="text-body">{x.cvpost.noCv}</span>
        <a href={karyeraLink("cv_post")} target="_blank" rel="noopener" className="font-medium text-brand-dark hover:underline">{x.cvpost.noCvBtn} ↗</a>
      </div>
      <CvPostForm x={x} locale={locale} categories={categories.map((c) => ({ value: c.slug, label: c.name }))} cities={cities.map((c) => ({ value: c.slug, label: c.name }))} />
    </div>
  );
}
