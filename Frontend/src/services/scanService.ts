import { ScanResult } from '../types';
import api from './api';

// Simulation of latency
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scanService = {
  submitScan: async (data: string, scan_type: string = 'fraud_detection'): Promise<{ scanId: string }> => {
    const response = await api.post('/scan/', { data, scan_type });
    return { scanId: response.data.scan_id };
  },

  getScanResult: async (scanId: string): Promise<ScanResult> => {
    const response = await api.get(`/scan/${scanId}`);
    const scan = response.data;
    return {
      id: scan.scan_id,
      target: scan.data || scan.target || 'Unknown',
      type: scan.scan_type || 'file',
      riskScore: scan.risk_score,
      status: scan.risk_level === 'high' ? 'malicious' : scan.risk_level === 'medium' ? 'suspicious' : 'clean',
      findings: [],
      summary: scan.explanation,
      timestamp: scan.timestamp
    };
  }
};

export const historyService = {
  getHistory: async (): Promise<ScanResult[]> => {
    const response = await api.get('/scan/history');
    return response.data.map((scan: any) => ({
      id: scan.scan_id,
      target: scan.data,
      type: 'file', // Default to file if not specified
      riskScore: scan.risk_score,
      status: scan.risk_level === 'high' ? 'malicious' : scan.risk_level === 'medium' ? 'suspicious' : 'clean',
      findings: [],
      summary: scan.explanation,
      timestamp: scan.timestamp
    }));
  },
  
  deleteScan: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/scan/${id}`);
    return response.data.success;
  }
};
