// src/components/NetworkMonitor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NetworkMonitor() {
  const [isSlow, setIsSlow] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

   const showNotification = (
    title: string,
    subtitle: string,
    bgColor: string,
    iconSrc: string = "imgs/Vector (8).svg",
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
          {/* النصوص */}
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

          {/* الأيقونة */}
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
            <img src={iconSrc} alt="" width="23" height="23" />
          </div>
        </div>
      ),
      {
        duration: duration,
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
      showNotification(
        'تم استعادة الاتصال',
        'شبكة الواي فاي لديك تعمل بشكل طبيعي',
        '#28A745CC', 
        'imgs/Vector (8).svg',
        3000
      );
    };

    const handleOffline = () => {
      setIsOnline(false);
      showNotification(
        'لا يوجد اتصال',
        'يرجى التحقق من اتصالك بالإنترنت',
        '#D72229CC',
        'imgs/Vector (8).svg',
        5000
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

   useEffect(() => {
    if (!('connection' in navigator)) return;

    const connection = (navigator as any).connection;

    const handleChange = () => {
      const isSlowNow =
        (connection.downlink && connection.downlink < 0.8) ||
        (connection.rtt && connection.rtt > 300);

      if (isSlowNow && !isSlow) {
        setIsSlow(true);
        showNotification(
          'مشكلة في الاتصال',
          'شبكة الواي فاي لديك ضعيفة حاول مجدداً',
          '#D72229CC', // أحمر
          'imgs/Vector (8).svg',
          6000
        );
      } else if (!isSlowNow && isSlow) {
        setIsSlow(false);
        showNotification(
          'استعاد الاتصال سرعته',
          'شبكة الواي فاي لديك تعمل بشكل طبيعي',
          '#28A745CC', // أخضر
          'imgs/Vector (8).svg',
          2000
        );
      }
    };

    connection.addEventListener('change', handleChange);
    handleChange();

    return () => connection.removeEventListener('change', handleChange);
  }, [isSlow]);

   useEffect(() => {
    if (!isOnline) return;

    const checkLatency = async () => {
      const start = Date.now();
      try {
        await fetch('/api/ping', { method: 'HEAD', cache: 'no-store' });
        const latency = Date.now() - start;
        if (latency > 1000 && !isSlow) {
          setIsSlow(true);
          showNotification(
            'استجابة بطيئة',
            'يرجى التحقق من اتصالك بالإنترنت',
            '#FFC107CC', // 
            'imgs/Vector (8).svg',
            5000
          );
        }
      } catch {
       }
    };

    const interval = setInterval(checkLatency, 30000);
    checkLatency();

    return () => clearInterval(interval);
  }, [isOnline, isSlow]);

  return null;
}