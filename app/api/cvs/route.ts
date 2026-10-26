import { NextResponse } from "next/server";

// CV yerləşdirmə. Hələlik yalnız yoxlayır, bazaya yazmır (Supabase qoşulanda əlavə olunacaq).
const phoneRe = /^\+?\d[\d\s-]{7,}$/;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");
  const errors: Record<string, string> = {};
  if (str("name").split(/\s+/).length < 2) errors.name = "invalid";
  if (!phoneRe.test(str("phone"))) errors.phone = "invalid";
  if (str("role").length < 3) errors.role = "invalid";
  if (!str("category")) errors.category = "invalid";
  if (str("summary").length < 30) errors.summary = "invalid";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });
  return NextResponse.json({ ok: true, demo: true, id: crypto.randomUUID() });
}
