"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("./ticket.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const ticket_schema_1 = require("./ticket.schema");
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
// Scan ticket (Organizer & Admin only)
router.post("/scan", (0, auth_1.authorize)("ORGANIZER", "ADMIN", "SUPER_ADMIN"), (0, validate_1.validate)(ticket_schema_1.scanTicketSchema), ticket_controller_1.ticketController.scan);
// Listing and detail
router.get("/my", ticket_controller_1.ticketController.listMy);
router.get("/order/:orderId", ticket_controller_1.ticketController.listByOrder);
router.get("/", ticket_controller_1.ticketController.list);
// Detail and download
router.get("/:ticketId/download", validateParams(ticket_schema_1.ticketIdParamSchema), ticket_controller_1.ticketController.download);
router.get("/:ticketId", validateParams(ticket_schema_1.ticketIdParamSchema), ticket_controller_1.ticketController.getById);
router.get("/:id", ticket_controller_1.ticketController.getById);
exports.default = router;
//# sourceMappingURL=ticket.routes.js.map