// // // src/components/calls/CallSidebarCard/index.tsx
// // 'use client';

// // import React, { useEffect, useState, useMemo } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { useZegoCall } from '@/components/ZegoCallProvider';

// // import { COLORS, IMAGES, RADIUS, CALL_STATUS_LABEL } from '../constants';
// // import WavyAvatar from '../_shared/WavyAvatar';
// // import RingingActions from './RingingActions';
// // import CallActions from './CallActions';
// // import AddPersonView from './AddPersonView';
// // import RejectedView from './RejectedView';

// // export default function CallSidebarCard() {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isSpeakerOn,
// //     endCall,
// //     toggleMic,
// //     toggleSpeaker,
// //     acceptCall,
// //     rejectCall,
// //     startCall,
// //   } = useZegoCall();

// //   const router = useRouter();

// //   const [callDuration, setCallDuration] = useState('00:00');
// //   const [countdown, setCountdown] = useState(60);
// //   const [showAddPerson, setShowAddPerson] = useState(false);

// //   const isRinging = callState?.status === 'ringing';
// //   const isCalling = callState?.status === 'calling';
// //   const isConnected = callState?.status === 'connected';
// //   const isRejected = callState?.status === 'rejected'; // Callee (اللي رفض)
// //   const isMissed = callState?.status === 'missed';     // Caller (اللي اترفض)
// //   const isEnded = callState?.status === 'ended';       // ✅ Caller (انتهاء الاتصال)

// //   // ✅ كل الحالات اللي بتعرض شاشة النهاية
// //   const showEndedView = isRejected || isMissed || isEnded;

// //   // ✅ تحديد النص المناسب حسب الحالة
// //   const getEndedStatusText = () => {
// //     if (isEnded) return 'تم انتهاء الاتصال';
// //     if (isCalleeText()) return 'تم رفض المكالمة';
// //     return 'لم يتم الرد';
// //   };

// //   // ✅ Callee = اللي رفض
// //   const isCalleeText = () => isRejected;

// //   // ============ المؤقت ============
// //   useEffect(() => {
// //     if (!isConnected) {
// //       setCallDuration('00:00');
// //       return;
// //     }
// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
// //       const secs = (seconds % 60).toString().padStart(2, '0');
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);
// //     return () => clearInterval(interval);
// //   }, [isConnected]);

// //   // ============ العد التنازلي ============
// //   useEffect(() => {
// //     if (!isRinging) {
// //       setCountdown(60);
// //       return;
// //     }
// //     setCountdown(60);
// //     const interval = setInterval(() => {
// //       setCountdown((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(interval);
// //           rejectCall?.();
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);
// //     return () => clearInterval(interval);
// //   }, [isRinging, rejectCall]);

// //   // ============ الـ username ============
// //   const displayUsername = useMemo(() => {
// //     const cs = callState;
// //     if (!cs) return 'user';
// //     return (
// //       cs.peerUsername ||
// //       (cs.peerName ? cs.peerName.toLowerCase().replace(/\s+/g, '_') : null) ||
// //       cs.peerUserId?.slice(-8) ||
// //       'user'
// //     );
// //   }, [callState]);

// //   const handleAddToCall = (ids: string[]) => {
// //     console.log('➕ Adding:', ids);
// //     setShowAddPerson(false);
// //   };

// //   // ============ شاشة إضافة أشخاص ============
// //   if (showAddPerson) {
// //     return (
// //       <div
// //         dir="rtl"
// //         style={{
// //           width: '100%',
// //           borderRadius: RADIUS.card,
// //           background: COLORS.bg,
// //           overflow: 'hidden',
// //         }}
// //       >
// //         <AddPersonView
// //           callDuration={callDuration}
// //           peerName={callState?.peerName || 'مستخدم'}
// //           peerAvatar={IMAGES.defaultAvatar}
// //           onClose={() => setShowAddPerson(false)}
// //           onAddToCall={handleAddToCall}
// //         />
// //       </div>
// //     );
// //   }

