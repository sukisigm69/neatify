import type { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

const eventInclude = {
  venues: true,
  organizers: { include: { users: { select: { name: true, email: true } } } },
  event_artists: { include: { artists: true } },
  ticket_categories: { where: { deleted_at: null } },
};

type FavoriteWithEvent = Prisma.favoritesGetPayload<{
  include: { events: { include: typeof eventInclude } };
}>;
type Favorite = Prisma.favoritesGetPayload<{}>;

export const favoritesRepository: {
  findByUser(userId: string): Prisma.PrismaPromise<FavoriteWithEvent[]>;
  findOne(userId: string, eventId: string): Prisma.PrismaPromise<Favorite | null>;
  create(userId: string, eventId: string): Prisma.PrismaPromise<Favorite>;
  remove(userId: string, eventId: string): Prisma.PrismaPromise<Favorite>;
} = {
  findByUser(userId: string) {
    return prisma.favorites.findMany({
      where: { user_id: userId, events: { deleted_at: null } },
      include: { events: { include: eventInclude } },
      orderBy: { created_at: "desc" },
    });
  },

  findOne(userId: string, eventId: string) {
    return prisma.favorites.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
  },

  create(userId: string, eventId: string) {
    return prisma.favorites.create({
      data: { user_id: userId, event_id: eventId },
    });
  },

  remove(userId: string, eventId: string) {
    return prisma.favorites.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
  },
};
