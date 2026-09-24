
// // src/app/chats/_components/components/calls/CallModal.tsx
// 'use client';

// import { CallType } from '../../types';

// interface CallModalProps {
//   isOpen: boolean;
//   calleeName: string;
//   calleeUsername?: string;
//   calleeAvatar?: string;
//   callTitle?: string;
//   freeMinutes: number;
//   totalMinutes: number;
//   isStarting: boolean;
//   isGroupCall?: boolean;
//   groupAvatars?: string[];
//   groupCount?: number;
//   onClose: () => void;
//   onStart: (type: CallType) => void;
// }

// export default function CallModal({
//   isOpen,
//   calleeName,
//   calleeUsername = '@user',
//   calleeAvatar = '/imgs/user.png',
//   freeMinutes,
//   isStarting,
//   isGroupCall = false,
//   groupAvatars = [
//     '/imgs/user.png',
//     '/imgs/user.png',
//     '/imgs/user.png',
//     '/imgs/user.png',
//   ],
//   groupCount = 4,
//   onClose,
//   onStart,
// }: CallModalProps) {
//   if (!isOpen) return null;

//   const disabled = freeMinutes <= 0 || isStarting;

//   return (
//     <div
//       style={{
//         width: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//         padding: '10px 0',
//       }}
//     >
//       {/* ===== البوكس الرئيسي ===== */}
//       <div
//         style={{
//           width: '100%',
//           maxWidth: '357px',
//           borderRadius: '35px',
//           background: '#F1F4F9',
//           paddingTop: '20px',
//           paddingBottom: '0px',
//           paddingLeft: '0px',
//           paddingRight: '0px',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           position: 'relative',
//           overflow: 'hidden',
//           marginRight: '20px',
//           marginLeft: '10px',
//         }}
//       >
//         {/* ===== زر الإغلاق ===== */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 left-3 text-gray-400 hover:text-gray-700 transition-colors"
//           aria-label="إغلاق"
//           style={{ zIndex: 10 }}
//         >
//           <svg
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         {/* ===== نص الحالة ===== */}
//         <p
//           style={{
//             fontFamily: 'Cairo',
//             fontWeight: 600,
//             fontSize: isGroupCall ? '15px' : '13px',
//             lineHeight: '100%',
//             textAlign: 'center',
//             color: '#7C7D7E',
//             marginBottom: isGroupCall ? '8px' : '30px',
//             padding: '0 16px',
//           }}
//         >
//           {isStarting ? 'جاري الاتصال...' : 'مكالمة صوتية'}
//         </p>

//         {/* ============================================ */}
//         {/* ===== الحالة 1: مكالمة جماعية ===== */}
//         {/* ============================================ */}
//         {isGroupCall ? (
//           <>
//             {/* عنوان "مكالمة جماعية" */}
//             <h3
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '30px',
//                 lineHeight: '100%',
//                 textAlign: 'center',
//                 color: '#000000',
//                 marginBottom: '10px',
//                 marginTop: '60px',
//                 padding: '0 16px',
//               }}
//             >
//               مكالمة جماعية
//             </h3>

//             {/* صور الأشخاص متراكبة بالإطار المتعرج وتحتها نص جاري الاتصال */}
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'flex-start',
//                 justifyContent: 'center',
//                 flexDirection: 'row',
//                 direction: 'ltr',
//                 marginBottom: '16px',
//                 padding: '0 16px',
//               }}
//             >
//               {groupAvatars.slice(0, 4).map((avatar, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     position: 'relative',
//                     marginRight:
//                       index !== groupAvatars.slice(0, 4).length - 1
//                         ? '-22px'
//                         : '0px',
//                     zIndex: index + 1, // الصورة الأولى تحت الثانية، والثانية تحت الثالثة وهكذا
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {/* حاوية الصورة */}
//                   <div
//                     style={{
//                       width: '70px',
//                       height: '70px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <svg
//                       width="70"
//                       height="70"
//                       viewBox="0 0 160 160"
//                       style={{ display: 'block' }}
//                     >
//                       <defs>
//                         <clipPath id={`wavyGroupClip-${index}`}>
//                           <path
//                             d={generateWavyCirclePath(80, 80, 67, 14, 3)}
//                           />
//                         </clipPath>
//                       </defs>

