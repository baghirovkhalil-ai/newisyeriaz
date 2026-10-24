import { NextResponse } from "next/server";

// Mesajlar müştəri tərəfdə seçilmiş dildə göstərilir; server yalnız xətalı sahələrin adını qaytarır.
const phoneRe = /^\+?\d[\d\s-]{7,}$/;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");
  const errors: Record<string, string> = {};
  if (str("companyName").length < 2) errors.companyName = "invalid";
  if (!phoneRe.test(str("phone"))) errors.phone = "invalid";
  if (str("title").length < 3) errors.title = "invalid";
  if (!str("category")) errors.category = "invalid";
  if (!str("city")) errors.city = "invalid";
  if (str("description").length < 30) errors.description = "invalid";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  return NextResponse.json({ ok: true, demo: true, id: crypto.randomUUID() });
}
