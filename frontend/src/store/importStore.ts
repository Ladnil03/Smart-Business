import { create } from 'zustand'
import api from '@/lib/api'

interface ImportState {
  isLoading: boolean
  previewData: any[]
  importProgress: number
  error: string | null
  importCustomersFromFile: (file: File) => Promise<any>
  importProductsFromFile: (file: File) => Promise<any>
  importBillsFromFile: (file: File) => Promise<any>
  bulkImportCustomers: (data: any[]) => Promise<void>
  bulkImportProducts: (data: any[]) => Promise<void>
  bulkImportBills: (data: any[]) => Promise<void>
  clearPreview: () => void
  setError: (error: string | null) => void
}

export const useImportStore = create<ImportState>((set) => ({
  isLoading: false,
  previewData: [],
  importProgress: 0,
  error: null,

  importCustomersFromFile: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/import/preview-customers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      console.log('Preview customers response:', response.data)
      const data = response.data?.data || response.data || []
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array')
      }
      set({ previewData: data })
      return data
    } catch (err: any) {
      console.error('Import customers error:', err)
      const error = err.response?.data?.detail || err.message || 'Failed to parse file'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  importProductsFromFile: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/import/preview-products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      console.log('Preview products response:', response.data)
      const data = response.data?.data || response.data || []
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array')
      }
      set({ previewData: data })
      return data
    } catch (err: any) {
      console.error('Import products error:', err)
      const error = err.response?.data?.detail || err.message || 'Failed to parse file'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  importBillsFromFile: async (file: File) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/import/preview-bills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      console.log('Preview bills response:', response.data)
      const data = response.data?.data || response.data || []
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array')
      }
      set({ previewData: data })
      return data
    } catch (err: any) {
      console.error('Import bills error:', err)
      const error = err.response?.data?.detail || err.message || 'Failed to parse file'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  bulkImportCustomers: async (data: any[]) => {
    set({ isLoading: true, error: null, importProgress: 0 })
    try {
      const response = await api.post('/import/customers', { customers: data })
      set({ importProgress: 100 })
      return response.data
    } catch (err: any) {
      const error = err.response?.data?.detail || 'Failed to import customers'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  bulkImportProducts: async (data: any[]) => {
    set({ isLoading: true, error: null, importProgress: 0 })
    try {
      const response = await api.post('/import/products', { products: data })
      set({ importProgress: 100 })
      return response.data
    } catch (err: any) {
      const error = err.response?.data?.detail || 'Failed to import products'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  bulkImportBills: async (data: any[]) => {
    set({ isLoading: true, error: null, importProgress: 0 })
    try {
      const response = await api.post('/import/bills', { bills: data })
      set({ importProgress: 100 })
      return response.data
    } catch (err: any) {
      const error = err.response?.data?.detail || 'Failed to import bills'
      set({ error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  clearPreview: () => {
    set({ previewData: [], error: null })
  },

  setError: (error: string | null) => {
    set({ error })
  },
}))
