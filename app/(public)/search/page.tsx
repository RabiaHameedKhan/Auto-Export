import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <VehicleListingSection
      title="Used vehicles"
      breadcrumb="Used cars"
      baseParams={{ vehicleCondition: "used" }}
      searchParams={searchParams}
    />
  );
}
