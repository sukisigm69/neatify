"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artist_controller_1 = require("./artist.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const artist_schema_1 = require("./artist.schema");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER", "ADMIN", "SUPER_ADMIN"), artist_controller_1.artistController.list);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER", "ADMIN", "SUPER_ADMIN"), artist_controller_1.artistController.getById);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(artist_schema_1.createArtistSchema), artist_controller_1.artistController.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(artist_schema_1.updateArtistSchema), artist_controller_1.artistController.update);
router.patch("/:id/image", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), (0, validate_1.validate)(artist_schema_1.uploadArtistImageSchema), artist_controller_1.artistController.uploadImage);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("ORGANIZER"), artist_controller_1.artistController.remove);
exports.default = router;
//# sourceMappingURL=artist.routes.js.map