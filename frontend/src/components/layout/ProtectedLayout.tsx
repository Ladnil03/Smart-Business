import React from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useAuthStore } from '@/store/authStore'
import { MainLayout } from './MainLayout'

/**
 * ✅ PROTECTED LAYOUT WRAPPER
 * 
 * Handles auth check ONCE for all protected routes
 * Shows loading during hydration
 * Redirects to login if no token after hydration
 */
export const ProtectedLayout: React.FC = () => {
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  // ✅ Still loading from localStorage
  if (!isHydrated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0D0D0D]">
        <LoadingSpinner />
      </div>
    )
  }

  // ✅ Hydrated but no token - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // ✅ Has token - show protected routes with MainLayout
  return <MainLayout />
}
