import { and, asc, desc, eq, gte, lte, sql, exists, ne, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  vehicles,
  makes,
  models,
  bodyTypes,
  vehicleImages,
  vehicleFeatures,
} from "@/lib/db/schema";
import type { VehicleListItem } from "@/types";

export type VehicleSearchParams = {
  excludeId?: number | null;
  stockNumber?: string | null;
  makeId?: number | null;
  modelId?: number | null;
  bodyTypeId?: number | null;
  fuel?: string | null;
  steering?: string | null;
  transmission?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minYear?: number | null;
  maxYear?: number | null;
  minMileage?: number | null;
  maxMileage?: number | null;
  color?: string | null;
  drive?: string | null;
  vehicleCondition?: "used" | "brand_new" | null;
  clearanceOnly?: boolean;
  newArrival?: boolean;
  features?: string[];
  sort?: string | null;
  page?: number;
  perPage?: number;
};

const thumb = sql<string | null>`(
  SELECT url FROM ${vehicleImages}
  WHERE ${vehicleImages.vehicleId} = ${vehicles.id} AND ${vehicleImages.isPrimary} = true
  LIMIT 1
)`;

const thumbFallback = sql<string | null>`(
  SELECT url FROM ${vehicleImages}
  WHERE ${vehicleImages.vehicleId} = ${vehicles.id}
  ORDER BY ${vehicleImages.sortOrder}, ${vehicleImages.id}
  LIMIT 1
)`;

function orderByClause(sort: string | null | undefined) {
  switch (sort) {
    case "price_asc":
      return asc(vehicles.price);
    case "price_desc":
      return desc(vehicles.price);
    case "year_asc":
      return asc(vehicles.year);
    case "year_desc":
      return desc(vehicles.year);
    case "mileage_asc":
      return asc(vehicles.mileage);
    case "mileage_desc":
      return desc(vehicles.mileage);
    case "created_desc":
      return desc(vehicles.createdAt);
    default:
      return desc(vehicles.createdAt);
  }
}

function buildVehicleConditions(params: VehicleSearchParams) {
  const conditions = [eq(vehicles.isActive, true)];

  if (params.excludeId != null) conditions.push(ne(vehicles.id, params.excludeId));
  if (params.stockNumber?.trim()) {
    conditions.push(ilike(vehicles.stockNumber, `%${params.stockNumber.trim()}%`));
  }
  if (params.makeId != null) conditions.push(eq(vehicles.makeId, params.makeId));
  if (params.modelId != null) conditions.push(eq(vehicles.modelId, params.modelId));
  if (params.bodyTypeId != null) conditions.push(eq(vehicles.bodyTypeId, params.bodyTypeId));
  if (params.fuel) conditions.push(eq(vehicles.fuelType, params.fuel));
  if (params.steering) conditions.push(eq(vehicles.steering, params.steering));
  if (params.transmission) conditions.push(eq(vehicles.transmission, params.transmission));
  if (params.minPrice != null) conditions.push(gte(vehicles.price, String(params.minPrice)));
  if (params.maxPrice != null) conditions.push(lte(vehicles.price, String(params.maxPrice)));
  if (params.minYear != null) conditions.push(gte(vehicles.year, params.minYear));
  if (params.maxYear != null) conditions.push(lte(vehicles.year, params.maxYear));
  if (params.minMileage != null) conditions.push(gte(vehicles.mileage, params.minMileage));
  if (params.maxMileage != null) conditions.push(lte(vehicles.mileage, params.maxMileage));
  if (params.color) conditions.push(eq(vehicles.color, params.color));
  if (params.drive) conditions.push(eq(vehicles.driveType, params.drive));
  if (params.vehicleCondition) conditions.push(eq(vehicles.vehicleCondition, params.vehicleCondition));
  if (params.clearanceOnly) conditions.push(eq(vehicles.isClearance, true));

  if (params.newArrival) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 14);
    conditions.push(gte(vehicles.createdAt, weekAgo));
  }

  if (params.features?.length && db) {
    for (const f of params.features) {
      if (!f.trim()) continue;
      conditions.push(
        exists(
          db
            .select({ id: vehicleFeatures.id })
            .from(vehicleFeatures)
            .where(
              and(
                eq(vehicleFeatures.vehicleId, vehicles.id),
                eq(vehicleFeatures.feature, f.trim())
              )
            )
        )
      );
    }
  }

  return conditions;
}

