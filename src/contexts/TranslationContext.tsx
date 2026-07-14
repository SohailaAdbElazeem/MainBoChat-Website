// "use client";
// import React, { createContext, useContext, useState, ReactNode } from "react";

// type TranslationContextType = {
//   language: string;
//   translate: (text: string) => Promise<string>;
//   changeLanguage: (lang: string) => void;
// };

// const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// export function TranslationProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguage] = useState<string>("ar"); // اللغة الافتراضية

//   const changeLanguage = (lang: string) => {
//     setLanguage(lang);
//   };

//   const translate = async (textToTranslate: string): Promise<string> => {
//     // إذا كانت اللغة الحالية عربية، لا تترجم وأعد النص الأصلي فوراً
//     if (language === "ar") return textToTranslate;
//     if (!textToTranslate.trim()) return textToTranslate;

//     try {
//       // نفس الطلب الذي قمتِ بتجربته في Postman تماماً
//       const response = await fetch("https://bo-chat.space/api/translate", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json" 
//         },
//         body: JSON.stringify({
//           text: textToTranslate,
//           to: language, // ستكون "en" عند التحويل
//         }),
//       });

//       if (!response.ok) return textToTranslate;
      
//       const data = await response.json();

//       // هنا نلتقط الـ translatedText كما ظهر لكِ في Postman
//       if (data.success && data.translatedText) {
//         return data.translatedText; 
//       }
      
//       return textToTranslate;
//     } catch (error) {
//       console.error("Translation API Error:", error);
//       return textToTranslate; // حماية للموقع: إذا فشل الـ API يعود النص العربي كما هو
//     }
//   };

//   return (
//     <TranslationContext.Provider value={{ language, translate, changeLanguage }}>
//       {children}
//     </TranslationContext.Provider>
//   );
// }

// export function useTranslation() {
//   const context = useContext(TranslationContext);
//   if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
//   return context;
// }


// import React, { createContext, useContext, useState, useEffect } from 'react';

// type Language = 'ar' | 'en';

// type TranslationContextType = {
//   language: Language;
//   setLanguage: (lang: Language) => void;
// };

// const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
//   const [language, setLanguage] = useState<Language>('ar');

//   // التأكد من جلب اللغة المحفوظة فور تحميل المتصفح للملف
//   useEffect(() => {
//     const savedLang = localStorage.getItem('siteLanguage') as Language;
//     if (savedLang) {
//       setLanguage(savedLang);
//     }
//   }, []);

//   const handleSetLanguage = (lang: Language) => {
//     setLanguage(lang);
//     localStorage.setItem('siteLanguage', lang);
//   };

//   return (
//     <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
//       {children}
//     </TranslationContext.Provider>
//   );
// };

// export const useTranslation = () => {
//   const context = useContext(TranslationContext);
//   if (!context) throw new Error('useTranslation must be used within TranslationProvider');
//   return context;
// };




import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
};

// 1. التعريف يجب أن يكون هنا (خارج المكون)
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('siteLanguage') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('siteLanguage', lang);
  };

  const translate = async (text: string): Promise<string> => {
    try {
      const res = await fetch('https://bo-chat.space/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to: language }),
      });
      const data = await res.json();
      return data.translatedText || text;
    } catch (e) {
      console.error("Translation error:", e);
      return text;
    }
  };

  // 2. استخدام TranslationContext هنا بشكل صحيح
  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};