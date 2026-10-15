// // // src/components/calls/CallScreen.tsx
// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { useZegoCall } from "@/components/ZegoCallProvider";
// // import { CallType } from "./types";

// // interface CallScreenProps {
// //   calleeName: string;
// //   calleeUsername?: string;
// //   calleeAvatar?: string;
// //   callType: CallType;
// //   isGroupCall?: boolean;
// //   groupAvatars?: string[];
// //   groupCount?: number;
// //   onEnd: () => void;
// // }

// // export default function CallScreen({
// //   calleeName,
// //   calleeUsername = "@user",
// //   calleeAvatar = "/imgs/user.png",
// //   callType,
// //   isGroupCall = false,
// //   groupAvatars = [],
// //   groupCount = 0,
// //   onEnd,
// // }: CallScreenProps) {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     endCall,
// //   } = useZegoCall();

// //   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
// //   const localVideoRef = useRef<HTMLDivElement | null>(null);
// //   const [callDuration, setCallDuration] = useState("00:00");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);
// //   const { switchCamera } = useZegoCall();

// //   // ================== المؤقت ==================
// //   useEffect(() => {
// //     if (callState !== "connected") return;

// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
// //       const secs = (seconds % 60).toString().padStart(2, "0");
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [callState]);

// //   // ================== عرض الفيديو المحلي ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (callState !== "connected" && callState !== "calling") return;
// //     if (!localVideoRef.current) return;

// //     let attempts = 0;
// //     const maxAttempts = 10;

// //     const attachLocal = async () => {
// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       const videoView = callEngine.getLocalVideoView();
// //       if (videoView && localVideoRef.current) {
// //         localVideoRef.current.innerHTML = "";
// //         localVideoRef.current.appendChild(videoView);
// //         console.log("✅ Local video attached to CallScreen");
// //       } else if (attempts < maxAttempts) {
// //         attempts++;
// //         setTimeout(attachLocal, 500);
// //       }
// //     };

// //     attachLocal();
// //   }, [callState, callType]);

// //   // ================== عرض فيديو الطرف التاني ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (!remoteStreamIds.length) return;
// //     if (!remoteVideoRef.current) return;

// //     const attachRemote = async () => {
// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       const streamId = remoteStreamIds[0];
// //       if (remoteVideoRef.current) {
// //         await callEngine.startPlaying(streamId, remoteVideoRef.current);
// //         console.log("✅ Remote video attached to CallScreen");
// //       }
// //     };

// //     attachRemote();
// //   }, [remoteStreamIds, callType]);

// //   // ================== إنهاء المكالمة ==================
// //   const handleEndCall = () => {
// //     endCall();
// //     onEnd();
// //   };

// //   // ================== تبديل الكاميرا ==================
// //   const handleSwitchCamera = () => {
// //     setIsFrontCamera((prev) => {
// //       const newState = !prev;
// //       switchCamera(newState);
// //       return newState;
// //     });
// //   };

// //   // ================== رسم الشكل ==================
// //   const isVideoCall = callType === "video";
// //   const isAudioCall = callType === "audio";

// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         background: "#000",
// //         zIndex: 999999,
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* ============ الجزء العلوي: الفيديو ============ */}
// //       {isVideoCall ? (
// //         <div className="flex-1 relative">
// //           {/* فيديو الطرف التاني */}
// //           <div
// //             ref={remoteVideoRef}
// //             className="absolute inset-0 bg-black"
// //             style={{ overflow: "hidden" }}
// //           />

// //           {/* فيديوك (صغير في الزاوية) */}
// //           <div
// //             ref={localVideoRef}
// //             className="absolute bottom-4 left-4 rounded-2xl overflow-hidden border-2 border-white/30"
// //             style={{
// //               width: "120px",
// //               height: "180px",
// //               background: "#1a1a1a",
// //               boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
// //             }}
// //           />

// //           {/* اسم الطرف التاني + المدة */}
// //           <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
// //             <div
// //               className="px-4 py-2 rounded-full"
// //               style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
// //             >
// //               <p style={{ fontFamily: "Cairo", fontSize: "14px", color: "#fff", margin: 0 }}>
// //                 {calleeName} • {callDuration}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         /* ============ الجزء العلوي: Avatar (صوتي) ============ */
// //         <div
// //           className="flex-1 flex flex-col items-center justify-center"
// //           style={{ background: "#F1F4F9" }}
// //         >
// //           <p
// //             style={{
// //               fontFamily: "Cairo",
// //               fontSize: "14px",
// //               color: "#7C7D7E",
// //               marginBottom: "30px",
// //             }}
// //           >
// //             مكالمة صوتية • {callDuration}
// //           </p>

// //           {isGroupCall ? (
// //             <>
// //               {/* صور جماعية */}
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   marginBottom: "16px",
// //                 }}
// //               >
// //                 {groupAvatars.slice(0, 4).map((avatar, index) => (
// //                   <div
// //                     key={index}
// //                     style={{
// //                       position: "relative",
// //                       marginRight:
// //                         index !== groupAvatars.slice(0, 4).length - 1
// //                           ? "-22px"
// //                           : "0px",
// //                       zIndex: index + 1,
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         width: "70px",
// //                         height: "70px",
// //                         borderRadius: "50%",
// //                         overflow: "hidden",
// //                         border: "3px solid #F1F4F9",
// //                       }}
// //                     >
// //                       <img
// //                         src={avatar}
// //                         alt="member"
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontSize: "14px",
// //                   color: "#7C7D7E",
// //                 }}
// //               >
// //                 {groupCount} أشخاص في المكالمة
// //               </p>
// //             </>
// //           ) : (
// //             <>
// //               <h3
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontWeight: 600,
// //                   fontSize: "20px",
// //                   color: "#000",
// //                   marginBottom: "6px",
// //                 }}
// //               >
// //                 {calleeName}
// //               </h3>
// //               <p
// //                 style={{
// //                   fontFamily: "Inter",
// //                   fontSize: "13px",
// //                   color: "#000",
// //                   marginBottom: "20px",
// //                 }}
// //               >
// //                 {calleeUsername}
// //               </p>
// //               <div
// //                 style={{
// //                   width: "160px",
// //                   height: "160px",
// //                   borderRadius: "50%",
// //                   overflow: "hidden",
// //                   border: "4px solid #fff",
// //                   boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
// //                 }}
// //               >
// //                 <img
// //                   src={calleeAvatar}
// //                   alt={calleeName}
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     objectFit: "cover",
// //                   }}
// //                 />
// //               </div>
// //             </>
// //           )}

// //           {/* ============ رسالة الحالة ============ */}
// //           {callState === "calling" && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               جاري الاتصال...
// //             </p>
// //           )}
// //           {callState === "connected" && remoteStreamIds.length === 0 && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               في انتظار الطرف التاني...
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* ============ الجزء السفلي: الأزرار ============ */}
// //       <div
// //         style={{
// //           padding: "24px 16px",
// //           background: isVideoCall ? "rgba(0,0,0,0.85)" : "#EAEDF6",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "16px",
// //           alignItems: "center",
// //         }}
// //       >
// //         {/* الأزرار الأساسية */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "20px",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             flexWrap: "wrap",
// //           }}
// //         >
// //           {/* 🎤 المايك */}
// //           <button
// //             onClick={toggleMic}
// //             style={{
// //               width: "55px",
// //               height: "55px",
// //               borderRadius: "50%",
// //               background: isMicMuted
// //                 ? "#D72229"
// //                 : isVideoCall
// //                 ? "rgba(255,255,255,0.2)"
// //                 : "#FFFFFF",
// //               border: "none",
// //               cursor: "pointer",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //             }}
// //             aria-label="كتم الميكروفون"
// //           >
// //             {isMicMuted ? (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <line x1="1" y1="1" x2="23" y2="23" />
// //                 <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
// //                 <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
// //               </svg>
// //             ) : (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isVideoCall ? "#FFF" : "#000"} strokeWidth="2">
// //                 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //                 <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //               </svg>
// //             )}
// //           </button>

// //           {/* 📹 الكاميرا (للفيديو فقط) */}
// //           {isVideoCall && (
// //             <button
// //               onClick={toggleCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isCameraMuted
// //                   ? "#D72229"
// //                   : "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف الكاميرا"
// //             >
// //               {isCameraMuted ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <line x1="1" y1="1" x2="23" y2="23" />
// //                   <path d="M21 6.5l-4 3V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-1.5l4 3v-13z" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M23 7l-7 5 7 5V7z" />
// //                   <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}

// //           {/* 🔄 تبديل الكاميرا (للفيديو فقط) */}
// //           {isVideoCall && (
// //             <button
// //               onClick={handleSwitchCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تبديل الكاميرا"
// //             >
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <path d="M20 5h-3.17l-1.24-1.35a1 1 0 00-.72-.33H9.13a1 1 0 00-.72.33L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z" />
// //                 <circle cx="12" cy="13" r="3" />
// //                 <path d="M17 10l-2 2M7 16l2-2" />
// //               </svg>
// //             </button>
// //           )}

// //           {/* 🔊 السماعة (للصوتي فقط) */}
// //           {isAudioCall && (
// //             <button
// //               onClick={toggleSpeaker}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف السماعة"
// //             >
// //               {isSpeakerOn ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <line x1="23" y1="9" x2="17" y2="15" />
// //                   <line x1="17" y1="9" x2="23" y2="15" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}
// //         </div>

// //         {/* 🎤 زر الإنهاء */}
// //         <button
// //           onClick={handleEndCall}
// //           style={{
// //             width: "150px",
// //             height: "50px",
// //             borderRadius: "38.5px",
// //             background: "#D72229",
// //             border: "none",
// //             cursor: "pointer",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: "8px",
// //             boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
// //           }}
// //           aria-label="إنهاء المكالمة"
// //         >
// //           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //             <path
// //               d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
// //               transform="rotate(135 12 12)"
// //             />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // src/components/calls/CallScreen.tsx
// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { useZegoCall } from "@/components/ZegoCallProvider";
// // import { CallType } from "./types";

// // interface CallScreenProps {
// //   calleeName: string;
// //   calleeUsername?: string;
// //   calleeAvatar?: string;
// //   callType: CallType;
// //   isGroupCall?: boolean;
// //   groupAvatars?: string[];
// //   groupCount?: number;
// //   onEnd: () => void;
// // }

