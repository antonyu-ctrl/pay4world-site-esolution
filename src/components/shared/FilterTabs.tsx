'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  /** Force dropdown on mobile when options >= this count (default: 4) */
  mobileDropdownThreshold?: number;
}

export default function FilterTabs({
  options,
  activeId,
  onChange,
  className,
  mobileDropdownThreshold = 4,
}: FilterTabsProps) {
  const useDropdownOnMobile = options.length >= mobileDropdownThreshold;

  return (
    <>
      {/* Mobile dropdown (when many options) */}
      {useDropdownOnMobile && (
        <div className={cn('sm:hidden relative', className)}>
          <select
            value={activeId}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      )}

      {/* Pill buttons (always on desktop, on mobile only when few options) */}
      <div className={cn(
        'flex flex-wrap gap-2',
        useDropdownOnMobile ? 'hidden sm:flex' : '',
        className,
      )}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              option.id === activeId
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
