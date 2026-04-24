import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  VehicleCreateForm,
  type VehicleFormInitialValues,
} from "@/components/admin/VehicleCreateForm";
import { updateVehicleAction } from "./actions";
import { db } from "@/lib/db";
import {
  bodyTypes,
  makes,
  models,
  vehicleFeatures,
  vehicleImages,
  vehicles,
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  if (!db) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Edit vehicle</h1>
        <p className="mt-4 max-w-xl text-[#6b7280]">Database is not configured.</p>
        <Link href="/admin/vehicles" className="mt-6 inline-block text-[#0c47a5] hover:underline">
          Back to vehicles
        </Link>
      </div>
    );
  }

  const vehicleId = Number(params.id);
  if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
    notFound();
  }

  const [makeOptions, modelOptions, bodyTypeOptions, vehicleRow, imageRows, featureRows] =
    await Promise.all([
      db.select({ id: makes.id, name: makes.name }).from(makes).orderBy(asc(makes.name)),
      db
        .select({ id: models.id, name: models.name, makeId: models.makeId })
        .from(models)
        .orderBy(asc(models.name)),
      db.select({ id: bodyTypes.id, name: bodyTypes.name }).from(bodyTypes).orderBy(asc(bodyTypes.name)),
      db
        .select({
          id: vehicles.id,
          stockNumber: vehicles.stockNumber,
          location: vehicles.location,
          title: vehicles.title,
          makeId: vehicles.makeId,
          modelId: vehicles.modelId,
          bodyTypeId: vehicles.bodyTypeId,
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
        })
        .from(vehicles)
        .where(eq(vehicles.id, vehicleId))
        .limit(1),
      db
        .select({
          url: vehicleImages.url,
          sortOrder: vehicleImages.sortOrder,
          isPrimary: vehicleImages.isPrimary,
        })
        .from(vehicleImages)
        .where(eq(vehicleImages.vehicleId, vehicleId))
        .orderBy(asc(vehicleImages.sortOrder), asc(vehicleImages.id)),
      db
        .select({ feature: vehicleFeatures.feature })
        .from(vehicleFeatures)
        .where(eq(vehicleFeatures.vehicleId, vehicleId))
        .orderBy(asc(vehicleFeatures.id)),
    ]);

  const vehicle = vehicleRow[0];

  if (!vehicle) {
    notFound();
  }

  if (makeOptions.length === 0 || modelOptions.length === 0 || bodyTypeOptions.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Edit vehicle</h1>
        <p className="mt-4 max-w-2xl text-[#6b7280]">
          Makes, models, and body types must exist before a vehicle can be edited.
        </p>
        <Link href="/admin/vehicles" className="mt-6 inline-block text-[#0c47a5] hover:underline">
          Back to vehicles
        </Link>
      </div>
    );
  }

  const initialValues: VehicleFormInitialValues = {
    stockNumber: vehicle.stockNumber,
    location: vehicle.location,
    title: vehicle.title,
    makeId: vehicle.makeId,
    modelId: vehicle.modelId,
    bodyTypeId: vehicle.bodyTypeId,
    year: vehicle.year,
    month: vehicle.month,
    manufactureYear: vehicle.manufactureYear,
    manufactureMonth: vehicle.manufactureMonth,
    price: vehicle.price,
    mileage: vehicle.mileage,
    doors: vehicle.doors,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    steering: vehicle.steering,
    engineCc: vehicle.engineCc,
    weight: vehicle.weight,
    modelCode: vehicle.modelCode,
    versionClass: vehicle.versionClass,
    engineCode: vehicle.engineCode,
    chassisNo: vehicle.chassisNo,
    dimension: vehicle.dimension,
    color: vehicle.color,
    driveType: vehicle.driveType,
    vehicleCondition:
      vehicle.vehicleCondition === "brand_new" ? "brand_new" : "used",
    description: vehicle.description,
    featuresText: featureRows.map((item) => item.feature).join("\n"),
    isFeatured: vehicle.isFeatured,
    isActive: vehicle.isActive,
    isClearance: vehicle.isClearance,
    images: imageRows.map((image, index) => ({
      url: image.url,
      originalName: `Current image ${index + 1}`,
      pathname: `image-${index + 1}`,
      isPrimary: image.isPrimary ?? false,
    })),
  };

  const boundAction = updateVehicleAction.bind(null, vehicleId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit vehicle #{vehicleId}</h1>
          <p className="mt-2 max-w-3xl text-[#6b7280]">
            Update the vehicle details, remove existing images, upload replacements, and keep one
            image selected as primary before saving.
          </p>
        </div>
        <Link href="/admin/vehicles" className="text-sm font-semibold text-[#0c47a5] hover:underline">
          Back to vehicles
        </Link>
      </div>

      <VehicleCreateForm
        action={boundAction}
        makes={makeOptions}
        models={modelOptions}
        bodyTypes={bodyTypeOptions}
        initialValues={initialValues}
        mode="edit"
      />
    </div>
  );
}
