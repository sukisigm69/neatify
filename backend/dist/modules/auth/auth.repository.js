"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
exports.authRepository = {
    findUserByEmail(email) {
        return prisma_1.default.users.findFirst({
            where: { email, deleted_at: null },
            include: { roles: true },
        });
    },
    findRoleByName(name) {
        return prisma_1.default.roles.findUnique({ where: { name } });
    },
    createUser(data) {
        return prisma_1.default.users.create({
            data: {
                id: (0, uuid_1.v4)(),
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role_id: data.role_id,
            },
            include: { roles: true },
        });
    },
    findUserById(id) {
        return prisma_1.default.users.findFirst({
            where: { id, deleted_at: null },
            include: { roles: true },
        });
    },
};
//# sourceMappingURL=auth.repository.js.map