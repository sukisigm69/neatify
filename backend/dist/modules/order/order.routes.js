"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const order_schema_1 = require("./order.schema");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Validate params middleware helper specifically for UUID validation of route params
const validateParams = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            const errors = result.error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(require("../../utils/api-error").ApiError.badRequest("Validation failed", errors));
        }
        req.params = result.data;
        next();
    };
};
const validateQuery = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const errors = result.error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(require("../../utils/api-error").ApiError.badRequest("Validation failed", errors));
        }
        req.query = result.data;
        next();
    };
};
router.post("/checkout", (0, auth_1.authorize)("USER"), (0, validate_1.validate)(order_schema_1.checkoutSchema), order_controller_1.orderController.checkout);
router.get("/my", validateQuery(order_schema_1.orderQuerySchema), order_controller_1.orderController.listMy);
router.get("/", order_controller_1.orderController.list);
router.get("/:orderId", validateParams(order_schema_1.orderIdParamSchema), order_controller_1.orderController.getOrderDetail);
router.get("/:id", order_controller_1.orderController.getById);
router.post("/:id/cancel", order_controller_1.orderController.cancel);
exports.default = router;
//# sourceMappingURL=order.routes.js.map