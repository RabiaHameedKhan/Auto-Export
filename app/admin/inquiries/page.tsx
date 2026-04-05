import { db } from "@/lib/db";
import { inquiries, vehicles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  let rows: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    country: string | null;
    status: string | null;
    createdAt: Date | null;
    vehicleTitle: string | null;
  }[] = [];

  try {
    if (!db) throw new Error("no db");
    const list = await db
      .select({
        id: inquiries.id,
        name: inquiries.name,
        email: inquiries.email,
        phone: inquiries.phone,
        country: inquiries.country,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
        vehicleTitle: vehicles.title,
      })
      .from(inquiries)
      .leftJoin(vehicles, eq(inquiries.vehicleId, vehicles.id))
      .orderBy(desc(inquiries.createdAt));

    rows = list;
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Inquiries</h1>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-[#e0e0e0] bg-[#f5f5f5]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Country</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#e0e0e0]">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.vehicleTitle ?? "—"}</td>
                <td className="p-3">{r.country}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-xs text-[#6b7280]">
                  {r.createdAt?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
