import { notFound } from "next/navigation";
import { getModelBySlug } from "@/lib/queries/makes";
import { VehicleListingSection } from "@/components/search/VehicleListingSection";

export const dynamic = "force-dynamic";

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const model = await getModelBySlug(params.slug);
  if (!model) notFound();

  return (
    <VehicleListingSection
      title={`${model.name}`}
      breadcrumb={model.name}
      baseParams={{ modelId: model.id }}
      searchParams={searchParams}
    />
  );
}
