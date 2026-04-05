import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function ByPricePage({
  params,
  searchParams,
}: {
  params: { min: string; max: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const min = parseInt(params.min, 10);
  const max = parseInt(params.max, 10);
  const title = `Vehicles $${min.toLocaleString()} – $${max.toLocaleString()}`;

  return (
    <VehicleListingSection
      title={title}
      breadcrumb="By price"
      baseParams={{
        minPrice: Number.isFinite(min) ? min : null,
        maxPrice: Number.isFinite(max) ? max : null,
      }}
      searchParams={searchParams}
    />
  );
}
