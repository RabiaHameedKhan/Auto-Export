"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
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
  title: z.string().trim().min(3).max(255),
  makeId: z.coerce.number().int().positive(),
  modelId: z.coerce.number().int().positive(),
  bodyTypeId: z.coerce.number().int().positive(),
  year: z.coerce.number().int().min(1990).max(2035),
  month: z.union([z.literal(""), z.coerce.number().int().min(1).max(12)]).optional(),
  price: z.coerce.number().positive(),
  mileage: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional(),
  fuelType: z.string().trim().max(50).optional(),
  transmission: z.string().trim().max(50).optional(),
  steering: z.string().trim().max(20).optional(),
  engineCc: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional(),
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

export async function createVehicleAction(
  _prevState: VehicleCreateState,
  formData: FormData
): Promise<VehicleCreateState> {
  if (!db) {
    return { error: "Database is not configured." };
  }

  const parsed = schema.safeParse({
    stockNumber: getString(formData, "stockNumber"),
    title: getString(formData, "title"),
    makeId: formData.get("makeId"),
    modelId: formData.get("modelId"),
    bodyTypeId: formData.get("bodyTypeId"),
    year: formData.get("year"),
    month: getString(formData, "month"),
    price: formData.get("price"),
    mileage: getString(formData, "mileage"),
    fuelType: getString(formData, "fuelType"),
    transmission: getString(formData, "transmission"),
    steering: getString(formData, "steering"),
    engineCc: getString(formData, "engineCc"),
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
      return { error: "Please upload at least one vehicle image before saving." };
    }
    return { error: "Please complete the required vehicle fields correctly." };
  }

  const data = parsed.data;

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

  const imageUrls = [data.primaryImageUrl, ...splitLines(data.additionalImageUrls ?? "")]
    .filter((url, index, arr) => arr.indexOf(url) === index);
  const features = splitLines(data.featuresText ?? "")
    .filter((feature, index, arr) => arr.indexOf(feature) === index);

  try {
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(vehicles)
        .values({
          stockNumber: data.stockNumber || null,
          makeId: data.makeId,
          modelId: data.modelId,
          bodyTypeId: data.bodyTypeId,
          title: data.title,
          year: data.year,
          month: typeof data.month === "number" ? data.month : null,
          price: data.price.toFixed(2),
          mileage: typeof data.mileage === "number" ? data.mileage : null,
          fuelType: data.fuelType || null,
          transmission: data.transmission || null,
          steering: data.steering || null,
          engineCc: typeof data.engineCc === "number" ? data.engineCc : null,
          color: data.color || null,
          driveType: data.driveType || null,
          vehicleCondition: data.vehicleCondition,
          description: data.description || null,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          isClearance: data.isClearance,
          updatedAt: new Date(),
        })
        .returning({ id: vehicles.id });

      const newVehicleId = inserted[0]?.id;
      if (!newVehicleId) {
        throw new Error("Vehicle could not be created.");
      }

      if (imageUrls.length > 0) {
        await tx.insert(vehicleImages).values(
          imageUrls.map((url, index) => ({
            vehicleId: newVehicleId,
            url,
            sortOrder: index,
            isPrimary: index === 0,
          }))
        );
      }

      if (features.length > 0) {
        await tx.insert(vehicleFeatures).values(
          features.map((feature) => ({
            vehicleId: newVehicleId,
            feature,
          }))
        );
      }

      return newVehicleId;
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return { error: "This stock number already exists. Please use a unique stock number." };
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23503"
    ) {
      return { error: "One of the selected related records no longer exists. Please refresh and try again." };
    }

    const message = error instanceof Error ? error.message : "Vehicle could not be saved.";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin");
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}
