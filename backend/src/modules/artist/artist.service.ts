import { artistRepository } from "./artist.repository";
import { CreateArtistInput, UpdateArtistInput } from "./artist.schema";
import { ApiError } from "../../utils/api-error";
import prisma from "../../lib/prisma";

async function getOrganizerId(userId: string): Promise<string> {
  const org = await prisma.organizers.findFirst({ where: { user_id: userId, deleted_at: null } });
  if (!org) throw ApiError.forbidden("Not an approved organizer");
  return org.id;
}

export const artistService = {
  async listOwn(userId: string, page: number, limit: number) {
    await getOrganizerId(userId);
    const [artists, total] = await artistRepository.findByOrganizer(userId, page, limit);
    return { artists, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async listAll(page: number, limit: number) {
    const [artists, total] = await artistRepository.findAll(page, limit);
    return { artists, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const artist = await artistRepository.findById(id);
    if (!artist) throw ApiError.notFound("Artist not found");
    return artist;
  },

  async create(userId: string, data: CreateArtistInput) {
    await getOrganizerId(userId);
    return artistRepository.create(data);
  },

  async update(userId: string, id: string, data: UpdateArtistInput) {
    await getOrganizerId(userId);
    await this.getById(id);
    return artistRepository.update(id, data);
  },

  async uploadImage(userId: string, id: string, image: string) {
    await getOrganizerId(userId);
    await this.getById(id);
    return artistRepository.updateImage(id, image);
  },

  async remove(userId: string, id: string) {
    await getOrganizerId(userId);
    await this.getById(id);
    return artistRepository.softDelete(id);
  },
};