// //   // ============ ✅ شاشة النهاية (رفض / لم يتم الرد / انتهاء الاتصال) ============
// //   if (showEndedView) {
// //     return (
// //       <div
// //         dir="rtl"
// //         style={{
// //           width: '100%',
// //           borderRadius: RADIUS.card,
// //           background: COLORS.bg,
// //           overflow: 'hidden',
// //         }}
// //       >
// //         <RejectedView
// //           peerName={callState?.peerName || 'مستخدم'}
// //           peerUsername={displayUsername}
// //           peerAvatar={callState?.peerAvatar || IMAGES.defaultAvatar}
// //           isCallee={isRejected}
// //           statusText={getEndedStatusText()}
// //           onCallBack={() => {
// //             console.log('🔁 Redial to', callState?.peerUserId);
// //             if (startCall && callState?.peerUserId) {
// //               startCall(
// //                 callState.peerUserId,
// //                 callState?.peerName || 'مستخدم',
// //                 !!callState?.isVideo,
// //                 callState?.peerAvatar,
// //                 undefined,
// //                 callState?.peerUsername
// //               );
// //             }
// //           }}
// //           onMessage={() => {
// //             console.log('💬 Open chat with', callState?.peerUserId);
// //             if (callState?.peerUserId) {
// //               router.push(`/chats/${callState.peerUserId}`);
// //             }
// //           }}
// //           onClose={() => {
// //             console.log('❌ Ended view closed by outside click');
// //             endCall();
// //           }}
// //         />
// //       </div>
// //     );
// //   }

// //   // ============ أنماط منطقة الأزرار ============
// //   const buttonsAreaStyle: React.CSSProperties = isConnected
// //     ? {
// //         width: '357px',
// //         maxWidth: '100%',
// //         height: 150,
// //         borderRadius: '35px 35px 0 0',
// //         background: '#EAEDF6',
// //         border: 'none',
// //         boxShadow: 'none',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: '12px',
// //         padding: '16px 12px',
// //         boxSizing: 'border-box',
// //         overflow: 'hidden',
// //       }
// //     : isRinging
// //     ? {
// //         width: '357px',
// //         maxWidth: '100%',
// //         minHeight: 80,
// //         borderRadius: 0,
// //         background: '#F1F4F9',
// //         border: 'none',
// //         boxShadow: 'none',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: '12px',
// //         padding: '16px 12px',
// //         boxSizing: 'border-box',
// //         overflow: 'hidden',
// //       }
// //     : {
// //         width: '357px',
// //         maxWidth: '100%',
// //         minHeight: 80,
// //         borderRadius: '35px 35px 0 0',
// //         background: '#EAEDF6',
// //         border: 'none',
// //         boxShadow: 'none',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: '12px',
// //         padding: '16px 12px',
// //         boxSizing: 'border-box',
// //         overflow: 'hidden',
// //       };

// //   return (
// //     <div
// //       dir="rtl"
// //       style={{
// //         width: '100%',
// //         borderRadius: RADIUS.card,
// //         background: COLORS.bg,
// //         paddingTop: '16px',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         position: 'relative',
// //         overflow: 'hidden',
// //       }}
// //     >
// //       {/* نص الحالة */}
// //       <p
// //         style={{
// //           fontFamily: 'Cairo, sans-serif',
// //           fontWeight: 600,
// //           fontSize: '13px',
// //           textAlign: 'center',
// //           color: isRinging ? COLORS.danger : COLORS.textMuted,
// //           margin: '0 0 8px 0',
// //           padding: '0 12px',
// //         }}
// //       >
// //         {CALL_STATUS_LABEL[callState?.status || 'idle'] ?? CALL_STATUS_LABEL.idle}
// //       </p>

// //       {/* المؤقت / العد التنازلي */}
// //       {isConnected && (
// //         <p
// //           style={{
// //             fontFamily: 'Cairo, sans-serif',
// //             fontWeight: 400,
// //             fontSize: '11px',
// //             textAlign: 'center',
// //             color: COLORS.textMuted,
// //             margin: '0 0 8px 0',
// //           }}
// //         >
// //           {callDuration}
// //         </p>
// //       )}
// //       {isRinging && (
// //         <p
// //           style={{
// //             fontFamily: 'Cairo, sans-serif',
// //             fontWeight: 400,
// //             fontSize: '11px',
// //             textAlign: 'center',
// //             color: COLORS.textMuted,
// //             margin: '0 0 8px 0',
// //           }}
// //         >
// //           {countdown} ثانية
// //         </p>
// //       )}

