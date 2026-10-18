import { z } from "zod";

export const createTicketCategorySchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  quota: z.number().int().positive(),
});

export const updateTicketCategorySchema = createTicketCategorySchema.partial();

export type CreateTicketCategoryInput = z.infer<typeof createTicketCategorySchema>;
export type UpdateTicketCategoryInput = z.infer<typeof updateTicketCategorySchema>;
