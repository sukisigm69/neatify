import { CreateVenueInput, UpdateVenueInput } from "./venue.schema";
export declare const venueService: {
    list(page: number, limit: number): Promise<{
        venues: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(data: CreateVenueInput): Promise<any>;
    update(id: string, data: UpdateVenueInput): Promise<any>;
    remove(id: string): Promise<any>;
};
//# sourceMappingURL=venue.service.d.ts.map