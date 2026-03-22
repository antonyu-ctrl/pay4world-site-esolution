'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import Card from '@/components/shared/Card';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import PieChartCard from '@/components/charts/PieChartCard';
import HBarChartCard from '@/components/charts/HBarChartCard';
import FunnelChart from '@/components/charts/FunnelChart';
import { donorAgeData, donorRegionData, retentionFunnel } from '@/data/donors';
import { campaigns, contentCalendar } from '@/data/campaigns';
import { snsPlatforms } from '@/data/snsPlatforms';
import { formatNumber } from '@/lib/utils';
import { STAT_GRADIENTS } from '@/lib/constants';
import { FileText, Users, TrendingUp, Heart } from 'lucide-react';

// Icons as inline SVGs
function BuildingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
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

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}

// Platform colors for calendar dots and cards
const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  newsletter: '#F59E0B',
  youtube: '#FF0000',
};

const platformLetters: Record<string, string> = {
  instagram: 'I',
  facebook: 'F',
  newsletter: 'N',
  youtube: 'Y',
};

// Days of the week
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Sample generated content
const SAMPLE_ACTIVITY_TEXT =
  '지난 주말 해양 환경 보호를 위한 해변 정화 활동을 진행했습니다. 총 42명의 자원봉사자가 참여하여 해운대 해변에서 약 120kg의 해양 쓰레기를 수거했습니다. 특히 플라스틱 병, 비닐봉지, 담배꽁초 등이 주요 수거 대상이었습니다. 참여자들은 깨끗해진 해변을 보며 보람을 느꼈다고 전했습니다.';

const SAMPLE_GENERATED_CONTENT = `🌊 바다를 지키는 우리의 한 걸음 🌊

지난 주말, 해운대 해변에서 42명의 자원봉사자와 함께한 해변 정화 활동!

🧤 120kg의 해양 쓰레기를 수거하며
🌏 더 깨끗한 바다를 만들어가고 있습니다

플라스틱 병, 비닐봉지, 담배꽁초...
우리가 버린 쓰레기가 바다 생물의 생명을 위협합니다 😢

작은 실천이 큰 변화를 만듭니다 ✨
다음 정화 활동에 함께해 주세요!

📅 다음 활동: 4월 둘째 주 토요일
📍 장소: 해운대 해변
🔗 참여 신청: 프로필 링크

#해변정화 #환경보호 #초록별환경재단 #바다살리기 #자원봉사 #플라스틱프리`;

