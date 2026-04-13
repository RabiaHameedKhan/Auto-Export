import { notFound } from "next/navigation";
import Link from "next/link";
import { getVehicleById, getRelatedVehicles } from "@/lib/queries/vehicles";
import { VehicleImageGallery } from "@/components/vehicle/VehicleImageGallery";
import { VehicleSpecTable } from "@/components/vehicle/VehicleSpecTable";
import { VehicleFeatureBadges } from "@/components/vehicle/VehicleFeatureBadges";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { formatUsd } from "@/lib/utils";
import { getSiteSetting } from "@/lib/queries/site";
import { SITE_CONTACT } from "@/lib/site-contact";

export const revalidate = 300;

export default async function CarDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (!Number.isFinite(id)) notFound();

  const v = await getVehicleById(id);
  if (!v) notFound();

  const related = await getRelatedVehicles(
    v.makeId,
    v.bodyTypeId,
    v.id,
    6
  );

  let whatsapp: string | undefined;
  try {
    const w = await getSiteSetting("whatsapp");
    whatsapp = w ?? SITE_CONTACT.whatsapp;
  } catch {
    whatsapp = SITE_CONTACT.whatsapp;
  }

  const price = parseFloat(String(v.price));

  const specRows = [
    { label: "Make", value: v.makeName },
    { label: "Model", value: v.modelName },
    { label: "Year", value: v.year },
    { label: "Month", value: v.month },
    { label: "Body type", value: v.bodyTypeName },
    { label: "Drive", value: v.driveType },
    { label: "Transmission", value: v.transmission },
    { label: "Steering", value: v.steering },
    { label: "Fuel", value: v.fuelType },
    { label: "Engine CC", value: v.engineCc },
    { label: "Color", value: v.color },
    { label: "Mileage (km)", value: v.mileage },
    { label: "Stock no.", value: v.stockNumber },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-[#0c47a5]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/search" className="hover:text-[#0c47a5]">
          Used cars
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#0a0a0a]">{v.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:items-start">
        <div className="min-w-0">
          <VehicleImageGallery
            images={v.images.map((im) => ({ id: im.id, url: im.url }))}
            title={v.title}
          />
          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#6b7280]">Stock #{v.stockNumber ?? "â€”"}</p>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-[#0a0a0a] md:text-3xl">
                {v.title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    v.vehicleCondition === "brand_new"
                      ? "bg-[#e6d53c] text-black"
                      : "bg-[#f5f5f5] text-[#6b7280]"
                  }`}
                >
                  {v.vehicleCondition === "brand_new" ? "Brand new" : "Used"}
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0c47a5]">{formatUsd(price)}</p>
          </div>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
            <VehicleSpecTable rows={specRows} />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">Features</h2>
            <VehicleFeatureBadges features={v.features} />
          </section>

          {v.description ? (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold">Description</h2>
              <div
                className="prose max-w-none text-[#374151]"
                dangerouslySetInnerHTML={{ __html: v.description }}
              />
            </section>
          ) : null}

          <section className="mt-12 lg:hidden">
            <QuoteForm vehicleId={v.id} whatsapp={whatsapp} />
          </section>

          <section className="mt-14">
            <h2 className="mb-6 text-xl font-semibold">How to buy</h2>
            <ol className="grid gap-4 md:grid-cols-5">
              {[
                "Choose a vehicle using search",
                "Request a quote with your destination port",
                "Pay by bank transfer or PayPal",
                "We ship to your port",
                "Clear customs at destination",
              ].map((step, i) => (
                <li
                  key={step}
                  className="rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] p-4 text-sm"
                >
                  <span className="font-bold text-[#0c47a5]">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <Link
              href="/how-to-buy"
              className="mt-4 inline-block text-sm font-semibold text-[#0c47a5] hover:underline"
            >
              Full guide â†’
            </Link>
          </section>

          <section className="mt-14">
            <h2 className="mb-6 text-xl font-semibold">Related vehicles</h2>
            <VehicleGrid vehicles={related} />
          </section>
        </div>

        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-28">
            <QuoteForm vehicleId={v.id} whatsapp={whatsapp} />
          </div>
        </aside>
      </div>
    </div>
  );
}



