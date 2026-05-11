import { z } from "zod";

export const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number (must start with 6-9 and be 10 digits)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),
    role: z.enum(["farmer", "ward_official", "insurance_agent"], {
      errorMap: () => ({ message: "Role must be farmer, ward_official, or insurance_agent" }),
    }),
    wardNumber: z.string().optional(),
    insuranceCompanyId: z.string().optional(),
    farmerDetails: z
      .object({
        farmSize: z.number().positive("Farm size must be positive"),
        cropTypes: z.array(z.string()).min(1, "At least one crop type is required"),
        location: z.object({
          district: z.string().min(1, "District is required"),
          village: z.string().min(1, "Village is required"),
        }),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.role === "ward_official" && !data.wardNumber) return false;
      if (data.role === "insurance_agent" && !data.insuranceCompanyId) return false;
      if (data.role === "farmer" && !data.farmerDetails) return false;
      return true;
    },
    {
      message: "Role-specific fields are required: wardNumber for ward_official, insuranceCompanyId for insurance_agent, farmerDetails for farmer",
    }
  );

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z
    .string()
    .min(1, "Password is required"),
});