function listingSelect() {
  return {
    id: vehicles.id,
    stockNumber: vehicles.stockNumber,
    location: vehicles.location,
    makeId: vehicles.makeId,
    modelId: vehicles.modelId,
    bodyTypeId: vehicles.bodyTypeId,
    title: vehicles.title,
    year: vehicles.year,
    month: vehicles.month,
    manufactureYear: vehicles.manufactureYear,
    manufactureMonth: vehicles.manufactureMonth,
    price: vehicles.price,
    mileage: vehicles.mileage,
    doors: vehicles.doors,
    fuelType: vehicles.fuelType,
    transmission: vehicles.transmission,
    steering: vehicles.steering,
    engineCc: vehicles.engineCc,
    weight: vehicles.weight,
    modelCode: vehicles.modelCode,
    versionClass: vehicles.versionClass,
    engineCode: vehicles.engineCode,
    chassisNo: vehicles.chassisNo,
    dimension: vehicles.dimension,
    color: vehicles.color,
    driveType: vehicles.driveType,
    vehicleCondition: vehicles.vehicleCondition,
    description: vehicles.description,
    isFeatured: vehicles.isFeatured,
    isActive: vehicles.isActive,
    isClearance: vehicles.isClearance,
    createdAt: vehicles.createdAt,
    updatedAt: vehicles.updatedAt,
    makeName: makes.name,
    modelName: models.name,
    bodyTypeName: bodyTypes.name,
    thumbnail: sql<string | null>`coalesce(${thumb}, ${thumbFallback})`,
  };
}

async function listVehiclesWithExtraConditions(
  params: VehicleSearchParams,
  extraConditions: ReturnType<typeof buildVehicleConditions> = [],
  limit = 4
) {
  if (!db) return [];

  const rows = await db
    .select(listingSelect())
    .from(vehicles)
    .innerJoin(makes, eq(vehicles.makeId, makes.id))
    .innerJoin(models, eq(vehicles.modelId, models.id))
    .leftJoin(bodyTypes, eq(vehicles.bodyTypeId, bodyTypes.id))
    .where(and(...buildVehicleConditions(params), ...extraConditions))
    .orderBy(desc(vehicles.createdAt))
    .limit(limit);

  return rows as unknown as VehicleListItem[];
}

export type SidebarFacetItem = {
  id: number | string;
  label: string;
  count: number;
  slug?: string | null;
  imageUrl?: string | null;
};

export type VehicleSidebarData = {
  makes: SidebarFacetItem[];
  bodyTypes: SidebarFacetItem[];
  fuelTypes: SidebarFacetItem[];
  transmissions: SidebarFacetItem[];
  steering: SidebarFacetItem[];
  stats: {
    total: number;
    featured: number;
    clearance: number;
    newArrival: number;
  };
  featuredVehicles: VehicleListItem[];
  latestVehicles: VehicleListItem[];
  clearanceVehicles: VehicleListItem[];
};

async function countVehicles(
  params: VehicleSearchParams,
  extraConditions: ReturnType<typeof buildVehicleConditions> = []
) {
  if (!db) return 0;
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .where(and(...buildVehicleConditions(params), ...extraConditions));
  return row?.n ?? 0;
}

