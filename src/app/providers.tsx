// src/app/providers.tsx
"use client";

import { NextIntlClientProvider } from 'next-intl';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { LoginModalProvider } from '@/contexts/LoginModalContext';

type ProvidersProps = {
  children: React.ReactNode;
  messages: any;
  locale: string;
};

export default function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <TranslationProvider>
        <LoginModalProvider>
          {children}
        </LoginModalProvider>
      </TranslationProvider>
    </NextIntlClientProvider>
  );
}