import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Mail, Phone, Store, User, Save, X, Camera } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.setUser)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    shop_name: user?.shop_name || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        shop_name: user.shop_name || '',
        phone: user.phone || '',
        photo: user.photo || '',
      })
      if (user.photo) {
        setPhotoPreview(user.photo)
      }
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 200 * 1024) {
        setError('Photo must be under 200KB. Please resize and try again.')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setPhotoPreview(base64)
        setFormData((prev) => ({ ...prev, photo: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/auth/profile', formData)
      if (response.data.success) {
        updateUser(response.data.data)
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      shop_name: user?.shop_name || '',
      phone: user?.phone || '',
      photo: user?.photo || '',
    })
    if (user?.photo) {
      setPhotoPreview(user.photo)
    } else {
      setPhotoPreview(null)
    }
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          {error}
        </div>
      )}

      {/* Profile Card */}
      <Card className="p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white overflow-hidden"
              style={{ background: photoPreview ? 'none' : 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.full_name?.[0]?.toUpperCase()
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full cursor-pointer hover:bg-orange-600 transition">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.full_name}</h2>
            <div className="text-gray-400 flex items-center gap-2 mt-1">
              <Store className="w-4 h-4" />
              {user?.shop_name}
            </div>
            <div className="text-gray-500 text-sm mt-2">Member since {new Date(user?.created_at || '').toLocaleDateString()}</div>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Photo Upload */}
          {isEditing && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                <Camera className="w-4 h-4" style={{ color: '#FF9500' }} />
                Profile Photo
              </label>
              <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-white transition" />
                  <p className="text-sm text-gray-400 group-hover:text-white transition">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>
          )}
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <User className="w-4 h-4" style={{ color: '#FF9500' }} />
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', '--tw-ring-color': '#FF9500' } as any}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Mail className="w-4 h-4" style={{ color: '#BD5FFF' }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', '--tw-ring-color': '#BD5FFF' } as any}
              placeholder="Enter your email"
            />
          </div>

          {/* Shop Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Store className="w-4 h-4" style={{ color: '#00FFD1' }} />
              Shop Name
            </label>
            <input
              type="text"
              name="shop_name"
              value={formData.shop_name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', '--tw-ring-color': '#00FFD1' } as any}
              placeholder="Enter your shop name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Phone className="w-4 h-4" style={{ color: '#00D9FF' }} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', '--tw-ring-color': '#00D9FF' } as any}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition"
                style={{ background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)', boxShadow: '0 8px 16px rgba(255, 149, 0, 0.2)' }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60 transition"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60 transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Account Status</h3>
          <div className="text-lg font-bold text-green-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Active
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Member Since</h3>
          <div className="text-lg font-bold text-white">
            {new Date(user?.created_at || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
