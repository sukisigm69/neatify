import { z } from "zod";
export declare const createTicketCategorySchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodNumber;
    quota: z.ZodNumber;
}, z.core.$strip>;
export declare const updateTicketCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    quota: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateTicketCategoryInput = z.infer<typeof createTicketCategorySchema>;
export type UpdateTicketCategoryInput = z.infer<typeof updateTicketCategorySchema>;
//# sourceMappingURL=ticket-category.schema.d.ts.map