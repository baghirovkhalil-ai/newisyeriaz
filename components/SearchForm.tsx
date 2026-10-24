import type { Category, City, Schedule } from "@/lib/data";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";

interface Props {
  categories: Category[];
  cities: City[];
  locale: Locale;
  t: Dict;
  values?: { q?: string; category?: string; city?: string; schedule?: string; minSalary?: string };
  compact?: boolean;
}

const field = "w-full rounded-lg border border-brand-line bg-surface px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm focus:border-brand";

export default function SearchForm({ categories, cities, locale, t, values = {}, compact }: Props) {
  const s = t.search;
  return (
    <form action={localePath(locale, "/vakansiyalar")} method="GET" className="space-y-2">
      <div className="flex gap-2">
        <input name="q" defaultValue={values.q} placeholder={s.placeholder} className={field} aria-label={s.ariaSearch} />
        <button type="submit" className="shrink-0 rounded-lg bg-brand px-5 text-sm font-medium text-on-brand hover:opacity-90">{s.button}</button>
      </div>
      {!compact && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <select name="category" defaultValue={values.category ?? ""} className={field} aria-label={s.ariaCategory}>
            <option value="">{s.allCategories}</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="city" defaultValue={values.city ?? ""} className={field} aria-label={s.ariaCity}>
            <option value="">{s.allCities}</option>
            {cities.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="schedule" defaultValue={values.schedule ?? ""} className={field} aria-label={s.ariaSchedule}>
            <option value="">{s.anySchedule}</option>
            {(Object.keys(t.schedule) as Schedule[]).map((k) => <option key={k} value={k}>{t.schedule[k]}</option>)}
          </select>
          <input name="minSalary" type="number" min={0} step={100} defaultValue={values.minSalary} placeholder={s.minSalary} className={field} aria-label={s.ariaMinSalary} />
        </div>
      )}
    </form>
  );
}
