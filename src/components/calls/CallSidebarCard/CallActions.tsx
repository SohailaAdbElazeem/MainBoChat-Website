// // // src/components/calls/CallSidebarCard/CallActions.tsx
// // 'use client';

// // import React from 'react';
// // import { COLORS } from '../constants';
// // import EndCallButton from '../_shared/EndCallButton';

// // interface Props {
// //   isCalling: boolean;
// //   isConnected: boolean;
// //   isMicMuted: boolean;
// //   isSpeakerOn: boolean;
// //   onEnd: () => void;
// //   onToggleMic: () => void;
// //   onToggleSpeaker: () => void;
// //   onAddPerson: () => void;
// // }

// // const circleBtn = (active: boolean, activeColor: string): React.CSSProperties => ({
// //   width: '42px', height: '42px', borderRadius: '50%',
// //   background: active ? activeColor : COLORS.white,
// //   border: 'none', cursor: 'pointer',
// //   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //   // boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
// // });

// // export default function CallActions({
// //   isCalling, isConnected, isMicMuted, isSpeakerOn,
// //   onEnd, onToggleMic, onToggleSpeaker, onAddPerson,
// // }: Props) {
// //   if (isCalling) {
// //     return <EndCallButton onClick={onEnd} />;
// //   }

// //   if (!isConnected) return null;

// //   return (
// //     <>
// //       <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
// //         {/* كتم المايك */}
// //         <button onClick={onToggleMic} style={circleBtn(isMicMuted, COLORS.danger)} aria-label="كتم الميكروفون">
// //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
// //             stroke={isMicMuted ? COLORS.white : COLORS.text} strokeWidth="2">
// //             <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //             <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //             {isMicMuted && <line x1="3" y1="3" x2="21" y2="21" />}
// //           </svg>
// //         </button>

// //         {/* مكبر الصوت */}
// //         <button onClick={onToggleSpeaker} style={circleBtn(isSpeakerOn, COLORS.success)} aria-label="مكبر الصوت">
// //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
// //             stroke={isSpeakerOn ? COLORS.white : COLORS.text} strokeWidth="2">
// //             <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //             {isSpeakerOn ? (
// //               <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //             ) : (
// //               <>
// //                 <line x1="23" y1="9" x2="17" y2="15" />
// //                 <line x1="17" y1="9" x2="23" y2="15" />
// //               </>
// //             )}
// //           </svg>
// //         </button>

// //         {/* إضافة أشخاص */}
// //         <button onClick={onAddPerson} style={circleBtn(false, COLORS.white)} aria-label="إضافة أشخاص">
// //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth="2">
// //             <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
// //             <circle cx="8.5" cy="7" r="4" />
// //             <line x1="20" y1="8" x2="20" y2="14" />
// //             <line x1="23" y1="11" x2="17" y2="11" />
// //           </svg>
// //         </button>
// //       </div>

// //       <EndCallButton onClick={onEnd} />
// //     </>
// //   );
// // }

// // src/components/calls/CallSidebarCard/CallActions.tsx
// 'use client';

// import React from 'react';
// import { COLORS } from '../constants';
// import EndCallButton from '../_shared/EndCallButton';

// interface Props {
//   isCalling: boolean;
//   isConnected: boolean;
//   isMicMuted: boolean;
//   isSpeakerOn: boolean;
//   onEnd: () => void;
//   onToggleMic: () => void;
//   onToggleSpeaker: () => void;
//   onAddPerson: () => void;
// }

// // الأزرار الصغيرة (speaker + add) — زي ما هي
// const circleBtn = (active: boolean, activeColor: string): React.CSSProperties => ({
//   width: '42px', height: '42px', borderRadius: '50%',
//   background: active ? activeColor : COLORS.white,
//   border: 'none', cursor: 'pointer',
//   display: 'flex', alignItems: 'center', justifyContent: 'center',
// });

// // ✅ زر المايك — التصميم الجديد (73 × 58 / radius 33)
// const micBtn = (isMuted: boolean): React.CSSProperties => ({
//   width: 73,
//   height: 58,
//   borderRadius: 33,
//   background: isMuted ? '#7C7D7E' : COLORS.white,   // ← رمادي عند الكتم
//   border: 'none',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   transition: 'background 0.2s ease',
// });

// export default function CallActions({
//   isCalling, isConnected, isMicMuted, isSpeakerOn,
//   onEnd, onToggleMic, onToggleSpeaker, onAddPerson,
// }: Props) {
//   if (isCalling) {
//     return <EndCallButton onClick={onEnd} />;
//   }

//   if (!isConnected) return null;

//   return (
//     <>
//       <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
//         {/* ✅ كتم المايك — الزر الجديد */}
        
