import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const registerOrganizerSchema: z.ZodObject<{
    orgName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterOrganizerInput = z.infer<typeof registerOrganizerSchema>;
//# sourceMappingURL=auth.schema.d.ts.map