// //       {/* الاسم */}
// //       <h3
// //         style={{
// //           fontFamily: 'Cairo, sans-serif',
// //           fontWeight: 600,
// //           fontSize: '18px',
// //           textAlign: 'center',
// //           color: COLORS.text,
// //           margin: '0 0 4px 0',
// //           padding: '0 12px',
// //         }}
// //       >
// //         {callState?.peerName || 'مستخدم'}
// //       </h3>

// //       {/* اليوزرنيم */}
// //       <p
// //         style={{
// //           fontFamily: 'Inter, sans-serif',
// //           fontWeight: 400,
// //           fontSize: '11px',
// //           textAlign: 'center',
// //           color: COLORS.text,
// //           margin: '0 0 12px 0',
// //           padding: '0 12px',
// //         }}
// //       >
// //         @{displayUsername}
// //       </p>

// //       {/* الصورة الموجية */}
// //       <div
// //         style={{
// //           position: 'relative',
// //           width: '120px',
// //           height: '120px',
// //           marginBottom: '16px',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //         }}
// //       >
// //         <WavyAvatar
// //           clipId="sidebarCallWavyClip"
// //           size={120}
// //           src={callState?.peerAvatar || IMAGES.defaultAvatar}
// //         />
// //       </div>

// //       {/* الأزرار */}
// //       <div style={buttonsAreaStyle}>
// //         {isRinging && (
// //           <RingingActions
// //             onAccept={() => acceptCall?.()}
// //             onReject={() => (rejectCall ? rejectCall() : endCall())}
// //           />
// //         )}

// //         <CallActions
// //           isCalling={isCalling}
// //           isConnected={isConnected}
// //           isMicMuted={isMicMuted}
// //           isSpeakerOn={isSpeakerOn}
// //           onEnd={endCall}
// //           onToggleMic={toggleMic}
// //           onToggleSpeaker={toggleSpeaker}
// //           onAddPerson={() => setShowAddPerson(true)}
// //         />
// //       </div>
// //     </div>
// //   );
// // }



// // src/components/calls/CallSidebarCard/index.tsx
// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { useZegoCall } from '@/components/ZegoCallProvider';

// import { COLORS, IMAGES, RADIUS, CALL_STATUS_LABEL } from '../constants';
// import WavyAvatar from '../_shared/WavyAvatar';
// import RingingActions from './RingingActions';
// import CallActions from './CallActions';
// import AddPersonView from './AddPersonView';
// import RejectedView from './RejectedView';

// // ✅ الحد الأقصى للمكالمة (30 دقيقة)
// const MAX_CALL_SECONDS = 30 * 60; // 1800 ثانية

// export default function CallSidebarCard() {
//   const {
//     callState,
//     isMicMuted,
//     isSpeakerOn,
//     endCall,
//     toggleMic,
//     toggleSpeaker,
//     acceptCall,
//     rejectCall,
//     startCall,
//   } = useZegoCall();

//   const router = useRouter();

//   const [callDuration, setCallDuration] = useState('00:00');
//   const [remaining, setRemaining] = useState(MAX_CALL_SECONDS);
//   const [countdown, setCountdown] = useState(60);
//   const [showAddPerson, setShowAddPerson] = useState(false);

//   const isRinging = callState?.status === 'ringing';
//   const isCalling = callState?.status === 'calling';
//   const isConnected = callState?.status === 'connected';
//   const isRejected = callState?.status === 'rejected'; // Callee (اللي رفض)
//   const isMissed = callState?.status === 'missed';     // Caller (اللي اترفض)
//   const isEnded = callState?.status === 'ended';       // ✅ Caller (انتهاء الاتصال)

//   // ✅ كل الحالات اللي بتعرض شاشة النهاية
//   const showEndedView = isRejected || isMissed || isEnded;

//   // ✅ تحديد النص المناسب حسب الحالة
//   const getEndedStatusText = () => {
//     if (isEnded) return 'تم انتهاء الاتصال';
//     if (isCalleeText()) return 'تم رفض المكالمة';
//     return 'لم يتم الرد';
//   };

//   // ✅ Callee = اللي رفض
//   const isCalleeText = () => isRejected;

//   // ============ المؤقت + الحد الأقصى (30 دقيقة) ============
//   useEffect(() => {
//     if (!isConnected) {
//       setCallDuration('00:00');
//       setRemaining(MAX_CALL_SECONDS);
//       return;
//     }

//     let seconds = 0;
//     let remainingSecs = MAX_CALL_SECONDS;

