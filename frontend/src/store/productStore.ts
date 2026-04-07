import { create } from 'zustand'
import { Product } from '@/types'
import api from '@/lib/api'

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  createProduct: (data: Omit<Product, 'product_id' | 'owner_id' | 'created_at' | 'updated_at'>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/products')
      set({ products: response.data.data })
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch products' })
    } finally {
      set({ isLoading: false })
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/products', data)
      set((state) => ({ products: [...state.products, response.data.data] }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to create product' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/products/${productId}`)
      set((state) => ({
        products: state.products.filter((p) => p.product_id !== productId),
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to delete product' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateProduct: async (productId: string, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put(`/products/${productId}`, data)
      set((state) => ({
        products: state.products.map((p) =>
          p.product_id === productId ? response.data.data : p
        ),
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to update product' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))
