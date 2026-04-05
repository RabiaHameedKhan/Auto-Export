import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { vehicles, makes, models } from "@/lib/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { vehicleImages } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  let rows: {
    id: number;
    stockNumber: string | null;
    title: string;
    year: number;
    price: string;
    vehicleCondition: string | null;
    isActive: boolean | null;
    makeName: string | null;
    thumb: string | null;
  }[] = [];

  try {
    if (!db) throw new Error("no db");
    const list = await db
      .select({
        id: vehicles.id,
        stockNumber: vehicles.stockNumber,
        title: vehicles.title,
        year: vehicles.year,
        price: vehicles.price,
        vehicleCondition: vehicles.vehicleCondition,
        isActive: vehicles.isActive,
        makeName: makes.name,
      })
      .from(vehicles)
      .leftJoin(makes, eq(vehicles.makeId, makes.id))
      .leftJoin(models, eq(vehicles.modelId, models.id))
      .orderBy(desc(vehicles.updatedAt));

    for (const v of list) {
      const [img] = await db
        .select({ url: vehicleImages.url })
        .from(vehicleImages)
        .where(eq(vehicleImages.vehicleId, v.id))
        .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id))
        .limit(1);
      rows.push({ ...v, thumb: img?.url ?? null });
    }
  } catch {
    rows = [];
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Link
          href="/admin/vehicles/new"
          className="rounded-lg bg-[#0c47a5] px-4 py-2 font-semibold text-white hover:bg-[#0a3d91]"
        >
          Add vehicle
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[#e0e0e0] bg-[#f5f5f5]">
            <tr>
              <th className="p-3">Thumb</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Title</th>
              <th className="p-3">Year</th>
              <th className="p-3">Price</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-[#e0e0e0]">
                <td className="p-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded bg-[#f5f5f5]">
                    {v.thumb ? (
                      <Image src={v.thumb} alt="" fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                </td>
                <td className="p-3 font-mono text-xs">{v.stockNumber}</td>
                <td className="p-3">{v.title}</td>
                <td className="p-3">{v.year}</td>
                <td className="p-3">${v.price}</td>
                <td className="p-3">{v.vehicleCondition}</td>
                <td className="p-3">{v.isActive ? "Yes" : "No"}</td>
                <td className="p-3">
                  <Link href={`/admin/vehicles/${v.id}/edit`} className="text-[#0c47a5] hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
