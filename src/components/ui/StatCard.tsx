import React from 'react';
import { GlassCard } from './GlassCard';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  onClick,
}) => {
  return (
    <GlassCard
      onClick={onClick}
      hoverEffect={!!onClick}
      className={cn(
        'flex flex-col justify-between p-5 sm:p-6 rounded-card border border-black/5 dark:border-white/10 group',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide uppercase">
          {label}
        </span>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-accent/10 dark:bg-accent/15 text-accent group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </GlassCard>
  );
};
