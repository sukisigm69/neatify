"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueService = void 0;
const venue_repository_1 = require("./venue.repository");
const api_error_1 = require("../../utils/api-error");
exports.venueService = {
    async list(page, limit) {
        const [venues, total] = await venue_repository_1.venueRepository.findAll(page, limit);
        return { venues, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    async getById(id) {
        const venue = await venue_repository_1.venueRepository.findById(id);
        if (!venue)
            throw api_error_1.ApiError.notFound("Venue not found");
        return venue;
    },
    async create(data) {
        return venue_repository_1.venueRepository.create(data);
    },
    async update(id, data) {
        await this.getById(id);
        return venue_repository_1.venueRepository.update(id, data);
    },
    async remove(id) {
        await this.getById(id);
        return venue_repository_1.venueRepository.softDelete(id);
    },
};
//# sourceMappingURL=venue.service.js.map