export default function MarketingPage() {
  const { lang, t } = useLanguage();

  // State
  const [activityText, setActivityText] = useState(SAMPLE_ACTIVITY_TEXT);
  const [contentType, setContentType] = useState<'instagram' | 'facebook' | 'newsletter'>('instagram');
  const [generatedContent, setGeneratedContent] = useState(SAMPLE_GENERATED_CONTENT);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(3);

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const year = 2026;
    const month = calendarMonth;
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const days: { day: number | null; date: string | null }[] = [];

    // Padding for the first week
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `2026-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr });
    }

    return days;
  }, [calendarMonth]);

  const getContentForDate = (dateStr: string) => {
    return contentCalendar.filter((item) => item.date === dateStr);
  };

  const selectedDateContent = selectedCalendarDate ? getContentForDate(selectedCalendarDate) : [];

  const dayLabels = lang === 'ko' ? DAYS_KO : DAYS_EN;

  // Pie chart data
  const ageChartData = donorAgeData.map((d) => ({
    name: lang === 'ko' ? d.ageGroup : d.ageGroupEn,
    value: d.value,
    color: d.color,
  }));

  // HBar chart data
  const regionChartData = donorRegionData.map((d) => ({
    name: lang === 'ko' ? d.region : d.regionEn,
    value: d.value,
    color: d.color,
  }));

  // Funnel data
  const funnelStages = retentionFunnel.map((s) => ({
    label: lang === 'ko' ? s.stage : s.stageEn,
    value: s.count,
    rate: s.rate,
    color: s.color,
  }));

  const contentTypeOptions = [
    {
      id: 'instagram' as const,
      labelKo: '인스타그램 게시글',
      labelEn: 'Instagram Post',
      icon: <InstagramIcon />,
    },
    {
      id: 'facebook' as const,
      labelKo: '페이스북 포스트',
      labelEn: 'Facebook Post',
      icon: <FacebookIcon />,
    },
    {
      id: 'newsletter' as const,
      labelKo: '이메일 뉴스레터',
      labelEn: 'Email Newsletter',
      icon: <MailIcon />,
    },
  ];

  const campaignStatusColors: Record<string, { bg: string; text: string; label: string; labelEn: string }> = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '진행중', labelEn: 'Active' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: '완료', labelEn: 'Completed' },
    planned: { bg: 'bg-blue-100', text: 'text-blue-700', label: '예정', labelEn: 'Planned' },
  };

  const snsIconColors: Record<string, string> = {
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    facebook: 'bg-blue-600',
    'message-circle': 'bg-yellow-400',
    youtube: 'bg-red-600',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === 'ko' ? '홍보 관리 센터' : 'Promotion Management Center'}
          </h1>
          <p className="text-gray-500 mt-1">
            {lang === 'ko' ? '초록별 환경재단 · AI 기반 콘텐츠 생성 및 후원자 분석' : 'GreenStar Environmental Foundation · AI-powered content generation & donor analytics'}
          </p>
        </div>
        <Button>
          <PlusIcon />
          <span className="ml-1.5">
            {lang === 'ko' ? '새 홍보 콘텐츠 만들기' : 'Create New Content'}
          </span>
        </Button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'ko' ? '총 콘텐츠' : 'Total Content'}
          value={lang === 'ko' ? '128건' : '128'}
          subtitle={lang === 'ko' ? '전월 대비 12건 증가' : '12 more than last month'}
          icon={<FileText />}
          gradient={STAT_GRADIENTS.blue}
        />
        <StatCard
          title={lang === 'ko' ? '이번 달 게시' : 'Posts This Month'}
          value={lang === 'ko' ? '24건' : '24'}
          subtitle={lang === 'ko' ? '목표 대비 80% 달성' : '80% of monthly goal'}
          icon={<TrendingUp />}
          gradient={STAT_GRADIENTS.green}
        />
        <StatCard
          title={lang === 'ko' ? '총 팔로워' : 'Total Followers'}
          value={lang === 'ko' ? '45,200명' : '45,200'}
          subtitle={lang === 'ko' ? '전월 대비 8.5% 증가' : '8.5% increase from last month'}
          icon={<Users />}
          gradient={STAT_GRADIENTS.purple}
        />
        <StatCard
          title={lang === 'ko' ? '후원 전환율' : 'Donation Conversion'}
          value="3.2%"
          subtitle={lang === 'ko' ? '업계 평균 2.1% 대비 높음' : 'Above industry avg of 2.1%'}
          icon={<Heart />}
          gradient={STAT_GRADIENTS.orange}
        />
      </div>

      {/* Organization Profile */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '단체 프로필 관리' : 'Organization Profile'}
          action={
            <Button variant="secondary" size="sm">
              <EditIcon />
              <span className="ml-1.5">{lang === 'ko' ? '수정' : 'Edit'}</span>
            </Button>
          }
          className="mb-6"
        />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Logo & Gallery */}
          <div className="lg:w-1/3 space-y-4">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <BuildingIcon />
              </div>
              <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                {lang === 'ko' ? '로고 변경' : 'Change Logo'}
              </button>
            </div>
            {/* Activity Photo Gallery */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {lang === 'ko' ? '활동 사진' : 'Activity Photos'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center"
                  >
                    <span className="text-gray-300 text-xs">
                      {lang === 'ko' ? '사진' : 'Photo'} {i}
                    </span>
                  </div>
                ))}
                <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-colors">
                  <PlusIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form Fields */}
          <div className="lg:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {lang === 'ko' ? '단체명' : 'Organization Name'}
              </label>
              <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800 text-sm">
                {lang === 'ko' ? '초록별 환경재단' : 'GreenStar Environmental Foundation'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {lang === 'ko' ? '한 줄 소개' : 'One-line Introduction'}
              </label>
              <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800 text-sm">
                {lang === 'ko' ? '지구를 위한 환경 보호 활동' : 'Environmental protection activities for the planet'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {lang === 'ko' ? '상세 소개' : 'Detailed Description'}
              </label>
              <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800 text-sm min-h-[80px]">
                {lang === 'ko'
                  ? '초록별 환경재단은 2015년 설립된 비영리 환경단체로, 해양 생태계 보호, 탄소 중립 실천, 환경 교육 프로그램 운영 등 다양한 활동을 전개하고 있습니다. 전국 42개 지역에서 활동하며, 연간 150회 이상의 환경 캠페인을 진행합니다.'
                  : 'GreenStar Environmental Foundation is a non-profit organization established in 2015, dedicated to marine ecosystem protection, carbon neutrality, and environmental education programs. Operating across 42 regions nationwide, we conduct over 150 environmental campaigns annually.'}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <GlobeIcon />
                    {lang === 'ko' ? '웹사이트' : 'Website'}
                  </span>
                </label>
                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-brand-600 text-sm">
                  https://greenstar.org
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon />
                    SNS {lang === 'ko' ? '계정' : 'Accounts'}
                  </span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm">
                    <span className="text-pink-600"><InstagramIcon /></span>
                    <span className="text-gray-600">@greenstar_official</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm">
                    <span className="text-blue-600"><FacebookIcon /></span>
                    <span className="text-gray-600">{lang === 'ko' ? '초록별 환경재단' : 'GreenStar Foundation'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3 - AI Content Generation */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? 'AI 홍보 콘텐츠 자동 생성' : 'AI Content Auto-Generation'}
          subtitle={
            lang === 'ko'
              ? '활동 내용을 입력하면 SNS 게시글, 뉴스레터 등을 자동으로 작성합니다'
              : 'Enter your activity details and AI will auto-generate social media posts, newsletters, and more'
          }
          className="mb-6"
        />
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Input */}
          <div className="lg:w-1/2 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {lang === 'ko' ? '활동 내용' : 'Activity Details'}
              </label>
              <textarea
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                placeholder={
                  lang === 'ko'
                    ? '활동 내용을 상세하게 작성해 주세요...'
                    : 'Describe your activity in detail...'
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {lang === 'ko' ? '콘텐츠 유형' : 'Content Type'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {contentTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setContentType(option.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      contentType === option.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className={contentType === option.id ? 'text-brand-600' : 'text-gray-400'}>
                      {option.icon}
                    </span>
                    <span className="text-xs font-medium text-center">
                      {lang === 'ko' ? option.labelKo : option.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full">
              <SparklesIcon />
              <span className="ml-2">
                {lang === 'ko' ? 'AI로 콘텐츠 생성하기' : 'Generate Content with AI'}
              </span>
            </Button>
          </div>

          {/* Right - Preview */}
          <div className="lg:w-1/2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {lang === 'ko' ? '생성된 콘텐츠 미리보기' : 'Generated Content Preview'}
              </h3>
              <button className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                <RefreshIcon />
                {lang === 'ko' ? '다시 생성' : 'Regenerate'}
              </button>
            </div>
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl min-h-[240px]">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedContent}
              </pre>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="flex-1">
                <EditIcon />
                <span className="ml-1.5">{lang === 'ko' ? '수정하기' : 'Edit'}</span>
              </Button>
              <Button size="sm" className="flex-1">
                <SendIcon />
                <span className="ml-1.5">
                  {lang === 'ko'
                    ? contentType === 'instagram'
                      ? '인스타그램에 바로 발행'
                      : contentType === 'facebook'
                      ? '페이스북에 바로 발행'
                      : '뉴스레터 발송'
                    : contentType === 'instagram'
                    ? 'Publish to Instagram'
                    : contentType === 'facebook'
                    ? 'Publish to Facebook'
                    : 'Send Newsletter'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 4 - Content Calendar */}
      <Card>
        <SectionHeader
          title={
            lang === 'ko'
              ? `콘텐츠 캘린더 - 2026년 ${calendarMonth}월`
              : `Content Calendar - ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][calendarMonth - 1]} 2026`
          }
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarMonth((m) => Math.max(1, m - 1))}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => setCalendarMonth((m) => Math.min(12, m + 1))}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          }
          className="mb-4"
        />

        {/* Platform legend */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          {Object.entries(platformColors).map(([platform, color]) => (
            <span key={platform} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {lang === 'ko'
                ? platform === 'instagram'
                  ? '인스타그램'
                  : platform === 'facebook'
                  ? '페이스북'
                  : platform === 'newsletter'
                  ? '뉴스레터'
                  : '유튜브'
                : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {/* Day headers */}
          {dayLabels.map((d) => (
            <div key={d} className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500">
              {d}
            </div>
          ))}
          {/* Day cells */}
          {calendarDays.map((cell, idx) => {
            const contentItems = cell.date ? getContentForDate(cell.date) : [];
            const isSelected = cell.date === selectedCalendarDate;
            const isToday = cell.date === '2026-03-22';
            return (
              <div
                key={idx}
                onClick={() => cell.date && setSelectedCalendarDate(cell.date)}
                className={`bg-white min-h-[72px] p-1.5 cursor-pointer hover:bg-blue-50/30 transition-colors ${
                  isSelected ? 'ring-2 ring-inset ring-brand-500 bg-brand-50/30' : ''
                } ${!cell.day ? 'bg-gray-50/50' : ''}`}
              >
                {cell.day && (
                  <>
                    <span
                      className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday ? 'bg-brand-600 text-white' : 'text-gray-700'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {contentItems.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {contentItems.map((item) => (
                          <span
                            key={item.id}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: platformColors[item.platform] }}
                            title={lang === 'ko' ? item.titleKo : item.titleEn}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Date Content */}
        {selectedCalendarDate && selectedDateContent.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-2">{selectedCalendarDate}</p>
            <div className="space-y-2">
              {selectedDateContent.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: platformColors[item.platform] }}
                  />
                  <span className="text-sm text-gray-800 flex-1">
                    {lang === 'ko' ? item.titleKo : item.titleEn}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lang === 'ko'
                      ? item.status === 'published'
                        ? '게시됨'
                        : item.status === 'scheduled'
                        ? '예약됨'
                        : '초안'
                      : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedCalendarDate && selectedDateContent.length === 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              {lang === 'ko' ? '이 날짜에 예정된 콘텐츠가 없습니다.' : 'No content scheduled for this date.'}
            </p>
          </div>
        )}
      </Card>

      {/* Section 5 - Campaign Performance */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '캠페인 성과' : 'Campaign Performance'}
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((campaign) => {
            const statusStyle = campaignStatusColors[campaign.status];
            return (
              <div
                key={campaign.id}
                className="p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {lang === 'ko' ? campaign.nameKo : campaign.nameEn}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {lang === 'ko' ? statusStyle.label : statusStyle.labelEn}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{campaign.period}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {lang === 'ko' ? '도달' : 'Reach'}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {campaign.reach > 0 ? formatNumber(campaign.reach) : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {lang === 'ko' ? '참여' : 'Engagement'}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {campaign.engagement > 0 ? formatNumber(campaign.engagement) : '-'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {lang === 'ko' ? '전환' : 'Conversions'}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {campaign.conversions > 0 ? formatNumber(campaign.conversions) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section 6 - Donor Analytics */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '후원자 분석' : 'Donor Analytics'}
          className="mb-4"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              {lang === 'ko' ? '연령대별 후원자 분포' : 'Donor Distribution by Age'}
            </h3>
            <PieChartCard data={ageChartData} />
          </div>
          {/* Region Distribution */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              {lang === 'ko' ? '지역별 후원자 분포' : 'Donor Distribution by Region'}
            </h3>
            <HBarChartCard
              data={regionChartData}
              valueFormatter={(v) => `${v}%`}
            />
          </div>
        </div>
      </Card>

      {/* Section 7 - Donor Retention Funnel */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? '후원자 전환 퍼널' : 'Donor Conversion Funnel'}
          subtitle={
            lang === 'ko'
              ? '방문자에서 정기후원자까지의 전환 단계'
              : 'Conversion stages from visitor to regular sponsor'
          }
          className="mb-6"
        />
        <FunnelChart stages={funnelStages} />
      </Card>

      {/* Section 8 - AI Insights */}
      <Card className="bg-amber-50/60 border border-amber-200/50">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-amber-600 shrink-0 mt-0.5">
            <LightbulbIcon />
          </div>
          <h2 className="text-lg font-bold text-amber-900">
            AI {lang === 'ko' ? '인사이트' : 'Insights'}
          </h2>
        </div>
        <ul className="space-y-3 ml-9">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="text-sm text-amber-800">
              {lang === 'ko'
                ? '30~40대 후원자가 전체의 53%를 차지하며, 이 연령층을 타겟으로 한 콘텐츠 전략이 효과적입니다.'
                : 'Donors in their 30s-40s account for 53% of all donors. Content strategies targeting this age group are most effective.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="text-sm text-amber-800">
              {lang === 'ko'
                ? '인스타그램 게시물의 참여율이 페이스북 대비 2.3배 높으며, 릴스 콘텐츠가 특히 좋은 성과를 보입니다.'
                : 'Instagram posts show 2.3x higher engagement than Facebook, with Reels content performing especially well.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="text-sm text-amber-800">
              {lang === 'ko'
                ? '첫 기부 후 3개월 내 재기부율은 48%입니다. 첫 기부 후 감사 이메일 발송 시 재기부율이 15% 상승합니다.'
                : 'The re-donation rate within 3 months of first donation is 48%. Sending thank-you emails after the first donation increases the rate by 15%.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="text-sm text-amber-800">
              {lang === 'ko'
                ? '서울·경기 지역 후원자가 57%로 수도권 집중도가 높습니다. 지방 도시 타겟 캠페인을 추천합니다.'
                : 'Seoul and Gyeonggi donors make up 57%, showing high metro concentration. Regional city-targeted campaigns are recommended.'}
            </span>
          </li>
        </ul>
      </Card>

      {/* Section 9 - SNS Integration */}
      <Card>
        <SectionHeader
          title={lang === 'ko' ? 'SNS 통합 발행' : 'SNS Integrated Publishing'}
          subtitle={
            lang === 'ko'
              ? '한 번의 클릭으로 모든 SNS 채널에 동시 게시'
              : 'Publish to all SNS channels with a single click'
          }
          className="mb-4"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {snsPlatforms.map((platform) => {
            const iconColorClass = snsIconColors[platform.icon] || 'bg-gray-500';
            return (
              <div
                key={platform.id}
                className="p-5 border border-gray-200 rounded-xl hover:shadow-sm transition-all text-center"
              >
                {/* Platform Icon */}
                <div
                  className={`w-12 h-12 rounded-full ${iconColorClass} text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold`}
                >
                  {platform.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{platform.name}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {platform.connected && platform.handle
                    ? platform.handle
                    : lang === 'ko'
                    ? '미연결'
                    : 'Not Connected'}
                </p>
                {/* Connection Status */}
                <div className="mb-3">
                  {platform.connected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {lang === 'ko' ? '연동됨' : 'Connected'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {lang === 'ko' ? '미연동' : 'Not Connected'}
                    </span>
                  )}
                </div>
                {/* Followers or Connect button */}
                {platform.connected && platform.followerCount ? (
                  <p className="text-xs text-gray-500">
                    {formatNumber(platform.followerCount)} {lang === 'ko' ? '팔로워' : 'followers'}
                  </p>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    {lang === 'ko' ? '연결하기' : 'Connect'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
