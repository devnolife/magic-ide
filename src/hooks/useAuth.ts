import { useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  username: string
  fullName?: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Verify token on mount
  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } catch (error) {
      console.error('Auth verification error:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const result = await response.json()

      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true
        })
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (username: string, password: string, fullName?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, fullName })
      })

      const result = await response.json()

      if (result.success && result.user) {
        // After successful registration, user still needs to login
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })

      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    verifyAuth
  }
}
