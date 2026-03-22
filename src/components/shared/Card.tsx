import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
}

export default function Card({ children, className, padding = 'p-6' }: CardProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-sm', padding, className)}>
      {children}
    </div>
  );
}
