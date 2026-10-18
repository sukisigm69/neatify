import { BecomeOrganizerInput, UpdateOrganizerInput } from "./organizer.schema";
export declare const organizerService: {
    becomeOrganizer(userId: string, input: BecomeOrganizerInput): Promise<any>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, input: UpdateOrganizerInput): Promise<any>;
    uploadLogo(userId: string, logo: string): Promise<any>;
    approve(id: string, isApproved: boolean): Promise<any>;
    listPending(page: number, limit: number): Promise<{
        organizers: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    dashboardSummary(userId: string): Promise<{
        organizerId: any;
        isApproved: any;
        totalEvents: any;
        publishedEvents: any;
        totalTicketQuota: any;
        totalTicketsSold: any;
        totalOrders: any;
    }>;
};
//# sourceMappingURL=organizer.service.d.ts.map