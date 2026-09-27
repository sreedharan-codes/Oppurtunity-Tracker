import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { MatchScore } from '../../types';

interface MatchBadgeProps {
  match: MatchScore;
  className?: string;
  showExplanation?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({
  match,
  className,
  showExplanation = false,
}) => {
  const isHigh = match.percentage >= 85;
  const isMedium = match.percentage >= 70 && match.percentage < 85;

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all shadow-sm select-none',
          isHigh
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
            : isMedium
            ? 'bg-accent/10 text-accent-700 dark:text-accent-300 border-accent/25 shadow-glow'
            : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
        )}
      >
        <Sparkles className="w-3 h-3" />
        <span>{match.percentage}% Match</span>
      </div>

      {showExplanation && match.reason && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
          {match.reason}
        </p>
      )}
    </div>
  );
};
