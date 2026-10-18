"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrganizerSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
    phone: zod_1.z.string().max(20).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.registerOrganizerSchema = zod_1.z.object({
    orgName: zod_1.z.string().min(2).max(150),
    description: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=auth.schema.js.map