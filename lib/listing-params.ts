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

export function buildVehicleSearchQuery(params: VehicleSearchParams): string {
  const sp = new URLSearchParams();

  if (params.makeId != null) sp.set("make_id", String(params.makeId));
  if (params.modelId != null) sp.set("model_id", String(params.modelId));
  if (params.bodyTypeId != null) sp.set("body_type", String(params.bodyTypeId));
  if (params.fuel) sp.set("fuel", params.fuel);
  if (params.steering) sp.set("steering", params.steering);
  if (params.transmission) sp.set("transmission", params.transmission);
  if (params.minPrice != null) sp.set("min_price", String(params.minPrice));
  if (params.maxPrice != null) sp.set("max_price", String(params.maxPrice));
  if (params.minYear != null) sp.set("min_year", String(params.minYear));
  if (params.maxYear != null) sp.set("max_year", String(params.maxYear));
  if (params.minMileage != null) sp.set("min_mileage", String(params.minMileage));
  if (params.maxMileage != null) sp.set("max_mileage", String(params.maxMileage));
  if (params.color) sp.set("color", params.color);
  if (params.drive) sp.set("drive", params.drive);
  if (params.vehicleCondition) sp.set("condition", params.vehicleCondition);
  if (params.clearanceOnly) sp.set("clearance", "1");
  if (params.newArrival) sp.set("new", "1");
  if (params.features?.length) sp.set("features", params.features.join(","));
  if (params.sort) sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));

  return sp.toString();
}

export function buildVehicleSearchHref(
  params: VehicleSearchParams,
  pathname = "/search"
): string {
  const query = buildVehicleSearchQuery(params);
  return query ? `${pathname}?${query}` : pathname;
}
