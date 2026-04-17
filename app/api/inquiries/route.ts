import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { inquirySchema } from "@/lib/validation/inquiry";

const rate = new Map<string, { n: number; t: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const entry = rate.get(ip);
  if (!entry || now - entry.t > hour) {
    rate.set(ip, { n: 1, t: now });
    return true;
  }
  if (entry.n >= 5) return false;
  entry.n += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const d = parsed.data;
  await db.insert(inquiries).values({
    vehicleId: d.vehicleId ?? null,
    name: d.name,
    email: d.email || null,
    phone: d.phone ?? null,
    country: d.country ?? null,
    destinationPort: d.destinationPort ?? null,
    message: d.message ?? null,
    address: d.address ?? null,
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
