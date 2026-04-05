import Link from "next/link";
import { HeroBanner } from "@/components/home/HeroBanner";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { searchVehicles } from "@/lib/queries/vehicles";
import {
  listMakes,
  makeVehicleCounts,
  bodyTypeVehicleCounts,
  listBodyTypes,
} from "@/lib/queries/makes";
import { getSiteSetting } from "@/lib/queries/site";
import Image from "next/image";

export const revalidate = 120;

export default async function HomePage() {
  let heroImage: string | null = null;
  try {
    heroImage = await getSiteSetting("hero_banner_url");
  } catch {
    heroImage = null;
  }

  let newArrivals: Awaited<ReturnType<typeof searchVehicles>>["rows"] = [];
  let makes: Awaited<ReturnType<typeof listMakes>> = [];
  let bodyTypes: Awaited<ReturnType<typeof listBodyTypes>> = [];
  let makeCounts = new Map<number, number>();
  let bodyCounts = new Map<number, number>();
  try {
    const na = await searchVehicles({ page: 1, perPage: 8, sort: "created_desc" });
    newArrivals = na.rows;
    makes = await listMakes();
    bodyTypes = await listBodyTypes();
    makeCounts = await makeVehicleCounts();
    bodyCounts = await bodyTypeVehicleCounts();
  } catch {
    /* no DB */
  }

  const priceTiles = [
    { label: "Under $8k", href: "/price-under/8000" },
    { label: "$8k – $12k", href: "/by-price/8000/12000" },
    { label: "$12k – $20k", href: "/by-price/12000/20000" },
    { label: "Over $20k", href: "/price-over/20000" },
  ];

  const quick = [
    { label: "Petrol", href: "/search?fuel=Petrol" },
    { label: "Diesel", href: "/search?fuel=Diesel" },
    { label: "Electric", href: "/search?fuel=Electric" },
    { label: "LHD", href: "/search?steering=Left" },
    { label: "RHD", href: "/search?steering=Right" },
    { label: "Manual", href: "/search?transmission=Manual" },
    { label: "Automatic", href: "/search?transmission=Automatic" },
  ];

  return (
    <>
      <HeroBanner imageUrl={heroImage} />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#0a0a0a]">New arrivals</h2>
          <Link
            href="/all-new-arrival"
            className="text-sm font-semibold text-[#0c47a5] hover:underline"
          >
            See all
          </Link>
        </div>
        <VehicleGrid vehicles={newArrivals} />
      </section>

      <section className="border-y border-[#e0e0e0] bg-[#f5f5f5] py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-[#0a0a0a]">Shop by make</h2>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {makes.map((m) => (
              <Link
                key={m.id}
                href={`/brand/${m.slug}`}
                className="flex flex-col items-center rounded-xl border border-[#e0e0e0] bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                {m.logoUrl ? (
                  <div className="relative mb-2 h-12 w-20">
                    <Image src={m.logoUrl} alt={m.name} fill className="object-contain" />
                  </div>
                ) : (
                  <span className="mb-2 text-lg font-bold text-[#0c47a5]">{m.name[0]}</span>
                )}
                <span className="text-sm font-semibold">{m.name}</span>
                <span className="mt-1 text-xs text-[#6b7280]">
                  {makeCounts.get(m.id) ?? 0} cars
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-2xl font-bold text-[#0a0a0a]">Shop by body type</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {bodyTypes.map((b) => (
            <Link
              key={b.id}
              href={`/car-type/${b.slug}`}
              className="rounded-xl border border-[#e0e0e0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-[#0c47a5]">{b.name}</h3>
              <p className="mt-2 text-sm text-[#6b7280]">
                {bodyCounts.get(b.id) ?? 0} vehicles
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-[#0a0a0a]">Shop by price</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {priceTiles.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-xl border-2 border-[#0c47a5] bg-white px-6 py-8 text-center font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-bold text-[#0a0a0a]">Quick categories</h2>
        <div className="flex flex-wrap gap-2">
          {quick.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:border-[#0c47a5] hover:text-[#0c47a5]"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
