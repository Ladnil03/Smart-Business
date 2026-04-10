import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/toastStore'

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

const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  )
}

export { Toast, ToastContainer, useToastStore }
export type { Toast as ToastType }
