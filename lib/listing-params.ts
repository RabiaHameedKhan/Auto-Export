import type { VehicleSearchParams } from "@/lib/queries/vehicles";

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function num(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function dec(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function parseVehicleSearchParams(
  sp: Record<string, string | string[] | undefined>
): VehicleSearchParams {
  const featuresStr = first(sp.features);
  const features = featuresStr
    ? featuresStr.split(",").map((f) => f.trim()).filter(Boolean)
    : undefined;

  return {
    makeId: num(first(sp.make_id)),
    modelId: num(first(sp.model_id)),
    bodyTypeId: num(first(sp.body_type)),
    fuel: first(sp.fuel) ?? null,
    steering: first(sp.steering) ?? null,
    transmission: first(sp.transmission) ?? null,
    minPrice: dec(first(sp.min_price)),
    maxPrice: dec(first(sp.max_price)),
    minYear: num(first(sp.min_year)),
    maxYear: num(first(sp.max_year)),
    minMileage: num(first(sp.min_mileage)),
    maxMileage: num(first(sp.max_mileage)),
    color: first(sp.color) ?? null,
    drive: first(sp.drive) ?? null,
    vehicleCondition:
      first(sp.condition) === "brand_new"
        ? "brand_new"
        : first(sp.condition) === "used"
          ? "used"
          : null,
    clearanceOnly: first(sp.clearance) === "1",
    newArrival: first(sp.new) === "1",
    features,
    sort: first(sp.sort) ?? null,
    page: num(first(sp.page)) ?? 1,
  };
}
