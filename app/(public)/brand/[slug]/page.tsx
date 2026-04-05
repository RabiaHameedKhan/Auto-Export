import { notFound } from "next/navigation";
import { getMakeBySlug } from "@/lib/queries/makes";
import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const make = await getMakeBySlug(params.slug);
  if (!make) notFound();

  return (
    <VehicleListingSection
      title={`${make.name} vehicles`}
      breadcrumb={make.name}
      baseParams={{ makeId: make.id, vehicleCondition: "used" }}
      searchParams={searchParams}
    />
  );
}
