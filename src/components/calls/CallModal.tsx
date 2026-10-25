// ظظظظظظظظظظظظظظظظظظ
// src/components/calls/CallModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useZegoCall } from '@/components/ZegoCallProvider';

// ================== Types ==================
interface CallModalProps {
  isOpen: boolean;
  calleeId: string;
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  isVideoCall?: boolean;
  onClose: () => void;
}

// ================== Component ==================
export default function CallModal({
  isOpen,
  calleeId,
  calleeName,
  calleeUsername = '@user',
  calleeAvatar = '/imgs/user.png',
  isVideoCall = false,
  onClose,
}: CallModalProps) {
  const {
    isReady,
    callState,
    endCall,
    startCall,
  } = useZegoCall();

  const [callDuration, setCallDuration] = useState('00:00');
  const [hasStarted, setHasStarted] = useState(false);

  // ================== الاستماع لإشارة الإغلاق القسري ==================
  useEffect(() => {
    const handleForceClose = () => {
      console.log('📴 CallModal: Force close event received');
      setHasStarted(false);
      setCallDuration('00:00');
      onClose();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('zego:force_close_call_modal', handleForceClose);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('zego:force_close_call_modal', handleForceClose);
      }
    };
  }, [onClose]);

  // ================== ⭐ إغلاق تلقائي لما callState يبقى idle ==================
  useEffect(() => {
    if (!isOpen) return;
    if (!hasStarted) return;

    // لو المكالمة اتقفلت أو اتلغت (status = idle) → اقفل المودال
    if (callState?.status === 'idle') {
      console.log('📴 CallModal: callState is idle, auto-closing modal...');
      setHasStarted(false);
      setCallDuration('00:00');
      onClose();
    }
  }, [callState, isOpen, hasStarted, onClose]);

  // ================== إعادة ضبط الحالات عند إغلاق المودال ==================
  useEffect(() => {
    if (!isOpen) {
      setHasStarted(false);
      setCallDuration('00:00');
    }
  }, [isOpen, calleeId]);

  // ================== بدء المكالمة تلقائياً ==================
  useEffect(() => {
    if (!isOpen || hasStarted) return;

    if (!isReady) {
      console.log('⏳ CallModal: waiting for Express...', { isReady });
      return;
    }

    console.log('📞 CallModal: starting call to', calleeName, 'ID:', calleeId);

    startCall(calleeId, calleeName, isVideoCall, calleeAvatar);
    setHasStarted(true);
  }, [
    isOpen,
    isReady,
    hasStarted,
    calleeId,
    calleeName,
    calleeAvatar,
    isVideoCall,
    startCall,
  ]);

  // ================== المؤقت ==================
  useEffect(() => {
    if (callState?.status !== 'connected') {
      setCallDuration('00:00');
      return;
    }

    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  // ================== إغلاق المكالمة ==================
  const handleEndCall = () => {
    console.log('📴 CallModal: ending call');
    endCall();
    setHasStarted(false);
    setCallDuration('00:00');
    onClose();
  };

  if (!isOpen) return null;

  // ================== نص الحالة ==================
  const statusText =
    callState?.status === 'connected'
      ? `مكالمة جارية • ${callDuration}`
      : callState?.status === 'calling'
      ? 'جاري الاتصال...'
      : !isReady
      ? 'جاري التحضير...'
      : 'مكالمة صوتية';

  // ================== Render ==================
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '357px',
          borderRadius: '35px',
          background: '#F1F4F9',
          paddingTop: '20px',
          paddingBottom: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* ===== زر الإغلاق ===== */}
        <button
          onClick={handleEndCall}
          aria-label="إغلاق"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#7C7D7E',
            transition: 'color 0.2s',
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ===== نص الحالة ===== */}
        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#7C7D7E',
            marginBottom: '30px',
            marginTop: '10px',
            padding: '0 16px',
          }}
        >
          {statusText}
        </p>

        {/* ===== اسم المستخدم ===== */}
        <h3
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000000',
            marginBottom: '6px',
            padding: '0 16px',
          }}
        >
          {calleeName}
        </h3>

        {/* ===== اليوزرنيم ===== */}
        <p
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#000000',
            width: '100%',
            marginBottom: '12px',
            padding: '0 16px',
          }}
        >
          {calleeUsername}
        </p>

        {/* ===== صورة المستخدم ===== */}
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            marginBottom: '20px',
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
              <clipPath id="wavyAvatarClip">
                <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
              </clipPath>
            </defs>

            <image
              href={calleeAvatar}
              x="0"
              y="0"
              width="160"
              height="160"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#wavyAvatarClip)"
            />

            <path
              d={generateWavyCirclePath(80, 80, 70, 14, 3)}
              fill="none"
              stroke="transparent"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* ===== زر الإغلاق الكبير ===== */}
        <div
          style={{
            width: '100%',
            borderBottomLeftRadius: '35px',
            borderBottomRightRadius: '35px',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            background: '#EAEDF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          <button
            onClick={handleEndCall}
            style={{
              width: '150px',
              height: '50px',
              borderRadius: '38.5px',
              background: '#D72229',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(215,34,41,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="إنهاء المكالمة"
          >
            <img
              src="/imgs/call.svg"
              alt="إنهاء الاتصال"
              style={{
                width: '24px',
                height: '24px',
                filter: 'brightness(0) invert(1)',
                transform: 'rotate(135deg)',
              }}
            />
          </button>
        </div>
      </div>
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
