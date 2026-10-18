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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const registerOrganizerSchema = z.object({
  orgName: z.string().min(2).max(150),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export type RegisterOrganizerInput = z.infer<typeof registerOrganizerSchema>;