// // export default function CallScreen({
// //   calleeName,
// //   calleeUsername = "@user",
// //   calleeAvatar = "/imgs/user.png",
// //   callType,
// //   isGroupCall = false,
// //   groupAvatars = [],
// //   groupCount = 0,
// //   onEnd,
// // }: CallScreenProps) {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     switchCamera,
// //     endCall,
// //   } = useZegoCall();

// //   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
// //   const localVideoRef = useRef<HTMLDivElement | null>(null);
// //   const [callDuration, setCallDuration] = useState("00:00");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);

// //   // ================== المؤقت ==================
// //   useEffect(() => {
// //     if (callState !== "connected") return;

// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
// //       const secs = (seconds % 60).toString().padStart(2, "0");
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [callState]);

// //   // ================== عرض الفيديو المحلي ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (callState !== "connected" && callState !== "calling") return;

// //     let isMounted = true;
// //     let timerId: NodeJS.Timeout;
// //     let attempts = 0;
// //     const maxAttempts = 10;

// //     const attachLocal = async () => {
// //       if (!isMounted || !localVideoRef.current) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       const videoView = callEngine.getLocalVideoView();

// //       if (videoView && localVideoRef.current && isMounted) {
// //         localVideoRef.current.innerHTML = "";
// //         localVideoRef.current.appendChild(videoView);
// //         console.log("✅ Local video attached to CallScreen");
// //       } else if (attempts < maxAttempts && isMounted) {
// //         attempts++;
// //         timerId = setTimeout(attachLocal, 500);
// //       }
// //     };

// //     attachLocal();

// //     return () => {
// //       isMounted = false;
// //       if (timerId) clearTimeout(timerId);
// //       if (localVideoRef.current) {
// //         localVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [callState, callType]);

// //   // ================== عرض فيديو الطرف التاني ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (!remoteStreamIds.length) return;

// //     let isMounted = true;
// //     const streamId = remoteStreamIds[0];

// //     const attachRemote = async () => {
// //       if (!remoteVideoRef.current || !isMounted) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (remoteVideoRef.current && isMounted) {
// //         await callEngine.startPlaying(streamId, remoteVideoRef.current);
// //         console.log("✅ Remote video attached to CallScreen");
// //       }
// //     };

// //     attachRemote();

// //     return () => {
// //       isMounted = false;
// //       // تنظيف العرض عند تغيير Stream أو إلغاء المكون
// //       import("@/lib/zego/callEngine").then(({ callEngine }) => {
// //         callEngine.stopPlaying?.(streamId);
// //       });
// //       if (remoteVideoRef.current) {
// //         remoteVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [remoteStreamIds, callType]);

// //   // ================== إنهاء المكالمة ==================
// //   const handleEndCall = () => {
// //     endCall();
// //     onEnd();
// //   };

// //   // ================== تبديل الكاميرا ==================
// //   const handleSwitchCamera = () => {
// //     setIsFrontCamera((prev) => {
// //       const newState = !prev;
// //       switchCamera(newState);
// //       return newState;
// //     });
// //   };

// //   // ================== رسم الشكل ==================
// //   const isVideoCall = callType === "video";
// //   const isAudioCall = callType === "audio";

// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         background: "#000",
// //         zIndex: 999999,
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* ============ الجزء العلوي: الفيديو ============ */}
// //       {isVideoCall ? (
// //         <div className="flex-1 relative">
// //           {/* فيديو الطرف التاني */}
// //           <div
// //             ref={remoteVideoRef}
// //             className="absolute inset-0 bg-black"
// //             style={{ overflow: "hidden" }}
// //           />

// //           {/* فيديوك (صغير في الزاوية) */}
// //           <div
// //             ref={localVideoRef}
// //             className="absolute bottom-4 left-4 rounded-2xl overflow-hidden border-2 border-white/30"
// //             style={{
// //               width: "120px",
// //               height: "180px",
// //               background: "#1a1a1a",
// //               boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
// //             }}
// //           />

// //           {/* اسم الطرف التاني + المدة */}
// //           <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
// //             <div
// //               className="px-4 py-2 rounded-full"
// //               style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
// //             >
// //               <p style={{ fontFamily: "Cairo", fontSize: "14px", color: "#fff", margin: 0 }}>
// //                 {calleeName} • {callDuration}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         /* ============ الجزء العلوي: Avatar (صوتي) ============ */
// //         <div
// //           className="flex-1 flex flex-col items-center justify-center"
// //           style={{ background: "#F1F4F9" }}
// //         >
// //           <p
// //             style={{
// //               fontFamily: "Cairo",
// //               fontSize: "14px",
// //               color: "#7C7D7E",
// //               marginBottom: "30px",
// //             }}
// //           >
// //             مكالمة صوتية • {callDuration}
// //           </p>

// //           {isGroupCall ? (
// //             <>
// //               {/* صور جماعية */}
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   marginBottom: "16px",
// //                 }}
// //               >
// //                 {groupAvatars.slice(0, 4).map((avatar, index) => (
// //                   <div
// //                     key={index}
// //                     style={{
// //                       position: "relative",
// //                       marginRight:
// //                         index !== groupAvatars.slice(0, 4).length - 1
// //                           ? "-22px"
// //                           : "0px",
// //                       zIndex: index + 1,
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         width: "70px",
// //                         height: "70px",
// //                         borderRadius: "50%",
// //                         overflow: "hidden",
// //                         border: "3px solid #F1F4F9",
// //                       }}
// //                     >
// //                       <img
// //                         src={avatar}
// //                         alt="member"
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontSize: "14px",
// //                   color: "#7C7D7E",
// //                 }}
// //               >
// //                 {groupCount} أشخاص في المكالمة
// //               </p>
// //             </>
// //           ) : (
// //             <>
// //               <h3
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontWeight: 600,
// //                   fontSize: "20px",
// //                   color: "#000",
// //                   marginBottom: "6px",
// //                 }}
// //               >
// //                 {calleeName}
// //               </h3>
// //               <p
// //                 style={{
// //                   fontFamily: "Inter",
// //                   fontSize: "13px",
// //                   color: "#000",
// //                   marginBottom: "20px",
// //                 }}
// //               >
// //                 {calleeUsername}
// //               </p>
// //               <div
// //                 style={{
// //                   width: "160px",
// //                   height: "160px",
// //                   borderRadius: "50%",
// //                   overflow: "hidden",
// //                   border: "4px solid #fff",
// //                   boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
// //                 }}
// //               >
// //                 <img
// //                   src={calleeAvatar}
// //                   alt={calleeName}
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     objectFit: "cover",
// //                   }}
// //                 />
// //               </div>
// //             </>
// //           )}

// //           {/* ============ رسالة الحالة ============ */}
// //           {callState === "calling" && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               جاري الاتصال...
// //             </p>
// //           )}
// //           {callState === "connected" && remoteStreamIds.length === 0 && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               في انتظار الطرف التاني...
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* ============ الجزء السفلي: الأزرار ============ */}
// //       <div
// //         style={{
// //           padding: "24px 16px",
// //           background: isVideoCall ? "rgba(0,0,0,0.85)" : "#EAEDF6",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "16px",
// //           alignItems: "center",
// //         }}
// //       >
// //         {/* الأزرار الأساسية */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "20px",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             flexWrap: "wrap",
// //           }}
// //         >
// //           {/* 🎤 المايك */}
// //           <button
// //             onClick={toggleMic}
// //             style={{
// //               width: "55px",
// //               height: "55px",
// //               borderRadius: "50%",
// //               background: isMicMuted
// //                 ? "#D72229"
// //                 : isVideoCall
// //                 ? "rgba(255,255,255,0.2)"
// //                 : "#FFFFFF",
// //               border: "none",
// //               cursor: "pointer",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //             }}
// //             aria-label="كتم الميكروفون"
// //           >
// //             {isMicMuted ? (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <line x1="1" y1="1" x2="23" y2="23" />
// //                 <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
// //                 <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
// //               </svg>
// //             ) : (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isVideoCall ? "#FFF" : "#000"} strokeWidth="2">
// //                 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //                 <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //               </svg>
// //             )}
// //           </button>

// //           {/* 📹 الكاميرا (للفيديو فقط) */}
// //           {isVideoCall && (
// //             <button
// //               onClick={toggleCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isCameraMuted
// //                   ? "#D72229"
// //                   : "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف الكاميرا"
// //             >
// //               {isCameraMuted ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <line x1="1" y1="1" x2="23" y2="23" />
// //                   <path d="M21 6.5l-4 3V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-1.5l4 3v-13z" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M23 7l-7 5 7 5V7z" />
// //                   <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}

// //           {/* 🔄 تبديل الكاميرا (للفيديو فقط) */}
// //           {isVideoCall && (
// //             <button
// //               onClick={handleSwitchCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تبديل الكاميرا"
// //             >
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <path d="M20 5h-3.17l-1.24-1.35a1 1 0 00-.72-.33H9.13a1 1 0 00-.72.33L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z" />
// //                 <circle cx="12" cy="13" r="3" />
// //                 <path d="M17 10l-2 2M7 16l2-2" />
// //               </svg>
// //             </button>
// //           )}

// //           {/* 🔊 السماعة (للصوتي فقط) */}
// //           {isAudioCall && (
// //             <button
// //               onClick={toggleSpeaker}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف السماعة"
// //             >
// //               {isSpeakerOn ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <line x1="23" y1="9" x2="17" y2="15" />
// //                   <line x1="17" y1="9" x2="23" y2="15" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}
// //         </div>

// //         {/* 🎤 زر الإنهاء */}
// //         <button
// //           onClick={handleEndCall}
// //           style={{
// //             width: "150px",
// //             height: "50px",
// //             borderRadius: "38.5px",
// //             background: "#D72229",
// //             border: "none",
// //             cursor: "pointer",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: "8px",
// //             boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
// //           }}
// //           aria-label="إنهاء المكالمة"
// //         >
// //           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //             <path
// //               d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
// //               transform="rotate(135 12 12)"
// //             />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }



// // // ظظظظظظظظظظظظظظظظظ
// // // src/components/calls/CallScreen.tsx
// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { useZegoCall } from "@/components/ZegoCallProvider";
// // import { CallType } from "./types";

// // interface CallScreenProps {
// //   calleeName: string;
// //   calleeUsername?: string;
// //   calleeAvatar?: string;
// //   callType: CallType;
// //   isGroupCall?: boolean;
// //   groupAvatars?: string[];
// //   groupCount?: number;
// //   onEnd: () => void;
// // }

