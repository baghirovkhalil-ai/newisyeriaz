"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/dictionaries";
import { THEME_COLORS, THEME_KEY, themeOptions, type ThemeName, type ThemePref } from "@/lib/theme";

function resolve(p: ThemePref): ThemeName {
  return p === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p;
}

function apply(p: ThemePref, animate = true) {
  const d = document.documentElement;
  const t = resolve(p);
  if (animate) {
    d.classList.add("theme-anim");
    window.setTimeout(() => d.classList.remove("theme-anim"), 450);
  }
  d.dataset.theme = t;
  d.dataset.pref = p;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME_COLORS[t]));
}

const swatch: Record<ThemePref, { bg: string; dot: string }> = {
  auto: { bg: "linear-gradient(135deg,#ffffff 50%,#0b0f19 50%)", dot: "#3AAEF5" },
  light: { bg: "#ffffff", dot: "#3AAEF5" },
  dark: { bg: "#0b0f19", dot: "#4DB4F7" },
  blue: { bg: "#092442", dot: "#5AC4FF" },
};

export default function ThemeSwitcher({ t }: { t: Dict["theme"] }) {
  const [pref, setPref] = useState<ThemePref>("auto");
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true); // seçim edilməyibsə düymədə kiçik nöqtə yanıb-sönür
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(THEME_KEY) as ThemePref | null;
      if (s && (themeOptions as readonly string[]).includes(s)) setPref(s);
      setSeen(!!s);
    } catch {
      setSeen(true);
    }
  }, []);

  useEffect(() => {
    if (pref !== "auto") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply("auto", false);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [pref]);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  function choose(p: ThemePref) {
    setPref(p);
    setSeen(true);
    setOpen(false);
    apply(p);
    try { localStorage.setItem(THEME_KEY, p); } catch { /* private rejim */ }
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t.title}
        title={t.title}
        className="relative grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-brand-soft hover:text-brand-dark active:scale-90"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z" />
          <circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10.5" cy="7.5" r="1" fill="currentColor" /><circle cx="15" cy="8" r="1" fill="currentColor" />
        </svg>
        {!seen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
          </span>
        )}
      </button>

      {open && (
        <div role="group" aria-label={t.label} className="absolute right-0 top-full z-20 mt-2 w-52 animate-pop-in rounded-xl border border-brand-line bg-surface p-1.5 shadow-xl shadow-brand/10">
          <p className="px-2.5 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-faint">{t.label}</p>
          {themeOptions.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => choose(o)}
              aria-pressed={pref === o}
              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition ${pref === o ? "bg-brand-soft font-medium text-brand-dark" : "text-body hover:bg-brand-soft"}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-brand-line" style={{ background: swatch[o].bg }}>
                <span className="h-2 w-2 rounded-full" style={{ background: swatch[o].dot }} />
              </span>
              <span className="flex-1">{t[o]}</span>
              {pref === o && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
