import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Overview',
  '/customers': 'Customers',
  '/products': 'Inventory',
  '/bills': 'Billing & Invoices',
  '/ai': 'AI Assistant',
  '/profile': 'Profile Settings',
  '/settings': 'Settings',
}

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = TITLE_MAP[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Animated Particles Background */}
      <div className="bg-particles"></div>
      
      {/* Sidebar - fixed left */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* We ensure a padding top so the sticky topbar isn't covering content, though flex-col does that automatically */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
