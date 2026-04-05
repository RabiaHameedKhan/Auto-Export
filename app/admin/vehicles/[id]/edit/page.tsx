import Link from "next/link";

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit vehicle #{params.id}</h1>
      <p className="mt-4 max-w-xl text-[#6b7280]">
        Full edit form with image uploads is planned as a follow-up. Listings and detail pages
        already read from the database.
      </p>
      <Link href="/admin/vehicles" className="mt-6 inline-block text-[#0c47a5] hover:underline">
        ← Back to vehicles
      </Link>
    </div>
  );
}
