"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueRepository = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const uuid_1 = require("uuid");
exports.venueRepository = {
    findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return Promise.all([
            prisma_1.default.venues.findMany({ where: { deleted_at: null }, skip, take: limit, orderBy: { created_at: "desc" } }),
            prisma_1.default.venues.count({ where: { deleted_at: null } }),
        ]);
    },
    findById(id) {
        return prisma_1.default.venues.findFirst({ where: { id, deleted_at: null } });
    },
    create(data) {
        return prisma_1.default.venues.create({
            data: {
                id: (0, uuid_1.v4)(),
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
    update(id, data) {
        return prisma_1.default.venues.update({
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
    softDelete(id) {
        return prisma_1.default.venues.update({ where: { id }, data: { deleted_at: new Date() } });
    },
};
//# sourceMappingURL=venue.repository.js.map