//                       {/* الصورة مع تأثير الضبابية */}
//                       <image
//                         href={avatar}
//                         x="0"
//                         y="0"
//                         width="160"
//                         height="160"
//                         preserveAspectRatio="xMidYMid slice"
//                         clipPath={`url(#wavyGroupClip-${index})`}
//                         style={{ filter: 'blur(5px)' }}
//                       />

//                       {/* الإطار المتعرج الحاد الساطعة */}
//                       <path
//                         d={generateWavyCirclePath(80, 80, 67, 14, 3)}
//                         fill="none"
//                         stroke="transparent"
//                         strokeWidth="6"
//                         strokeLinejoin="round"
//                         strokeLinecap="round"
//                         opacity="1"
//                       />
//                     </svg>
//                   </div>

//                   {/* نص "جاري الاتصال" المنسق تحت الصورة مباشرة */}
//                   <span
//                     style={{
//                       marginTop: '-4px',
//                       fontFamily: 'Cairo, sans-serif',
//                        fontSize: '8px',
//                       textAlign: 'center',
//                       color: '#7C7D7E',
//                        width: '71px',
//                       height: '23px',
//                       borderRadius: '12px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       opacity: 1,
//                     }}
//                   >
//                     جاري الاتصال
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* عدد الأشخاص */}
//             <p
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '14px',
//                 lineHeight: '100%',
//                 textAlign: 'center',
//                 color: '#7C7D7E',
//                 marginBottom: '10px',
//                 marginTop: '15px',
//               }}
//             >
//               {groupCount} اشخاص في هذا المكالمة
//             </p>
//           </>
//         ) : (
//           /* ============================================ */
//           /* ===== الحالة 2: مكالمة فردية ===== */
//           /* ============================================ */
//           <>
//             {/* اسم المستخدم */}
//             <h3
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '20px',
//                 lineHeight: '100%',
//                 textAlign: 'center',
//                 color: '#000000',
//                 marginBottom: '6px',
//                 padding: '0 16px',
//               }}
//             >
//               {calleeName}
//             </h3>

//             {/* اليوزرنيم */}
//             <p
//               style={{
//                 fontFamily: 'Inter',
//                 fontWeight: 400,
//                 fontSize: '13px',
//                 lineHeight: '100%',
//                 textAlign: 'center',
//                 color: '#000000',
//                 width: '100%',
//                 marginBottom: '12px',
//                 padding: '0 16px',
//               }}
//             >
//               {calleeUsername}
//             </p>

//             {/* صورة المستخدم مع إطار متعرج */}
//             <div
//               style={{
//                 position: 'relative',
//                 width: '160px',
//                 height: '160px',
//                 marginBottom: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <svg
//                 width="160"
//                 height="160"
//                 viewBox="0 0 160 160"
//                 style={{ display: 'block' }}
//               >
//                 <defs>
//                   <clipPath id="wavyAvatarClip">
//                     <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
//                   </clipPath>
//                 </defs>

//                 <image
//                   href={calleeAvatar}
//                   x="0"
//                   y="0"
//                   width="160"
//                   height="160"
//                   preserveAspectRatio="xMidYMid slice"
//                   clipPath="url(#wavyAvatarClip)"
//                 />

//                 <path
//                   d={generateWavyCirclePath(80, 80, 70, 14, 3)}
//                   fill="none"
//                   stroke="transparent"
//                   strokeWidth="1.5"
//                   strokeLinejoin="round"
//                   strokeLinecap="round"
//                   opacity="0.9"
//                 />
//               </svg>
//             </div>
//           </>
//         )}

