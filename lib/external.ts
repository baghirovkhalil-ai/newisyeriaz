// Digər iş saytlarından toplanan vakansiyalar (gündə bir neçə dəfə yenilənən ümumi baza).
// Baza KarYera AI layihəsində saxlanır: scripts/merge-jobs.mjs → data/jobs.json.
// Bu elanlar yalnız Vakansiyalar siyahısında göstərilir, öz səhifəsi yoxdur (kart orijinal elana aparır),
// sitemap-a düşmür və Premium/Gold sıralamasına təsir etmir (həmişə adi elan kimi).
import type { Category, City, VacancyView } from "./data";

export const FEED_URL = process.env.JOBS_FEED_URL || "https://karyera-ai.vercel.app/data/jobs.json";

export interface FeedJob {
  id: string; title: string; company: string; url: string; source: string; remote: boolean;
  date: string; first_seen: string; last_seen: string; isyeri_cat: string; city: string;
}

export async function loadFeed(): Promise<FeedJob[]> {
  try {
    const r = await fetch(FEED_URL, { next: { revalidate: 1800 } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j.jobs) ? (j.jobs as FeedJob[]).filter((x) => !x.remote && x.url && x.title) : [];
  } catch {
    return [];
  }
}

export function toExternalView(j: FeedJob, categories: Category[], cities: City[]): VacancyView | null {
  const category = categories.find((c) => c.slug === j.isyeri_cat) ?? categories.find((c) => c.slug === "ofis-inzibati");
  const city = cities.find((c) => c.slug === (j.city === "region" ? "regionlar" : j.city || "baki")) ?? cities[0];
  if (!category || !city) return null;
  const published = j.date || j.first_seen;
  return {
    id: `x${j.id}`,
    slug: `x-${j.id}`,
    title: j.title,
    description: "",
    companyId: `x-${j.id}`,
    categoryId: category.id,
    cityId: city.id,
    schedule: "full_time",
    experienceYears: 0,
    publishedAt: published,
    expiresAt: new Date(+new Date(published) + 30 * 86400000).toISOString(),
    external: { url: j.url, source: j.source },
    company: { id: `x-${j.id}`, name: j.company || j.source, slug: `x-${j.id}` },
    category,
    city,
  };
}
