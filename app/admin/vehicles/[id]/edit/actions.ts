"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  bodyTypes,
  models,
  vehicleFeatures,
  vehicleImages,
  vehicles,
} from "@/lib/db/schema";
import type { VehicleCreateState } from "@/components/admin/VehicleCreateForm";

const schema = z.object({
  stockNumber: z.string().trim().max(50).optional(),
  location: z.string().trim().max(100).optional(),
  title: z.string().trim().min(3).max(255),
  makeId: z.coerce.number().int().positive(),
  modelId: z.coerce.number().int().positive(),
  bodyTypeId: z.coerce.number().int().positive(),
  year: z.coerce.number().int().min(1990).max(2035),
  month: z.union([z.literal(""), z.coerce.number().int().min(1).max(12)]).optional(),
  manufactureYear: z.union([z.literal(""), z.coerce.number().int().min(1900).max(2035)]).optional(),
  manufactureMonth: z.union([z.literal(""), z.coerce.number().int().min(1).max(12)]).optional(),
  price: z.coerce.number().positive(),
  mileage: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional(),
  doors: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional(),
  fuelType: z.string().trim().max(50).optional(),
  transmission: z.string().trim().max(50).optional(),
  steering: z.string().trim().max(20).optional(),
  engineCc: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional(),
  weight: z.string().trim().max(50).optional(),
  modelCode: z.string().trim().max(50).optional(),
  versionClass: z.string().trim().max(100).optional(),
  engineCode: z.string().trim().max(50).optional(),
  chassisNo: z.string().trim().max(100).optional(),
  dimension: z.string().trim().max(100).optional(),
  color: z.string().trim().max(50).optional(),
  driveType: z.string().trim().max(10).optional(),
  vehicleCondition: z.enum(["used", "brand_new"]),
  description: z.string().trim().optional(),
  primaryImageUrl: z.string().trim().url(),
  additionalImageUrls: z.string().optional(),
  featuresText: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isClearance: z.boolean().default(false),
});

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPgError(error: unknown): { code?: string; detail?: string; constraint?: string } {
  if (!error || typeof error !== "object") return {};

  const candidate = error as {
    code?: string;
    detail?: string;
    constraint?: string;
    cause?: unknown;
  };

  if (candidate.code || candidate.detail || candidate.constraint) {
    return {
      code: candidate.code,
      detail: candidate.detail,
      constraint: candidate.constraint,
    };
  }

  if (candidate.cause && typeof candidate.cause === "object") {
    const cause = candidate.cause as {
      code?: string;
      detail?: string;
      constraint?: string;
    };

    return {
      code: cause.code,
      detail: cause.detail,
      constraint: cause.constraint,
    };
  }

  return {};
}