//         {/* ===== تحذير انتهاء الرصيد ===== */}
//         {freeMinutes <= 0 && (
//           <p
//             style={{
//               color: '#D72229',
//               fontSize: '12px',
//               fontFamily: 'Cairo',
//               marginBottom: '12px',
//               textAlign: 'center',
//               padding: '0 16px',
//             }}
//           >
//             رصيد الدقائق المجانية منتهي
//           </p>
//         )}

//         {/* ===== بوكس الأزرار السفلي ===== */}
//         <div
//           style={{
//             width: '100%',
//             borderBottomLeftRadius: '35px',
//             borderBottomRightRadius: '35px',
//             borderTopLeftRadius: '0px',
//             borderTopRightRadius: '0px',
//             background: '#EAEDF6',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '10px',
//             padding: '16px 10px',
//           }}
//         >
//           {isStarting ? (
//             <button
//               disabled
//               style={{
//                 width: '150px',
//                 height: '50px',
//                 borderRadius: '38.5px',
//                 background: '#D72229',
//                 border: 'none',
//                 cursor: 'not-allowed',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px',
//                 opacity: 1,
//               }}
//             >
//               <img
//                 src="/imgs/call.svg"
//                 alt="جاري الاتصال"
//                 style={{
//                   width: '24px',
//                   height: '24px',
//                   filter: 'brightness(0) invert(1)',
//                 }}
//               />
//             </button>
//           ) : (
//             <button
//               onClick={() => onStart('audio')}
//               disabled={disabled}
//               style={{
//                 width: '150px',
//                 height: '50px',
//                 borderRadius: '38.5px',
//                 background: !disabled ? '#D72229' : '#B4B4B9',
//                 border: 'none',
//                 cursor: !disabled ? 'pointer' : 'not-allowed',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px',
//                 opacity: !disabled ? 1 : 0.5,
//                 transition: 'transform 0.15s, opacity 0.15s',
//               }}
//               onMouseEnter={(e) => {
//                 if (!disabled) e.currentTarget.style.transform = 'scale(1.03)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//               }}
//             >
//               <img
//                 src="/imgs/call.svg"
//                 alt="اتصال"
//                 style={{
//                   width: '24px',
//                   height: '24px',
//                   filter: 'brightness(0) invert(1)',
//                 }}
//               />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /**
//  * دالة توليد مسار دائري بموجات جيبية ناعمة
//  */
// function generateWavyCirclePath(
//   cx: number,
//   cy: number,
//   radius: number,
//   waveCount: number,
//   amplitude: number
// ): string {
//   const steps = waveCount * 12;
//   const step = (Math.PI * 2) / steps;
//   let path = '';

//   for (let i = 0; i <= steps; i++) {
//     const angle = i * step - Math.PI / 2;
//     const r = radius + amplitude * Math.sin(waveCount * angle);
//     const x = cx + r * Math.cos(angle);
//     const y = cy + r * Math.sin(angle);

//     if (i === 0) {
//       path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
//     } else {
//       path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
//     }
//   }

//   return path + ' Z';
// }




// /////////////////
// src/app/chats/_components/components/calls/CallModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { CallType, ActiveCall } from '../../types';

interface CallModalProps {
  isOpen: boolean;
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  freeMinutes: number;
  totalMinutes: number;
  isStarting: boolean;
  isGroupCall?: boolean;
  groupAvatars?: string[];
  groupCount?: number;
  onClose: () => void;
  onStart: (type: CallType) => void;
  activeCall?: ActiveCall | null;
  apiBase?: string;
  token?: string | null;
  userName?: string;
  onEndCall?: () => void;
}

