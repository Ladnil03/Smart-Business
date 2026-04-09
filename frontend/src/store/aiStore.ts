import { create } from 'zustand'
import { AIInsights, MonthlyStats } from '@/types'
import api from '@/lib/api'

interface AIStore {
  insights: AIInsights | null
  monthlyStats: MonthlyStats | null
  isLoading: boolean
  error: string | null
  fetchInsights: () => Promise<void>
  fetchMonthlyStats: () => Promise<void>
  askQuestion: (question: string) => Promise<string>
}

export const useAIStore = create<AIStore>((set) => ({
  insights: null,
  monthlyStats: null,
  isLoading: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/ai/insights')
      set({ insights: response.data.data })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch insights' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMonthlyStats: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/ai/monthly-stats')
      set({ monthlyStats: response.data.data })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch monthly stats' })
    } finally {
      set({ isLoading: false })
    }
  },

  askQuestion: async (question: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/ai/ask', { question })
      return response.data.data.answer
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to get answer'
      set({ error: errorMsg })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))
