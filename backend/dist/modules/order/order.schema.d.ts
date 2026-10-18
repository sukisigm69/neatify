import { z } from "zod";
export declare const checkoutSchema: z.ZodObject<{
    eventId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        ticketCategoryId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const orderIdParamSchema: z.ZodObject<{
    orderId: z.ZodString;
}, z.core.$strip>;
export declare const orderQuerySchema: z.ZodObject<{
    page: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodOptional<z.ZodEnum<{
        newest: "newest";
        oldest: "oldest";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        CONFIRMED: "CONFIRMED";
        EXPIRED: "EXPIRED";
        PENDING: "PENDING";
        REFUNDED: "REFUNDED";
    }>>;
}, z.core.$strip>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
//# sourceMappingURL=order.schema.d.ts.map