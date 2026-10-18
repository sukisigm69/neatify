"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistService = void 0;
const artist_repository_1 = require("./artist.repository");
const api_error_1 = require("../../utils/api-error");
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getOrganizerId(userId) {
    const org = await prisma_1.default.organizers.findFirst({ where: { user_id: userId, deleted_at: null } });
    if (!org)
        throw api_error_1.ApiError.forbidden("Not an approved organizer");
    return org.id;
}
exports.artistService = {
    async listOwn(userId, page, limit) {
        await getOrganizerId(userId);
        const [artists, total] = await artist_repository_1.artistRepository.findByOrganizer(userId, page, limit);
        return { artists, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    async listAll(page, limit) {
        const [artists, total] = await artist_repository_1.artistRepository.findAll(page, limit);
        return { artists, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    async getById(id) {
        const artist = await artist_repository_1.artistRepository.findById(id);
        if (!artist)
            throw api_error_1.ApiError.notFound("Artist not found");
        return artist;
    },
    async create(userId, data) {
        await getOrganizerId(userId);
        return artist_repository_1.artistRepository.create(data);
    },
    async update(userId, id, data) {
        await getOrganizerId(userId);
        await this.getById(id);
        return artist_repository_1.artistRepository.update(id, data);
    },
    async uploadImage(userId, id, image) {
        await getOrganizerId(userId);
        await this.getById(id);
        return artist_repository_1.artistRepository.updateImage(id, image);
    },
    async remove(userId, id) {
        await getOrganizerId(userId);
        await this.getById(id);
        return artist_repository_1.artistRepository.softDelete(id);
    },
};
//# sourceMappingURL=artist.service.js.map