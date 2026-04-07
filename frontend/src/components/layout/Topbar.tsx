import React from 'react'
import { Menu, Bell, Search, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAIStore } from '@/store/aiStore'

interface TopbarProps {
  title?: string;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'Dashboard', onToggleSidebar }) => {
  const user = useAuthStore((state) => state.user)
  const insights = useAIStore((state) => state.insights)

  const hasLowStock = insights?.low_stock_items && insights.low_stock_items.length > 0

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

          {/* User avatar */}
          {user && (
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-heading font-bold text-sm cursor-pointer hover:scale-105 transition-transform text-dark"
              style={{
                background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
                boxShadow: '0 0 12px rgba(255, 149, 0, 0.3)',
              }}
              title={user.full_name}
            >
              {user.full_name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
