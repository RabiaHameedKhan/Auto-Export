import { sql, eq, and, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicles, inquiries } from "@/lib/db/schema";

export async function getInventoryStats() {
  if (!db) {
    return {
      totalVehicles: 0,
      addedToday: 0,
      unreadInquiries: 0,
    };
  }
  const [totalRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(eq(vehicles.isActive, true));

  const [todayRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(
      sql`(${vehicles.createdAt})::date = CURRENT_DATE`
    );

  const [unreadRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(eq(inquiries.status, "new"));

  return {
    totalVehicles: totalRow?.n ?? 0,
    addedToday: todayRow?.n ?? 0,
    unreadInquiries: unreadRow?.n ?? 0,
  };
}

export async function getAdminDashboardStats() {
  if (!db) {
    return {
      totalVehicles: 0,
      addedToday: 0,
      unreadInquiries: 0,
      newArrivalsWeek: 0,
      brandNew: 0,
      used: 0,
      totalInquiries: 0,
    };
  }
  const base = await getInventoryStats();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [newWeekRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(
      and(eq(vehicles.isActive, true), gte(vehicles.createdAt, weekAgo))
    );

  const [brandNewRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(
      and(
        eq(vehicles.isActive, true),
        eq(vehicles.vehicleCondition, "brand_new")
      )
    );

  const [usedRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(
      and(eq(vehicles.isActive, true), eq(vehicles.vehicleCondition, "used"))
    );

  const [inqTotalRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(inquiries);

  return {
    ...base,
    newArrivalsWeek: newWeekRow?.n ?? 0,
    brandNew: brandNewRow?.n ?? 0,
    used: usedRow?.n ?? 0,
    totalInquiries: inqTotalRow?.n ?? 0,
  };
}
