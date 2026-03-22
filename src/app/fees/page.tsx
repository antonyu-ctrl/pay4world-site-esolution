'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { orgFees, feeTiers } from '@/data/orgFees';
import { revenueData } from '@/data/revenueData';
import { formatCurrency, formatNumber, formatCurrencyShort } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';

import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import SearchInput from '@/components/shared/SearchInput';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import LineChartCard from '@/components/charts/LineChartCard';
import PieChartCard from '@/components/charts/PieChartCard';

import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  ChevronDown,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Calendar,
  FileText,
  Megaphone,
  BarChart3,
  ArrowRight,
  Check,
  RotateCcw,
  Save,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const monthOptions = [
  '2026년 3월',
  '2026년 2월',
  '2026년 1월',
  '2025년 12월',
  '2025년 11월',
  '2025년 10월',
];

export default function FeesPage() {
  const { lang, t } = useLanguage();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatorDonations, setSimulatorDonations] = useState(10000000);
  const [simulatorTier, setSimulatorTier] = useState<'basic' | 'preferred' | 'special'>('basic');
  const [monthSelector, setMonthSelector] = useState('2026년 3월');

  // Filtered org fees
  const filteredOrgFees = useMemo(() => {
    if (!searchQuery) return orgFees;
    const q = searchQuery.toLowerCase();
    return orgFees.filter(
      (org) =>
        org.orgName.toLowerCase().includes(q) ||
        org.orgNameEn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredOrgFees.length / ITEMS_PER_PAGE);
  const paginatedFees = filteredOrgFees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Fee simulator calculations
  const simulatorResults = useMemo(() => {
    const rates: Record<string, number> = { basic: 3.0, preferred: 2.5, special: 2.0 };
    const rate = rates[simulatorTier];
    const monthlyFee = Math.round(simulatorDonations * (rate / 100));
    const annualFee = monthlyFee * 12;
    const tierIndex = simulatorTier === 'basic' ? 0 : simulatorTier === 'preferred' ? 1 : 2;
    const services = lang === 'ko' ? feeTiers[tierIndex].servicesKo : feeTiers[tierIndex].servicesEn;
    return { rate, monthlyFee, annualFee, services };
  }, [simulatorDonations, simulatorTier, lang]);

  // Revenue chart data
  const chartData = revenueData.map((d) => ({
    name: lang === 'ko' ? d.month.replace('년 ', '.').replace('월', '') : d.monthEn,
    feeRevenue: d.feeRevenue,
    totalDonations: d.totalDonations,
  }));

  // Tier distribution data
  const tierDistribution = [
    { name: lang === 'ko' ? '기본 (30단체)' : 'Standard (30)', value: 63, color: '#3B82F6' },
    { name: lang === 'ko' ? '우대 (12단체)' : 'Preferred (12)', value: 25, color: '#10B981' },
    { name: lang === 'ko' ? '특별 (6단체)' : 'Special (6)', value: 12, color: '#8B5CF6' },
  ];

  // Status badge rendering
  const renderStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'active' | 'leave' | 'resigned'; label: string }> = {
      active: { variant: 'active', label: lang === 'ko' ? '활발' : 'Active' },
      declining: { variant: 'leave', label: lang === 'ko' ? '감소' : 'Declining' },
      churned: { variant: 'resigned', label: lang === 'ko' ? '이탈' : 'Churned' },
    };
    const s = map[status] || map.active;
    return <Badge variant={s.variant} label={s.label} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">{t.fees.title}</h1>
          <div className="relative shrink-0">
            <select
              value={monthSelector}
              onChange={(e) => setMonthSelector(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <p className="text-gray-500 mt-1">{t.fees.subtitle}</p>
      </div>

      {/* Section 1 - Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={lang === 'ko' ? '이번 달 총 수수료 수익' : 'Monthly Fee Revenue'}
            value={formatCurrencyShort(4280000)}
            subtitle={lang === 'ko' ? '전월 대비 15.2% 증가' : '15.2% increase from last month'}
            icon={<DollarSign />}
            gradient={STAT_GRADIENTS.blue}
          />
          <StatCard
            title={lang === 'ko' ? '이번 달 총 기부금액' : 'Monthly Total Donations'}
            value={formatCurrencyShort(142680000)}
            subtitle={lang === 'ko' ? '평균 수수료율 3.0%' : 'Avg. fee rate 3.0%'}
            icon={<TrendingUp />}
            gradient={STAT_GRADIENTS.green}
          />
          <StatCard
            title={lang === 'ko' ? '활성 단체 수' : 'Active Organizations'}
            value={lang === 'ko' ? '48개' : '48'}
            subtitle={lang === 'ko' ? '신규 3개' : '3 new'}
            icon={<Building2 />}
            gradient={STAT_GRADIENTS.purple}
          />
          <StatCard
            title={lang === 'ko' ? '활성 기부자 수' : 'Active Donors'}
            value={lang === 'ko' ? '12,458명' : '12,458'}
            subtitle={lang === 'ko' ? '신규 324명' : '324 new'}
            icon={<Users />}
            gradient={STAT_GRADIENTS.orange}
          />
        </div>

      {/* Section 2 - Revenue Trend Chart */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '월별 수익 추이' : 'Monthly Revenue Trend'}
          action={
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span className="text-gray-600">{lang === 'ko' ? '수수료 수익' : 'Fee Revenue'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-600">{lang === 'ko' ? '총 기부금액' : 'Total Donations'}</span>
              </div>
            </div>
          }
        />
        <div className="mt-6">
          <LineChartCard
            data={chartData}
            dualAxis
            lines={[
              { dataKey: 'feeRevenue', name: lang === 'ko' ? '수수료 수익' : 'Fee Revenue', color: '#3B82F6', yAxisId: 'left' },
              { dataKey: 'totalDonations', name: lang === 'ko' ? '총 기부금액' : 'Total Donations', color: '#10B981', type: 'area', yAxisId: 'right' },
            ]}
            height={340}
          />
        </div>
      </Card>

      {/* Section 3 - Tier Distribution Chart */}
      <Card>
        <SectionHeader title={lang === 'ko' ? '수수료 등급 분포' : 'Fee Tier Distribution'} />
        <div className="mt-4">
          <PieChartCard data={tierDistribution} height={300} innerRadius={70} outerRadius={110} />
        </div>
      </Card>

      {/* Section 4 - Organization Fee Table */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '단체별 수수료 내역' : 'Organization Fee Details'}
          action={
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SearchInput
                placeholder={lang === 'ko' ? '단체명 검색...' : 'Search org...'}
                value={searchQuery}
                onChange={handleSearch}
                className="flex-1 sm:w-56 sm:flex-none"
              />
              <Button variant="secondary" size="sm" className="shrink-0">
                <Download className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">{lang === 'ko' ? 'Excel 다운로드' : 'Export Excel'}</span>
              </Button>
            </div>
          }
        />

        {/* Mobile Card View */}
        <div className="mt-5 md:hidden space-y-3">
          {paginatedFees.map((org) => (
            <div key={org.rank} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {org.rank}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {lang === 'ko' ? org.orgName : org.orgNameEn}
                  </span>
                </div>
                {renderStatusBadge(org.activityStatus)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{lang === 'ko' ? '후원 총액' : 'Total Donations'}</p>
                  <p className="font-medium text-gray-900">{formatCurrency(org.totalDonations)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.fees.feeAmount}</p>
                  <p className="font-medium text-gray-900">{formatCurrency(org.feeAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.fees.feeRate}</p>
                  <span
                    className={
                      org.feeRate !== 3.0
                        ? 'text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md text-xs'
                        : 'text-gray-700 text-sm'
                    }
                  >
                    {org.feeRate.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t.fees.donorCount}</p>
                  <p className="text-sm text-gray-700">{formatNumber(org.donorCount)}{lang === 'ko' ? '명' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="mt-5 overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.fees.rank}</th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">{t.fees.orgName}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '후원 총액' : 'Total Donations'}</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">{t.fees.feeRate}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.fees.feeAmount}</th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">{t.fees.donorCount}</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '상태' : 'Status'}</th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">{lang === 'ko' ? '관리' : 'Manage'}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFees.map((org) => (
                <tr key={org.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-900 font-medium">{org.rank}</td>
                  <td className="py-3 px-3 text-gray-900 font-medium">
                    {lang === 'ko' ? org.orgName : org.orgNameEn}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(org.totalDonations)}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={
                        org.feeRate !== 3.0
                          ? 'text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md'
                          : 'text-gray-700'
                      }
                    >
                      {org.feeRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(org.feeAmount)}</td>
                  <td className="py-3 px-3 text-right text-gray-700">{formatNumber(org.donorCount)}{lang === 'ko' ? '명' : ''}</td>
                  <td className="py-3 px-3 text-center">{renderStatusBadge(org.activityStatus)}</td>
                  <td className="py-3 px-3 text-center">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
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
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>

      {/* Section 5 - Fee Simulator */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '수수료 시뮬레이터' : 'Fee Simulator'}
          subtitle={
            lang === 'ko'
              ? '단체의 월 기부금과 등급을 입력하면 예상 수수료를 계산합니다'
              : 'Enter monthly donations and tier to estimate fees'
          }
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Monthly Donation Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ko' ? '월 기부금' : 'Monthly Donations'}
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={simulatorDonations}
                  onChange={(e) => setSimulatorDonations(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="10,000,000"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatCurrency(simulatorDonations)}</p>
            </div>

            {/* Tier Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ko' ? '수수료 등급' : 'Fee Tier'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'basic' as const, labelKo: '기본', labelEn: 'Standard', rate: '3.0%' },
                  { id: 'preferred' as const, labelKo: '우대', labelEn: 'Preferred', rate: '2.5%' },
                  { id: 'special' as const, labelKo: '특별', labelEn: 'Special', rate: '2.0%' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSimulatorTier(tier.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                      simulatorTier === tier.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-sm font-semibold">{lang === 'ko' ? tier.labelKo : tier.labelEn}</span>
                    <span className="text-xs">{tier.rate}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {lang === 'ko' ? '예상 수수료' : 'Estimated Fees'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{lang === 'ko' ? '월 수수료' : 'Monthly Fee'}</span>
                <span className="text-xl font-bold text-brand-700">{formatCurrency(simulatorResults.monthlyFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{lang === 'ko' ? '연간 수수료' : 'Annual Fee'}</span>
                <span className="text-lg font-bold text-gray-800">{formatCurrency(simulatorResults.annualFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{lang === 'ko' ? '적용 수수료율' : 'Applied Rate'}</span>
                <span className="text-lg font-semibold text-blue-600">{simulatorResults.rate.toFixed(1)}%</span>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {lang === 'ko' ? '포함 서비스' : 'Included Services'}
                </p>
                <ul className="space-y-1.5">
                  {simulatorResults.services.map((svc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {svc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 6 - Fee Tier Configuration */}
      <div>
        <SectionHeader
          title={lang === 'ko' ? '수수료율 설정' : 'Fee Rate Configuration'}
          subtitle={
            lang === 'ko'
              ? '단체 규모와 특성에 따라 수수료율을 차등 적용할 수 있습니다'
              : 'Fee rates can be adjusted based on organization size and characteristics'
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {feeTiers.map((tier, idx) => {
            const bgColors = ['bg-white border-blue-100', 'bg-blue-50/50 border-blue-200', 'bg-yellow-50/50 border-yellow-200'];
            const badgeVariants: Array<'admin' | 'customer' | 'organization'> = ['customer', 'organization', 'admin'];
            return (
              <Card
                key={idx}
                className={`border-2 ${bgColors[idx]} relative`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">
                    {lang === 'ko' ? `${tier.nameKo} 수수료율` : `${tier.nameEn} Fee Rate`}
                  </h3>
                  <Badge
                    variant={badgeVariants[idx]}
                    label={lang === 'ko' ? tier.badgeKo : tier.badgeEn}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {lang === 'ko' ? tier.descriptionKo : tier.descriptionEn}
                </p>

                {/* Rate display */}
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="text"
                    value={`${tier.rate.toFixed(1)}%`}
                    readOnly
                    className="w-24 text-center text-2xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl py-2 cursor-default"
                  />
                </div>

                {/* Services list */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    {lang === 'ko' ? '포함 서비스' : 'Included Services'}
                  </p>
                  <ul className="space-y-1.5">
                    {(lang === 'ko' ? tier.servicesKo : tier.servicesEn).map((svc, si) => (
                      <li key={si} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {svc}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="ghost" size="md">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {lang === 'ko' ? '초기화' : 'Reset'}
          </Button>
          <Button variant="primary" size="md">
            <Save className="w-4 h-4 mr-1.5" />
            {lang === 'ko' ? '설정 저장' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Section 7 - Value Proposition */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? 'PayForward 가치 제안' : 'PayForward Value Proposition'}
          subtitle={
            lang === 'ko'
              ? '단체가 지불하는 3%의 수수료로 제공되는 서비스:'
              : 'Services provided with a 3% fee:'
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {
              icon: <Calendar className="w-6 h-6 text-blue-500" />,
              titleKo: '전문 회계 서비스',
              titleEn: 'Professional Accounting',
              valueKo: '월 50만원 상당',
              valueEn: 'Worth 500K/mo',
              bgColor: 'bg-blue-50',
            },
            {
              icon: <FileText className="w-6 h-6 text-emerald-500" />,
              titleKo: '세무 대리 서비스',
              titleEn: 'Tax Agency Service',
              valueKo: '연 300만원 상당',
              valueEn: 'Worth 3M/yr',
              bgColor: 'bg-emerald-50',
            },
            {
              icon: <Megaphone className="w-6 h-6 text-purple-500" />,
              titleKo: '마케팅 홍보 지원',
              titleEn: 'Marketing Support',
              valueKo: '월 100만원 상당',
              valueEn: 'Worth 1M/mo',
              bgColor: 'bg-purple-50',
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
              titleKo: '데이터 분석 도구',
              titleEn: 'Data Analytics Tools',
              valueKo: '월 30만원 상당',
              valueEn: 'Worth 300K/mo',
              bgColor: 'bg-orange-50',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.bgColor} rounded-xl p-5 text-center`}>
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {lang === 'ko' ? item.titleKo : item.titleEn}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'ko' ? item.valueKo : item.valueEn}
              </p>
            </div>
          ))}
        </div>
        {/* Bottom summary */}
        <div className="mt-6 bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-4 flex items-center gap-3">
          <ArrowRight className="w-5 h-5 text-brand-600 shrink-0" />
          <p className="text-sm font-medium text-brand-700">
            {lang === 'ko'
              ? '총 가치: 연간 약 2,160만원 상당의 서비스를 3% 수수료로 제공'
              : 'Total value: ~21.6M KRW/year in services provided for a 3% fee'}
          </p>
        </div>
      </Card>
    </div>
  );
}
