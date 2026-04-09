import { create } from 'zustand'
import { Transaction, CreateTransactionPayload } from '@/types'
import api from '@/lib/api'
import { useCustomerStore } from './customerStore'

interface TransactionStore {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  fetchTransactions: (customerId: string) => Promise<void>
  createTransaction: (payload: CreateTransactionPayload) => Promise<void>
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async (customerId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/customers/${customerId}/transactions`)
      set({ transactions: response.data.data })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch transactions' })
    } finally {
      set({ isLoading: false })
    }
  },

  createTransaction: async (payload: CreateTransactionPayload) => {
    set({ isLoading: true, error: null })
    try {
      await api.post('/transactions', payload)
      // Refresh customer data to get updated udhaar balance
      await useCustomerStore.getState().fetchCustomers(true)
      set({ error: null })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to create transaction' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))
