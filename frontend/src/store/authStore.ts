import { create } from 'zustand'
import { User, AuthResponse } from '@/types'
import api from '@/lib/api'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; full_name: string; shop_name: string; phone?: string }) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  hydrate: () => void
}

const getStoredAuth = () => {
  const storedUser = localStorage.getItem('user')
  const token = localStorage.getItem('access_token')
  const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null
  return { user: parsedUser, token }
}

export const useAuthStore = create<AuthStore>((set) => {
  const { user: storedUser, token: storedToken } = getStoredAuth()
  
  console.log('[AuthStore] Initial state:', { storedToken: !!storedToken, storedUser: !!storedUser })

  return {
    user: storedUser,
    token: storedToken,
    isLoading: false,
    error: null,
    isHydrated: !!storedToken,

    hydrate: () => {
      const { user, token } = getStoredAuth()
      console.log('[AuthStore.hydrate] Hydrating with token:', !!token)
      set({ user, token, isHydrated: !!token })
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.post<AuthResponse>('/auth/login', { email, password })
        const { access_token, user } = response.data.data
        
        console.log('[AuthStore.login] Success, setting token:', !!access_token)
        set({ user, token: access_token, isHydrated: true })
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error: any) {
        const message = error.response?.data?.detail || 'Login failed'
        set({ error: message })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    register: async (data) => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.post<AuthResponse>('/auth/register', data)
        const { access_token, user } = response.data.data
        
        console.log('[AuthStore.register] Success, setting token:', !!access_token)
        set({ user, token: access_token, isHydrated: true })
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error: any) {
        const message = error.response?.data?.detail || 'Registration failed'
        set({ error: message })
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

    logout: () => {
      console.log('[AuthStore.logout] Logging out user')
      set({ user: null, token: null, isHydrated: false })
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },

    setUser: (user) => set({ user }),
    setToken: (token) => {
      console.log('[AuthStore.setToken] Setting token:', !!token)
      set({ token, isHydrated: !!token })
    },
  }
})
