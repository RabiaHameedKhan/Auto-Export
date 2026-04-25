import Link from "next/link";
import type { ReactNode } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { InventorySidebar } from "@/components/vehicle/InventorySidebar";
import { getVehicleSidebarData, searchVehicles } from "@/lib/queries/vehicles";
import {
  listMakes,
  listBodyTypes,
} from "@/lib/queries/makes";
import { getSiteSetting } from "@/lib/queries/site";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
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
    <section className="overflow-hidden rounded-[1.5rem] border border-[#d7dfef] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="bg-[linear-gradient(135deg,#102a66_0%,#0c47a5_100%)] px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function HomeCategoryCard({
  href,
  title,
  subtitle,
  countLabel,
  imageUrl,
  accent,
  badge,
}: {
  href: string;
  title: string;
  subtitle: string;
  countLabel: string;
  imageUrl?: string | null;
  accent: string;
  badge: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[1.5rem] border border-[#d9e2f0] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[1/1] overflow-hidden bg-[#e8eef9] sm:aspect-[4/3]">
        <Image
          src={imageUrl || "/placeholder-car.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/82 via-[#0f172a]/18 to-transparent" />
        <div className={`absolute left-3 top-3 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] sm:left-4 sm:top-4 sm:px-3 ${accent}`}>
          {badge}
        </div>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">{countLabel}</p>
          <h3 className="mt-1.5 text-base font-bold leading-tight text-white sm:mt-2 sm:text-xl">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/82 sm:text-sm">{subtitle}</p>
        </div>
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
      className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 border-b border-[#e5e7eb] py-3 last:border-b-0 hover:bg-[#f8fbff] sm:grid-cols-[96px_minmax(0,1fr)]"
    >
      <div className="relative h-20 overflow-hidden rounded-xl border border-[#d8dee9] bg-[#e5e7eb]">
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
  let makeShowcase: Array<{
    id: number;
    name: string;
    slug: string;
    logoUrl?: string | null;
    count: number;
    vehicle: Awaited<ReturnType<typeof searchVehicles>>["rows"][number] | null;
  }> = [];
  let bodyTypeShowcase: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
    vehicle: Awaited<ReturnType<typeof searchVehicles>>["rows"][number] | null;
  }> = [];
  let priceShowcase: Array<{
    label: string;
    href: string;
    count: number;
    vehicle: Awaited<ReturnType<typeof searchVehicles>>["rows"][number] | null;
  }> = [];
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
  let highlightedVehicles: Awaited<ReturnType<typeof searchVehicles>>["rows"] = [];
  try {
    const na = await searchVehicles({ page: 1, perPage: 12, sort: "created_desc" });
    newArrivals = na.rows;
    makes = await listMakes();
    bodyTypes = await listBodyTypes();
    sidebarData = await getVehicleSidebarData({}, { page: 1 });
    const featuredHighlightResult = await searchVehicles({
      page: 1,
      perPage: 5,
      sort: "created_desc",
    });
    highlightedVehicles = [
      ...sidebarData.featuredVehicles,
      ...featuredHighlightResult.rows.filter(
        (candidate) => !sidebarData.featuredVehicles.some((featured) => featured.id === candidate.id)
      ),
    ].slice(0, 5);

    makeShowcase = await Promise.all(
      sidebarData.makes.slice(0, 6).map(async (item) => {
        const vehicleResult = await searchVehicles({
          makeId: Number(item.id),
          page: 1,
          perPage: 1,
          sort: "created_desc",
        });
        return {
          id: Number(item.id),
          name: item.label,
          slug: item.slug ?? "",
          logoUrl: item.imageUrl,
          count: item.count,
          vehicle: vehicleResult.rows[0] ?? null,
        };
      })
    );

    bodyTypeShowcase = await Promise.all(
      sidebarData.bodyTypes.slice(0, 4).map(async (item) => {
        const vehicleResult = await searchVehicles({
          bodyTypeId: Number(item.id),
          page: 1,
          perPage: 1,
          sort: "created_desc",
        });
        return {
          id: Number(item.id),
          name: item.label,
          slug: item.slug ?? "",
          count: item.count,
          vehicle: vehicleResult.rows[0] ?? null,
        };
      })
    );

    priceShowcase = await Promise.all(
      priceFilterLinks.map(async (item) => {
        const searchParams =
          item.href === "/price-under/8000"
            ? { maxPrice: 8000 }
            : item.href === "/by-price/8000/12000"
              ? { minPrice: 8000, maxPrice: 12000 }
              : item.href === "/by-price/12000/20000"
                ? { minPrice: 12000, maxPrice: 20000 }
                : { minPrice: 20000 };
        const vehicleResult = await searchVehicles({
          ...searchParams,
          page: 1,
          perPage: 1,
          sort: "created_desc",
        });
        return {
          label: item.label,
          href: item.href,
          count: vehicleResult.total,
          vehicle: vehicleResult.rows[0] ?? null,
        };
      })
    );
  } catch {
    /* no DB */
  }

  return (
    <>
      <HeroBanner imageUrl={heroImage} />

      <section className="border-b border-[#d8dee9] bg-[#f8fbff] py-6 sm:py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                Featured Stock
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#111827]">Highlighted vehicles</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#173574] hover:underline"
            >
              Browse all stock
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-5">
            {highlightedVehicles.map((vehicle) => (
              <VehicleCard key={`highlighted-${vehicle.id}`} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eef1f6] py-8 sm:py-10">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="grid gap-5 xl:grid-cols-[210px_minmax(0,1fr)_210px]">
            <InventorySidebar
              className="order-1 hidden space-y-5 xl:col-span-1 xl:block xl:sticky xl:top-24 xl:self-start"
              stats={[
                { href: "/search", label: "Total stock", value: sidebarData.stats.total },
                { href: "/search?new=1", label: "New arrivals", value: sidebarData.stats.newArrival },
                { href: "/all-clearance", label: "Clearance", value: sidebarData.stats.clearance },
                { href: "/search", label: "Featured", value: sidebarData.stats.featured },
              ]}
              makes={sidebarData.makes}
              bodyTypes={sidebarData.bodyTypes}
              fuelTypes={sidebarData.fuelTypes}
              transmissions={sidebarData.transmissions}
              steering={sidebarData.steering}
              makeHref={(item) => `/brand/${item.slug}`}
              bodyTypeHref={(item) => `/car-type/${item.slug}`}
              fuelHref={(item) => `/search?fuel=${item.label}`}
              transmissionHref={(item) => `/search?transmission=${item.label}`}
              steeringHref={(item) => `/search?steering=${item.label}`}
            />

            <main className="order-2 min-w-0 lg:order-2 xl:order-2">
              <section className="overflow-hidden rounded-[1.75rem] border border-[#d8dee9] bg-white">
                <div className="border-b border-[#d8dee9] bg-[linear-gradient(90deg,#102a66_0%,#173574_55%,#2f5eb8_100%)] px-4 py-5 text-white sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">
                        Inventory Center
                      </p>
                      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Latest Vehicle Listings</h2>
                      <p className="mt-2 max-w-2xl text-sm text-white/82">
                        Real inventory, real counts, and direct links into your live stock.
                        This section is now built as a proper marketplace board instead of a simple card strip.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                      <div className="col-span-2 border border-white/20 bg-white/10 px-4 py-3 sm:col-span-1">
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

                <div className="border-b border-[#d8dee9] bg-[#f3f7ff] px-4 py-4 xl:hidden sm:px-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                    Quick Browse
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Link
                      href="/search"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      Browse all stock
                    </Link>
                    <Link
                      href="/all-new-arrival"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      New arrivals
                    </Link>
                    <Link
                      href="/all-clearance"
                      className="rounded-xl border border-[#d8dee9] bg-white px-4 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff]"
                    >
                      Clearance deals
                    </Link>
                  </div>
                </div>

                <div className="border-b border-[#d8dee9] bg-[#f8fafc] px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {priceFilterLinks.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="rounded-xl border border-[#d8dee9] bg-white px-3 py-3 text-sm font-semibold text-[#173574] transition-colors hover:border-[#173574] hover:bg-[#eef4ff] sm:px-4"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-6">
                  <div className="mb-5 flex flex-col gap-3 border-b border-[#e5e7eb] pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
                        New Arrivals Grid
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#111827] sm:text-2xl">Current Stock Feed</h3>
                    </div>
                    <Link
                      href="/all-new-arrival"
                      className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#173574] hover:underline"
                    >
                      View full inventory
                    </Link>
                  </div>
                  <VehicleGrid vehicles={newArrivals} />
                </div>
              </section>
            </main>

            <aside className="order-3 space-y-5 lg:order-3 lg:sticky lg:top-24 lg:self-start xl:order-3">
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

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="overflow-hidden rounded-[1.75rem] border border-[#d9e0ef] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:rounded-[2rem]">
          <div className="bg-[linear-gradient(135deg,#0c47a5_0%,#18367c_55%,#101828_100%)] px-5 py-7 text-white sm:px-10 sm:py-8 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  About 9 Yard Trading
                </div>
                <h2 className="text-2xl font-bold leading-tight sm:text-4xl">
                  We are a Trusted Name in Auto Industry
                </h2>
                <p className="mt-3 text-base text-white/85 sm:text-2xl">
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

          <div className="grid gap-8 px-5 py-7 sm:px-10 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-12">
            <div>
              <p className="max-w-2xl text-sm leading-7 text-[#52525b] sm:text-base sm:leading-8">
                9 Yard Trading is a leading and the most trusted name in the field of
                automobile trading industry.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#52525b] sm:mt-5 sm:text-base sm:leading-8">
                We are best known for providing quality vehicle inspection via thorough
                examination of every vehicle that is booked from our end.
              </p>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
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
              <div className="relative min-h-[220px] overflow-hidden rounded-[1.5rem] bg-[#e8eef9] shadow-lg sm:min-h-[260px] sm:rounded-[1.75rem]">
                <Image
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"
                  alt="9 Yard Trading vehicle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 32vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[#0f172a]/88 p-4 shadow-xl backdrop-blur sm:bottom-5 sm:left-5 sm:right-5">
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

      <section className="border-y border-[#e0e0e0] bg-[#f5f5f5] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-[#0a0a0a] sm:mb-8">Shop by make</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {makeShowcase.map((item) => (
              <div key={item.id} className="min-w-0">
                <HomeCategoryCard
                  href={`/brand/${item.slug}`}
                  title={item.name}
                  subtitle={
                    item.vehicle
                      ? `${item.vehicle.year} ${item.vehicle.title}`
                      : "Browse live inventory from this make."
                  }
                  countLabel={`${item.count} vehicles`}
                  imageUrl={item.vehicle?.thumbnail || item.logoUrl}
                  accent="border-white/25 bg-white/12 text-white"
                  badge="Make"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <h2 className="mb-6 text-2xl font-bold text-[#0a0a0a] sm:mb-8">Shop by body type</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
          {bodyTypeShowcase.map((item) => (
            <div key={item.id} className="min-w-0">
              <HomeCategoryCard
                href={`/car-type/${item.slug}`}
                title={item.name}
                subtitle={
                  item.vehicle
                    ? `${item.vehicle.makeName ?? ""} ${item.vehicle.modelName ?? item.vehicle.title}`.trim()
                    : "See vehicles grouped by this body style."
                }
                countLabel={`${item.count} vehicles`}
                imageUrl={item.vehicle?.thumbnail}
                accent="border-[#93c5fd]/45 bg-[#0c47a5]/30 text-white"
                badge="Body Type"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-[#0a0a0a] sm:mb-8">Shop by price</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {priceShowcase.map((item) => (
              <div key={item.href} className="min-w-0">
                <HomeCategoryCard
                  href={item.href}
                  title={item.label}
                  subtitle={
                    item.vehicle
                      ? `${item.vehicle.makeName ?? ""} ${item.vehicle.modelName ?? item.vehicle.title}`.trim()
                      : "Explore vehicles in this budget range."
                  }
                  countLabel={item.count ? `${item.count} fresh matches` : "Browse this range"}
                  imageUrl={item.vehicle?.thumbnail}
                  accent="border-[#fde68a]/45 bg-[#b45309]/35 text-white"
                  badge="Price"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <h2 className="mb-6 text-2xl font-bold text-[#0a0a0a]">Quick categories</h2>
        <div className="flex flex-wrap gap-2">
          {quickFilterLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="shrink-0 rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:border-[#0c47a5] hover:text-[#0c47a5]"
            >
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
