'use client';

import { useState, useMemo } from 'react';
import {
  Heart, Calculator, Download, TrendingUp, ArrowUpRight,
  Receipt, Shield, ChevronDown,
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatCurrency, calcTaxDeduction, cn, formatDate } from '@/lib/utils';
import { donationRecords } from '@/data/donations';
// types used inline via record.type
import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import FilterTabs from '@/components/shared/FilterTabs';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';

export default function TaxPage() {
  const { t, lang } = useLanguage();

  const [selectedYear, setSelectedYear] = useState(2026);
  const [salaryInput, setSalaryInput] = useState(50000000);
  const [showCalculation, setShowCalculation] = useState(false);
  const [receiptFilter, setReceiptFilter] = useState('all');

  // Filter donations by year
  const yearDonations = useMemo(() => {
    return donationRecords.filter((d) => d.date.startsWith(String(selectedYear)));
  }, [selectedYear]);

  const prevYearDonations = useMemo(() => {
    return donationRecords.filter((d) => d.date.startsWith(String(selectedYear - 1)));
  }, [selectedYear]);

  // Stats
  const totalDonations = yearDonations.reduce((sum, d) => sum + d.amount, 0);
  const prevYearTotal = prevYearDonations.reduce((sum, d) => sum + d.amount, 0);
  const taxDeductionEligible = calcTaxDeduction(salaryInput, totalDonations).totalDeduction;
  const donationCount = yearDonations.length;
  const yoyChange = prevYearTotal > 0 ? Math.round(((totalDonations - prevYearTotal) / prevYearTotal) * 100) : 0;

  // Donation goal
  const donationGoal = 2000000;
  const goalProgress = Math.min((totalDonations / donationGoal) * 100, 100);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNum = String(i + 1).padStart(2, '0');
      const monthName = lang === 'ko'
        ? `${i + 1}월`
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
      const total = yearDonations
        .filter((d) => d.date.substring(5, 7) === monthNum)
        .reduce((sum, d) => sum + d.amount, 0);
      return { name: monthName, amount: total };
    });
    // Only show months up to the current month's data (or that have data)
    const lastNonZero = months.reduce((acc, m, i) => (m.amount > 0 ? i : acc), 0);
    return months.slice(0, Math.max(lastNonZero + 2, 6));
  }, [yearDonations, lang, selectedYear]);

  // Tax calculation
  const taxCalc = useMemo(() => {
    return calcTaxDeduction(salaryInput, totalDonations);
  }, [salaryInput, totalDonations]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    if (receiptFilter === 'all') return yearDonations;
    return yearDonations.filter((d) => d.type === receiptFilter);
  }, [yearDonations, receiptFilter]);

  const receiptFilterOptions = [
    { id: 'all', label: lang === 'ko' ? '전체' : 'All' },
    { id: 'onetime', label: t.donation.oneTime },
    { id: 'recurring', label: t.donation.recurring },
  ];

  const yearOptions = [2024, 2025, 2026];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.tax.title}</h1>
        <p className="text-gray-500 mt-1">{t.tax.subtitle}</p>
      </div>

      {/* ===================== Section 1: Donation Goal Tracker ===================== */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
              <Heart className="w-4 h-4 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{lang === 'ko' ? '올해 기부 목표' : 'Donation Goal This Year'}</h2>
          </div>
          <span className="text-sm text-gray-500">{selectedYear}{t.common.year}</span>
        </div>

        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-brand-600">{formatCurrency(totalDonations)}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-gray-500">{formatCurrency(donationGoal)}</span>
          </div>
          <span className="text-sm font-semibold text-brand-600">{Math.round(goalProgress)}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-700"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {lang === 'ko'
            ? `목표까지 ${formatCurrency(Math.max(donationGoal - totalDonations, 0))} 남았습니다`
            : `${formatCurrency(Math.max(donationGoal - totalDonations, 0))} remaining to reach your goal`}
        </p>
      </Card>

      {/* ===================== Section 2: Monthly Donation Trend ===================== */}
      <Card>
        <SectionHeader
          title={t.tax.donationTrend}
          subtitle={lang === 'ko' ? `${selectedYear}년 월별 기부 현황` : `Monthly donations for ${selectedYear}`}
        />
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => {
                  if (v >= 10000) return `${(v / 10000).toFixed(0)}만`;
                  return v.toLocaleString();
                }}
              />
              <Tooltip
                formatter={(value: unknown) => [formatCurrency(Number(value)), lang === 'ko' ? '기부금' : 'Donation']}
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3B82F6' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ===================== Section 3: Dashboard Stats ===================== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{t.tax.myDonation}</h2>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}{t.tax.year}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={lang === 'ko' ? '올해 총 기부금' : 'Total Donations This Year'}
          value={formatCurrency(totalDonations)}
          icon={<Heart className="w-5 h-5" />}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title={lang === 'ko' ? '세액공제 가능액' : 'Tax Deductible Amount'}
          value={formatCurrency(taxDeductionEligible)}
          subtitle={yoyChange !== 0 ? `${yoyChange > 0 ? '↑' : '↓'} ${Math.abs(yoyChange)}% ${t.tax.vsLastYear}` : undefined}
          icon={<TrendingUp className="w-5 h-5" />}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title={lang === 'ko' ? '기부 건수' : 'Donation Count'}
          value={`${donationCount}${t.common.count}`}
          icon={<Receipt className="w-5 h-5" />}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* ===================== Section 4: Tax Calculator ===================== */}
      <Card>
        <SectionHeader
          title={t.tax.calculator}
          subtitle={t.tax.calculatorDesc}
        />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Annual salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.tax.annualSalary}</label>
            <div className="relative">
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{t.common.won}</span>
            </div>
          </div>
          {/* Total donations (auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.tax.totalDonationsInput}</label>
            <div className="relative">
              <input
                type="text"
                value={formatCurrency(totalDonations)}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowCalculation(true)}
          className="mt-4"
          size="md"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {t.tax.calculate}
        </Button>

        {/* Results */}
        {showCalculation && (
          <div className="mt-5 bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">{t.tax.result}</h3>

            {/* Total deduction highlight */}
            <div className="bg-brand-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{lang === 'ko' ? '기부금 세액공제' : 'Donation Tax Deduction'}</p>
              <p className="text-3xl font-bold text-brand-600">{formatCurrency(taxCalc.totalDeduction)}</p>
            </div>

            {/* Estimated refund */}
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{lang === 'ko' ? '예상 환급액' : 'Estimated Refund'}</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(taxCalc.totalDeduction)}</p>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-3">
              {/* Base deduction */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{t.tax.baseDeduction}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(taxCalc.baseDeduction)}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${taxCalc.totalDeduction > 0 ? (taxCalc.baseDeduction / taxCalc.totalDeduction) * 100 : 0}%` }}
                  />
                </div>
              </div>
              {/* Additional deduction */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{t.tax.additionalDeduction}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(taxCalc.additionalDeduction)}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${taxCalc.totalDeduction > 0 ? (taxCalc.additionalDeduction / taxCalc.totalDeduction) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              {lang === 'ko'
                ? '※ 다른 공제 항목을 고려하지 않은 추정치입니다'
                : '※ This is an estimate that does not account for other deduction items'}
            </p>
          </div>
        )}
      </Card>

      {/* ===================== Section 5: Receipt Table ===================== */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '기부금 영수증 목록' : 'Donation Receipt List'}
          action={
            <FilterTabs
              options={receiptFilterOptions}
              activeId={receiptFilter}
              onChange={setReceiptFilter}
            />
          }
        />

        {/* Mobile Card View */}
        <div className="mt-4 md:hidden space-y-3">
          {filteredReceipts.map((record) => (
            <div key={record.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={record.type as 'onetime' | 'recurring'}
                    label={record.type === 'onetime' ? t.donation.oneTime : t.donation.recurring}
                  />
                  <button
                    onClick={() => alert(`${t.tax.downloadComplete}: ${record.receiptId}`)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-brand-600"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {lang === 'ko' ? record.organizationName : record.organizationNameEn}
              </p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(record.amount)}</p>
            </div>
          ))}
          {filteredReceipts.length === 0 && (
            <div className="py-8 text-center text-gray-400">{t.tax.noReceipts}</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="mt-4 overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">{t.tax.donationDate}</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">{t.tax.orgName}</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500">{t.tax.donationAmount}</th>
                <th className="text-center py-3 px-2 font-medium text-gray-500">{t.tax.donationType}</th>
                <th className="text-center py-3 px-2 font-medium text-gray-500">{t.tax.receipt}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 text-gray-700">{formatDate(record.date)}</td>
                  <td className="py-3 px-2 font-medium text-gray-900">
                    {lang === 'ko' ? record.organizationName : record.organizationNameEn}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-900">{formatCurrency(record.amount)}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge
                      variant={record.type as 'onetime' | 'recurring'}
                      label={record.type === 'onetime' ? t.donation.oneTime : t.donation.recurring}
                    />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => alert(`${t.tax.downloadComplete}: ${record.receiptId}`)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-brand-600"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">{t.tax.noReceipts}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Batch download */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={() => alert(t.tax.downloadComplete)}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            {lang === 'ko' ? '전체 영수증 일괄 다운로드 (PDF)' : 'Batch Download All Receipts (PDF)'}
          </Button>
        </div>
      </Card>

      {/* ===================== Section 6: Tax Filing CTA ===================== */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{lang === 'ko' ? '종합소득세 신고 대리 서비스' : 'Tax Filing Agent Service'}</h2>
              <p className="text-white/70 text-sm">{lang === 'ko' ? '전문 세무사가 대신 신고해 드립니다' : 'Professional tax accountants will file for you'}</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/80 rounded-full shrink-0" />
              {lang === 'ko' ? '기부금 영수증 자동 수집 및 정리' : 'Automatic collection and organization of donation receipts'}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/80 rounded-full shrink-0" />
              {lang === 'ko' ? '최대 환급을 위한 맞춤 세액공제 적용' : 'Custom tax deduction application for maximum refund'}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/80 rounded-full shrink-0" />
              {lang === 'ko' ? '국세청 전자신고 대행' : 'National Tax Service e-filing on your behalf'}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/80 rounded-full shrink-0" />
              {lang === 'ko' ? '신고 완료 후 결과 리포트 제공' : 'Post-filing result report provided'}
            </li>
          </ul>

          <button
            onClick={() => alert(lang === 'ko' ? '신고 대리 신청 (데모)' : 'Tax filing request (demo)')}
            className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            {lang === 'ko' ? '신고 대리 신청하기' : 'Request Tax Filing Service'}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
