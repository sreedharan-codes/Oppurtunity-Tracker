import React from 'react';
import { GlassButton } from './GlassButton';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 glass-card rounded-card border border-white/5 my-6">
      <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-accent/10 text-accent mb-4 border border-accent/20 shadow-glow">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <GlassButton variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </GlassButton>
      )}
    </div>
  );
};
