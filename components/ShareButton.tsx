"use client";

import { useState } from "react";

export default function ShareButton({ title, label, doneLabel }: { title: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      setDone(true);
      window.setTimeout(() => setDone(false), 2000);
    } catch { /* istifadəçi paylaşmanı bağladı */ }
  }

  return (
    <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-brand-line bg-surface px-4 py-2.5 text-sm font-medium text-body transition hover:border-brand active:scale-95">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
