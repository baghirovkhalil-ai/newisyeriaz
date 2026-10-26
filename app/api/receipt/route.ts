import { NextResponse } from "next/server";
import { BOOSTS, PAY_CARD_LAST4, isBoost, isTarget } from "@/lib/boosts";

// Kartdan karta ödəniş çekinin yoxlanması (KarYera AI-dakı sistemin eynisi).
// 1) Gemini çekin şəklini oxuyur: tarix-saat, məbləğ, alıcı kartın son 4 rəqəmi, status.
// 2) Qaydalar ödənilsə təsdiq, ödənilməsə səbəb qaytarılır.
// 3) Hər çek Telegram-a göndərilir və Vercel loglarına yazılır.
// Vercel env: GEMINI_API_KEY (vacib), TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (izləmək üçün).

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_AGE_H = 48;
const MODELS = [process.env.GEMINI_MODEL, "gemini-3.6-flash", "gemini-3-flash-preview", "gemini-2.5-flash"].filter(Boolean) as string[];
const seen = new Map<string, string>();
const hits = new Map<string, number[]>();

type Receipt = { is_receipt?: boolean; success?: boolean; date?: string | null; time?: string | null; amount?: number | string | null; currency?: string | null; recipient_last4?: string | null; transaction_id?: string | null };

function limited(ip: string) {
  const now = Date.now(), r = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  if (r.length >= 10) return true;
  r.push(now); hits.set(ip, r); return false;
}

async function readReceipt(key: string, b64: string): Promise<Receipt> {
  const prompt = `Bu şəkil bank kartından karta pul köçürməsinin çeki (qəbz, skrinşot) olmalıdır. Şəkildən məlumatları çıxar və YALNIZ JSON qaytar:
{"is_receipt": true/false, "success": true/false, "date": "YYYY-MM-DD" və ya null, "time": "HH:MM" (24 saat, şəkildə açıq görünmürsə null), "amount": rəqəm (AZN, komissiyasız) və ya null, "currency": "AZN" və ya başqa, "recipient_last4": alıcı kartın son 4 rəqəmi və ya null, "transaction_id": əməliyyat nömrəsi və ya null}
Heç nə uydurma: şəkildə olmayan sahəni null yaz.`;
  for (const m of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: b64 } }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 512, responseMimeType: "application/json" },
      }),
    });
    if (r.status === 404) continue;
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`gemini ${r.status} ${j?.error?.message ?? ""}`);
    const t = (j?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
    const mm = t.match(/\{[\s\S]*\}/);
    return JSON.parse(mm ? mm[0] : t);
  }
  throw new Error("model tapılmadı");
}

function check(x: Receipt, price: number) {
  if (!x?.is_receipt) return "Şəkildə köçürmə çeki tanınmadı. Bankın tətbiqindən çekin skrinşotunu yüklə.";
  if (x.success === false) return "Çekdə əməliyyat uğurlu görünmür.";
  if (!x.date || !/^\d{4}-\d{2}-\d{2}$/.test(x.date) || !x.time || !/^\d{1,2}:\d{2}/.test(x.time)) return "Çekdə köçürmənin dəqiq tarixi və saatı görünmür. Tarix və saat olan tam çeki yüklə.";
  const when = new Date(`${x.date}T${x.time.padStart(5, "0").slice(0, 5)}:00+04:00`).getTime(), now = Date.now();
  if (isNaN(when)) return "Çekdəki tarix və saat oxunmadı.";
  if (when > now + 15 * 60000) return "Çekdəki tarix gələcək zamandır.";
  if (now - when > MAX_AGE_H * 3600000) return `Çek köhnədir: son ${MAX_AGE_H} saatda edilmiş köçürmənin çeki qəbul olunur.`;
  if (x.currency && !/azn|manat|₼/i.test(String(x.currency))) return "Köçürmə AZN ilə olmalıdır.";
  const amt = Number(String(x.amount ?? "").replace(",", "."));
  if (!(amt > 0)) return "Çekdə məbləğ oxunmadı.";
  if (amt + 0.001 < price) return `Məbləğ azdır: bu xidmət üçün ${price} AZN köçürülməlidir, çekdə ${amt} AZN görünür.`;
  if (x.recipient_last4 && String(x.recipient_last4).replace(/\D/g, "").slice(-4) !== PAY_CARD_LAST4) return "Çekdəki alıcı kart bizim kart deyil.";
  return "";
}

