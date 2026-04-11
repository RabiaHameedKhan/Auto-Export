import Image from "next/image";
import Link from "next/link";
import type { VehicleListItem } from "@/types";
import { formatUsd } from "@/lib/utils";

type Props = { vehicle: VehicleListItem };

export function VehicleCard({ vehicle }: Props) {
  const price = parseFloat(String(vehicle.price));
  const img = vehicle.thumbnail || "/placeholder-car.svg";
  const metaBadges = [
    vehicle.bodyTypeName,
    vehicle.transmission,
    vehicle.year ? String(vehicle.year) : null,
    vehicle.fuelType,
  ].filter(Boolean);

  return (
    <article className="group grid aspect-square grid-rows-[54%_46%] overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/car/${vehicle.id}`} className="relative min-h-0 overflow-hidden bg-[#f5f5f5]">
        <Image
          src={img}
          alt={vehicle.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
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
      <div className="grid min-h-0 grid-rows-[auto_auto_auto_1fr_auto] gap-2 p-3">
        <Link href={`/car/${vehicle.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold uppercase tracking-wide text-[#0a0a0a]">
            {vehicle.title}
          </h3>
        </Link>
        <p className="text-base font-bold text-[#0c47a5]">{formatUsd(price)}</p>
        {vehicle.mileage != null ? (
          <p className="text-xs font-medium text-[#64748b]">
            {vehicle.mileage.toLocaleString()} km
          </p>
        ) : (
          <div className="h-[1rem]" />
        )}
        <div className="flex flex-wrap content-start gap-1.5 overflow-hidden">
          {metaBadges.slice(0, 2).map((badge) => (
            <span key={badge} className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#6b7280]">
              {badge}
            </span>
          ))}
        </div>
        <Link
          href={`/car/${vehicle.id}#quote`}
          className="inline-flex items-center justify-center rounded-lg bg-[#0c47a5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a3d91]"
        >
          Get Quote
        </Link>
      </div>
    </article>
  );
}
