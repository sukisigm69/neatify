import { adminRepository } from "./admin.repository";

export const adminService = {
  async getDashboard() {
    const [stats, sales, popular] = await Promise.all([
      adminRepository.getDashboardStats(),
      adminRepository.getMonthlySales(),
      adminRepository.getPopularEvents()
    ]);
    return { stats, sales, popular };
  }
};
