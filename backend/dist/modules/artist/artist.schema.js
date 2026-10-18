"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArtistImageSchema = exports.updateArtistSchema = exports.createArtistSchema = void 0;
const zod_1 = require("zod");
exports.createArtistSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    genre: zod_1.z.string().max(50).optional(),
    bio: zod_1.z.string().optional(),
    image: zod_1.z.string().url().optional(),
});
exports.updateArtistSchema = exports.createArtistSchema.partial();
exports.uploadArtistImageSchema = zod_1.z.object({
    image: zod_1.z.string().url(),
});
//# sourceMappingURL=artist.schema.js.map