//     const interval = setInterval(() => {
//       seconds++;
//       remainingSecs--;

//       // مدة المكالمة (الوقت اللي عدّى)
//       const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//       const secs = (seconds % 60).toString().padStart(2, '0');
//       setCallDuration(`${mins}:${secs}`);

//       // الوقت المتبقي
//       setRemaining(remainingSecs);

//       // ✅ لما الـ 30 دقيقة تخلص → إنهاء المكالمة
//       if (remainingSecs <= 0) {
//         clearInterval(interval);
//         console.log('⏰ Call limit reached (30:00) → ending call');
//         endCall();
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isConnected, endCall]);

//   // ============ العد التنازلي (للرد) ============
//   useEffect(() => {
//     if (!isRinging) {
//       setCountdown(60);
//       return;
//     }
//     setCountdown(60);
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           rejectCall?.();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isRinging, rejectCall]);

//   // ============ الـ username ============
//   const displayUsername = useMemo(() => {
//     const cs = callState;
//     if (!cs) return 'user';
//     return (
//       cs.peerUsername ||
//       (cs.peerName ? cs.peerName.toLowerCase().replace(/\s+/g, '_') : null) ||
//       cs.peerUserId?.slice(-8) ||
//       'user'
//     );
//   }, [callState]);

//   const handleAddToCall = (ids: string[]) => {
//     console.log('➕ Adding:', ids);
//     setShowAddPerson(false);
//   };

//   // ============ شاشة إضافة أشخاص ============
//   if (showAddPerson) {
//     return (
//       <div
//         dir="rtl"
//         style={{
//           width: '100%',
//           borderRadius: RADIUS.card,
//           background: COLORS.bg,
//           overflow: 'hidden',
//         }}
//       >
//         <AddPersonView
//           callDuration={callDuration}
//           peerName={callState?.peerName || 'مستخدم'}
//           peerAvatar={IMAGES.defaultAvatar}
//           onClose={() => setShowAddPerson(false)}
//           onAddToCall={handleAddToCall}
//         />
//       </div>
//     );
//   }

//   // ============ ✅ شاشة النهاية (رفض / لم يتم الرد / انتهاء الاتصال) ============
//   if (showEndedView) {
//     return (
//       <div
//         dir="rtl"
//         style={{
//           width: '100%',
//           borderRadius: RADIUS.card,
//           background: COLORS.bg,
//           overflow: 'hidden',
//         }}
//       >
//         <RejectedView
//           peerName={callState?.peerName || 'مستخدم'}
//           peerUsername={displayUsername}
//           peerAvatar={callState?.peerAvatar || IMAGES.defaultAvatar}
//           isCallee={isRejected}
//           statusText={getEndedStatusText()}
//           onCallBack={() => {
//             console.log('🔁 Redial to', callState?.peerUserId);
//             if (startCall && callState?.peerUserId) {
//               startCall(
//                 callState.peerUserId,
//                 callState?.peerName || 'مستخدم',
//                 !!callState?.isVideo,
//                 callState?.peerAvatar,
//                 undefined,
//                 callState?.peerUsername
//               );
//             }
//           }}
//           onMessage={() => {
//             console.log('💬 Open chat with', callState?.peerUserId);
//             if (callState?.peerUserId) {
//               router.push(`/chats/${callState.peerUserId}`);
//             }
//           }}
//           onClose={() => {
//             console.log('❌ Ended view closed by outside click');
//             endCall();
//           }}
//         />
//       </div>
//     );
//   }

//   // ============ أنماط منطقة الأزرار ============
//   const buttonsAreaStyle: React.CSSProperties = isConnected
//     ? {
//         width: '357px',
//         maxWidth: '100%',
//         height: 150,
//         borderRadius: '35px 35px 0 0',
//         background: '#EAEDF6',
//         border: 'none',
//         boxShadow: 'none',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '12px',
//         padding: '16px 12px',
//         boxSizing: 'border-box',
//         overflow: 'hidden',
//       }
//     : isRinging
//     ? {
//         width: '357px',
//         maxWidth: '100%',
//         minHeight: 80,
//         borderRadius: 0,
//         background: '#F1F4F9',
//         border: 'none',
//         boxShadow: 'none',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '12px',
//         padding: '16px 12px',
//         boxSizing: 'border-box',
//         overflow: 'hidden',
//       }
//     : {
//         width: '357px',
//         maxWidth: '100%',
//         minHeight: 80,
//         borderRadius: '35px 35px 0 0',
//         background: '#EAEDF6',
//         border: 'none',
//         boxShadow: 'none',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '12px',
//         padding: '16px 12px',
//         boxSizing: 'border-box',
//         overflow: 'hidden',
//       };

