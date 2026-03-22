'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Heart,
  FileText,
  TrendingUp,
  Megaphone,
  Settings,
  Users,
  User,
  Building2,
  Shield,
  Menu,
  X,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { MENU_GROUPS } from '@/lib/constants';

const iconMap: Record<string, LucideIcon> = {
  Heart, FileText, TrendingUp, Megaphone, Settings, Users, User, Building2, Shield,
};

export default function TabNavigation() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find active group based on current path
  const activeGroup = MENU_GROUPS.find(g =>
    g.children.some(c => pathname === c.href || pathname?.startsWith(c.href + '/'))
  ) || MENU_GROUPS[0];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Level 1: Group selector + Level 2: Sub-tabs — combined on desktop */}
        <div className="flex items-center gap-0">
          {/* Desktop: Level 1 group tabs */}
          <div className="hidden md:flex items-center border-r border-gray-200 pr-4 mr-1 shrink-0">
            {MENU_GROUPS.map((group) => {
              const GroupIcon = iconMap[group.icon];
              const isActive = activeGroup.id === group.id;
              const label = lang === 'ko' ? group.labelKo : group.labelEn;

              return (
                <Link
                  key={group.id}
                  href={group.children[0].href}
                  className={`
                    flex items-center gap-1.5 px-3 py-3 text-sm font-semibold whitespace-nowrap
                    border-b-2 transition-all shrink-0
                    ${isActive
                      ? `border-transparent ${group.color}`
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                    }
                  `}
                >
                  {GroupIcon && <GroupIcon className="w-4 h-4" />}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop: Level 2 sub-tabs for active group */}
          <div className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1 -mb-px">
            {activeGroup.children.map((tab) => {
              const Icon = iconMap[tab.icon];
              const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/');
              const label = lang === 'ko' ? tab.labelKo : tab.labelEn;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`
                    flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors shrink-0 rounded-t-lg
                    ${isActive
                      ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile: Compact bar with hamburger */}
          <div className="flex md:hidden items-center justify-between w-full py-2">
            {/* Current page indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeGroup.bgColor}`} />
              <span className="text-xs font-medium text-gray-400">
                {lang === 'ko' ? activeGroup.labelKo : activeGroup.labelEn}
              </span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-sm font-semibold text-gray-800">
                {(() => {
                  const activeTab = activeGroup.children.find(c => pathname === c.href || pathname?.startsWith(c.href + '/'));
                  return activeTab ? (lang === 'ko' ? activeTab.labelKo : activeTab.labelEn) : '';
                })()}
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Full menu overlay */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1280px] mx-auto px-4 py-3 space-y-1">
            {MENU_GROUPS.map((group) => {
              const GroupIcon = iconMap[group.icon];
              const isGroupActive = activeGroup.id === group.id;

              return (
                <div key={group.id}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className={`w-6 h-6 rounded-lg ${group.bgColor} flex items-center justify-center`}>
                      {GroupIcon && <GroupIcon className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isGroupActive ? group.color : 'text-gray-400'}`}>
                      {lang === 'ko' ? group.labelKo : group.labelEn}
                    </span>
                  </div>

                  {/* Sub-items */}
                  <div className="ml-5 space-y-0.5">
                    {group.children.map((tab) => {
                      const Icon = iconMap[tab.icon];
                      const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/');

                      return (
                        <Link
                          key={tab.id}
                          href={tab.href}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                            ${isActive
                              ? 'bg-brand-50 text-brand-700 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />}
                          <span>{lang === 'ko' ? tab.labelKo : tab.labelEn}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
