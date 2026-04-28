import api from './api';

export interface ActivityLog {
  id: string;
  type: 'inbound' | 'outbound' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  action: string;
  target: string;
  timestamp: string;
}

export const logService = {
  getLiveLogs: async (): Promise<ActivityLog[]> => {
    const response = await api.get('/logs/live');
    return response.data;
  }
};
