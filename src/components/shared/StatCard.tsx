import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactElement;
  gradient: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative bg-gradient-to-br rounded-2xl p-5 text-white min-h-[140px] flex flex-col justify-between overflow-hidden',
        gradient,
        className,
      )}
    >
      {/* Icon circle */}
      <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <span className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
      </div>

      {/* Content */}
      <div className="mt-12">
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold mt-1 leading-tight">{value}</p>
        {subtitle && (
          <p className="text-white/70 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
