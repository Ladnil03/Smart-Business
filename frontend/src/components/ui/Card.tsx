import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'dark'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ variant = 'default', className, ...props }, ref) => {
  const variants = {
    default: 'glass-morphism border border-dark-border',
    gradient: 'bg-gradient-to-br from-neon-orange/10 to-neon-purple/10 border border-neon-orange/20 rounded-2xl',
    dark: 'bg-dark-card border border-dark-border',
  }

  return (
    <div
      ref={ref}
      className={clsx('rounded-2xl p-6', variants[variant], className)}
      {...props}
    />
  )
})

Card.displayName = 'Card'
