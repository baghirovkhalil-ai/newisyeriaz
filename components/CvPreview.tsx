import type { CvSample } from "@/lib/cv-samples";
import type { Dict } from "@/lib/dictionaries";

const initials = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

function Heading({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-1.5 border-b border-brand-line pb-1 text-[10px] font-semibold uppercase tracking-wider text-brand-dark">{children}</h4>;
}

/** Nümunə CV-nin kağız görünüşü (A4 nisbətinə yaxın). */
export default function CvPreview({ cv, t }: { cv: CvSample; t: Dict["cv"] }) {
  return (
    <article aria-label={`${cv.name} — ${cv.role}`} className="overflow-hidden rounded-xl border border-brand-line bg-surface text-[11px] leading-snug text-body shadow-sm">
      {/* Başlıq */}
      <header className="flex items-center gap-3 bg-brand-soft px-4 py-3.5">
        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-on-brand">{initials(cv.name)}</span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">{cv.name}</h3>
          <p className="truncate text-xs font-medium text-brand-dark">{cv.role}</p>
          <p className="mt-0.5 truncate text-[10px] text-muted">{cv.city} · {cv.phone} · {cv.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_7.5rem] gap-4 px-4 py-3.5 sm:grid-cols-[1fr_8.5rem]">
        {/* Əsas sütun */}
        <div className="min-w-0 space-y-3">
          <section>
            <Heading>{t.summary}</Heading>
            <p>{cv.summary}</p>
          </section>
          <section>
            <Heading>{t.experience}</Heading>
            <ul className="space-y-2">
              {cv.experience.map((e) => (
                <li key={e.role + e.period}>
                  <p className="font-semibold text-ink">{e.role}</p>
                  <p className="text-[10px] text-muted">{e.company} · {e.period}</p>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-3.5 marker:text-brand">
                    {e.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <Heading>{t.education}</Heading>
            {cv.education.map((e) => (
              <div key={e.school}>
                <p className="font-semibold text-ink">{e.degree}</p>
                <p className="text-[10px] text-muted">{e.school} · {e.period}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Yan sütun */}
        <aside className="space-y-3">
          <section>
            <Heading>{t.skills}</Heading>
            <ul className="flex flex-wrap gap-1">
              {cv.skills.map((s) => <li key={s} className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] text-brand-dark">{s}</li>)}
            </ul>
          </section>
          <section>
            <Heading>{t.languages}</Heading>
            <ul className="space-y-0.5">
              {cv.languages.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  );
}
