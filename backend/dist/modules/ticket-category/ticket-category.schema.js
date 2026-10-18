"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketCategorySchema = exports.createTicketCategorySchema = void 0;
const zod_1 = require("zod");
exports.createTicketCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    price: zod_1.z.number().positive(),
    quota: zod_1.z.number().int().positive(),
});
exports.updateTicketCategorySchema = exports.createTicketCategorySchema.partial();
//# sourceMappingURL=ticket-category.schema.js.map