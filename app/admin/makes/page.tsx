import Link from "next/link";
import { db } from "@/lib/db";
import { makes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminMakesPage() {
  let rows: typeof makes.$inferSelect[] = [];
  try {
    if (!db) throw new Error("no db");
    rows = await db.select().from(makes).orderBy(asc(makes.name));
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Makes</h1>
      <p className="mt-2 text-[#6b7280]">
        Manage brands. Add via SQL seed or extend this UI with a create form.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e0e0e0] bg-[#f5f5f5]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-[#e0e0e0]">
                <td className="p-3">{m.name}</td>
                <td className="p-3 font-mono text-xs">{m.slug}</td>
                <td className="p-3">{m.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin" className="mt-6 inline-block text-[#0c47a5] hover:underline">
        ← Dashboard
      </Link>
    </div>
  );
}
