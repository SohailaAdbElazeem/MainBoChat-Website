// src/app/chats/_components/components/calls/CallInterface.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ActiveCall } from '../../types';

interface CallInterfaceProps {
  activeCall: ActiveCall;
  apiBase: string;
  token: string | null;
  userName: string;
  onClose: () => void;
}

declare global {
  interface Window {
    MediaSFU?: any;
  }
}

const CDN_URL = 'https://cdn.mediasfu.com/v4/mediasfu.js';

export default function CallInterface({
  activeCall,
  apiBase,
  token,
  userName,
  onClose,
}: CallInterfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ تحميل SDK من CDN ديناميكياً (لا يوجد import في الكود المصدري)
  useEffect(() => {
    let mounted = true;

    if (window.MediaSFU) {
      setSdkLoaded(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${CDN_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (mounted) setSdkLoaded(true);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = CDN_URL;
    script.async = true;
    script.onload = () => {
      if (mounted) setSdkLoaded(true);
    };
    script.onerror = () => {
      if (mounted) setError('فشل تحميل مكتبة المكالمات');
    };
    document.body.appendChild(script);

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ تهيئة المكالمة بعد تحميل SDK
  useEffect(() => {
    if (!sdkLoaded || !containerRef.current || !window.MediaSFU) return;

    const { MediaSFU } = window.MediaSFU;

    const createRoom = async ({ payload }: any) => {
      const res = await fetch(
        `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('فشل إنشاء الغرفة');
      return res.json();
    };

    const joinRoom = async ({ payload }: any) => {
      const res = await fetch(
        `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('فشل الانضمام للغرفة');
      return res.json();
    };

    const init = async () => {
      try {
        // ⚠️ الطريقة الصحيحة حسب توثيق MediaSFU
        // قد تحتاج لتعديلها حسب API الفعلي للـ SDK
        if (typeof MediaSFU.createRoom === 'function') {
          await MediaSFU.createRoom({
            createMediaSFURoom: createRoom,
            joinMediaSFURoom: joinRoom,
            options: {
              roomName: activeCall.roomName,
              userName,
              updateIsLoading: () => {},
            },
            container: containerRef.current,
          });
        } else {
          // Fallback: استخدام الـ React component من CDN
          console.warn('MediaSFU CDN structure unknown, check documentation');
          setError('بنية SDK غير معروفة — تحقق من التوثيق');
        }
      } catch (err: any) {
        console.error('Call init error:', err);
        setError(err.message || 'فشل بدء المكالمة');
      }
    };

    init();
  }, [sdkLoaded, activeCall, apiBase, token, userName]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[1300] bg-black flex flex-col items-center justify-center text-white gap-4">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          إغلاق
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1300] bg-black">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[1400] bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg"
        aria-label="إنهاء المكالمة"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div ref={containerRef} className="w-full h-full" />

      {!sdkLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>جاري تحميل المكالمة...</p>
          </div>
        </div>
      )}
    </div>
  );
}