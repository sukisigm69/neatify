import { z } from "zod";
export declare const createArtistSchema: z.ZodObject<{
    name: z.ZodString;
    genre: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateArtistSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const uploadArtistImageSchema: z.ZodObject<{
    image: z.ZodString;
}, z.core.$strip>;
export type CreateArtistInput = z.infer<typeof createArtistSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
export type UploadArtistImageInput = z.infer<typeof uploadArtistImageSchema>;
//# sourceMappingURL=artist.schema.d.ts.map