// // export default function CallScreen({
// //   calleeName,
// //   calleeUsername = "@user",
// //   calleeAvatar = "/imgs/user.png",
// //   callType,
// //   isGroupCall = false,
// //   groupAvatars = [],
// //   groupCount = 0,
// //   onEnd,
// // }: CallScreenProps) {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     switchCamera,
// //     endCall,
// //   } = useZegoCall();

// //   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
// //   const localVideoRef = useRef<HTMLDivElement | null>(null);
// //   const [callDuration, setCallDuration] = useState("00:00");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);

// //   // ================== الإغلاق التلقائي عند انتهاء أو رفض المكالمة ==================
// //   useEffect(() => {
// //     if (callState === "ended" || callState === "idle") {
// //       onEnd();
// //     }
// //   }, [callState, onEnd]);

// //   // ================== المؤقت ==================
// //   useEffect(() => {
// //     if (callState !== "connected") return;

// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
// //       const secs = (seconds % 60).toString().padStart(2, "0");
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [callState]);

// //   // ================== عرض الفيديو المحلي ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (callState !== "connected" && callState !== "calling") return;

// //     let isMounted = true;
// //     let timerId: NodeJS.Timeout;
// //     let attempts = 0;
// //     const maxAttempts = 10;

// //     const attachLocal = async () => {
// //       if (!isMounted || !localVideoRef.current) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (localVideoRef.current && isMounted) {
// //         callEngine.attachLocalVideo(localVideoRef.current);
// //         console.log("✅ Local video attached to CallScreen");
// //       } else if (attempts < maxAttempts && isMounted) {
// //         attempts++;
// //         timerId = setTimeout(attachLocal, 500);
// //       }
// //     };

// //     attachLocal();

// //     return () => {
// //       isMounted = false;
// //       if (timerId) clearTimeout(timerId);
// //       if (localVideoRef.current) {
// //         localVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [callState, callType]);

// //   // ================== عرض فيديو الطرف التاني ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (!remoteStreamIds.length) return;

// //     let isMounted = true;
// //     const streamId = remoteStreamIds[0];

// //     const attachRemote = async () => {
// //       if (!remoteVideoRef.current || !isMounted) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (remoteVideoRef.current && isMounted) {
// //         await callEngine.startPlaying(streamId, remoteVideoRef.current);
// //         console.log("✅ Remote video attached to CallScreen");
// //       }
// //     };

// //     attachRemote();

// //     return () => {
// //       isMounted = false;
// //       import("@/lib/zego/callEngine").then(({ callEngine }) => {
// //         callEngine.stopPlaying?.(streamId);
// //       });
// //       if (remoteVideoRef.current) {
// //         remoteVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [remoteStreamIds, callType]);

// //   // ================== إنهاء المكالمة يدوياً ==================
// //   const handleEndCall = () => {
// //     endCall();
// //     onEnd();
// //   };

// //   // ================== تبديل الكاميرا ==================
// //   const handleSwitchCamera = () => {
// //     setIsFrontCamera((prev) => {
// //       const newState = !prev;
// //       switchCamera(newState);
// //       return newState;
// //     });
// //   };

// //   const isVideoCall = callType === "video";
// //   const isAudioCall = callType === "audio";

// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         background: "#000",
// //         zIndex: 999999,
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* ============ الجزء العلوي: الفيديو ============ */}
// //       {isVideoCall ? (
// //         <div className="flex-1 relative" style={{ position: "relative", flex: 1 }}>
// //           <div
// //             ref={remoteVideoRef}
// //             className="absolute inset-0 bg-black"
// //             style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}
// //           />
// //           <div
// //             ref={localVideoRef}
// //             className="absolute bottom-4 left-4 rounded-2xl overflow-hidden border-2 border-white/30"
// //             style={{
// //               position: "absolute",
// //               bottom: "16px",
// //               left: "16px",
// //               width: "120px",
// //               height: "180px",
// //               background: "#1a1a1a",
// //               boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
// //               borderRadius: "16px",
// //               overflow: "hidden",
// //               zIndex: 5,
// //             }}
// //           />
// //           <div
// //             style={{
// //               position: "absolute",
// //               top: "16px",
// //               left: "16px",
// //               right: "16px",
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               zIndex: 5,
// //               pointerEvents: "none",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 padding: "8px 16px",
// //                 borderRadius: "999px",
// //                 background: "rgba(0,0,0,0.5)",
// //                 backdropFilter: "blur(10px)",
// //               }}
// //             >
// //               <p style={{ fontFamily: "Cairo", fontSize: "14px", color: "#fff", margin: 0 }}>
// //                 {calleeName} • {callDuration}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         /* ============ الجزء العلوي: Avatar (صوتي) ============ */
// //         <div
// //           className="flex-1 flex flex-col items-center justify-center"
// //           style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F1F4F9" }}
// //         >
// //           <p
// //             style={{
// //               fontFamily: "Cairo",
// //               fontSize: "14px",
// //               color: "#7C7D7E",
// //               marginBottom: "30px",
// //             }}
// //           >
// //             مكالمة صوتية • {callDuration}
// //           </p>

// //           {isGroupCall ? (
// //             <>
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   marginBottom: "16px",
// //                 }}
// //               >
// //                 {groupAvatars.slice(0, 4).map((avatar, index) => (
// //                   <div
// //                     key={index}
// //                     style={{
// //                       position: "relative",
// //                       marginRight:
// //                         index !== groupAvatars.slice(0, 4).length - 1
// //                           ? "-22px"
// //                           : "0px",
// //                       zIndex: index + 1,
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         width: "70px",
// //                         height: "70px",
// //                         borderRadius: "50%",
// //                         overflow: "hidden",
// //                         border: "3px solid #F1F4F9",
// //                       }}
// //                     >
// //                       <img
// //                         src={avatar}
// //                         alt="member"
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontSize: "14px",
// //                   color: "#7C7D7E",
// //                 }}
// //               >
// //                 {groupCount} أشخاص في المكالمة
// //               </p>
// //             </>
// //           ) : (
// //             <>
// //               <h3
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontWeight: 600,
// //                   fontSize: "20px",
// //                   color: "#000",
// //                   marginBottom: "6px",
// //                 }}
// //               >
// //                 {calleeName}
// //               </h3>
// //               <p
// //                 style={{
// //                   fontFamily: "Inter",
// //                   fontSize: "13px",
// //                   color: "#000",
// //                   marginBottom: "20px",
// //                 }}
// //               >
// //                 {calleeUsername}
// //               </p>
// //               <div
// //                 style={{
// //                   width: "160px",
// //                   height: "160px",
// //                   borderRadius: "50%",
// //                   overflow: "hidden",
// //                   border: "4px solid #fff",
// //                   boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
// //                 }}
// //               >
// //                 <img
// //                   src={calleeAvatar}
// //                   alt={calleeName}
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     objectFit: "cover",
// //                   }}
// //                 />
// //               </div>
// //             </>
// //           )}

// //           {callState === "calling" && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               جاري الاتصال...
// //             </p>
// //           )}
// //           {callState === "connected" && remoteStreamIds.length === 0 && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               في انتظار الطرف التاني...
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* ============ الجزء السفلي: الأزرار ============ */}
// //       <div
// //         style={{
// //           padding: "24px 16px",
// //           background: isVideoCall ? "rgba(0,0,0,0.85)" : "#EAEDF6",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "16px",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "20px",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             flexWrap: "wrap",
// //           }}
// //         >
// //           {/* المايك */}
// //           <button
// //             onClick={toggleMic}
// //             style={{
// //               width: "55px",
// //               height: "55px",
// //               borderRadius: "50%",
// //               background: isMicMuted
// //                 ? "#D72229"
// //                 : isVideoCall
// //                 ? "rgba(255,255,255,0.2)"
// //                 : "#FFFFFF",
// //               border: "none",
// //               cursor: "pointer",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //             }}
// //             aria-label="كتم الميكروفون"
// //           >
// //             {isMicMuted ? (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <line x1="1" y1="1" x2="23" y2="23" />
// //                 <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
// //                 <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
// //               </svg>
// //             ) : (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isVideoCall ? "#FFF" : "#000"} strokeWidth="2">
// //                 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //                 <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //               </svg>
// //             )}
// //           </button>

// //           {/* الكاميرا */}
// //           {isVideoCall && (
// //             <button
// //               onClick={toggleCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isCameraMuted
// //                   ? "#D72229"
// //                   : "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف الكاميرا"
// //             >
// //               {isCameraMuted ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <line x1="1" y1="1" x2="23" y2="23" />
// //                   <path d="M21 6.5l-4 3V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-1.5l4 3v-13z" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M23 7l-7 5 7 5V7z" />
// //                   <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}

// //           {/* تبديل الكاميرا */}
// //           {isVideoCall && (
// //             <button
// //               onClick={handleSwitchCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تبديل الكاميرا"
// //             >
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <path d="M20 5h-3.17l-1.24-1.35a1 1 0 00-.72-.33H9.13a1 1 0 00-.72.33L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z" />
// //                 <circle cx="12" cy="13" r="3" />
// //                 <path d="M17 10l-2 2M7 16l2-2" />
// //               </svg>
// //             </button>
// //           )}

// //           {/* السماعة */}
// //           {isAudioCall && (
// //             <button
// //               onClick={toggleSpeaker}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف السماعة"
// //             >
// //               {isSpeakerOn ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <line x1="23" y1="9" x2="17" y2="15" />
// //                   <line x1="17" y1="9" x2="23" y2="15" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}
// //         </div>

// //         {/* زر الإنهاء */}
// //         <button
// //           onClick={handleEndCall}
// //           style={{
// //             width: "150px",
// //             height: "50px",
// //             borderRadius: "38.5px",
// //             background: "#D72229",
// //             border: "none",
// //             cursor: "pointer",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: "8px",
// //             boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
// //           }}
// //           aria-label="إنهاء المكالمة"
// //         >
// //           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //             <path
// //               d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
// //               transform="rotate(135 12 12)"
// //             />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }




// // // src/components/calls/CallScreen.tsx
// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { useZegoCall } from "@/components/ZegoCallProvider";
// // import { CallType } from "./types";

// // interface CallScreenProps {
// //   calleeName: string;
// //   calleeUsername?: string;
// //   calleeAvatar?: string;
// //   callType: CallType;
// //   isGroupCall?: boolean;
// //   groupAvatars?: string[];
// //   groupCount?: number;
// //   onEnd: () => void;
// // }

