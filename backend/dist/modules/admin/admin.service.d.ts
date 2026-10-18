export declare const adminService: {
    getDashboard(): Promise<{
        stats: {
            totalUsers: number;
            totalOrganizers: number;
            totalEvents: number;
            totalTicketsSold: number;
            totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
            pendingEvents: number;
            pendingOrders: number;
        };
        sales: unknown;
        popular: ({
            _count: {
                favorites: number;
            };
        } & {
            id: string;
            organizer_id: string;
            venue_id: string;
            title: string;
            slug: string;
            description: string;
            banner: string | null;
            start_date: Date;
            end_date: Date;
            status: import(".prisma/client").$Enums.events_status;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
        })[];
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map