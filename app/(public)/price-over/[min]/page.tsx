import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function PriceOverPage({
  params,
  searchParams,
}: {
  params: { min: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const min = parseInt(params.min, 10);
  const title = `Vehicles over $${Number.isFinite(min) ? min.toLocaleString() : "—"}`;

  return (
    <VehicleListingSection
      title={title}
      breadcrumb="By price"
      baseParams={{ minPrice: Number.isFinite(min) ? min : null }}
      searchParams={searchParams}
    />
  );
}
