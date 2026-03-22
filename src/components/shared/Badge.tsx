import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'customer'
  | 'organization'
  | 'admin'
  | 'income'
  | 'expense'
  | 'onetime'
  | 'recurring'
  | 'active'
  | 'leave'
  | 'resigned';

const variantStyles: Record<BadgeVariant, string> = {
  customer: 'bg-blue-100 text-blue-700',
  organization: 'bg-green-100 text-green-700',
  admin: 'bg-orange-100 text-orange-700',
  income: 'bg-emerald-100 text-emerald-700',
  expense: 'bg-red-100 text-red-700',
  onetime: 'bg-gray-100 text-gray-600',
  recurring: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  leave: 'bg-yellow-100 text-yellow-700',
  resigned: 'bg-gray-100 text-gray-500',
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

export default function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
