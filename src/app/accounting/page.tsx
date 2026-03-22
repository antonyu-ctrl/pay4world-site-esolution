'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import FilterTabs from '@/components/shared/FilterTabs';
import SectionHeader from '@/components/shared/SectionHeader';
import BarChartCard from '@/components/charts/BarChartCard';
import PieChartCard from '@/components/charts/PieChartCard';
import AreaChartCard from '@/components/charts/AreaChartCard';
import { transactions } from '@/data/transactions';
import { monthlyFinancials, budgetCategories } from '@/data/monthlyFinancials';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';

// Icons as inline SVG components
function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><line x1="10" x2="8" y1="9" y2="9" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const ITEMS_PER_PAGE = 10;

const monthOptions = [
  '2026년 3월',
  '2026년 2월',
  '2026년 1월',
  '2025년 12월',
  '2025년 11월',
  '2025년 10월',
];

// Expense category data for pie chart
const expenseCategoryData = [
  { name: '사업비', value: 35, color: '#3B82F6' },
  { name: '인건비', value: 40, color: '#10B981' },
  { name: '관리비', value: 15, color: '#F59E0B' },
  { name: '홍보비', value: 5, color: '#8B5CF6' },
  { name: '기타', value: 5, color: '#EF4444' },
];

// Cash flow forecast data
const cashFlowData = [
  { name: '1월', value: 1100000 },
  { name: '2월', value: 1200000 },
  { name: '3월', value: 1273000 },
  { name: '4월', value: 1350000, projected: true },
  { name: '5월', value: 1420000, projected: true },
  { name: '6월', value: 1500000, projected: true },
];

// Report definitions
const reports = [
  {
    id: 'report-01',
    titleKo: '월간 재무제표',
    titleEn: 'Monthly Financial Statement',
    descriptionKo: '수입·지출 명세서 및 잔액 현황',
    descriptionEn: 'Income/expense statement and balance',
    icon: 'calendar',
    downloadType: 'pdf' as const,
  },
  {
    id: 'report-02',
    titleKo: '사업비 집행 보고서',
    titleEn: 'Program Expense Report',
    descriptionKo: '항목별 지출 내역 및 비율 분석',
    descriptionEn: 'Itemized expense details and ratio analysis',
    icon: 'trending',
    downloadType: 'pdf' as const,
  },
  {
    id: 'report-03',
    titleKo: '기부금 영수증 발행 내역',
    titleEn: 'Donation Receipt Records',
    descriptionKo: '월별 영수증 발행 목록 및 통계',
    descriptionEn: 'Monthly receipt issuance list and statistics',
    icon: 'file',
    downloadType: 'excel' as const,
  },
  {
    id: 'report-04',
    titleKo: '세금계산서 관리',
    titleEn: 'Tax Invoice Management',
    descriptionKo: '지출 항목 세금계산서 통합 관리',
    descriptionEn: 'Integrated tax invoice management for expenses',
    icon: 'receipt',
    downloadType: 'link' as const,
  },
];

function getReportIcon(icon: string) {
  switch (icon) {
    case 'calendar':
      return <CalendarIcon />;
    case 'trending':
      return <TrendingUpIcon />;
    case 'file':
      return <FileTextIcon />;
    case 'receipt':
      return <ReceiptIcon />;
    default:
      return <FileTextIcon />;
  }
}