export async function getVehicleSidebarData(
  facetScope: VehicleSearchParams,
  contentScope: VehicleSearchParams
): Promise<VehicleSidebarData> {
  if (!db) {
    return {
      makes: [],
      bodyTypes: [],
      fuelTypes: [],
      transmissions: [],
      steering: [],
      stats: { total: 0, featured: 0, clearance: 0, newArrival: 0 },
      featuredVehicles: [],
      latestVehicles: [],
      clearanceVehicles: [],
    };
  }

  const makeRows = await db
    .select({
      id: makes.id,
      label: makes.name,
      slug: makes.slug,
      imageUrl: makes.logoUrl,
      count: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .innerJoin(makes, eq(vehicles.makeId, makes.id))
    .where(and(...buildVehicleConditions({ ...facetScope, makeId: undefined, modelId: undefined })))
    .groupBy(makes.id, makes.name, makes.slug, makes.logoUrl)
    .orderBy(desc(sql<number>`count(*)::int`), asc(makes.name))
    .limit(8);

  const bodyTypeRows = await db
    .select({
      id: bodyTypes.id,
      label: bodyTypes.name,
      slug: bodyTypes.slug,
      count: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .innerJoin(bodyTypes, eq(vehicles.bodyTypeId, bodyTypes.id))
    .where(and(...buildVehicleConditions({ ...facetScope, bodyTypeId: undefined })))
    .groupBy(bodyTypes.id, bodyTypes.name, bodyTypes.slug)
    .orderBy(desc(sql<number>`count(*)::int`), asc(bodyTypes.name))
    .limit(8);

  const fuelRows = await db
    .select({
      id: sql<string>`coalesce(${vehicles.fuelType}, 'Unknown')`,
      label: sql<string>`coalesce(${vehicles.fuelType}, 'Unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(and(...buildVehicleConditions({ ...facetScope, fuel: undefined })))
    .groupBy(vehicles.fuelType)
    .orderBy(desc(sql<number>`count(*)::int`))
    .limit(6);

  const transmissionRows = await db
    .select({
      id: sql<string>`coalesce(${vehicles.transmission}, 'Unknown')`,
      label: sql<string>`coalesce(${vehicles.transmission}, 'Unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(and(...buildVehicleConditions({ ...facetScope, transmission: undefined })))
    .groupBy(vehicles.transmission)
    .orderBy(desc(sql<number>`count(*)::int`))
    .limit(6);

  const steeringRows = await db
    .select({
      id: sql<string>`coalesce(${vehicles.steering}, 'Unknown')`,
      label: sql<string>`coalesce(${vehicles.steering}, 'Unknown')`,
      count: sql<number>`count(*)::int`,
    })
    .from(vehicles)
    .where(and(...buildVehicleConditions({ ...facetScope, steering: undefined })))
    .groupBy(vehicles.steering)
    .orderBy(desc(sql<number>`count(*)::int`))
    .limit(4);

  const [total, featured, clearance, newArrival, featuredVehicles, latestVehicles, clearanceVehicles] =
    await Promise.all([
      countVehicles(contentScope),
      countVehicles(contentScope, [eq(vehicles.isFeatured, true)]),
      countVehicles({ ...contentScope, clearanceOnly: true }),
      countVehicles({ ...contentScope, newArrival: true }),
      listVehiclesWithExtraConditions(contentScope, [eq(vehicles.isFeatured, true)], 4),
      listVehiclesWithExtraConditions(contentScope, [], 4),
      listVehiclesWithExtraConditions(
        { ...contentScope, clearanceOnly: undefined },
        [eq(vehicles.isClearance, true)],
        4
      ),
    ]);

  return {
    makes: makeRows,
    bodyTypes: bodyTypeRows,
    fuelTypes: fuelRows,
    transmissions: transmissionRows,
    steering: steeringRows,
    stats: {
      total,
      featured,
      clearance,
      newArrival,
    },
    featuredVehicles,
    latestVehicles,
    clearanceVehicles,
  };
}

export async function searchVehicles(
  params: VehicleSearchParams
): Promise<{ rows: VehicleListItem[]; total: number }> {
  if (!db) return { rows: [], total: 0 };
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const whereClause = and(...buildVehicleConditions(params));

  const [countRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(vehicles)
    .innerJoin(makes, eq(vehicles.makeId, makes.id))
    .innerJoin(models, eq(vehicles.modelId, models.id))
    .leftJoin(bodyTypes, eq(vehicles.bodyTypeId, bodyTypes.id))
    .where(whereClause);

  const total = countRow?.n ?? 0;

  const rows = await db
    .select(listingSelect())
    .from(vehicles)
    .innerJoin(makes, eq(vehicles.makeId, makes.id))
    .innerJoin(models, eq(vehicles.modelId, models.id))
    .leftJoin(bodyTypes, eq(vehicles.bodyTypeId, bodyTypes.id))
    .where(whereClause)
    .orderBy(orderByClause(params.sort))
    .limit(perPage)
    .offset(offset);

  return {
    rows: rows as unknown as VehicleListItem[],
    total,
  };
}

export async function getVehicleById(id: number) {
  if (!db) return null;
  const [row] = await db
    .select({
      id: vehicles.id,
      stockNumber: vehicles.stockNumber,
      location: vehicles.location,
      makeId: vehicles.makeId,
      modelId: vehicles.modelId,
      bodyTypeId: vehicles.bodyTypeId,
      title: vehicles.title,
      year: vehicles.year,
      month: vehicles.month,
      manufactureYear: vehicles.manufactureYear,
      manufactureMonth: vehicles.manufactureMonth,
      price: vehicles.price,
      mileage: vehicles.mileage,
      doors: vehicles.doors,
      fuelType: vehicles.fuelType,
      transmission: vehicles.transmission,
      steering: vehicles.steering,
      engineCc: vehicles.engineCc,
      weight: vehicles.weight,
      modelCode: vehicles.modelCode,
      versionClass: vehicles.versionClass,
      engineCode: vehicles.engineCode,
      chassisNo: vehicles.chassisNo,
      dimension: vehicles.dimension,
      color: vehicles.color,
      driveType: vehicles.driveType,
      vehicleCondition: vehicles.vehicleCondition,
      description: vehicles.description,
      isFeatured: vehicles.isFeatured,
      isActive: vehicles.isActive,
      isClearance: vehicles.isClearance,
      createdAt: vehicles.createdAt,
      updatedAt: vehicles.updatedAt,
      makeName: makes.name,
      modelName: models.name,
      bodyTypeName: bodyTypes.name,
      thumbnail: sql<string | null>`coalesce(${thumb}, ${thumbFallback})`,
    })
    .from(vehicles)
    .innerJoin(makes, eq(vehicles.makeId, makes.id))
    .innerJoin(models, eq(vehicles.modelId, models.id))
    .leftJoin(bodyTypes, eq(vehicles.bodyTypeId, bodyTypes.id))
    .where(and(eq(vehicles.id, id), eq(vehicles.isActive, true)));

  if (!row) return null;

  const images = await db
    .select({
      id: vehicleImages.id,
      url: vehicleImages.url,
      sortOrder: vehicleImages.sortOrder,
      isPrimary: vehicleImages.isPrimary,
    })
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, id))
    .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id));

  const feats = await db
    .select({ feature: vehicleFeatures.feature })
    .from(vehicleFeatures)
    .where(eq(vehicleFeatures.vehicleId, id));

  return {
    ...row,
    images,
    features: feats.map((f) => f.feature),
  };
}

export async function getRelatedVehicles(
  makeId: number | null,
  bodyTypeId: number | null,
  excludeId: number,
  limit = 6
) {
  const { rows } = await searchVehicles({
    makeId: makeId ?? undefined,
    bodyTypeId:
      makeId != null ? undefined : bodyTypeId ?? undefined,
    excludeId,
    page: 1,
    perPage: limit,
    sort: "created_desc",
  });
  return rows.slice(0, limit);
}
