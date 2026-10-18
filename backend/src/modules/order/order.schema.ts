import { z } from "zod";

export const checkoutSchema = z.object({
  eventId: z.string().uuid(),
  items: z.array(
    z.object({
      ticketCategoryId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export const orderIdParamSchema = z.object({
  orderId: z.string().uuid(),
});

export const orderQuerySchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
  limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
  sortBy: z.enum(["newest", "oldest"]).optional(),
  search: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED", "REFUNDED"]).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
