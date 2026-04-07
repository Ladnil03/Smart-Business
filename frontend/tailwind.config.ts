import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Plus Jakarta Sans"', 'sans-serif'],
        'heading': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
        sans: ['Manrope', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Neon Bazaar Theme
        dark: '#0D0D0D',
        'neon-orange': '#FF9500',
        'neon-teal': '#00FFD1',
        'neon-pink': '#FF2D55',
        'neon-purple': '#BD5FFF',
        'neon-blue': '#00D9FF',
        'dark-card': '#1A1A1A',
        'dark-border': '#2D2D2D',
        surface: '#131313',
        'surface-low': '#1c1b1b',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353534',
        'surface-bright': '#3a3939',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#dbc2ad',
        primary: '#FF9500',
        secondary: '#BD5FFF',
        tertiary: '#00FFD1',
        error: '#FF2D55',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 50%, #00FFD1 100%)',
        'gradient-orange-purple': 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)',
        'gradient-teal-blue': 'linear-gradient(135deg, #00FFD1 0%, #00D9FF 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #FF2D55 0%, #BD5FFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
      },
      boxShadow: {
        'neon-orange': '0 0 20px rgba(255, 149, 0, 0.5), 0 0 40px rgba(255, 149, 0, 0.2)',
        'neon-teal': '0 0 20px rgba(0, 255, 209, 0.5), 0 0 40px rgba(0, 255, 209, 0.2)',
        'neon-pink': '0 0 20px rgba(255, 45, 85, 0.5), 0 0 40px rgba(255, 45, 85, 0.2)',
        'neon-purple': '0 0 20px rgba(189, 95, 255, 0.5), 0 0 40px rgba(189, 95, 255, 0.2)',
        'glow-sm': '0 0 15px rgba(255, 149, 0, 0.3)',
        'glow-md': '0 0 25px rgba(255, 149, 0, 0.35)',
        'glow-lg': '0 0 40px rgba(255, 149, 0, 0.3), 0 0 80px rgba(189, 95, 255, 0.15)',
        'card': '0 4px 40px rgba(189, 95, 255, 0.06), 0 2px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 60px rgba(189, 95, 255, 0.1), 0 4px 30px rgba(0, 0, 0, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-scale': 'fadeInScale 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 149, 0, 0.4)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 35px rgba(255, 149, 0, 0.7)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slideInLeft': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 149, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 149, 0, 0.6), 0 0 80px rgba(189, 95, 255, 0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config
