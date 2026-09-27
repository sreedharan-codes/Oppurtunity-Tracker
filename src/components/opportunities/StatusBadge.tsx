import React from 'react';
import { ApplicationStatus } from '../../types';
import { cn } from '../../utils/cn';
import { CheckCircle2, Clock, Star, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className,
}) => {
  const config: Record<
    ApplicationStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Interested: {
      label: 'Interested',
      bg: 'bg-sky-500/10 dark:bg-sky-500/15',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-500/20',
      icon: <Sparkles className="w-3 h-3 text-sky-500" />,
    },
    Applied: {
      label: 'Applied',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500/20',
      icon: <Clock className="w-3 h-3 text-indigo-500" />,
    },
    Shortlisted: {
      label: 'Shortlisted',
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/25',
      icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />,
    },
    Completed: {
      label: 'Completed',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
    },
  };

  const item = config[status] || config.Interested;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border backdrop-blur-md select-none',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        item.bg,
        item.text,
        item.border,
        className
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
