import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function PriceUnderPage({
  params,
  searchParams,
}: {
  params: { max: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const max = parseInt(params.max, 10);
  const title = `Vehicles under $${Number.isFinite(max) ? max.toLocaleString() : "—"}`;

  return (
    <VehicleListingSection
      title={title}
      breadcrumb="By price"
      baseParams={{ maxPrice: Number.isFinite(max) ? max : null }}
      searchParams={searchParams}
    />
  );
}
