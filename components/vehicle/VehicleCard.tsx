import Image from "next/image";
import Link from "next/link";
import type { VehicleListItem } from "@/types";
import { formatUsd } from "@/lib/utils";

type Props = { vehicle: VehicleListItem };

export function VehicleCard({ vehicle }: Props) {
  const price = parseFloat(String(vehicle.price));
  const img = vehicle.thumbnail || "/placeholder-car.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/car/${vehicle.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f5]">
        <Image
          src={img}
          alt={vehicle.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {vehicle.isFeatured ? (
          <span className="absolute left-2 top-2 rounded bg-[#e6d53c] px-2 py-0.5 text-xs font-semibold text-black">
            Featured
          </span>
        ) : null}
        {vehicle.isClearance ? (
          <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            Clearance
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/car/${vehicle.id}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0a0a0a] line-clamp-2">
            {vehicle.title}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-bold text-[#0c47a5]">{formatUsd(price)}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {vehicle.bodyTypeName ? (
            <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {vehicle.bodyTypeName}
            </span>
          ) : null}
          {vehicle.transmission ? (
            <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {vehicle.transmission}
            </span>
          ) : null}
          {vehicle.mileage != null ? (
            <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {vehicle.mileage.toLocaleString()} km
            </span>
          ) : null}
          {vehicle.year ? (
            <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {vehicle.year}
            </span>
          ) : null}
          {vehicle.fuelType ? (
            <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {vehicle.fuelType}
            </span>
          ) : null}
        </div>
        <Link
          href={`/car/${vehicle.id}#quote`}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#0c47a5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a3d91]"
        >
          Get Quote
        </Link>
      </div>
    </article>
  );
}
