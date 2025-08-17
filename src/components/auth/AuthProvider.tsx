'use client';

import React, { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

// Re-export useAuth from hook and create a simple context provider for children
const AuthContext = createContext<any>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Alternative export for useAuth that uses the hook directly
export { useAuth } from '@/hooks/useAuth';
