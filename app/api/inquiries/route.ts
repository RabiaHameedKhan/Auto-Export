import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";

const schema = z.object({
  vehicleId: z.number().int().optional().nullable(),
  name: z.string().min(1).max(255),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  country: z.string().max(100).optional(),
  destinationPort: z.string().max(100).optional(),
  message: z.string().max(5000).optional(),
});

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

  const parsed = schema.safeParse(body);
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
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
