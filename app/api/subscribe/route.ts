import { NextResponse } from "next/server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // gizli xana doldurulubsa robotdur: uğurlu kimi cavab ver, amma heç nə yazma
  if (typeof b.website === "string" && b.website) return NextResponse.json({ ok: true });

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email.length > 254 || !emailRe.test(email)) {
    return NextResponse.json({ ok: false, errors: { email: "invalid" } }, { status: 422 });
  }

  // TODO: e-poçtu bazaya (Supabase) yaz və ya email xidmətinə (Resend, Mailchimp...) göndər.
  // İndi yalnız təsdiq qaytarılır, heç yerdə saxlanmır.
  return NextResponse.json({ ok: true, demo: true });
}
