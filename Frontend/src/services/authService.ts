import api from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string, name?: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/user/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; avatar?: string }): Promise<User> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};
