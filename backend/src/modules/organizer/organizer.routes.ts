import { Router } from "express";
import { organizerController } from "./organizer.controller";
import { validate } from "../../middleware/validate";
import { allowRoles, requireAuth } from "../../middleware/auth";
import { approvalSchema, becomeOrganizerSchema, updateOrganizerSchema, uploadLogoSchema } from "./organizer.schema";

const router = Router();

router.post("/become", requireAuth(), allowRoles("USER"), validate(becomeOrganizerSchema), organizerController.becomeOrganizer);
router.get("/profile", requireAuth(), allowRoles("ORGANIZER"), organizerController.profile);
router.put("/profile", requireAuth(), allowRoles("ORGANIZER"), validate(updateOrganizerSchema), organizerController.updateProfile);
router.patch("/logo", requireAuth(), allowRoles("ORGANIZER"), validate(uploadLogoSchema), organizerController.uploadLogo);
router.get("/dashboard/summary", requireAuth(), allowRoles("ORGANIZER"), organizerController.dashboardSummary);
router.get("/admin/pending", requireAuth(), allowRoles("ADMIN", "SUPER_ADMIN"), organizerController.listPending);
router.patch("/admin/:id/approval", requireAuth(), allowRoles("ADMIN", "SUPER_ADMIN"), validate(approvalSchema), organizerController.approve);

export default router;
