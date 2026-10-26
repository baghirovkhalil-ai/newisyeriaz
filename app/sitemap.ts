import type { MetadataRoute } from "next";
import { getNonEmptyCombos, getVacancySlugs } from "@/lib/data";
import { defaultLocale, localePath, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

// Hər URL üçün 3 dildə variant + hreflang qarşılıqlı əlaqəsi
function entry(path: string, extra: Partial<Entry>): Entry[] {
  const languages = Object.fromEntries(locales.map((l) => [l, SITE_URL + localePath(l, path)]));
  return locales.map((l) => ({
    url: SITE_URL + localePath(l, path),
    alternates: { languages: { ...languages, "x-default": SITE_URL + localePath(defaultLocale, path) } },
    ...extra,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vacancies, combos] = await Promise.all([getVacancySlugs(), getNonEmptyCombos()]);
  return [
    ...entry("/", { changeFrequency: "daily", priority: 1 }),
    ...entry("/vakansiyalar", { changeFrequency: "hourly", priority: 0.9 }),
    ...entry("/cv-yarat", { changeFrequency: "monthly", priority: 0.7 }),
    ...entry("/qiymetler", { changeFrequency: "monthly", priority: 0.6 }),
    ...combos.flatMap((c) => entry(`/is-elanlari/${c.city}/${c.category}`, { changeFrequency: "daily", priority: 0.7 })),
    ...vacancies.flatMap((v) => entry(`/vakansiya/${v.slug}`, { lastModified: v.publishedAt, priority: 0.8 })),
  ];
}
