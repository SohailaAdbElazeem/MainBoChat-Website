// src/components/NetworkMonitor.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/contexts/TranslationContext';

export default function NetworkMonitor() {
  const t = useTranslations('NetworkMonitor');
  const { isRTL } = useLanguage();
  
  const [isSlow, setIsSlow] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const lastNotifiedRef = useRef<'offline' | 'slow' | 'online' | 'latency' | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // استخدام useCallback لتثبيت الدالة
  const showNotification = useCallback(
    (
      title: string,
      subtitle: string,
      bgColor: string,
      iconSrc: string = "/imgs/Vector (8).svg",
      duration: number = 6000
    ) => {
      toast(
        (toastId) => (
          <div
            onClick={() => toast.dismiss(toastId.id)}
            style={{
              width: "359px",
              height: "71px",
              borderRadius: "20px",
              background: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "12px 16px",
              direction: isRTL ? "rtl" : "ltr",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              gap: "12px",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, fontSize: "20px", color: "#fff" }}>
                {title}
              </span>
              <span style={{ fontWeight: 600, fontSize: "12px", color: "#fff" }}>
                {subtitle}
              </span>
            </div>

            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
          position: isRTL ? 'top-left' : 'top-right',
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            maxWidth: "359px",
          },
        }
      );
    },
    [isRTL]
  );

  // 1. Online / Offline detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);

      if (lastNotifiedRef.current !== 'online') {
        showNotification(
          t('onlineTitle'),
          t('onlineSubtitle'),
          '#28A745CC'
        );
        lastNotifiedRef.current = 'online';
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSlow(false);

      showNotification(
        t('offlineTitle'),
        t('offlineSubtitle'),
        '#D72229CC'
      );

      lastNotifiedRef.current = 'offline';
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t, showNotification]);

  // 2. Slow network detection
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (!("connection" in navigator)) return;

    const connection = (navigator as any).connection;

    const handleChange = () => {
      if (!isOnline) return;

      const isSlowNow =
        (connection.downlink && connection.downlink < 0.8) ||
        (connection.rtt && connection.rtt > 300);

      if (isSlowNow && !isSlow) {
        setIsSlow(true);

        showNotification(
          t('slowTitle'),
          t('slowSubtitle'),
          '#D72229CC'
        );

        lastNotifiedRef.current = 'slow';
      } else if (!isSlowNow && isSlow) {
        setIsSlow(false);

        showNotification(
          t('improvedTitle'),
          t('improvedSubtitle'),
          '#28A745CC'
        );

        lastNotifiedRef.current = 'online';
      }
    };

    connection.addEventListener('change', handleChange);
    handleChange();

    return () => {
      connection.removeEventListener('change', handleChange);
    };
  }, [isOnline, isSlow, t, showNotification]);

  // 3. Latency check
  useEffect(() => {
    if (!isOnline) return;
    if (typeof window === "undefined") return;

    const checkLatency = async () => {
      if (typeof navigator === "undefined" || !navigator.onLine) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const start = Date.now();

      try {
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch('/', {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const latency = Date.now() - start;

        if (latency > 1000 && !isSlow) {
          if (lastNotifiedRef.current !== 'latency') {
            showNotification(
              t('latencyTitle'),
              t('latencySubtitle'),
              '#FFC107CC'
            );

            lastNotifiedRef.current = 'latency';
          }
        } else if (latency <= 1000) {
          if (lastNotifiedRef.current === 'latency') {
            lastNotifiedRef.current = null;
          }
        }
      } catch (error) {
        // Silent fail - no need to show error for latency check
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
      }
    };
  }, [isOnline, isSlow, t, showNotification]);

  return null;
}