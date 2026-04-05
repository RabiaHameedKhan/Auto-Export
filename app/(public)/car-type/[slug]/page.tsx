import { notFound } from "next/navigation";
import { getBodyTypeBySlug } from "@/lib/queries/makes";
import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default async function CarTypePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const bt = await getBodyTypeBySlug(params.slug);
  if (!bt) notFound();

  return (
    <VehicleListingSection
      title={`${bt.name}`}
      breadcrumb={bt.name}
      baseParams={{ bodyTypeId: bt.id }}
      searchParams={searchParams}
    />
  );
}
