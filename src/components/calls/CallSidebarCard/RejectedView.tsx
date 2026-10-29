 // src/components/calls/CallSidebarCard/RejectedView.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import WavyAvatar from '../_shared/WavyAvatar';
import { COLORS, FONT, RADIUS } from '../constants';

interface Props {
  peerName: string;
  peerUsername: string;
  peerAvatar: string;
  isCallee?: boolean;
  statusText?: string; 
  onCallBack: () => void;
  onMessage: () => void;
  onClose?: () => void;
}

export default function RejectedView({
  peerName,
  peerUsername,
  peerAvatar,
  isCallee = false,
  statusText: customStatusText,
  onCallBack,
  onMessage,
  onClose,
}: Props) {
  const defaultText = isCallee ? 'تم رفض المكالمة' : 'لم يتم الرد';
  const statusText = customStatusText || defaultText;
   const statusColor =statusText === 'تم انتهاء الاتصال' ? '#7C7D7E' : COLORS.danger;

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onClose) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (cardRef.current && cardRef.current.contains(target)) {
        return;
      }

      console.log('❌ Click outside RejectedView → closing');
      onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleDocumentClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [onClose]);

  return (
    <div
      ref={cardRef}
      dir="rtl"
      style={{
        width: '100%',
        borderRadius: RADIUS.card,
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 28px 16px',
        boxSizing: 'border-box',
        gap: '7px',
       }}
    >
      {/* 1. نص الحالة */}
      <p
        style={{
          fontFamily: FONT.cairo,
          fontWeight: 600,
          fontSize: '14px',
          color: statusColor,
          marginBottom: '30px', 
          textAlign: 'center',
        }}
      >
        {statusText}
      </p>

      {/* 2. اسم الشخص */}
      <h3
        style={{
          fontFamily: FONT.cairo,
          fontWeight: 600,
          fontSize: '25px',
          color: COLORS.text,
          margin: 0,
          textAlign: 'center',
        }}
      >
        {peerName}
      </h3>

      {/* 3. اسم المستخدم */}
      <p
        style={{
          fontFamily: FONT.cairo,
          fontWeight: 400,
          fontSize: '14px',
          color: COLORS.text,
          margin: 0,
          marginTop: '-10px',
          textAlign: 'center',
        }}
      >
        @{peerUsername}
      </p>

      {/* 4. صورة الشخص (موجية) */}
     
      <div
  style={{
    position: 'relative',
    width: '160px',        
    height: '160px',       
    margin: '12px 0',
     margin: '0 0 25px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <WavyAvatar clipId="rejectedWavyClip" size={160} src={peerAvatar} />
</div>

 
      {/* 5. أزرار: إعادة الاتصال + المراسلة */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',   
          justifyContent: 'center',
          width: '100%',
          marginTop: '8px',
        }}
      >
        {/* زر المراسلة + النص */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={onMessage}
            aria-label="إرسال رسالة"
            style={{
              width: '80px',
              height: '64px',
              borderRadius: '38.5px',
              background: COLORS.white,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
          >
            <img
              src="/imgs/Message.svg"
              alt="رسالة"
              style={{
                width: '22px',
                height: '22px',
                objectFit: 'contain',
              }}
            />
          </button>

          {/* النص تحت زر المراسلة */}
          <span
            style={{
              fontFamily: FONT.cairo,
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: 0,
              textAlign: 'center',
              color: '#7C7D7E',   
            }}
          >
            رسالة
          </span>
        </div>

        {/* زر إعادة الاتصال + النص */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={onCallBack}
            aria-label="إعادة الاتصال"
            style={{
              width: '150px',
              height: '64px',
              borderRadius: '38.5px',
              background: '#0EC214',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            <img
              src="/imgs/call.svg"
              alt="إعادة الاتصال"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain',
              }}
            />
          </button>

          {/* النص تحت زر إعادة الاتصال */}
          <span
            style={{
              fontFamily: FONT.cairo,
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: 0,
              textAlign: 'center',
              color: '#7C7D7E',
            }}
          >
            إعادة الاتصال
          </span>
        </div>
      </div>
    </div>
  );
}