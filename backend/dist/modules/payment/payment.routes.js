"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve snap token for user checkout
router.post("/snap", auth_1.authenticate, payment_controller_1.paymentController.getSnapToken);
// Webhook direct from Midtrans (public endpoint)
router.post("/webhook", payment_controller_1.paymentController.webhook);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map