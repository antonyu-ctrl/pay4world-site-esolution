import type { MonthlyFinancial, BudgetCategory } from '@/types';

export const monthlyFinancials: MonthlyFinancial[] = [
  {
    month: '2025년 10월',
    monthEn: 'Oct 2025',
    income: 2800000,
    expense: 1850000,
    budget: 3000000,
  },
  {
    month: '2025년 11월',
    monthEn: 'Nov 2025',
    income: 3050000,
    expense: 2000000,
    budget: 3200000,
  },
  {
    month: '2025년 12월',
    monthEn: 'Dec 2025',
    income: 3400000,
    expense: 2200000,
    budget: 3500000,
  },
  {
    month: '2026년 1월',
    monthEn: 'Jan 2026',
    income: 3200000,
    expense: 2100000,
    budget: 3400000,
  },
  {
    month: '2026년 2월',
    monthEn: 'Feb 2026',
    income: 3500000,
    expense: 2300000,
    budget: 3600000,
  },
  {
    month: '2026년 3월',
    monthEn: 'Mar 2026',
    income: 3840000,
    expense: 2567000,
    budget: 3900000,
  },
];

export const budgetCategories: BudgetCategory[] = [
  {
    category: '사업비',
    categoryEn: 'Programs',
    budget: 1500000,
    actual: 1350000,
    color: '#3B82F6',
  },
  {
    category: '인건비',
    categoryEn: 'Personnel',
    budget: 1200000,
    actual: 1040000,
    color: '#10B981',
  },
  {
    category: '관리비',
    categoryEn: 'Administration',
    budget: 700000,
    actual: 657000,
    color: '#F59E0B',
  },
  {
    category: '홍보비',
    categoryEn: 'Marketing',
    budget: 350000,
    actual: 320000,
    color: '#8B5CF6',
  },
  {
    category: '기타',
    categoryEn: 'Others',
    budget: 150000,
    actual: 120000,
    color: '#EF4444',
  },
];
