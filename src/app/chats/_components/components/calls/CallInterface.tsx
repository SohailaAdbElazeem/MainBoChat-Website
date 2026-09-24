// // // // src/app/chats/_components/components/calls/CallInterface.tsx
// // // 'use client';

// // // import { useEffect, useRef, useState } from 'react';
// // // import { ActiveCall } from '../../types';

// // // interface CallInterfaceProps {
// // //   activeCall: ActiveCall;
// // //   apiBase: string;
// // //   token: string | null;
// // //   userName: string;
// // //   onClose: () => void;
// // // }

// // // declare global {
// // //   interface Window {
// // //     MediaSFU?: any;
// // //   }
// // // }

// // // const CDN_URL = 'https://cdn.mediasfu.com/v4/mediasfu.js';

// // // export default function CallInterface({
// // //   activeCall,
// // //   apiBase,
// // //   token,
// // //   userName,
// // //   onClose,
// // // }: CallInterfaceProps) {
// // //   const containerRef = useRef<HTMLDivElement>(null);
// // //   const [sdkLoaded, setSdkLoaded] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   // ✅ تحميل SDK من CDN ديناميكياً (لا يوجد import في الكود المصدري)
// // //   useEffect(() => {
// // //     let mounted = true;

// // //     if (window.MediaSFU) {
// // //       setSdkLoaded(true);
// // //       return;
// // //     }

// // //     const existingScript = document.querySelector(`script[src="${CDN_URL}"]`);
// // //     if (existingScript) {
// // //       existingScript.addEventListener('load', () => {
// // //         if (mounted) setSdkLoaded(true);
// // //       });
// // //       return;
// // //     }

// // //     const script = document.createElement('script');
// // //     script.src = CDN_URL;
// // //     script.async = true;
// // //     script.onload = () => {
// // //       if (mounted) setSdkLoaded(true);
// // //     };
// // //     script.onerror = () => {
// // //       if (mounted) setError('فشل تحميل مكتبة المكالمات');
// // //     };
// // //     document.body.appendChild(script);

// // //     return () => {
// // //       mounted = false;
// // //     };
// // //   }, []);

// // //   // ✅ تهيئة المكالمة بعد تحميل SDK
// // //   useEffect(() => {
// // //     if (!sdkLoaded || !containerRef.current || !window.MediaSFU) return;

// // //     const { MediaSFU } = window.MediaSFU;

// // //     const createRoom = async ({ payload }: any) => {
// // //       const res = await fetch(
// // //         `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/create`,
// // //         {
// // //           method: 'POST',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //           body: JSON.stringify(payload),
// // //         }
// // //       );
// // //       if (!res.ok) throw new Error('فشل إنشاء الغرفة');
// // //       return res.json();
// // //     };

// // //     const joinRoom = async ({ payload }: any) => {
// // //       const res = await fetch(
// // //         `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/join`,
// // //         {
// // //           method: 'POST',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //           body: JSON.stringify(payload),
// // //         }
// // //       );
// // //       if (!res.ok) throw new Error('فشل الانضمام للغرفة');
// // //       return res.json();
// // //     };

// // //     const init = async () => {
// // //       try {
// // //         // ⚠️ الطريقة الصحيحة حسب توثيق MediaSFU
// // //         // قد تحتاج لتعديلها حسب API الفعلي للـ SDK
// // //         if (typeof MediaSFU.createRoom === 'function') {
// // //           await MediaSFU.createRoom({
// // //             createMediaSFURoom: createRoom,
// // //             joinMediaSFURoom: joinRoom,
// // //             options: {
// // //               roomName: activeCall.roomName,
// // //               userName,
// // //               updateIsLoading: () => {},
// // //             },
// // //             container: containerRef.current,
// // //           });
// // //         } else {
// // //           // Fallback: استخدام الـ React component من CDN
// // //           console.warn('MediaSFU CDN structure unknown, check documentation');
// // //           setError('بنية SDK غير معروفة — تحقق من التوثيق');
// // //         }
// // //       } catch (err: any) {
// // //         console.error('Call init error:', err);
// // //         setError(err.message || 'فشل بدء المكالمة');
// // //       }
// // //     };

// // //     init();
// // //   }, [sdkLoaded, activeCall, apiBase, token, userName]);

// // //   if (error) {
// // //     return (
// // //       <div className="fixed inset-0 z-[1300] bg-black flex flex-col items-center justify-center text-white gap-4">
// // //         <p className="text-red-400 text-lg">{error}</p>
// // //         <button
// // //           onClick={onClose}
// // //           className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
// // //         >
// // //           إغلاق
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="fixed inset-0 z-[1300] bg-black">
// // //       <button
// // //         onClick={onClose}
// // //         className="absolute top-4 right-4 z-[1400] bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg"
// // //         aria-label="إنهاء المكالمة"
// // //       >
// // //         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// // //           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// // //         </svg>
// // //       </button>

// // //       <div ref={containerRef} className="w-full h-full" />

