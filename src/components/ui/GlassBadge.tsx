import React from 'react';
import { cn } from '../../utils/cn';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  icon,
}) => {
  const variantStyles = {
    default:
      'bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border-black/5 dark:border-white/10',
    accent:
      'bg-accent/10 text-accent-700 dark:text-accent-300 border-accent/20',
    success:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    danger:
      'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    purple:
      'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-lg font-medium gap-1',
    md: 'text-xs px-3 py-1 rounded-badge font-medium gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center backdrop-blur-md border tracking-tight transition-all duration-200 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