//       <button onClick={onToggleMic} style={micBtn(isMicMuted)} aria-label="كتم الميكروفون">
//         <img
//           src="/imgs/Mic.svg"
//           alt="ميكروفون"
//           style={{
//             width: '22.93px',
//             height: '21.89px',
//             objectFit: 'contain',
//             // ✅ لو الزر مكتوم (خلفية حمرا) → نخلي الأيقونة بيضا
//             filter: isMicMuted ? 'brightness(0) invert(1)' : 'none',
//             transition: 'filter 0.2s ease',
//             pointerEvents: 'none',
//           }}
//         />
//       </button>

//         {/* مكبر الصوت */}
//         {/* <button onClick={onToggleSpeaker} style={circleBtn(isSpeakerOn, COLORS.success)} aria-label="مكبر الصوت">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
//             stroke={isSpeakerOn ? COLORS.white : COLORS.text} strokeWidth="2">
//             <path d="M11 5L6 9H2v6h4l5 4V5z" />
//             {isSpeakerOn ? (
//               <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
//             ) : (
//               <>
//                 <line x1="23" y1="9" x2="17" y2="15" />
//                 <line x1="17" y1="9" x2="23" y2="15" />
//               </>
//             )}
//           </svg>
//         </button> */}
// {/* مكبر الصوت — صورة Speaker.svg */}
// <button onClick={onToggleSpeaker} style={circleBtn(isSpeakerOn, COLORS.success)} aria-label="مكبر الصوت">
//   <img
//     src="/imgs/Speaker (2).svg"
//     alt="مكبر الصوت"
//     style={{
//       width: '20px',
//       height: '20px',
//       objectFit: 'contain',
//        filter: isSpeakerOn ? 'brightness(0) invert(1)' : 'none',
//       transition: 'filter 0.2s ease',
//       pointerEvents: 'none',
//     }}
//   />
// </button>
//         {/* إضافة أشخاص */}
//        <button onClick={onAddPerson} style={circleBtn(false, COLORS.white)} aria-label="إضافة أشخاص">
//         <img
//           src="/imgs/AddPerson.svg"
//           alt="إضافة أشخاص"
//           style={{
//             width: '20px',
//             height: '20px',
//             objectFit: 'contain',
//             pointerEvents: 'none',
//           }}
//         />
//       </button>
//       </div>

//       <EndCallButton onClick={onEnd} />
//     </>
//   );
// }
 


// src/components/calls/CallSidebarCard/CallActions.tsx
'use client';

import React from 'react';
import { COLORS } from '../constants';
import EndCallButton from '../_shared/EndCallButton';

interface Props {
  isCalling: boolean;
  isConnected: boolean;
  isMicMuted: boolean;
  isSpeakerOn: boolean;
  onEnd: () => void;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onAddPerson: () => void;
}

// ✅ نمط موحّد لكل الأزرار (73 × 58 / radius 33)
const actionBtn = (active: boolean, activeColor: string): React.CSSProperties => ({
width: 60,
  height: 48,
  borderRadius: 24,
  background: active ? activeColor : COLORS.white,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease',
});

export default function CallActions({
  isCalling, isConnected, isMicMuted, isSpeakerOn,
  onEnd, onToggleMic, onToggleSpeaker, onAddPerson,
}: Props) {
  if (isCalling) {
    return <EndCallButton onClick={onEnd} />;
  }

  if (!isConnected) return null;

  return (
    <>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
        {/* ✅ كتم المايك */}
        <button
          onClick={onToggleMic}
          style={actionBtn(isMicMuted, '#7C7D7E')}
          aria-label="كتم الميكروفون"
        >
          <img
            src="/imgs/Mic.svg"
            alt="ميكروفون"
            style={{
              width: '22.93px',
              height: '21.89px',
              objectFit: 'contain',
              filter: isMicMuted ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        </button>

        {/* ✅ مكبر الصوت */}
        <button
          onClick={onToggleSpeaker}
          style={actionBtn(isSpeakerOn, COLORS.success)}
          aria-label="مكبر الصوت"
        >
          <img
            src="/imgs/Speaker (2).svg"
            alt="مكبر الصوت"
            style={{
              width: '20px',
              height: '20px',
              objectFit: 'contain',
              filter: isSpeakerOn ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        </button>

        {/* ✅ إضافة أشخاص */}
        <button
          onClick={onAddPerson}
          style={actionBtn(false, COLORS.white)}
          aria-label="إضافة أشخاص"
        >
          <img
            src="/imgs/AddPerson.svg"
            alt="إضافة أشخاص"
            style={{
              width: '20px',
              height: '20px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </button>
      </div>

      <EndCallButton onClick={onEnd} />
    </>
  );
}