// // export default function CallScreen({
// //   calleeName,
// //   calleeUsername = "@user",
// //   calleeAvatar = "/imgs/user.png",
// //   callType,
// //   isGroupCall = false,
// //   groupAvatars = [],
// //   groupCount = 0,
// //   onEnd,
// // }: CallScreenProps) {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     switchCamera,
// //     endCall,
// //   } = useZegoCall();

// //   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
// //   const localVideoRef = useRef<HTMLDivElement | null>(null);
// //   const [callDuration, setCallDuration] = useState("00:00");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);

// //   // ================== الإغلاق التلقائي عند انتهاء أو رفض المكالمة ==================
// //   useEffect(() => {
// //     if (callState === "ended" || callState === "idle") {
// //       console.log("📴 CallScreen: callState ended/idle, closing");
// //       onEnd();
// //     }
// //   }, [callState, onEnd]);

// //   // ================== 🔴 الاستماع لإشارة الإغلاق القسري ==================
// //   useEffect(() => {
// //     const handleForceClose = () => {
// //       console.log("🛑 CallScreen: Force close event received, closing...");
// //       onEnd();
// //     };

// //     if (typeof window !== "undefined") {
// //       window.addEventListener("zego:force_close_call_modal", handleForceClose);
// //     }

// //     return () => {
// //       if (typeof window !== "undefined") {
// //         window.removeEventListener("zego:force_close_call_modal", handleForceClose);
// //       }
// //     };
// //   }, [onEnd]);

// //   // ================== المؤقت ==================
// //   useEffect(() => {
// //     if (callState !== "connected") return;

// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
// //       const secs = (seconds % 60).toString().padStart(2, "0");
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [callState]);

// //   // ================== عرض الفيديو المحلي ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (callState !== "connected" && callState !== "calling") return;

// //     let isMounted = true;
// //     let timerId: NodeJS.Timeout;
// //     let attempts = 0;
// //     const maxAttempts = 10;

// //     const attachLocal = async () => {
// //       if (!isMounted || !localVideoRef.current) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (localVideoRef.current && isMounted) {
// //         callEngine.attachLocalVideo(localVideoRef.current);
// //         console.log("✅ Local video attached to CallScreen");
// //       } else if (attempts < maxAttempts && isMounted) {
// //         attempts++;
// //         timerId = setTimeout(attachLocal, 500);
// //       }
// //     };

// //     attachLocal();

// //     return () => {
// //       isMounted = false;
// //       if (timerId) clearTimeout(timerId);
// //       if (localVideoRef.current) {
// //         localVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [callState, callType]);

// //   // ================== عرض فيديو الطرف التاني ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (!remoteStreamIds.length) return;

// //     let isMounted = true;
// //     const streamId = remoteStreamIds[0];

// //     const attachRemote = async () => {
// //       if (!remoteVideoRef.current || !isMounted) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (remoteVideoRef.current && isMounted) {
// //         await callEngine.startPlaying(streamId, remoteVideoRef.current);
// //         console.log("✅ Remote video attached to CallScreen");
// //       }
// //     };

// //     attachRemote();

// //     return () => {
// //       isMounted = false;
// //       import("@/lib/zego/callEngine").then(({ callEngine }) => {
// //         callEngine.stopPlaying?.(streamId);
// //       });
// //       if (remoteVideoRef.current) {
// //         remoteVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [remoteStreamIds, callType]);

// //   // ================== إنهاء المكالمة يدوياً ==================
// //   const handleEndCall = () => {
// //     console.log("📴 CallScreen: Manual end call");
// //     endCall();
// //     onEnd();
// //   };

// //   // ================== تبديل الكاميرا ==================
// //   const handleSwitchCamera = () => {
// //     setIsFrontCamera((prev) => {
// //       const newState = !prev;
// //       switchCamera(newState);
// //       return newState;
// //     });
// //   };

// //   const isVideoCall = callType === "video";
// //   const isAudioCall = callType === "audio";

// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         background: "#000",
// //         zIndex: 999999,
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* ============ الجزء العلوي: الفيديو ============ */}
// //       {isVideoCall ? (
// //         <div className="flex-1 relative" style={{ position: "relative", flex: 1 }}>
// //           <div
// //             ref={remoteVideoRef}
// //             className="absolute inset-0 bg-black"
// //             style={{
// //               position: "absolute",
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               bottom: 0,
// //               overflow: "hidden",
// //             }}
// //           />
// //           <div
// //             ref={localVideoRef}
// //             className="absolute bottom-4 left-4 rounded-2xl overflow-hidden border-2 border-white/30"
// //             style={{
// //               position: "absolute",
// //               bottom: "16px",
// //               left: "16px",
// //               width: "120px",
// //               height: "180px",
// //               background: "#1a1a1a",
// //               boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
// //               borderRadius: "16px",
// //               overflow: "hidden",
// //               zIndex: 5,
// //             }}
// //           />
// //           <div
// //             style={{
// //               position: "absolute",
// //               top: "16px",
// //               left: "16px",
// //               right: "16px",
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               zIndex: 5,
// //               pointerEvents: "none",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 padding: "8px 16px",
// //                 borderRadius: "999px",
// //                 background: "rgba(0,0,0,0.5)",
// //                 backdropFilter: "blur(10px)",
// //               }}
// //             >
// //               <p style={{ fontFamily: "Cairo", fontSize: "14px", color: "#fff", margin: 0 }}>
// //                 {calleeName} • {callDuration}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         /* ============ الجزء العلوي: Avatar (صوتي) ============ */
// //         <div
// //           className="flex-1 flex flex-col items-center justify-center"
// //           style={{
// //             flex: 1,
// //             display: "flex",
// //             flexDirection: "column",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             background: "#F1F4F9",
// //           }}
// //         >
// //           <p
// //             style={{
// //               fontFamily: "Cairo",
// //               fontSize: "14px",
// //               color: "#7C7D7E",
// //               marginBottom: "30px",
// //             }}
// //           >
// //             مكالمة صوتية • {callDuration}
// //           </p>

// //           {isGroupCall ? (
// //             <>
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   marginBottom: "16px",
// //                 }}
// //               >
// //                 {groupAvatars.slice(0, 4).map((avatar, index) => (
// //                   <div
// //                     key={index}
// //                     style={{
// //                       position: "relative",
// //                       marginRight:
// //                         index !== groupAvatars.slice(0, 4).length - 1
// //                           ? "-22px"
// //                           : "0px",
// //                       zIndex: index + 1,
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         width: "70px",
// //                         height: "70px",
// //                         borderRadius: "50%",
// //                         overflow: "hidden",
// //                         border: "3px solid #F1F4F9",
// //                       }}
// //                     >
// //                       <img
// //                         src={avatar}
// //                         alt="member"
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               <p
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontSize: "14px",
// //                   color: "#7C7D7E",
// //                 }}
// //               >
// //                 {groupCount} أشخاص في المكالمة
// //               </p>
// //             </>
// //           ) : (
// //             <>
// //               <h3
// //                 style={{
// //                   fontFamily: "Cairo",
// //                   fontWeight: 600,
// //                   fontSize: "20px",
// //                   color: "#000",
// //                   marginBottom: "6px",
// //                 }}
// //               >
// //                 {calleeName}
// //               </h3>
// //               <p
// //                 style={{
// //                   fontFamily: "Inter",
// //                   fontSize: "13px",
// //                   color: "#000",
// //                   marginBottom: "20px",
// //                 }}
// //               >
// //                 {calleeUsername}
// //               </p>
// //               <div
// //                 style={{
// //                   width: "160px",
// //                   height: "160px",
// //                   borderRadius: "50%",
// //                   overflow: "hidden",
// //                   border: "4px solid #fff",
// //                   boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
// //                 }}
// //               >
// //                 <img
// //                   src={calleeAvatar}
// //                   alt={calleeName}
// //                   style={{
// //                     width: "100%",
// //                     height: "100%",
// //                     objectFit: "cover",
// //                   }}
// //                 />
// //               </div>
// //             </>
// //           )}

// //           {callState === "calling" && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               جاري الاتصال...
// //             </p>
// //           )}
// //           {callState === "connected" && remoteStreamIds.length === 0 && (
// //             <p
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontSize: "14px",
// //                 color: "#7C7D7E",
// //                 marginTop: "30px",
// //               }}
// //             >
// //               في انتظار الطرف التاني...
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* ============ الجزء السفلي: الأزرار ============ */}
// //       <div
// //         style={{
// //           padding: "24px 16px",
// //           background: isVideoCall ? "rgba(0,0,0,0.85)" : "#EAEDF6",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "16px",
// //           alignItems: "center",
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "20px",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             flexWrap: "wrap",
// //           }}
// //         >
// //           {/* المايك */}
// //           <button
// //             onClick={toggleMic}
// //             style={{
// //               width: "55px",
// //               height: "55px",
// //               borderRadius: "50%",
// //               background: isMicMuted
// //                 ? "#D72229"
// //                 : isVideoCall
// //                 ? "rgba(255,255,255,0.2)"
// //                 : "#FFFFFF",
// //               border: "none",
// //               cursor: "pointer",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //             }}
// //             aria-label="كتم الميكروفون"
// //           >
// //             {isMicMuted ? (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <line x1="1" y1="1" x2="23" y2="23" />
// //                 <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
// //                 <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
// //               </svg>
// //             ) : (
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isVideoCall ? "#FFF" : "#000"} strokeWidth="2">
// //                 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //                 <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //               </svg>
// //             )}
// //           </button>

// //           {/* الكاميرا */}
// //           {isVideoCall && (
// //             <button
// //               onClick={toggleCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isCameraMuted
// //                   ? "#D72229"
// //                   : "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف الكاميرا"
// //             >
// //               {isCameraMuted ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <line x1="1" y1="1" x2="23" y2="23" />
// //                   <path d="M21 6.5l-4 3V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-1.5l4 3v-13z" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M23 7l-7 5 7 5V7z" />
// //                   <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}

// //           {/* تبديل الكاميرا */}
// //           {isVideoCall && (
// //             <button
// //               onClick={handleSwitchCamera}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: "rgba(255,255,255,0.2)",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تبديل الكاميرا"
// //             >
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                 <path d="M20 5h-3.17l-1.24-1.35a1 1 0 00-.72-.33H9.13a1 1 0 00-.72.33L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z" />
// //                 <circle cx="12" cy="13" r="3" />
// //                 <path d="M17 10l-2 2M7 16l2-2" />
// //               </svg>
// //             </button>
// //           )}

