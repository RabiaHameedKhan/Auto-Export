import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function BrandNewPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <VehicleListingSection
      title="Brand new vehicles"
      breadcrumb="Brand new"
      baseParams={{ vehicleCondition: "brand_new" }}
      searchParams={searchParams}
    />
  );
}
