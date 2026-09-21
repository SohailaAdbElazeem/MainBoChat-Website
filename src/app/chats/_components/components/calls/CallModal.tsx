
// src/app/chats/_components/components/calls/CallModal.tsx
'use client';

import { CallType } from '../../types';

interface CallModalProps {
  isOpen: boolean;
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  callTitle?: string;
  freeMinutes: number;
  totalMinutes: number;
  isStarting: boolean;
  isGroupCall?: boolean;
  groupAvatars?: string[];
  groupCount?: number;
  onClose: () => void;
  onStart: (type: CallType) => void;
}

export default function CallModal({
  isOpen,
  calleeName,
  calleeUsername = '@user',
  calleeAvatar = '/imgs/user.png',
  freeMinutes,
  isStarting,
  isGroupCall = false,
  groupAvatars = [
    '/imgs/user.png',
    '/imgs/user.png',
    '/imgs/user.png',
    '/imgs/user.png',
  ],
  groupCount = 4,
  onClose,
  onStart,
}: CallModalProps) {
  if (!isOpen) return null;

  const disabled = freeMinutes <= 0 || isStarting;

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
          overflow: 'hidden',
          marginRight: '20px',
          marginLeft: '10px',
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

        {/* ===== نص الحالة ===== */}
        <p
          style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: isGroupCall ? '15px' : '13px',
            lineHeight: '100%',
            textAlign: 'center',
            color: '#7C7D7E',
            marginBottom: isGroupCall ? '8px' : '30px',
            padding: '0 16px',
          }}
        >
          {isStarting ? 'جاري الاتصال...' : 'مكالمة صوتية'}
        </p>

        {/* ============================================ */}
        {/* ===== الحالة 1: مكالمة جماعية ===== */}
        {/* ============================================ */}
        {isGroupCall ? (
          <>
            {/* عنوان "مكالمة جماعية" */}
            <h3
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '30px',
                lineHeight: '100%',
                textAlign: 'center',
                color: '#000000',
                marginBottom: '10px',
                marginTop: '60px',
                padding: '0 16px',
              }}
            >
              مكالمة جماعية
            </h3>

            {/* صور الأشخاص متراكبة بالإطار المتعرج وتحتها نص جاري الاتصال */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'row',
                direction: 'ltr',
                marginBottom: '16px',
                padding: '0 16px',
              }}
            >
              {groupAvatars.slice(0, 4).map((avatar, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    marginRight:
                      index !== groupAvatars.slice(0, 4).length - 1
                        ? '-22px'
                        : '0px',
                    zIndex: index + 1, // الصورة الأولى تحت الثانية، والثانية تحت الثالثة وهكذا
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* حاوية الصورة */}
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="70"
                      height="70"
                      viewBox="0 0 160 160"
                      style={{ display: 'block' }}
                    >
                      <defs>
                        <clipPath id={`wavyGroupClip-${index}`}>
                          <path
                            d={generateWavyCirclePath(80, 80, 67, 14, 3)}
                          />
                        </clipPath>
                      </defs>

                      {/* الصورة مع تأثير الضبابية */}
                      <image
                        href={avatar}
                        x="0"
                        y="0"
                        width="160"
                        height="160"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#wavyGroupClip-${index})`}
                        style={{ filter: 'blur(5px)' }}
                      />

                      {/* الإطار المتعرج الحاد الساطعة */}
                      <path
                        d={generateWavyCirclePath(80, 80, 67, 14, 3)}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="6"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity="1"
                      />
                    </svg>
                  </div>

                  {/* نص "جاري الاتصال" المنسق تحت الصورة مباشرة */}
                  <span
                    style={{
                      marginTop: '-4px',
                      fontFamily: 'Cairo, sans-serif',
                       fontSize: '8px',
                      textAlign: 'center',
                      color: '#7C7D7E',
                       width: '71px',
                      height: '23px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 1,
                    }}
                  >
                    جاري الاتصال
                  </span>
                </div>
              ))}
            </div>

            {/* عدد الأشخاص */}
            <p
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '100%',
                textAlign: 'center',
                color: '#7C7D7E',
                marginBottom: '10px',
                marginTop: '15px',
              }}
            >
              {groupCount} اشخاص في هذا المكالمة
            </p>
          </>
        ) : (
          /* ============================================ */
          /* ===== الحالة 2: مكالمة فردية ===== */
          /* ============================================ */
          <>
            {/* اسم المستخدم */}
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

            {/* اليوزرنيم */}
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

            {/* صورة المستخدم مع إطار متعرج */}
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
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </div>
          </>
        )}

        {/* ===== تحذير انتهاء الرصيد ===== */}
        {freeMinutes <= 0 && (
          <p
            style={{
              color: '#D72229',
              fontSize: '12px',
              fontFamily: 'Cairo',
              marginBottom: '12px',
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            رصيد الدقائق المجانية منتهي
          </p>
        )}

        {/* ===== بوكس الأزرار السفلي ===== */}
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

/**
 * دالة توليد مسار دائري بموجات جيبية ناعمة
 */
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