import type { TabDefinition, OrgCategory } from '@/types';

export const TABS: TabDefinition[] = [
  { id: 'donation', labelKo: '기부 플로우', labelEn: 'Donation', href: '/donation', role: 'customer', roleBadgeKo: '고객용', roleBadgeEn: 'Customer', icon: 'Heart' },
  { id: 'tax', labelKo: '개인 세무', labelEn: 'Tax Service', href: '/tax', role: 'customer', roleBadgeKo: '고객용', roleBadgeEn: 'Customer', icon: 'FileText' },
  { id: 'accounting', labelKo: '회계 서비스', labelEn: 'Accounting', href: '/accounting', role: 'organization', roleBadgeKo: '단체용', roleBadgeEn: 'Organization', icon: 'TrendingUp' },
  { id: 'marketing', labelKo: '홍보 서비스', labelEn: 'Marketing', href: '/marketing', role: 'organization', roleBadgeKo: '단체용', roleBadgeEn: 'Organization', icon: 'Megaphone' },
  { id: 'fees', labelKo: '수수료 관리', labelEn: 'Fee Mgmt', href: '/fees', role: 'admin', roleBadgeKo: '관리자', roleBadgeEn: 'Admin', icon: 'Settings' },
  { id: 'hr', labelKo: 'HR 관리', labelEn: 'HR', href: '/hr', role: 'organization', roleBadgeKo: '단체용', roleBadgeEn: 'Organization', icon: 'Users' },
];

export interface MenuGroup {
  id: string;
  labelKo: string;
  labelEn: string;
  icon: string;
  color: string;
  bgColor: string;
  children: TabDefinition[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'customer',
    labelKo: '개인 고객',
    labelEn: 'Individual',
    icon: 'User',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    children: TABS.filter(t => t.role === 'customer'),
  },
  {
    id: 'organization',
    labelKo: '공익 단체',
    labelEn: 'NPO',
    icon: 'Building2',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    children: TABS.filter(t => t.role === 'organization'),
  },
  {
    id: 'admin',
    labelKo: '관리자',
    labelEn: 'Admin',
    icon: 'Shield',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    children: TABS.filter(t => t.role === 'admin'),
  },
];

export const CATEGORIES: { id: OrgCategory; labelKo: string; labelEn: string }[] = [
  { id: 'all', labelKo: '전체', labelEn: 'All' },
  { id: 'children', labelKo: '어린이', labelEn: 'Children' },
  { id: 'environment', labelKo: '환경', labelEn: 'Environment' },
  { id: 'animals', labelKo: '동물', labelEn: 'Animals' },
  { id: 'elderly', labelKo: '노인', labelEn: 'Elderly' },
  { id: 'medical', labelKo: '의료', labelEn: 'Medical' },
];

export const AMOUNT_PRESETS = [10000, 30000, 50000, 100000, 200000, 300000];

export const STAT_GRADIENTS = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  red: 'from-red-400 to-red-500',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-400 to-orange-500',
  teal: 'from-teal-500 to-teal-600',
  indigo: 'from-indigo-500 to-indigo-600',
  gray: 'from-gray-400 to-gray-500',
};

export const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export const PAYMENT_METHODS = [
  { id: 'card' as const, labelKo: '신용카드 / 체크카드', labelEn: 'Credit / Debit Card', descKo: '국내 모든 카드 사용 가능', descEn: 'All domestic cards accepted', icon: 'CreditCard' },
  { id: 'bank' as const, labelKo: '계좌이체', labelEn: 'Bank Transfer', descKo: '은행 계좌에서 직접 이체', descEn: 'Direct transfer from bank account', icon: 'Building2' },
  { id: 'kakaopay' as const, labelKo: '카카오페이', labelEn: 'KakaoPay', descKo: '카카오페이로 간편 결제', descEn: 'Easy payment with KakaoPay', icon: 'Smartphone' },
  { id: 'naverpay' as const, labelKo: '네이버페이', labelEn: 'NaverPay', descKo: '네이버페이로 간편 결제', descEn: 'Easy payment with NaverPay', icon: 'Smartphone' },
  { id: 'toss' as const, labelKo: '토스', labelEn: 'Toss', descKo: '토스로 간편 결제', descEn: 'Easy payment with Toss', icon: 'Smartphone' },
];
