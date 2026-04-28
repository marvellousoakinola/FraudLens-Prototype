import api from './api';

export interface ReportItem {
  id: string;
  target: string;
  confidence: string;
  status: string;
}

export interface RecentReport {
  title: string;
  date: string;
  size: string;
}

export const reportService = {
  getReports: async (): Promise<ReportItem[]> => {
    const response = await api.get('/reports');
    return response.data;
  },
  getRecentReports: async (): Promise<RecentReport[]> => {
    const response = await api.get('/reports/recent');
    return response.data;
  }
};
