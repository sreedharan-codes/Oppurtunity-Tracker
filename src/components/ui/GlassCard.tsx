import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card p-6 relative overflow-hidden backdrop-blur-2xl transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-glass-hover cursor-pointer',
        glow && 'hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
