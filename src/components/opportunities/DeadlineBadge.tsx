import React from 'react';
import { getDeadlineInfo, formatDeadline } from '../../utils/dateUtils';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DeadlineBadgeProps {
  deadline: string;
  showFullDate?: boolean;
  className?: string;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({
  deadline,
  showFullDate = false,
  className,
}) => {
  const info = getDeadlineInfo(deadline);

  const urgencyStyles = {
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    normal: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/10',
    expired: 'bg-neutral-800/10 text-neutral-400 border-neutral-500/10 line-through',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md transition-colors select-none',
        urgencyStyles[info.urgency],
        className
      )}
      title={`Deadline: ${formatDeadline(deadline)}`}
    >
      {info.isUrgent ? (
        <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
      ) : (
        <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
      )}
      <span>{info.label}</span>
      {showFullDate && (
        <span className="opacity-60 text-[11px] font-normal ml-0.5">
          ({formatDeadline(deadline)})
        </span>
      )}
    </div>
  );
};
