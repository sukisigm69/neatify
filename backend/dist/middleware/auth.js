"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = exports.roleMiddleware = exports.authMiddleware = void 0;
exports.requireAuth = requireAuth;
exports.allowRoles = allowRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_1 = require("../utils/api-error");
function requireAuth() {
    return (req, _res, next) => {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return next(api_error_1.ApiError.unauthorized("Missing token"));
        }
        const token = header.slice(7).trim();
        if (!token)
            return next(api_error_1.ApiError.unauthorized("Missing token"));
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!payload.userId || !payload.role)
                return next(api_error_1.ApiError.unauthorized("Invalid token"));
            req.user = payload;
            next();
        }
        catch {
            next(api_error_1.ApiError.unauthorized("Invalid token"));
        }
    };
}
function allowRoles(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            return next(api_error_1.ApiError.unauthorized());
        if (!roles.includes(req.user.role))
            return next(api_error_1.ApiError.forbidden());
        next();
    };
}
exports.authMiddleware = requireAuth;
exports.roleMiddleware = allowRoles;
exports.authenticate = requireAuth();
exports.authorize = allowRoles;
//# sourceMappingURL=auth.js.map