import { z } from "zod";

const ticketCategoryInputSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  quota: z.number().int().positive(),
  saleStart: z.string().datetime().optional(),
  saleEnd: z.string().datetime().optional(),
});

export const createEventSchema = z.object({
  venueId: z.string().min(1),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  banner: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  artistIds: z.array(z.string().min(1)).optional(),
  ticketCategories: z.array(ticketCategoryInputSchema).optional(),
});

export const updateEventSchema = createEventSchema.omit({ ticketCategories: true }).partial();

export const uploadBannerSchema = z.object({
  banner: z.string().url(),
});

export const uploadGallerySchema = z.object({
  images: z.array(z.string().url()).min(1),
});

export const assignVenueSchema = z.object({
  venueId: z.string().min(1),
});

export const assignArtistsSchema = z.object({
  artistIds: z.array(z.string().min(1)),
});

export const updateEventStatusSchema = z.object({
  status: z.enum(["PUBLISHED", "CANCELLED"]),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type TicketCategoryInput = z.infer<typeof ticketCategoryInputSchema>;