//   return (
//     <div
//       dir="rtl"
//       style={{
//         width: '100%',
//         borderRadius: RADIUS.card,
//         background: COLORS.bg,
//         paddingTop: '16px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >
//       {/* نص الحالة */}
//       <p
//         style={{
//           fontFamily: 'Cairo, sans-serif',
//           fontWeight: 600,
//           fontSize: '15px',
//           textAlign: 'center',
//           color: isRinging ? COLORS.danger : COLORS.textMuted,
//           margin: '10px 0 30px 0',
//           padding: '0 12px',
//         }}
//       >
//         {CALL_STATUS_LABEL[callState?.status || 'idle'] ?? CALL_STATUS_LABEL.idle}
//       </p>

//       {/* ✅ مدة المكالمة + الوقت المتبقي */}
//       {isConnected && (
//         <>
//           <p
//             style={{
//               fontFamily: 'Cairo, sans-serif',
//               fontWeight: 400,
//               fontSize: '11px',
//               textAlign: 'center',
//               color: COLORS.textMuted,
//               margin: '0 0 4px 0',
//             }}
//           >
//             {callDuration} 
//           </p>

//           <p
//             style={{
//               fontFamily: 'Cairo, sans-serif',
//               fontWeight: 400,
//               fontSize: '11px',
//               textAlign: 'center',
//               color: remaining <= 60 ? COLORS.danger : COLORS.textMuted,
//               margin: '0 0 8px 0',
//             }}
//           >
//             ينتهي الاتصال خلال{' '}
//             {Math.floor(remaining / 60).toString().padStart(2, '0')}:
//             {(remaining % 60).toString().padStart(2, '0')}
//           </p>
//         </>
//       )}

//       {/* العد التنازلي (للرد) */}
//       {/* {isRinging && (
//         <p
//           style={{
//             fontFamily: 'Cairo, sans-serif',
//             fontWeight: 400,
//             fontSize: '11px',
//             textAlign: 'center',
//             color: COLORS.textMuted,
//             margin: '0 0 8px 0',
//           }}
//         >
//           {countdown} ثانية
//         </p>
//       )} */}

//       {/* الاسم */}
//       <h3
//         style={{
//           fontFamily: 'Cairo, sans-serif',
//           fontWeight: 600,
//           fontSize: '24px',
//           textAlign: 'center',
//           color: COLORS.text,
//           margin: '0 0 0 0',
//           padding: '0 12px',
//         }}
//       >
//         {callState?.peerName || 'مستخدم'}
//       </h3>

//       {/* اليوزرنيم */}
//       <p
//         style={{
//           fontFamily: 'Inter, sans-serif',
//           fontWeight: 400,
//           fontSize: '14px',
//           textAlign: 'center',
//           color: COLORS.text,
//           margin: '0 0 0 0',
//           padding: '0 12px',
//         }}
//       >
//         @{displayUsername}
//       </p>

//       {/* الصورة الموجية */}
//       <div
//         style={{
//           position: 'relative',
//           width: '140px',
//           height: '140px',
//           marginBottom: '40px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <WavyAvatar
//           clipId="sidebarCallWavyClip"
//           size={140}
//           src={callState?.peerAvatar || IMAGES.defaultAvatar}
//         />
//       </div>

//       {/* الأزرار */}
//       <div style={buttonsAreaStyle}>
//         {isRinging && (
//           <RingingActions
//             onAccept={() => acceptCall?.()}
//             onReject={() => (rejectCall ? rejectCall() : endCall())}
//           />
//         )}

//         <CallActions
//           isCalling={isCalling}
//           isConnected={isConnected}
//           isMicMuted={isMicMuted}
//           isSpeakerOn={isSpeakerOn}
//           onEnd={endCall}
//           onToggleMic={toggleMic}
//           onToggleSpeaker={toggleSpeaker}
//           onAddPerson={() => setShowAddPerson(true)}
//         />
//       </div>
//     </div>
//   );
// }




