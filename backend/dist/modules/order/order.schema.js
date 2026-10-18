"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.orderIdParamSchema = exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z.object({
    eventId: zod_1.z.string().uuid(),
    items: zod_1.z.array(zod_1.z.object({
        ticketCategoryId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
    })).min(1),
});
exports.orderIdParamSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.preprocess((val) => (val ? Number(val) : undefined), zod_1.z.number().int().positive().optional()),
    limit: zod_1.z.preprocess((val) => (val ? Number(val) : undefined), zod_1.z.number().int().positive().optional()),
    sortBy: zod_1.z.enum(["newest", "oldest"]).optional(),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED", "REFUNDED"]).optional(),
});
//# sourceMappingURL=order.schema.js.map