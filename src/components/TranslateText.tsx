// components/TranslateText.tsx
"use client";
import { useTranslation } from "@/contexts/TranslationContext";
import { useEffect, useState, useRef } from "react";

const translationCache = new Map<string, string>();

export const TranslateText = ({ text }: { text: string }) => {
  const { language, translate } = useTranslation();
  const [translated, setTranslated] = useState(text);
  const prevTextRef = useRef(text);
  const prevLangRef = useRef(language);

  useEffect(() => {
    // إذا لم يتغير النص أو اللغة، لا نترجم مجدداً
    if (prevTextRef.current === text && prevLangRef.current === language) {
      return;
    }
    prevTextRef.current = text;
    prevLangRef.current = language;

    if (!text) {
      setTranslated("");
      return;
    }
    // إذا كانت اللغة عربية، نعرض النص الأصلي فوراً
    if (language === "ar") {
      setTranslated(text);
      return;
    }

    const cacheKey = `${text}-${language}`;
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey)!);
      return;
    }

    translate(text)
      .then((result) => {
        translationCache.set(cacheKey, result);
        setTranslated(result);
      })
      .catch((err) => {
        console.error("Translation error:", err);
        setTranslated(text); // fallback
      });
  }, [text, language, translate]);

  return <>{translated}</>;
};