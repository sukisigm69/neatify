export declare const ticketService: {
    getById(id: string, userId: string, role: string): Promise<{
        ticketId: any;
        qrCode: any;
        qrImage: any;
        ticketStatus: any;
        attendeeName: any;
        attendeeEmail: any;
        attendeePhone: any;
        orderNumber: any;
        purchaseDate: any;
        event: any;
        venue: any;
        artists: any;
        ticketCategory: any;
        eventBanner: any;
        startDate: any;
        endDate: any;
    }>;
    list(userId: string, role: string, page: number, limit: number): Promise<{
        tickets: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listMyTickets(userId: string, page: number, limit: number): Promise<{
        tickets: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listByOrder(orderId: string, userId: string, role: string, page: number, limit: number): Promise<{
        tickets: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    scanTicket(qrCode: string, scannerUserId: string, location?: string): Promise<{
        message: string;
        ticket: any;
    }>;
    downloadTicket(id: string, userId: string, role: string): Promise<{
        ticketId: any;
        qrCode: any;
        qrImage: any;
        ticketStatus: any;
        attendeeName: any;
        attendeeEmail: any;
        attendeePhone: any;
        orderNumber: any;
        purchaseDate: any;
        event: any;
        venue: any;
        artists: any;
        ticketCategory: any;
        eventBanner: any;
        startDate: any;
        endDate: any;
    }>;
};
//# sourceMappingURL=ticket.service.d.ts.map