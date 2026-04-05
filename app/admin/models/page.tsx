import { db } from "@/lib/db";
import { models, makes } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminModelsPage() {
  let rows: { id: number; name: string; slug: string; makeName: string | null }[] = [];
  try {
    if (!db) throw new Error("no db");
    const list = await db
      .select({
        id: models.id,
        name: models.name,
        slug: models.slug,
        makeName: makes.name,
      })
      .from(models)
      .leftJoin(makes, eq(models.makeId, makes.id))
      .orderBy(asc(makes.name), asc(models.name));
    rows = list;
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Models</h1>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e0e0e0] bg-[#f5f5f5]">
            <tr>
              <th className="p-3">Make</th>
              <th className="p-3">Model</th>
              <th className="p-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-[#e0e0e0]">
                <td className="p-3">{m.makeName}</td>
                <td className="p-3">{m.name}</td>
                <td className="p-3 font-mono text-xs">{m.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
