import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-dark overflow-hidden relative font-body text-on-surface">
      {/* Background Particles Container */}
      <div className="bg-particles"></div>

      {/* Hero Section (Left) - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-24 object-cover" style={{
        backgroundImage: 'linear-gradient(to right, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.95) 100%), url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Glow effect matching image */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
        
        <div className="relative z-10 max-w-lg mt-auto pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl xl:text-6xl font-display font-black text-white mb-6 leading-tight">
              Apna Vyapar,<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' }}>
                Smart Tarike Se
              </span>
            </h1>
            
            <p className="text-xl text-on-surface-variant font-medium mb-12 max-w-md">
              Transform your retail business into a high-tech command center with powerful inventory and credit management.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <div className="px-5 py-2.5 rounded-full border border-neon-orange/30 bg-neon-orange/10 text-neon-orange font-bold text-sm backdrop-blur-md shadow-[0_0_15px_rgba(255,149,0,0.15)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-orange animate-pulse"></span> Smart Udhaar
              </div>
              <div className="px-5 py-2.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-bold text-sm backdrop-blur-md shadow-[0_0_15px_rgba(189,95,255,0.15)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></span> Inventory Sync
              </div>
              <div className="px-5 py-2.5 rounded-full border border-neon-teal/30 bg-neon-teal/10 text-neon-teal font-bold text-sm backdrop-blur-md shadow-[0_0_15px_rgba(0,255,209,0.15)] flex items-center gap-2">
                <Zap className="w-4 h-4" /> AI Insights
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-dark overflow-hidden bg-surface flex items-center justify-center text-xs font-bold shadow-lg">
                    User {i}
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-dark overflow-hidden bg-gradient-to-br from-neon-orange to-neon-purple flex items-center justify-center text-dark font-bold text-xs shadow-lg shadow-neon-orange/20 z-10">
                  +10k
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-neon-orange">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-on-surface font-medium">4.9/5 from 10,000+ stores</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Card (Right/Center) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        
        {/* Mobile ambient glows */}
        <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-neon-orange rounded-full opacity-[0.08] blur-[100px]" />
        <div className="lg:hidden absolute bottom-0 right-0 w-64 h-64 bg-neon-purple rounded-full opacity-[0.08] blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Form Container */}
          <div className="relative rounded-3xl p-8 sm:p-10" style={{
            background: 'rgba(26, 26, 26, 0.5)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Header */}
            <div className="mb-10 text-center relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-orange to-neon-purple opacity-100 shadow-[0_0_30px_rgba(255,149,0,0.4)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6"></div>
                <Zap className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-display font-black tracking-tight" style={{
                background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 50%, #00FFD1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Welcome Back
              </h2>
              <p className="text-on-surface-variant font-medium mt-2">Manage your store with ease</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Error Message */}
              {(localError || error) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm font-medium flex items-start gap-3">
                  <span className="bg-neon-pink/20 p-1 rounded-full"><Lock className="w-4 h-4" /></span>
                  {localError || error}
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-orange transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@store.com"
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-orange transition-all duration-300 focus:bg-surface"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                    required
                  />
                  {/* Subtle focus glow via Tailwind class overrides isn't enough, adding custom inline style via group-focus */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(255, 149, 0, 0.2)' }}></div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-on-surface-variant group-focus-within:text-neon-orange transition-colors">
                    Password
                  </label>
                  <Link to="#" className="text-xs font-semibold text-neon-orange hover:text-white transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-orange transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-12 py-3.5 bg-surface-low border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-orange transition-all duration-300 focus:bg-surface"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    }}
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-md font-bold text-dark overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
                style={{
                  background: 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
                  boxShadow: isHovered ? '0 10px 25px rgba(255, 149, 0, 0.4), 0 5px 15px rgba(189, 95, 255, 0.3)' : '0 4px 15px rgba(255, 133, 0, 0.2)',
                  transform: isHovered && !isLoading ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                {/* Glow layer that becomes brighter on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #FFB133 0%, #D17FFF 100%)' }}></div>
                
                <span className="relative z-10 flex items-center font-display tracking-wide">
                  {isLoading ? 'Authenticating...' : 'Login to Dashboard'} 
                  {!isLoading && <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
              <p className="text-on-surface-variant text-sm font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-neon-orange hover:text-white transition-colors">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
