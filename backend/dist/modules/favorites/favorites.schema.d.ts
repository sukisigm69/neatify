import { z } from "zod";
export declare const createFavoriteSchema: z.ZodObject<{
    eventId: z.ZodString;
}, z.core.$strip>;
export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;
//# sourceMappingURL=favorites.schema.d.ts.map