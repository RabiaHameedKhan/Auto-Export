"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

type Option = {
  id: number;
  name: string;
  makeId?: number;
};

export type VehicleCreateState = {
  error?: string;
};

const initialState: VehicleCreateState = {};

type UploadedImage = {
  url: string;
  pathname?: string;
  originalName?: string;
  size?: number;
  isPrimary?: boolean;
};

export type VehicleFormInitialValues = {
  stockNumber?: string | null;
  title?: string;
  makeId?: number | null;
  modelId?: number | null;
  bodyTypeId?: number | null;
  year?: number | null;
  month?: number | null;
  price?: string | number | null;
  mileage?: number | null;
  fuelType?: string | null;
  transmission?: string | null;
  steering?: string | null;
  engineCc?: number | null;
  color?: string | null;
  driveType?: string | null;
  vehicleCondition?: "used" | "brand_new" | null;
  description?: string | null;
  featuresText?: string;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  isClearance?: boolean | null;
  images?: UploadedImage[];
};

function SubmitButton({ blocked, mode }: { blocked: boolean; mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || blocked}
      className="rounded-lg bg-[#0c47a5] px-5 py-3 font-semibold text-white hover:bg-[#0a3d91] disabled:opacity-60"
    >
      {pending ? "Saving..." : blocked ? "Select at least one image" : mode === "edit" ? "Update vehicle" : "Create vehicle"}
    </button>
  );
}

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VehicleCreateForm({
  action,
  makes,
  models,
  bodyTypes,
  initialValues,
  mode = "create",
}: {
  action: (state: VehicleCreateState, formData: FormData) => Promise<VehicleCreateState>;
  makes: Option[];
  models: Option[];
  bodyTypes: Option[];
  initialValues?: VehicleFormInitialValues;
  mode?: "create" | "edit";
}) {
  const initialMakeId = String(initialValues?.makeId ?? makes[0]?.id ?? "");
  const initialModelId = String(
    initialValues?.modelId ??
      models.find((model) => model.makeId === Number(initialMakeId))?.id ??
      ""
  );
  const [state, formAction] = useFormState(action, initialState);
  const [selectedMakeId, setSelectedMakeId] = useState<string>(initialMakeId);
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialValues?.images ?? []);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(() => {
    const foundIndex = (initialValues?.images ?? []).findIndex((image) => image.isPrimary);
    return foundIndex >= 0 ? foundIndex : 0;
  });
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    const makeId = Number(selectedMakeId);
    if (!makeId) return [] as Option[];
    return models.filter((model) => model.makeId === makeId);
  }, [models, selectedMakeId]);

  useEffect(() => {
    if (filteredModels.length === 0) {
      setSelectedModelId("");
      return;
    }

    const found = filteredModels.some((model) => String(model.id) === selectedModelId);
    if (!found) {
      setSelectedModelId(String(filteredModels[0].id));
    }
  }, [filteredModels, selectedModelId]);

  useEffect(() => {
    if (uploadedImages.length === 0) {
      setPrimaryImageIndex(0);
      return;
    }

    if (primaryImageIndex > uploadedImages.length - 1) {
      setPrimaryImageIndex(0);
    }
  }, [primaryImageIndex, uploadedImages.length]);

  const primaryImageUrl = uploadedImages[primaryImageIndex]?.url ?? "";
  const additionalImageUrls = uploadedImages
    .filter((_, index) => index !== primaryImageIndex)
    .map((image) => image.url)
    .join("\n");
  const uploadedImageCount = uploadedImages.length;
  const uploadSummary =
    uploadedImageCount === 0
      ? "No Cloudinary images attached yet."
      : `${uploadedImageCount} image${uploadedImageCount === 1 ? "" : "s"} ready. The selected primary image and the rest will be saved to the database when you ${mode === "edit" ? "update" : "create"} the vehicle.`;

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      const response = await fetch("/api/admin/uploads/vehicle-images", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? ((await response.json()) as { files?: UploadedImage[]; error?: string } | undefined)
        : undefined;

      if (!response.ok || !result?.files) {
        throw new Error(
          result?.error ||
            (response.status === 401
              ? "Your admin session expired. Sign in again and retry the upload."
              : "Image upload failed.")
        );
      }

      setUploadedImages((current) => [...current, ...result.files!]);
      event.target.value = "";
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImages(false);
    }
  }

  function removeUploadedImage(indexToRemove: number) {
    setUploadedImages((current) => current.filter((_, index) => index !== indexToRemove));
  }

  return (
    <form action={formAction} className="mt-8 space-y-8">
      <input type="hidden" name="primaryImageUrl" value={primaryImageUrl} />
      <input type="hidden" name="additionalImageUrls" value={additionalImageUrls} />

      {state.error || uploadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error ?? uploadError}
        </div>
      ) : null}

      <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">Basic details</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-[#374151]">
            Stock number
            <input
              name="stockNumber"
              defaultValue={initialValues?.stockNumber ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151] md:col-span-2 xl:col-span-2">
            Title *
            <input
              name="title"
              required
              defaultValue={initialValues?.title ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Make *
            <select
              name="makeId"
              value={selectedMakeId}
              onChange={(e) => setSelectedMakeId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            >
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Model *
            <select
              name="modelId"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            >
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Body type *
            <select
              name="bodyTypeId"
              defaultValue={String(initialValues?.bodyTypeId ?? bodyTypes[0]?.id ?? "")}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            >
              {bodyTypes.map((bodyType) => (
                <option key={bodyType.id} value={bodyType.id}>
                  {bodyType.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Year *
            <input
              name="year"
              type="number"
              min="1990"
              max="2035"
              required
              defaultValue={initialValues?.year ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Month
            <input
              name="month"
              type="number"
              min="1"
              max="12"
              defaultValue={initialValues?.month ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Price (USD) *
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={initialValues?.price ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Mileage (km)
            <input
              name="mileage"
              type="number"
              min="0"
              defaultValue={initialValues?.mileage ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Condition
            <select
              name="vehicleCondition"
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
              defaultValue={initialValues?.vehicleCondition ?? "used"}
            >
              <option value="used">Used</option>
              <option value="brand_new">Brand new</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">Specifications</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-[#374151]">
            Fuel type
            <input
              name="fuelType"
              defaultValue={initialValues?.fuelType ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Transmission
            <input
              name="transmission"
              defaultValue={initialValues?.transmission ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Steering
            <input
              name="steering"
              defaultValue={initialValues?.steering ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Engine CC
            <input
              name="engineCc"
              type="number"
              min="0"
              defaultValue={initialValues?.engineCc ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Color
            <input
              name="color"
              defaultValue={initialValues?.color ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Drive type
            <input
              name="driveType"
              defaultValue={initialValues?.driveType ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">Media and features</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="text-sm font-medium text-[#374151]">
            Upload vehicle images *
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
            />
            <span className="mt-2 block text-xs text-[#6b7280]">
              Upload one or more images. You can keep existing images, remove any image, or upload
              replacements. One image must remain selected as primary before saving.
            </span>
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Uploaded images
            <div className="mt-1 rounded-lg border border-[#dbe3f2] p-3">
              {isUploadingImages ? (
                <p className="text-sm text-[#0c47a5]">Uploading images...</p>
              ) : uploadedImages.length > 0 ? (
                <div className="space-y-3">
                  {uploadedImages.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="flex items-start justify-between gap-3 rounded-lg border border-[#e5e7eb] px-3 py-2"
                    >
                      <label className="flex min-w-0 flex-1 items-start gap-3 text-sm text-[#374151]">
                        <input
                          type="radio"
                          name="primaryImageSelection"
                          checked={primaryImageIndex === index}
                          className="mt-1"
                          onChange={() => setPrimaryImageIndex(index)}
                        />
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-[#dbe3f2] bg-[#f8fafc]">
                          <Image
                            src={image.url}
                            alt={image.originalName || `Uploaded image ${index + 1}`}
                            fill
                            className="h-full w-full object-cover"
                            sizes="80px"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {image.originalName || `Image ${index + 1}`}
                            {primaryImageIndex === index ? " (primary)" : ""}
                          </span>
                          <span className="mt-1 block text-xs text-[#6b7280]">
                            Stored in Cloudinary as `{image.pathname || "vehicle image"}`
                          </span>
                          <span className="block truncate text-xs text-[#0c47a5]">{image.url}</span>
                          <span className="block text-xs text-[#6b7280]">{formatBytes(image.size)}</span>
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="shrink-0 text-sm font-semibold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6b7280]">No images uploaded yet.</p>
              )}
            </div>
            <span className="mt-2 block text-xs text-[#6b7280]">{uploadSummary}</span>
            {primaryImageUrl ? (
              <span className="mt-1 block text-xs text-[#0c47a5]">
                Primary DB image URL: {primaryImageUrl}
              </span>
            ) : null}
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Features
            <textarea
              name="featuresText"
              rows={6}
              defaultValue={initialValues?.featuresText ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
              placeholder="One feature per line"
            />
          </label>
          <label className="text-sm font-medium text-[#374151]">
            Description
            <textarea
              name="description"
              rows={6}
              defaultValue={initialValues?.description ?? ""}
              className="mt-1 w-full rounded-lg border border-[#dbe3f2] px-3 py-2.5"
              placeholder="Vehicle description or HTML"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">Visibility</h2>
        <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium text-[#374151]">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initialValues?.isActive ?? true}
              className="h-4 w-4 rounded border-[#c7d6ef]"
            />
            Active on website
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={initialValues?.isFeatured ?? false}
              className="h-4 w-4 rounded border-[#c7d6ef]"
            />
            Featured vehicle
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="isClearance"
              defaultChecked={initialValues?.isClearance ?? false}
              className="h-4 w-4 rounded border-[#c7d6ef]"
            />
            Clearance listing
          </label>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <a href="/admin/vehicles" className="text-sm font-semibold text-[#0c47a5] hover:underline">
          Back to vehicles
        </a>
        <SubmitButton blocked={isUploadingImages || uploadedImages.length === 0} mode={mode} />
      </div>
    </form>
  );
}
