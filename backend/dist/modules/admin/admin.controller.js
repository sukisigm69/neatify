"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const response_1 = require("../../utils/response");
exports.adminController = {
    async dashboard(req, res, next) {
        try {
            const data = await admin_service_1.adminService.getDashboard();
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    }
};
//# sourceMappingURL=admin.controller.js.map