export default function AccountingPage() {
  const { lang, t } = useLanguage();

  // State
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [monthSelector, setMonthSelector] = useState('2026년 3월');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: 'income' as 'income' | 'expense',
    description: '',
    category: '',
    amount: '',
  });

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === transactionFilter);
  }, [transactionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Chart data
  const barChartData = monthlyFinancials.map((mf) => ({
    name: lang === 'ko' ? mf.month.replace('년 ', '.').replace('월', '') : mf.monthEn,
    income: mf.income,
    expense: mf.expense,
  }));

  const filterOptions = [
    { id: 'all', label: lang === 'ko' ? '전체' : 'All' },
    { id: 'income', label: lang === 'ko' ? '수입' : 'Income' },
    { id: 'expense', label: lang === 'ko' ? '지출' : 'Expense' },
  ];

  const handleFilterChange = (id: string) => {
    setTransactionFilter(id);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lang === 'ko' ? '재무 현황' : 'Financial Overview'}</h1>
          <p className="text-gray-500 mt-1">{lang === 'ko' ? '단체의 재무 현황을 관리하세요' : 'Manage your organization\'s finances'}</p>
        </div>
        {/* Month Selector */}
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <CalendarIcon />
            {monthSelector}
            <ChevronDownIcon />
          </button>
          {showMonthDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {monthOptions.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setMonthSelector(month);
                    setShowMonthDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    month === monthSelector ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 1 - Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'ko' ? '이번 달 후원금 수입' : 'Monthly Donation Income'}
          value="₩3,420,000"
          subtitle={lang === 'ko' ? '전월 대비 12.5% 증가' : '12.5% increase from last month'}
          icon={<WalletIcon />}
          gradient={STAT_GRADIENTS.green}
        />
        <StatCard
          title={lang === 'ko' ? '이번 달 사업비 지출' : 'Monthly Program Expense'}
          value="₩2,180,000"
          subtitle={lang === 'ko' ? '전월 대비 8.3% 증가' : '8.3% increase from last month'}
          icon={<CreditCardIcon />}
          gradient={STAT_GRADIENTS.red}
        />
        <StatCard
          title={lang === 'ko' ? '활성 후원자' : 'Active Donors'}
          value={lang === 'ko' ? '1,234명' : '1,234'}
          subtitle={lang === 'ko' ? '신규 28명' : '28 new donors'}
          icon={<UsersIcon />}
          gradient={STAT_GRADIENTS.purple}
        />
        <StatCard
          title={lang === 'ko' ? '플랫폼 수수료 (3%)' : 'Platform Fee (3%)'}
          value="₩102,600"
          subtitle={lang === 'ko' ? '회계·세무·홍보 서비스 포함' : 'Incl. accounting, tax & marketing'}
          icon={<PercentIcon />}
          gradient={STAT_GRADIENTS.orange}
        />
      </div>

      {/* Section 2 - Monthly Income/Expense Chart */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '월별 수입/지출 현황' : 'Monthly Income/Expense'}
          action={
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                {lang === 'ko' ? '수입' : 'Income'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                {lang === 'ko' ? '지출' : 'Expense'}
              </span>
            </div>
          }
          className="mb-6"
        />
        <BarChartCard
          data={barChartData}
          bars={[
            { dataKey: 'income', name: lang === 'ko' ? '수입' : 'Income', color: '#10B981' },
            { dataKey: 'expense', name: lang === 'ko' ? '지출' : 'Expense', color: '#EF4444' },
          ]}
        />
      </Card>

      {/* Section 3 - Budget vs Actual */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '예산 대비 실적' : 'Budget vs Actual'}
          subtitle={lang === 'ko' ? '카테고리별 예산 집행 현황' : 'Budget execution by category'}
          className="mb-6"
        />
        <div className="space-y-5">
          {budgetCategories.map((cat) => {
            const percentage = Math.round((cat.actual / cat.budget) * 100);
            const isOver = cat.actual > cat.budget;
            return (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {lang === 'ko' ? cat.category : cat.categoryEn}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {formatCurrency(cat.actual)} / {formatCurrency(cat.budget)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isOver
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  {/* Budget bar (full width as reference) */}
                  <div className="absolute inset-0 h-full rounded-full bg-blue-100" />
                  {/* Actual bar */}
                  <div
                    className="absolute inset-y-0 left-0 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOver ? '#EF4444' : cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 4 - Expense Category Breakdown */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '지출 카테고리 분석' : 'Expense Category Analysis'}
          subtitle={lang === 'ko' ? '이번 달 지출 항목별 비율' : 'Monthly expense breakdown by category'}
          className="mb-4"
        />
        <PieChartCard
          data={expenseCategoryData.map((d) => ({
            ...d,
            name: lang === 'ko' ? d.name : (
              d.name === '사업비' ? 'Programs' :
              d.name === '인건비' ? 'Personnel' :
              d.name === '관리비' ? 'Administration' :
              d.name === '홍보비' ? 'Marketing' :
              'Others'
            ),
          }))}
        />
      </Card>

      {/* Section 5 - Cash Flow Forecast */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '현금 흐름 예측' : 'Cash Flow Forecast'}
          subtitle={lang === 'ko' ? '실제 데이터 기반 3개월 예측' : '3-month forecast based on actual data'}
          action={
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                {lang === 'ko' ? '실적' : 'Actual'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-300 inline-block" />
                {lang === 'ko' ? '예측' : 'Projected'}
              </span>
            </div>
          }
          className="mb-6"
        />
        <AreaChartCard
          data={cashFlowData}
          projectedStartIndex={3}
          color="#3B82F6"
          projectedColor="#93C5FD"
          yAxisFormatter={(v) => {
            if (v >= 10000) return `${(v / 10000).toFixed(0)}만`;
            return v.toLocaleString();
          }}
        />
      </Card>

      {/* Section 6 - Transaction Table */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '최근 거래 내역' : 'Recent Transactions'}
          action={
            <div className="flex items-center gap-3">
              <FilterTabs
                options={filterOptions}
                activeId={transactionFilter}
                onChange={handleFilterChange}
              />
              <button
                onClick={() => setShowAddTransaction(!showAddTransaction)}
                className="w-9 h-9 rounded-full bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center transition-colors"
                aria-label={lang === 'ko' ? '거래 추가' : 'Add transaction'}
              >
                <PlusIcon />
              </button>
            </div>
          }
          className="mb-4"
        />

        {/* Quick Add Form */}
        {showAddTransaction && (
          <div className="mb-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">{lang === 'ko' ? '새 거래 추가' : 'Add New Transaction'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder={lang === 'ko' ? '날짜' : 'Date'}
              />
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="income">{lang === 'ko' ? '수입' : 'Income'}</option>
                <option value="expense">{lang === 'ko' ? '지출' : 'Expense'}</option>
              </select>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder={lang === 'ko' ? '내용' : 'Description'}
              />
              <input
                type="text"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder={lang === 'ko' ? '분류' : 'Category'}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder={lang === 'ko' ? '금액' : 'Amount'}
                />
                <Button size="sm" onClick={() => setShowAddTransaction(false)}>
                  {lang === 'ko' ? '추가' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {paginatedTransactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{tx.date}</span>
                <Badge
                  variant={tx.type === 'income' ? 'income' : 'expense'}
                  label={
                    tx.type === 'income'
                      ? lang === 'ko'
                        ? '수입'
                        : 'Income'
                      : lang === 'ko'
                      ? '지출'
                      : 'Expense'
                  }
                />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {lang === 'ko' ? tx.description : tx.descriptionEn}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {lang === 'ko' ? tx.category : tx.categoryEn}
              </p>
              <p
                className={`text-lg font-bold ${
                  tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Transaction Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '날짜' : 'Date'}</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '구분' : 'Type'}</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '내용' : 'Description'}</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '분류' : 'Category'}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '금액' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={tx.type === 'income' ? 'income' : 'expense'}
                      label={
                        tx.type === 'income'
                          ? lang === 'ko'
                            ? '수입'
                            : 'Income'
                          : lang === 'ko'
                          ? '지출'
                          : 'Expense'
                      }
                    />
                  </td>
                  <td className="py-3 px-3 text-gray-800">
                    {lang === 'ko' ? tx.description : tx.descriptionEn}
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    {lang === 'ko' ? tx.category : tx.categoryEn}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-semibold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </Card>

      {/* Section 7 - Auto-Generated Reports */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '자동 회계 보고서' : 'Auto-Generated Reports'}
          subtitle={
            lang === 'ko'
              ? 'PayForward가 자동으로 생성하는 전문 회계 보고서'
              : 'Professional accounting reports auto-generated by PayForward'
          }
          className="mb-6"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 border border-gray-200 rounded-xl hover:border-brand-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  {getReportIcon(report.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {lang === 'ko' ? report.titleKo : report.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'ko' ? report.descriptionKo : report.descriptionEn}
                  </p>
                  <div className="mt-3">
                    {report.downloadType === 'pdf' && (
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        <DownloadIcon />
                        PDF {lang === 'ko' ? '다운로드' : 'Download'}
                      </button>
                    )}
                    {report.downloadType === 'excel' && (
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                        <DownloadIcon />
                        Excel {lang === 'ko' ? '다운로드' : 'Download'}
                      </button>
                    )}
                    {report.downloadType === 'link' && (
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        <ExternalLinkIcon />
                        {lang === 'ko' ? '관리 페이지로' : 'Go to management'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="text-blue-600 shrink-0 mt-0.5">
            <InfoIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              {lang === 'ko' ? '자동화 서비스' : 'Automation Service'}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              {lang === 'ko'
                ? '모든 보고서는 매월 초 자동 생성되며, 이메일로 전송됩니다.'
                : 'All reports are auto-generated at the beginning of each month and sent via email.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
