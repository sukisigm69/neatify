"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalSchema = exports.uploadLogoSchema = exports.updateOrganizerSchema = exports.becomeOrganizerSchema = void 0;
const zod_1 = require("zod");
exports.becomeOrganizerSchema = zod_1.z.object({
    orgName: zod_1.z.string().min(2).max(150),
    description: zod_1.z.string().max(5000).optional(),
    logo: zod_1.z.string().url().optional(),
    website: zod_1.z.string().url().optional(),
});
exports.updateOrganizerSchema = zod_1.z.object({
    orgName: zod_1.z.string().min(2).max(150).optional(),
    description: zod_1.z.string().max(5000).optional(),
    logo: zod_1.z.string().url().optional(),
    website: zod_1.z.string().url().optional(),
});
exports.uploadLogoSchema = zod_1.z.object({
    logo: zod_1.z.string().url(),
});
exports.approvalSchema = zod_1.z.object({
    isApproved: zod_1.z.boolean(),
});
//# sourceMappingURL=organizer.schema.js.map