// // //       {!sdkLoaded && (
// // //         <div className="absolute inset-0 flex items-center justify-center text-white">
// // //           <div className="text-center">
// // //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
// // //             <p>جاري تحميل المكالمة...</p>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // // //////////////////////////////
// // // //////////////////////////////
// // // //////////////////////////////
// // // //////////////////////////////
// // 'use client';

// // import { useEffect, useRef, useState } from 'react';
// // import { ActiveCall } from '../../types';

// // interface CallInterfaceProps {
// //   activeCall: ActiveCall;
// //   apiBase: string;
// //   token: string | null;
// //   userName: string;
// //   onClose: () => void;
// // }

// // declare global {
// //   interface Window {
// //     MediaSFU?: any;
// //     MediasfuGeneric?: any;
// //   }
// // }

// // const CDN_URL = 'https://cdn.mediasfu.com/v4/mediasfu.js';

// // export default function CallInterface({
// //   activeCall,
// //   apiBase,
// //   token,
// //   userName,
// //   onClose,
// // }: CallInterfaceProps) {
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const [sdkLoaded, setSdkLoaded] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // 1. تحميل SDK من CDN ديناميكياً
// //   useEffect(() => {
// //     let mounted = true;

// //     if (window.MediaSFU || window.MediasfuGeneric) {
// //       setSdkLoaded(true);
// //       return;
// //     }

// //     const existingScript = document.querySelector(`script[src="${CDN_URL}"]`);
// //     if (existingScript) {
// //       const handleLoad = () => {
// //         if (mounted) setSdkLoaded(true);
// //       };
// //       existingScript.addEventListener('load', handleLoad);
// //       return () => {
// //         existingScript.removeEventListener('load', handleLoad);
// //       };
// //     }

// //     const script = document.createElement('script');
// //     script.src = CDN_URL;
// //     script.async = true;
// //     script.onload = () => {
// //       if (mounted) setSdkLoaded(true);
// //     };
// //     script.onerror = () => {
// //       if (mounted) setError('فشل تحميل مكتبة المكالمات');
// //     };
// //     document.body.appendChild(script);

// //     return () => {
// //       mounted = false;
// //     };
// //   }, []);

// //   // 2. تهيئة المكالمة بعد تحميل SDK مع التعامل الآمن مع البنية
    
// // useEffect(() => {
// //   if (!sdkLoaded || !containerRef.current) return;

// //   // طباعة الكائن لمين المتابعة وتحديد بنيته المباشرة
// //   console.log('MediaSFU Global Object:', window.MediaSFU || window.MediasfuGeneric);

// //   const mediaSfuGlobal = window.MediaSFU || window.MediasfuGeneric || (window as any).Mediasfu;

// //   if (!mediaSfuGlobal) {
// //     setError('مكتبة المكالمات غير متوفرة في النطاق العام (Global Scope)');
// //     return;
// //   }

// //   const createRoom = async ({ payload }: any) => {
// //     const res = await fetch(
// //       `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/create`,
// //       {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //       }
// //     );
// //     if (!res.ok) throw new Error('فشل إنشاء الغرفة');
// //     return res.json();
// //   };

// //   const joinRoom = async ({ payload }: any) => {
// //     const res = await fetch(
// //       `${apiBase}/chats/calls/${activeCall.callId}/mediasfu/join`,
// //       {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(payload),
// //       }
// //     );
// //     if (!res.ok) throw new Error('فشل الانضمام للغرفة');
// //     return res.json();
// //   };

// //   const init = async () => {
// //     try {
// //       // 1. في حال توفر الدالة المباشرة createRoom
// //       if (typeof mediaSfuGlobal.createRoom === 'function') {
// //         await mediaSfuGlobal.createRoom({
// //           createMediaSFURoom: createRoom,
// //           joinMediaSFURoom: joinRoom,
// //           options: {
// //             roomName: activeCall.roomName,
// //             userName,
// //             updateIsLoading: () => {},
// //           },
// //           container: containerRef.current,
// //         });
// //       } 
// //       // 2. في حال وجود كائن فرعي MediaSFU
// //       else if (mediaSfuGlobal.MediaSFU && typeof mediaSfuGlobal.MediaSFU.createRoom === 'function') {
// //         await mediaSfuGlobal.MediaSFU.createRoom({
// //           createMediaSFURoom: createRoom,
// //           joinMediaSFURoom: joinRoom,
// //           options: {
// //             roomName: activeCall.roomName,
// //             userName,
// //             updateIsLoading: () => {},
// //           },
// //           container: containerRef.current,
// //         });
// //       } 
// //       // 3. في حال تصدير دالة تشغيلية مباشرة
// //       else if (typeof mediaSfuGlobal === 'function') {
// //         mediaSfuGlobal({
// //           createMediaSFURoom: createRoom,
// //           joinMediaSFURoom: joinRoom,
// //           options: {
// //             roomName: activeCall.roomName,
// //             userName,
// //           },
// //           container: containerRef.current,
// //         });
// //       } else {
// //         // طباعة تفاصيل الكائن المتاح بالكامل في الـ Console لمعرفة المفاتيح (Keys) الموجودة به
// //         console.error('Unknown MediaSFU structure. Available keys:', Object.keys(mediaSfuGlobal));
// //         setError('بنية SDK غير مطابقة — يرجى فتح Console لمعاينة المفاتيح المتاحة');
// //       }
// //     } catch (err: any) {
// //       console.error('Call init error:', err);
// //       setError(err.message || 'فشل بدء المكالمة');
// //     }
// //   };

