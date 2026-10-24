"use client";

import { useState } from "react";
import type { Dict } from "@/lib/dictionaries";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SubscribeForm({ t, categories, locale }: { t: Dict["subscribe"]; categories: { value: string; label: string }[]; locale: string }) {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [trap, setTrap] = useState(""); // robotlar üçün gizli xana
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    if (!emailRe.test(email.trim())) { setError(t.invalid); return; }
    setError("");
    setState("busy");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), category, locale, website: trap }),
      });
      if (!r.ok) throw new Error("fail");
      setState("done");
    } catch {
      setError(t.failed);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="flex animate-fade-up items-center gap-3">
        <svg className="shrink-0" width="44" height="44" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="28" pathLength={1} strokeDasharray={1} className="animate-draw-circle stroke-on-brand" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 33l8 8 16-17" pathLength={1} strokeDasharray={1} className="animate-draw stroke-on-brand" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="font-medium">{t.success}</p>
          <p className="text-sm text-on-brand/80">{t.successText}</p>
        </div>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-transparent bg-surface px-3 py-3 text-base text-ink outline-none focus:border-brand sm:text-sm";
  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="sub-email">{t.emailLabel}</label>
        <input id="sub-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPh} aria-invalid={!!error} className={`${field} sm:min-w-0 sm:flex-1`} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t.categoryAria} className={`${field} sm:w-44`}>
          <option value="">{t.allCategories}</option>
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button type="submit" disabled={state === "busy"} className="shrink-0 rounded-lg bg-surface px-5 py-3 text-sm font-medium text-brand-dark transition hover:opacity-90 active:scale-95 disabled:opacity-60">
          {state === "busy" ? t.sending : t.button}
        </button>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error && <p role="alert" className="mt-2 inline-block animate-fade-in rounded-md bg-danger-bg px-2.5 py-1 text-xs text-danger">{error}</p>}
      <p className="mt-2 text-xs text-on-brand/75">{t.privacy}</p>
    </form>
  );
}
