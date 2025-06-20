// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

interface AuthData {
  token: string;
  expiresAt: number;
}

export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // In a real app, you might get this from localStorage or a cookie
        const storedToken = localStorage.getItem('auth_token');
        const storedExpiry = localStorage.getItem('tokenExpiry');
        
        if (storedToken && storedExpiry) {
          const expiresAt = parseInt(storedExpiry, 10);
          if (Date.now() < expiresAt) {
            setAuthData({ token: storedToken, expiresAt });
          } else {
            // Token expired, clear it
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    // Return existing valid token if available
    if (authData && authData.expiresAt > Date.now()) {
      return authData.token;
    }

    // Simulate token refresh in a real app
    try {
      setLoading(true);
      // This would be an API call to your auth endpoint
      const mockToken = 'mock-token-' + Date.now();
      const expiresIn = 3600 * 1000; // 1 hour
      const expiresAt = Date.now() + expiresIn;

      // Store the new token
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('tokenExpiry', expiresAt.toString());
      
      setAuthData({ token: mockToken, expiresAt });
      return mockToken;
    } catch (error) {
      console.error('Failed to refresh token', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authData]);

  const isAuthenticated = !!authData?.token && authData.expiresAt > Date.now();

  return { 
    getToken, 
    isAuthenticated, 
    isLoading: loading,
    // Add these if you need them:
    // login: async (credentials) => { ... },
    // logout: () => { ... }
  };
};