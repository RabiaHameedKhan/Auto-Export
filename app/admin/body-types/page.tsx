import { db } from "@/lib/db";
import { bodyTypes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminBodyTypesPage() {
  let rows: typeof bodyTypes.$inferSelect[] = [];
  try {
    if (!db) throw new Error("no db");
    rows = await db.select().from(bodyTypes).orderBy(asc(bodyTypes.name));
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Body types</h1>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e0e0e0] bg-[#f5f5f5]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-[#e0e0e0]">
                <td className="p-3">{b.name}</td>
                <td className="p-3 font-mono text-xs">{b.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