// //   init();
// // }, [sdkLoaded, activeCall, apiBase, token, userName]);
// //   if (error) {
// //     return (
// //       <div className="fixed inset-0 z-[1300] bg-black flex flex-col items-center justify-center text-white gap-4">
// //         <p className="text-red-400 text-lg">{error}</p>
// //         <button
// //           onClick={onClose}
// //           className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors"
// //         >
// //           إغلاق وتنظيف الجلسة
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 z-[1300] bg-black">
// //       <button
// //         onClick={onClose}
// //         className="absolute top-4 right-4 z-[1400] bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg transition-transform active:scale-95"
// //         aria-label="إنهاء المكالمة"
// //       >
// //         <svg
// //           className="w-6 h-6"
// //           fill="none"
// //           viewBox="0 0 24 24"
// //           stroke="currentColor"
// //           strokeWidth={2}
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             d="M6 18L18 6M6 6l12 12"
// //           />
// //         </svg>
// //       </button>

// //       <div ref={containerRef} className="w-full h-full" />

// //       {!sdkLoaded && (
// //         <div className="absolute inset-0 flex items-center justify-center text-white">
// //           <div className="text-center">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
// //             <p>جاري تحميل مكتبة الاتصال...</p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // //////////////////////////
// // //////////////////////////
// // //////////////////////////
// // //////////////////////////
// // //////////////////////////

// // USing  Zegocloud
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { ActiveCall } from '../../types';

// interface CallInterfaceProps {
//   activeCall: ActiveCall;
//   apiBase: string;
//   token: string | null;
//   userName: string;
//   onClose: () => void;
// }

// export default function CallInterface(props: CallInterfaceProps) {
//   const [ZegoUIKitPrebuilt, setZegoUIKitPrebuilt] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const zpRef = useRef<any>(null);

//   // 1. تحميل مكتبة ZEGOCLOUD ديناميكياً
//   useEffect(() => {
//     let mounted = true;
//     const loadZego = async () => {
//       try {
//         const zegoModule = await import('@zegocloud/zego-uikit-prebuilt');
//         if (mounted) setZegoUIKitPrebuilt(zegoModule.ZegoUIKitPrebuilt);
//       } catch (err) {
//         console.error('Failed to load ZEGOCLOUD:', err);
//         if (mounted) {
//           setError('فشل تحميل مكتبة المكالمات');
//           setIsLoading(false);
//         }
//       }
//     };
//     loadZego();
//     return () => { mounted = false; };
//   }, []);

//   // 2. تهيئة المكالمة
//   useEffect(() => {
//     if (!ZegoUIKitPrebuilt || !containerRef.current || !props.token) return;

//     let mounted = true;

//     const initCall = async () => {
//       try {
//         // ✅ جيبي التوكن من الـ API بتاع سامح
//         const res = await fetch(
//           `${props.apiBase}/chats/calls/${props.activeCall.callId}/zego-token`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${props.token}`,
//             },
//           }
//         );

//         if (!res.ok) {
//           const errData = await res.json().catch(() => ({}));
//           throw new Error(errData.message || 'فشل جلب التوكن');
//         }

//         const { token: kitToken } = await res.json();

//         // ✅ roomID = callId (أو roomName لو سامح قال)
//         const roomID = props.activeCall.roomName || props.activeCall.callId;
//         const userID = props.token.slice(-8);

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zpRef.current = zp;

//         await zp.joinRoom({
//           container: containerRef.current,
//           scenario: {
//             mode:
//               props.activeCall.callType === 'video'
//                 ? ZegoUIKitPrebuilt.VideoConference
//                 : ZegoUIKitPrebuilt.OneONoneCall,
//           },
//           showPreJoinView: false,
//           turnOnCameraWhenJoining: props.activeCall.callType === 'video',
//           turnOnMicrophoneWhenJoining: true,
//           showMyCameraToggleButton: true,
//           showMyMicrophoneToggleButton: true,
//           showAudioVideoSettingsButton: true,
//           showScreenSharingButton: props.activeCall.callType === 'video',
//           showTextChat: false,
//           showUserList: true,
//           maxUsers: 10,
//           layout: 'Auto',
//           onLeaveRoom: () => {
//             if (mounted) props.onClose();
//           },
//         });

//         if (mounted) setIsLoading(false);
//       } catch (err: any) {
//         console.error('Call init error:', err);
//         if (mounted) {
//           setError(err.message || 'فشل بدء المكالمة');
//           setIsLoading(false);
//         }
//       }
//     };

//     initCall();