// //           {/* السماعة */}
// //           {isAudioCall && (
// //             <button
// //               onClick={toggleSpeaker}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف السماعة"
// //             >
// //               {isSpeakerOn ? (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //                 </svg>
// //               ) : (
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <line x1="23" y1="9" x2="17" y2="15" />
// //                   <line x1="17" y1="9" x2="23" y2="15" />
// //                 </svg>
// //               )}
// //             </button>
// //           )}
// //         </div>

// //         {/* زر الإنهاء */}
// //         <button
// //           onClick={handleEndCall}
// //           style={{
// //             width: "150px",
// //             height: "50px",
// //             borderRadius: "38.5px",
// //             background: "#D72229",
// //             border: "none",
// //             cursor: "pointer",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: "8px",
// //             boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
// //           }}
// //           aria-label="إنهاء المكالمة"
// //         >
// //           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2">
// //             <path
// //               d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
// //               transform="rotate(135 12 12)"
// //             />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }



// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // ////////////////////////////////////////
// // // src/components/calls/CallScreen.tsx
// // "use client";

// // import React, { useEffect, useRef, useState } from "react";
// // import { useZegoCall } from "@/components/ZegoCallProvider";
// // import { CallType } from "./types";

// // interface CallScreenProps {
// //   calleeName: string;
// //   calleeUsername?: string;
// //   calleeAvatar?: string;
// //   callType: CallType;
// //   isGroupCall?: boolean;
// //   groupAvatars?: string[];
// //   groupCount?: number;
// //   onEnd: () => void;
// // }

// // export default function CallScreen({
// //   calleeName,
// //   calleeUsername = "@user",
// //   calleeAvatar = "/imgs/user.png",
// //   callType,
// //   isGroupCall = false,
// //   groupAvatars = [],
// //   groupCount = 0,
// //   onEnd,
// // }: CallScreenProps) {
// //   const {
// //     callState,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     switchCamera,
// //     endCall,
// //   } = useZegoCall();

// //   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
// //   const localVideoRef = useRef<HTMLDivElement | null>(null);
// //   const [callDuration, setCallDuration] = useState("00:00");
// //   const [isFrontCamera, setIsFrontCamera] = useState(true);

// //   // ================== الإغلاق التلقائي ==================
// //   useEffect(() => {
// //     if (callState?.status === "idle") {
// //       console.log("📴 CallScreen: callState idle, closing");
// //       onEnd();
// //     }
// //   }, [callState?.status, onEnd]);

// //   // ================== الاستماع للإغلاق القسري ==================
// //   useEffect(() => {
// //     const handleForceClose = () => {
// //       console.log("🛑 CallScreen: Force close event received");
// //       onEnd();
// //     };

// //     if (typeof window !== "undefined") {
// //       window.addEventListener("zego:force_close_call_modal", handleForceClose);
// //     }

// //     return () => {
// //       if (typeof window !== "undefined") {
// //         window.removeEventListener("zego:force_close_call_modal", handleForceClose);
// //       }
// //     };
// //   }, [onEnd]);

// //   // ================== المؤقت ==================
// //   useEffect(() => {
// //     if (callState?.status !== "connected") return;

// //     let seconds = 0;
// //     const interval = setInterval(() => {
// //       seconds++;
// //       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
// //       const secs = (seconds % 60).toString().padStart(2, "0");
// //       setCallDuration(`${mins}:${secs}`);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [callState?.status]);

// //   // ================== عرض الفيديو المحلي ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (callState?.status !== "connected" && callState?.status !== "calling") return;

// //     let isMounted = true;
// //     let timerId: NodeJS.Timeout;
// //     let attempts = 0;
// //     const maxAttempts = 10;

// //     const attachLocal = async () => {
// //       if (!isMounted || !localVideoRef.current) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (localVideoRef.current && isMounted) {
// //         callEngine.attachLocalVideo(localVideoRef.current);
// //         console.log("✅ Local video attached to CallScreen");
// //       } else if (attempts < maxAttempts && isMounted) {
// //         attempts++;
// //         timerId = setTimeout(attachLocal, 500);
// //       }
// //     };

// //     attachLocal();

// //     return () => {
// //       isMounted = false;
// //       if (timerId) clearTimeout(timerId);
// //       if (localVideoRef.current) {
// //         localVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [callState?.status, callType]);

// //   // ================== عرض فيديو الطرف التاني ==================
// //   useEffect(() => {
// //     if (callType !== "video") return;
// //     if (!remoteStreamIds.length) return;

// //     let isMounted = true;
// //     const streamId = remoteStreamIds[0];

// //     const attachRemote = async () => {
// //       if (!remoteVideoRef.current || !isMounted) return;

// //       const { callEngine } = await import("@/lib/zego/callEngine");
// //       if (remoteVideoRef.current && isMounted) {
// //         await callEngine.startPlaying(streamId, remoteVideoRef.current);
// //         console.log("✅ Remote video attached to CallScreen");
// //       }
// //     };

// //     attachRemote();

// //     return () => {
// //       isMounted = false;
// //       import("@/lib/zego/callEngine").then(({ callEngine }) => {
// //         callEngine.stopPlaying?.(streamId);
// //       });
// //       if (remoteVideoRef.current) {
// //         remoteVideoRef.current.innerHTML = "";
// //       }
// //     };
// //   }, [remoteStreamIds, callType]);

// //   // ================== إنهاء المكالمة ==================
// //   const handleEndCall = () => {
// //     console.log("📴 CallScreen: Manual end call");
// //     endCall();
// //     onEnd();
// //   };

// //   // ================== تبديل الكاميرا ==================
// //   const handleSwitchCamera = () => {
// //     setIsFrontCamera((prev) => {
// //       const newState = !prev;
// //       switchCamera(newState);
// //       return newState;
// //     });
// //   };

// //   // ================== إضافة أشخاص ==================
// //   const handleAddPerson = () => {
// //     console.log("➕ CallScreen: Add person clicked");
// //     // TODO: افتح modal لإضافة شخص للمكالمة
// //     alert("إضافة أشخاص للمكالمة (قريبًا)");
// //   };

// //   const isVideoCall = callType === "video";
// //   const isAudioCall = callType === "audio";

// //   // ================== Render ==================
// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         background: "rgba(0, 0, 0, 0.5)",
// //         backdropFilter: "blur(8px)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         zIndex: 999999,
// //         padding: "20px",
// //       }}
// //     >
// //       {/* ===== الكارت ===== */}
// //       <div
// //         style={{
// //           width: "100%",
// //           maxWidth: "357px",
// //           borderRadius: "35px",
// //           background: "#F1F4F9",
// //           paddingTop: "20px",
// //           paddingBottom: "0px",
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           position: "relative",
// //           overflow: "hidden",
// //           boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
// //         }}
// //       >
// //         {/* ===== زر الإغلاق العلوي ===== */}
// //         <button
// //           onClick={handleEndCall}
// //           aria-label="إغلاق"
// //           style={{
// //             position: "absolute",
// //             top: "12px",
// //             left: "12px",
// //             zIndex: 10,
// //             background: "transparent",
// //             border: "none",
// //             cursor: "pointer",
// //             padding: "4px",
// //             color: "#7C7D7E",
// //             transition: "color 0.2s",
// //           }}
// //         >
// //           <svg
// //             width="20"
// //             height="20"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //             stroke="currentColor"
// //             strokeWidth={2}
// //           >
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //           </svg>
// //         </button>

// //         {/* ===== نص الحالة ===== */}
// //         <p
// //           style={{
// //             fontFamily: "Cairo",
// //             fontWeight: 600,
// //             fontSize: "13px",
// //             lineHeight: "100%",
// //             textAlign: "center",
// //             color: "#7C7D7E",
// //             marginBottom: "30px",
// //             marginTop: "10px",
// //             padding: "0 16px",
// //           }}
// //         >
// //           {callState?.status === "connected"
// //             ? `مكالمة جارية • ${callDuration}`
// //             : callState?.status === "calling"
// //             ? "جاري الاتصال..."
// //             : "مكالمة صوتية"}
// //         </p>

// //         {/* ===== الفيديو (لو فيديو) ===== */}
// //         {isVideoCall && callState?.status === "connected" ? (
// //           <div
// //             style={{
// //               position: "relative",
// //               width: "100%",
// //               height: "300px",
// //               marginBottom: "20px",
// //               padding: "0 16px",
// //             }}
// //           >
// //             {/* فيديو الطرف التاني */}
// //             <div
// //               ref={remoteVideoRef}
// //               style={{
// //                 width: "100%",
// //                 height: "100%",
// //                 borderRadius: "20px",
// //                 overflow: "hidden",
// //                 background: "#000",
// //               }}
// //             />
// //             {/* فيديو محلي */}
// //             <div
// //               ref={localVideoRef}
// //               style={{
// //                 position: "absolute",
// //                 bottom: "12px",
// //                 left: "28px",
// //                 width: "90px",
// //                 height: "130px",
// //                 borderRadius: "12px",
// //                 overflow: "hidden",
// //                 background: "#1a1a1a",
// //                 border: "2px solid #fff",
// //                 boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
// //                 zIndex: 5,
// //               }}
// //             />
// //           </div>
// //         ) : (
// //           /* ===== Avatar (صوتي) ===== */
// //           <>
// //             <h3
// //               style={{
// //                 fontFamily: "Cairo",
// //                 fontWeight: 600,
// //                 fontSize: "20px",
// //                 lineHeight: "100%",
// //                 textAlign: "center",
// //                 color: "#000000",
// //                 marginBottom: "6px",
// //                 padding: "0 16px",
// //               }}
// //             >
// //               {calleeName}
// //             </h3>
// //             <p
// //               style={{
// //                 fontFamily: "Inter",
// //                 fontWeight: 400,
// //                 fontSize: "13px",
// //                 lineHeight: "100%",
// //                 textAlign: "center",
// //                 color: "#000000",
// //                 width: "100%",
// //                 marginBottom: "12px",
// //                 padding: "0 16px",
// //               }}
// //             >
// //               {calleeUsername}
// //             </p>

