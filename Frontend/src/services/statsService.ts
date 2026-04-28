import api from './api';

export interface SummaryItem {
  name: string;
  value: number;
}

export interface VirusItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardStats {
  activeStreams: number;
  nodesOperational: number;
  riskScore: number;
  status: string;
  summaryData: SummaryItem[];
  virusData: VirusItem[];
}

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/');
    return response.data;
  },
  getAnalyticsStats: async (): Promise<any> => {
    const response = await api.get('/stats/analytics');
    return response.data;
  }
};
