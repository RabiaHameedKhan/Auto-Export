import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default function AllClearancePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <VehicleListingSection
      title="Clearance stock"
      breadcrumb="Clearance"
      baseParams={{ clearanceOnly: true }}
      searchParams={searchParams}
    />
  );
}