// //             {isGroupCall ? (
// //               <>
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     justifyContent: "center",
// //                     flexDirection: "row",
// //                     direction: "ltr",
// //                     marginBottom: "16px",
// //                     padding: "0 16px",
// //                   }}
// //                 >
// //                   {groupAvatars.slice(0, 4).map((avatar, index) => (
// //                     <div
// //                       key={index}
// //                       style={{
// //                         position: "relative",
// //                         marginRight:
// //                           index !== groupAvatars.slice(0, 4).length - 1 ? "-22px" : "0px",
// //                         zIndex: index + 1,
// //                       }}
// //                     >
// //                       <div
// //                         style={{
// //                           width: "70px",
// //                           height: "70px",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                         }}
// //                       >
// //                         <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: "block" }}>
// //                           <defs>
// //                             <clipPath id={`wavyActive-${index}`}>
// //                               <path d={generateWavyCirclePath(80, 80, 67, 14, 3)} />
// //                             </clipPath>
// //                           </defs>
// //                           <image
// //                             href={avatar}
// //                             x="0"
// //                             y="0"
// //                             width="160"
// //                             height="160"
// //                             preserveAspectRatio="xMidYMid slice"
// //                             clipPath={`url(#wavyActive-${index})`}
// //                             style={{ filter: "blur(5px)" }}
// //                           />
// //                           <path
// //                             d={generateWavyCirclePath(80, 80, 67, 14, 3)}
// //                             fill="none"
// //                             stroke="transparent"
// //                             strokeWidth="6"
// //                           />
// //                         </svg>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <p
// //                   style={{
// //                     fontFamily: "Cairo",
// //                     fontWeight: 600,
// //                     fontSize: "14px",
// //                     textAlign: "center",
// //                     color: "#7C7D7E",
// //                     marginBottom: "10px",
// //                     marginTop: "15px",
// //                   }}
// //                 >
// //                   {groupCount} أشخاص في هذه المكالمة
// //                 </p>
// //               </>
// //             ) : (
// //               /* ===== Avatar واحد ===== */
// //               <div
// //                 style={{
// //                   position: "relative",
// //                   width: "160px",
// //                   height: "160px",
// //                   marginBottom: "20px",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: "block" }}>
// //                   <defs>
// //                     <clipPath id="wavyAvatarActive">
// //                       <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
// //                     </clipPath>
// //                   </defs>
// //                   <image
// //                     href={calleeAvatar}
// //                     x="0"
// //                     y="0"
// //                     width="160"
// //                     height="160"
// //                     preserveAspectRatio="xMidYMid slice"
// //                     clipPath="url(#wavyAvatarActive)"
// //                   />
// //                   <path
// //                     d={generateWavyCirclePath(80, 80, 70, 14, 3)}
// //                     fill="none"
// //                     stroke="transparent"
// //                     strokeWidth="1.5"
// //                   />
// //                 </svg>
// //               </div>
// //             )}
// //           </>
// //         )}

// //         {/* ===== أزرار التحكم ===== */}
// //         <div
// //           style={{
// //             width: "100%",
// //             borderBottomLeftRadius: "35px",
// //             borderBottomRightRadius: "35px",
// //             background: "#EAEDF6",
// //             display: "flex",
// //             flexDirection: "column",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: "14px",
// //             padding: "20px 16px",
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "flex",
// //               gap: "20px",
// //               width: "100%",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             {/* المايك */}
// //             <button
// //               onClick={toggleMic}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isMicMuted ? "#D72229" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="كتم الميكروفون"
// //             >
// //               {isMicMuted ? (
// //                 <svg
// //                   width="24"
// //                   height="24"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="#FFFFFF"
// //                   strokeWidth="2"
// //                 >
// //                   <line x1="1" y1="1" x2="23" y2="23" />
// //                   <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
// //                   <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
// //                 </svg>
// //               ) : (
// //                 <svg
// //                   width="24"
// //                   height="24"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="#000000"
// //                   strokeWidth="2"
// //                 >
// //                   <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
// //                   <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
// //                 </svg>
// //               )}
// //             </button>

// //             {/* السماعة */}
// //             <button
// //               onClick={toggleSpeaker}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="تشغيل/إيقاف السماعة"
// //             >
// //               {isSpeakerOn ? (
// //                 <svg
// //                   width="24"
// //                   height="24"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="#FFFFFF"
// //                   strokeWidth="2"
// //                 >
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
// //                 </svg>
// //               ) : (
// //                 <svg
// //                   width="24"
// //                   height="24"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="#000000"
// //                   strokeWidth="2"
// //                 >
// //                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
// //                   <line x1="23" y1="9" x2="17" y2="15" />
// //                   <line x1="17" y1="9" x2="23" y2="15" />
// //                 </svg>
// //               )}
// //             </button>

// //             {/* إضافة شخص */}
// //             <button
// //               onClick={handleAddPerson}
// //               style={{
// //                 width: "55px",
// //                 height: "55px",
// //                 borderRadius: "50%",
// //                 background: "#FFFFFF",
// //                 border: "none",
// //                 cursor: "pointer",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //               }}
// //               aria-label="إضافة شخص"
// //             >
// //               <svg
// //                 width="24"
// //                 height="24"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="#000000"
// //                 strokeWidth="2"
// //               >
// //                 <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
// //                 <circle cx="8.5" cy="7" r="4" />
// //                 <line x1="20" y1="8" x2="20" y2="14" />
// //                 <line x1="23" y1="11" x2="17" y2="11" />
// //               </svg>
// //             </button>
// //           </div>

// //           {/* ===== زر الإنهاء ===== */}
// //           <button
// //             onClick={handleEndCall}
// //             style={{
// //               width: "150px",
// //               height: "50px",
// //               borderRadius: "38.5px",
// //               background: "#D72229",
// //               border: "none",
// //               cursor: "pointer",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "8px",
// //               boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
// //               transition: "transform 0.2s, box-shadow 0.2s",
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = "scale(1.03)";
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = "scale(1)";
// //             }}
// //             aria-label="إنهاء المكالمة"
// //           >
// //             <img
// //               src="/imgs/call.svg"
// //               alt="إنهاء الاتصال"
// //               style={{
// //                 width: "24px",
// //                 height: "24px",
// //                 filter: "brightness(0) invert(1)",
// //                 transform: "rotate(135deg)",
// //               }}
// //             />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ================== Helper ==================
// // function generateWavyCirclePath(
// //   cx: number,
// //   cy: number,
// //   radius: number,
// //   waveCount: number,
// //   amplitude: number
// // ): string {
// //   const steps = waveCount * 12;
// //   const step = (Math.PI * 2) / steps;
// //   let path = "";

// //   for (let i = 0; i <= steps; i++) {
// //     const angle = i * step - Math.PI / 2;
// //     const r = radius + amplitude * Math.sin(waveCount * angle);
// //     const x = cx + r * Math.cos(angle);
// //     const y = cy + r * Math.sin(angle);

// //     if (i === 0) {
// //       path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
// //     } else {
// //       path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
// //     }
// //   }

// //   return path + " Z";
// // }


// // ظظظظظظظظظظظظظظظظظظظظظظظظ
// // src/components/calls/CallScreen.tsx
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useZegoCall } from "@/components/ZegoCallProvider";
// import { CallType } from "./types";
// import AddPersonModal from "./AddPersonModal";

// interface CallScreenProps {
//   calleeName: string;
//   calleeUsername?: string;
//   calleeAvatar?: string;
//   callType: CallType;
//   isGroupCall?: boolean;
//   groupAvatars?: string[];
//   groupCount?: number;
//   onEnd: () => void;
// }

// export default function CallScreen({
//   calleeName,
//   calleeUsername = "@user",
//   calleeAvatar = "/imgs/user.png",
//   callType,
//   isGroupCall = false,
//   groupAvatars = [],
//   groupCount = 0,
//   onEnd,
// }: CallScreenProps) {
//   const {
//     callState,
//     isMicMuted,
//     isCameraMuted,
//     isSpeakerOn,
//     remoteStreamIds,
//     autoplayBlocked, // ✅ جديد
//     resumeAudio, // ✅ جديد
//     toggleMic,
//     toggleCamera,
//     toggleSpeaker,
//     switchCamera,
//     endCall,
//   } = useZegoCall();

//   const remoteVideoRef = useRef<HTMLDivElement | null>(null);
//   const localVideoRef = useRef<HTMLDivElement | null>(null);
//   const [callDuration, setCallDuration] = useState("00:00");
//   const [isFrontCamera, setIsFrontCamera] = useState(true);

//   // ================== الإغلاق التلقائي ==================
//   useEffect(() => {
//     if (callState?.status === "idle") {
//       console.log("📴 CallScreen: callState idle, closing");
//       onEnd();
//     }
//   }, [callState?.status, onEnd]);

//   // ================== الاستماع للإغلاق القسري ==================
//   useEffect(() => {
//     const handleForceClose = () => {
//       console.log("🛑 CallScreen: Force close event received");
//       onEnd();
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("zego:force_close_call_modal", handleForceClose);
//     }

//     return () => {
//       if (typeof window !== "undefined") {
//         window.removeEventListener("zego:force_close_call_modal", handleForceClose);
//       }
//     };
//   }, [onEnd]);

//   // ================== المؤقت ==================
//   useEffect(() => {
//     if (callState?.status !== "connected") return;

//     let seconds = 0;
//     const interval = setInterval(() => {
//       seconds++;
//       const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
//       const secs = (seconds % 60).toString().padStart(2, "0");
//       setCallDuration(`${mins}:${secs}`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [callState?.status]);

//   // ================== عرض الفيديو المحلي ==================
//   useEffect(() => {
//     if (callType !== "video") return;
//     if (callState?.status !== "connected" && callState?.status !== "calling") return;

//     let isMounted = true;
//     let timerId: NodeJS.Timeout;
//     let attempts = 0;
//     const maxAttempts = 10;

//     const attachLocal = async () => {
//       if (!isMounted || !localVideoRef.current) return;

//       const { callEngine } = await import("@/lib/zego/callEngine");
//       if (localVideoRef.current && isMounted) {
//         callEngine.attachLocalVideo(localVideoRef.current);
//         console.log("✅ Local video attached to CallScreen");
//       } else if (attempts < maxAttempts && isMounted) {
//         attempts++;
//         timerId = setTimeout(attachLocal, 500);
//       }
//     };

//     attachLocal();

//     return () => {
//       isMounted = false;
//       if (timerId) clearTimeout(timerId);
//       if (localVideoRef.current) {
//         localVideoRef.current.innerHTML = "";
//       }
//     };
//   }, [callState?.status, callType]);

//   // ================== عرض فيديو الطرف التاني ==================
//   useEffect(() => {
//     if (callType !== "video") return;
//     if (!remoteStreamIds.length) return;

//     let isMounted = true;
//     const streamId = remoteStreamIds[0];

//     const attachRemote = async () => {
//       if (!remoteVideoRef.current || !isMounted) return;

