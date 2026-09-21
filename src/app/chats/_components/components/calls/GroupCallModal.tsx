// src/app/chats/_components/components/calls/GroupCallModal.tsx
'use client';

import { CallType, GroupCallParticipant } from '../../types';


export interface GroupCallParticipant {
  id: string;
  name: string;
  avatar: string;
}

interface GroupCallModalProps {
  isOpen: boolean;
  participants: GroupCallParticipant[];
  freeMinutes: number;
  isStarting: boolean;
  onClose: () => void;
  onStart: (type: CallType) => void;
}

export default function GroupCallModal({
  isOpen,
  participants = [],
  freeMinutes,
  isStarting,
  onClose,
  onStart,
}: GroupCallModalProps) {
  if (!isOpen) return null;

  const disabled = freeMinutes <= 0 || isStarting;
  const displayParticipants = participants.slice(0, 4);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
      }}
    >
      {/* ===== البوكس الرئيسي ===== */}
      <div
        style={{
          width: '100%',
          maxWidth: '357px',
          borderRadius: '35px',
          background: '#F1F4F9',
          paddingTop: '20px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* ===== زر الإغلاق ===== */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="إغلاق"
          style={{ zIndex: 10 }}
        >
          <svg
            className="h-5 w-5"
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

        {/* ===== 1) "جاري الاتصال..." ===== */}
        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '15px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#7C7D7E',
            marginBottom: '12px',
            padding: '0 16px',
          }}
        >
          {isStarting ? 'جاري الاتصال...' : 'مكالمة جماعية واردة'}
        </p>

        {/* ===== 2) "مكالمة جماعية" ===== */}
        <h3
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '30px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#000000',
            marginBottom: '24px',
            padding: '0 16px',
          }}
        >
          مكالمة جماعية
        </h3>

        {/* ===== 3) صور الأشخاص متراكبة ===== */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${(displayParticipants.length - 1) * 55 + 120}px`,
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {displayParticipants.map((participant, index) => {
            const offsetY = index * 55;

            return (
              <div
                key={participant.id}
                style={{
                  position: 'absolute',
                  top: `${offsetY}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: index + 1,
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  style={{ display: 'block' }}
                >
                  <defs>
                    <clipPath id={`groupAvatarClip-${index}`}>
                      <path d={generateWavyCirclePath(60, 60, 52, 14, 3)} />
                    </clipPath>
                  </defs>

                  {/* إطار أبيض */}
                  <circle cx="60" cy="60" r="55" fill="#FFFFFF" />

                  {/* الصورة */}
                  <image
                    href={participant.avatar}
                    x="0"
                    y="0"
                    width="120"
                    height="120"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#groupAvatarClip-${index})`}
                  />

                  {/* حد متعرج */}
                  <path
                    d={generateWavyCirclePath(60, 60, 52, 14, 3)}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </div>
            );
          })}
        </div>

        {/* ===== 4) بوكس الأزرار ===== */}
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
            gap: '10px',
            padding: '16px 10px',
            marginTop: 'auto',
          }}
        >
          {isStarting ? (
            <button
              disabled
              style={{
                width: '150px',
                height: '50px',
                borderRadius: '38.5px',
                background: '#D72229',
                border: 'none',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: 1,
              }}
            >
              <img
                src="/imgs/call.svg"
                alt="جاري الاتصال"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </button>
          ) : (
            <button
              onClick={() => onStart('audio')}
              disabled={disabled}
              style={{
                width: '150px',
                height: '50px',
                borderRadius: '38.5px',
                background: !disabled ? '#D72229' : '#B4B4B9',
                border: 'none',
                cursor: !disabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: !disabled ? 1 : 0.5,
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src="/imgs/call.svg"
                alt="اتصال"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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