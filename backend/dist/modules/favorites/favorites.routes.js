"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorites_controller_1 = require("./favorites.controller");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const favorites_schema_1 = require("./favorites.schema");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get("/", favorites_controller_1.favoritesController.list);
router.post("/", (0, validate_1.validate)(favorites_schema_1.createFavoriteSchema), favorites_controller_1.favoritesController.create);
router.delete("/:eventId", favorites_controller_1.favoritesController.remove);
exports.default = router;
//# sourceMappingURL=favorites.routes.js.map