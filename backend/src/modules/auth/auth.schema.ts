import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  phone: z.string().max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((value) => value === "" || /^[0-9+()\s-]{7,20}$/.test(value), "Invalid phone number")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const registerOrganizerSchema = z.object({
  orgName: z.string().min(2).max(150),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export type RegisterOrganizerInput = z.infer<typeof registerOrganizerSchema>;
