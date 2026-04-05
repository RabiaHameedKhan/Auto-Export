import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const makes = pgTable("makes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  makeId: integer("make_id")
    .notNull()
    .references(() => makes.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
});

export const bodyTypes = pgTable("body_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  stockNumber: varchar("stock_number", { length: 50 }).unique(),
  makeId: integer("make_id").references(() => makes.id),
  modelId: integer("model_id").references(() => models.id),
  bodyTypeId: integer("body_type_id").references(() => bodyTypes.id),
  title: varchar("title", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  month: integer("month"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  mileage: integer("mileage"),
  fuelType: varchar("fuel_type", { length: 50 }),
  transmission: varchar("transmission", { length: 50 }),
  steering: varchar("steering", { length: 20 }),
  engineCc: integer("engine_cc"),
  color: varchar("color", { length: 50 }),
  driveType: varchar("drive_type", { length: 10 }),
  vehicleCondition: varchar("condition", { length: 20 }).default("used"),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  isClearance: boolean("is_clearance").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const vehicleImages = pgTable("vehicle_images", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0),
  isPrimary: boolean("is_primary").default(false),
});

export const vehicleFeatures = pgTable("vehicle_features", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  feature: varchar("feature", { length: 100 }).notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  destinationPort: varchar("destination_port", { length: 100 }),
  message: text("message"),
  status: varchar("status", { length: 30 }).default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  scheduledFrom: timestamp("scheduled_from", { withTimezone: true }),
  scheduledUntil: timestamp("scheduled_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }),
  role: varchar("role", { length: 30 }).default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const makesRelations = relations(makes, ({ many }) => ({
  models: many(models),
  vehicles: many(vehicles),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  make: one(makes, { fields: [models.makeId], references: [makes.id] }),
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  make: one(makes, { fields: [vehicles.makeId], references: [makes.id] }),
  model: one(models, { fields: [vehicles.modelId], references: [models.id] }),
  bodyType: one(bodyTypes, {
    fields: [vehicles.bodyTypeId],
    references: [bodyTypes.id],
  }),
  images: many(vehicleImages),
  features: many(vehicleFeatures),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));
