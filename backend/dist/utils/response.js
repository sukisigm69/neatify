"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
}
function sendCreated(res, data = null, message = "Created") {
    return sendSuccess(res, data, message, 201);
}
//# sourceMappingURL=response.js.map