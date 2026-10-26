"use client";

import { useState } from "react";

/** Nömrəni yalnız kliklə göstər (botlar asan toplamasın). */
export default function PhoneReveal({ phone, showLabel, callLabel }: { phone: string; showLabel: string; callLabel: string }) {
  const [open, setOpen] = useState(false);
  const cls = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition active:scale-95";
  if (!open) return <button type="button" onClick={() => setOpen(true)} className={`${cls} bg-brand text-on-brand hover:opacity-90`}>{showLabel}</button>;
  return (
    <a href={`tel:${phone.replace(/\s/g, "")}`} className={`${cls} animate-fade-in bg-brand text-on-brand hover:opacity-90`}>
      {callLabel}: <span className="tabular-nums">{phone}</span>
    </a>
  );
}
