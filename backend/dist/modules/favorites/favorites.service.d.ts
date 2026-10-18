export declare const favoritesService: {
    list(userId: string): Promise<({
        events: {
            event_artists: ({
                artists: {
                    id: string;
                    name: string;
                    genre: string | null;
                    bio: string | null;
                    image: string | null;
                    created_at: Date;
                    updated_at: Date;
                    deleted_at: Date | null;
                };
            } & {
                event_id: string;
                artist_id: string;
            })[];
            organizers: {
                users: {
                    email: string;
                    name: string;
                };
            } & {
                id: string;
                user_id: string;
                org_name: string;
                description: string | null;
                logo: string | null;
                website: string | null;
                is_approved: boolean;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
            };
            ticket_categories: {
                id: string;
                event_id: string;
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                quota: number;
                sold: number;
                sale_start: Date;
                sale_end: Date;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
            }[];
            venues: {
                id: string;
                name: string;
                address: string;
                city: string;
                province: string;
                capacity: number;
                map_url: string | null;
                image: string | null;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
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
        };
    } & {
        user_id: string;
        event_id: string;
        created_at: Date;
    })[]>;
    create(userId: string, eventId: string): Promise<{
        user_id: string;
        event_id: string;
        created_at: Date;
    }>;
    remove(userId: string, eventId: string): Promise<void>;
};
//# sourceMappingURL=favorites.service.d.ts.map