//     return () => {
//       mounted = false;
//       if (zpRef.current) {
//         try { zpRef.current.destroy(); } catch (e) {}
//       }
//     };
//   }, [ZegoUIKitPrebuilt, props.activeCall, props.token, props.apiBase, props.userName, props.onClose]);

//   if (error) {
//     return (
//       <div className="fixed inset-0 z-[1300] bg-black flex flex-col items-center justify-center text-white gap-4">
//         <p className="text-red-400 text-lg">{error}</p>
//         <button
//           onClick={props.onClose}
//           className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
//         >
//           إغلاق
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-[1300] bg-black">
//       <button
//         onClick={async () => {
//           try { if (zpRef.current) await zpRef.current.destroy(); } catch (e) {}
//           props.onClose();
//         }}
//         className="absolute top-4 right-4 z-[1400] bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
//       >
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>

//       <div ref={containerRef} className="w-full h-full" />

//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center text-white bg-black/80">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
//             <p>جاري تحميل المكالمة...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// ///////////////////
// ///////////////////
// ///////////////////
// ///////////////////
// // //////////////////
// // src/app/chats/_components/components/calls/CallInterface.tsx
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { ActiveCall } from '../../types';

// interface CallInterfaceProps {
//   activeCall: ActiveCall;
//   apiBase: string;
//   token: string | null;
//   userName: string;
//   onClose: () => void;
//   calleeName?: string;
//   calleeUsername?: string;
//   calleeAvatar?: string;
//   isGroupCall?: boolean;
//   groupAvatars?: string[];
//   groupCount?: number;
// }

// export default function CallInterface(props: CallInterfaceProps) {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
//   const [callDuration, setCallDuration] = useState('00:00');

//   const containerRef = useRef<HTMLDivElement>(null);
//   const zpRef = useRef<any>(null);

//   // ✅ تحميل المكتبة وتهيئة المكالمة
//   useEffect(() => {
//     let mounted = true;

//     const initCall = async () => {
//       try {
//         const zegoModule = await import('@zegocloud/zego-uikit-prebuilt');
//         const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt;

//         if (!ZegoUIKitPrebuilt) {
//           throw new Error('ZegoUIKitPrebuilt مش موجود');
//         }

//         if (!containerRef.current) {
//           throw new Error('Container مش جاهز');
//         }

//         const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || '0');
//         const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || '';

//         if (!appID || !serverSecret) {
//           throw new Error('AppID أو ServerSecret غير موجودين');
//         }

//         const roomID = props.activeCall.callId || 'test-room-123';
//         const userID = props.token
//           ? `user_${props.token.slice(-8)}`
//           : `user_${Date.now()}`;

//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           roomID,
//           userID,
//           props.userName
//         );

//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zpRef.current = zp;

//         await zp.joinRoom({
//           container: containerRef.current,
//           scenario: {
//             mode:
//               props.activeCall.callType === 'video'
//                 ? ZegoUIKitPrebuilt.VideoConference
//                 : ZegoUIKitPrebuilt.OneONoneCall,
//           },
//           showPreJoinView: false,
//           turnOnCameraWhenJoining: false,
//           turnOnMicrophoneWhenJoining: true,
//           showMyCameraToggleButton: false,
//           showMyMicrophoneToggleButton: false,
//           showAudioVideoSettingsButton: false,
//           showScreenSharingButton: false,
//           showTextChat: false,
//           showUserList: false,
//           showLeavingView: false,
//           layout: 'Auto',
//           onLeaveRoom: () => {
//             if (mounted) props.onClose();
//           },
//         });

//         if (mounted) setIsLoading(false);
//       } catch (err: any) {
//         console.error('❌ Call init error:', err);
//         if (mounted) {
//           setError(err.message || 'فشل بدء المكالمة');
//           setIsLoading(false);
//         }
//       }
//     };

//     initCall();

//     return () => {
//       mounted = false;
//       if (zpRef.current) {
//         try {
//           zpRef.current.destroy();
//         } catch (e) {
//           console.warn('Error destroying Zego:', e);
//         }
//       }
//     };
//   }, [props.activeCall.callId, props.activeCall.callType, props.token, props.userName, props.onClose]);

//   // ✅ مؤقت مدة المكالمة
//   useEffect(() => {
//     let seconds = 0;
//     const interval = setInterval(() => {
//       seconds++;
//       const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//       const secs = (seconds % 60).toString().padStart(2, '0');
//       setCallDuration(`${mins}:${secs}`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // ✅ كتم المايك
//   const handleToggleMute = () => {
//     if (zpRef.current) {
//       try {
//         if (typeof zpRef.current.muteMicrophone === 'function') {
//           zpRef.current.muteMicrophone(!isMuted);
//         }
//       } catch (e) {
//         console.warn('Error toggling mute:', e);
//       }
//     }
//     setIsMuted(!isMuted);
//   };