export default function CallModal({
  isOpen,
  calleeName,
  calleeUsername = '@user',
  calleeAvatar = '/imgs/user.png',
  freeMinutes,
  totalMinutes,
  isStarting,
  isGroupCall = false,
  groupAvatars = ['/imgs/user.png', '/imgs/user.png', '/imgs/user.png', '/imgs/user.png'],
  groupCount = 4,
  onClose,
  onStart,
  activeCall = null,
  apiBase = '',
  token = null,
  userName = 'User',
  onEndCall,
}: CallModalProps) {
  const [showActiveCall, setShowActiveCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  const zpRef = useRef<any>(null);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);
  const zegoLoadedRef = useRef(false);

  // ✅ لما activeCall ييجي، نعرض شاشة المكالمة
  useEffect(() => {
    if (activeCall) {
      setShowActiveCall(true);
    }
  }, [activeCall]);

  // ✅ تهيئة ZEGOCLOUD في حاوية مخفية تماماً
  useEffect(() => {
    if (!showActiveCall || !activeCall) return;
    if (zegoLoadedRef.current) return;
    if (!hiddenContainerRef.current) return;

    let mounted = true;

    const initZego = async () => {
      try {
        console.log('🎥 Initializing ZEGOCLOUD...');
        const zegoModule = await import('@zegocloud/zego-uikit-prebuilt');
        const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt;

        const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || '0');
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || '';

        if (!appID || !serverSecret) {
          console.error('❌ AppID أو ServerSecret غير موجودين');
          return;
        }

        const roomID = activeCall.callId || 'test-room-123';
        const userID = token
          ? `user_${token.slice(-8)}`
          : `user_${Date.now()}`;

        console.log('🎥 Room ID:', roomID, 'User ID:', userID);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        await zp.joinRoom({
          container: hiddenContainerRef.current,
          scenario: {
            mode:
              activeCall.callType === 'video'
                ? ZegoUIKitPrebuilt.VideoConference
                : ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          turnOnCameraWhenJoining: false,
          turnOnMicrophoneWhenJoining: true,
          showMyCameraToggleButton: false,
          showMyMicrophoneToggleButton: false,
          showAudioVideoSettingsButton: false,
          showScreenSharingButton: false,
          showTextChat: false,
          showUserList: false,
          showLeavingView: false,
          layout: 'Auto',
          onLeaveRoom: () => {
            if (mounted) {
              setShowActiveCall(false);
              onClose();
            }
          },
        });

        zegoLoadedRef.current = true;
        console.log('✅ ZEGOCLOUD joined room');
      } catch (err: any) {
        console.error('❌ ZEGOCLOUD init error:', err);
      }
    };

    initZego();

    return () => {
      mounted = false;
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying Zego:', e);
        }
        zpRef.current = null;
        zegoLoadedRef.current = false;
      }
    };
  }, [showActiveCall, activeCall, token, userName, onClose]);

  // ✅ مؤقت مدة المكالمة
  useEffect(() => {
    if (!showActiveCall) return;

    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [showActiveCall]);

  if (!isOpen) return null;

  const disabled = freeMinutes <= 0 || isStarting;

  const handleStartCall = () => {
    onStart('audio');
    setShowActiveCall(true);
  };

  const handleEndCall = () => {
    if (zpRef.current) {
      try {
        zpRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying Zego:', e);
      }
      zpRef.current = null;
      zegoLoadedRef.current = false;
    }
    setShowActiveCall(false);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setCallDuration('00:00');
    if (onEndCall) onEndCall();
    onClose();
  };

  const handleToggleMute = () => {
    if (zpRef.current) {
      try {
        if (typeof zpRef.current.muteMicrophone === 'function') {
          zpRef.current.muteMicrophone(!isMuted);
        }
      } catch (e) {
        console.warn('Error toggling mute:', e);
      }
    }
    setIsMuted(!isMuted);
  };

  const handleToggleSpeaker = () => {
    if (zpRef.current) {
      try {
        if (typeof zpRef.current.setAudioRouteToSpeaker === 'function') {
          zpRef.current.setAudioRouteToSpeaker(!isSpeakerOn);
        }
      } catch (e) {
        console.warn('Error toggling speaker:', e);
      }
    }
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleAddPerson = () => {
    console.log('Add person clicked');
  };

  // ============================================
  // ===== شاشة المكالمة النشطة =====
  // ============================================
  if (showActiveCall && activeCall) {
    return (
      <>
        {/* ✅ حاوية ZEGOCLOUD المخفية (خارج الشاشة تماماً) */}
        <div
          ref={hiddenContainerRef}
          style={{
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: -9999,
          }}
        />

        {/* ✅ واجهة المكالمة */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0',
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
              marginRight: '20px',
              marginLeft: '10px',
            }}
          >
            <p
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: isGroupCall ? '15px' : '13px',
                textAlign: 'center',
                color: '#7C7D7E',
                marginBottom: isGroupCall ? '8px' : '30px',
                padding: '0 16px',
              }}
            >
              {isGroupCall ? 'مكالمة جماعية' : 'مكالمة صوتية'} • {callDuration}
            </p>

            {isGroupCall ? (
              <>
                <h3 style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '30px', textAlign: 'center', color: '#000', marginBottom: '10px', marginTop: '60px', padding: '0 16px' }}>
                  مكالمة جماعية
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', direction: 'ltr', marginBottom: '16px', padding: '0 16px' }}>
                  {groupAvatars.slice(0, 4).map((avatar, index) => (
                    <div key={index} style={{ position: 'relative', marginRight: index !== groupAvatars.slice(0, 4).length - 1 ? '-22px' : '0px', zIndex: index + 1 }}>
                      <div style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: 'block' }}>
                          <defs>
                            <clipPath id={`wavyActive-${index}`}>
                              <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} />
                            </clipPath>
                          </defs>
                          <image href={avatar} x="0" y="0" width="160" height="160" preserveAspectRatio="xMidYMid slice" clipPath={`url(#wavyActive-${index})`} style={{ filter: 'blur(5px)' }} />
                          <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} fill="none" stroke="transparent" strokeWidth="6" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '14px', textAlign: 'center', color: '#7C7D7E', marginBottom: '10px', marginTop: '15px' }}>
                  {groupCount} أشخاص في هذه المكالمة
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '20px', textAlign: 'center', color: '#000', marginBottom: '6px', padding: '0 16px' }}>
                  {calleeName}
                </h3>
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', textAlign: 'center', color: '#000', marginBottom: '12px', padding: '0 16px' }}>
                  {calleeUsername}
                </p>
                <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
                    <defs>
                      <clipPath id="wavyAvatarActive">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image href={calleeAvatar} x="0" y="0" width="160" height="160" preserveAspectRatio="xMidYMid slice" clipPath="url(#wavyAvatarActive)" />
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} fill="none" stroke="transparent" strokeWidth="1.5" />
                  </svg>
                </div>
              </>
            )}

            {/* أزرار المكالمة */}
            <div
              style={{
                width: '100%',
                borderBottomLeftRadius: '35px',
                borderBottomRightRadius: '35px',
                background: '#EAEDF6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                padding: '20px 16px',
              }}
            >
              <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {/* المايك */}
                <button
                  onClick={handleToggleMute}
                  style={{
                    width: '55px', height: '55px', borderRadius: '50%',
                    background: isMuted ? '#D72229' : '#FFFFFF',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {isMuted ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                    </svg>
                  )}
                </button>

                {/* مكبر الصوت */}
                <button
                  onClick={handleToggleSpeaker}
                  style={{
                    width: '55px', height: '55px', borderRadius: '50%',
                    background: isSpeakerOn ? '#4CAF50' : '#FFFFFF',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {isSpeakerOn ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>

                {/* إضافة شخص */}
                <button
                  onClick={handleAddPerson}
                  style={{
                    width: '55px', height: '55px', borderRadius: '50%',
                    background: '#FFFFFF',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </button>
              </div>

              {/* إنهاء */}
              <button
                onClick={handleEndCall}
                style={{
                  width: '150px', height: '50px', borderRadius: '38.5px',
                  background: '#D72229', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <img
                  src="/imgs/call.svg"
                  alt="إنهاء الاتصال"
                  style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)', transform: 'rotate(135deg)' }}
                />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // ===== المودال العادي =====
  // ============================================
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
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
          marginRight: '20px',
          marginLeft: '10px',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-700"
          style={{ zIndex: 10 }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: isGroupCall ? '15px' : '13px', textAlign: 'center', color: '#7C7D7E', marginBottom: isGroupCall ? '8px' : '30px', padding: '0 16px' }}>
          {isStarting ? 'جاري الاتصال...' : 'مكالمة صوتية'}
        </p>

        {isGroupCall ? (
          <>
            <h3 style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '30px', textAlign: 'center', color: '#000', marginBottom: '10px', marginTop: '60px', padding: '0 16px' }}>
              مكالمة جماعية
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', direction: 'ltr', marginBottom: '16px', padding: '0 16px' }}>
              {groupAvatars.slice(0, 4).map((avatar, index) => (
                <div key={index} style={{ position: 'relative', marginRight: index !== groupAvatars.slice(0, 4).length - 1 ? '-22px' : '0px', zIndex: index + 1 }}>
                  <div style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: 'block' }}>
                      <defs>
                        <clipPath id={`wavyGroupClip-${index}`}>
                          <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} />
                        </clipPath>
                      </defs>
                      <image href={avatar} x="0" y="0" width="160" height="160" preserveAspectRatio="xMidYMid slice" clipPath={`url(#wavyGroupClip-${index})`} style={{ filter: 'blur(5px)' }} />
                      <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} fill="none" stroke="transparent" strokeWidth="6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '14px', textAlign: 'center', color: '#7C7D7E', marginBottom: '10px', marginTop: '15px' }}>
              {groupCount} أشخاص في هذه المكالمة
            </p>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '20px', textAlign: 'center', color: '#000', marginBottom: '6px', padding: '0 16px' }}>
              {calleeName}
            </h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', textAlign: 'center', color: '#000', marginBottom: '12px', padding: '0 16px' }}>
              {calleeUsername}
            </p>
            <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
                <defs>
                  <clipPath id="wavyAvatarClip">
                    <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                  </clipPath>
                </defs>
                <image href={calleeAvatar} x="0" y="0" width="160" height="160" preserveAspectRatio="xMidYMid slice" clipPath="url(#wavyAvatarClip)" />
                <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} fill="none" stroke="transparent" strokeWidth="1.5" />
              </svg>
            </div>
          </>
        )}

        {freeMinutes <= 0 && (
          <p style={{ color: '#D72229', fontSize: '12px', fontFamily: 'Cairo', marginBottom: '12px', textAlign: 'center', padding: '0 16px' }}>
            رصيد الدقائق المجانية منتهي
          </p>
        )}

        <div
          style={{
            width: '100%',
            borderBottomLeftRadius: '35px',
            borderBottomRightRadius: '35px',
            background: '#EAEDF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px 10px',
          }}
        >
          {isStarting ? (
            <button disabled style={{ width: '150px', height: '50px', borderRadius: '38.5px', background: '#D72229', border: 'none', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/imgs/call.svg" alt="جاري الاتصال" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
            </button>
          ) : (
            <button
              onClick={handleStartCall}
              disabled={disabled}
              style={{
                width: '150px', height: '50px', borderRadius: '38.5px',
                background: !disabled ? '#D72229' : '#B4B4B9',
                border: 'none', cursor: !disabled ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: !disabled ? 1 : 0.5,
              }}
            >
              <img src="/imgs/call.svg" alt="اتصال" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function generateWavyCirclePath(cx: number, cy: number, radius: number, waveCount: number, amplitude: number): string {
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