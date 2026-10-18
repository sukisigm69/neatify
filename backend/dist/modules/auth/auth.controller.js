"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
exports.authController = {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            (0, response_1.sendCreated)(res, result, "Registration successful");
        }
        catch (err) {
            next(err);
        }
    },
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result, "Login successful");
        }
        catch (err) {
            next(err);
        }
    },
    async me(req, res, next) {
        try {
            const user = await auth_service_1.authService.me(req.user.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (err) {
            next(err);
        }
    },
    async registerOrganizer(req, res, next) {
        try {
            const organizer = await auth_service_1.authService.registerOrganizer(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, organizer, "Organizer registration submitted");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map