import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import { User } from '@/types'
import api from '@/lib/api'

// Helper to decode JWT and extract user info
const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null
  try {
    const decoded: any = jwtDecode(token)
    return {
      user_id: decoded.user_id || '',
      email: decoded.email || '',
      full_name: decoded.full_name || '',
      shop_name: decoded.shop_name || '',
      phone: decoded.phone,
      photo: decoded.photo,
    }
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isHydrated: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; full_name: string; shop_name: string; phone?: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

/**
 * ✅ SIMPLE AUTHENTICATION STORE
 *
 * This is intentionally minimal:
 * - Stores token in Zustand + persists to localStorage
 * - Backend is source of truth for auth validation
 * - No hydration logic or ProtectedRoute needed
 * - If backend returns 401, Axios interceptor handles logout
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      // Login
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { access_token } = response.data.data
          const user = getUserFromToken(access_token)

          set({
            user,
            token: access_token,
            isLoading: false,
            error: null,
            isHydrated: true,
          })
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      // Register
      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/register', data)
          const { access_token } = response.data.data
          const user = getUserFromToken(access_token)

          set({
            user,
            token: access_token,
            isLoading: false,
            error: null,
            isHydrated: true,
          })
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      // Logout - clear everything
      logout: () => {
        set({
          user: null,
          token: null,
          isLoading: false,
          error: null,
          isHydrated: true,
        })
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
      }),
      // ✅ FIX: Derive user from token on hydration
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state && state.token) {
            state.user = getUserFromToken(state.token)
            state.isHydrated = true
          } else if (state) {
            state.isHydrated = true
          }
        }
      },
    }
  )
)
