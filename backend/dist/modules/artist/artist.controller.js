"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistController = void 0;
const artist_service_1 = require("./artist.service");
const response_1 = require("../../utils/response");
exports.artistController = {
    async list(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = req.user.role === "ORGANIZER"
                ? await artist_service_1.artistService.listOwn(req.user.userId, page, limit)
                : await artist_service_1.artistService.listAll(page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const artist = await artist_service_1.artistService.getById(req.params.id);
            (0, response_1.sendSuccess)(res, artist);
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const artist = await artist_service_1.artistService.create(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, artist);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const artist = await artist_service_1.artistService.update(req.user.userId, req.params.id, req.body);
            (0, response_1.sendSuccess)(res, artist);
        }
        catch (err) {
            next(err);
        }
    },
    async uploadImage(req, res, next) {
        try {
            const artist = await artist_service_1.artistService.uploadImage(req.user.userId, req.params.id, req.body.image);
            (0, response_1.sendSuccess)(res, artist, "Artist image updated");
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await artist_service_1.artistService.remove(req.user.userId, req.params.id);
            (0, response_1.sendSuccess)(res, null, "Artist deleted");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=artist.controller.js.map