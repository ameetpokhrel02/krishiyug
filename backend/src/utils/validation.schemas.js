import { z } from "zod";

export const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Invalid phone number (must be 10 digits)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),
    role: z.enum(["farmer", "insurance_company", "admin", "ward_official", "insurance_agent", "insurance_officer", "INSURANCE_OFFICER"], {
      errorMap: () => ({ message: "Role must be farmer, insurance_company, admin, ward_official, insurance_agent, or insurance_officer" }),
    }),
    companyName: z.string().optional(),
    farmerDetails: z
      .object({
        farmType: z.enum(["livestock", "crop"], {
          errorMap: () => ({ message: "Farm type must be livestock or crop" }),
        }),
        farmSize: z.number().positive("Farm size must be positive"),
        cropTypes: z.array(z.string()).min(1, "At least one crop type is required").optional(),
        location: z.object({
          district: z.string().min(1, "District is required"),
          village: z.string().min(1, "Village is required"),
          palika: z.string().optional(),
          ward: z.string().min(1, "Ward is required"),
          lat: z.number().finite({ message: "Latitude is required and must be a number" }),
          lng: z.number().finite({ message: "Longitude is required and must be a number" }),
          region: z.string().optional(),
        }),
        livestockDetails: z
          .object({
            earTags: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.role === "insurance_company" && !data.companyName) return false;
      if (data.role === "farmer" && !data.farmerDetails) return false;
      // If farmer, ensure location coordinates and ward exist
      if (data.role === "farmer" && data.farmerDetails) {
        const loc = data.farmerDetails.location;
        if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number' || !loc.ward) return false;
      }
      return true;
    },
    {
      message: "Role-specific fields are required: companyName for insurance_company, farmerDetails for farmer",
    }
  );

export const loginSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, "Invalid phone number (must be 10 digits)")
      .optional(),
    email: z
      .string()
      .email("Invalid email format")
      .optional(),
    password: z
      .string()
      .min(1, "Password is required"),
  })
  .refine(
    (data) => data.phoneNumber || data.email,
    {
      message: "Either phone number or email is required",
    }
  );

export const adminLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const claimSubmissionSchema = z.object({
  policyId: z.string().min(1, "Policy ID is required"),
  tagNumber: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const claimVerificationSchema = z.object({
  claimId: z.string().min(1, "Claim ID is required"),
  remarks: z.string().optional(),
});

export const claimDecisionSchema = z.object({
  claimId: z.string().min(1, "Claim ID is required"),
  action: z.enum(["approved", "rejected"], {
    errorMap: () => ({ message: "Action must be approved or rejected" }),
  }),
  reason: z.string().optional(),
});

export const policyCreationSchema = z.object({
  name: z.string().min(3, "Policy name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  coverageAmount: z.number().positive("Coverage amount must be positive"),
  premium: z.number().positive("Premium must be positive"),
  policyType: z.enum(["livestock", "crop", "weather"], {
    errorMap: () => ({ message: "Policy type must be livestock, crop, or weather" }),
  }),
  applicableRegions: z.array(z.string()).optional(),
  insuranceCompanyId: z.string().min(1, "Insurance company ID is required"),
  isActive: z.boolean().optional(),
});

