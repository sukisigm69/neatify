"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerController = void 0;
const response_1 = require("../../utils/response");
const organizer_service_1 = require("./organizer.service");
exports.organizerController = {
    async becomeOrganizer(req, res, next) {
        try {
            const organizer = await organizer_service_1.organizerService.becomeOrganizer(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, organizer, "Organizer registration submitted");
        }
        catch (err) {
            next(err);
        }
    },
    async profile(req, res, next) {
        try {
            const organizer = await organizer_service_1.organizerService.getProfile(req.user.userId);
            (0, response_1.sendSuccess)(res, organizer);
        }
        catch (err) {
            next(err);
        }
    },
    async updateProfile(req, res, next) {
        try {
            const organizer = await organizer_service_1.organizerService.updateProfile(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, organizer, "Organizer profile updated");
        }
        catch (err) {
            next(err);
        }
    },
    async uploadLogo(req, res, next) {
        try {
            const organizer = await organizer_service_1.organizerService.uploadLogo(req.user.userId, req.body.logo);
            (0, response_1.sendSuccess)(res, organizer, "Organizer logo updated");
        }
        catch (err) {
            next(err);
        }
    },
    async approve(req, res, next) {
        try {
            const organizer = await organizer_service_1.organizerService.approve(req.params.id, req.body.isApproved);
            (0, response_1.sendSuccess)(res, organizer, req.body.isApproved ? "Organizer approved" : "Organizer approval revoked");
        }
        catch (err) {
            next(err);
        }
    },
    async listPending(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await organizer_service_1.organizerService.listPending(page, limit);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    async dashboardSummary(req, res, next) {
        try {
            const summary = await organizer_service_1.organizerService.dashboardSummary(req.user.userId);
            (0, response_1.sendSuccess)(res, summary);
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=organizer.controller.js.map