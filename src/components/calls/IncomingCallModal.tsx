// src/components/calls/IncomingCallModal.tsx
'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { CallInvitation } from '@/lib/zego/zimService';   // ✅ التعديل هنا

interface IncomingCallModalProps {
  isOpen: boolean;
  invitation: CallInvitation | null;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallModal({
  isOpen,
  invitation,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  const [countdown, setCountdown] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [buttonWidth] = useState(78);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const dragStartX = useRef(0);

  // ================== Ringtone + Countdown ==================
  const stopRingtone = useCallback(() => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !invitation) return;

    setCountdown(60);
    setDragX(0);

    try {
      const audio = new Audio('/sounds/ringtone.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(() => {
        console.log('⚠️ Ringtone autoplay blocked');
      });
      ringtoneRef.current = audio;
    } catch (e) {
      // silent
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      stopRingtone();
    };
  }, [isOpen, invitation, stopRingtone]);

  useEffect(() => {
    if (countdown === 0 && isOpen) {
      stopRingtone();
      onReject();
    }
  }, [countdown, isOpen, onReject, stopRingtone]);

  // ================== Swipe Logic ==================
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const maxDrag = (containerWidth - buttonWidth) / 2;

    const deltaX = e.clientX - dragStartX.current;
    const clampedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    const normalizedDrag = clampedDelta / maxDrag;

    setDragX(normalizedDrag);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX > 0.7) {
      stopRingtone();
      onAccept();
    } else if (dragX < -0.7) {
      stopRingtone();
      onReject();
    } else {
      setDragX(0);
    }

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // ================== Helpers ==================
  const wavyPath = useMemo(() => {
    return generateWavyCirclePath(80, 80, 70, 14, 3);
  }, []);

  if (!isOpen || !invitation) return null;

  const isVideo = invitation.type === 'video';
  const buttonOffset = dragX * 103;

  // ================== Render ==================
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999999,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '357px',
          borderRadius: '35px',
          background: '#F1F4F9',
          paddingTop: '30px',
          paddingBottom: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          // boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#D72229',
            marginBottom: '8px',
            padding: '0 16px',
          }}
        >
          مكالمة {isVideo ? 'فيديو' : 'صوتية'} واردة
        </p>

        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 400,
            fontSize: '12px',
            textAlign: 'center',
            color: '#7C7D7E',
            marginBottom: '24px',
          }}
        >
          {countdown} ثانية
        </p>

        <h3
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '22px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000000',
            marginBottom: '6px',
            padding: '0 16px',
          }}
        >
          {invitation.callerName}
        </h3>
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            textAlign: 'center',
            color: '#000000',
            marginBottom: '12px',
            padding: '0 16px',
          }}
        >
          {invitation.callerUsername
            ? `@${invitation.callerUsername}`
            : `@${invitation.callerID?.slice(-8) || 'user'}`}
        </p>

        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{ display: 'block' }}
          >
            <defs>
              <clipPath id="incomingWavyClip">
                <path d={wavyPath} />
              </clipPath>
            </defs>

            <image
              href={invitation.callerAvatar || '/imgs/user.png'}
              x="0"
              y="0"
              width="160"
              height="160"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#incomingWavyClip)"
            />

            <path
              d={wavyPath}
              fill="none"
              stroke="transparent"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div
          style={{
            width: '100%',
            borderBottomLeftRadius: '35px',
            borderBottomRightRadius: '35px',
            background: '#EAEDF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '284px',
              height: '78px',
              borderRadius: '38.5px',
              background: '#DEE1EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              overflow: 'hidden',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: `${Math.max(0, dragX * 100)}%`,
                background: 'linear-gradient(270deg, #4CAF50 0%, rgba(76,175,80,0) 100%)',
                transition: isDragging ? 'none' : 'width 0.3s',
                pointerEvents: 'none',
                opacity: dragX > 0 ? 1 : 0,
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${Math.max(0, -dragX * 100)}%`,
                background: 'linear-gradient(90deg, #D72229 0%, rgba(215,34,41,0) 100%)',
                transition: isDragging ? 'none' : 'width 0.3s',
                pointerEvents: 'none',
                opacity: dragX < 0 ? 1 : 0,
              }}
            />

            <span
              style={{
                position: 'absolute',
                left: '28px',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '16px',
                color: '#D72229',
                opacity: dragX < 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              رفض
            </span>

            <span
              style={{
                position: 'absolute',
                right: '28px',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '16px',
                color: '#4CAF50',
                opacity: dragX > 0 ? 1 - Math.abs(dragX) * 0.5 : 1,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              قبول
            </span>

            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${buttonOffset}px), -50%)`,
                width: '78px',
                height: '78px',
                borderRadius: '50%',
                background: isDragging
                  ? dragX > 0.3
                    ? '#4CAF50'
                    : dragX < -0.3
                    ? '#D72229'
                    : '#FFFFFF'
                  : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDragging ? 'grabbing' : 'grab',
                // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: isDragging ? 'background 0.2s' : 'transform 0.3s, background 0.2s',
                zIndex: 10,
                userSelect: 'none',
                touchAction: 'none',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDragging && (dragX > 0.3 || dragX < -0.3) ? '#FFFFFF' : '#000000'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// ================== Helper ==================
function generateWavyCirclePath(
  cx: number,
  cy: number,
  radius: number,
  waveCount: number,
  amplitude: number
): string {
  const steps = waveCount * 12;
  const step = (Math.PI * 2) / steps;
  let path = '';

  for (let i = 0; i <= steps; i++) {
    const angle = i * step - Math.PI / 2;
    const r = radius + amplitude * Math.sin(waveCount * angle);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    if (i === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
  }

  return path + ' Z';
}