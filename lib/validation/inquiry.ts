import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const inquiryFields = {
  vehicleId: z.number().int().optional().nullable(),
  name: z.string().trim().min(2, "Enter your name").max(255, "Name is too long"),
  email: z
    .string()
    .trim()
    .max(255, "Email is too long")
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(50, "Phone number is too long")
    .regex(/^[0-9+\-()\s]+$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  country: z.string().trim().min(2, "Enter your country").max(100, "Country is too long"),
  destinationPort: z
    .string()
    .trim()
    .min(2, "Enter destination port")
    .max(100, "Destination port is too long"),
  message: optionalTrimmed(5000),
  address: z.string().trim().min(5, "Enter your address").max(5000, "Address is too long"),
};

const withContactMethod = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.refine((data) => Boolean(data.email || data.phone), {
    message: "Enter your email or phone number",
    path: ["email"],
  });

export const inquirySchemaBase = z.object(inquiryFields);
export const quoteFormSchema = withContactMethod(inquirySchemaBase.omit({ vehicleId: true }));
export const inquirySchema = withContactMethod(inquirySchemaBase);

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type QuoteFormData = z.infer<typeof quoteFormSchema>;
