import { create } from 'zustand'
import { Customer } from '@/types'
import api from '@/lib/api'

interface CustomerStore {
  customers: Customer[]
  isLoading: boolean
  error: string | null
  fetchCustomers: () => Promise<void>
  createCustomer: (data: Omit<Customer, 'customer_id' | 'owner_id' | 'total_udhaar' | 'transactions_count' | 'created_at' | 'updated_at'>) => Promise<void>
  updateCustomer: (customerId: string, data: Partial<Customer>) => Promise<void>
  deleteCustomer: (customerId: string) => Promise<void>
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/customers')
      set({ customers: response.data.data })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch customers' })
    } finally {
      set({ isLoading: false })
    }
  },

  createCustomer: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/customers', data)
      set((state) => ({ customers: [...state.customers, response.data.data] }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to create customer' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateCustomer: async (customerId: string, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put(`/customers/${customerId}`, data)
      set((state) => ({
        customers: state.customers.map((c) =>
          c.customer_id === customerId ? response.data.data : c
        ),
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to update customer' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteCustomer: async (customerId: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/customers/${customerId}`)
      set((state) => ({
        customers: state.customers.filter((c) => c.customer_id !== customerId),
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to delete customer' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))
