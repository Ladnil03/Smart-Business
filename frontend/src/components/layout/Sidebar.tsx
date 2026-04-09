import React, { useState, useEffect } from 'react'
import { LogOut, Settings, Home, Users, Package, FileText, Zap, X, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const [isLargeScreen, setIsLargeScreen] = useState(true)

  useEffect(() => {
    // Set initial value
    setIsLargeScreen(window.innerWidth >= 1024)

    // Listen for resize
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const navigation = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Bills', icon: FileText, path: '/bills' },
    { label: 'AI Assistant', icon: Zap, path: '/ai' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isLargeScreen ? 0 : (isOpen ? 0 : -256) }}
        transition={{ duration: 0.2 }}
        className="fixed lg:static left-0 top-0 h-screen w-64 z-50 flex flex-col"
        style={{
          background: 'rgba(19, 19, 19, 0.95)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">VyaparSeth</h1>
                <p className="text-xs text-gray-400">Smart Store</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 mx-3 mt-4 rounded-2xl border border-white/10" style={{ background: 'rgba(53, 53, 52, 0.5)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}
              >
                {user.full_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{user.shop_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(255,149,0,0.3) 0%, transparent 100%)',
                        borderLeft: '3px solid #FF9500',
                        paddingLeft: 'calc(1rem - 3px)',
                      }
                    : {}
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: isActive ? '#FF9500' : '#999' }} />
                <span
                  className="font-medium text-sm"
                  style={{ color: isActive ? '#FFF' : '#999' }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#FF9500' }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <User className="w-5 h-5" />
            <span className="font-medium text-sm">My Profile</span>
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  )
}
