"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFavoriteSchema = void 0;
const zod_1 = require("zod");
exports.createFavoriteSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(1),
});
//# sourceMappingURL=favorites.schema.js.map