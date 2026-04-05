import { NextResponse } from "next/server";
import { getInventoryStats } from "@/lib/queries/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getInventoryStats();
    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { totalVehicles: 0, addedToday: 0, unreadInquiries: 0 },
      { status: 200 }
    );
  }
}
