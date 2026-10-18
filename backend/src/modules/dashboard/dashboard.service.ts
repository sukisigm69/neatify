import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  getStatistics() {
    return dashboardRepository.getStatistics();
  },

  getMonthlySales(year: number) {
    return dashboardRepository.getMonthlySales(year);
  },

  getPopularEvents(limit: number) {
    return dashboardRepository.getPopularEvents(limit);
  },
};
