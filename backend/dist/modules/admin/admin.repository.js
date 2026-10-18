"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
exports.adminRepository = {
    async getDashboardStats() {
        const [totalUsers, totalOrganizers, totalEvents, totalTicketsSold, revenueResult, pendingEvents, pendingOrders] = await Promise.all([
            prisma_1.default.users.count(),
            prisma_1.default.organizers.count(),
            prisma_1.default.events.count(),
            prisma_1.default.ticket_categories.aggregate({ _sum: { sold: true } }),
            prisma_1.default.payments.aggregate({
                where: { status: client_1.payments_status.PAID },
                _sum: { amount: true }
            }),
            prisma_1.default.events.count({ where: { status: client_1.events_status.PENDING_APPROVAL } }),
            prisma_1.default.orders.count({ where: { status: client_1.orders_status.PENDING } })
        ]);
        return {
            totalUsers,
            totalOrganizers,
            totalEvents,
            totalTicketsSold: totalTicketsSold._sum.sold || 0,
            totalRevenue: revenueResult._sum.amount || 0,
            pendingEvents,
            pendingOrders
        };
    },
    async getMonthlySales() {
        return prisma_1.default.$queryRaw `
      SELECT 
        DATE_FORMAT(paid_at, '%Y-%m') as month,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'PAID'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    },
    async getPopularEvents() {
        return prisma_1.default.events.findMany({
            take: 5,
            orderBy: {
                favorites: { _count: 'desc' }
            },
            include: {
                _count: {
                    select: { favorites: true }
                }
            }
        });
    }
};
//# sourceMappingURL=admin.repository.js.map