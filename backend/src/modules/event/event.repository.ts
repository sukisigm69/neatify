import prisma from "../../lib/prisma";
import { events_status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const eventInclude = {
  venues: true,
  organizers: { include: { users: { select: { name: true, email: true } } } },
  event_artists: { include: { artists: true } },
  ticket_categories: { where: { deleted_at: null } },
};

export const eventRepository: any = {
  findAll(where: any, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.events.findMany({ where, skip, take: limit, orderBy: { start_date: "asc" }, include: eventInclude }),
      prisma.events.count({ where }),
    ]);
  },

  findById(id: string) {
    return prisma.events.findFirst({ where: { id, deleted_at: null }, include: eventInclude });
  },

  findBySlug(slug: string) {
    return prisma.events.findFirst({ where: { slug, deleted_at: null }, include: eventInclude });
  },

  create(data: {
    id?: string;
    organizerId: string;
    venueId: string;
    title: string;
    slug: string;
    description: string;
    banner?: string;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.events.create({
      data: {
        id: data.id || uuidv4(),
        organizer_id: data.organizerId,
        venue_id: data.venueId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        banner: data.banner,
        start_date: data.startDate,
        end_date: data.endDate,
      },
      include: eventInclude
    });
  },

  update(id: string, data: any) {
    return prisma.events.update({
      where: { id },
      data: {
        venue_id: data.venueId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        banner: data.banner,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status,
      },
      include: eventInclude
    });
  },

  updateStatus(id: string, status: events_status) {
    return prisma.events.update({ where: { id }, data: { status }, include: eventInclude });
  },

  updateBanner(id: string, banner: string) {
    return prisma.events.update({ where: { id }, data: { banner }, include: eventInclude });
  },

  replaceGallery(eventId: string, images: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.event_images.deleteMany({ where: { event_id: eventId } });
      await tx.event_images.createMany({
        data: images.map((imageUrl, index) => ({
          id: uuidv4(),
          event_id: eventId,
          image_url: imageUrl,
          sort_order: index,
        })),
      });
    });
  },

  createTicketCategories(eventId: string, categories: any[]) {
    return prisma.ticket_categories.createMany({
      data: categories.map((category) => ({
        id: uuidv4(),
        event_id: eventId,
        name: category.name,
        price: category.price,
        quota: category.quota,
        sale_start: category.saleStart ? new Date(category.saleStart) : new Date(),
        sale_end: category.saleEnd ? new Date(category.saleEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })),
    });
  },

  softDelete(id: string) {
    return prisma.events.update({ where: { id }, data: { deleted_at: new Date() } });
  },

  setArtists(eventId: string, artistIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.event_artists.deleteMany({ where: { event_id: eventId } });
      if (artistIds.length > 0) {
        await tx.event_artists.createMany({
          data: artistIds.map((artistId) => ({ event_id: eventId, artist_id: artistId })),
        });
      }
    });
  },
};
