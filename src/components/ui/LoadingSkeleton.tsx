import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse-subtle bg-black/5 dark:bg-white/10 rounded-xl',
        className
      )}
    />
  );
};

export const OpportunityCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-card border border-white/5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-40 h-5" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="w-16 h-6 rounded-lg" />
        <Skeleton className="w-20 h-6 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
    </div>
  );
};
