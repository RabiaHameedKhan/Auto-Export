import Link from "next/link";
import type { ReactNode } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { getVehicleSidebarData, searchVehicles } from "@/lib/queries/vehicles";
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

function HomeSidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-[#d8dee9] bg-white">
      <div className="border-b border-[#d8dee9] bg-[#173574] px-4 py-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function HomeStatTile({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-[#d8dee9] bg-[#f8fafc] px-4 py-3 transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#111827]">{value}</p>
    </Link>
  );
}

function HomeFilterRow({
  href,
  label,
  count,
  imageUrl,
}: {
  href: string;
  label: string;
  count: number;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-[#e5e7eb] py-3 last:border-b-0 hover:bg-[#f8fbff]"
    >
      {imageUrl ? (
        <div className="relative h-10 w-14 shrink-0 border border-[#d8dee9] bg-white">
          <Image src={imageUrl} alt={label} fill className="object-contain p-1.5" sizes="56px" />
        </div>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8dee9] bg-[#eef4ff] text-[10px] font-bold uppercase tracking-[0.14em] text-[#173574]">
          {label.slice(0, 2)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#111827]">{label}</p>
        <p className="text-xs text-[#64748b]">{count} vehicles</p>
      </div>
    </Link>
  );
}

function HomeMiniVehicleCard({
  vehicle,
  badge,
}: {
  vehicle: Awaited<ReturnType<typeof searchVehicles>>["rows"][number];
  badge: string;
}) {
  return (
    <Link
      href={`/car/${vehicle.id}`}
      className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-[#e5e7eb] py-3 last:border-b-0 hover:bg-[#f8fbff]"
    >
      <div className="relative h-20 border border-[#d8dee9] bg-[#e5e7eb]">
        <Image
          src={vehicle.thumbnail || "/placeholder-car.svg"}
          alt={vehicle.title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#173574]">{badge}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#111827]">{vehicle.title}</h3>
        <p className="mt-2 text-xs text-[#64748b]">
          {vehicle.year} {vehicle.transmission ? `| ${vehicle.transmission}` : ""}
        </p>
        <p className="mt-1 text-sm font-bold text-[#173574]">
          ${Number(vehicle.price).toLocaleString("en-US")}
        </p>
      </div>
    </Link>
  );
}

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
  let sidebarData: Awaited<ReturnType<typeof getVehicleSidebarData>> = {
    makes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: [],
    steering: [],
    stats: { total: 0, featured: 0, clearance: 0, newArrival: 0 },
    featuredVehicles: [],
    latestVehicles: [],
    clearanceVehicles: [],
  };
  try {
    const na = await searchVehicles({ page: 1, perPage: 12, sort: "created_desc" });
    newArrivals = na.rows;
    makes = await listMakes();
    bodyTypes = await listBodyTypes();
    makeCounts = await makeVehicleCounts();
    bodyCounts = await bodyTypeVehicleCounts();
    sidebarData = await getVehicleSidebarData({}, { page: 1 });
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

      <section className="bg-[#eef1f6] py-10">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)_300px]">
            <aside className="space-y-5">
              <HomeSidebarSection title="Live Stock Overview">
                <div className="grid gap-3">
                  <HomeStatTile label="Total stock" value={sidebarData.stats.total} href="/search" />
                  <HomeStatTile
                    label="New arrivals"
                    value={sidebarData.stats.newArrival}
                    href="/search?new=1"
                  />
                  <HomeStatTile
                    label="Clearance"
                    value={sidebarData.stats.clearance}
                    href="/all-clearance"
                  />
                  <HomeStatTile
                    label="Featured"
                    value={sidebarData.stats.featured}
                    href="/search"
                  />
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Top Makes">
                <div>
                  {sidebarData.makes.map((item) => (
                    <HomeFilterRow
                      key={`home-make-${item.id}`}
                      href={`/brand/${item.slug}`}
                      label={item.label}
                      count={item.count}
                      imageUrl={item.imageUrl}
                    />
                  ))}
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Body Types">
                <div className="grid gap-0">
                  {sidebarData.bodyTypes.map((item) => (
                    <Link
                      key={`home-body-${item.id}`}
                      href={`/car-type/${item.slug}`}
                      className="flex items-center justify-between border-b border-[#e5e7eb] py-3 text-sm last:border-b-0 hover:bg-[#f8fbff]"
                    >
                      <span className="font-medium text-[#111827]">{item.label}</span>
                      <span className="text-xs font-semibold text-[#64748b]">{item.count}</span>
                    </Link>
                  ))}
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Quick Filters">
                <div className="grid gap-2">
                  {quick.map((q) => (
                    <Link
                      key={q.href}
                      href={q.href}
                      className="border border-[#d8dee9] px-3 py-2 text-sm font-medium text-[#111827] transition-colors hover:border-[#173574] hover:bg-[#eef4ff] hover:text-[#173574]"
                    >
                      {q.label}
                    </Link>
                  ))}
                </div>
              </HomeSidebarSection>
            </aside>

            <main className="min-w-0">
              <section className="border border-[#d8dee9] bg-white">
                <div className="border-b border-[#d8dee9] bg-[linear-gradient(90deg,#102a66_0%,#173574_55%,#2f5eb8_100%)] px-6 py-5 text-white">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">
                        Inventory Center
                      </p>
                      <h2 className="mt-2 text-3xl font-bold">Latest Vehicle Listings</h2>
                      <p className="mt-2 max-w-2xl text-sm text-white/82">
                        Real inventory, real counts, and direct links into your live stock.
                        This section is now built as a proper marketplace board instead of a simple card strip.
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <div className="border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Makes
                        </p>
                        <p className="mt-1 text-2xl font-bold">{makes.length}</p>
                      </div>
                      <div className="border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Body types
                        </p>
                        <p className="mt-1 text-2xl font-bold">{bodyTypes.length}</p>
                      </div>
                      <div className="border border-white/20 bg-white/10 px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                          Fresh units
                        </p>
                        <p className="mt-1 text-2xl font-bold">{newArrivals.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#d8dee9] bg-[#f8fafc] px-6 py-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    {priceTiles.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#e5e7eb] pb-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                        New Arrivals Grid
                      </p>
                      <h3 className="mt-1 text-2xl font-bold text-[#111827]">Current Stock Feed</h3>
                    </div>
                    <Link
                      href="/all-new-arrival"
                      className="text-sm font-semibold text-[#173574] hover:underline"
                    >
                      View full inventory
                    </Link>
                  </div>
                  <VehicleGrid vehicles={newArrivals} />
                </div>
              </section>
            </main>

            <aside className="space-y-5">
              <HomeSidebarSection title="Featured Stock">
                <div>
                  {(sidebarData.featuredVehicles.length
                    ? sidebarData.featuredVehicles
                    : sidebarData.latestVehicles
                  ).map((vehicle) => (
                    <HomeMiniVehicleCard key={`featured-${vehicle.id}`} vehicle={vehicle} badge="Featured" />
                  ))}
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Fresh Arrivals">
                <div>
                  {sidebarData.latestVehicles.map((vehicle) => (
                    <HomeMiniVehicleCard key={`latest-${vehicle.id}`} vehicle={vehicle} badge="New" />
                  ))}
                </div>
              </HomeSidebarSection>

              <HomeSidebarSection title="Clearance Stock">
                <div>
                  {(sidebarData.clearanceVehicles.length
                    ? sidebarData.clearanceVehicles
                    : sidebarData.latestVehicles
                  ).map((vehicle) => (
                    <HomeMiniVehicleCard
                      key={`clearance-${vehicle.id}`}
                      vehicle={vehicle}
                      badge="Clearance"
                    />
                  ))}
                </div>
              </HomeSidebarSection>
            </aside>
          </div>
        </div>
      </section>

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
