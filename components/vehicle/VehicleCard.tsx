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
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[1.15rem] border border-[#dfe4ee] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_14px_26px_rgba(15,23,42,0.1)] sm:rounded-[1.35rem]">
      <Link href={`/car/${vehicle.id}`} className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        <Image
          src={img}
          alt={vehicle.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width:640px) 33vw, (max-width:1024px) 33vw, (max-width:1280px) 20vw, 20vw"
        />
        {vehicle.isFeatured ? (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-[#e6d53c] px-1.5 py-0.5 text-[10px] font-semibold text-black shadow-sm">
            Featured
          </span>
        ) : null}
        {vehicle.isClearance ? (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            Clearance
          </span>
        ) : null}
      </Link>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        <Link href={`/car/${vehicle.id}`} className="min-w-0">
          <h3 className="block min-h-[1.05rem] overflow-hidden text-ellipsis whitespace-nowrap text-[0.76rem] font-semibold uppercase tracking-[0.025em] leading-none text-[#0a0a0a] sm:line-clamp-2 sm:min-h-[2.25rem] sm:whitespace-normal sm:text-[0.92rem] sm:leading-[1.15]">
            {vehicle.title}
          </h3>
        </Link>
        <p className="text-[0.8rem] font-bold leading-none text-[#0c47a5] sm:text-[0.98rem]">{formatUsd(price)}</p>
        {vehicle.mileage != null ? (
          <p className="hidden text-[11px] font-medium leading-4 text-[#64748b] sm:block sm:text-xs">
            {vehicle.mileage.toLocaleString()} km
          </p>
        ) : (
          <div className="hidden h-[0.9rem] sm:block" />
        )}
        <div className="flex flex-wrap content-start gap-1 overflow-hidden sm:gap-1.5">
          {metaBadges.slice(0, 1).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-[#f5f5f5] px-1.5 py-1 text-[9px] leading-none text-[#6b7280] sm:px-2 sm:text-[11px]"
            >
              {badge}
            </span>
          ))}
          {metaBadges.slice(1, 2).map((badge) => (
            <span
              key={badge}
              className="hidden rounded-full bg-[#f5f5f5] px-2 py-1 text-[11px] leading-none text-[#6b7280] sm:inline-flex"
            >
              {badge}
            </span>
          ))}
        </div>
        <Link
          href={`/car/${vehicle.id}#quote`}
          className="mt-auto inline-flex w-full items-center justify-center rounded-[0.9rem] bg-[#0c47a5] px-1.5 py-2 text-[0.76rem] font-semibold text-white hover:bg-[#0a3d91] sm:rounded-[0.95rem] sm:px-3 sm:py-2.5 sm:text-[0.9rem]"
        >
          Get Quote
        </Link>
      </div>
    </article>
  );
}
