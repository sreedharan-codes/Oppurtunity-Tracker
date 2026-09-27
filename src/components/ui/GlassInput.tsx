import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, rightElement, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'glass-input w-full px-4 py-2.5 text-sm rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400/80',
              icon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-rose-500/50 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.2)]',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-neutral-400 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