//       const { callEngine } = await import("@/lib/zego/callEngine");
//       if (remoteVideoRef.current && isMounted) {
//         await callEngine.startPlaying(streamId, remoteVideoRef.current);
//         console.log("✅ Remote video attached to CallScreen");
//       }
//     };

//     attachRemote();

//     return () => {
//       isMounted = false;
//       import("@/lib/zego/callEngine").then(({ callEngine }) => {
//         callEngine.stopPlaying?.(streamId);
//       });
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.innerHTML = "";
//       }
//     };
//   }, [remoteStreamIds, callType]);

//   // ================== إنهاء المكالمة ==================
//   const handleEndCall = () => {
//     console.log("📴 CallScreen: Manual end call");
//     endCall();
//     onEnd();
//   };

//   // ================== تبديل الكاميرا ==================
//   const handleSwitchCamera = () => {
//     setIsFrontCamera((prev) => {
//       const newState = !prev;
//       switchCamera(newState);
//       return newState;
//     });
//   };

//   // ================== إضافة أشخاص ==================
//   const handleAddPerson = () => {
//     console.log("➕ CallScreen: Add person clicked");
//     // TODO: افتح modal لإضافة شخص للمكالمة
//     alert("إضافة أشخاص للمكالمة (قريبًا)");
//   };

//   const isVideoCall = callType === "video";
//   const isAudioCall = callType === "audio";

//   // ================== Render ==================
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: "rgba(0, 0, 0, 0.5)",
//         backdropFilter: "blur(8px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 999999,
//         padding: "20px",
//       }}
//     >
//       {/* ✅ زر استئناف الصوت بعد حظر المتصفح */}
//       {autoplayBlocked && (
//         <button
//           onClick={resumeAudio}
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             padding: "16px 32px",
//             background: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "12px",
//             fontSize: "16px",
//             fontFamily: "Cairo",
//             fontWeight: 600,
//             cursor: "pointer",
//             zIndex: 9999999,
//             boxShadow: "0 4px 16px rgba(76, 175, 80, 0.4)",
//           }}
//         >
//           🔊 اضغط لتفعيل الصوت
//         </button>
//       )}

//       {/* ===== الكارت ===== */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "357px",
//           borderRadius: "35px",
//           background: "#F1F4F9",
//           paddingTop: "20px",
//           paddingBottom: "0px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           position: "relative",
//           overflow: "hidden",
//           boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
//         }}
//       >
//         {/* ===== زر الإغلاق العلوي ===== */}
//         <button
//           onClick={handleEndCall}
//           aria-label="إغلاق"
//           style={{
//             position: "absolute",
//             top: "12px",
//             left: "12px",
//             zIndex: 10,
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//             padding: "4px",
//             color: "#7C7D7E",
//             transition: "color 0.2s",
//           }}
//         >
//           <svg
//             width="20"
//             height="20"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* ===== نص الحالة ===== */}
//         <p
//           style={{
//             fontFamily: "Cairo",
//             fontWeight: 600,
//             fontSize: "13px",
//             lineHeight: "100%",
//             textAlign: "center",
//             color: "#7C7D7E",
//             marginBottom: "30px",
//             marginTop: "10px",
//             padding: "0 16px",
//           }}
//         >
//           {callState?.status === "connected"
//             ? `مكالمة جارية • ${callDuration}`
//             : callState?.status === "calling"
//             ? "جاري الاتصال..."
//             : "مكالمة صوتية"}
//         </p>

//         {/* ===== الفيديو (لو فيديو) ===== */}
//         {isVideoCall && callState?.status === "connected" ? (
//           <div
//             style={{
//               position: "relative",
//               width: "100%",
//               height: "300px",
//               marginBottom: "20px",
//               padding: "0 16px",
//             }}
//           >
//             {/* فيديو الطرف التاني */}
//             <div
//               ref={remoteVideoRef}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: "20px",
//                 overflow: "hidden",
//                 background: "#000",
//               }}
//             />
//             {/* فيديو محلي */}
//             <div
//               ref={localVideoRef}
//               style={{
//                 position: "absolute",
//                 bottom: "12px",
//                 left: "28px",
//                 width: "90px",
//                 height: "130px",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 background: "#1a1a1a",
//                 border: "2px solid #fff",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
//                 zIndex: 5,
//               }}
//             />
//           </div>
//         ) : (
//           /* ===== Avatar (صوتي) ===== */
//           <>
//             <h3
//               style={{
//                 fontFamily: "Cairo",
//                 fontWeight: 600,
//                 fontSize: "20px",
//                 lineHeight: "100%",
//                 textAlign: "center",
//                 color: "#000000",
//                 marginBottom: "6px",
//                 padding: "0 16px",
//               }}
//             >
//               {calleeName}
//             </h3>
//             <p
//               style={{
//                 fontFamily: "Inter",
//                 fontWeight: 400,
//                 fontSize: "13px",
//                 lineHeight: "100%",
//                 textAlign: "center",
//                 color: "#000000",
//                 width: "100%",
//                 marginBottom: "12px",
//                 padding: "0 16px",
//               }}
//             >
//               {calleeUsername}
//             </p>

//             {isGroupCall ? (
//               <>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     flexDirection: "row",
//                     direction: "ltr",
//                     marginBottom: "16px",
//                     padding: "0 16px",
//                   }}
//                 >
//                   {groupAvatars.slice(0, 4).map((avatar, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         position: "relative",
//                         marginRight:
//                           index !== groupAvatars.slice(0, 4).length - 1 ? "-22px" : "0px",
//                         zIndex: index + 1,
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "70px",
//                           height: "70px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: "block" }}>
//                           <defs>
//                             <clipPath id={`wavyActive-${index}`}>
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
//                             clipPath={`url(#wavyActive-${index})`}
//                             style={{ filter: "blur(5px)" }}
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
//                 </div>
//                 <p
//                   style={{
//                     fontFamily: "Cairo",
//                     fontWeight: 600,
//                     fontSize: "14px",
//                     textAlign: "center",
//                     color: "#7C7D7E",
//                     marginBottom: "10px",
//                     marginTop: "15px",
//                   }}
//                 >
//                   {groupCount} أشخاص في هذه المكالمة
//                 </p>
//               </>
//             ) : (
//               /* ===== Avatar واحد ===== */
//               <div
//                 style={{
//                   position: "relative",
//                   width: "160px",
//                   height: "160px",
//                   marginBottom: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: "block" }}>
//                   <defs>
//                     <clipPath id="wavyAvatarActive">
//                       <path d={generateWavyCirclePath(80, 80, 70, 14, 3)} />
//                     </clipPath>
//                   </defs>
//                   <image
//                     href={calleeAvatar}
//                     x="0"
//                     y="0"
//                     width="160"
//                     height="160"
//                     preserveAspectRatio="xMidYMid slice"
//                     clipPath="url(#wavyAvatarActive)"
//                   />
//                   <path
//                     d={generateWavyCirclePath(80, 80, 70, 14, 3)}
//                     fill="none"
//                     stroke="transparent"
//                     strokeWidth="1.5"
//                   />
//                 </svg>
//               </div>
//             )}
//           </>
//         )}

//         {/* ===== أزرار التحكم ===== */}
//         <div
//           style={{
//             width: "100%",
//             borderBottomLeftRadius: "35px",
//             borderBottomRightRadius: "35px",
//             background: "#EAEDF6",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "14px",
//             padding: "20px 16px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               gap: "20px",
//               width: "100%",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {/* المايك */}
//             <button
//               onClick={toggleMic}
//               style={{
//                 width: "55px",
//                 height: "55px",
//                 borderRadius: "50%",
//                 background: isMicMuted ? "#D72229" : "#FFFFFF",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//               aria-label="كتم الميكروفون"
//             >
//               {isMicMuted ? (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#FFFFFF"
//                   strokeWidth="2"
//                 >
//                   <line x1="1" y1="1" x2="23" y2="23" />
//                   <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
//                   <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
//                 </svg>
//               ) : (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 >
//                   <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
//                   <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
//                 </svg>
//               )}
//             </button>

//             {/* السماعة */}
//             <button
//               onClick={toggleSpeaker}
//               style={{
//                 width: "55px",
//                 height: "55px",
//                 borderRadius: "50%",
//                 background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//               aria-label="تشغيل/إيقاف السماعة"
//             >
//               {isSpeakerOn ? (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#FFFFFF"
//                   strokeWidth="2"
//                 >
//                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
//                   <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
//                 </svg>
//               ) : (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 >
//                   <path d="M11 5L6 9H2v6h4l5 4V5z" />
//                   <line x1="23" y1="9" x2="17" y2="15" />
//                   <line x1="17" y1="9" x2="23" y2="15" />
//                 </svg>
//               )}
//             </button>

//             {/* إضافة شخص */}
//             <button
//               onClick={handleAddPerson}
//               style={{
//                 width: "55px",
//                 height: "55px",
//                 borderRadius: "50%",
//                 background: "#FFFFFF",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//               aria-label="إضافة شخص"
//             >
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#000000"
//                 strokeWidth="2"
//               >
//                 <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//                 <circle cx="8.5" cy="7" r="4" />
//                 <line x1="20" y1="8" x2="20" y2="14" />
//                 <line x1="23" y1="11" x2="17" y2="11" />
//               </svg>
//             </button>
//           </div>

//           {/* ===== زر الإنهاء ===== */}
//           <button
//             onClick={handleEndCall}
//             style={{
//               width: "150px",
//               height: "50px",
//               borderRadius: "38.5px",
//               background: "#D72229",
//               border: "none",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
//               transition: "transform 0.2s, box-shadow 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.03)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//             }}
//             aria-label="إنهاء المكالمة"
//           >
//             <img
//               src="/imgs/call.svg"
//               alt="إنهاء الاتصال"
//               style={{
//                 width: "24px",
//                 height: "24px",
//                 filter: "brightness(0) invert(1)",
//                 transform: "rotate(135deg)",
//               }}
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ================== Helper ==================
// function generateWavyCirclePath(
//   cx: number,
//   cy: number,
//   radius: number,
//   waveCount: number,
//   amplitude: number
// ): string {
//   const steps = waveCount * 12;
//   const step = (Math.PI * 2) / steps;
//   let path = "";

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

//   return path + " Z";
// }



// src/components/calls/CallScreen.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useZegoCall } from "@/components/ZegoCallProvider";
import { CallType } from "./types";
import AddPersonModal from "./AddPersonModal";

interface CallScreenProps {
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  callType: CallType;
  isGroupCall?: boolean;
  groupAvatars?: string[];
  groupCount?: number;
  onEnd: () => void;
}

