"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const auth_repository_1 = require("./auth.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}
function stripPassword(user) {
    const { password, ...rest } = user;
    return rest;
}
exports.authService = {
    async register(input) {
        const existing = await auth_repository_1.authRepository.findUserByEmail(input.email);
        if (existing)
            throw api_error_1.ApiError.conflict("Email already registered");
        const role = await auth_repository_1.authRepository.findRoleByName("USER");
        if (!role)
            throw api_error_1.ApiError.internal("Default role not found");
        const hashed = await bcrypt_1.default.hash(input.password, 10);
        let user;
        try {
            user = await auth_repository_1.authRepository.createUser({
                name: input.name,
                email: input.email,
                password: hashed,
                phone: input.phone,
                role_id: role.id,
            });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw api_error_1.ApiError.conflict("Email already registered");
            }
            throw err;
        }
        const token = signToken({ userId: user.id, role: user.roles.name });
        return { user: stripPassword(user), token };
    },
    async login(input) {
        const user = await auth_repository_1.authRepository.findUserByEmail(input.email);
        if (!user)
            throw api_error_1.ApiError.unauthorized("Invalid credentials");
        const valid = await bcrypt_1.default.compare(input.password, user.password);
        if (!valid)
            throw api_error_1.ApiError.unauthorized("Invalid credentials");
        const token = signToken({ userId: user.id, role: user.roles.name });
        return { user: stripPassword(user), token };
    },
    async me(userId) {
        const user = await auth_repository_1.authRepository.findUserById(userId);
        if (!user)
            throw api_error_1.ApiError.notFound("User not found");
        return stripPassword(user);
    },
    async registerOrganizer(userId, input) {
        const user = await auth_repository_1.authRepository.findUserById(userId);
        if (!user)
            throw api_error_1.ApiError.notFound("User not found");
        const existing = await prisma_1.default.organizers.findUnique({ where: { user_id: userId } });
        if (existing)
            throw api_error_1.ApiError.conflict("Already registered as organizer");
        const orgRole = await auth_repository_1.authRepository.findRoleByName("ORGANIZER");
        if (!orgRole)
            throw api_error_1.ApiError.internal("Organizer role not found");
        const [organizer] = await prisma_1.default.$transaction([
            prisma_1.default.organizers.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    user_id: userId,
                    org_name: input.orgName,
                    description: input.description,
                    website: input.website,
                    is_approved: false
                },
            }),
            prisma_1.default.users.update({ where: { id: userId }, data: { role_id: orgRole.id } }),
        ]);
        return organizer;
    },
};
//# sourceMappingURL=auth.service.js.map