export async function updateVehicleAction(
  vehicleId: number,
  _prevState: VehicleCreateState,
  formData: FormData
): Promise<VehicleCreateState> {
  if (!db) {
    return { error: "Database is not configured." };
  }

  const parsedId = z.number().int().positive().safeParse(vehicleId);
  if (!parsedId.success) {
    return { error: "Vehicle was not found." };
  }

  const parsed = schema.safeParse({
    stockNumber: getString(formData, "stockNumber"),
    location: getString(formData, "location"),
    title: getString(formData, "title"),
    makeId: formData.get("makeId"),
    modelId: formData.get("modelId"),
    bodyTypeId: formData.get("bodyTypeId"),
    year: formData.get("year"),
    month: getString(formData, "month"),
    manufactureYear: getString(formData, "manufactureYear"),
    manufactureMonth: getString(formData, "manufactureMonth"),
    price: formData.get("price"),
    mileage: getString(formData, "mileage"),
    doors: getString(formData, "doors"),
    fuelType: getString(formData, "fuelType"),
    transmission: getString(formData, "transmission"),
    steering: getString(formData, "steering"),
    engineCc: getString(formData, "engineCc"),
    weight: getString(formData, "weight"),
    modelCode: getString(formData, "modelCode"),
    versionClass: getString(formData, "versionClass"),
    engineCode: getString(formData, "engineCode"),
    chassisNo: getString(formData, "chassisNo"),
    dimension: getString(formData, "dimension"),
    color: getString(formData, "color"),
    driveType: getString(formData, "driveType"),
    vehicleCondition: getString(formData, "vehicleCondition") || "used",
    description: getString(formData, "description"),
    primaryImageUrl: getString(formData, "primaryImageUrl"),
    additionalImageUrls: getString(formData, "additionalImageUrls"),
    featuresText: getString(formData, "featuresText"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
    isClearance: formData.get("isClearance") === "on",
  });

  if (!parsed.success) {
    const imageError = parsed.error.issues.some((issue) => issue.path.includes("primaryImageUrl"));
    if (imageError) {
      return { error: "Please keep or upload at least one vehicle image before saving." };
    }
    return { error: "Please complete the required vehicle fields correctly." };
  }

  const data = parsed.data;

  const [existingVehicle] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.id, parsedId.data))
    .limit(1);

  if (!existingVehicle) {
    return { error: "Vehicle was not found." };
  }

  const [modelRow] = await db
    .select({ id: models.id })
    .from(models)
    .where(and(eq(models.id, data.modelId), eq(models.makeId, data.makeId)))
    .limit(1);

  if (!modelRow) {
    return { error: "Selected model does not belong to the chosen make." };
  }

  const [bodyTypeRow] = await db
    .select({ id: bodyTypes.id })
    .from(bodyTypes)
    .where(eq(bodyTypes.id, data.bodyTypeId))
    .limit(1);

  if (!bodyTypeRow) {
    return { error: "Selected body type was not found." };
  }

  if (data.stockNumber) {
    const [existingStock] = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(and(eq(vehicles.stockNumber, data.stockNumber), ne(vehicles.id, parsedId.data)))
      .limit(1);

    if (existingStock) {
      return { error: `Stock number "${data.stockNumber}" already exists. Please use a unique stock number.` };
    }
  }

  const imageUrls = [data.primaryImageUrl, ...splitLines(data.additionalImageUrls ?? "")]
    .filter((url, index, arr) => arr.indexOf(url) === index);
  const features = splitLines(data.featuresText ?? "")
    .filter((feature, index, arr) => arr.indexOf(feature) === index);

  if (imageUrls.length === 0) {
    return { error: "Please keep or upload at least one vehicle image before saving." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(vehicles)
        .set({
          stockNumber: data.stockNumber || null,
          location: data.location || null,
          makeId: data.makeId,
          modelId: data.modelId,
          bodyTypeId: data.bodyTypeId,
          title: data.title,
          year: data.year,
          month: typeof data.month === "number" ? data.month : null,
          manufactureYear: typeof data.manufactureYear === "number" ? data.manufactureYear : null,
          manufactureMonth: typeof data.manufactureMonth === "number" ? data.manufactureMonth : null,
          price: data.price.toFixed(2),
          mileage: typeof data.mileage === "number" ? data.mileage : null,
          doors: typeof data.doors === "number" ? data.doors : null,
          fuelType: data.fuelType || null,
          transmission: data.transmission || null,
          steering: data.steering || null,
          engineCc: typeof data.engineCc === "number" ? data.engineCc : null,
          weight: data.weight || null,
          modelCode: data.modelCode || null,
          versionClass: data.versionClass || null,
          engineCode: data.engineCode || null,
          chassisNo: data.chassisNo || null,
          dimension: data.dimension || null,
          color: data.color || null,
          driveType: data.driveType || null,
          vehicleCondition: data.vehicleCondition,
          description: data.description || null,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          isClearance: data.isClearance,
          updatedAt: new Date(),
        })
        .where(eq(vehicles.id, parsedId.data));

      await tx.delete(vehicleImages).where(eq(vehicleImages.vehicleId, parsedId.data));

      await tx.insert(vehicleImages).values(
        imageUrls.map((url, index) => ({
          vehicleId: parsedId.data,
          url,
          sortOrder: index,
          isPrimary: index === 0,
        }))
      );

      await tx.delete(vehicleFeatures).where(eq(vehicleFeatures.vehicleId, parsedId.data));

      if (features.length > 0) {
        await tx.insert(vehicleFeatures).values(
          features.map((feature) => ({
            vehicleId: parsedId.data,
            feature,
          }))
        );
      }
    });
  } catch (error) {
    const pgError = getPgError(error);

    if (pgError.code === "23505") {
      return {
        error:
          pgError.detail ??
          "This stock number already exists. Please use a unique stock number.",
      };
    }

    if (pgError.code === "23503") {
      return { error: "One of the selected related records no longer exists. Please refresh and try again." };
    }

    const message = error instanceof Error ? error.message : "Vehicle could not be saved.";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/car/${parsedId.data}`);
  revalidatePath("/admin");
  revalidatePath("/admin/vehicles");
  revalidatePath(`/admin/vehicles/${parsedId.data}/edit`);
  redirect("/admin/vehicles");
}