export default function CallScreen({
  calleeName,
  calleeUsername = "@user",
  calleeAvatar = "/imgs/user.png",
  callType,
  isGroupCall = false,
  groupAvatars = [],
  groupCount = 0,
  onEnd,
}: CallScreenProps) {
  const {
    callState,
    isMicMuted,
    isCameraMuted,
    isSpeakerOn,
    remoteStreamIds,
    autoplayBlocked,
    resumeAudio,
    toggleMic,
    toggleCamera,
    toggleSpeaker,
    switchCamera,
    endCall,
  } = useZegoCall();

  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const [callDuration, setCallDuration] = useState("00:00");
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [showAddPerson, setShowAddPerson] = useState(false);

  // ================== الإغلاق التلقائي ==================
  useEffect(() => {
    if (callState?.status === "idle") {
      console.log("📴 CallScreen: callState idle, closing");
      onEnd();
    }
  }, [callState?.status, onEnd]);

  // ================== الاستماع للإغلاق القسري ==================
  useEffect(() => {
    const handleForceClose = () => {
      console.log("🛑 CallScreen: Force close event received");
      onEnd();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("zego:force_close_call_modal", handleForceClose);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("zego:force_close_call_modal", handleForceClose);
      }
    };
  }, [onEnd]);

  // ================== المؤقت ==================
  useEffect(() => {
    if (callState?.status !== "connected") return;

    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      setCallDuration(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState?.status]);

  // ================== عرض الفيديو المحلي ==================
  useEffect(() => {
    if (callType !== "video") return;
    if (callState?.status !== "connected" && callState?.status !== "calling") return;

    let isMounted = true;
    let timerId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 10;

    const attachLocal = async () => {
      if (!isMounted || !localVideoRef.current) return;

      const { callEngine } = await import("@/lib/zego/callEngine");
      if (localVideoRef.current && isMounted) {
        callEngine.attachLocalVideo(localVideoRef.current);
        console.log("✅ Local video attached to CallScreen");
      } else if (attempts < maxAttempts && isMounted) {
        attempts++;
        timerId = setTimeout(attachLocal, 500);
      }
    };

    attachLocal();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
      }
    };
  }, [callState?.status, callType]);

  // ================== عرض فيديو الطرف التاني ==================
  useEffect(() => {
    if (callType !== "video") return;
    if (!remoteStreamIds.length) return;

    let isMounted = true;
    const streamId = remoteStreamIds[0];

    const attachRemote = async () => {
      if (!remoteVideoRef.current || !isMounted) return;

      const { callEngine } = await import("@/lib/zego/callEngine");
      if (remoteVideoRef.current && isMounted) {
        await callEngine.startPlaying(streamId, remoteVideoRef.current);
        console.log("✅ Remote video attached to CallScreen");
      }
    };

    attachRemote();

    return () => {
      isMounted = false;
      import("@/lib/zego/callEngine").then(({ callEngine }) => {
        callEngine.stopPlaying?.(streamId);
      });
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    };
  }, [remoteStreamIds, callType]);

  // ================== إنهاء المكالمة ==================
  const handleEndCall = () => {
    console.log("📴 CallScreen: Manual end call");
    endCall();
    onEnd();
  };

  // ================== تبديل الكاميرا ==================
  const handleSwitchCamera = () => {
    setIsFrontCamera((prev) => {
      const newState = !prev;
      switchCamera(newState);
      return newState;
    });
  };

  // ================== إضافة أشخاص ==================
  const handleAddPerson = () => {
    console.log("➕ CallScreen: Add person clicked");
    setShowAddPerson(true);
  };

  // ================== التعامل مع إضافة أشخاص للمكالمة ==================
  const handleAddToCall = async (selectedIds: string[]) => {
    console.log("➕ CallScreen: Adding people to call:", selectedIds);
    setShowAddPerson(false);

    // TODO: هنا تضيفي منطق دعوة الأشخاص للمكالمة
    // مثلاً: استدعاء zimService.sendInvitation لكل شخص
    // أو استخدام دالة جديدة من useCall اسمها inviteToCall

    alert(`سيتم دعوة ${selectedIds.length} شخص للمكالمة (قريبًا)`);
  };

  const isVideoCall = callType === "video";
  const isAudioCall = callType === "audio";

  // ================== Render ==================
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "20px",
      }}
    >
      {/* ✅ زر استئناف الصوت بعد حظر المتصفح */}
      {autoplayBlocked && (
        <button
          onClick={resumeAudio}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "16px 32px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontFamily: "Cairo",
            fontWeight: 600,
            cursor: "pointer",
            zIndex: 9999999,
            boxShadow: "0 4px 16px rgba(76, 175, 80, 0.4)",
          }}
        >
          🔊 اضغط لتفعيل الصوت
        </button>
      )}

      {/* ===== الكارت ===== */}
      <div
        style={{
          width: "100%",
          maxWidth: "357px",
          borderRadius: "35px",
          background: "#F1F4F9",
          paddingTop: "20px",
          paddingBottom: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* ===== زر الإغلاق العلوي ===== */}
        <button
          onClick={handleEndCall}
          aria-label="إغلاق"
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "#7C7D7E",
            transition: "color 0.2s",
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ===== نص الحالة ===== */}
        <p
          style={{
            fontFamily: "Cairo",
            fontWeight: 600,
            fontSize: "13px",
            lineHeight: "100%",
            textAlign: "center",
            color: "#7C7D7E",
            marginBottom: "30px",
            marginTop: "10px",
            padding: "0 16px",
          }}
        >
          {callState?.status === "connected"
            ? `مكالمة جارية • ${callDuration}`
            : callState?.status === "calling"
            ? "جاري الاتصال..."
            : "مكالمة صوتية"}
        </p>

        {/* ===== الفيديو (لو فيديو) ===== */}
        {isVideoCall && callState?.status === "connected" ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              marginBottom: "20px",
              padding: "0 16px",
            }}
          >
            {/* فيديو الطرف التاني */}
            <div
              ref={remoteVideoRef}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#000",
              }}
            />
            {/* فيديو محلي */}
            <div
              ref={localVideoRef}
              style={{
                position: "absolute",
                bottom: "12px",
                left: "28px",
                width: "90px",
                height: "130px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#1a1a1a",
                border: "2px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 5,
              }}
            />
          </div>
        ) : (
          /* ===== Avatar (صوتي) ===== */
          <>
            <h3
              style={{
                fontFamily: "Cairo",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "100%",
                textAlign: "center",
                color: "#000000",
                marginBottom: "6px",
                padding: "0 16px",
              }}
            >
              {calleeName}
            </h3>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "100%",
                textAlign: "center",
                color: "#000000",
                width: "100%",
                marginBottom: "12px",
                padding: "0 16px",
              }}
            >
              {calleeUsername}
            </p>

            {isGroupCall ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    direction: "ltr",
                    marginBottom: "16px",
                    padding: "0 16px",
                  }}
                >
                  {groupAvatars.slice(0, 4).map((avatar, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginRight:
                          index !== groupAvatars.slice(0, 4).length - 1 ? "-22px" : "0px",
                        zIndex: index + 1,
                      }}
                    >
                      <div
                        style={{
                          width: "70px",
                          height: "70px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="70" height="70" viewBox="0 0 160 160" style={{ display: "block" }}>
                          <defs>
                            <clipPath id={`wavyActive-${index}`}>
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
                            clipPath={`url(#wavyActive-${index})`}
                            style={{ filter: "blur(5px)" }}
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
                    fontFamily: "Cairo",
                    fontWeight: 600,
                    fontSize: "14px",
                    textAlign: "center",
                    color: "#7C7D7E",
                    marginBottom: "10px",
                    marginTop: "15px",
                  }}
                >
                  {groupCount} أشخاص في هذه المكالمة
                </p>
              </>
            ) : (
              /* ===== Avatar واحد ===== */
              <div
                style={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: "block" }}>
                  <defs>
                    <clipPath id="wavyAvatarActive">
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
                    clipPath="url(#wavyAvatarActive)"
                  />
                  <path
                    d={generateWavyCirclePath(80, 80, 70, 14, 3)}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            )}
          </>
        )}

        {/* ===== أزرار التحكم ===== */}
        <div
          style={{
            width: "100%",
            borderBottomLeftRadius: "35px",
            borderBottomRightRadius: "35px",
            background: "#EAEDF6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            padding: "20px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* المايك */}
            <button
              onClick={toggleMic}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: isMicMuted ? "#D72229" : "#FFFFFF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-label="كتم الميكروفون"
            >
              {isMicMuted ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                  <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                >
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                </svg>
              )}
            </button>

            {/* السماعة */}
            <button
              onClick={toggleSpeaker}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: isSpeakerOn ? "#4CAF50" : "#FFFFFF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-label="تشغيل/إيقاف السماعة"
            >
              {isSpeakerOn ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                >
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
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-label="إضافة شخص"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </button>
          </div>

          {/* ===== زر الإنهاء ===== */}
          <button
            onClick={handleEndCall}
            style={{
              width: "150px",
              height: "50px",
              borderRadius: "38.5px",
              background: "#D72229",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(215,34,41,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label="إنهاء المكالمة"
          >
            <img
              src="/imgs/call.svg"
              alt="إنهاء الاتصال"
              style={{
                width: "24px",
                height: "24px",
                filter: "brightness(0) invert(1)",
                transform: "rotate(135deg)",
              }}
            />
          </button>
        </div>
      </div>

      {/* ✅ Add Person Modal */}
      {showAddPerson && (
        <AddPersonModal
          callType={callType === "video" ? "video" : "audio"}
          callDuration={callDuration}
          participants={[
            {
              id: callState.peerUserId || "",
              name: calleeName,
              avatar: calleeAvatar,
            },
          ]}
          contacts={[
            // ⚠️ مؤقتًا: بيانات ثابتة للاختبار
            // استبدليها لاحقًا بجلب جهات الاتصال من الـ API
            { id: "user1", name: "أحمد محمد", username: "@ahmed" },
            { id: "user2", name: "سارة علي", username: "@sara" },
            { id: "user3", name: "محمد حسن", username: "@mohamed" },
          ]}
          onClose={() => {
            console.log("❌ AddPersonModal: onClose");
            setShowAddPerson(false);
          }}
          onBack={() => {
            console.log("🔙 AddPersonModal: onBack");
            setShowAddPerson(false);
          }}
          onAddToCall={handleAddToCall}
        />
      )}
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
  let path = "";

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

  return path + " Z";
}