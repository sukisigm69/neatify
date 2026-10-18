export declare const dashboardService: {
    getStatistics(): Promise<{
        totalUsers: number;
        totalOrganizers: number;
        totalEvents: number;
        totalTicketsSold: number;
        revenue: number | import("@prisma/client-runtime-utils").Decimal;
        pendingApproval: number;
        pendingPayments: number;
    }>;
    getMonthlySales(year: number): Promise<{
        month: number;
        totalSales: number;
        totalTransactions: number;
    }[]>;
    getPopularEvents(limit: number): Promise<{
        id: string;
        title: string;
        slug: string;
        banner: string | null;
        status: import(".prisma/client").$Enums.events_status;
        startDate: Date;
        venue: {
            city: string;
            name: string;
        };
        totalSold: number;
        totalQuota: number;
    }[]>;
};
//# sourceMappingURL=dashboard.service.d.ts.map