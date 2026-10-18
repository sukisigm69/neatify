import prisma from "../../lib/prisma";
import { CreateVenueInput, UpdateVenueInput } from "./venue.schema";
import { v4 as uuidv4 } from "uuid";

export const venueRepository: any = {
  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.venues.findMany({ where: { deleted_at: null }, skip, take: limit, orderBy: { created_at: "desc" } }),
      prisma.venues.count({ where: { deleted_at: null } }),
    ]);
  },

  findById(id: string) {
    return prisma.venues.findFirst({ where: { id, deleted_at: null } });
  },

  create(data: CreateVenueInput) {
    return prisma.venues.create({
      data: {
        id: uuidv4(),
        name: data.name,
        address: data.address,
        city: data.city,
        province: data.province,
        capacity: data.capacity,
        map_url: data.mapUrl,
        image: data.image,
      },
    });
  },

  update(id: string, data: UpdateVenueInput) {
    return prisma.venues.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        province: data.province,
        capacity: data.capacity,
        map_url: data.mapUrl,
        image: data.image,
      },
    });
  },

  softDelete(id: string) {
    return prisma.venues.update({ where: { id }, data: { deleted_at: new Date() } });
  },
};
