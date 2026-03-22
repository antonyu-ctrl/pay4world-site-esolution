'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { favoriteOrgs, activityFeed, campaignAlerts } from '@/data/favorites';
import { formatNumber, formatDate, formatCurrency } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';

import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';

import {
  Heart,
  Activity,
  Building2,
  HandHeart,
  Users,
  Calendar,
  Megaphone,
  Target,
  Clock,
} from 'lucide-react';

export default function FavoritesPage() {
  const { lang } = useLanguage();

  const [likedOrgs, setLikedOrgs] = useState<Set<string>>(
    new Set(favoriteOrgs.map((o) => o.id))
  );

  const toggleLike = (id: string) => {
    setLikedOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Feed type indicator
  const feedDotColor: Record<string, string> = {
    activity: 'bg-blue-500',
    milestone: 'bg-emerald-500',
    campaign: 'bg-orange-500',
  };

  const feedTypeLabel: Record<string, { ko: string; en: string }> = {
    activity: { ko: '활동', en: 'Activity' },
    milestone: { ko: '성과', en: 'Milestone' },
    campaign: { ko: '캠페인', en: 'Campaign' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === 'ko' ? '관심 단체' : 'Favorite Organizations'}
          </h1>
          <p className="text-gray-500 mt-1">
            {lang === 'ko'
              ? '관심 단체의 활동과 소식을 확인하세요'
              : 'Stay updated on your favorite organizations'}
          </p>
        </div>
      </div>

      {/* Section 1 - Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'ko' ? '관심 단체' : 'Favorite Orgs'}
          value={lang === 'ko' ? '5개' : '5'}
          subtitle={lang === 'ko' ? '5개 카테고리' : '5 categories'}
          icon={<Heart />}
          gradient={STAT_GRADIENTS.blue}
        />
        <StatCard
          title={lang === 'ko' ? '이번 달 활동' : 'Activities This Month'}
          value={lang === 'ko' ? '8건' : '8'}
          subtitle={lang === 'ko' ? '전월 대비 3건 증가' : '3 more than last month'}
          icon={<Activity />}
          gradient={STAT_GRADIENTS.green}
        />
        <StatCard
          title={lang === 'ko' ? '지원한 단체' : 'Supported Orgs'}
          value={lang === 'ko' ? '5개' : '5'}
          subtitle={lang === 'ko' ? '모든 관심 단체 후원' : 'All favorites supported'}
          icon={<Building2 />}
          gradient={STAT_GRADIENTS.purple}
        />
        <StatCard
          title={lang === 'ko' ? '총 기부 참여' : 'Total Donations'}
          value={lang === 'ko' ? '14회' : '14'}
          subtitle={lang === 'ko' ? '2026년 누적' : 'Cumulative in 2026'}
          icon={<HandHeart />}
          gradient={STAT_GRADIENTS.orange}
        />
      </div>

      {/* Section 2 - Favorite Organizations List */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '관심 단체 목록' : 'Favorite Organizations'}
          subtitle={
            lang === 'ko'
              ? '관심 등록한 단체의 최신 소식을 확인하세요'
              : 'View the latest updates from your favorite organizations'
          }
        />
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {favoriteOrgs.map((org) => (
            <div
              key={org.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex"
              style={{ borderLeftWidth: 4, borderLeftColor: org.imageColor }}
            >
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 truncate">
                        {lang === 'ko' ? org.name : org.nameEn}
                      </h4>
                      <Badge
                        variant="customer"
                        label={lang === 'ko' ? org.category : org.categoryEn}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {lang === 'ko' ? org.description : org.descriptionEn}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleLike(org.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedOrgs.has(org.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {formatNumber(org.donorCount)}
                      {lang === 'ko' ? '명 후원' : ' donors'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 truncate">
                    {lang === 'ko' ? org.recentActivity : org.recentActivityEn}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(org.recentDate)}
                  </span>
                </div>

                <div className="mt-4">
                  <Button variant="primary" size="sm">
                    <HandHeart className="w-4 h-4 mr-1.5" />
                    {lang === 'ko' ? '기부하기' : 'Donate'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 3 - Activity Feed */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '최근 활동' : 'Recent Activities'}
          subtitle={
            lang === 'ko'
              ? '관심 단체의 최근 활동을 타임라인으로 확인하세요'
              : 'View recent activities from your favorite organizations'
          }
        />
        <div className="mt-5 space-y-0">
          {activityFeed.map((item, idx) => (
            <div
              key={item.id}
              className="flex gap-4 relative"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${feedDotColor[item.type]} shrink-0 mt-1.5`}
                />
                {idx < activityFeed.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-6 ${idx === activityFeed.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">
                    {formatDate(item.date)}
                  </span>
                  <Badge
                    variant="organization"
                    label={lang === 'ko' ? item.orgName : item.orgNameEn}
                  />
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.type === 'activity'
                        ? 'bg-blue-50 text-blue-600'
                        : item.type === 'milestone'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {lang === 'ko'
                      ? feedTypeLabel[item.type].ko
                      : feedTypeLabel[item.type].en}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {lang === 'ko' ? item.content : item.contentEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 4 - Active Campaigns */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '진행 중인 캠페인' : 'Active Campaigns'}
          subtitle={
            lang === 'ko'
              ? '관심 단체의 캠페인에 참여하세요'
              : 'Participate in campaigns from your favorite organizations'
          }
        />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaignAlerts.map((campaign) => {
            const progress =
              campaign.goal > 0
                ? Math.round((campaign.current / campaign.goal) * 100)
                : 0;
            return (
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">
                      {lang === 'ko' ? campaign.orgName : campaign.orgNameEn}
                    </p>
                    <h4 className="font-bold text-gray-900 mt-0.5">
                      {lang === 'ko' ? campaign.title : campaign.titleEn}
                    </h4>
                  </div>
                  <Badge
                    variant={campaign.status === 'active' ? 'active' : 'leave'}
                    label={
                      campaign.status === 'active'
                        ? lang === 'ko'
                          ? '진행중'
                          : 'Active'
                        : lang === 'ko'
                        ? '예정'
                        : 'Planned'
                    }
                  />
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {lang === 'ko' ? campaign.description : campaign.descriptionEn}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">
                      {formatCurrency(campaign.current)}
                    </span>
                    <span className="text-gray-400">
                      {formatCurrency(campaign.goal)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        campaign.status === 'active'
                          ? 'bg-emerald-500'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-400 mt-0.5">
                    {progress}%
                  </p>
                </div>

                <Button
                  variant={campaign.status === 'active' ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full mt-2"
                  disabled={campaign.status !== 'active'}
                >
                  <Target className="w-4 h-4 mr-1.5" />
                  {lang === 'ko' ? '참여하기' : 'Participate'}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
