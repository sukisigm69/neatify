import prisma from "../../lib/prisma";
import { orders_status, payments_status, events_status } from "@prisma/client";

export const adminRepository = {
  async getDashboardStats() {
    const [
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      revenueResult,
      pendingEvents,
      pendingOrders
    ] = await Promise.all([
      prisma.users.count(),
      prisma.organizers.count(),
      prisma.events.count(),
      prisma.ticket_categories.aggregate({ _sum: { sold: true } }),
      prisma.payments.aggregate({
        where: { status: payments_status.PAID },
        _sum: { amount: true }
      }),
      prisma.events.count({ where: { status: events_status.PENDING_APPROVAL } }),
      prisma.orders.count({ where: { status: orders_status.PENDING } })
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
    return prisma.$queryRaw`
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
    return prisma.events.findMany({
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
