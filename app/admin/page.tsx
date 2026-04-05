import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/queries/stats";
import { db } from "@/lib/db";
import { vehicles, inquiries } from "@/lib/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { vehicleImages } from "@/lib/db/schema";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = {
    totalVehicles: 0,
    addedToday: 0,
    unreadInquiries: 0,
    newArrivalsWeek: 0,
    brandNew: 0,
    used: 0,
    totalInquiries: 0,
  };
  const recentVehicles: {
    id: number;
    title: string;
    createdAt: Date | null;
    thumb: string | null;
  }[] = [];
  let recentInquiries: { id: number; name: string; createdAt: Date | null }[] = [];

  try {
    stats = await getAdminDashboardStats();
    if (db) {
      const vrows = await db
        .select({
          id: vehicles.id,
          title: vehicles.title,
          createdAt: vehicles.createdAt,
        })
        .from(vehicles)
        .orderBy(desc(vehicles.createdAt))
        .limit(5);

      for (const v of vrows) {
        const [img] = await db
          .select({ url: vehicleImages.url })
          .from(vehicleImages)
          .where(eq(vehicleImages.vehicleId, v.id))
          .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id))
          .limit(1);
        recentVehicles.push({ ...v, thumb: img?.url ?? null });
      }

      recentInquiries = await db
        .select({
          id: inquiries.id,
          name: inquiries.name,
          createdAt: inquiries.createdAt,
        })
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt))
        .limit(5);
    }
  } catch {
    /* no DB */
  }

  const cards = [
    { label: "Vehicles in stock", value: stats.totalVehicles },
    { label: "Added today", value: stats.addedToday },
    { label: "Unread inquiries", value: stats.unreadInquiries },
    { label: "New this week", value: stats.newArrivalsWeek },
    { label: "Brand new", value: stats.brandNew },
    { label: "Used", value: stats.used },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0a0a0a]">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[#e0e0e0] bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-[#6b7280]">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#0c47a5]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/vehicles/new"
          className="rounded-lg bg-[#0c47a5] px-5 py-2.5 font-semibold text-white hover:bg-[#0a3d91]"
        >
          Add vehicle
        </Link>
        <Link
          href="/admin/inquiries"
          className="rounded-lg border-2 border-[#0c47a5] px-5 py-2.5 font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
        >
          View inquiries
        </Link>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold">Recent vehicles</h2>
          <ul className="mt-4 space-y-3">
            {recentVehicles.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/admin/vehicles/${v.id}/edit`}
                  className="flex items-center gap-3 rounded-lg border border-[#e0e0e0] bg-white p-3 hover:bg-[#f5f5f5]"
                >
                  <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded bg-[#f5f5f5]">
                    {v.thumb ? (
                      <Image src={v.thumb} alt="" fill className="object-cover" sizes="80px" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium">{v.title}</p>
                    <p className="text-xs text-[#6b7280]">
                      {v.createdAt?.toLocaleString() ?? ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Recent inquiries</h2>
          <ul className="mt-4 space-y-2">
            {recentInquiries.map((i) => (
              <li
                key={i.id}
                className="rounded-lg border border-[#e0e0e0] bg-white px-4 py-3"
              >
                <span className="font-medium">{i.name}</span>
                <span className="ml-2 text-sm text-[#6b7280]">
                  {i.createdAt?.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
