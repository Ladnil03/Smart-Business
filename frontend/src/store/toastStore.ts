import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastStore {
  toasts: Toast[]
  showToast: (message: string, type: 'success' | 'error') => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type) => {
    const id = Date.now().toString()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
