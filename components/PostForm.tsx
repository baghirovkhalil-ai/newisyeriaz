"use client";

import { useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { formatSalary } from "@/lib/seo";

interface Opt { value: string; label: string }
interface Props {
  t: Dict["form"];
  salaryT: Dict["salary"];
  todayLabel: string;
  categories: Opt[];
  cities: Opt[];
  schedules: Opt[];
  districts: Opt[];
}

const empty = {
  companyName: "", phone: "", telegram: "",
  title: "", category: "", city: "baki", district: "", schedule: "full_time",
  salaryMin: "", salaryMax: "", experience: "0",
  description: "", requirements: "",
};
type Form = typeof empty;

const input = "w-full rounded-lg border border-brand-line bg-surface px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm focus:border-brand";
const phoneRe = /^\+?\d[\d\s-]{7,}$/;

function validate(f: Form, t: Dict["form"]) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.companyName.trim().length < 2) e.companyName = t.errors.companyName;
  if (!phoneRe.test(f.phone.trim())) e.phone = t.errors.phone;
  if (f.title.trim().length < 3) e.title = t.errors.title;
  if (!f.category) e.category = t.errors.category;
  if (!f.city) e.city = t.errors.city;
  if (f.description.trim().length < 30) e.description = t.errors.description;
  if (f.salaryMin && f.salaryMax && Number(f.salaryMin) > Number(f.salaryMax)) e.salaryMax = t.errors.salaryMax;
  return e;
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-body">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block animate-fade-in text-xs text-danger">{error}</span>}
    </label>
  );
}

export default function PostForm({ t, salaryT, todayLabel, categories, cities, schedules, districts }: Props) {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFailed("");
    const errs = validate(f, t);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await fetch("/api/vacancies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setDone(true);
    } catch {
      setFailed(t.failed);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="animate-fade-up rounded-2xl bg-brand-soft p-6 text-center">
        <svg className="mx-auto mb-3" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="28" pathLength={1} strokeDasharray={1} className="animate-draw-circle stroke-brand" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 33l8 8 16-17" pathLength={1} strokeDasharray={1} className="animate-draw stroke-brand" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-xl font-medium text-brand-dark">{t.doneTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-body">{t.doneText}</p>
        <button onClick={() => { setF(empty); setDone(false); }} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-on-brand">{t.newPost}</button>
      </div>
    );
  }

  const salary = formatSalary(salaryT, Number(f.salaryMin) || undefined, Number(f.salaryMax) || undefined);
  const cityName = cities.find((c) => c.value === f.city)?.label ?? "";
  const schedName = schedules.find((s) => s.value === f.schedule)?.label ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form onSubmit={submit} noValidate className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-lg font-medium">{t.secCompany}</h2>
          <Field label={t.companyName} error={errors.companyName}><input className={input} value={f.companyName} onChange={set("companyName")} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.phone} error={errors.phone} hint={t.phoneHint}><input className={input} inputMode="tel" placeholder="+994 50 123 45 67" value={f.phone} onChange={set("phone")} /></Field>
            <Field label={t.telegram}><input className={input} placeholder={t.telegramPh} value={f.telegram} onChange={set("telegram")} /></Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">{t.secVacancy}</h2>
          <Field label={t.jobTitle} error={errors.title}><input className={input} placeholder={t.jobTitlePh} value={f.title} onChange={set("title")} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.category} error={errors.category}>
              <select className={input} value={f.category} onChange={set("category")}>
                <option value="">{t.select}</option>
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label={t.schedule}>
              <select className={input} value={f.schedule} onChange={set("schedule")}>
                {schedules.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label={t.city} error={errors.city}>
              <select className={input} value={f.city} onChange={set("city")}>
                {cities.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            {f.city === "baki" && (
              <Field label={t.district}>
                <select className={input} value={f.district} onChange={set("district")}>
                  <option value="">{t.select}</option>
                  {districts.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </Field>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.minSalary}><input className={input} type="number" min={0} step={50} value={f.salaryMin} onChange={set("salaryMin")} /></Field>
            <Field label={t.maxSalary} error={errors.salaryMax}><input className={input} type="number" min={0} step={50} value={f.salaryMax} onChange={set("salaryMax")} /></Field>
            <Field label={t.experience}><input className={input} type="number" min={0} max={20} value={f.experience} onChange={set("experience")} /></Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">{t.secDesc}</h2>
          <Field label={t.description} error={errors.description} hint={t.descHint}>
            <textarea className={input} rows={5} value={f.description} onChange={set("description")} />
          </Field>
          <Field label={t.requirements}>
            <textarea className={input} rows={4} placeholder={t.requirementsPh} value={f.requirements} onChange={set("requirements")} />
          </Field>
        </section>

        {failed && <p className="rounded-lg bg-danger-bg p-3 text-sm text-danger">{failed}</p>}
        {Object.keys(errors).length > 0 && <p className="text-sm text-danger">{t.fixFields}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95 disabled:opacity-60 sm:w-auto">
          {busy ? t.sending : t.submit}
        </button>
      </form>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 text-sm text-muted">{t.preview}</p>
        <div className="rounded-xl border border-brand-line p-4 transition hover:shadow-lg hover:shadow-brand/10">
          <h3 className="text-base font-medium text-ink">{f.title || t.phTitle}</h3>
          <p className="mt-0.5 text-sm text-muted">{f.companyName || t.phCompany}</p>
          <p className="mt-3 text-sm font-medium text-brand-dark">{salary}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span>{f.district && f.city === "baki" ? `${districts.find((d) => d.value === f.district)?.label ?? f.district}, ${cityName}` : cityName}</span>
            <span>{schedName}</span>
            <span>{todayLabel}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