//   // ✅ مكبر الصوت
//   const handleToggleSpeaker = () => {
//     if (zpRef.current) {
//       try {
//         if (typeof zpRef.current.setAudioRouteToSpeaker === 'function') {
//           zpRef.current.setAudioRouteToSpeaker(!isSpeakerOn);
//         }
//       } catch (e) {
//         console.warn('Error toggling speaker:', e);
//       }
//     }
//     setIsSpeakerOn(!isSpeakerOn);
//   };

//   // ✅ إضافة شخص
//   const handleAddPerson = () => {
//     console.log('Add person clicked');
//   };

//   // ✅ إنهاء المكالمة
//   const handleEndCall = () => {
//     if (zpRef.current) {
//       try {
//         zpRef.current.destroy();
//       } catch (e) {
//         console.warn('Error destroying Zego:', e);
//       }
//       zpRef.current = null;
//     }
//     props.onClose();
//   };

//   // ===== شاشة الخطأ =====
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center text-white gap-4 p-4">
//         <p className="text-red-400 text-lg">{error}</p>
//         <button
//           onClick={props.onClose}
//           className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
//         >
//           إغلاق
//         </button>
//       </div>
//     );
//   }

//   // ===== شاشة المكالمة (بنفس شكل CallModal) =====
//   return (
//     <>
//       {/* ✅ حاوية ZEGOCLOUD المخفية */}
//       <div
//         ref={containerRef}
//         style={{
//           position: 'fixed',
//           top: '-9999px',
//           left: '-9999px',
//           width: '1px',
//           height: '1px',
//           opacity: 0,
//           pointerEvents: 'none',
//           overflow: 'hidden',
//           zIndex: -9999,
//         }}
//       />

//       {/* ✅ واجهة المكالمة */}
//       <div
//         style={{
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           padding: '10px 0',
//         }}
//       >
//         <div
//           style={{
//             width: '100%',
//             maxWidth: '357px',
//             borderRadius: '35px',
//             background: '#F1F4F9',
//             paddingTop: '20px',
//             paddingBottom: '0px',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             position: 'relative',
//             overflow: 'hidden',
//             marginRight: '20px',
//             marginLeft: '10px',
//           }}
//         >
//           {/* نص الحالة */}
//           <p
//             style={{
//               fontFamily: 'Cairo',
//               fontWeight: 600,
//               fontSize: props.isGroupCall ? '15px' : '13px',
//               textAlign: 'center',
//               color: '#7C7D7E',
//               marginBottom: props.isGroupCall ? '8px' : '30px',
//               padding: '0 16px',
//             }}
//           >
//             {props.isGroupCall ? 'مكالمة جماعية' : 'مكالمة صوتية'} • {callDuration}
//           </p>

//           {/* محتوى المكالمة */}
//           {props.isGroupCall ? (
//             <>
//               <h3
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '30px',
//                   textAlign: 'center',
//                   color: '#000',
//                   marginBottom: '10px',
//                   marginTop: '60px',
//                   padding: '0 16px',
//                 }}
//               >
//                 مكالمة جماعية
//               </h3>

//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   direction: 'ltr',
//                   marginBottom: '16px',
//                   padding: '0 16px',
//                 }}
//               >
//                 {(props.groupAvatars || ['/imgs/user.png', '/imgs/user.png', '/imgs/user.png', '/imgs/user.png'])
//                   .slice(0, 4)
//                   .map((avatar, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         position: 'relative',
//                         marginRight: index !== 3 ? '-22px' : '0px',
//                         zIndex: index + 1,
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: '70px',
//                           height: '70px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}
//                       >
//                         <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: 'block' }}>
//                           <defs>
//                             <clipPath id={`wavyCall-${index}`}>
//                               <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} />
//                             </clipPath>
//                           </defs>
//                           <image
//                             href={avatar}
//                             x="0"
//                             y="0"
//                             width="160"
//                             height="160"
//                             preserveAspectRatio="xMidYMid slice"
//                             clipPath={`url(#wavyCall-${index})`}
//                             style={{ filter: 'blur(5px)' }}
//                           />
//                           <path
//                             d={generateWavyCirclePath(80, 80, 67, 14, 3)}
//                             fill="none"
//                             stroke="transparent"
//                             strokeWidth="6"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   ))}
//               </div>

//               <p
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '14px',
//                   textAlign: 'center',
//                   color: '#7C7D7E',
//                   marginBottom: '10px',
//                   marginTop: '15px',
//                 }}
//               >
//                 {props.groupCount || 4} أشخاص في هذه المكالمة
//               </p>
//             </>
//           ) : (
//             <>
//               <h3
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '20px',
//                   textAlign: 'center',
//                   color: '#000',
//                   marginBottom: '6px',
//                   padding: '0 16px',
//                 }}
//               >
//                 {props.calleeName || 'مستخدم'}
//               </h3>

//               <p
//                 style={{
//                   fontFamily: 'Inter',
//                   fontWeight: 400,
//                   fontSize: '13px',
//                   textAlign: 'center',
//                   color: '#000',
//                   marginBottom: '12px',
//                   padding: '0 16px',
//                 }}
//               >
//                 {props.calleeUsername || '@user'}
//               </p>

