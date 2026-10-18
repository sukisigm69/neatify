import { z } from "zod";
declare const ticketCategoryInputSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    quota: z.ZodNumber;
    saleStart: z.ZodOptional<z.ZodString>;
    saleEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createEventSchema: z.ZodObject<{
    venueId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    banner: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    artistIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    ticketCategories: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        price: z.ZodNumber;
        quota: z.ZodNumber;
        saleStart: z.ZodOptional<z.ZodString>;
        saleEnd: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateEventSchema: z.ZodObject<{
    venueId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    banner: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    artistIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const uploadBannerSchema: z.ZodObject<{
    banner: z.ZodString;
}, z.core.$strip>;
export declare const uploadGallerySchema: z.ZodObject<{
    images: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const assignVenueSchema: z.ZodObject<{
    venueId: z.ZodString;
}, z.core.$strip>;
export declare const assignArtistsSchema: z.ZodObject<{
    artistIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const updateEventStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        PUBLISHED: "PUBLISHED";
    }>;
}, z.core.$strip>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type TicketCategoryInput = z.infer<typeof ticketCategoryInputSchema>;
export {};
//# sourceMappingURL=event.schema.d.ts.map