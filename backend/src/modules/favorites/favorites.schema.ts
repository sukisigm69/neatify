import { z } from "zod";

export const createFavoriteSchema = z.object({
  eventId: z.string().min(1),
});

export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
