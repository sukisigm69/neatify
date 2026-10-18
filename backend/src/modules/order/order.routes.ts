import { Router } from "express";
import { orderController } from "./order.controller";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../../middleware/auth";
import { checkoutSchema, orderIdParamSchema, orderQuerySchema } from "./order.schema";
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

const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, _res: any, next: any) => {
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

router.post("/checkout", authorize("USER"), validate(checkoutSchema), orderController.checkout);
router.get("/my", validateQuery(orderQuerySchema), orderController.listMy);
router.get("/", orderController.list);

router.get("/:orderId", validateParams(orderIdParamSchema), orderController.getOrderDetail);
router.get("/:id", orderController.getById);
router.post("/:id/cancel", orderController.cancel);

export default router;
