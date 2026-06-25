 
// src/components/NetworkMonitor.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function NetworkMonitor() {
  const [isSlow, setIsSlow] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const lastNotifiedRef = useRef<'offline' | 'slow' | 'online' | 'latency' | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

   const showNotification = (
    title: string,
    subtitle: string,
    bgColor: string,
    iconSrc: string = "/imgs/Vector (8).svg",
    duration: number = 6000
  ) => {
    toast(
      (t) => (
        <div
          onClick={() => toast.dismiss(t.id)}
          style={{
            width: "359px",
            height: "71px",
            borderRadius: "20px",
            background: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "12px 16px",
            direction: "rtl",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: 1,
              paddingRight: "0",
            }}
          >
            <span
              style={{
                fontFamily: "Cairo",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "100%",
                textAlign: "right",
                color: "#FFFFFF",
                marginBottom: "8px",
                width: "100%",
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontFamily: "Cairo",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "100%",
                textAlign: "right",
                color: "#FFFFFF",
                width: "100%",
              }}
            >
              {subtitle}
            </span>
          </div>

          <div
            style={{
              width: "44px",
              minWidth: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={iconSrc}
              alt=""
              width="23"
              height="23"
              onError={(e) => {
                 e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      ),
      {
        duration,
        position: 'top-left',
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          maxWidth: "359px",
          marginRight: "20px",
          marginTop: "20px",
        },
      }
    );
  };

   useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (lastNotifiedRef.current !== 'online') {
        showNotification(
          'تم استعادة الاتصال',
          'شبكة الواي فاي لديك تعمل بشكل طبيعي',
          '#28A745CC',
          '/imgs/Vector (8).svg',
          3000
        );
        lastNotifiedRef.current = 'online';
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSlow(false);
      showNotification(
        'لا يوجد اتصال',
        'يرجى التحقق من اتصالك بالإنترنت',
        '#D72229CC',
        '/imgs/Vector (8).svg',
        5000
      );
      lastNotifiedRef.current = 'offline';
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. كشف ضعف الشبكة (عبر Network Information API)
  useEffect(() => {
    if (!('connection' in navigator)) return;
    const connection = (navigator as any).connection;

    const handleChange = () => {
      if (!isOnline) return;
      const isSlowNow =
        (connection.downlink && connection.downlink < 0.8) ||
        (connection.rtt && connection.rtt > 300);

      if (isSlowNow && !isSlow) {
        setIsSlow(true);
        showNotification(
          'مشكلة في الاتصال',
          'شبكة الواي فاي لديك ضعيفة حاول مجدداً',
          '#D72229CC',
          '/imgs/Vector (8).svg',
          6000
        );
        lastNotifiedRef.current = 'slow';
      } else if (!isSlowNow && isSlow) {
        setIsSlow(false);
        showNotification(
          'استعاد الاتصال سرعته',
          'شبكة الواي فاي لديك تعمل بشكل طبيعي',
          '#28A745CC',
          '/imgs/Vector (8).svg',
          2000
        );
        lastNotifiedRef.current = 'online';
      }
    };

    connection.addEventListener('change', handleChange);
    handleChange();
    return () => connection.removeEventListener('change', handleChange);
  }, [isSlow, isOnline]);

  // 3. قياس زمن الاستجابة (Latency) – مع تحسينات لتجنب أخطاء الشبكة
  useEffect(() => {
    if (!isOnline) return; // لا نرسل طلباً إذا كنا غير متصلين

    const checkLatency = async () => {
      // تحقق إضافي قبل الطلب
      if (!navigator.onLine) return;

      // إلغاء أي طلب سابق
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const signal = controller.signal;

      const start = Date.now();
      try {
        // مهلة 5 ثوانٍ
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        await fetch('/', { 
          method: 'HEAD', 
          cache: 'no-store',
          signal,
        });
        clearTimeout(timeoutId);

        const latency = Date.now() - start;

        if (latency > 1000 && !isSlow) {
          if (lastNotifiedRef.current !== 'latency') {
            showNotification(
              'استجابة بطيئة',
              'يرجى التحقق من اتصالك بالإنترنت',
              '#FFC107CC', 
              '/imgs/Vector (8).svg',
              5000
            );
            lastNotifiedRef.current = 'latency';
          }
        } else if (latency <= 1000 && lastNotifiedRef.current === 'latency') {
          lastNotifiedRef.current = null;
        }
      } catch (error) {
       
        if (error instanceof Error && error.name === 'AbortError') {
         } else {
         }
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    };

    const interval = setInterval(checkLatency, 30000);
    checkLatency();

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [isOnline, isSlow]);

  return null;
}