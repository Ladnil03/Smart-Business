import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgOpacity = type === 'success' ? 'bg-neon-teal/80' : 'bg-neon-pink/80'

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl text-white font-medium ${bgOpacity} backdrop-blur-md border border-white/20 max-w-sm`}
    >
      {message}
    </motion.div>
  )
}

interface ToastStore {
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>
  showToast: (message: string, type: 'success' | 'error') => void
  removeToast: (id: string) => void
}

const useToastStore: () => ToastStore = () => {
  const [toasts, setToasts] = useState<ToastStore['toasts']>([])

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}

interface ToastContainerProps {
  store: ReturnType<typeof useToastStore>
}

const ToastContainer: React.FC<ToastContainerProps> = ({ store }) => {
  return (
    <AnimatePresence>
      {store.toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => store.removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  )
}

export { useToastStore, ToastContainer }
export type { ToastStore }
