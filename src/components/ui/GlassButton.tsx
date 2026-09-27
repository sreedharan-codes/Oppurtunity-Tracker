import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl font-medium gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-button font-medium gap-2',
    lg: 'text-base px-6 py-3.5 rounded-button font-semibold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-accent text-white shadow-glow hover:bg-accent-600 active:scale-[0.98] border border-white/20',
    secondary:
      'bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-100 hover:bg-black/10 dark:hover:bg-white/15 active:scale-[0.98] border border-black/5 dark:border-white/10 backdrop-blur-md',
    ghost:
      'bg-transparent text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]',
    danger:
      'bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border border-rose-500/20 active:scale-[0.98]',
    outline:
      'bg-transparent text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 active:scale-[0.98]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
};
