import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { BillsPage } from '@/pages/BillsPage'
import { AIPage } from '@/pages/AIPage'

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  
  // While checking auth, render nothing to avoid flashing
  if (!isHydrated) {
    console.log('[ProtectedRoute] Not hydrated yet, token:', token)
    return <></>
  }
  
  // If no token, redirect to login
  if (!token) {
    console.warn('[ProtectedRoute] No token found, redirecting to login. Token:', token, 'isHydrated:', isHydrated)
    console.warn('[ProtectedRoute] localStorage access_token:', localStorage.getItem('access_token') ? 'EXISTS' : 'MISSING')
    return <Navigate to="/login" replace />
  }
  
  // Has token, render page
  return <>{children}</>
}

// Root Redirect - checks auth before redirecting
const RootRedirect: React.FC = () => {
  const token = useAuthStore((state) => state.token)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  
  if (!isHydrated) {
    return <></>
  }
  
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

function App() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect - checks auth */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <BillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
