import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { Bell, Lock, Palette, Database, LogOut, ChevronRight } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const logout = useAuthStore((state) => state.logout)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const settings = [
    {
      category: 'Notifications',
      icon: Bell,
      items: [
        {
          name: 'Push Notifications',
          description: 'Get alerts for important updates',
          value: notifications,
          onChange: setNotifications,
          disabled: false,
        },
      ],
    },
    {
      category: 'Display',
      icon: Palette,
      items: [
        {
          name: 'Dark Mode',
          description: 'Use dark theme (always on)',
          value: darkMode,
          onChange: setDarkMode,
          disabled: true,
        },
      ],
    },
    {
      category: 'Data',
      icon: Database,
      items: [
        {
          name: 'Auto-save',
          description: 'Automatically save changes',
          value: autoSave,
          onChange: setAutoSave,
          disabled: false,
        },
      ],
    },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences and account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 mb-8">
        {settings.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.category} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-6 h-6" style={{ color: '#FF9500' }} />
                <h2 className="text-xl font-bold text-white">{section.category}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                  >
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <div
                      className={`relative w-12 h-7 rounded-full cursor-pointer transition ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: item.value ? '#FF9500' : '#4b5563' }}
                      onClick={() => !item.disabled && item.onChange(!item.value)}
                    >
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Security Section */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6" style={{ color: '#BD5FFF' }} />
          <h2 className="text-xl font-bold text-white">Security</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-left">
            <div>
              <p className="font-semibold text-white">Change Password</p>
              <p className="text-sm text-gray-400">Update your password regularly</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-left">
            <div>
              <p className="font-semibold text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add extra security to your account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3 mb-6">
          <LogOut className="w-6 h-6" style={{ color: '#ff6b6b' }} />
          <h2 className="text-xl font-bold" style={{ color: '#ff6b6b' }}>Danger Zone</h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 rounded-lg font-semibold border transition flex items-center justify-center gap-2"
            style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)', color: '#ff6b6b' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <button 
            className="w-full px-6 py-3 rounded-lg font-semibold border transition"
            style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 107, 107, 0.3)', color: '#ff6b6b' }}
          >
            Delete Account
          </button>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>VyaparSeth • Version 1.0.0</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          All systems operational
        </p>
      </div>
    </div>
  )
}
