import Image from "next/image";
import Link from "next/link";
import { listMakes, listBodyTypes } from "@/lib/queries/makes";

export async function HeroBanner({ imageUrl }: { imageUrl?: string | null }) {
  const bg = imageUrl || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80";
  const makes = await listMakes().catch(() => []);
  const bodyTypes = await listBodyTypes().catch(() => []);
  const quickLinks = [
    { href: "/all-new-arrival", label: "New arrivals" },
    { href: "/all-clearance", label: "Clearance deals" },
    { href: "/price-under/8000", label: "Under $8k" },
  ];

  return (
    <section className="relative min-h-[520px] w-full overflow-hidden sm:min-h-[420px]">
      <Image
        src={bg}
        alt="Hero"
        fill
        priority
        className="object-cover brightness-[0.85]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 text-white sm:gap-8 sm:py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
            Global Inventory Search
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Export-quality vehicles worldwide
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
            Search our inventory by make, body type, price, and more — shipped to your port.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/15"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <form
          action="/search"
          method="get"
          className="rounded-2xl bg-white/95 p-4 text-[#0a0a0a] shadow-xl backdrop-blur sm:p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#e5e7eb] pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                Quick Vehicle Search
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                Use a few filters and jump straight into matching stock.
              </p>
            </div>
            <Link href="/search" className="text-sm font-semibold text-[#0c47a5] hover:underline">
              Browse all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium">
              Make
              <select
                name="make_id"
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-3"
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
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-3"
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
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-3"
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
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-3"
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
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] px-3 py-3"
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
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] px-3 py-3"
                placeholder="e.g. 2024"
              />
            </label>
            <label className="text-sm font-medium">
              Min price (USD)
              <input
                type="number"
                name="min_price"
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] px-3 py-3"
                placeholder="0"
              />
            </label>
            <label className="text-sm font-medium">
              Max price (USD)
              <input
                type="number"
                name="max_price"
                className="mt-1.5 w-full rounded-lg border border-[#e0e0e0] px-3 py-3"
                placeholder="50000"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              className="min-h-[48px] rounded-lg bg-[#0c47a5] px-8 py-3 text-center font-semibold text-white hover:bg-[#0a3d91]"
            >
              Search
            </button>
            <Link
              href="/search"
              className="min-h-[48px] rounded-lg border-2 border-[#0c47a5] px-6 py-3 text-center font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
            >
              View all used cars
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
