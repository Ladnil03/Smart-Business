import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { BillsPage } from '@/pages/BillsPage'
import { AIPage } from '@/pages/AIPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'

/**
 * ✅ SIMPLIFIED ROUTING
 * 
 * Structure:
 * 1. Public: /login, /register
 * 2. Protected: All routes inside ProtectedLayout
 *    - ProtectedLayout checks auth ONCE
 *    - MainLayout wraps all protected pages
 *    - Pages just render content (no auth checks)
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - auth checked here */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
