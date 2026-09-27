import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search internships, hackathons, certifications, skills...',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        'relative flex items-center w-full rounded-2xl glass-surface border border-black/5 dark:border-white/10 shadow-subtle transition-all duration-300 focus-within:border-accent focus-within:shadow-glow',
        className
      )}
    >
      <div className="absolute left-4 text-neutral-400 pointer-events-none flex items-center justify-center">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3.5 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
