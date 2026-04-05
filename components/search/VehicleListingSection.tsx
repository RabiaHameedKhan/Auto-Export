import { searchVehicles, type VehicleSearchParams } from "@/lib/queries/vehicles";
import { parseVehicleSearchParams } from "@/lib/listing-params";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { SortDropdown } from "./SortDropdown";
import { ListingPagination } from "./ListingPagination";
import { Suspense } from "react";

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

  const { rows, total } = await searchVehicles(merged);
  const totalPages = Math.max(1, Math.ceil(total / (merged.perPage ?? 20)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-4 text-sm text-[#6b7280]">
        <a href="/" className="hover:text-[#0c47a5]">
          Home
        </a>
        <span className="mx-2">/</span>
        <span>{breadcrumb}</span>
      </nav>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#0a0a0a] md:text-3xl">
          {title}{" "}
          <span className="text-lg font-normal text-[#6b7280]">
            ({total} found)
          </span>
        </h1>
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded-lg bg-[#f5f5f5]" />}>
          <SortDropdown />
        </Suspense>
      </div>
      <VehicleGrid vehicles={rows} />
      <Suspense>
        <ListingPagination page={merged.page ?? 1} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
