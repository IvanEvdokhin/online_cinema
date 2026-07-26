import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    login: async (email, password) => {
      const response = await api.login({ email, password });
      localStorage.setItem('admin_token', response.token);
      setToken(response.token);
      return response;
    },
    logout: async () => {
      try {
        if (token) {
          await api.logout();
        }
      } finally {
        localStorage.removeItem('admin_token');
        setToken(null);
      }
    },
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
