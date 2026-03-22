'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  FileText,
  TrendingUp,
  Megaphone,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { TABS } from '@/lib/constants';
import type { TabRole } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  FileText,
  TrendingUp,
  Megaphone,
  Settings,
  Users,
};

const roleBadgeColors: Record<TabRole, string> = {
  customer: 'bg-blue-100 text-blue-700',
  organization: 'bg-green-100 text-green-700',
  admin: 'bg-orange-100 text-orange-700',
};

export default function TabNavigation() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          {TABS.map((tab) => {
            const Icon = iconMap[tab.icon];
            const isActive =
              pathname === tab.href || pathname?.startsWith(tab.href + '/');
            const label = lang === 'ko' ? tab.labelKo : tab.labelEn;
            const roleBadge = lang === 'ko' ? tab.roleBadgeKo : tab.roleBadgeEn;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors shrink-0
                  ${
                    isActive
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
                <span
                  className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleBadgeColors[tab.role]}`}
                >
                  {roleBadge}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
