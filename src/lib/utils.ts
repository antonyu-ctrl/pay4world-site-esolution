import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 100000000) return (amount / 100000000).toFixed(1) + '억원';
  if (amount >= 10000) return new Intl.NumberFormat('ko-KR').format(Math.round(amount / 10000)) + '만원';
  return formatCurrency(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function calcTaxDeduction(salary: number, donations: number): {
  baseDeduction: number;
  additionalDeduction: number;
  totalDeduction: number;
} {
  // Korean tax law: 15% for donations up to 10M, 30% for amounts exceeding 10M
  const threshold = 10000000;
  let baseDeduction = 0;
  let additionalDeduction = 0;

  if (donations <= threshold) {
    baseDeduction = Math.floor(donations * 0.15);
  } else {
    baseDeduction = Math.floor(threshold * 0.15);
    additionalDeduction = Math.floor((donations - threshold) * 0.30);
  }

  // Cap at a percentage of salary
  const maxDeduction = Math.floor(salary * 0.3);
  const totalDeduction = Math.min(baseDeduction + additionalDeduction, maxDeduction);

  return { baseDeduction, additionalDeduction, totalDeduction };
}
