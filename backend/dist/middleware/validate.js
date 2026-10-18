"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const api_error_1 = require("../utils/api-error");
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(api_error_1.ApiError.badRequest("Validation failed", errors));
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map