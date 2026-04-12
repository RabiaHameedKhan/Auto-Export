import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import type { VehicleListItem } from "@/types";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { InventorySidebar, SidebarStatCard } from "@/components/vehicle/InventorySidebar";
import { formatUsd } from "@/lib/utils";
import {
  getVehicleSidebarData,
  searchVehicles,
  type VehicleSearchParams,
} from "@/lib/queries/vehicles";
import {
  buildVehicleSearchHref,
  parseVehicleSearchParams,
} from "@/lib/listing-params";
import { SortDropdown } from "./SortDropdown";
import { ListingPagination } from "./ListingPagination";

function SidebarPanel({
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

function SidebarVehicleCard({
  title,
  vehicle,
}: {
  title: string;
  vehicle: VehicleListItem;
}) {
  const price = parseFloat(String(vehicle.price));

  return (
    <Link
      href={`/car/${vehicle.id}`}
      className="group flex gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-3 transition-colors hover:border-[#0c47a5] hover:bg-[#f8fbff]"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#e5e7eb]">
        <Image
          src={vehicle.thumbnail || "/placeholder-car.svg"}
          alt={vehicle.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="112px"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0c47a5]">{title}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#111827]">{vehicle.title}</h3>
        <p className="mt-2 text-sm font-bold text-[#0c47a5]">{formatUsd(price)}</p>
        <p className="mt-1 text-xs text-[#64748b]">
          {vehicle.year} {vehicle.transmission ? `• ${vehicle.transmission}` : ""}
        </p>
      </div>
    </Link>
  );
}

function normalizeSidebarParams(params: VehicleSearchParams): VehicleSearchParams {
  return {
    ...params,
    page: 1,
    perPage: undefined,
  };
}

export async function VehicleListingSection({
  title,
  breadcrumb,
  baseParams,
  searchParams,
}: {
  title: string;
  breadcrumb: string;
  baseParams: VehicleSearchParams;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const parsed = parseVehicleSearchParams(searchParams);
  const merged: VehicleSearchParams = {
    ...parsed,
    ...baseParams,
    page: parsed.page ?? 1,
    perPage: 20,
  };

  const filterState = normalizeSidebarParams({
    ...merged,
    sort: merged.sort ?? null,
  });
  const facetScope = normalizeSidebarParams({
    ...merged,
    sort: undefined,
  });

  const [{ rows, total }, sidebar] = await Promise.all([
    searchVehicles(merged),
    getVehicleSidebarData(facetScope, filterState),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / (merged.perPage ?? 20)));
  const resetHref = buildVehicleSearchHref(normalizeSidebarParams({ ...baseParams }));

  const makeHref = (id: number) =>
    buildVehicleSearchHref({
      ...filterState,
      makeId: id,
      modelId: undefined,
      page: 1,
    });

  const bodyTypeHref = (id: number) =>
    buildVehicleSearchHref({
      ...filterState,
      bodyTypeId: id,
      page: 1,
    });

  const fuelHref = (value: string) =>
    buildVehicleSearchHref({
      ...filterState,
      fuel: value === "Unknown" ? undefined : value,
      page: 1,
    });

  const transmissionHref = (value: string) =>
    buildVehicleSearchHref({
      ...filterState,
      transmission: value === "Unknown" ? undefined : value,
      page: 1,
    });

  const steeringHref = (value: string) =>
    buildVehicleSearchHref({
      ...filterState,
      steering: value === "Unknown" ? undefined : value,
      page: 1,
    });

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10">
      <nav className="mb-4 text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-[#0c47a5]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>{breadcrumb}</span>
      </nav>

      <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#d7dfef] bg-[linear-gradient(135deg,#081d4d_0%,#0c47a5_45%,#dce9ff_100%)] p-6 text-white shadow-[0_28px_80px_rgba(12,71,165,0.18)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Live Vehicle Inventory
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {title} <span className="text-white/80">({total} found)</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/88 md:text-base">
              Explore live stock with database-backed filters, real counts, and matching
              vehicle highlights pulled directly from your inventory.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <SidebarStatCard
              href={buildVehicleSearchHref(filterState)}
              label="Visible stock"
              value={sidebar.stats.total}
              active
            />
            <SidebarStatCard
              href={buildVehicleSearchHref({ ...filterState, newArrival: true, page: 1 })}
              label="New arrivals"
              value={sidebar.stats.newArrival}
              active={merged.newArrival}
            />
            <SidebarStatCard
              href={buildVehicleSearchHref({ ...filterState, clearanceOnly: true, page: 1 })}
              label="Clearance"
              value={sidebar.stats.clearance}
              active={merged.clearanceOnly}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <InventorySidebar
          className="order-2 xl:order-1 xl:sticky xl:top-24 xl:self-start"
          stats={[
            { href: buildVehicleSearchHref(filterState), label: "All stock", value: sidebar.stats.total },
            {
              href: buildVehicleSearchHref({ ...filterState, clearanceOnly: true, page: 1 }),
              label: "Clearance",
              value: sidebar.stats.clearance,
              active: merged.clearanceOnly,
            },
            {
              href: buildVehicleSearchHref({ ...filterState, newArrival: true, page: 1 }),
              label: "Fresh stock",
              value: sidebar.stats.newArrival,
              active: merged.newArrival,
            },
            { href: buildVehicleSearchHref(filterState), label: "Featured", value: sidebar.stats.featured },
          ]}
          resetHref={resetHref}
          makes={sidebar.makes}
          bodyTypes={sidebar.bodyTypes}
          fuelTypes={sidebar.fuelTypes}
          transmissions={sidebar.transmissions}
          steering={sidebar.steering}
          makeHref={(item) => makeHref(Number(item.id))}
          bodyTypeHref={(item) => bodyTypeHref(Number(item.id))}
          fuelHref={(item) => fuelHref(String(item.id))}
          transmissionHref={(item) => transmissionHref(String(item.id))}
          steeringHref={(item) => steeringHref(String(item.id))}
          activeMakeId={merged.makeId}
          activeBodyTypeId={merged.bodyTypeId}
          activeFuel={merged.fuel}
          activeTransmission={merged.transmission}
          activeSteering={merged.steering}
          activeQuickHref={
            merged.fuel
              ? `/search?fuel=${merged.fuel}`
              : merged.steering
                ? `/search?steering=${merged.steering}`
                : merged.transmission
                  ? `/search?transmission=${merged.transmission}`
                  : undefined
          }
          activePriceHref={
            merged.minPrice != null || merged.maxPrice != null
              ? merged.minPrice === 8000 && merged.maxPrice === 12000
                ? "/by-price/8000/12000"
                : merged.minPrice === 12000 && merged.maxPrice === 20000
                  ? "/by-price/12000/20000"
                  : merged.maxPrice === 8000
                    ? "/price-under/8000"
                    : merged.minPrice === 20000
                      ? "/price-over/20000"
                      : undefined
              : undefined
          }
        />

        <main className="order-1 min-w-0 xl:order-2">
          <div className="mb-6 rounded-[1.75rem] border border-[#d7dfef] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">
                  Matching Inventory
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#111827]">{title}</h2>
              </div>
              <Suspense
                fallback={<div className="h-10 w-48 animate-pulse rounded-lg bg-[#f5f5f5]" />}
              >
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          {rows.length ? (
            <>
              <VehicleGrid vehicles={rows} />
              <Suspense>
                <ListingPagination page={merged.page ?? 1} totalPages={totalPages} />
              </Suspense>
            </>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-[#cbd5e1] bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-[#111827]">No vehicles matched these filters</h3>
              <p className="mt-3 text-sm text-[#64748b]">
                Try clearing one or two filters and we&apos;ll pull in a broader set of live stock.
              </p>
              <Link
                href={resetHref}
                className="mt-5 inline-flex rounded-xl bg-[#0c47a5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0a3d91]"
              >
                View all matching stock
              </Link>
            </div>
          )}
        </main>

        <aside className="order-3 space-y-6 xl:sticky xl:top-24 xl:self-start">
          <SidebarPanel title="Featured Stock">
            <div className="space-y-3">
              {(sidebar.featuredVehicles.length ? sidebar.featuredVehicles : sidebar.latestVehicles).map(
                (vehicle) => (
                  <SidebarVehicleCard key={`featured-${vehicle.id}`} title="Featured" vehicle={vehicle} />
                )
              )}
            </div>
          </SidebarPanel>

          <SidebarPanel title="Fresh Arrivals">
            <div className="space-y-3">
              {sidebar.latestVehicles.map((vehicle) => (
                <SidebarVehicleCard key={`latest-${vehicle.id}`} title="New" vehicle={vehicle} />
              ))}
            </div>
          </SidebarPanel>

          <SidebarPanel title="Clearance Stock">
            <div className="space-y-3">
              {(sidebar.clearanceVehicles.length ? sidebar.clearanceVehicles : sidebar.latestVehicles).map(
                (vehicle) => (
                  <SidebarVehicleCard key={`clearance-${vehicle.id}`} title="Clearance" vehicle={vehicle} />
                )
              )}
            </div>
          </SidebarPanel>
        </aside>
      </div>
    </div>
  );
}
