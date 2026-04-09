import React, { useState, useEffect, useRef } from 'react'
import { Menu, Bell, Search, Zap, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAIStore } from '@/store/aiStore'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  title?: string;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', onToggleSidebar }) => {
  const user = useAuthStore((state) => state.user)
  const insights = useAIStore((state) => state.insights)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const hasLowStock = insights?.low_stock_items && insights.low_stock_items.length > 0

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsProfileMenuOpen(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setIsProfileMenuOpen(false)
  }

  return (
    <div
      className="sticky top-0 z-30"
      style={{
        background: 'rgba(13, 13, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant hover:text-on-surface"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2
              className="text-xl font-heading font-bold"
              style={{
                background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 60%, #00FFD1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {title}
            </h2>
          </div>
        </div>

        {/* Right: Search + Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Global Search (desktop) */}
          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-250 group focus-within:shadow-glow-sm focus-within:border-neon-orange/50"
            style={{
              background: 'rgba(26, 26, 26, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Search className="w-4 h-4 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm w-40 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 !p-0"
            />
          </div>

          {/* AI indicator */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{
              background: 'rgba(189, 95, 255, 0.1)',
              border: '1px solid rgba(189, 95, 255, 0.2)',
            }}
          >
            <Zap className="w-3.5 h-3.5 text-neon-purple" />
            <span className="text-xs font-medium text-neon-purple">AI Ready</span>
            <div className="w-1.5 h-1.5 rounded-full bg-neon-teal animate-pulse" />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-white/5 rounded-xl transition-colors"
            title={hasLowStock ? `${insights?.low_stock_items?.length} items low on stock` : 'No alerts'}
          >
            <Bell className="w-5 h-5 text-on-surface-variant hover:text-on-surface transition-colors" />
            {hasLowStock && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#FF2D55', boxShadow: '0 0 6px rgba(255,45,85,0.8)' }}
              />
            )}
          </button>

          {/* User avatar with dropdown */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:scale-105 transition-transform overflow-hidden border border-white/10"
                style={{
                  background: user.photo ? 'none' : 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
                  boxShadow: '0 0 12px rgba(255, 149, 0, 0.3)',
                }}
                title={user.full_name}
              >
                {user.photo ? (
                  <img src={user.photo} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm text-white">{user.full_name?.[0]?.toUpperCase()}</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-white/10 shadow-2xl z-50 animate-in fade-in"
                  style={{
                    background: 'rgba(13, 13, 13, 0.95)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold overflow-hidden"
                        style={{
                          background: user.photo ? 'none' : 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
                        }}
                      >
                        {user.photo ? (
                          <img src={user.photo} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white">{user.full_name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </button>
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
