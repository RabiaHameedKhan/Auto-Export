import Link from "next/link";

export default function NewVehiclePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Add vehicle</h1>
      <p className="mt-4 max-w-xl text-[#6b7280]">
        Full multi-image upload and feature editor can be added next. For now, insert vehicles via
        SQL or run <code className="rounded bg-[#f5f5f5] px-1">npm run db:push</code> then seed
        data.
      </p>
      <Link href="/admin/vehicles" className="mt-6 inline-block text-[#0c47a5] hover:underline">
        ← Back to vehicles
      </Link>
    </div>
  );
}
