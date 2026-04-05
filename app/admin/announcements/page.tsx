import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  let rows: typeof announcements.$inferSelect[] = [];
  try {
    if (!db) throw new Error("no db");
    rows = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  } catch {
    rows = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Announcements</h1>
      <div className="mt-8 space-y-4">
        {rows.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-[#e0e0e0] bg-white p-4 shadow-sm"
          >
            <p className="font-semibold">{a.title ?? "Notice"}</p>
            <p className="mt-2 text-sm text-[#6b7280]">{a.content}</p>
            <p className="mt-2 text-xs text-[#9ca3af]">
              Active: {a.isActive ? "yes" : "no"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
