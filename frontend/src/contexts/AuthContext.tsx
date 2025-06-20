// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { User, AuthContextType, RegisterData, AuthResponse } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    if (token && userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing user data from storage', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(loggedUser));

      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (newUserData: RegisterData): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', newUserData);
      const { token, user: registeredUser } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(registeredUser));

      setUser(registeredUser);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error('Registration error:', err?.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
