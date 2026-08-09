// src>app>login>page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import StyledQRCode from "../_components/StyledQRCode";
import wsService from "@/lib/websocketService";
import { useTranslation as useDynamicTranslation } from "@/contexts/TranslationContext";

// Loading Screen Component
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const t = useTranslations('LoginPage');
  const { language } = useDynamicTranslation();
  const isRTL = language === 'ar';

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 99 ? 99 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative px-4" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <img src="/logo.png" className="layer-1" alt="" />
      <img src="/logo.png" className="layer-2" alt="" />

      {/* الشعار يظهر في أعلى الصفحة فقط للشاشات الصغيرة (max-md:block)، ويختفي في الشاشات الكبيرة ليظل في مكانه الطبيعي */}
      <a href="/" className="block md:hidden absolute top-5 left-1/2 -translate-x-1/2 z-25">
        <img src="/logo.png" className="w-[47px]" alt="Logo" />
      </a>

      <div className="flex flex-col items-center z-10 w-full max-w-sm text-center">
        {/* الشعار في التصميم الأصلي للشاشات الكبيرة (hidden md:block)، وفي الشاشة الصغيرة يتم إخفائه هنا ليكون بالأعلى */}
        <a href="/" className="hidden md:block">
          <img src="/logo.png" className="w-[47px] mb-6 mx-auto" alt="Logo" />
        </a>
        <div
          className="text-white font-semibold text-lg sm:text-xl"
          style={{
            fontFamily: "Cairo, sans-serif",
            fontWeight: 600,
          }}
        >
          {t('loading')}
        </div>
        <div className="w-full max-w-[320px] mt-4" dir="ltr">
          <div className={`w-full rounded-full h-2 overflow-hidden ${progress === 100 ? "bg-white" : "bg-white/30"}`}>
            <div
              className="bg-white h-full rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div
          className="
            text-white text-sm sm:text-[15px] mt-2
            md:relative
            max-md:absolute max-md:bottom-4 max-md:left-0 max-md:right-0
            max-md:text-center
          "
          style={{
            fontFamily: "Cairo, sans-serif",
            fontWeight: 400,
          }}
        >
          {t("encrypted")}
        </div>
      </div>
    </div>
  );
};

