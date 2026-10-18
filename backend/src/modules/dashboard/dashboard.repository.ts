import prisma from "../../lib/prisma";

export const dashboardRepository = {
  async getStatistics() {
    const [
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      revenueResult,
      pendingApproval,
      pendingPayments,
    ] = await Promise.all([
      prisma.users.count({ where: { deleted_at: null } }),
      prisma.organizers.count({ where: { deleted_at: null } }),
      prisma.events.count({ where: { deleted_at: null } }),
      prisma.tickets.count({ where: { deleted_at: null, status: "ACTIVE" } }),
      prisma.payments.aggregate({
        _sum: { amount: true },
        where: { status: "PAID", deleted_at: null },
      }),
      prisma.events.count({ where: { status: "PENDING_APPROVAL", deleted_at: null } }),
      prisma.payments.count({ where: { status: "PENDING", deleted_at: null } }),
    ]);

    return {
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      revenue: revenueResult._sum.amount ?? 0,
      pendingApproval,
      pendingPayments,
    };
  },

  async getMonthlySales(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const payments = await prisma.payments.findMany({
      where: {
        status: "PAID",
        paid_at: { gte: startDate, lt: endDate },
        deleted_at: null,
      },
      select: { amount: true, paid_at: true },
    });

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalSales: 0,
      totalTransactions: 0,
    }));

    for (const p of payments) {
      if (!p.paid_at) continue;
      const m = p.paid_at.getMonth();
      monthly[m].totalSales += Number(p.amount);
      monthly[m].totalTransactions += 1;
    }

    return monthly;
  },

  async getPopularEvents(limit = 5) {
    const events = await prisma.events.findMany({
      where: { deleted_at: null },
      include: {
        ticket_categories: {
          where: { deleted_at: null },
          select: { sold: true, quota: true },
        },
        venues: { select: { name: true, city: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return events
      .map((e) => {
        const totalSold = e.ticket_categories.reduce((s, tc) => s + tc.sold, 0);
        const totalQuota = e.ticket_categories.reduce((s, tc) => s + tc.quota, 0);
        return {
          id: e.id,
          title: e.title,
          slug: e.slug,
          banner: e.banner,
          status: e.status,
          startDate: e.start_date,
          venue: e.venues,
          totalSold,
          totalQuota,
        };
      })
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  },
};
