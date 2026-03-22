'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ko } from './ko';
import { en } from './en';

type Language = 'ko' | 'en';

// Use a deep string type to allow both ko and en translations
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

type Translations = DeepStringify<typeof ko>;

interface LanguageContextType {
  lang: Language;
  t: Translations;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const translations: Record<Language, Translations> = { ko, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ko');

  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
