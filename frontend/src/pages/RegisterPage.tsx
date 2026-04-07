import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Store, Phone, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    shop_name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-dark overflow-hidden relative font-body text-on-surface">
      {/* Background Particles Container */}
      <div className="bg-particles"></div>

      {/* Register Form (Left/Center) */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-teal rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-orange rounded-full opacity-[0.05] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xl"
        >
          {/* Header */}
          <div className="mb-10 lg:hidden text-center relative z-10">
            <h1 className="text-3xl font-display font-black tracking-tight" style={{
              background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 50%, #00FFD1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Join VyaparSeth
            </h1>
          </div>

          <div className="relative rounded-3xl p-8 sm:p-10" style={{
            background: 'rgba(26, 26, 26, 0.5)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-display font-bold text-white mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-medium">Start managing your store smartly</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {(localError || error) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm font-medium flex items-start gap-3">
                  <span className="bg-neon-pink/20 p-1 rounded-full flex-shrink-0 mt-0.5"><Lock className="w-3 h-3" /></span>
                  {localError || error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-orange transition-colors">Full Name <span className="text-neon-pink">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-orange transition-all duration-300 focus:bg-surface"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                      required
                    />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)' }}></div>
                  </div>
                </div>

                {/* Shop Name */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-teal transition-colors">Shop Name <span className="text-neon-pink">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-teal transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="shop_name"
                      value={formData.shop_name}
                      onChange={handleChange}
                      placeholder="My Store"
                      className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-teal transition-all duration-300 focus:bg-surface"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                      required
                    />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(0, 255, 209, 0.2)' }}></div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-orange transition-colors">Email Address <span className="text-neon-pink">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-orange transition-all duration-300 focus:bg-surface"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                    required
                  />
                  <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)' }}></div>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-purple transition-colors">Phone (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-purple transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-purple transition-all duration-300 focus:bg-surface"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                  />
                  <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(189, 95, 255, 0.2)' }}></div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-orange transition-colors">Password <span className="text-neon-pink">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-3 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-orange transition-all duration-300 focus:bg-surface"
                    style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                    required
                  />
                  <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)' }}></div>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-on-surface-variant hover:text-neon-orange focus:outline-none transition-colors rounded-lg hover:bg-white/5"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/70 mt-1 pl-1">Must be at least 6 characters.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-md font-bold text-dark overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
                style={{
                  background: 'linear-gradient(135deg, #00FFD1 0%, #00D9FF 100%)',
                  boxShadow: isHovered ? '0 10px 25px rgba(0, 255, 209, 0.3), 0 5px 15px rgba(0, 217, 255, 0.2)' : '0 4px 15px rgba(0, 255, 209, 0.15)',
                  transform: isHovered && !isLoading ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #33FFDA 0%, #33E1FF 100%)' }}></div>
                <span className="relative z-10 flex items-center font-display tracking-wide">
                  {isLoading ? 'Creating Account...' : 'Create Account'} 
                  {!isLoading && <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
              <p className="text-on-surface-variant text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-neon-teal hover:text-white transition-colors">
                  Login instead
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Section (Right) - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-center px-12 xl:px-16" style={{
        backgroundImage: 'linear-gradient(to right, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 100%), url("/register-scene.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 mb-10 rounded-3xl flex items-center justify-center shadow-glow-md relative group">
            <div className="absolute inset-0 rounded-3xl opacity-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]" style={{ background: 'linear-gradient(135deg, #00FFD1 0%, #BD5FFF 100%)' }}></div>
            <div className="absolute inset-[2px] rounded-[22px] bg-dark z-10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-transparent" style={{ fill: 'url(#gradient-teal-purple)' }} />
              <svg width="0" height="0">
                <linearGradient id="gradient-teal-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#00FFD1" offset="0%" />
                  <stop stopColor="#BD5FFF" offset="100%" />
                </linearGradient>
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-display font-black text-white mb-6 leading-tight">
            Join the Next Era of
            <span className="block mt-1 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00FFD1 0%, #BD5FFF 100%)' }}>
              Commerce.
            </span>
          </h1>
          
          <div className="space-y-6 mt-12">
            {[
              { title: 'Zero Fees', desc: 'Completely free to use for your single store.', color: '#00FFD1' },
              { title: 'Secure Data', desc: 'Your customer data is encrypted and backed up.', color: '#BD5FFF' },
              { title: 'Anywhere Access', desc: 'Manage your bills directly from your phone.', color: '#FF9500' }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl glass-strong border border-white/5 hover:-translate-y-1 transition-transform">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: feature.color, boxShadow: `0 0 10px ${feature.color}` }}></div>
                <div>
                  <h3 className="text-white font-bold">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
