import { z } from "zod";
export declare const becomeOrganizerSchema: z.ZodObject<{
    orgName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateOrganizerSchema: z.ZodObject<{
    orgName: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const uploadLogoSchema: z.ZodObject<{
    logo: z.ZodString;
}, z.core.$strip>;
export declare const approvalSchema: z.ZodObject<{
    isApproved: z.ZodBoolean;
}, z.core.$strip>;
export type BecomeOrganizerInput = z.infer<typeof becomeOrganizerSchema>;
export type UpdateOrganizerInput = z.infer<typeof updateOrganizerSchema>;
export type UploadLogoInput = z.infer<typeof uploadLogoSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
//# sourceMappingURL=organizer.schema.d.ts.map