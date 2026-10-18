"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const response_1 = require("../../utils/response");
exports.paymentController = {
    async getSnapToken(req, res, next) {
        try {
            const result = await payment_service_1.paymentService.getOrCreateSnapToken(req.body.orderId, req.user.userId);
            (0, response_1.sendSuccess)(res, result, "Payment token retrieved");
        }
        catch (err) {
            next(err);
        }
    },
    async webhook(req, res, next) {
        try {
            const result = await payment_service_1.paymentService.handleWebhook(req.body);
            (0, response_1.sendSuccess)(res, result, "Webhook processed");
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=payment.controller.js.map