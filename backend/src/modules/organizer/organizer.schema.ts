import { z } from "zod";

export const becomeOrganizerSchema = z.object({
  orgName: z.string().min(2).max(150),
  description: z.string().max(5000).optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const updateOrganizerSchema = z.object({
  orgName: z.string().min(2).max(150).optional(),
  description: z.string().max(5000).optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const uploadLogoSchema = z.object({
  logo: z.string().url(),
});

export const approvalSchema = z.object({
  isApproved: z.boolean(),
});

export type BecomeOrganizerInput = z.infer<typeof becomeOrganizerSchema>;
export type UpdateOrganizerInput = z.infer<typeof updateOrganizerSchema>;
export type UploadLogoInput = z.infer<typeof uploadLogoSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