async function notify(ok: boolean, info: string, b64: string) {
  const tok = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!tok || !chat) return;
  try {
    const fd = new FormData();
    fd.append("chat_id", chat);
    fd.append("caption", `${ok ? "✅ TƏSDİQ" : "❌ RƏDD"} · İşYeri.az\n${info}`.slice(0, 1000));
    fd.append("photo", new Blob([Buffer.from(b64, "base64")], { type: "image/jpeg" }), "cek.jpg");
    await fetch(`https://api.telegram.org/bot${tok}/sendPhoto`, { method: "POST", body: fd });
  } catch (e) {
    console.error("telegram", (e as Error).message);
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "x").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ ok: false, reason: "Çox cəhd oldu, bir saat sonra yenidən sına." }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, reason: "Sorğu oxunmadı." }, { status: 400 }); }
  if (!isTarget(b.target) || !isBoost(b.plan)) return NextResponse.json({ ok: false, reason: "Xidmət seçilməyib." }, { status: 400 });
  const svc = BOOSTS[b.target][b.plan];
  const item = String(b.item ?? "").trim().slice(0, 160);
  const b64 = String(b.image ?? "").replace(/^data:image\/\w+;base64,/, "");
  if (item.length < 3) return NextResponse.json({ ok: false, reason: "Nəyi önə çıxardığını yaz." }, { status: 400 });
  if (b64.length < 1000 || b64.length > 4_000_000) return NextResponse.json({ ok: false, reason: "Şəkil yüklənmədi və ya çox böyükdür." }, { status: 400 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ ok: false, reason: "Yoxlama hazırda işləmir. Bir az sonra yenidən sına." }, { status: 500 });

  const id = "IY" + Date.now().toString(36).toUpperCase();
  let x: Receipt;
  try { x = await readReceipt(key, b64); }
  catch (e) { console.error("receipt read", (e as Error).message); return NextResponse.json({ ok: false, reason: "Çeki oxumaq alınmadı. Bir az sonra yenidən sına." }, { status: 502 }); }

  let reason = check(x, svc.price);
  const dupKey = [x.date, x.time, x.amount, x.transaction_id ?? ""].join("|");
  if (!reason && seen.has(dupKey)) reason = "Bu çek artıq istifadə olunub.";
  const ok = !reason;
  if (ok) seen.set(dupKey, id);

  const info = [
    `ID: ${id}`,
    `Xidmət: ${b.target === "cv" ? "CV" : "Elan"} · ${b.plan} · ${svc.price} AZN${svc.days ? ` · ${svc.days} gün` : ""}`,
    `Nə: ${item}`,
    `Çek: ${x.date ?? "?"} ${x.time ?? "?"} · ${x.amount ?? "?"} ${x.currency ?? ""} · kart …${x.recipient_last4 ?? "?"}${x.transaction_id ? ` · №${x.transaction_id}` : ""}`,
    `Əlaqə: ${String(b.contact ?? "").slice(0, 80) || "-"}`,
    `IP: ${ip}`,
    reason ? `Səbəb: ${reason}` : "",
  ].filter(Boolean).join("\n");
  console.log("RECEIPT", ok ? "OK" : "REJECT", info.replace(/\n/g, " | "));
  await notify(ok, info, b64);

  return NextResponse.json(ok ? { ok: true, id } : { ok: false, reason, id });
}