// src/components/calls/CallSidebarCard/index.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useZegoCall } from '@/components/ZegoCallProvider';

import { COLORS, IMAGES, RADIUS, CALL_STATUS_LABEL } from '../constants';
import WavyAvatar from '../_shared/WavyAvatar';
import RingingActions from './RingingActions';
import CallActions from './CallActions';
import AddPersonView from './AddPersonView';
import RejectedView from './RejectedView';

// ✅ الحد الأقصى للمكالمة (30 دقيقة)
const MAX_CALL_SECONDS = 30 * 60; // 1800 ثانية

export default function CallSidebarCard() {
  const {
    callState,
    isMicMuted,
    isSpeakerOn,
    endCall,
    toggleMic,
    toggleSpeaker,
    acceptCall,
    rejectCall,
    startCall,
  } = useZegoCall();

  const router = useRouter();

  const [callDuration, setCallDuration] = useState('00:00');
  const [remaining, setRemaining] = useState(MAX_CALL_SECONDS);
  const [countdown, setCountdown] = useState(60);
  const [showAddPerson, setShowAddPerson] = useState(false);

  const isRinging = callState?.status === 'ringing';
  const isCalling = callState?.status === 'calling';
  const isConnected = callState?.status === 'connected';
  const isRejected = callState?.status === 'rejected'; // Callee (اللي رفض)
  const isMissed = callState?.status === 'missed';     // Caller (اللي اترفض)
  const isEnded = callState?.status === 'ended';       // ✅ Caller (انتهاء الاتصال)

  // ✅ كل الحالات اللي بتعرض شاشة النهاية
  const showEndedView = isRejected || isMissed || isEnded;

  // ✅ تحديد النص المناسب حسب الحالة
  const getEndedStatusText = () => {
    if (isEnded) return 'تم انتهاء الاتصال';
    if (isCalleeText()) return 'تم رفض المكالمة';
    return 'لم يتم الرد';
  };

  // ✅ Callee = اللي رفض
  const isCalleeText = () => isRejected;

  // ============ المؤقت + الحد الأقصى (30 دقيقة) ============
  useEffect(() => {
    if (!isConnected) {
      setCallDuration('00:00');
      setRemaining(MAX_CALL_SECONDS);
      return;
    }

    let seconds = 0;
    let remainingSecs = MAX_CALL_SECONDS;

    const interval = setInterval(() => {
      seconds++;
      remainingSecs--;

      // مدة المكالمة (الوقت اللي عدّى)
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);

      // الوقت المتبقي
      setRemaining(remainingSecs);

      // ✅ لما الـ 30 دقيقة تخلص → إنهاء المكالمة
      if (remainingSecs <= 0) {
        clearInterval(interval);
        console.log('⏰ Call limit reached (30:00) → ending call');
        endCall();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, endCall]);

  // ============ العد التنازلي (للرد) ============
  useEffect(() => {
    if (!isRinging) {
      setCountdown(60);
      return;
    }
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          rejectCall?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRinging, rejectCall]);

  // ============ الـ username ============
  const displayUsername = useMemo(() => {
    const cs = callState;
    if (!cs) return 'user';
    return (
      cs.peerUsername ||
      (cs.peerName ? cs.peerName.toLowerCase().replace(/\s+/g, '_') : null) ||
      cs.peerUserId?.slice(-8) ||
      'user'
    );
  }, [callState]);

  const handleAddToCall = (ids: string[]) => {
    console.log('➕ Adding:', ids);
    setShowAddPerson(false);
  };

  // ============ شاشة إضافة أشخاص ============
  if (showAddPerson) {
    return (
      <div
        dir="rtl"
        style={{
          width: '100%',
          borderRadius: RADIUS.card,
          background: COLORS.bg,
          overflow: 'hidden',
        }}
      >
        <AddPersonView
          callDuration={callDuration}
          peerName={callState?.peerName || 'مستخدم'}
          peerAvatar={IMAGES.defaultAvatar}
          onClose={() => setShowAddPerson(false)}
          onAddToCall={handleAddToCall}
        />
      </div>
    );
  }

  // ============ ✅ شاشة النهاية (رفض / لم يتم الرد / انتهاء الاتصال) ============
  if (showEndedView) {
    return (
      <div
        dir="rtl"
        style={{
          width: '100%',
          borderRadius: RADIUS.card,
          background: COLORS.bg,
          overflow: 'hidden',
        }}
      >
        <RejectedView
          peerName={callState?.peerName || 'مستخدم'}
          peerUsername={displayUsername}
          peerAvatar={callState?.peerAvatar || IMAGES.defaultAvatar}
          isCallee={isRejected}
          statusText={getEndedStatusText()}
          onCallBack={() => {
            console.log('🔁 Redial to', callState?.peerUserId);
            if (startCall && callState?.peerUserId) {
              startCall(
                callState.peerUserId,
                callState?.peerName || 'مستخدم',
                !!callState?.isVideo,
                callState?.peerAvatar,
                undefined,
                callState?.peerUsername
              );
            }
          }}
          onMessage={() => {
            console.log('💬 Open chat with', callState?.peerUserId);
            if (callState?.peerUserId) {
              router.push(`/chats/${callState.peerUserId}`);
            }
          }}
          onClose={() => {
            console.log('❌ Ended view closed by outside click');
            endCall();
          }}
        />
      </div>
    );
  }

  // ============ أنماط منطقة الأزرار ============
  const buttonsAreaStyle: React.CSSProperties = isConnected
    ? {
        width: '357px',
        maxWidth: '100%',
        height: 150,
        borderRadius: '35px 35px 0 0',
        background: '#EAEDF6',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }
    : isRinging
    ? {
        width: '357px',
        maxWidth: '100%',
        minHeight: 80,
        borderRadius: 0,
        background: '#F1F4F9',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }
    : {
        width: '357px',
        maxWidth: '100%',
        minHeight: 80,
        borderRadius: '35px 35px 0 0',
        background: '#EAEDF6',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      };

  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        borderRadius: RADIUS.card,
        background: COLORS.bg,
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* نص الحالة / مدة المكالمة */}
      <p
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          textAlign: 'center',
          color: isRinging ? COLORS.danger : COLORS.textMuted,
          margin: '10px 0 30px 0',
          padding: '0 12px',
        }}
      >
        {isConnected
          ? `${callDuration}`
          : (CALL_STATUS_LABEL[callState?.status || 'idle'] ?? CALL_STATUS_LABEL.idle)}
      </p>

      {/* ✅ الوقت المتبقي — يظهر بس لما فاضل أقل من 5 دقائق */}
      {isConnected && remaining <= 300 && (
        <p
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            textAlign: 'center',
            color: remaining <= 60 ? COLORS.danger : COLORS.textMuted,
            margin: '0 0 8px 0',
          }}
        >
          ينتهي الاتصال خلال{' '}
          {Math.floor(remaining / 60).toString().padStart(2, '0')}:
          {(remaining % 60).toString().padStart(2, '0')}
        </p>
      )}

      {/* العد التنازلي (للرد) */}
      {/* {isRinging && (
        <p
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            textAlign: 'center',
            color: COLORS.textMuted,
            margin: '0 0 8px 0',
          }}
        >
          {countdown} ثانية
        </p>
      )} */}

      {/* الاسم */}
      <h3
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '24px',
          textAlign: 'center',
          color: COLORS.text,
          margin: '0 0 0 0',
          padding: '0 12px',
        }}
      >
        {callState?.peerName || 'مستخدم'}
      </h3>

      {/* اليوزرنيم */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          textAlign: 'center',
          color: COLORS.text,
          margin: '0 0 0 0',
          padding: '0 12px',
        }}
      >
        @{displayUsername}
      </p>

      {/* الصورة الموجية */}
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WavyAvatar
          clipId="sidebarCallWavyClip"
          size={140}
          src={callState?.peerAvatar || IMAGES.defaultAvatar}
        />
      </div>

      {/* الأزرار */}
      <div style={buttonsAreaStyle}>
        {isRinging && (
          <RingingActions
            onAccept={() => acceptCall?.()}
            onReject={() => (rejectCall ? rejectCall() : endCall())}
          />
        )}

        <CallActions
          isCalling={isCalling}
          isConnected={isConnected}
          isMicMuted={isMicMuted}
          isSpeakerOn={isSpeakerOn}
          onEnd={endCall}
          onToggleMic={toggleMic}
          onToggleSpeaker={toggleSpeaker}
          onAddPerson={() => setShowAddPerson(true)}
        />
      </div>
    </div>
  );
}