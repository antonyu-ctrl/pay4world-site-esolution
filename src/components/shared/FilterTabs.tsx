'use client';

import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function FilterTabs({
  options,
  activeId,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
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
  );
}
