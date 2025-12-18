import { z } from "zod";

// Create organization validation
export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.string().min(1, "Type is required"),
  logo: z.string().optional(),
  account_number: z.string().min(1, "Account number is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  bank_code: z.string().optional(),
});

export type CreateOrganizationPayload = z.infer<
  typeof createOrganizationSchema
>;
