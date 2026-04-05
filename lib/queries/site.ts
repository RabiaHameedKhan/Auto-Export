import { eq, desc, inArray, and, or, isNull, lte, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { announcements, siteSettings } from "@/lib/db/schema";

export async function getSiteSetting(key: string) {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  return row?.value ?? null;
}

export async function getSiteSettings(keys: string[]) {
  if (keys.length === 0) return {};
  if (!db) {
    const map: Record<string, string | null> = {};
    for (const k of keys) map[k] = null;
    return map;
  }
  const rows = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.key, keys));
  const map: Record<string, string | null> = {};
  for (const k of keys) map[k] = null;
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getActiveAnnouncements() {
  if (!db) return [];
  const now = new Date();
  return db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isActive, true),
        or(
          isNull(announcements.scheduledFrom),
          lte(announcements.scheduledFrom, now)
        ),
        or(
          isNull(announcements.scheduledUntil),
          gte(announcements.scheduledUntil, now)
        )
      )
    )
    .orderBy(desc(announcements.createdAt));
}
