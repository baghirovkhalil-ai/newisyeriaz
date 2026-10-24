import Link from "next/link";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";

interface Props { page: number; totalPages: number; params: Record<string, string | undefined>; locale: Locale; t: Dict }

export default function Pagination({ page, totalPages, params, locale, t }: Props) {
  if (totalPages <= 1) return null;
  const base = localePath(locale, "/vakansiyalar");
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  const cell = "min-w-10 rounded-lg border px-3 py-2.5 text-center text-sm";
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 pt-2" aria-label={t.pagination.aria}>
      {page > 1 && <Link href={href(page - 1)} className={`${cell} border-brand-line hover:border-brand`}>{t.pagination.prev}</Link>}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-faint">…</span>}
          <Link href={href(p)} aria-current={p === page ? "page" : undefined} className={`${cell} ${p === page ? "border-brand bg-brand text-on-brand" : "border-brand-line hover:border-brand"}`}>{p}</Link>
        </span>
      ))}
      {page < totalPages && <Link href={href(page + 1)} className={`${cell} border-brand-line hover:border-brand`}>{t.pagination.next}</Link>}
    </nav>
  );
}
