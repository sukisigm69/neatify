import type { Prisma } from "@prisma/client";
declare const eventInclude: {
    venues: boolean;
    organizers: {
        include: {
            users: {
                select: {
                    name: boolean;
                    email: boolean;
                };
            };
        };
    };
    event_artists: {
        include: {
            artists: boolean;
        };
    };
    ticket_categories: {
        where: {
            deleted_at: null;
        };
    };
};
type FavoriteWithEvent = Prisma.favoritesGetPayload<{
    include: {
        events: {
            include: typeof eventInclude;
        };
    };
}>;
type Favorite = Prisma.favoritesGetPayload<{}>;
export declare const favoritesRepository: {
    findByUser(userId: string): Prisma.PrismaPromise<FavoriteWithEvent[]>;
    findOne(userId: string, eventId: string): Prisma.PrismaPromise<Favorite | null>;
    create(userId: string, eventId: string): Prisma.PrismaPromise<Favorite>;
    remove(userId: string, eventId: string): Prisma.PrismaPromise<Favorite>;
};
export {};
//# sourceMappingURL=favorites.repository.d.ts.map