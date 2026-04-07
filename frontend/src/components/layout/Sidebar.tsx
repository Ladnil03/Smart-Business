import React from 'react'
import { LogOut, Settings, Home, Users, Package, FileText, Zap, X, ChevronRight, Store } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', color: 'text-neon-orange', glow: 'rgba(255,149,0,0.3)' },
  { icon: Users, label: 'Customers', href: '/customers', color: 'text-neon-teal', glow: 'rgba(0,255,209,0.3)' },
  { icon: Package, label: 'Products', href: '/products', color: 'text-neon-purple', glow: 'rgba(189,95,255,0.3)' },
  { icon: FileText, label: 'Bills', href: '/bills', color: 'text-neon-blue', glow: 'rgba(0,217,255,0.3)' },
  { icon: Zap, label: 'AI Assistant', href: '/ai', color: 'text-neon-pink', glow: 'rgba(255,45,85,0.3)' },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed lg:static left-0 top-0 h-screen w-64 z-50 flex flex-col
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'rgba(19, 19, 19, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,149,0,0.15) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(189,95,255,0.12) 0%, transparent 70%)', transform: 'translate(50%, 50%)' }}
          />
        </div>

        {/* Header */}
        <div className="relative p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-glow-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-heading font-bold" style={{
                  background: 'linear-gradient(135deg, #FF9500, #BD5FFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  VyaparSeth
                </h1>
                <p className="text-xs text-on-surface-variant">Smart Store Manager</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="relative p-4 mx-3 mt-4 rounded-2xl" style={{
            background: 'rgba(53, 53, 52, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}
              >
                {user.full_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{user.full_name}</p>
                <div className="flex items-center gap-1">
                  <Store className="w-3 h-3 text-neon-teal flex-shrink-0" />
                  <p className="text-xs text-on-surface-variant truncate">{user.shop_name}</p>
                </div>
              </div>
            </div>
            {/* Live sync indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-teal animate-pulse" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-250 group"
                style={isActive ? {
                  background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
                  boxShadow: `0 4px 15px ${item.glow}`,
                } : {
                  background: 'transparent',
                }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-250 ${
                    isActive ? 'text-white' : `${item.color} group-hover:scale-110`
                  }`}
                />
                <span className={`font-medium text-sm transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-on-surface-variant group-hover:text-on-surface'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-white ml-auto" />
                )}
                {/* Hover background */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 transition-all duration-200 group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            style={{ color: '#FF2D55' }}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-red-500/5 transition-opacity" />
          </button>
        </div>
      </motion.div>
    </>
  )
}
