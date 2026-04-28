import api from './api';

export interface ThreatActor {
  name: string;
  origin: string;
  risk: string;
  color: string;
}

export const intelService = {
  getActors: async (): Promise<ThreatActor[]> => {
    const response = await api.get('/intel/actors');
    return response.data;
  }
};
