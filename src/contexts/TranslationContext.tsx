//  // src/contexts/TranslationContext.tsx
// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// type Language = 'ar' | 'en';

// type TranslationContextType = {
//   language: Language;
//   setLanguage: (lang: Language) => void;
//   translate: (text: string, targetLang?: Language) => Promise<string>;
//   isTranslating: boolean;
//   clearCache: () => void;
// };

// // 🗂️ Cache للترجمات لتجنب الطلبات المتكررة
// const translationCache = new Map<string, string>();

// const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
//   const [language, setLanguage] = useState<Language>('ar');
//   const [isTranslating, setIsTranslating] = useState(false);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   // تحميل اللغة المحفوظة
//   useEffect(() => {
//     try {
//       const savedLang = localStorage.getItem('siteLanguage') as Language;
//       if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
//         setLanguage(savedLang);
//       }
//     } catch (error) {
//       console.error('Failed to load language from localStorage:', error);
//     }
//   }, []);

//   // حفظ اللغة عند تغييرها
//   const handleSetLanguage = useCallback((lang: Language) => {
//     setLanguage(lang);
//     try {
//       localStorage.setItem('siteLanguage', lang);
//       // تحديث اتجاه الصفحة إذا لزم الأمر
//       document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
//       document.documentElement.lang = lang;
//     } catch (error) {
//       console.error('Failed to save language to localStorage:', error);
//     }
//   }, []);

//   // دالة الترجمة مع تحسينات
//   const translate = useCallback(
//     async (text: string, targetLang?: Language): Promise<string> => {
//       // 1️⃣ التحقق من صحة النص
//       if (!text || text.trim().length === 0) {
//         return text;
//       }

//       // 2️⃣ تحديد اللغة المستهدفة
//       const target = targetLang || language;

//       // 3️⃣ التحقق من cache
//       const cacheKey = `${text}_${target}`;
//       if (translationCache.has(cacheKey)) {
//         return translationCache.get(cacheKey)!;
//       }

//       // 4️⃣ إلغاء الطلب السابق إذا كان موجوداً
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }

//       const controller = new AbortController();
//       abortControllerRef.current = controller;

//       setIsTranslating(true);

//       try {
//         const res = await fetch('https://bo-chat.space/api/translate', {
//           method: 'POST',
//           headers: { 
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ 
//             text, 
//             to: target 
//           }),
//           signal: controller.signal,
//         });

//         if (!res.ok) {
//           throw new Error(`Translation API error: ${res.status}`);
//         }

//         const data = await res.json();
//         const translatedText = data.translatedText || text;

//         // حفظ في cache
//         translationCache.set(cacheKey, translatedText);
        
//         return translatedText;
//       } catch (error) {
//         // تجاهل أخطاء الإلغاء (AbortError)
//         if (error instanceof Error && error.name === 'AbortError') {
//           return text;
//         }
//         console.error('Translation error:', error);
//         return text;
//       } finally {
//         setIsTranslating(false);
//         abortControllerRef.current = null;
//       }
//     },
//     [language]
//   );

//   // مسح الـ Cache
//   const clearCache = useCallback(() => {
//     translationCache.clear();
//   }, []);

//   return (
//     <TranslationContext.Provider
//       value={{
//         language,
//         setLanguage: handleSetLanguage,
//         translate,
//         isTranslating,
//         clearCache,
//       }}
//     >
//       {children}
//     </TranslationContext.Provider>
//   );
// };

// export const useTranslation = () => {
//   const context = useContext(TranslationContext);
//   if (!context) {
//     throw new Error('useTranslation must be used within TranslationProvider');
//   }
//   return context;
// };

// src/contexts/TranslationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

type Language = 'ar' | 'en';

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string, targetLang?: Language) => Promise<string>;
  isTranslating: boolean;
  clearCache: () => void;
  isRTL: boolean;
};

// 🗂️ Cache للترجمات لتجنب الطلبات المتكررة
const translationCache = new Map<string, string>();

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [isTranslating, setIsTranslating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // حساب RTL
  const isRTL = useMemo(() => language === 'ar', [language]);

  // تحميل اللغة المحفوظة
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('siteLanguage') as Language;
      if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        setLanguage(savedLang);
      }
    } catch (error) {
      console.error('Failed to load language from localStorage:', error);
    }
  }, []);

  // حفظ اللغة عند تغييرها
  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('siteLanguage', lang);
      // تحديث اتجاه الصفحة إذا لزم الأمر
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
  }, []);

  // دالة الترجمة مع تحسينات
  const translate = useCallback(
    async (text: string, targetLang?: Language): Promise<string> => {
      // 1️⃣ التحقق من صحة النص
      if (!text || text.trim().length === 0) {
        return text;
      }

      // 2️⃣ تحديد اللغة المستهدفة
      const target = targetLang || language;

      // 3️⃣ التحقق من cache
      const cacheKey = `${text}_${target}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      // 4️⃣ إلغاء الطلب السابق إذا كان موجوداً
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsTranslating(true);

      try {
        const res = await fetch('https://bo-chat.space/api/translate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text, 
            to: target 
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Translation API error: ${res.status}`);
        }

        const data = await res.json();
        const translatedText = data.translatedText || text;

        // حفظ في cache
        translationCache.set(cacheKey, translatedText);
        
        return translatedText;
      } catch (error) {
        // تجاهل أخطاء الإلغاء (AbortError)
        if (error instanceof Error && error.name === 'AbortError') {
          return text;
        }
        console.error('Translation error:', error);
        return text;
      } finally {
        setIsTranslating(false);
        abortControllerRef.current = null;
      }
    },
    [language]
  );

  // مسح الـ Cache
  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        translate,
        isTranslating,
        clearCache,
        isRTL,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

// هوك للغة فقط
export const useLanguage = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useLanguage must be used within TranslationProvider');
  }
  return { 
    language: context.language, 
    setLanguage: context.setLanguage, 
    isRTL: context.isRTL 
  };
};