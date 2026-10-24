import Link from "next/link";
import type { Category } from "@/lib/data";
import type { Dict } from "@/lib/dictionaries";
import { categoryIcons } from "@/lib/icons";
import { localePath, type Locale } from "@/lib/i18n";

interface Props {
  categories: Category[];
  active?: string;
  params: Record<string, string | undefined>; // digər filtrlər saxlanır
  locale: Locale;
  t: Dict;
}

/** Bütün sahələr çip kimi: telefonda 2 sıralı üfüqi sürüşmə, kompüterdə hamısı görünür. */
export default function CategoryChips({ categories, active, params, locale, t }: Props) {
  const href = (slug?: string) => {
    const sp = new URLSearchParams();
    Object.entries({ ...params, category: slug }).forEach(([k, v]) => { if (v) sp.set(k, v); });
    sp.delete("page");
    const qs = sp.toString();
    const base = localePath(locale, "/vakansiyalar");
    return qs ? `${base}?${qs}` : base;
  };
  const chip = (on: boolean) =>
    `flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm transition duration-200 active:scale-95 ${on ? "border-brand bg-brand font-medium text-on-brand shadow-md shadow-brand/25" : "border-brand-line bg-surface text-body hover:border-brand hover:bg-brand-soft"}`;

  return (
    <nav aria-label={t.list.categoriesAria} className="-mx-4 px-4 md:mx-0 md:px-0">
      <ul className="no-scrollbar grid snap-x auto-cols-max grid-flow-col grid-rows-2 gap-2 overflow-x-auto pb-1 md:flex md:flex-wrap md:overflow-visible">
        <li className="snap-start">
          <Link href={href()} aria-current={!active ? "true" : undefined} className={chip(!active)}>{t.list.allChip}</Link>
        </li>
        {categories.map((c) => (
          <li key={c.id} className="snap-start">
            <Link href={href(c.slug)} aria-current={active === c.slug ? "true" : undefined} className={chip(active === c.slug)}>
              <span aria-hidden="true">{categoryIcons[c.slug]}</span>{c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
