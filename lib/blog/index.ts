import type { Locale } from "../i18n";
import { az } from "./posts-az";
import { ru } from "./posts-ru";
import { en } from "./posts-en";
import type { BlogCategory, PostMeta, PostText } from "./types";

export type { Block, BlogCategory, CtaKind } from "./types";

// Yeni məqalə əlavə etmək: buraya meta yaz, sonra posts-az/ru/en fayllarında eyni slug ilə mətni əlavə et.
const metas: PostMeta[] = [
  { slug: "cv-nece-yazilir", category: "seekers", date: "2026-10-20", readMin: 5, icon: "📄", hue: 205 },
  { slug: "musahibe-suallari", category: "seekers", date: "2026-10-22", readMin: 6, icon: "🎤", hue: 265 },
  { slug: "vakansiya-elani-nece-yazilir", category: "employers", date: "2026-10-23", readMin: 4, icon: "📣", hue: 38 },
  { slug: "maas-danisigi", category: "seekers", date: "2026-10-24", readMin: 4, icon: "💬", hue: 150 },
  { slug: "uzaqdan-is", category: "seekers", date: "2026-10-25", readMin: 5, icon: "🌍", hue: 190 },
  { slug: "telebeler-ucun-is", category: "seekers", date: "2026-10-26", readMin: 4, icon: "🎓", hue: 330 },
];

const texts: Record<Locale, Record<string, PostText>> = { az, ru, en };

export interface PostView extends PostMeta, PostText {}

export function getPosts(locale: Locale, category?: BlogCategory): PostView[] {
  return metas
    .filter((m) => texts[locale][m.slug] && (!category || m.category === category))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((m) => ({ ...m, ...texts[locale][m.slug] }));
}

export function getPost(locale: Locale, slug: string): PostView | null {
  const m = metas.find((x) => x.slug === slug);
  const t = texts[locale][slug];
  return m && t ? { ...m, ...t } : null;
}

export const getPostSlugs = () => metas.map((m) => ({ slug: m.slug, date: m.updated ?? m.date }));
export const isCategory = (x?: string): x is BlogCategory => x === "seekers" || x === "employers";
