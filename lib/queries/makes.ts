import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { makes, models, bodyTypes, vehicles } from "@/lib/db/schema";

export async function listMakes() {
  if (!db) return [];
  return db
    .select()
    .from(makes)
    .where(eq(makes.isActive, true))
    .orderBy(asc(makes.name));
}

export async function listModelsByMake(makeId: number) {
  if (!db) return [];
  return db
    .select()
    .from(models)
    .where(eq(models.makeId, makeId))
    .orderBy(asc(models.name));
}

export async function listBodyTypes() {
  if (!db) return [];
  return db.select().from(bodyTypes).orderBy(asc(bodyTypes.name));
}

export async function getMakeBySlug(slug: string) {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(makes)
    .where(eq(makes.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getModelBySlug(slug: string) {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(models)
    .where(eq(models.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getBodyTypeBySlug(slug: string) {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(bodyTypes)
    .where(eq(bodyTypes.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function makeVehicleCounts() {
  if (!db) return new Map<number, number>();
  const rows = await db
    .select({
      makeId: vehicles.makeId,
      n: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(eq(vehicles.isActive, true))
    .groupBy(vehicles.makeId);
  const map = new Map<number, number>();
  for (const r of rows) {
    if (r.makeId != null) map.set(r.makeId, r.n);
  }
  return map;
}

export async function modelVehicleCounts() {
  if (!db) return new Map<number, number>();
  const rows = await db
    .select({
      modelId: vehicles.modelId,
      n: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(eq(vehicles.isActive, true))
    .groupBy(vehicles.modelId);
  const map = new Map<number, number>();
  for (const r of rows) {
    if (r.modelId != null) map.set(r.modelId, r.n);
  }
  return map;
}

export async function bodyTypeVehicleCounts() {
  if (!db) return new Map<number, number>();
  const rows = await db
    .select({
      bodyTypeId: vehicles.bodyTypeId,
      n: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(eq(vehicles.isActive, true))
    .groupBy(vehicles.bodyTypeId);
  const map = new Map<number, number>();
  for (const r of rows) {
    if (r.bodyTypeId != null) map.set(r.bodyTypeId, r.n);
  }
  return map;
}
