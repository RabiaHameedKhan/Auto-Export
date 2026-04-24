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
    <section className="relative w-full overflow-hidden">
      <Image
        src={bg}
        alt="Hero"
        fill
        priority
        className="object-cover brightness-[0.85]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 text-white sm:py-5 lg:py-6">
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-5">
          <div className="max-w-3xl self-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75 sm:text-[11px]">
              Global Inventory Search
            </p>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Export-quality vehicles worldwide
            </h1>
            <p className="mt-1.5 max-w-xl text-xs text-white/90 sm:text-sm">
              Search live stock by make, body type, price, and more.
            </p>
            <div className="mt-2 hidden flex-wrap gap-2 sm:flex">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white/15 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <form
            action="/search"
            method="get"
            className="rounded-2xl bg-white/95 p-3 text-[#0a0a0a] shadow-xl backdrop-blur sm:p-4"
          >
            <div className="mb-2.5 flex items-start justify-between gap-3 border-b border-[#e5e7eb] pb-2.5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                  Quick Vehicle Search
                </p>
                <p className="mt-0.5 text-[11px] text-[#475569] sm:text-xs">
                  Use a few filters and jump straight into matching stock.
                </p>
              </div>
              <Link href="/search" className="text-xs font-semibold text-[#0c47a5] hover:underline sm:text-sm">
                Browse all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <label className="text-xs font-medium sm:text-sm">
                Make
                <select
                  name="make_id"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
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
              <label className="text-xs font-medium sm:text-sm">
                Body type
                <select
                  name="body_type"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
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
              <label className="text-xs font-medium sm:text-sm">
                Transmission
                <select
                  name="transmission"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="">Any</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Automanual">Automanual</option>
                </select>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Fuel
                <select
                  name="fuel"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] bg-white px-2.5 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="">Any</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Year from
                <input
                  type="number"
                  name="min_year"
                  min={1990}
                  max={2030}
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="e.g. 2018"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Year to
                <input
                  type="number"
                  name="max_year"
                  min={1990}
                  max={2030}
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="e.g. 2024"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Min price (USD)
                <input
                  type="number"
                  name="min_price"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="0"
                />
              </label>
              <label className="text-xs font-medium sm:text-sm">
                Max price (USD)
                <input
                  type="number"
                  name="max_price"
                  className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-2.5 py-2 text-sm"
                  placeholder="50000"
                />
              </label>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#0c47a5] px-5 py-2 text-center text-sm font-semibold text-white hover:bg-[#0a3d91]"
              >
                Search
              </button>
              <Link
                href="/search"
                className="min-h-[40px] rounded-lg border-2 border-[#0c47a5] px-4 py-2 text-center text-sm font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
              >
                View all used cars
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
