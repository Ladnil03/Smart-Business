import React from 'react'

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-dark-border border-t-neon-orange rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-transparent border-r-neon-teal rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
    </div>
  </div>
)

export const SkeletonLoading: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="shimmer-loading h-20 rounded-xl" />
    ))}
  </div>
)
