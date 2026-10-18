"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
exports.artistRepository = {
    findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.artists.findMany({ where: { deleted_at: null }, skip, take: limit, orderBy: { created_at: "desc" } }),
            prisma_1.default.artists.count({ where: { deleted_at: null } }),
        ]);
    },
    findByOrganizer(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.artists.findMany({
                where: {
                    deleted_at: null,
                    event_artists: { some: { events: { organizers: { user_id: userId } } } },
                },
                skip,
                take: limit,
                orderBy: { created_at: "desc" },
            }),
            prisma_1.default.artists.count({
                where: {
                    deleted_at: null,
                    event_artists: { some: { events: { organizers: { user_id: userId } } } },
                },
            }),
        ]);
    },
    findById(id) {
        return prisma_1.default.artists.findFirst({ where: { id, deleted_at: null } });
    },
    create(data) {
        return prisma_1.default.artists.create({
            data: {
                id: (0, uuid_1.v4)(),
                name: data.name,
                genre: data.genre,
                bio: data.bio,
                image: data.image,
            },
        });
    },
    update(id, data) {
        return prisma_1.default.artists.update({
            where: { id },
            data: {
                name: data.name,
                genre: data.genre,
                bio: data.bio,
                image: data.image,
            },
        });
    },
    updateImage(id, image) {
        return prisma_1.default.artists.update({ where: { id }, data: { image } });
    },
    softDelete(id) {
        return prisma_1.default.artists.update({ where: { id }, data: { deleted_at: new Date() } });
    },
};
//# sourceMappingURL=artist.repository.js.map