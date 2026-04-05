import type { InferSelectModel } from "drizzle-orm";
import type {
  vehicles,
  makes,
  models,
  bodyTypes,
  vehicleImages,
  inquiries,
} from "@/lib/db/schema";

export type Vehicle = InferSelectModel<typeof vehicles>;
export type Make = InferSelectModel<typeof makes>;
export type Model = InferSelectModel<typeof models>;
export type BodyType = InferSelectModel<typeof bodyTypes>;
export type VehicleImage = InferSelectModel<typeof vehicleImages>;
export type Inquiry = InferSelectModel<typeof inquiries>;

export type VehicleListItem = Vehicle & {
  makeName: string | null;
  modelName: string | null;
  bodyTypeName: string | null;
  thumbnail: string | null;
};

export type VehicleDetail = VehicleListItem & {
  images: { id: number; url: string; sortOrder: number | null; isPrimary: boolean | null }[];
  features: string[];
};
