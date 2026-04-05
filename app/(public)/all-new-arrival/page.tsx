import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function AllNewArrivalPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <VehicleListingSection
      title="New arrivals"
      breadcrumb="New arrivals"
      baseParams={{}}
      searchParams={searchParams}
    />
  );
}
