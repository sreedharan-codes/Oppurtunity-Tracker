import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface GlassDropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  align?: 'left' | 'right';
}

export function GlassDropdown<T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className,
  buttonClassName,
  align = 'left',
}: GlassDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'glass-input flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-medium rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all select-none',
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-neutral-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-40 mt-1.5 min-w-[180px] w-max max-w-xs rounded-2xl glass-card border border-white/20 dark:border-white/10 shadow-2xl p-1.5 backdrop-blur-2xl bg-white/95 dark:bg-[#151824]/95 animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all text-left',
                  isSelected
                    ? 'bg-accent/10 text-accent-700 dark:text-accent-400 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
