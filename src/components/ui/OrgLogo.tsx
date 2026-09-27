import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface OrgLogoProps {
  name: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Curated vibrant gradient palettes for brand fallbacks
const GRADIENTS = [
  'from-blue-600 to-indigo-600 text-white',
  'from-indigo-600 to-purple-600 text-white',
  'from-purple-600 to-pink-600 text-white',
  'from-emerald-600 to-teal-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-sky-500 to-blue-600 text-white',
  'from-rose-500 to-red-600 text-white',
  'from-violet-600 to-fuchsia-600 text-white',
];

function getInitials(name: string): string {
  if (!name) return 'OP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getGradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export const OrgLogo: React.FC<OrgLogoProps> = ({
  name,
  logoUrl,
  size = 'md',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-9 h-9 text-xs rounded-xl',
    lg: 'w-12 h-12 text-sm rounded-2xl',
    xl: 'w-16 h-16 text-base rounded-2xl',
  };

  const showImage = logoUrl && !hasError;
  const initials = getInitials(name);
  const gradient = getGradientForName(name);

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden flex items-center justify-center font-bold tracking-tight select-none shadow-sm border border-black/5 dark:border-white/10 transition-transform duration-300',
        sizeClasses[size],
        !showImage && `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      {showImage ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span className="drop-shadow-sm font-sans">{initials}</span>
      )}
    </div>
  );
};
