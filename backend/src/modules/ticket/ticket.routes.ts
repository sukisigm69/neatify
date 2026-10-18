import { Router } from "express";
import { ticketController } from "./ticket.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { scanTicketSchema, ticketIdParamSchema } from "./ticket.schema";
import { z } from "zod";

const router = Router();

router.use(authenticate);

// Validate params middleware helper specifically for UUID validation of route params
const validateParams = (schema: z.ZodSchema) => {
  return (req: any, _res: any, next: any) => {
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
router.post("/scan", authorize("ORGANIZER", "ADMIN", "SUPER_ADMIN"), validate(scanTicketSchema), ticketController.scan);

// Listing and detail
router.get("/my", ticketController.listMy);
router.get("/order/:orderId", ticketController.listByOrder);
router.get("/", ticketController.list);

// Detail and download
router.get("/:ticketId/download", validateParams(ticketIdParamSchema), ticketController.download);
router.get("/:ticketId", validateParams(ticketIdParamSchema), ticketController.getById);
router.get("/:id", ticketController.getById);

export default router;