//               <div
//                 style={{
//                   position: 'relative',
//                   width: '160px',
//                   height: '160px',
//                   marginBottom: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
//                   <defs>
//                     <clipPath id="wavyAvatarCall">
//                       <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
//                     </clipPath>
//                   </defs>
//                   <image
//                     href={props.calleeAvatar || '/imgs/user.png'}
//                     x="0"
//                     y="0"
//                     width="160"
//                     height="160"
//                     preserveAspectRatio="xMidYMid slice"
//                     clipPath="url(#wavyAvatarCall)"
//                   />
//                   <path
//                     d={generateWavyCirclePath(80, 80, 70, 14, 3)}
//                     fill="none"
//                     stroke="transparent"
//                     strokeWidth="1.5"
//                   />
//                 </svg>
//               </div>
//             </>
//           )}

//           {/* ===== أزرار المكالمة ===== */}
//           <div
//             style={{
//               width: '100%',
//               borderBottomLeftRadius: '35px',
//               borderBottomRightRadius: '35px',
//               background: '#EAEDF6',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '14px',
//               padding: '20px 16px',
//             }}
//           >
//             {/* الصف الأول: المايك + مكبر الصوت + إضافة شخص */}
//             <div
//               style={{
//                 display: 'flex',
//                 gap: '20px',
//                 width: '100%',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//         {/* ➕ إضافة شخص */}
//           <div
//             style={{
//               display: 'inline-flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: '6px', // مسافة مناسبة بين الزر والنص
//             }}
//           >
//             <button
//               onClick={handleAddPerson}
//               style={{
//                 width: '73px',
//                 height: '58px',
//                 borderRadius: '33px',
//                 background: '#FFFFFF',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <img
//                 src="imgs/AddAperson.svg"
//                 alt="Add Person"
//                 style={{
//                   width: '18px',
//                   height: '18px',
//                   opacity: 1,
//                 }}
//               />
//             </button>

//             <span
//               style={{
//                 fontFamily: 'Cairo, sans-serif',
//                 fontWeight: 600,
//                 fontSize: '12px',
//                 lineHeight: '100%',
//                 letterSpacing: '0%',
//                 textAlign: 'center',
//                 color: '#7C7D7E',
//               }}
//             >
//             اضافة شخص
//             </span>
//           </div>
//               {/* 🎤 المايك */}
    
//             <div
//   style={{
//     display: 'inline-flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '6px',
//   }}
// >
//   <button
//     onClick={handleToggleMute}
//     style={{
//       width: '73px',
//       height: '58px',
//       borderRadius: '33px',
//       background: isMuted ? '#D72229' : '#FFFFFF',
//       border: 'none',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}
//   >
//     {isMuted ? (
//       <img src="imgs/microphone.svg" alt="Muted" width="18" height="18" />
//     ) : (
//       <img src="imgs/microphone.svg" alt="Active" width="18" height="18" />
//     )}
//   </button>

//   <span
//     style={{
//       fontFamily: 'Cairo, sans-serif',
//       fontWeight: 600,
//       fontSize: '12px',
//       lineHeight: '100%',
//       letterSpacing: '0%',
//       textAlign: 'center',
//       color: '#7C7D7E',
//     }}
//   >
//     المايك
//   </span>
// </div>

//         {/* 🔊 مكبر الصوت */}
          
//           <div
//           style={{
//             display: 'inline-flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: '6px',
//           }}
//         >
//           <button
//             onClick={handleToggleSpeaker}
//             style={{
//               width: '73px',
//               height: '58px',
//               borderRadius: '33px',
//               background: '#FFFFFF',
//               border: 'none',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <img
//               src="imgs/speaker.svg"
//               alt="speaker"
//               style={{
//                 width: '18px',
//                 height: '18px',
//                 opacity: 1,
//               }}
//             />
//           </button>

//           <span
//             style={{
//               fontFamily: 'Cairo, sans-serif',
//               fontWeight: 600,
//               fontSize: '12px',
//               lineHeight: '100%',
//               letterSpacing: '0%',
//               textAlign: 'center',
//               color: '#7C7D7E',
//             }}
//           >
//             مكبر الصوت
//           </span>
//         </div>

     
//             </div>

//             {/* الصف الثاني: زر إنهاء الاتصال */}
//             <button
//               onClick={handleEndCall}
//               style={{
//                 width: '150px',
//                 height: '50px',
//                 borderRadius: '38.5px',
//                 background: '#D72229',
//                 border: 'none',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px',
//               }}
//             >
//               <img
//                 src="/imgs/call.svg"
//                 alt="إنهاء الاتصال"
//                 style={{
//                   width: '24px',
//                   height: '24px',
//                   filter: 'brightness(0) invert(1)',
//                   // transform: 'rotate(135deg)',
//                 }}
//               />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
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


