import { CreateEventInput, UpdateEventInput } from "./event.schema";
import { events_status } from "@prisma/client";
export declare const eventService: {
    listPublic(page: number, limit: number, search?: string): Promise<{
        events: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBySlug(slug: string): Promise<any>;
    listByOrganizer(userId: string, page: number, limit: number): Promise<{
        events: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(userId: string, data: CreateEventInput): Promise<any>;
    update(userId: string, id: string, data: UpdateEventInput): Promise<any>;
    submit(userId: string, id: string): Promise<any>;
    uploadBanner(userId: string, id: string, banner: string): Promise<any>;
    uploadGallery(userId: string, id: string, images: string[]): Promise<any>;
    assignVenue(userId: string, id: string, venueId: string): Promise<any>;
    assignArtists(userId: string, id: string, artistIds: string[]): Promise<any>;
    createTicketCategories(userId: string, id: string, categories: any[]): Promise<any>;
    approve(id: string): Promise<any>;
    reject(id: string): Promise<any>;
    updateStatus(id: string, status: events_status): Promise<any>;
    listAll(page: number, limit: number, status?: events_status): Promise<{
        events: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    remove(userId: string, id: string): Promise<any>;
};
//# sourceMappingURL=event.service.d.ts.map