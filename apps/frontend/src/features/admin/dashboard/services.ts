// Dashboard services
import { getDashboardStats as getDashboardStatsController } from './controllers';

// Dashboard service
export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return getDashboardStatsController();
  },
};
