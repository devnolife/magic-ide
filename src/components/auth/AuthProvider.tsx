"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  isActivated?: boolean;
  currentStreak?: number;
  longestStreak?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string, name?: string, activationCode?: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

  const setCookie = (token: string) => {
    document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  };

  const clearCookie = () => {
    document.cookie = 'auth-token=; path=/; max-age=0';
  };

  function getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const EXPIRY_WARNING_MS = 60 * 60 * 1000; // 1 hour before expiry
const EXPIRY_CHECK_INTERVAL_MS = 5 * 60 * 1000; // check every 5 minutes

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiryCheckRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      if (!token) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
          setCookie(data.token);
        }
        warningShownRef.current = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const checkTokenExpiry = useCallback(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const timeUntilExpiry = expiry - Date.now();

    if (timeUntilExpiry > 0 && timeUntilExpiry <= EXPIRY_WARNING_MS && !warningShownRef.current) {
      warningShownRef.current = true;
      toast('Sesi Anda akan berakhir. Klik untuk memperpanjang.', {
        duration: 30000,
        action: {
          label: 'Perpanjang',
          onClick: () => {
            refreshToken();
          },
        },
      });
    }
  }, [refreshToken]);

  useEffect(() => {
    checkAuthStatus();
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (expiryCheckRef.current) clearInterval(expiryCheckRef.current);
    };
  }, []);

  const startRefreshTimers = useCallback(() => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    if (expiryCheckRef.current) clearInterval(expiryCheckRef.current);

    refreshIntervalRef.current = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL_MS);

    expiryCheckRef.current = setInterval(() => {
      checkTokenExpiry();
    }, EXPIRY_CHECK_INTERVAL_MS);
  }, [refreshToken, checkTokenExpiry]);

  const stopRefreshTimers = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    if (expiryCheckRef.current) {
      clearInterval(expiryCheckRef.current);
      expiryCheckRef.current = null;
    }
    warningShownRef.current = false;
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Ensure cookie is in sync with localStorage
          setCookie(token);

          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            startRefreshTimers();
          } else if (response.status === 401) {
            // Try refreshing the token before giving up
            const refreshed = await refreshToken();
            if (refreshed) {
              const retryToken = localStorage.getItem('auth-token');
              if (retryToken) {
                const retryResponse = await fetch('/api/auth/me', {
                  headers: { 'Authorization': `Bearer ${retryToken}` },
                });
                if (retryResponse.ok) {
                  const data = await retryResponse.json();
                  setUser(data.user);
                  startRefreshTimers();
                  return;
                }
              }
            }
            localStorage.removeItem('auth-token');
            clearCookie();
          } else {
            localStorage.removeItem('auth-token');
            clearCookie();
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        clearCookie();
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
          setCookie(data.token);
        }
        setUser(data.user);

        // Check for redirect query param first, then fallback to role-based redirect
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get('redirect');
        const role = data.user.role;
        const roleRedirect = role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/dashboard';
        window.location.href = redirectParam || roleRedirect;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      let token = null;
      
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('auth-token');
      }
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        clearCookie();
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, name?: string, activationCode?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name, activationCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', data.token);
          setCookie(data.token);
        }
        setUser(data.user);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isInitialized ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">Memuat...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
