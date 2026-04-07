import React, { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {children}
        </div>
      </div>
    </div>
  )
}
