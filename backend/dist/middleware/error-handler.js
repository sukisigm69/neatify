"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const api_error_1 = require("../utils/api-error");
function errorHandler(err, _req, res, _next) {
    if (err instanceof api_error_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    console.error("[ERROR]", err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
//# sourceMappingURL=error-handler.js.map