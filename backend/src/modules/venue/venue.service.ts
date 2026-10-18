import { venueRepository } from "./venue.repository";
import { CreateVenueInput, UpdateVenueInput } from "./venue.schema";
import { ApiError } from "../../utils/api-error";

export const venueService = {
  async list(page: number, limit: number) {
    const [venues, total] = await venueRepository.findAll(page, limit);
    return { venues, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const venue = await venueRepository.findById(id);
    if (!venue) throw ApiError.notFound("Venue not found");
    return venue;
  },

  async create(data: CreateVenueInput) {
    return venueRepository.create(data);
  },

  async update(id: string, data: UpdateVenueInput) {
    await this.getById(id);
    return venueRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return venueRepository.softDelete(id);
  },
};
