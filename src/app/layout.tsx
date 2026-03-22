import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/i18n/LanguageContext';
import Header from '@/components/layout/Header';
import TabNavigation from '@/components/layout/TabNavigation';

export const metadata: Metadata = {
  title: 'PayForward | NPO E-Solution',
  description: 'NPO 운영을 위한 통합 솔루션 데모',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          <TabNavigation />
          <main className="flex-1">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
