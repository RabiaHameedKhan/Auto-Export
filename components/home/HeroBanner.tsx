import Image from "next/image";
import Link from "next/link";
import { listMakes, listBodyTypes } from "@/lib/queries/makes";

export async function HeroBanner({ imageUrl }: { imageUrl?: string | null }) {
  const bg = imageUrl || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80";
  const makes = await listMakes().catch(() => []);
  const bodyTypes = await listBodyTypes().catch(() => []);

  return (
    <section className="relative min-h-[420px] w-full overflow-hidden">
      <Image
        src={bg}
        alt="Hero"
        fill
        priority
        className="object-cover brightness-[0.85]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 text-white md:py-24">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Export-quality vehicles worldwide
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            Search our inventory by make, body type, price, and more — shipped to your port.
          </p>
        </div>

        <form
          action="/search"
          method="get"
          className="rounded-2xl bg-white/95 p-6 text-[#0a0a0a] shadow-xl backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium">
              Make
              <select
                name="make_id"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">Any</option>
                {makes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Body type
              <select
                name="body_type"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">Any</option>
                {bodyTypes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Transmission
              <select
                name="transmission"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Automanual">Automanual</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Fuel
              <select
                name="fuel"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2"
                defaultValue=""
              >
                <option value="">Any</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Year from
              <input
                type="number"
                name="min_year"
                min={1990}
                max={2030}
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
                placeholder="e.g. 2018"
              />
            </label>
            <label className="text-sm font-medium">
              Year to
              <input
                type="number"
                name="max_year"
                min={1990}
                max={2030}
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
                placeholder="e.g. 2024"
              />
            </label>
            <label className="text-sm font-medium">
              Min price (USD)
              <input
                type="number"
                name="min_price"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
                placeholder="0"
              />
            </label>
            <label className="text-sm font-medium">
              Max price (USD)
              <input
                type="number"
                name="max_price"
                className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
                placeholder="50000"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[#0c47a5] px-8 py-3 font-semibold text-white hover:bg-[#0a3d91]"
            >
              Search
            </button>
            <Link
              href="/search"
              className="rounded-lg border-2 border-[#0c47a5] px-6 py-3 font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
            >
              View all used cars
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
