'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Header() {
  const { lang, t, toggleLanguage } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {t.header.title}
          </h1>
          <p className="text-blue-200 text-sm sm:text-base leading-tight">
            {t.header.subtitle}
          </p>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium backdrop-blur-sm"
          aria-label="Toggle language"
        >
          <Globe className="w-4 h-4" />
          <span>{lang === 'ko' ? 'EN' : 'KR'}</span>
        </button>
      </div>
    </header>
  );
}
