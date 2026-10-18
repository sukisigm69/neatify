"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVenueSchema = exports.createVenueSchema = void 0;
const zod_1 = require("zod");
exports.createVenueSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(150),
    address: zod_1.z.string().min(5),
    city: zod_1.z.string().min(2).max(100),
    province: zod_1.z.string().min(2).max(100),
    capacity: zod_1.z.number().int().positive(),
    mapUrl: zod_1.z.string().url().optional(),
    image: zod_1.z.string().optional(),
});
exports.updateVenueSchema = exports.createVenueSchema.partial();
//# sourceMappingURL=venue.schema.js.map