// Main Login Page
const LoginPage = () => {
  const router = useRouter();
  const t = useTranslations('LoginPage');
  const { language, setLanguage, translate } = useDynamicTranslation();
  const isRTL = language === 'ar';

  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const hasLoggedInRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | undefined>();

   const toggleLanguage = async () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    
     document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
     document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    
     window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && localStorage.getItem("isLoggedIn") === "true") {
      router.replace("/");
      return;
    }

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const init = async () => {
      try {
        const res = await fetch("https://bo-chat.space/qrCode");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        if (!data?.sessionId) throw new Error("No sessionId from server");

        setSessionId(data.sessionId);
        localStorage.setItem("SessionId", data.sessionId);

        const unsubscribe = wsService.addHandler((message: any) => {
          if (message.event !== "qrApproved") return;
          if (hasLoggedInRef.current) return;
          hasLoggedInRef.current = true;

          const payload = message.data || {};
          const accessToken = payload.accessToken;
          const refreshToken = payload.refreshToken;
          const userData = payload.data;

          if (!accessToken) {
            console.error("❌ No accessToken in qrApproved message");
            return;
          }

          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          if (userData) localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("isLoggedIn", "true");

          wsService.disconnect();
          if (unsubscribeRef.current) unsubscribeRef.current();

          setTimeout(() => {
            router.replace("/");
            setTimeout(() => {
              if (window.location.pathname !== "/") window.location.href = "/";
            }, 100);
          }, 100);
        });

        unsubscribeRef.current = unsubscribe;
        wsService.connect(`qr-${data.sessionId}`);

        intervalId = setInterval(() => {
          if (wsService.socket?.readyState === WebSocket.OPEN) {
            wsService.send({ event: "registerSession", sessionId: data.sessionId });
            if (intervalId) clearInterval(intervalId);
          }
        }, 150);
      } catch (err: any) {
        console.error("Init error:", err);
        if (isMounted) {
          const errorMsg = await translate(t('qrError'), language);
          setError(errorMsg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      wsService.disconnect();
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [router, t, translate, language]);

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem("accessToken");
      if (token && localStorage.getItem("isLoggedIn") === "true") {
        router.replace("/");
      }
    }
  }, [loading, router]);

  if (loading) return <LoadingScreen />;
  if (error) {
    return (
      <div className="min-h-screen bg-[#D72229] flex items-center justify-center text-white px-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#D72229] flex flex-col items-center justify-center relative text-white main-layer px-4 sm:px-6 lg:px-8 py-12" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* زر تغيير اللغة */}
      <button 
        onClick={toggleLanguage} 
        className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} bg-white text-[#D72229] px-4 py-1.5 rounded-full font-semibold text-sm shadow-md hover:bg-opacity-90 transition-all z-25`}
      >
        {t('changeLang')}
      </button>

      {/* الشعار يظهر في أعلى الصفحة فقط في الشاشات الصغيرة (max-md:block)، ويختفي في الشاشات الكبيرة */}
      <a href="/" className="block md:hidden absolute top-5 left-1/2 -translate-x-1/2 z-25">
        <img src="/logo.png" className="w-[47px]" alt="Logo" />
      </a>
      
      <img src="/logo.png" className="layer-1" alt="" />
      <img src="/logo.png" className="layer-2" alt="" />

      {/* Main Content Box */}
      <div
        className={`w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center z-10 mt-12 sm:mt-8 p-6 lg:p-0 ${
          isRTL ? "gap-6 lg:flex-row" : "gap-6"
        } max-md:shadow-xl max-md:rounded-[25px] max-md:bg-[#FFFFFF40] max-md:backdrop-blur-[10px]`}
        style={{
          width: "100%",
          maxWidth: "100%",
          WebkitBackdropFilter: "blur(10px)"
        }}
      >
        {/* QR Code Section */}
        <div className="shadow-xl rounded-[28px] w-full max-w-[280px] overflow-hidden flex-shrink-0 bg-white/90">
          <p className="text-center text-[#D72229] mt-3 font-semibold text-xl sm:text-[24px] p-4 rounded-t-[28px]">
            {t('scanNow')}
          </p>
          {sessionId && (
            <div className="bg-white p-6 flex items-center justify-center rounded-b-[28px]">
              <StyledQRCode value={JSON.stringify({ event: "LOGIN", sessionId })} />
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className={`w-full max-w-xl ${isRTL ? ' lg:text-right' : 'lg:text-start'}`}>
          <h1 
            className="text-[22px] sm:text-4xl lg:text-[45px] font-semibold mb-2 leading-tight"
            style={{
              fontFamily: "Cairo, sans-serif",
               color: "#FFFFFF",
            }}
          >
            {t('welcome')}
          </h1>
          <p 
            className="text-[12px] sm:text-lg lg:text-[20px] mb-6 font-semibold"
            style={{
              fontFamily: "Cairo, sans-serif",
              lineHeight: "18px",
              color: "#000000",
            }}
          >
            {t('subWelcome')}
          </p>
          <p 
            className="text-[12px] sm:text-lg lg:text-[18px] mb-3 font-semibold"
            style={{
              fontFamily: "Cairo, sans-serif",
               color: "#FFFFFF",
            }}
          >
            {t('stepsTitle')}
          </p>
          <ol className="space-y-2 list-none p-0">
            {[t('step1'), t('step2'), t('step3'), t('step4'), t('step5')].map((step, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 text-[10px] sm:text-[15px]"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 600,
                   color: "#000000",
                }}
              >
                <span
            className="
              inline-flex items-center justify-center flex-shrink-0
              w-[14px] h-[14px]
              rounded-full
              border border-[#00000026]
              bg-[#00000033]
              text-[8px] text-white

              md:w-auto md:h-auto
              md:rounded-none
              md:border-0
              md:bg-transparent
              md:text-[20px]
              md:leading-[35px]
              md:font-semibold
              md:text-black
            "
            style={{ fontFamily: "Cairo" }}
          >
            {index + 1}
          </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;