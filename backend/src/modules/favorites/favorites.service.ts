import { favoritesRepository } from "./favorites.repository";
import { ApiError } from "../../utils/api-error";
import prisma from "../../lib/prisma";

export const favoritesService = {
  async list(userId: string) {
    return favoritesRepository.findByUser(userId);
  },

  async create(userId: string, eventId: string) {
    const event = await prisma.events.findFirst({ where: { id: eventId, deleted_at: null } });
    if (!event) throw ApiError.notFound("Event not found");

    const existing = await favoritesRepository.findOne(userId, eventId);
    if (existing) return existing;

    return favoritesRepository.create(userId, eventId);
  },

  async remove(userId: string, eventId: string) {
    const existing = await favoritesRepository.findOne(userId, eventId);
    if (!existing) throw ApiError.notFound("Favorite not found");
    await favoritesRepository.remove(userId, eventId);
  },
};