// //////////////////////////////
// //////////////////////////////
// //////////////////////////////
// //////////////////////////////
// //////////////////////////////
// //////////////////////////////
// src/app/chats/_components/components/calls/CallInterface.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ActiveCall } from '../../types';
import AddPersonModal from './AddPersonModal';

interface CallInterfaceProps {
  activeCall: ActiveCall;
  apiBase: string;
  token: string | null;
  userName: string;
  onClose: () => void;
  calleeName?: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  isGroupCall?: boolean;
  groupAvatars?: string[];
  groupCount?: number;
}

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export default function CallInterface(props: CallInterfaceProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [showAddPerson, setShowAddPerson] = useState(false);

  // ✅ قائمة الأشخاص (مؤقتاً - ممكن تجيبها من API بعدين)
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'أحمد محمد', username: '@ahmed', avatar: '/imgs/user.png' },
    { id: '2', name: 'سارة علي', username: '@sara', avatar: '/imgs/user.png' },
    { id: '3', name: 'محمد حسن', username: '@mohamed', avatar: '/imgs/user.png' },
    { id: '4', name: 'نور خالد', username: '@noor', avatar: '/imgs/user.png' },
    { id: '5', name: 'يوسف إبراهيم', username: '@youssef', avatar: '/imgs/user.png' },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  // ✅ تحميل المكتبة وتهيئة المكالمة
  useEffect(() => {
    let mounted = true;

    const initCall = async () => {
      try {
        const zegoModule = await import('@zegocloud/zego-uikit-prebuilt');
        const ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt;

        if (!ZegoUIKitPrebuilt) {
          throw new Error('ZegoUIKitPrebuilt مش موجود');
        }

        if (!containerRef.current) {
          throw new Error('Container مش جاهز');
        }

        const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || '0');
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || '';

        if (!appID || !serverSecret) {
          throw new Error('AppID أو ServerSecret غير موجودين');
        }

        const roomID = props.activeCall.callId || 'test-room-123';
        const userID = props.token
          ? `user_${props.token.slice(-8)}`
          : `user_${Date.now()}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userID,
          props.userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        await zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode:
              props.activeCall.callType === 'video'
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
            if (mounted) props.onClose();
          },
        });

        if (mounted) setIsLoading(false);
      } catch (err: any) {
        console.error('❌ Call init error:', err);
        if (mounted) {
          setError(err.message || 'فشل بدء المكالمة');
          setIsLoading(false);
        }
      }
    };

    initCall();

    return () => {
      mounted = false;
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying Zego:', e);
        }
      }
    };
  }, [props.activeCall.callId, props.activeCall.callType, props.token, props.userName, props.onClose]);

  // ✅ مؤقت مدة المكالمة
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ كتم المايك
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

  // ✅ مكبر الصوت
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

  // ✅ فتح مودال إضافة شخص
  const handleAddPerson = () => {
    setShowAddPerson(true);
  };

  // ✅ إضافة الأشخاص المختارين إلى المكالمة
  const handleAddToCall = async (selectedIds: string[]) => {
    console.log('✅ إضافة الأشخاص إلى المكالمة:', selectedIds);

    // هنا ممكن تنادي الـ API بتاعك عشان تضيف الأشخاص
    // مثال:
    // try {
    //   await fetch(`${props.apiBase}/calls/${props.activeCall.callId}/invite`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${props.token}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ userIds: selectedIds }),
    //   });
    // } catch (err) {
    //   console.error('Error inviting users:', err);
    // }

    setShowAddPerson(false);
  };

  // ✅ الرجوع للمودال الأصلي للمكالمة
  const handleBackToCall = () => {
    setShowAddPerson(false);
  };

  // ✅ إنهاء المكالمة
  const handleEndCall = () => {
    if (zpRef.current) {
      try {
        zpRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying Zego:', e);
      }
      zpRef.current = null;
    }
    props.onClose();
  };

  // ===== شاشة الخطأ =====
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-white gap-4 p-4">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={props.onClose}
          className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          إغلاق
        </button>
      </div>
    );
  }

  // ===== شاشة المكالمة (بنفس شكل CallModal) =====
  return (
    <>
      {/* ✅ حاوية ZEGOCLOUD المخفية */}
      <div
        ref={containerRef}
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

      {/* ✅ واجهة المكالمة (تظهر داخل الـ Sidebar) */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0',
        }}
      >
        {showAddPerson ? (
          /* ===== مودال إضافة أشخاص (يظهر داخل الـ Sidebar) ===== */
        <AddPersonModal
  callType={props.activeCall.callType}
  callDuration={callDuration}
  contacts={contacts}
  participants={
    props.isGroupCall
      ? (props.groupAvatars || []).map((avatar, i) => ({
          id: String(i),
          name: `مشارك ${i + 1}`,
          avatar,
        }))
      : [
          {
            id: '1',
            name: props.calleeName,
            avatar: props.calleeAvatar,
          },
        ]
  }
  onClose={handleEndCall}
  onBack={handleBackToCall}
  onAddToCall={handleAddToCall}
/>
        ) : (
          /* ===== واجهة المكالمة العادية ===== */
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
            {/* نص الحالة */}
            <p
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: props.isGroupCall ? '15px' : '13px',
                textAlign: 'center',
                color: '#7C7D7E',
                marginBottom: props.isGroupCall ? '8px' : '30px',
                padding: '0 16px',
              }}
            >
              {props.isGroupCall ? 'مكالمة جماعية' : 'مكالمة صوتية'} • {callDuration}
            </p>

            {/* محتوى المكالمة */}
            {props.isGroupCall ? (
              <>
                <h3
                  style={{
                    fontFamily: 'Cairo',
                    fontWeight: 600,
                    fontSize: '30px',
                    textAlign: 'center',
                    color: '#000',
                    marginBottom: '10px',
                    marginTop: '60px',
                    padding: '0 16px',
                  }}
                >
                  مكالمة جماعية
                </h3>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    direction: 'ltr',
                    marginBottom: '16px',
                    padding: '0 16px',
                  }}
                >
                  {(props.groupAvatars || ['/imgs/user.png', '/imgs/user.png', '/imgs/user.png', '/imgs/user.png'])
                    .slice(0, 4)
                    .map((avatar, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          marginRight: index !== 3 ? '-22px' : '0px',
                          zIndex: index + 1,
                        }}
                      >
                        <div
                          style={{
                            width: '70px',
                            height: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: 'block' }}>
                            <defs>
                              <clipPath id={`wavyCall-${index}`}>
                                <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} />
                              </clipPath>
                            </defs>
                            <image
                              href={avatar}
                              x="0"
                              y="0"
                              width="160"
                              height="160"
                              preserveAspectRatio="xMidYMid slice"
                              clipPath={`url(#wavyCall-${index})`}
                              style={{ filter: 'blur(5px)' }}
                            />
                            <path
                              d={generateWavyCirclePath(80, 80, 67, 14, 3)}
                              fill="none"
                              stroke="transparent"
                              strokeWidth="6"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                </div>

                <p
                  style={{
                    fontFamily: 'Cairo',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#7C7D7E',
                    marginBottom: '10px',
                    marginTop: '15px',
                  }}
                >
                  {props.groupCount || 4} أشخاص في هذه المكالمة
                </p>
              </>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: 'Cairo',
                    fontWeight: 600,
                    fontSize: '20px',
                    textAlign: 'center',
                    color: '#000',
                    marginBottom: '6px',
                    padding: '0 16px',
                  }}
                >
                  {props.calleeName || 'مستخدم'}
                </h3>

                <p
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '13px',
                    textAlign: 'center',
                    color: '#000',
                    marginBottom: '12px',
                    padding: '0 16px',
                  }}
                >
                  {props.calleeUsername || '@user'}
                </p>

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
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
                    <defs>
                      <clipPath id="wavyAvatarCall">
                        <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
                      </clipPath>
                    </defs>
                    <image
                      href={props.calleeAvatar || '/imgs/user.png'}
                      x="0"
                      y="0"
                      width="160"
                      height="160"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#wavyAvatarCall)"
                    />
                    <path
                      d={generateWavyCirclePath(80, 80, 70, 14, 3)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </>
            )}

            {/* ===== أزرار المكالمة ===== */}
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
              {/* الصف الأول: المايك + مكبر الصوت + إضافة شخص */}
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* ➕ إضافة شخص */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={handleAddPerson}
                    style={{
                      width: '73px',
                      height: '58px',
                      borderRadius: '33px',
                      background: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="imgs/AddAperson.svg"
                      alt="Add Person"
                      style={{
                        width: '18px',
                        height: '18px',
                        opacity: 1,
                      }}
                    />
                  </button>

                  <span
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#7C7D7E',
                    }}
                  >
                    اضافة شخص
                  </span>
                </div>

                {/* 🎤 المايك */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={handleToggleMute}
                    style={{
                      width: '73px',
                      height: '58px',
                      borderRadius: '33px',
                      background: isMuted ? '#D72229' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isMuted ? (
                      <img src="imgs/microphone.svg" alt="Muted" width="18" height="18" />
                    ) : (
                      <img src="imgs/microphone.svg" alt="Active" width="18" height="18" />
                    )}
                  </button>

                  <span
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#7C7D7E',
                    }}
                  >
                    المايك
                  </span>
                </div>

                {/* 🔊 مكبر الصوت */}
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={handleToggleSpeaker}
                    style={{
                      width: '73px',
                      height: '58px',
                      borderRadius: '33px',
                      background: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="imgs/speaker.svg"
                      alt="speaker"
                      style={{
                        width: '18px',
                        height: '18px',
                        opacity: 1,
                      }}
                    />
                  </button>

                  <span
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#7C7D7E',
                    }}
                  >
                    مكبر الصوت
                  </span>
                </div>
              </div>

              {/* الصف الثاني: زر إنهاء الاتصال */}
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
                }}
              >
                <img
                  src="/imgs/call.svg"
                  alt="إنهاء الاتصال"
                  style={{
                    width: '24px',
                    height: '24px',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
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