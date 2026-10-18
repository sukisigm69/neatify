"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketIdParamSchema = exports.scanTicketSchema = void 0;
const zod_1 = require("zod");
exports.scanTicketSchema = zod_1.z.object({
    qrCode: zod_1.z.string().uuid(),
    location: zod_1.z.string().optional(),
});
exports.ticketIdParamSchema = zod_1.z.object({
    ticketId: zod_1.z.string().uuid(),
});
//# sourceMappingURL=ticket.schema.js.map