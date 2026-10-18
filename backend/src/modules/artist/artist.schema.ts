import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(2).max(100),
  genre: z.string().max(50).optional(),
  bio: z.string().optional(),
  image: z.string().url().optional(),
});

export const updateArtistSchema = createArtistSchema.partial();

export const uploadArtistImageSchema = z.object({
  image: z.string().url(),
});

export type CreateArtistInput = z.infer<typeof createArtistSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
export type UploadArtistImageInput = z.infer<typeof uploadArtistImageSchema>;
