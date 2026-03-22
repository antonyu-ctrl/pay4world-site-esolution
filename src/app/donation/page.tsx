'use client';

import { useState, useMemo } from 'react';
import {
  Building, Heart, ChevronRight, CheckCircle2, CreditCard, Building2,
  Smartphone, Download, Share2, Users, X, Info,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatCurrency, calcTaxDeduction, cn, formatNumber } from '@/lib/utils';
import { CATEGORIES, AMOUNT_PRESETS, PAYMENT_METHODS } from '@/lib/constants';
import { organizations } from '@/data/organizations';
import { recentDonorTicker } from '@/data/donations';
import type { Organization, PaymentMethod as PaymentMethodType, DonationType } from '@/types';
import ProgressSteps from '@/components/shared/ProgressSteps';
import SearchInput from '@/components/shared/SearchInput';
import FilterTabs from '@/components/shared/FilterTabs';
import Button from '@/components/shared/Button';

const PAYMENT_ICONS: Record<string, React.ReactElement> = {
  CreditCard: <CreditCard className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
};

export default function DonationPage() {
  const { t, lang } = useLanguage();

  // Wizard state
  const [step, setStep] = useState(1);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<DonationType>('onetime');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showOrgDetail, setShowOrgDetail] = useState<Organization | null>(null);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentReceipt, setConsentReceipt] = useState(false);
  const [recurringDay, setRecurringDay] = useState<1 | 15>(1);
  const [recurringDuration, setRecurringDuration] = useState<string>('12');

  // Filtered organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesCategory = categoryFilter === 'all' || org.category === categoryFilter;
      const name = lang === 'ko' ? org.name : org.nameEn;
      const desc = lang === 'ko' ? org.description : org.descriptionEn;
      const matchesSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery, lang]);

  // Current amount (from preset or custom)
  const currentAmount = amount > 0 ? amount : (parseInt(customAmount) || 0);

  // Impact description for current amount
  const impactDescription = useMemo(() => {
    if (!selectedOrg || currentAmount <= 0) return null;
    const impacts = selectedOrg.impactDescriptions;
    // Find the best matching impact (highest amount that doesn't exceed currentAmount)
    let best = impacts[0];
    for (const impact of impacts) {
      if (impact.amount <= currentAmount) best = impact;
    }
    if (!best) return null;
    const count = Math.floor(currentAmount / best.amount);
    const desc = lang === 'ko' ? best.descriptionKo : best.descriptionEn;
    return count > 1 ? `${desc} (x${count})` : desc;
  }, [selectedOrg, currentAmount, lang]);

  // Tax deduction estimate
  const taxEstimate = useMemo(() => {
    if (currentAmount <= 0) return 0;
    return calcTaxDeduction(50000000, currentAmount).totalDeduction;
  }, [currentAmount]);

  // Steps config
  const steps = [
    { number: 1, label: t.donation.step1Title },
    { number: 2, label: t.donation.step2Title },
    { number: 3, label: t.donation.step3Title },
    { number: 4, label: t.donation.step4Title },
  ];

  // Generate receipt ID
  const receiptId = `DON-2026-${String(Math.floor(Math.random() * 99999) + 10000).slice(0, 5)}`;
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const resetWizard = () => {
    setStep(1);
    setSelectedOrg(null);
    setAmount(0);
    setCustomAmount('');
    setDonationType('onetime');
    setPaymentMethod('');
    setSearchQuery('');
    setCategoryFilter('all');
    setConsentPrivacy(false);
    setConsentReceipt(false);
    setRecurringDay(1);
    setRecurringDuration('12');
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    id: c.id,
    label: lang === 'ko' ? c.labelKo : c.labelEn,
  }));

  const canProceedStep1 = !!selectedOrg;
  const canProceedStep2 = currentAmount >= 1000;
  const canProceedStep3 = !!paymentMethod && consentPrivacy && consentReceipt;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.donation.title}</h1>
        <p className="text-gray-500 mt-1">{t.donation.subtitle}</p>
      </div>

      {/* Progress Steps */}
      <ProgressSteps steps={steps} currentStep={step} className="mb-8" />

      {/* Recent donors ticker - above the phone frame */}
      {step === 1 && (
        <div className="max-w-md mx-auto mb-4 overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2">
            <Heart className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs font-medium text-gray-500 shrink-0">{t.donation.recentDonors}</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-6 animate-ticker whitespace-nowrap">
                {[...recentDonorTicker, ...recentDonorTicker].map((donor, i) => (
                  <span key={`${donor.id}-${i}`} className="text-xs text-gray-600 inline-flex items-center gap-1">
                    <span className="font-medium text-gray-800">{donor.name}</span>
                    <span className="text-gray-400">|</span>
                    <span>{lang === 'ko' ? donor.orgName : donor.orgNameEn}</span>
                    <span className="text-brand-600 font-semibold">{formatCurrency(donor.amount)}</span>
                    <span className="text-gray-400">{lang === 'ko' ? donor.timeAgo : donor.timeAgoEn}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone frame */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden">
          {/* Phone notch */}
          <div className="bg-gray-900 h-7 flex items-center justify-center relative">
            <div className="w-28 h-5 bg-black rounded-b-2xl" />
          </div>

          {/* Phone content */}
          <div className="px-5 py-6 min-h-[560px] flex flex-col">

            {/* ===================== STEP 1: Organization Selection ===================== */}
            {step === 1 && (
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{t.donation.step1Desc}</h2>

                <SearchInput
                  placeholder={t.donation.search}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="mb-3"
                />

                <FilterTabs
                  options={categoryOptions}
                  activeId={categoryFilter}
                  onChange={setCategoryFilter}
                  className="mb-4"
                />

                {/* Organization list */}
                <div className="flex-1 overflow-y-auto max-h-[340px] space-y-3 pr-1 -mr-1">
                  {filteredOrgs.map((org) => {
                    const isSelected = selectedOrg?.id === org.id;
                    return (
                      <div
                        key={org.id}
                        onClick={() => setSelectedOrg(org)}
                        className={cn(
                          'p-3 rounded-xl border-2 cursor-pointer transition-all',
                          isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50',
                        )}
                      >
                        <div className="flex gap-3">
                          {/* Org image placeholder */}
                          <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                            <Building className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {lang === 'ko' ? org.name : org.nameEn}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {lang === 'ko' ? org.description : org.descriptionEn}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {formatNumber(org.donorCount)}{t.donation.donors}
                              </span>
                              <span>{t.donation.monthlyDonation} {formatCurrency(org.monthlyAmount)}</span>
                            </div>
                          </div>
                        </div>
                        {/* Detail link */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowOrgDetail(org); }}
                          className="text-xs text-brand-600 font-medium mt-2 flex items-center gap-0.5 hover:underline"
                        >
                          <Info className="w-3 h-3" />
                          {lang === 'ko' ? '단체 상세보기' : 'View details'}
                        </button>
                      </div>
                    );
                  })}
                  {filteredOrgs.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-8">
                      {t.common.noData}
                    </div>
                  )}
                </div>

                {/* Next button */}
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full mt-4"
                  size="lg"
                >
                  {t.donation.next} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* ===================== STEP 2: Amount Input ===================== */}
            {step === 2 && selectedOrg && (
              <div className="flex flex-col flex-1">
                {/* Selected org info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-brand-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{lang === 'ko' ? selectedOrg.name : selectedOrg.nameEn}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{lang === 'ko' ? selectedOrg.description : selectedOrg.descriptionEn}</p>
                  </div>
                </div>

                {/* Donation type toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                  <button
                    onClick={() => setDonationType('onetime')}
                    className={cn(
                      'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                      donationType === 'onetime' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500',
                    )}
                  >
                    {t.donation.oneTime}
                  </button>
                  <button
                    onClick={() => setDonationType('recurring')}
                    className={cn(
                      'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                      donationType === 'recurring' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500',
                    )}
                  >
                    {t.donation.recurring}
                  </button>
                </div>

                {/* Amount presets */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { setAmount(preset); setCustomAmount(''); }}
                      className={cn(
                        'py-2.5 rounded-xl text-sm font-medium transition-all',
                        amount === preset
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                      )}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative mb-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                    placeholder={t.donation.customAmount}
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{t.common.won}</span>
                </div>

                {/* Recurring options */}
                {donationType === 'recurring' && (
                  <div className="bg-blue-50 rounded-xl p-3 mb-4 space-y-3">
                    <p className="text-xs font-medium text-blue-700">{t.donation.recurringMonthly}</p>
                    {/* Day picker */}
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-600 self-center shrink-0">{lang === 'ko' ? '결제일' : 'Payment day'}:</span>
                      {([1, 15] as const).map((day) => (
                        <button
                          key={day}
                          onClick={() => setRecurringDay(day)}
                          className={cn(
                            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                            recurringDay === day ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200',
                          )}
                        >
                          {day}{lang === 'ko' ? '일' : 'st/th'}
                        </button>
                      ))}
                    </div>
                    {/* Duration */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs text-gray-600 self-center shrink-0">{lang === 'ko' ? '기간' : 'Duration'}:</span>
                      {[
                        { value: '3', label: lang === 'ko' ? '3개월' : '3 months' },
                        { value: '6', label: lang === 'ko' ? '6개월' : '6 months' },
                        { value: '12', label: lang === 'ko' ? '12개월' : '12 months' },
                        { value: 'unlimited', label: lang === 'ko' ? '무기한' : 'Indefinite' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setRecurringDuration(opt.value)}
                          className={cn(
                            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                            recurringDuration === opt.value ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact preview */}
                {impactDescription && (
                  <div className="bg-green-50 rounded-xl p-3 mb-3">
                    <p className="text-xs font-medium text-green-700 mb-1">{t.donation.impactTitle}</p>
                    <p className="text-sm text-green-800">{impactDescription}</p>
                  </div>
                )}

                {/* Tax estimate */}
                {currentAmount >= 1000 && (
                  <div className="bg-orange-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-orange-700">
                      {lang === 'ko' ? '예상 세액공제' : 'Est. tax deduction'}: <span className="font-bold">{lang === 'ko' ? '약 ' : '~'}{formatCurrency(taxEstimate)}</span>
                    </p>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1" size="lg">
                    {t.donation.prev}
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceedStep2} className="flex-1" size="lg">
                    {t.donation.next} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ===================== STEP 3: Payment ===================== */}
            {step === 3 && selectedOrg && (
              <div className="flex flex-col flex-1">
                {/* Summary card */}
                <div className="bg-brand-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t.donation.selectedOrg}</span>
                    <span className="text-sm font-semibold text-gray-900">{lang === 'ko' ? selectedOrg.name : selectedOrg.nameEn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t.donation.amount}</span>
                    <span className="text-lg font-bold text-brand-600">{formatCurrency(currentAmount)}</span>
                  </div>
                  {donationType === 'recurring' && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{t.donation.recurring}</span>
                      <span className="text-xs text-gray-500">
                        {lang === 'ko' ? `매월 ${recurringDay}일` : `${recurringDay}${recurringDay === 1 ? 'st' : 'th'} of each month`}
                        {' / '}
                        {recurringDuration === 'unlimited'
                          ? (lang === 'ko' ? '무기한' : 'Indefinite')
                          : (lang === 'ko' ? `${recurringDuration}개월` : `${recurringDuration} months`)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment methods */}
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t.donation.paymentMethod}</h3>
                <div className="space-y-2 mb-4 flex-1 overflow-y-auto max-h-[240px]">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                        paymentMethod === pm.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-100 hover:border-gray-200',
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        paymentMethod === pm.id ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500',
                      )}>
                        {PAYMENT_ICONS[pm.icon]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lang === 'ko' ? pm.labelKo : pm.labelEn}</p>
                        <p className="text-xs text-gray-500">{lang === 'ko' ? pm.descKo : pm.descEn}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-2 mb-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-gray-600">
                      {lang === 'ko'
                        ? '개인정보 수집 및 이용에 동의합니다 (필수)'
                        : 'I agree to the collection and use of personal information (Required)'}
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentReceipt}
                      onChange={(e) => setConsentReceipt(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs text-gray-600">
                      {lang === 'ko'
                        ? '기부금 영수증 발급에 동의합니다 (필수)'
                        : 'I agree to the issuance of a donation receipt (Required)'}
                    </span>
                  </label>
                </div>

                {/* Pay / nav buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button variant="secondary" onClick={() => setStep(2)} className="flex-1" size="lg">
                    {t.donation.prev}
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!canProceedStep3}
                    className="flex-1"
                    size="lg"
                  >
                    {formatCurrency(currentAmount)} {t.donation.donate}
                  </Button>
                </div>
              </div>
            )}

            {/* ===================== STEP 4: Complete ===================== */}
            {step === 4 && selectedOrg && (
              <div className="flex flex-col flex-1 items-center">
                {/* Success icon */}
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mt-4 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {lang === 'ko' ? '기부가 완료되었습니다!' : 'Donation Complete!'}
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  {lang === 'ko' ? '소중한 마음 감사합니다' : 'Thank you for your generous heart'}
                </p>

                {/* Receipt card */}
                <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2.5 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.donation.receiptNumber}</span>
                    <span className="font-mono font-semibold text-gray-900">{receiptId}</span>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.donation.selectedOrg}</span>
                    <span className="font-medium text-gray-900">{lang === 'ko' ? selectedOrg.name : selectedOrg.nameEn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.donation.amount}</span>
                    <span className="font-bold text-brand-600">{formatCurrency(currentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{lang === 'ko' ? '날짜 / 시간' : 'Date / Time'}</span>
                    <span className="text-gray-700">{dateStr} {timeStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.donation.selectedType}</span>
                    <span className="text-gray-700">{donationType === 'onetime' ? t.donation.oneTime : t.donation.recurring}</span>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-gray-500">{lang === 'ko' ? '예상 세액공제' : 'Est. Tax Deduction'}</span>
                    <span className="font-semibold text-green-600">{formatCurrency(taxEstimate)}</span>
                  </div>
                </div>

                {/* Auto tax note */}
                <p className="text-xs text-gray-400 text-center mb-5">
                  {lang === 'ko'
                    ? '* 기부금 영수증은 국세청 연말정산 간소화 서비스에 자동 등록됩니다.'
                    : '* Your donation receipt will be auto-registered with the tax service.'}
                </p>

                {/* Action buttons */}
                <div className="w-full flex gap-2 mb-3">
                  <Button
                    variant="secondary"
                    onClick={() => alert(lang === 'ko' ? '영수증 다운로드 (데모)' : 'Receipt download (demo)')}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {lang === 'ko' ? '영수증 다운로드' : 'Download Receipt'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => alert(lang === 'ko' ? 'SNS 공유하기 (데모)' : 'Share on SNS (demo)')}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    {lang === 'ko' ? 'SNS 공유하기' : 'Share'}
                  </Button>
                </div>
                <Button onClick={resetWizard} className="w-full" size="lg">
                  {lang === 'ko' ? '새로운 기부하기' : 'Make Another Donation'}
                </Button>
              </div>
            )}
          </div>

          {/* Phone bottom bar */}
          <div className="h-5 flex items-center justify-center">
            <div className="w-32 h-1 rounded-full bg-gray-900/20" />
          </div>
        </div>
      </div>

      {/* ===================== Organization Detail Modal ===================== */}
      {showOrgDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowOrgDetail(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{lang === 'ko' ? showOrgDetail.name : showOrgDetail.nameEn}</h2>
              <button onClick={() => setShowOrgDetail(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Mission */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">{t.donation.mission}</h3>
              <p className="text-sm text-gray-600">{lang === 'ko' ? showOrgDetail.mission : showOrgDetail.missionEn}</p>
            </div>

            {/* Impact descriptions */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.donation.impactTitle}</h3>
              <div className="space-y-2">
                {showOrgDetail.impactDescriptions.map((impact, i) => (
                  <div key={i} className="flex items-start gap-2 bg-green-50 rounded-lg p-2.5">
                    <span className="text-xs font-bold text-green-700 shrink-0 mt-0.5">{formatCurrency(impact.amount)}</span>
                    <span className="text-xs text-green-800">{lang === 'ko' ? impact.descriptionKo : impact.descriptionEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fund usage pie chart */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.donation.fundUsage}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={showOrgDetail.fundUsage.map((f) => ({
                        name: lang === 'ko' ? f.category : f.categoryEn,
                        value: f.percentage,
                        color: f.color,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {showOrgDetail.fundUsage.map((f, i) => (
                        <Cell key={i} fill={f.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [`${value}%`, String(name)]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {showOrgDetail.fundUsage.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    {lang === 'ko' ? f.category : f.categoryEn} ({f.percentage}%)
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => { setSelectedOrg(showOrgDetail); setShowOrgDetail(null); }} className="w-full" size="lg">
              {t.donation.selectOrg}
            </Button>
          </div>
        </div>
      )}

      {/* Ticker animation CSS */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
