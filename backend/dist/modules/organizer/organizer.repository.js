"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
exports.organizerRepository = {
    findByUserId(userId) {
        return prisma_1.default.organizers.findFirst({
            where: { user_id: userId, deleted_at: null },
            include: { users: { include: { roles: true } } },
        });
    },
    findById(id) {
        return prisma_1.default.organizers.findFirst({
            where: { id, deleted_at: null },
            include: { users: { include: { roles: true } } },
        });
    },
    findRoleByName(name) {
        return prisma_1.default.roles.findUnique({ where: { name } });
    },
    create(userId, data, roleId) {
        return prisma_1.default.$transaction(async (tx) => {
            const organizer = await tx.organizers.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    user_id: userId,
                    org_name: data.orgName,
                    description: data.description,
                    logo: data.logo,
                    website: data.website,
                    is_approved: false,
                },
            });
            await tx.users.update({
                where: { id: userId },
                data: { role_id: roleId },
            });
            return organizer;
        });
    },
    update(id, data) {
        return prisma_1.default.organizers.update({
            where: { id },
            data: {
                org_name: data.orgName,
                description: data.description,
                logo: data.logo,
                website: data.website,
            },
        });
    },
    updateLogo(id, logo) {
        return prisma_1.default.organizers.update({ where: { id }, data: { logo } });
    },
    updateApproval(id, isApproved) {
        return prisma_1.default.organizers.update({ where: { id }, data: { is_approved: isApproved } });
    },
    listPending(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.organizers.findMany({
                where: { is_approved: false, deleted_at: null },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
                include: { users: { select: { id: true, name: true, email: true, phone: true } } },
            }),
            prisma_1.default.organizers.count({ where: { is_approved: false, deleted_at: null } }),
        ]);
    },
    dashboardSummary(organizerId) {
        return Promise.all([
            prisma_1.default.events.count({ where: { organizer_id: organizerId, deleted_at: null } }),
            prisma_1.default.events.count({ where: { organizer_id: organizerId, status: "PUBLISHED", deleted_at: null } }),
            prisma_1.default.ticket_categories.aggregate({
                where: { events: { organizer_id: organizerId }, deleted_at: null },
                _sum: { quota: true, sold: true },
            }),
            prisma_1.default.orders.count({
                where: {
                    order_items: { some: { ticket_categories: { events: { organizer_id: organizerId } } } },
                    deleted_at: null,
                },
            }),
        ]);
    },
};
//# sourceMappingURL=organizer.repository.js.map