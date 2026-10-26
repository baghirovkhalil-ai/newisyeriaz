"use client";

import { useState } from "react";
import BoostOptions from "./BoostOptions";
import type { Extra } from "@/lib/dict-extra";
import type { Locale } from "@/lib/i18n";

interface Opt { value: string; label: string }
const empty = { name: "", phone: "", email: "", role: "", category: "", city: "baki", experience: "0", salary: "", summary: "", skills: "", languages: "" };
type Form = typeof empty;
const input = "w-full rounded-lg border border-brand-line bg-surface px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm focus:border-brand";
const phoneRe = /^\+?\d[\d\s-]{7,}$/;

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

export default function CvPostForm({ x, locale, categories, cities }: { x: Extra; locale: Locale; categories: Opt[]; cities: Opt[] }) {
  const t = x.cvpost;
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFailed("");
    const er: Partial<Record<keyof Form, string>> = {};
    if (f.name.trim().split(/\s+/).length < 2) er.name = t.errors.name;
    if (!phoneRe.test(f.phone.trim())) er.phone = t.errors.phone;
    if (f.role.trim().length < 3) er.role = t.errors.role;
    if (!f.category) er.category = t.errors.category;
    if (f.summary.trim().length < 30) er.summary = t.errors.summary;
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const r = await fetch("/api/cvs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setDone(`${f.name.trim()}, ${f.role.trim()}`);
    } catch {
      setFailed(t.failed);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-up rounded-2xl bg-brand-soft p-6 text-center">
          <svg className="mx-auto mb-3" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="28" pathLength={1} strokeDasharray={1} className="animate-draw-circle stroke-brand" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 33l8 8 16-17" pathLength={1} strokeDasharray={1} className="animate-draw stroke-brand" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-xl font-medium text-brand-dark">{t.doneTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-body">{t.doneText}</p>
          <button onClick={() => { setF(empty); setDone(null); }} className="mt-4 rounded-lg border border-brand px-5 py-2.5 text-sm font-medium text-brand-dark">{t.another}</button>
        </div>
        <section>
          <h2 className="mb-3 text-lg font-medium">{t.boostTitle}</h2>
          <BoostOptions target="cv" locale={locale} x={x} item={done} compact />
        </section>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t.secPerson}</h2>
        <Field label={t.name} error={errors.name}><input className={input} autoComplete="name" value={f.name} onChange={set("name")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.phone} error={errors.phone} hint={t.phoneHint}><input className={input} inputMode="tel" autoComplete="tel" placeholder="+994 50 123 45 67" value={f.phone} onChange={set("phone")} /></Field>
          <Field label={t.email}><input className={input} type="email" autoComplete="email" value={f.email} onChange={set("email")} /></Field>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t.secJob}</h2>
        <Field label={t.role} error={errors.role}><input className={input} placeholder={t.rolePh} value={f.role} onChange={set("role")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.category} error={errors.category}>
            <select className={input} value={f.category} onChange={set("category")}>
              <option value="">{t.select}</option>
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label={t.city}>
            <select className={input} value={f.city} onChange={set("city")}>
              {cities.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label={t.experience}><input className={input} type="number" min={0} max={40} value={f.experience} onChange={set("experience")} /></Field>
          <Field label={t.salary}><input className={input} type="number" min={0} step={50} value={f.salary} onChange={set("salary")} /></Field>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t.secAbout}</h2>
        <Field label={t.summary} error={errors.summary} hint={t.summaryHint}><textarea className={input} rows={4} value={f.summary} onChange={set("summary")} /></Field>
        <Field label={t.skills}><input className={input} placeholder={t.skillsPh} value={f.skills} onChange={set("skills")} /></Field>
        <Field label={t.languages}><input className={input} placeholder={t.languagesPh} value={f.languages} onChange={set("languages")} /></Field>
      </section>
      {failed && <p className="rounded-lg bg-danger-bg p-3 text-sm text-danger">{failed}</p>}
      {Object.keys(errors).some((k) => errors[k as keyof Form]) && <p className="text-sm text-danger">{t.fixFields}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand px-5 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95 disabled:opacity-60 sm:w-auto">{busy ? t.sending : t.submit}</button>
    </form>
  );
}
