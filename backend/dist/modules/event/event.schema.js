"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventStatusSchema = exports.assignArtistsSchema = exports.assignVenueSchema = exports.uploadGallerySchema = exports.uploadBannerSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const ticketCategoryInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    price: zod_1.z.number().positive(),
    quota: zod_1.z.number().int().positive(),
    saleStart: zod_1.z.string().datetime().optional(),
    saleEnd: zod_1.z.string().datetime().optional(),
});
exports.createEventSchema = zod_1.z.object({
    venueId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10),
    banner: zod_1.z.string().url().optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    artistIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    ticketCategories: zod_1.z.array(ticketCategoryInputSchema).optional(),
});
exports.updateEventSchema = exports.createEventSchema.omit({ ticketCategories: true }).partial();
exports.uploadBannerSchema = zod_1.z.object({
    banner: zod_1.z.string().url(),
});
exports.uploadGallerySchema = zod_1.z.object({
    images: zod_1.z.array(zod_1.z.string().url()).min(1),
});
exports.assignVenueSchema = zod_1.z.object({
    venueId: zod_1.z.string().uuid(),
});
exports.assignArtistsSchema = zod_1.z.object({
    artistIds: zod_1.z.array(zod_1.z.string().uuid()),
});
exports.updateEventStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PUBLISHED", "CANCELLED"]),
});
//# sourceMappingURL=event.schema.js.map