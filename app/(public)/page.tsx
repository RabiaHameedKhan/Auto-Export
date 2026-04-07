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

const aboutFeatures = [
  {
    title: "World Wide Dealing",
    description: "Serving buyers across international markets with reliable export support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M4 7.5h16v10H4z" />
        <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
        <path d="M4 11h16" />
      </svg>
    ),
  },
  {
    title: "Trusted by Auto Buyers",
    description: "Built on confidence, transparency, and careful inspection of every booking.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M7 12l3 3 7-7" />
        <path d="M12 21l-7-4V7l7-4 7 4v10l-7 4z" />
      </svg>
    ),
  },
  {
    title: "Affordable Auto Prices",
    description: "Competitive pricing across quality export vehicles for different buyer needs.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path d="M3 13l3-5h12l3 5" />
        <path d="M5 13v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        <circle cx="8" cy="17" r="1.5" />
        <circle cx="16" cy="17" r="1.5" />
      </svg>
    ),
  },
];

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
        <div className="overflow-hidden rounded-[2rem] border border-[#d9e0ef] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,#0c47a5_0%,#18367c_55%,#101828_100%)] px-6 py-8 text-white sm:px-10 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  About 9 Yard Trading
                </div>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                  We are a Trusted Name in Auto Industry
                </h2>
                <p className="mt-3 text-lg text-white/85 sm:text-2xl">
                  Visited by Million of Car Buyers Every Month!
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">Since 2019</p>
                  <p className="mt-1 text-sm text-white/80">Exporting vehicles with care</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">120+</p>
                  <p className="mt-1 text-sm text-white/80">Countries reached</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="mt-1 text-sm text-white/80">Units sold</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-12">
            <div>
              <p className="max-w-2xl text-base leading-8 text-[#52525b]">
                9 Yard Trading is a leading and the most trusted name in the field of
                automobile trading industry.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#52525b]">
                We are best known for providing quality vehicle inspection via thorough
                examination of every vehicle that is booked from our end.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {aboutFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-[#dbe3f2] bg-[#f8fbff] p-5 shadow-sm"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0c47a5]/10 text-[#0c47a5]">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#0a0a0a]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] lg:grid-cols-1">
              <div className="relative min-h-[260px] overflow-hidden rounded-[1.75rem] bg-[#e8eef9] shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"
                  alt="9 Yard Trading vehicle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#0f172a]/88 p-4 shadow-xl backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#93c5fd]">
                    Quality Promise
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white">
                    Every vehicle is carefully reviewed so buyers get dependable details
                    and a smoother export experience.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#fff9ec] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6700]">
                    Inspection
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0a0a0a]">
                    Thorough vehicle examination before every booking.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f4f7ff] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0c47a5]">
                    Reliability
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0a0a0a]">
                    Trusted service from inquiry through export delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
