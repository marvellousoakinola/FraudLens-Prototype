import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('fraudlens_token');
    const userData = localStorage.getItem('fraudlens_user');

    if (token && userData) {
      setState({
        user: JSON.parse(userData),
        token,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('fraudlens_token', token);
    localStorage.setItem('fraudlens_user', JSON.stringify(user));
    setState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('fraudlens_token');
    localStorage.removeItem('fraudlens_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const newUser = { ...prev.user, ...updatedFields };
      localStorage.setItem('fraudlens_user', JSON.stringify(newUser));
      return { ...prev, user: newUser };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
