export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ScanResult {
  id: string;
  target: string;
  type: 'url' | 'file';
  riskScore: number; // 0-100
  status: 'clean' | 'suspicious' | 'malicious';
  findings: Finding[];
  summary: string;
  timestamp: string;
}

export interface Finding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
}
