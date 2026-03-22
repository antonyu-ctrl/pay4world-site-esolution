'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { pointHistory, rewardItems, badges, gradeTiers } from '@/data/rewards';
import { formatNumber, formatDate, formatCurrency } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';

import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import FilterTabs from '@/components/shared/FilterTabs';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';

import {
  Award,
  TrendingUp,
  Gift,
  Star,
  Lock,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Trophy,
  Crown,
} from 'lucide-react';

const CURRENT_POINTS = 12500;
const CURRENT_GRADE = 'silver';

export default function RewardsPage() {
  const { lang } = useLanguage();

  const [pointFilter, setPointFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: lang === 'ko' ? '전체' : 'All' },
    { id: 'earn', label: lang === 'ko' ? '적립' : 'Earned' },
    { id: 'use', label: lang === 'ko' ? '사용' : 'Used' },
  ];

  const filteredPoints = useMemo(() => {
    if (pointFilter === 'all') return pointHistory;
    return pointHistory.filter((p) => p.type === pointFilter);
  }, [pointFilter]);

  // Current grade tier
  const currentTier = gradeTiers.find((t) => t.id === CURRENT_GRADE)!;
  const nextTier = gradeTiers[gradeTiers.indexOf(currentTier) + 1];

  // Monthly earned
  const monthlyEarned = pointHistory
    .filter((p) => p.date.startsWith('2026-03') && p.type === 'earn')
    .reduce((sum, p) => sum + p.points, 0);

  // Available rewards
  const availableRewards = rewardItems.filter(
    (r) => r.available && r.points <= CURRENT_POINTS
  ).length;

  // Earned badges count
  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  // Category colors for reward items
  const categoryColors: Record<string, { bg: string; text: string }> = {
    experience: { bg: 'bg-blue-100', text: 'text-blue-600' },
    goods: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    certificate: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  const categoryLabels: Record<string, { ko: string; en: string }> = {
    experience: { ko: '체험', en: 'Experience' },
    goods: { ko: '상품', en: 'Goods' },
    certificate: { ko: '인증', en: 'Certificate' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === 'ko' ? '기부 포인트' : 'Donation Rewards'}
          </h1>
          <p className="text-gray-500 mt-1">
            {lang === 'ko'
              ? '기부 활동으로 적립한 포인트와 리워드를 관리하세요'
              : 'Manage your donation points and rewards'}
          </p>
        </div>
      </div>

      {/* Section 1 - Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'ko' ? '총 포인트' : 'Total Points'}
          value={`${formatNumber(CURRENT_POINTS)}P`}
          subtitle={lang === 'ko' ? '사용 가능' : 'Available'}
          icon={<Award />}
          gradient={STAT_GRADIENTS.blue}
        />
        <StatCard
          title={lang === 'ko' ? '이번 달 적립' : 'Earned This Month'}
          value={`${formatNumber(monthlyEarned)}P`}
          subtitle={lang === 'ko' ? '3월 적립 포인트' : 'March earnings'}
          icon={<TrendingUp />}
          gradient={STAT_GRADIENTS.green}
        />
        <StatCard
          title={lang === 'ko' ? '사용 가능 리워드' : 'Available Rewards'}
          value={lang === 'ko' ? `${availableRewards}개` : `${availableRewards}`}
          subtitle={lang === 'ko' ? '교환 가능' : 'Redeemable'}
          icon={<Gift />}
          gradient={STAT_GRADIENTS.purple}
        />
        <StatCard
          title={lang === 'ko' ? '기부 등급' : 'Donation Grade'}
          value={lang === 'ko' ? currentTier.nameKo : currentTier.nameEn}
          subtitle={
            lang === 'ko'
              ? `뱃지 ${earnedBadgesCount}/${badges.length}개 획득`
              : `${earnedBadgesCount}/${badges.length} badges earned`
          }
          icon={<Star />}
          gradient={STAT_GRADIENTS.orange}
        />
      </div>

      {/* Section 2 - Point Status & Grade */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '포인트 현황 & 등급' : 'Points & Grade Status'}
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Point circle display */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Background ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke={currentTier.color}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - (nextTier ? CURRENT_POINTS / nextTier.minPoints : 1))}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(CURRENT_POINTS)}
                </p>
                <p className="text-sm font-medium text-gray-500">P</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTier.color }}
              />
              <span className="font-bold text-gray-900">
                {lang === 'ko' ? currentTier.nameKo : currentTier.nameEn}
              </span>
              <Badge
                variant="active"
                label={lang === 'ko' ? '현재 등급' : 'Current'}
              />
            </div>
          </div>

          {/* Right: Progress to next grade */}
          <div className="flex flex-col justify-center">
            {nextTier && (
              <>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  {lang === 'ko'
                    ? `${nextTier.nameKo} 등급까지`
                    : `To ${nextTier.nameEn} Grade`}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600">
                      {formatNumber(CURRENT_POINTS)}P
                    </span>
                    <span className="text-gray-400">
                      {formatNumber(nextTier.minPoints)}P
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{
                        width: `${Math.min(
                          Math.round(
                            (CURRENT_POINTS / nextTier.minPoints) * 100
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((CURRENT_POINTS / nextTier.minPoints) * 100)}%{' '}
                    {lang === 'ko' ? '달성' : 'achieved'} (
                    {lang === 'ko' ? '남은 포인트: ' : 'Remaining: '}
                    {formatNumber(nextTier.minPoints - CURRENT_POINTS)}P)
                  </p>
                </div>

                {/* Next grade benefits preview */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {lang === 'ko'
                      ? `${nextTier.nameKo} 등급 혜택`
                      : `${nextTier.nameEn} Benefits`}
                  </p>
                  <ul className="space-y-1.5">
                    {(lang === 'ko'
                      ? nextTier.benefitsKo
                      : nextTier.benefitsEn
                    ).map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Section 3 - Point History */}
      <Card>
        <SectionHeader
          title={
            lang === 'ko'
              ? '포인트 적립/사용 내역'
              : 'Point Earn/Use History'
          }
          action={
            <FilterTabs
              options={filterOptions}
              activeId={pointFilter}
              onChange={setPointFilter}
            />
          }
        />

        {/* Desktop table */}
        <div className="mt-5 hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">
                  {lang === 'ko' ? '날짜' : 'Date'}
                </th>
                <th className="text-left py-3 px-3 text-gray-500 font-medium">
                  {lang === 'ko' ? '내역' : 'Description'}
                </th>
                <th className="text-center py-3 px-3 text-gray-500 font-medium">
                  {lang === 'ko' ? '유형' : 'Type'}
                </th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">
                  {lang === 'ko' ? '포인트' : 'Points'}
                </th>
                <th className="text-right py-3 px-3 text-gray-500 font-medium">
                  {lang === 'ko' ? '잔액' : 'Balance'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPoints.map((pt) => (
                <tr
                  key={pt.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3 text-gray-500 text-xs">
                    {formatDate(pt.date)}
                  </td>
                  <td className="py-3 px-3 text-gray-900 font-medium">
                    {lang === 'ko' ? pt.description : pt.descriptionEn}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={pt.type === 'earn' ? 'income' : 'expense'}
                      label={
                        pt.type === 'earn'
                          ? lang === 'ko'
                            ? '적립'
                            : 'Earn'
                          : lang === 'ko'
                          ? '사용'
                          : 'Use'
                      }
                    />
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      pt.type === 'earn'
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {pt.type === 'earn' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {pt.type === 'earn' ? '+' : ''}
                      {formatNumber(pt.points)}P
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-600">
                    {formatNumber(pt.balance)}P
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="mt-5 sm:hidden space-y-3">
          {filteredPoints.map((pt) => (
            <div
              key={pt.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">
                  {formatDate(pt.date)}
                </span>
                <Badge
                  variant={pt.type === 'earn' ? 'income' : 'expense'}
                  label={
                    pt.type === 'earn'
                      ? lang === 'ko'
                        ? '적립'
                        : 'Earn'
                      : lang === 'ko'
                      ? '사용'
                      : 'Use'
                  }
                />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {lang === 'ko' ? pt.description : pt.descriptionEn}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-lg font-bold ${
                    pt.type === 'earn'
                      ? 'text-emerald-600'
                      : 'text-red-500'
                  }`}
                >
                  {pt.type === 'earn' ? '+' : ''}
                  {formatNumber(pt.points)}P
                </span>
                <span className="text-sm text-gray-500">
                  {lang === 'ko' ? '잔액' : 'Bal.'}{' '}
                  {formatNumber(pt.balance)}P
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 4 - Reward Exchange */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '리워드 교환소' : 'Reward Exchange'}
          subtitle={
            lang === 'ko'
              ? '포인트로 다양한 리워드를 교환하세요'
              : 'Redeem your points for various rewards'
          }
        />
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewardItems.map((item) => {
            const canAfford = CURRENT_POINTS >= item.points && item.available;
            const catColor = categoryColors[item.category];
            const catLabel = categoryLabels[item.category];
            return (
              <div
                key={item.id}
                className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                  !item.available ? 'opacity-60' : ''
                }`}
              >
                {/* Category color header */}
                <div
                  className={`h-24 ${catColor.bg} flex items-center justify-center`}
                >
                  <ShoppingBag
                    className={`w-10 h-10 ${catColor.text} opacity-50`}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">
                      {lang === 'ko' ? item.nameKo : item.nameEn}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${catColor.bg} ${catColor.text}`}
                    >
                      {lang === 'ko' ? catLabel.ko : catLabel.en}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {lang === 'ko' ? item.descKo : item.descEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-600">
                      {formatNumber(item.points)}P
                    </span>
                    <Button
                      variant={canAfford ? 'primary' : 'secondary'}
                      size="sm"
                      disabled={!canAfford}
                    >
                      {!item.available
                        ? lang === 'ko'
                          ? '품절'
                          : 'Sold Out'
                        : lang === 'ko'
                        ? '교환하기'
                        : 'Redeem'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 5 - Badge Collection */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '기부 뱃지 컬렉션' : 'Donation Badge Collection'}
          subtitle={
            lang === 'ko'
              ? `${earnedBadgesCount}/${badges.length}개 뱃지 획득`
              : `${earnedBadgesCount}/${badges.length} badges earned`
          }
        />
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative border rounded-xl p-4 text-center transition-shadow ${
                badge.earned
                  ? 'border-gray-200 hover:shadow-md bg-white'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              {/* Icon */}
              <div
                className={`text-4xl mb-2 ${
                  badge.earned ? '' : 'grayscale opacity-40'
                }`}
              >
                {badge.icon}
              </div>

              {/* Lock overlay for unearned */}
              {!badge.earned && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}

              <h4
                className={`text-sm font-bold ${
                  badge.earned ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {lang === 'ko' ? badge.nameKo : badge.nameEn}
              </h4>
              <p
                className={`text-xs mt-0.5 ${
                  badge.earned ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {lang === 'ko' ? badge.descKo : badge.descEn}
              </p>
              {badge.earned && badge.earnedDate && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {formatDate(badge.earnedDate)}{' '}
                  {lang === 'ko' ? '획득' : 'earned'}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Section 6 - Grade Tiers */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '기부 등급 안내' : 'Donation Grade Guide'}
          subtitle={
            lang === 'ko'
              ? '기부 활동에 따라 등급이 결정됩니다'
              : 'Your grade is determined by donation activity'
          }
        />
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gradeTiers.map((tier) => {
            const isCurrent = tier.id === CURRENT_GRADE;
            return (
              <div
                key={tier.id}
                className={`border-2 rounded-xl p-5 transition-shadow ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/30 shadow-md'
                    : 'border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <h4 className="font-bold text-gray-900">
                    {lang === 'ko' ? tier.nameKo : tier.nameEn}
                  </h4>
                  {isCurrent && (
                    <Badge
                      variant="active"
                      label={lang === 'ko' ? '현재' : 'Current'}
                    />
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  {formatNumber(tier.minPoints)}P ~{' '}
                  {tier.maxPoints < 999999
                    ? `${formatNumber(tier.maxPoints)}P`
                    : ''}
                </p>

                <ul className="space-y-1.5">
                  {(lang === 'ko' ? tier.benefitsKo : tier.benefitsEn).map(
                    (benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {benefit}
                      </li>
                    )
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
