import { z } from "zod";
export declare const createVenueSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    city: z.ZodString;
    province: z.ZodString;
    capacity: z.ZodNumber;
    mapUrl: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateVenueSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    province: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    mapUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;
//# sourceMappingURL=venue.schema.d.ts.map