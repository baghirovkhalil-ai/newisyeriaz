"use client";

import { useRef, useState } from "react";
import { BOOSTS, BOOST_IDS, PAY_CARD, PAY_CARD_LAST4, fmtPrice, type BoostId, type Target } from "@/lib/boosts";
import type { Extra } from "@/lib/dict-extra";
import { fmt } from "@/lib/i18n";

type Result = { ok: true; id: string } | { ok: false; reason: string; id?: string };

export default function BoostCheckout({ x, initialTarget, initialPlan, initialItem, demo }: { x: Extra; initialTarget: Target; initialPlan: BoostId; initialItem: string; demo: boolean }) {
  const t = x.checkout;
  const [target, setTarget] = useState<Target>(initialTarget);
  const [plan, setPlan] = useState<BoostId>(initialPlan);
  const [item, setItem] = useState(initialItem);
  const [contact, setContact] = useState("");
  const [img, setImg] = useState<string>("");
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const texts = target === "cv" ? x.boost.cvItems : x.boost.items;
  const price = BOOSTS[target][plan].price;

  function load(f?: File | null) {
    setErr(""); setRes(null);
    if (!f || !f.type.startsWith("image/")) { setErr(t.badFile); return; }
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        const g = c.getContext("2d")!; g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        setImg(c.toDataURL("image/jpeg", 0.85));
      };
      im.onerror = () => setErr(t.badFile);
      im.src = String(r.result);
    };
    r.readAsDataURL(f);
  }

  async function send() {
    setErr(""); setRes(null);
    if (item.trim().length < 3) { setErr(t.needItem); return; }
    if (!img) { setErr(t.needImg); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/receipt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target, plan, item: item.trim(), contact: contact.trim(), image: img.split(",")[1] }) });
      const j = await r.json().catch(() => ({ ok: false, reason: t.netErr }));
      setRes(j.ok ? { ok: true, id: j.id } : { ok: false, reason: j.reason || t.netErr, id: j.id });
      if (j.ok) { setImg(""); if (fileRef.current) fileRef.current.value = ""; }
    } catch {
      setRes({ ok: false, reason: t.netErr });
    } finally {
      setBusy(false);
    }
  }

  const copy = () => {
    navigator.clipboard?.writeText(PAY_CARD.replace(/\s/g, "")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  };
  const step = "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-on-brand";
  const input = "w-full rounded-lg border border-brand-line bg-surface px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm focus:border-brand";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-start">
      <div className="space-y-6 rounded-2xl border border-brand-line bg-surface p-4 sm:p-6">
        {/* 1. Xidmət */}
        <section className="flex gap-3">
          <span className={step}>1</span>
          <div className="min-w-0 flex-1 space-y-3">
            <h2 className="font-medium">{t.step1}</h2>
            <div role="radiogroup" aria-label={t.what} className="inline-grid grid-cols-2 rounded-full border border-brand-line bg-brand-soft p-1 text-sm">
              {(["vacancy", "cv"] as Target[]).map((tg) => (
                <button key={tg} type="button" role="radio" aria-checked={target === tg} onClick={() => setTarget(tg)} className={`rounded-full px-4 py-1.5 font-medium transition ${target === tg ? "bg-brand text-on-brand" : "text-body"}`}>
                  {tg === "vacancy" ? x.boost.tabVacancy : x.boost.tabCv}
                </button>
              ))}
            </div>
            <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
              {BOOST_IDS.map((id) => {
                const on = plan === id, gold = id === "gold";
                const b = BOOSTS[target][id];
                return (
                  <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setPlan(id)}
                    className={`rounded-xl border p-3 text-left transition ${on ? (gold ? "border-2 border-gold bg-gold-soft" : "border-2 border-brand bg-brand-soft") : "border-brand-line hover:border-brand"}`}>
                    <span className={`block text-sm font-semibold ${gold ? "text-gold" : "text-ink"}`}>{texts[id].name}</span>
                    <span className="mt-0.5 block text-xl font-medium tabular-nums text-ink">{fmtPrice(b.price)} ₼</span>
                    <span className="block text-xs text-muted">{b.days ? fmt(x.boost.days, { n: b.days }) : x.boost.once}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-body">{texts[plan].desc}</p>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-body">{target === "cv" ? t.itemCv : t.itemVacancy}</span>
              <input className={input} value={item} onChange={(e) => setItem(e.target.value)} placeholder={target === "cv" ? t.itemPhCv : t.itemPhVacancy} />
            </label>
          </div>
        </section>

        {/* 2. Köçürmə */}
        <section className="flex gap-3 border-t border-brand-line pt-6">
          <span className={step}>2</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-medium">{fmt(t.step2, { p: fmtPrice(price) })}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold tabular-nums tracking-wider text-ink sm:text-2xl">{PAY_CARD}</span>
              <button type="button" onClick={copy} className="rounded-lg border border-brand-line px-3 py-1.5 text-sm font-medium text-brand-dark transition hover:bg-brand-soft active:scale-95">{copied ? t.copied : t.copy}</button>
            </div>
            <p className="mt-2 text-sm text-muted">{t.cardHint}</p>
          </div>
        </section>

        {/* 3. Çek */}
        <section className="flex gap-3 border-t border-brand-line pt-6">
          <span className={step}>3</span>
          <div className="min-w-0 flex-1 space-y-3">
            <h2 className="font-medium">{t.step3}</h2>
            <p className="text-sm text-body">{fmt(t.rules, { last4: PAY_CARD_LAST4 })}</p>
            <label
              onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); load(e.dataTransfer.files?.[0]); }}
              className={`grid cursor-pointer place-items-center gap-2 rounded-xl border-2 border-dashed p-5 text-center text-sm text-muted transition ${over ? "border-brand bg-brand-soft" : "border-brand-line hover:border-brand"}`}>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => load(e.target.files?.[0])} />
              {img && <img src={img} alt="" className="max-h-64 rounded-lg" />}
              <span>{img ? t.change : t.drop}</span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-body">{t.contact}</span>
              <input className={input} inputMode="tel" placeholder="+994 50 000 00 00" value={contact} onChange={(e) => setContact(e.target.value)} />
            </label>
            {err && <p className="rounded-lg bg-danger-bg p-3 text-sm text-danger">{err}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft px-4 py-3">
              <span className="text-sm text-body">{t.total}: <b className="text-lg text-ink">{fmtPrice(price)} ₼</b></span>
              <button type="button" onClick={send} disabled={busy} className="rounded-lg bg-brand px-6 py-3 text-sm font-medium text-on-brand transition hover:opacity-90 active:scale-95 disabled:opacity-60">{busy ? t.checking : t.submit}</button>
            </div>
            {res && (res.ok ? (
              <div role="status" className="animate-fade-up rounded-xl border border-brand bg-brand-soft p-4 text-sm">
                <b className="block text-base text-brand-dark">{t.okTitle}</b>
                <p className="mt-1 text-body">{fmt(t.okText, { service: texts[plan].name, item: item.trim(), id: res.id })}</p>
                {demo && <p className="mt-2 text-xs text-muted">{t.demoNote}</p>}
              </div>
            ) : (
              <div role="alert" className="animate-fade-up rounded-xl bg-danger-bg p-4 text-sm text-danger">
                <b className="block">{t.failTitle}</b>
                <p className="mt-1">{res.reason}</p>
                {res.id && <p className="mt-1 text-xs opacity-80">ID: {res.id}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Nümunə çek */}
      <aside className="rounded-2xl border border-brand-line bg-surface p-4 sm:p-5 lg:sticky lg:top-20">
        <h2 className="font-medium">{t.sampleTitle}</h2>
        <p className="mt-1 text-sm text-muted">{t.sampleSub}</p>
        <div className="mt-3 space-y-1 rounded-xl bg-brand-soft p-3 text-sm">
          <p className="mb-2 font-semibold text-brand-dark">{t.sampleHead}</p>
          {([[t.sDate, "27.10.2026, 14:35", 1], [t.sAmount, `${price.toFixed(2)} AZN`, 1], [t.sSender, "5522 •••• •••• 1043", 0], [t.sRecipient, `${PAY_CARD.slice(0, 4)} •••• •••• ${PAY_CARD_LAST4}`, 1], [t.sTxn, "884213097", 0], [t.sStatus, t.sOk, 1]] as [string, string, number][]).map(([k, v, hl]) => (
            <div key={k} className={`flex justify-between gap-3 rounded-md px-2 py-1.5 ${hl ? "ring-2 ring-gold" : ""}`}>
              <span className="text-muted">{k}</span><b className="text-right font-medium text-ink">{v}</b>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">{t.sampleWarn}</p>
      </aside>
    </div>
  );
}
