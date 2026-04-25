import type { VehicleListItem } from "@/types";
import { VehicleCard } from "./VehicleCard";

export function VehicleGrid({ vehicles }: { vehicles: VehicleListItem[] }) {
  if (vehicles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#e0e0e0] bg-white py-16 text-center text-[#6b7280]">
        No vehicles match your filters.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-5">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
