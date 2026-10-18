"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const admin_repository_1 = require("./admin.repository");
exports.adminService = {
    async getDashboard() {
        const [stats, sales, popular] = await Promise.all([
            admin_repository_1.adminRepository.getDashboardStats(),
            admin_repository_1.adminRepository.getMonthlySales(),
            admin_repository_1.adminRepository.getPopularEvents()
        ]);
        return { stats, sales, popular };
    }
};
//# sourceMappingURL=admin.service.js.map