export type BlogCategory = "seekers" | "employers";
export type CtaKind = "cv" | "interview" | "jobs" | "remote" | "post" | "boost" | "cvdb" | "cvpost";

/** Məqalə mətni bloklarla yazılır ki, 3 dildə eyni quruluş saxlansın və SEO üçün düzgün HTML çıxsın. */
export type Block =
  | { t: "p"; x: string }
  | { t: "h"; x: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "tip"; x: string }
  | { t: "quote"; x: string }
  | { t: "cta"; kind: CtaKind };

export interface PostText {
  title: string;
  excerpt: string;
  body: Block[];
}

export interface PostMeta {
  slug: string;
  category: BlogCategory;
  date: string; // YYYY-MM-DD
  updated?: string;
  readMin: number;
  /** Örtük rəngi və ikon (şəkil lazım deyil) */
  icon: string;
  hue: number;
}
