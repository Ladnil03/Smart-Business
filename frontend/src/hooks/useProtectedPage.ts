import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * ✅ SIMPLIFIED PROTECTION HOOK
 * 
 * Only redirects to login if:
 * 1. Store is hydrated
 * 2. AND there's no token
 * 
 * Otherwise returns loading state
 */
export const useProtectedPage = (): { isReady: boolean; shouldRedirect: boolean } => {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  useEffect(() => {
    // Wait for hydration before doing anything
    if (!isHydrated) return

    // Hydrated but no token - THIS is when we redirect
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [isHydrated, token, navigate])

  return {
    isReady: isHydrated && !!token,
    shouldRedirect: isHydrated && !token,
  }
}

