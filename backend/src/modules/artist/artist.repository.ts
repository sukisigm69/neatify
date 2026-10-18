import prisma from "../../lib/prisma";
import { CreateArtistInput, UpdateArtistInput } from "./artist.schema";
import { v4 as uuidv4 } from "uuid";

export const artistRepository: any = {
  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.artists.findMany({ where: { deleted_at: null }, skip, take: limit, orderBy: { created_at: "desc" } }),
      prisma.artists.count({ where: { deleted_at: null } }),
    ]);
  },

  findByOrganizer(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.artists.findMany({
        where: {
          deleted_at: null,
          event_artists: { some: { events: { organizers: { user_id: userId } } } },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.artists.count({
        where: {
          deleted_at: null,
          event_artists: { some: { events: { organizers: { user_id: userId } } } },
        },
      }),
    ]);
  },

  findById(id: string) {
    return prisma.artists.findFirst({ where: { id, deleted_at: null } });
  },

  create(data: CreateArtistInput) {
    return prisma.artists.create({
      data: {
        id: uuidv4(),
        name: data.name,
        genre: data.genre,
        bio: data.bio,
        image: data.image,
      },
    });
  },

  update(id: string, data: UpdateArtistInput) {
    return prisma.artists.update({
      where: { id },
      data: {
        name: data.name,
        genre: data.genre,
        bio: data.bio,
        image: data.image,
      },
    });
  },

  updateImage(id: string, image: string) {
    return prisma.artists.update({ where: { id }, data: { image } });
  },

  softDelete(id: string) {
    return prisma.artists.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
