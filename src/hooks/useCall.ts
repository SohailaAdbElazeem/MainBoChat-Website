// // // src/hooks/useCall.ts
// // "use client";

// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import type { CallInvitation } from "@/lib/zego/zimService";

// // // ============================================================
// // // Types
// // // ============================================================

// // export type CallStatus =
// //   | "idle"
// //   | "calling"
// //   | "ringing"
// //   | "connected"
// //   | "rejected"
// //   | "missed"
// //   | "ended";

// // export type CallState = {
// //   status: CallStatus;
// //   callID?: string;
// //   roomID?: string;
// //   peerUserId?: string;
// //   peerName?: string;
// //   peerUsername?: string;
// //   peerAvatar?: string;
// //   isVideo?: boolean;
// //   invitation?: CallInvitation;
// // };

// // export type UseCallParams = {
// //   appId: number;
// //   userId: string;
// //   userName: string;
// //   userAvatar?: string;
// //   zimToken: string;
// //   expressToken: string;
// // };

// // // ============================================================
// // // Hook
// // // ============================================================

// // export function useCall({
// //   appId,
// //   userId,
// //   userName,
// //   userAvatar,
// //   zimToken,
// //   expressToken,
// // }: UseCallParams) {
// //   const [callState, setCallState] = useState<CallState>({ status: "idle" });
// //   const [isReady, setIsReady] = useState(false);
// //   const [isZimReady, setIsZimReady] = useState(false);

// //   const [isMicMuted, setIsMicMuted] = useState(false);
// //   const [isCameraMuted, setIsCameraMuted] = useState(false);
// //   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
// //   const [remoteStreamIds, setRemoteStreamIds] = useState<string[]>([]);
// //   const [autoplayBlocked, setAutoplayBlocked] = useState<string | null>(null);

// //   const [incomingInvitation, setIncomingInvitation] = useState<CallInvitation | null>(null);
// //   const [showIncomingModal, setShowIncomingModal] = useState(false);

// //   const zimRef = useRef<any>(null);
// //   const engineRef = useRef<any>(null);
// //   const initedRef = useRef(false);

// //   // ✅ مؤقت للـ Caller (لو الطرف التاني مردش)
// //   const callerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //   const currentCallRef = useRef<{
// //     callID: string;
// //     roomID: string;
// //     peerUserId: string;
// //     peerName: string;
// //     peerUsername?: string;
// //     peerAvatar?: string;
// //     isCaller: boolean;
// //     isVideo: boolean;
// //   } | null>(null);

// //   const callStateRef = useRef(callState);
// //   useEffect(() => {
// //     callStateRef.current = callState;
// //   }, [callState]);

// //   // ✅ userId من localStorage مع fallback
// //   const actualUserId = useMemo(() => {
// //     if (typeof window === "undefined") return userId || "";

// //     try {
// //       const userDataStr = localStorage.getItem("userData");
// //       if (userDataStr) {
// //         const userData = JSON.parse(userDataStr);
// //         if (userData?._id) {
// //           return userData._id;
// //         }
// //       }
// //     } catch (e) {
// //       console.warn("⚠️ [useCall] Failed to read userData:", e);
// //     }

// //     return userId || "";
// //   }, [userId]);

// //   // ✅ Helper لإلغاء المؤقت
// //   const clearCallerTimeout = useCallback(() => {
// //     if (callerTimeoutRef.current) {
// //       clearTimeout(callerTimeoutRef.current);
// //       callerTimeoutRef.current = null;
// //     }
// //   }, []);

// //   // ✅ Helper لبدء مؤقت 60 ثانية للـ Caller
// //   const startCallerTimeout = useCallback(
// //     (peerSnapshot: any) => {
// //       clearCallerTimeout();

// //       callerTimeoutRef.current = setTimeout(() => {
// //         console.log("⏰ [callerTimeout] 60s passed without answer → 'ended'");

// //         // نتأكد إن الحالة لسه 'calling' (مردش)
// //         if (callStateRef.current.status === "calling") {
// //           setCallState({
// //             status: "ended",
// //             ...peerSnapshot,
// //           });
// //           currentCallRef.current = null;
// //         }
// //       }, 60000); // 60 ثانية
// //     },
// //     [clearCallerTimeout]
// //   );

// //   // ==========================================================
// //   // Helper لجلب توكن جديد
// //   // ==========================================================
// //   const fetchFreshToken = useCallback(async (): Promise<string | null> => {
// //     try {
// //       console.log("🔄 [fetchFreshToken] Fetching new token for:", actualUserId);
// //       const res = await fetch("/api/zego/token", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ userId: actualUserId, userName }),
// //       });
// //       const data = await res.json();

// //       if (data.success && data.token) {
// //         console.log("✅ [fetchFreshToken] Got new token");
// //         return data.token;
// //       }

// //       console.error("❌ [fetchFreshToken] Failed:", data);
// //       return null;
// //     } catch (err) {
// //       console.error("❌ [fetchFreshToken] Error:", err);
// //       return null;
// //     }
// //   }, [actualUserId, userName]);

// //   // ==========================================================
// //   // Init ZIM + Express
// //   // ==========================================================
// //   useEffect(() => {
// //     let mounted = true;

// //     (async () => {
// //       if (!actualUserId || !appId || !zimToken || !expressToken) return;
// //       if (initedRef.current) return;
// //       initedRef.current = true;

// //       try {
// //         const { zimService } = await import("@/lib/zego/zimService");
// //         const { callEngine } = await import("@/lib/zego/callEngine");

// //         if (!mounted) return;

// //         let ok = await zimService.init({
// //           appId,
// //           userId: actualUserId,
// //           userName,
// //           token: zimToken,
// //         });

// //         if (!ok) {
// //           console.warn("⚠️ [init] zimService.init failed, fetching fresh token...");
// //           const freshToken = await fetchFreshToken();
// //           if (freshToken) {
// //             ok = await zimService.init({
// //               appId,
// //               userId: actualUserId,
// //               userName,
// //               token: freshToken,
// //             });
// //           }
// //         }

// //         if (!ok) {
// //           console.error("❌ zimService.init failed after retry");
// //           initedRef.current = false;
// //           return;
// //         }

// //         zimRef.current = zimService;

// //         // ------- ZIM callbacks -------
// //         zimService.setOnInvitationReceived((invitation: CallInvitation) => {
// //           console.log("📥 [setOnInvitationReceived]", invitation);

// //           if (currentCallRef.current) {
// //             zimService.rejectInvitation(invitation.callID).catch(console.error);
// //             return;
// //           }

// //           const peerUsername = invitation.callerUsername;
// //           const peerAvatar = invitation.callerAvatar;

// //           currentCallRef.current = {
// //             callID: invitation.callID,
// //             roomID: invitation.roomID,
// //             peerUserId: invitation.callerID,
// //             peerName: invitation.callerName,
// //             peerUsername,
// //             peerAvatar,
// //             isCaller: false,
// //             isVideo: invitation.type === "video",
// //           };

// //           setIncomingInvitation(invitation);
// //           setShowIncomingModal(true);

// //           setCallState({
// //             status: "ringing",
// //             callID: invitation.callID,
// //             roomID: invitation.roomID,
// //             peerUserId: invitation.callerID,
// //             peerName: invitation.callerName,
// //             peerUsername,
// //             peerAvatar,
// //             isVideo: invitation.type === "video",
// //             invitation,
// //           });
// //         });

// //         zimService.setOnInvitationCancelled((callID: string) => {
// //           console.log("📥 [setOnInvitationCancelled]", callID);
// //           if (currentCallRef.current?.callID === callID) {
// //             currentCallRef.current = null;
// //             setShowIncomingModal(false);
// //             setIncomingInvitation(null);
// //             setCallState({ status: "idle" });
// //             clearCallerTimeout();
// //           }
// //         });

// //         // ✅ Caller يستقبل الـ timeout (ممكن يحصل أو لأ حسب ZEGO)
// //         zimService.setOnInvitationTimeout((callID: string) => {
// //           console.log("📥 [setOnInvitationTimeout]", callID);

// //           const cur = currentCallRef.current;
// //           if (!cur || cur.callID !== callID) return;

// //           const peerSnapshot = {
// //             callID: cur.callID,
// //             roomID: cur.roomID,
// //             peerUserId: cur.peerUserId,
// //             peerName: cur.peerName,
// //             peerUsername: cur.peerUsername,
// //             peerAvatar: cur.peerAvatar,
// //             isVideo: cur.isVideo,
// //           };

// //           currentCallRef.current = null;
// //           setShowIncomingModal(false);
// //           setIncomingInvitation(null);
// //           clearCallerTimeout();

// //           if (cur.isCaller) {
// //             console.log("✅ [setOnInvitationTimeout] Caller → 'ended'");
// //             setCallState({ status: "ended", ...peerSnapshot });
// //           } else {
// //             console.log("✅ [setOnInvitationTimeout] Callee → 'idle'");
// //             setCallState({ status: "idle" });
// //           }
// //         });

// //         zimService.setOnInvitationAccepted(async (info: any) => {
// //           console.log("📥 [setOnInvitationAccepted]", info);
// //           const cur = currentCallRef.current;
// //           if (!cur?.isCaller) return;

// //           // ✅ نلغي المؤقت لأن الطرف التاني رد
// //           clearCallerTimeout();

// //           let roomID = cur.roomID;
// //           let isVideo = cur.isVideo;
// //           try {
// //             const ext = JSON.parse(info.extendedData || "{}");
// //             if (ext.roomID) roomID = ext.roomID;
// //             if (ext.type) isVideo = ext.type === "video";
// //           } catch (_) {}

// //           setCallState({
// //             status: "connected",
// //             callID: cur.callID,
// //             roomID,
// //             peerUserId: cur.peerUserId,
// //             peerName: cur.peerName,
// //             peerUsername: cur.peerUsername,
// //             peerAvatar: cur.peerAvatar,
// //             isVideo,
// //           });

// //           try {
// //             await callEngine.loginRoom(roomID, actualUserId, userName, expressToken);
// //             await callEngine.startPublishingForCall(`stream_${actualUserId}`);
// //           } catch (err) {
// //             console.error("❌ start audio (caller):", err);
// //           }
// //         });

// //         // ✅ Caller يستقبل الرفض → status = 'missed'
// //         zimService.setOnInvitationRejected((info: any) => {
// //           console.log("🔴 [setOnInvitationRejected] CALLED", info);

// //           // ✅ نلغي المؤقت لأن الطرف التاني رفض
// //           clearCallerTimeout();

// //           const cur = currentCallRef.current;

// //           setCallState((prev) => {
// //             console.log("🔴 [setCallState callback] prev.status =", prev.status);

// //             if (prev.status !== "calling" && prev.status !== "ringing") {
// //               console.log("🔴 SKIPPED: status is not calling/ringing, it's:", prev.status);
// //               return prev;
// //             }

// //             console.log("🔴 → Switching status to 'missed' (Caller side)");

// //             return {
// //               status: "missed",
// //               callID: prev.callID || cur?.callID,
// //               roomID: prev.roomID || cur?.roomID,
// //               peerUserId: prev.peerUserId || cur?.peerUserId,
// //               peerName: prev.peerName || cur?.peerName || "مستخدم",
// //               peerUsername: prev.peerUsername || cur?.peerUsername,
// //               peerAvatar: prev.peerAvatar || cur?.peerAvatar,
// //               isVideo: prev.isVideo ?? cur?.isVideo ?? false,
// //             };
// //           });

// //           currentCallRef.current = null;
// //           setShowIncomingModal(false);
// //           setIncomingInvitation(null);
// //         });

// //         // ------- Express init -------
// //         await callEngine.init({
// //           appId,
// //           userId: actualUserId,
// //           userName,
// //           token: expressToken,
// //         });
// //         engineRef.current = callEngine;

// //         callEngine.setOnRemoteStreamAdd(async (streamId: string) => {
// //           console.log("📥 [setOnRemoteStreamAdd] streamId:", streamId);
// //           setRemoteStreamIds((prev) =>
// //             prev.includes(streamId) ? prev : [...prev, streamId]
// //           );

// //           try {
// //             await callEngine.startPlayingForCall(streamId);
// //           } catch (err) {
// //             console.error("❌ Failed to play remote stream:", err);
// //           }
// //         });

// //         callEngine.setOnRemoteStreamRemove((streamId: string) => {
// //           setRemoteStreamIds((prev) => prev.filter((id) => id !== streamId));
// //         });

// //         callEngine.setOnAutoplayFailed((streamId: string) => {
// //           setAutoplayBlocked(streamId);
// //         });

// //         if (!mounted) return;
// //         setIsReady(true);
// //         setIsZimReady(true);
// //         console.log("✅ ZIM + Express ready");
// //       } catch (err) {
// //         console.error("❌ init failed:", err);
// //         if (mounted) {
// //           setIsReady(false);
// //           setIsZimReady(false);
// //         }
// //         initedRef.current = false;
// //       }
// //     })();

// //     return () => {
// //       mounted = false;
// //     };
// //   }, [appId, actualUserId, userName, zimToken, expressToken, fetchFreshToken, clearCallerTimeout]);

// //   // ==========================================================
// //   // startCall (Caller)
// //   // ==========================================================
// //   const startCall = useCallback(
// //     async (
// //       targetUserId: string,
// //       targetUserName: string,
// //       isVideo: boolean = false,
// //       targetAvatar?: string,
// //       myAvatar?: string,
// //       targetUsername?: string
// //     ) => {
// //       const currentStatus = callStateRef.current.status;
// //       console.log("🎯 [startCall] targetUserId:", targetUserId, "isVideo:", isVideo);
// //       console.log("🎯 [startCall] current status =", currentStatus);

// //       const canStart =
// //         currentStatus === "idle" ||
// //         currentStatus === "rejected" ||
// //         currentStatus === "missed" ||
// //         currentStatus === "ended";

// //       if (!zimRef.current || !canStart || !isReady || !isZimReady) {
// //         console.warn(
// //           "⚠️ [startCall] Not ready or busy. status =",
// //           currentStatus,
// //           "isReady =",
// //           isReady,
// //           "isZimReady =",
// //           isZimReady
// //         );
// //         return;
// //       }

// //       if (currentStatus !== "idle") {
// //         setCallState({ status: "idle" });
// //       }

// //       const sortedIds = [actualUserId, targetUserId].sort();
// //       const roomID = `call_${sortedIds[0]}_${sortedIds[1]}_${Date.now()}`;

// //       currentCallRef.current = {
// //         callID: "",
// //         roomID,
// //         peerUserId: targetUserId,
// //         peerName: targetUserName,
// //         peerUsername: targetUsername,
// //         peerAvatar: targetAvatar,
// //         isCaller: true,
// //         isVideo,
// //       };

// //       setCallState({
// //         status: "calling",
// //         callID: "",
// //         roomID,
// //         peerUserId: targetUserId,
// //         peerName: targetUserName,
// //         peerUsername: targetUsername,
// //         peerAvatar: targetAvatar,
// //         isVideo,
// //       });

// //       // ✅ نبدأ مؤقت 60 ثانية للـ Caller
// //       startCallerTimeout({
// //         roomID,
// //         peerUserId: targetUserId,
// //         peerName: targetUserName,
// //         peerUsername: targetUsername,
// //         peerAvatar: targetAvatar,
// //         isVideo,
// //       });

// //       try {
// //         const res = await zimRef.current.sendInvitation({
// //           targetUserId,
// //           targetUserName,
// //           callType: isVideo ? "video" : "audio",
// //           roomID,
// //           callerAvatar: myAvatar || userAvatar,
// //           callerUsername: targetUsername,
// //         });

// //         console.log("📤 [startCall] sendInvitation result:", res);

// //         if (res.success && res.callID) {
// //           if (currentCallRef.current) {
// //             currentCallRef.current.callID = res.callID;
// //           }
// //           setCallState((prev) =>
// //             prev.status === "calling" ? { ...prev, callID: res.callID } : prev
// //           );
// //         } else {
// //           console.error("❌ [startCall] sendInvitation failed, code:", res.errorCode);
// //           currentCallRef.current = null;
// //           clearCallerTimeout();
// //           setCallState({ status: "idle" });
// //         }
// //       } catch (err) {
// //         console.error("❌ [startCall] Error:", err);
// //         currentCallRef.current = null;
// //         clearCallerTimeout();
// //         setCallState({ status: "idle" });
// //       }
// //     },
// //     [actualUserId, isReady, isZimReady, userAvatar, startCallerTimeout, clearCallerTimeout]
// //   );

// //   // ==========================================================
// //   // acceptCall (Callee)
// //   // ==========================================================
// //   const acceptCall = useCallback(async () => {
// //     const cur = currentCallRef.current;
// //     if (!cur || !zimRef.current) return;

// //     try {
// //       await zimRef.current.acceptInvitation(cur.callID);

// //       await zimRef.current.sendSignalMessage(
// //         cur.peerUserId,
// //         "ACCEPT_CALL",
// //         cur.callID,
// //         JSON.stringify({ roomID: cur.roomID, type: cur.isVideo ? "video" : "audio" })
// //       );

// //       const freshExpressToken = await fetchFreshToken();
// //       if (!freshExpressToken) {
// //         throw new Error("Failed to fetch fresh express token for callee");
// //       }

// //       const engine = engineRef.current;
// //       if (engine) {
// //         await engine.loginRoom(cur.roomID, actualUserId, userName, freshExpressToken);
// //         await engine.startPublishingForCall(`stream_${actualUserId}`);
// //       }

// //       setShowIncomingModal(false);
// //       setIncomingInvitation(null);

// //       setCallState({
// //         status: "connected",
// //         callID: cur.callID,
// //         roomID: cur.roomID,
// //         peerUserId: cur.peerUserId,
// //         peerName: cur.peerName,
// //         peerUsername: cur.peerUsername,
// //         peerAvatar: cur.peerAvatar,
// //         isVideo: cur.isVideo,
// //       });
// //     } catch (err) {
// //       console.error("❌ [acceptCall] Error:", err);
// //     }
// //   }, [actualUserId, userName, fetchFreshToken]);

// //   // ==========================================================
// //   // rejectCall (Callee)
// //   // ==========================================================
// //   const rejectCall = useCallback(async () => {
// //     const cur = currentCallRef.current;
// //     if (!cur || !zimRef.current) return;

// //     const peerSnapshot = {
// //       peerUserId: cur.peerUserId,
// //       peerName: cur.peerName,
// //       peerUsername: cur.peerUsername,
// //       peerAvatar: cur.peerAvatar,
// //       isVideo: cur.isVideo,
// //       callID: cur.callID,
// //       roomID: cur.roomID,
// //     };

// //     try {
// //       await zimRef.current.sendSignalMessage(
// //         cur.peerUserId,
// //         "REJECT_CALL",
// //         cur.callID
// //       );
// //       await zimRef.current.rejectInvitation(cur.callID);
// //     } catch (err) {
// //       console.error("❌ [rejectCall] Error:", err);
// //     } finally {
// //       currentCallRef.current = null;
// //       setShowIncomingModal(false);
// //       setIncomingInvitation(null);

// //       setCallState({
// //         status: "rejected",
// //         ...peerSnapshot,
// //       });
// //     }
// //   }, []);

// //   // ==========================================================
// //   // endCall
// //   // ==========================================================
// //   const endCall = useCallback(async () => {
// //     const cur = currentCallRef.current;
// //     const engine = engineRef.current;
// //     const currentStatus = callStateRef.current.status;

// //     const wasConnected = currentStatus === "connected";

// //     const peerSnapshot = cur
// //       ? {
// //           callID: cur.callID,
// //           roomID: cur.roomID,
// //           peerUserId: cur.peerUserId,
// //           peerName: cur.peerName,
// //           peerUsername: cur.peerUsername,
// //           peerAvatar: cur.peerAvatar,
// //           isVideo: cur.isVideo,
// //         }
// //       : null;

// //     // ✅ نلغي أي مؤقت شغال
// //     clearCallerTimeout();

// //     try {
// //       if (cur && zimRef.current) {
// //         if (cur.isCaller && currentStatus === "calling" && cur.callID) {
// //           await zimRef.current.cancelInvitation(cur.callID, cur.peerUserId);
// //         }
// //         if (currentStatus === "connected" && cur.callID) {
// //           await zimRef.current.sendSignalMessage(
// //             cur.peerUserId,
// //             "REJECT_CALL",
// //             cur.callID
// //           );
// //         }
// //       }

// //       if (engine) {
// //         engine.stopPublishing();
// //         await engine.leaveRoom().catch(() => {});
// //       }
// //     } catch (err) {
// //       console.error("❌ [endCall] cleanup error:", err);
// //     } finally {
// //       currentCallRef.current = null;
// //       setShowIncomingModal(false);
// //       setIncomingInvitation(null);
// //       setRemoteStreamIds([]);
// //       setIsMicMuted(false);
// //       setIsCameraMuted(false);
// //       setIsSpeakerOn(false);
// //       setAutoplayBlocked(null);

// //       console.log("🔍 [endCall] currentStatus =", currentStatus);
// //       console.log("🔍 [endCall] wasConnected =", wasConnected);

// //       // ✅ لو كانت connected → 'ended' للطرفين
// //       if (wasConnected && peerSnapshot) {
// //         console.log("✅ [endCall] Setting 'ended' for both sides");
// //         setCallState({ status: "ended", ...peerSnapshot });
// //       } else {
// //         console.log("❌ [endCall] Fallback to 'idle'");
// //         setCallState({ status: "idle" });
// //       }
// //     }
// //   }, [clearCallerTimeout]);

// //   const resumeAudio = useCallback(async () => {
// //     if (!autoplayBlocked || !engineRef.current) return;
// //     try {
// //       await engineRef.current.resumePlaying(autoplayBlocked);
// //       setAutoplayBlocked(null);
// //     } catch (err) {
// //       console.error("❌ [resumeAudio] Failed:", err);
// //     }
// //   }, [autoplayBlocked]);

// //   const toggleMic = useCallback(() => {
// //     const engine = engineRef.current;
// //     if (!engine) return;
// //     const next = !isMicMuted;
// //     engine.muteMicrophone(next);
// //     setIsMicMuted(next);
// //   }, [isMicMuted]);

// //   const toggleCamera = useCallback(() => {
// //     const engine = engineRef.current;
// //     if (!engine) return;
// //     const next = !isCameraMuted;
// //     engine.muteCamera(next);
// //     setIsCameraMuted(next);
// //   }, [isCameraMuted]);

// //   const toggleSpeaker = useCallback(() => {
// //     const engine = engineRef.current;
// //     if (!engine) return;
// //     const next = !isSpeakerOn;
// //     engine.setSpeakerOn(next);
// //     setIsSpeakerOn(next);
// //   }, [isSpeakerOn]);

// //   const switchCamera = useCallback((isFront: boolean) => {
// //     const engine = engineRef.current;
// //     if (!engine) return;
// //     engine.useFrontCamera(isFront);
// //   }, []);

// //   const joinExistingCall = useCallback(
// //     async (roomID: string, isVideo: boolean = false) => {
// //       const engine = engineRef.current;
// //       if (!engine) return;

// //       await engine.loginRoom(roomID, actualUserId, userName, expressToken);
// //       await engine.startPublishingForCall(`stream_${actualUserId}`);

// //       if (currentCallRef.current) {
// //         currentCallRef.current.roomID = roomID;
// //         currentCallRef.current.isVideo = isVideo;
// //       }

// //       setCallState((prev) => ({
// //         ...prev,
// //         status: "connected",
// //         roomID,
// //         isVideo,
// //       }));
// //     },
// //     [actualUserId, userName, expressToken]
// //   );

// //   const startGroupCall = useCallback(
// //     async (roomID: string, _groupName: string, isVideo: boolean = false) => {
// //       await joinExistingCall(roomID, isVideo);
// //     },
// //     [joinExistingCall]
// //   );

// //   return {
// //     callState,
// //     isReady,
// //     isZimReady,
// //     isMicMuted,
// //     isCameraMuted,
// //     isSpeakerOn,
// //     remoteStreamIds,
// //     incomingInvitation,
// //     showIncomingModal,
// //     autoplayBlocked,

// //     startCall,
// //     acceptCall,
// //     rejectCall,
// //     endCall,
// //     joinExistingCall,
// //     startGroupCall,
// //     toggleMic,
// //     toggleCamera,
// //     toggleSpeaker,
// //     switchCamera,
// //     resumeAudio,

// //     setShowIncomingModal,
// //   };
// // }



// // src/hooks/useCall.ts
// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import type { CallInvitation } from "@/lib/zego/zimService";

// // ============================================================
// // Types
// // ============================================================

// export type CallStatus =
//   | "idle"
//   | "calling"
//   | "ringing"
//   | "connected"
//   | "rejected"
//   | "missed"
//   | "ended";

// export type CallState = {
//   status: CallStatus;
//   callID?: string;
//   roomID?: string;
//   peerUserId?: string;
//   peerName?: string;
//   peerUsername?: string;
//   peerAvatar?: string;
//   isVideo?: boolean;
//   invitation?: CallInvitation;
// };

// export type UseCallParams = {
//   appId: number;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   zimToken: string;
//   expressToken: string;
// };

// // ============================================================
// // Hook
// // ============================================================

// export function useCall({
//   appId,
//   userId,
//   userName,
//   userAvatar,
//   zimToken,
//   expressToken,
// }: UseCallParams) {
//   const [callState, setCallState] = useState<CallState>({ status: "idle" });
//   const [isReady, setIsReady] = useState(false);
//   const [isZimReady, setIsZimReady] = useState(false);

//   const [isMicMuted, setIsMicMuted] = useState(false);
//   const [isCameraMuted, setIsCameraMuted] = useState(false);
//   const [isSpeakerOn, setIsSpeakerOn] = useState(false);
//   const [remoteStreamIds, setRemoteStreamIds] = useState<string[]>([]);
//   const [autoplayBlocked, setAutoplayBlocked] = useState<string | null>(null);

//   const [incomingInvitation, setIncomingInvitation] = useState<CallInvitation | null>(null);
//   const [showIncomingModal, setShowIncomingModal] = useState(false);

//   const zimRef = useRef<any>(null);
//   const engineRef = useRef<any>(null);
//   const initedRef = useRef(false);

//   const callerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const currentCallRef = useRef<{
//     callID: string;
//     roomID: string;
//     peerUserId: string;
//     peerName: string;
//     peerUsername?: string;
//     peerAvatar?: string;
//     isCaller: boolean;
//     isVideo: boolean;
//   } | null>(null);

//   const callStateRef = useRef(callState);
//   useEffect(() => {
//     callStateRef.current = callState;
//   }, [callState]);

//   const actualUserId = useMemo(() => {
//     if (typeof window === "undefined") return userId || "";

//     try {
//       const userDataStr = localStorage.getItem("userData");
//       if (userDataStr) {
//         const userData = JSON.parse(userDataStr);
//         if (userData?._id) {
//           return userData._id;
//         }
//       }
//     } catch (e) {
//       console.warn("⚠️ [useCall] Failed to read userData:", e);
//     }

//     return userId || "";
//   }, [userId]);

//   // ✅ Helper لإلغاء المؤقت
//   const clearCallerTimeout = useCallback(() => {
//     if (callerTimeoutRef.current) {
//       clearTimeout(callerTimeoutRef.current);
//       callerTimeoutRef.current = null;
//     }
//   }, []);

//   // ✅ Helper لبدء مؤقت 60 ثانية للـ Caller
//   const startCallerTimeout = useCallback(
//     (peerSnapshot: any) => {
//       clearCallerTimeout();

//       callerTimeoutRef.current = setTimeout(() => {
//         console.log("⏰ [callerTimeout] 60s passed without answer → 'ended'");

//         if (callStateRef.current.status === "calling") {
//           setCallState({
//             status: "ended",
//             ...peerSnapshot,
//           });
//           currentCallRef.current = null;
//         }
//       }, 60000);
//     },
//     [clearCallerTimeout]
//   );

//   // ==========================================================
//   // Helper لجلب توكن جديد
//   // ==========================================================
//   const fetchFreshToken = useCallback(async (): Promise<string | null> => {
//     try {
//       console.log("🔄 [fetchFreshToken] Fetching new token for:", actualUserId);
//       const res = await fetch("/api/zego/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: actualUserId, userName }),
//       });
//       const data = await res.json();

//       if (data.success && data.token) {
//         console.log("✅ [fetchFreshToken] Got new token");
//         return data.token;
//       }

//       console.error("❌ [fetchFreshToken] Failed:", data);
//       return null;
//     } catch (err) {
//       console.error("❌ [fetchFreshToken] Error:", err);
//       return null;
//     }
//   }, [actualUserId, userName]);

//   // ==========================================================
//   // Init ZIM + Express
//   // ==========================================================
//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       if (!actualUserId || !appId || !zimToken || !expressToken) return;
//       if (initedRef.current) return;
//       initedRef.current = true;

//       try {
//         const { zimService } = await import("@/lib/zego/zimService");
//         const { callEngine } = await import("@/lib/zego/callEngine");

//         if (!mounted) return;

//         let ok = await zimService.init({
//           appId,
//           userId: actualUserId,
//           userName,
//           token: zimToken,
//         });

//         if (!ok) {
//           console.warn("⚠️ [init] zimService.init failed, fetching fresh token...");
//           const freshToken = await fetchFreshToken();
//           if (freshToken) {
//             ok = await zimService.init({
//               appId,
//               userId: actualUserId,
//               userName,
//               token: freshToken,
//             });
//           }
//         }

//         if (!ok) {
//           console.error("❌ zimService.init failed after retry");
//           initedRef.current = false;
//           return;
//         }

//         zimRef.current = zimService;

//         // ------- ZIM callbacks -------
//         zimService.setOnInvitationReceived((invitation: CallInvitation) => {
//           console.log("📥 [setOnInvitationReceived]", invitation);

//           if (currentCallRef.current) {
//             zimService.rejectInvitation(invitation.callID).catch(console.error);
//             return;
//           }

//           const peerUsername = invitation.callerUsername;
//           const peerAvatar = invitation.callerAvatar;

//           currentCallRef.current = {
//             callID: invitation.callID,
//             roomID: invitation.roomID,
//             peerUserId: invitation.callerID,
//             peerName: invitation.callerName,
//             peerUsername,
//             peerAvatar,
//             isCaller: false,
//             isVideo: invitation.type === "video",
//           };

//           setIncomingInvitation(invitation);
//           setShowIncomingModal(true);

//           setCallState({
//             status: "ringing",
//             callID: invitation.callID,
//             roomID: invitation.roomID,
//             peerUserId: invitation.callerID,
//             peerName: invitation.callerName,
//             peerUsername,
//             peerAvatar,
//             isVideo: invitation.type === "video",
//             invitation,
//           });
//         });

//         zimService.setOnInvitationCancelled((callID: string) => {
//           console.log("📥 [setOnInvitationCancelled]", callID);
//           if (currentCallRef.current?.callID === callID) {
//             currentCallRef.current = null;
//             setShowIncomingModal(false);
//             setIncomingInvitation(null);
//             setCallState({ status: "idle" });
//             clearCallerTimeout();
//           }
//         });

//         zimService.setOnInvitationTimeout((callID: string) => {
//           console.log("📥 [setOnInvitationTimeout]", callID);

//           const cur = currentCallRef.current;
//           if (!cur || cur.callID !== callID) return;

//           const peerSnapshot = {
//             callID: cur.callID,
//             roomID: cur.roomID,
//             peerUserId: cur.peerUserId,
//             peerName: cur.peerName,
//             peerUsername: cur.peerUsername,
//             peerAvatar: cur.peerAvatar,
//             isVideo: cur.isVideo,
//           };

//           currentCallRef.current = null;
//           setShowIncomingModal(false);
//           setIncomingInvitation(null);
//           clearCallerTimeout();

//           if (cur.isCaller) {
//             console.log("✅ [setOnInvitationTimeout] Caller → 'ended'");
//             setCallState({ status: "ended", ...peerSnapshot });
//           } else {
//             console.log("✅ [setOnInvitationTimeout] Callee → 'idle'");
//             setCallState({ status: "idle" });
//           }
//         });

//         // ✅ جديد: الطرف التاني أنهى المكالمة → idle فورًا
//         zimService.setOnCallEnded(() => {
//           console.log("📥 [setOnCallEnded] peer ended call → idle");
//           clearCallerTimeout();
//           currentCallRef.current = null;
//           setShowIncomingModal(false);
//           setIncomingInvitation(null);
//           setCallState({ status: "idle" });
//         });

//         zimService.setOnInvitationAccepted(async (info: any) => {
//           console.log("📥 [setOnInvitationAccepted]", info);
//           const cur = currentCallRef.current;
//           if (!cur?.isCaller) return;

//           clearCallerTimeout();

//           let roomID = cur.roomID;
//           let isVideo = cur.isVideo;
//           try {
//             const ext = JSON.parse(info.extendedData || "{}");
//             if (ext.roomID) roomID = ext.roomID;
//             if (ext.type) isVideo = ext.type === "video";
//           } catch (_) {}

//           setCallState({
//             status: "connected",
//             callID: cur.callID,
//             roomID,
//             peerUserId: cur.peerUserId,
//             peerName: cur.peerName,
//             peerUsername: cur.peerUsername,
//             peerAvatar: cur.peerAvatar,
//             isVideo,
//           });

//           try {
//             await callEngine.loginRoom(roomID, actualUserId, userName, expressToken);
//             await callEngine.startPublishingForCall(`stream_${actualUserId}`);
//           } catch (err) {
//             console.error("❌ start audio (caller):", err);
//           }
//         });

//         zimService.setOnInvitationRejected((info: any) => {
//           console.log("🔴 [setOnInvitationRejected] CALLED", info);

//           clearCallerTimeout();

//           const cur = currentCallRef.current;

//           setCallState((prev) => {
//             console.log("🔴 [setCallState callback] prev.status =", prev.status);

//             if (prev.status !== "calling" && prev.status !== "ringing") {
//               console.log("🔴 SKIPPED: status is not calling/ringing, it's:", prev.status);
//               return prev;
//             }

//             console.log("🔴 → Switching status to 'missed' (Caller side)");

//             return {
//               status: "missed",
//               callID: prev.callID || cur?.callID,
//               roomID: prev.roomID || cur?.roomID,
//               peerUserId: prev.peerUserId || cur?.peerUserId,
//               peerName: prev.peerName || cur?.peerName || "مستخدم",
//               peerUsername: prev.peerUsername || cur?.peerUsername,
//               peerAvatar: prev.peerAvatar || cur?.peerAvatar,
//               isVideo: prev.isVideo ?? cur?.isVideo ?? false,
//             };
//           });

//           currentCallRef.current = null;
//           setShowIncomingModal(false);
//           setIncomingInvitation(null);
//         });

//         // ------- Express init -------
//         await callEngine.init({
//           appId,
//           userId: actualUserId,
//           userName,
//           token: expressToken,
//         });
//         engineRef.current = callEngine;

//         callEngine.setOnRemoteStreamAdd(async (streamId: string) => {
//           console.log("📥 [setOnRemoteStreamAdd] streamId:", streamId);
//           setRemoteStreamIds((prev) =>
//             prev.includes(streamId) ? prev : [...prev, streamId]
//           );

//           try {
//             await callEngine.startPlayingForCall(streamId);
//           } catch (err) {
//             console.error("❌ Failed to play remote stream:", err);
//           }
//         });

//         callEngine.setOnRemoteStreamRemove((streamId: string) => {
//           setRemoteStreamIds((prev) => prev.filter((id) => id !== streamId));
//         });

//         callEngine.setOnAutoplayFailed((streamId: string) => {
//           setAutoplayBlocked(streamId);
//         });

//         if (!mounted) return;
//         setIsReady(true);
//         setIsZimReady(true);
//         console.log("✅ ZIM + Express ready");
//       } catch (err) {
//         console.error("❌ init failed:", err);
//         if (mounted) {
//           setIsReady(false);
//           setIsZimReady(false);
//         }
//         initedRef.current = false;
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [appId, actualUserId, userName, zimToken, expressToken, fetchFreshToken, clearCallerTimeout]);

//   // ==========================================================
//   // startCall (Caller)
//   // ==========================================================
//   const startCall = useCallback(
//     async (
//       targetUserId: string,
//       targetUserName: string,
//       isVideo: boolean = false,
//       targetAvatar?: string,
//       myAvatar?: string,
//       targetUsername?: string
//     ) => {
//       const currentStatus = callStateRef.current.status;
//       console.log("🎯 [startCall] targetUserId:", targetUserId, "isVideo:", isVideo);
//       console.log("🎯 [startCall] current status =", currentStatus);

//       const canStart =
//         currentStatus === "idle" ||
//         currentStatus === "rejected" ||
//         currentStatus === "missed" ||
//         currentStatus === "ended";

//       if (!zimRef.current || !canStart || !isReady || !isZimReady) {
//         console.warn(
//           "⚠️ [startCall] Not ready or busy. status =",
//           currentStatus,
//           "isReady =",
//           isReady,
//           "isZimReady =",
//           isZimReady
//         );
//         return;
//       }

//       if (currentStatus !== "idle") {
//         setCallState({ status: "idle" });
//       }

//       const sortedIds = [actualUserId, targetUserId].sort();
//       const roomID = `call_${sortedIds[0]}_${sortedIds[1]}_${Date.now()}`;

//       currentCallRef.current = {
//         callID: "",
//         roomID,
//         peerUserId: targetUserId,
//         peerName: targetUserName,
//         peerUsername: targetUsername,
//         peerAvatar: targetAvatar,
//         isCaller: true,
//         isVideo,
//       };

//       setCallState({
//         status: "calling",
//         callID: "",
//         roomID,
//         peerUserId: targetUserId,
//         peerName: targetUserName,
//         peerUsername: targetUsername,
//         peerAvatar: targetAvatar,
//         isVideo,
//       });

//       startCallerTimeout({
//         roomID,
//         peerUserId: targetUserId,
//         peerName: targetUserName,
//         peerUsername: targetUsername,
//         peerAvatar: targetAvatar,
//         isVideo,
//       });

//       try {
//         const res = await zimRef.current.sendInvitation({
//           targetUserId,
//           targetUserName,
//           callType: isVideo ? "video" : "audio",
//           roomID,
//           callerAvatar: myAvatar || userAvatar,
//           callerUsername: targetUsername,
//         });

//         console.log("📤 [startCall] sendInvitation result:", res);

//         if (res.success && res.callID) {
//           if (currentCallRef.current) {
//             currentCallRef.current.callID = res.callID;
//           }
//           setCallState((prev) =>
//             prev.status === "calling" ? { ...prev, callID: res.callID } : prev
//           );
//         } else {
//           console.error("❌ [startCall] sendInvitation failed, code:", res.errorCode);
//           currentCallRef.current = null;
//           clearCallerTimeout();
//           setCallState({ status: "idle" });
//         }
//       } catch (err) {
//         console.error("❌ [startCall] Error:", err);
//         currentCallRef.current = null;
//         clearCallerTimeout();
//         setCallState({ status: "idle" });
//       }
//     },
//     [actualUserId, isReady, isZimReady, userAvatar, startCallerTimeout, clearCallerTimeout]
//   );

//   // ==========================================================
//   // acceptCall (Callee)
//   // ==========================================================
//   const acceptCall = useCallback(async () => {
//     const cur = currentCallRef.current;
//     if (!cur || !zimRef.current) return;

//     try {
//       await zimRef.current.acceptInvitation(cur.callID);

//       await zimRef.current.sendSignalMessage(
//         cur.peerUserId,
//         "ACCEPT_CALL",
//         cur.callID,
//         JSON.stringify({ roomID: cur.roomID, type: cur.isVideo ? "video" : "audio" })
//       );

//       const freshExpressToken = await fetchFreshToken();
//       if (!freshExpressToken) {
//         throw new Error("Failed to fetch fresh express token for callee");
//       }

//       const engine = engineRef.current;
//       if (engine) {
//         await engine.loginRoom(cur.roomID, actualUserId, userName, freshExpressToken);
//         await engine.startPublishingForCall(`stream_${actualUserId}`);
//       }

//       setShowIncomingModal(false);
//       setIncomingInvitation(null);

//       setCallState({
//         status: "connected",
//         callID: cur.callID,
//         roomID: cur.roomID,
//         peerUserId: cur.peerUserId,
//         peerName: cur.peerName,
//         peerUsername: cur.peerUsername,
//         peerAvatar: cur.peerAvatar,
//         isVideo: cur.isVideo,
//       });
//     } catch (err) {
//       console.error("❌ [acceptCall] Error:", err);
//     }
//   }, [actualUserId, userName, fetchFreshToken]);

//   // ==========================================================
//   // rejectCall (Callee)
//   // ==========================================================
//   const rejectCall = useCallback(async () => {
//     const cur = currentCallRef.current;
//     if (!cur || !zimRef.current) return;

//     const peerSnapshot = {
//       peerUserId: cur.peerUserId,
//       peerName: cur.peerName,
//       peerUsername: cur.peerUsername,
//       peerAvatar: cur.peerAvatar,
//       isVideo: cur.isVideo,
//       callID: cur.callID,
//       roomID: cur.roomID,
//     };

//     try {
//       await zimRef.current.sendSignalMessage(
//         cur.peerUserId,
//         "REJECT_CALL",
//         cur.callID
//       );
//       await zimRef.current.rejectInvitation(cur.callID);
//     } catch (err) {
//       console.error("❌ [rejectCall] Error:", err);
//     } finally {
//       currentCallRef.current = null;
//       setShowIncomingModal(false);
//       setIncomingInvitation(null);

//       setCallState({
//         status: "rejected",
//         ...peerSnapshot,
//       });
//     }
//   }, []);

//   // ==========================================================
//   // endCall — ✅ الاتنين يرجعوا idle فورًا
//   // ==========================================================
//   const endCall = useCallback(async () => {
//     const cur = currentCallRef.current;
//     const engine = engineRef.current;
//     const currentStatus = callStateRef.current.status;

//     // ✅ نبعت END_CALL للطرف التاني
//     if (cur && zimRef.current && cur.peerUserId) {
//       try {
//         await zimRef.current.sendSignalMessage(
//           cur.peerUserId,
//           "END_CALL",
//           cur.callID
//         );
//         console.log("📤 [endCall] Sent END_CALL to peer");
//       } catch (err) {
//         console.warn("⚠️ [endCall] failed to send END_CALL:", err);
//       }
//     }

//     // ✅ نلغي المؤقت
//     clearCallerTimeout();

//     try {
//       if (cur && zimRef.current) {
//         if (cur.isCaller && currentStatus === "calling" && cur.callID) {
//           await zimRef.current.cancelInvitation(cur.callID, cur.peerUserId);
//         }
//         if (currentStatus === "connected" && cur.callID) {
//           await zimRef.current.sendSignalMessage(
//             cur.peerUserId,
//             "REJECT_CALL",
//             cur.callID
//           );
//         }
//       }

//       if (engine) {
//         engine.stopPublishing();
//         await engine.leaveRoom().catch(() => {});
//       }
//     } catch (err) {
//       console.error("❌ [endCall] cleanup error:", err);
//     } finally {
//       currentCallRef.current = null;
//       setShowIncomingModal(false);
//       setIncomingInvitation(null);
//       setRemoteStreamIds([]);
//       setIsMicMuted(false);
//       setIsCameraMuted(false);
//       setIsSpeakerOn(false);
//       setAutoplayBlocked(null);

//       // ✅ دايماً idle (مش 'ended')
//       console.log("✅ [endCall] Setting status 'idle' for caller");
//       setCallState({ status: "idle" });
//     }
//   }, [clearCallerTimeout]);

//   const resumeAudio = useCallback(async () => {
//     if (!autoplayBlocked || !engineRef.current) return;
//     try {
//       await engineRef.current.resumePlaying(autoplayBlocked);
//       setAutoplayBlocked(null);
//     } catch (err) {
//       console.error("❌ [resumeAudio] Failed:", err);
//     }
//   }, [autoplayBlocked]);

//   const toggleMic = useCallback(() => {
//     const engine = engineRef.current;
//     if (!engine) return;
//     const next = !isMicMuted;
//     engine.muteMicrophone(next);
//     setIsMicMuted(next);
//   }, [isMicMuted]);

//   const toggleCamera = useCallback(() => {
//     const engine = engineRef.current;
//     if (!engine) return;
//     const next = !isCameraMuted;
//     engine.muteCamera(next);
//     setIsCameraMuted(next);
//   }, [isCameraMuted]);

//   const toggleSpeaker = useCallback(() => {
//     const engine = engineRef.current;
//     if (!engine) return;
//     const next = !isSpeakerOn;
//     engine.setSpeakerOn(next);
//     setIsSpeakerOn(next);
//   }, [isSpeakerOn]);

//   const switchCamera = useCallback((isFront: boolean) => {
//     const engine = engineRef.current;
//     if (!engine) return;
//     engine.useFrontCamera(isFront);
//   }, []);

//   const joinExistingCall = useCallback(
//     async (roomID: string, isVideo: boolean = false) => {
//       const engine = engineRef.current;
//       if (!engine) return;

//       await engine.loginRoom(roomID, actualUserId, userName, expressToken);
//       await engine.startPublishingForCall(`stream_${actualUserId}`);

//       if (currentCallRef.current) {
//         currentCallRef.current.roomID = roomID;
//         currentCallRef.current.isVideo = isVideo;
//       }

//       setCallState((prev) => ({
//         ...prev,
//         status: "connected",
//         roomID,
//         isVideo,
//       }));
//     },
//     [actualUserId, userName, expressToken]
//   );

//   const startGroupCall = useCallback(
//     async (roomID: string, _groupName: string, isVideo: boolean = false) => {
//       await joinExistingCall(roomID, isVideo);
//     },
//     [joinExistingCall]
//   );

//   return {
//     callState,
//     isReady,
//     isZimReady,
//     isMicMuted,
//     isCameraMuted,
//     isSpeakerOn,
//     remoteStreamIds,
//     incomingInvitation,
//     showIncomingModal,
//     autoplayBlocked,

//     startCall,
//     acceptCall,
//     rejectCall,
//     endCall,
//     joinExistingCall,
//     startGroupCall,
//     toggleMic,
//     toggleCamera,
//     toggleSpeaker,
//     switchCamera,
//     resumeAudio,

//     setShowIncomingModal,
//   };
// }










// src/hooks/useCall.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CallInvitation } from "@/lib/zego/zimService";

// ============================================================
// Types
// ============================================================

export type CallStatus =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "rejected"
  | "missed"
  | "ended";

export type CallState = {
  status: CallStatus;
  callID?: string;
  roomID?: string;
  peerUserId?: string;
  peerName?: string;
  peerUsername?: string;
  peerAvatar?: string;
  isVideo?: boolean;
  invitation?: CallInvitation;
};

export type UseCallParams = {
  appId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  zimToken: string;
  expressToken: string;
};

// ============================================================
// Hook
// ============================================================

export function useCall({
  appId,
  userId,
  userName,
  userAvatar,
  zimToken,
  expressToken,
}: UseCallParams) {
  const [callState, setCallState] = useState<CallState>({ status: "idle" });
  const [isReady, setIsReady] = useState(false);
  const [isZimReady, setIsZimReady] = useState(false);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [remoteStreamIds, setRemoteStreamIds] = useState<string[]>([]);
  const [autoplayBlocked, setAutoplayBlocked] = useState<string | null>(null);

  const [incomingInvitation, setIncomingInvitation] = useState<CallInvitation | null>(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);

  const zimRef = useRef<any>(null);
  const engineRef = useRef<any>(null);
  const initedRef = useRef(false);

  const callerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentCallRef = useRef<{
    callID: string;
    roomID: string;
    peerUserId: string;
    peerName: string;
    peerUsername?: string;
    peerAvatar?: string;
    isCaller: boolean;
    isVideo: boolean;
  } | null>(null);

  const callStateRef = useRef(callState);
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const actualUserId = useMemo(() => {
    if (typeof window === "undefined") return userId || "";

    try {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData?._id) {
          return userData._id;
        }
      }
    } catch (e) {
      console.warn("⚠️ [useCall] Failed to read userData:", e);
    }

    return userId || "";
  }, [userId]);

  // ✅ Helper لإلغاء المؤقت
  const clearCallerTimeout = useCallback(() => {
    if (callerTimeoutRef.current) {
      clearTimeout(callerTimeoutRef.current);
      callerTimeoutRef.current = null;
    }
  }, []);

  // ✅ Helper لبدء مؤقت 60 ثانية للـ Caller
  const startCallerTimeout = useCallback(
    (peerSnapshot: any) => {
      clearCallerTimeout();

      callerTimeoutRef.current = setTimeout(() => {
        console.log("⏰ [callerTimeout] 60s passed without answer → 'ended'");

        if (callStateRef.current.status === "calling") {
          setCallState({
            status: "ended",
            ...peerSnapshot,
          });
          currentCallRef.current = null;
        }
      }, 60000);
    },
    [clearCallerTimeout]
  );

  // ==========================================================
  // Helper لجلب توكن جديد
  // ==========================================================
  const fetchFreshToken = useCallback(async (): Promise<string | null> => {
    try {
      console.log("🔄 [fetchFreshToken] Fetching new token for:", actualUserId);
      const res = await fetch("/api/zego/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: actualUserId, userName }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        console.log("✅ [fetchFreshToken] Got new token");
        return data.token;
      }

      console.error("❌ [fetchFreshToken] Failed:", data);
      return null;
    } catch (err) {
      console.error("❌ [fetchFreshToken] Error:", err);
      return null;
    }
  }, [actualUserId, userName]);

  // ==========================================================
  // Init ZIM + Express
  // ==========================================================
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!actualUserId || !appId || !zimToken || !expressToken) return;
      if (initedRef.current) return;
      initedRef.current = true;

      try {
        const { zimService } = await import("@/lib/zego/zimService");
        const { callEngine } = await import("@/lib/zego/callEngine");

        if (!mounted) return;

        let ok = await zimService.init({
          appId,
          userId: actualUserId,
          userName,
          token: zimToken,
        });

        if (!ok) {
          console.warn("⚠️ [init] zimService.init failed, fetching fresh token...");
          const freshToken = await fetchFreshToken();
          if (freshToken) {
            ok = await zimService.init({
              appId,
              userId: actualUserId,
              userName,
              token: freshToken,
            });
          }
        }

        if (!ok) {
          console.error("❌ zimService.init failed after retry");
          initedRef.current = false;
          return;
        }

        zimRef.current = zimService;

        // ------- ZIM callbacks -------
        zimService.setOnInvitationReceived((invitation: CallInvitation) => {
          console.log("📥 [setOnInvitationReceived]", invitation);

          if (currentCallRef.current) {
            zimService.rejectInvitation(invitation.callID).catch(console.error);
            return;
          }

          const peerUsername = invitation.callerUsername;
          const peerAvatar = invitation.callerAvatar;

          currentCallRef.current = {
            callID: invitation.callID,
            roomID: invitation.roomID,
            peerUserId: invitation.callerID,
            peerName: invitation.callerName,
            peerUsername,
            peerAvatar,
            isCaller: false,
            isVideo: invitation.type === "video",
          };

          setIncomingInvitation(invitation);
          setShowIncomingModal(true);

          setCallState({
            status: "ringing",
            callID: invitation.callID,
            roomID: invitation.roomID,
            peerUserId: invitation.callerID,
            peerName: invitation.callerName,
            peerUsername,
            peerAvatar,
            isVideo: invitation.type === "video",
            invitation,
          });
        });

        zimService.setOnInvitationCancelled((callID: string) => {
          console.log("📥 [setOnInvitationCancelled]", callID);
          if (currentCallRef.current?.callID === callID) {
            currentCallRef.current = null;
            setShowIncomingModal(false);
            setIncomingInvitation(null);
            setCallState({ status: "idle" });
            clearCallerTimeout();
          }
        });

        zimService.setOnInvitationTimeout((callID: string) => {
          console.log("📥 [setOnInvitationTimeout]", callID);

          const cur = currentCallRef.current;
          if (!cur || cur.callID !== callID) return;

          const peerSnapshot = {
            callID: cur.callID,
            roomID: cur.roomID,
            peerUserId: cur.peerUserId,
            peerName: cur.peerName,
            peerUsername: cur.peerUsername,
            peerAvatar: cur.peerAvatar,
            isVideo: cur.isVideo,
          };

          currentCallRef.current = null;
          setShowIncomingModal(false);
          setIncomingInvitation(null);
          clearCallerTimeout();

          if (cur.isCaller) {
            console.log("✅ [setOnInvitationTimeout] Caller → 'ended'");
            setCallState({ status: "ended", ...peerSnapshot });
          } else {
            console.log("✅ [setOnInvitationTimeout] Callee → 'idle'");
            setCallState({ status: "idle" });
          }
        });

        // ✅ الطرف التاني أنهى المكالمة → idle فورًا
        zimService.setOnCallEnded(() => {
          console.log("════════════════════════════════════════");
          console.log("✅✅✅ [setOnCallEnded] CALLED — peer ended call");
          console.log("════════════════════════════════════════");
          clearCallerTimeout();
          currentCallRef.current = null;
          setShowIncomingModal(false);
          setIncomingInvitation(null);
          setCallState({ status: "idle" });
          console.log("✅✅✅ [setOnCallEnded] status set to 'idle'");
        });

        zimService.setOnInvitationAccepted(async (info: any) => {
          console.log("📥 [setOnInvitationAccepted]", info);
          const cur = currentCallRef.current;
          if (!cur?.isCaller) return;

          clearCallerTimeout();

          let roomID = cur.roomID;
          let isVideo = cur.isVideo;
          try {
            const ext = JSON.parse(info.extendedData || "{}");
            if (ext.roomID) roomID = ext.roomID;
            if (ext.type) isVideo = ext.type === "video";
          } catch (_) {}

          setCallState({
            status: "connected",
            callID: cur.callID,
            roomID,
            peerUserId: cur.peerUserId,
            peerName: cur.peerName,
            peerUsername: cur.peerUsername,
            peerAvatar: cur.peerAvatar,
            isVideo,
          });

          try {
            await callEngine.loginRoom(roomID, actualUserId, userName, expressToken);
            await callEngine.startPublishingForCall(`stream_${actualUserId}`);
          } catch (err) {
            console.error("❌ start audio (caller):", err);
          }
        });

        zimService.setOnInvitationRejected((info: any) => {
          console.log("🔴 [setOnInvitationRejected] CALLED", info);

          clearCallerTimeout();

          const cur = currentCallRef.current;

          setCallState((prev) => {
            console.log("🔴 [setCallState callback] prev.status =", prev.status);

            if (prev.status !== "calling" && prev.status !== "ringing") {
              console.log("🔴 SKIPPED: status is not calling/ringing, it's:", prev.status);
              return prev;
            }

            console.log("🔴 → Switching status to 'missed' (Caller side)");

            return {
              status: "missed",
              callID: prev.callID || cur?.callID,
              roomID: prev.roomID || cur?.roomID,
              peerUserId: prev.peerUserId || cur?.peerUserId,
              peerName: prev.peerName || cur?.peerName || "مستخدم",
              peerUsername: prev.peerUsername || cur?.peerUsername,
              peerAvatar: prev.peerAvatar || cur?.peerAvatar,
              isVideo: prev.isVideo ?? cur?.isVideo ?? false,
            };
          });

          currentCallRef.current = null;
          setShowIncomingModal(false);
          setIncomingInvitation(null);
        });

        // ------- Express init -------
        await callEngine.init({
          appId,
          userId: actualUserId,
          userName,
          token: expressToken,
        });
        engineRef.current = callEngine;

        callEngine.setOnRemoteStreamAdd(async (streamId: string) => {
          console.log("📥 [setOnRemoteStreamAdd] streamId:", streamId);
          setRemoteStreamIds((prev) =>
            prev.includes(streamId) ? prev : [...prev, streamId]
          );

          try {
            await callEngine.startPlayingForCall(streamId);
          } catch (err) {
            console.error("❌ Failed to play remote stream:", err);
          }
        });

        callEngine.setOnRemoteStreamRemove((streamId: string) => {
          setRemoteStreamIds((prev) => prev.filter((id) => id !== streamId));
        });

        callEngine.setOnAutoplayFailed((streamId: string) => {
          setAutoplayBlocked(streamId);
        });

        if (!mounted) return;
        setIsReady(true);
        setIsZimReady(true);
        console.log("✅ ZIM + Express ready");
      } catch (err) {
        console.error("❌ init failed:", err);
        if (mounted) {
          setIsReady(false);
          setIsZimReady(false);
        }
        initedRef.current = false;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [appId, actualUserId, userName, zimToken, expressToken, fetchFreshToken, clearCallerTimeout]);

  // ==========================================================
  // startCall (Caller)
  // ==========================================================
  const startCall = useCallback(
    async (
      targetUserId: string,
      targetUserName: string,
      isVideo: boolean = false,
      targetAvatar?: string,
      myAvatar?: string,
      targetUsername?: string
    ) => {
      const currentStatus = callStateRef.current.status;
      console.log("🎯 [startCall] targetUserId:", targetUserId, "isVideo:", isVideo);
      console.log("🎯 [startCall] current status =", currentStatus);

      const canStart =
        currentStatus === "idle" ||
        currentStatus === "rejected" ||
        currentStatus === "missed" ||
        currentStatus === "ended";

      if (!zimRef.current || !canStart || !isReady || !isZimReady) {
        console.warn(
          "⚠️ [startCall] Not ready or busy. status =",
          currentStatus,
          "isReady =",
          isReady,
          "isZimReady =",
          isZimReady
        );
        return;
      }

      if (currentStatus !== "idle") {
        setCallState({ status: "idle" });
      }

      const sortedIds = [actualUserId, targetUserId].sort();
      const roomID = `call_${sortedIds[0]}_${sortedIds[1]}_${Date.now()}`;

      currentCallRef.current = {
        callID: "",
        roomID,
        peerUserId: targetUserId,
        peerName: targetUserName,
        peerUsername: targetUsername,
        peerAvatar: targetAvatar,
        isCaller: true,
        isVideo,
      };

      setCallState({
        status: "calling",
        callID: "",
        roomID,
        peerUserId: targetUserId,
        peerName: targetUserName,
        peerUsername: targetUsername,
        peerAvatar: targetAvatar,
        isVideo,
      });

      startCallerTimeout({
        roomID,
        peerUserId: targetUserId,
        peerName: targetUserName,
        peerUsername: targetUsername,
        peerAvatar: targetAvatar,
        isVideo,
      });

      try {
        const res = await zimRef.current.sendInvitation({
          targetUserId,
          targetUserName,
          callType: isVideo ? "video" : "audio",
          roomID,
          callerAvatar: myAvatar || userAvatar,
          callerUsername: targetUsername,
        });

        console.log("📤 [startCall] sendInvitation result:", res);

        if (res.success && res.callID) {
          if (currentCallRef.current) {
            currentCallRef.current.callID = res.callID;
          }
          setCallState((prev) =>
            prev.status === "calling" ? { ...prev, callID: res.callID } : prev
          );
        } else {
          console.error("❌ [startCall] sendInvitation failed, code:", res.errorCode);
          currentCallRef.current = null;
          clearCallerTimeout();
          setCallState({ status: "idle" });
        }
      } catch (err) {
        console.error("❌ [startCall] Error:", err);
        currentCallRef.current = null;
        clearCallerTimeout();
        setCallState({ status: "idle" });
      }
    },
    [actualUserId, isReady, isZimReady, userAvatar, startCallerTimeout, clearCallerTimeout]
  );

  // ==========================================================
  // acceptCall (Callee)
  // ==========================================================
  const acceptCall = useCallback(async () => {
    const cur = currentCallRef.current;
    if (!cur || !zimRef.current) return;

    try {
      await zimRef.current.acceptInvitation(cur.callID);

      await zimRef.current.sendSignalMessage(
        cur.peerUserId,
        "ACCEPT_CALL",
        cur.callID,
        JSON.stringify({ roomID: cur.roomID, type: cur.isVideo ? "video" : "audio" })
      );

      const freshExpressToken = await fetchFreshToken();
      if (!freshExpressToken) {
        throw new Error("Failed to fetch fresh express token for callee");
      }

      const engine = engineRef.current;
      if (engine) {
        await engine.loginRoom(cur.roomID, actualUserId, userName, freshExpressToken);
        await engine.startPublishingForCall(`stream_${actualUserId}`);
      }

      setShowIncomingModal(false);
      setIncomingInvitation(null);

      setCallState({
        status: "connected",
        callID: cur.callID,
        roomID: cur.roomID,
        peerUserId: cur.peerUserId,
        peerName: cur.peerName,
        peerUsername: cur.peerUsername,
        peerAvatar: cur.peerAvatar,
        isVideo: cur.isVideo,
      });
    } catch (err) {
      console.error("❌ [acceptCall] Error:", err);
    }
  }, [actualUserId, userName, fetchFreshToken]);

  // ==========================================================
  // rejectCall (Callee)
  // ==========================================================
  const rejectCall = useCallback(async () => {
    const cur = currentCallRef.current;
    if (!cur || !zimRef.current) return;

    const peerSnapshot = {
      peerUserId: cur.peerUserId,
      peerName: cur.peerName,
      peerUsername: cur.peerUsername,
      peerAvatar: cur.peerAvatar,
      isVideo: cur.isVideo,
      callID: cur.callID,
      roomID: cur.roomID,
    };

    try {
      await zimRef.current.sendSignalMessage(
        cur.peerUserId,
        "REJECT_CALL",
        cur.callID
      );
      await zimRef.current.rejectInvitation(cur.callID);
    } catch (err) {
      console.error("❌ [rejectCall] Error:", err);
    } finally {
      currentCallRef.current = null;
      setShowIncomingModal(false);
      setIncomingInvitation(null);

      setCallState({
        status: "rejected",
        ...peerSnapshot,
      });
    }
  }, []);

  // ==========================================================
  // endCall — ✅ الاتنين يرجعوا idle فورًا
  // ==========================================================
  const endCall = useCallback(async () => {
    const cur = currentCallRef.current;
    const engine = engineRef.current;
    const currentStatus = callStateRef.current.status;

    // ✅ logging كامل
    console.log("════════════════════════════════════════");
    console.log("🔍 [endCall] START");
    console.log("🔍 [endCall] cur =", cur);
    console.log("🔍 [endCall] cur?.peerUserId =", cur?.peerUserId);
    console.log("🔍 [endCall] cur?.callID =", cur?.callID);
    console.log("🔍 [endCall] zimRef.current =", !!zimRef.current);
    console.log("🔍 [endCall] currentStatus =", currentStatus);
    console.log("════════════════════════════════════════");

    // ✅ 1. نبعت END_CALL للطرف التاني
    if (cur && zimRef.current && cur.peerUserId) {
      try {
        console.log("📤 [endCall] >>> SENDING END_CALL <<<");
        console.log("📤 [endCall] to:", cur.peerUserId);
        console.log("📤 [endCall] callID:", cur.callID);

        const result = await zimRef.current.sendSignalMessage(
          cur.peerUserId,
          "END_CALL",
          cur.callID
        );

        console.log("✅ [endCall] sendSignalMessage result =", result);
      } catch (err) {
        console.warn("❌ [endCall] failed to send END_CALL:", err);
      }
    } else {
      console.warn("❌❌❌ [endCall] Cannot send END_CALL:");
      console.warn("   hasCur:", !!cur);
      console.warn("   hasZim:", !!zimRef.current);
      console.warn("   hasPeerUserId:", !!cur?.peerUserId);
    }

    // ✅ 2. نلغي المؤقت
    clearCallerTimeout();

    // ✅ 3. Cleanup
    try {
      if (cur && zimRef.current) {
        if (cur.isCaller && currentStatus === "calling" && cur.callID) {
          await zimRef.current.cancelInvitation(cur.callID, cur.peerUserId);
        }
      }

      if (engine) {
        engine.stopPublishing();
        await engine.leaveRoom().catch(() => {});
      }
    } catch (err) {
      console.error("❌ [endCall] cleanup error:", err);
    } finally {
      currentCallRef.current = null;
      setShowIncomingModal(false);
      setIncomingInvitation(null);
      setRemoteStreamIds([]);
      setIsMicMuted(false);
      setIsCameraMuted(false);
      setIsSpeakerOn(false);
      setAutoplayBlocked(null);
      setCallState({ status: "idle" });
      console.log("✅ [endCall] Local status set to 'idle'");
      console.log("════════════════════════════════════════");
    }
  }, [clearCallerTimeout]);

  const resumeAudio = useCallback(async () => {
    if (!autoplayBlocked || !engineRef.current) return;
    try {
      await engineRef.current.resumePlaying(autoplayBlocked);
      setAutoplayBlocked(null);
    } catch (err) {
      console.error("❌ [resumeAudio] Failed:", err);
    }
  }, [autoplayBlocked]);

  const toggleMic = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const next = !isMicMuted;
    engine.muteMicrophone(next);
    setIsMicMuted(next);
  }, [isMicMuted]);

  const toggleCamera = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const next = !isCameraMuted;
    engine.muteCamera(next);
    setIsCameraMuted(next);
  }, [isCameraMuted]);

  const toggleSpeaker = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const next = !isSpeakerOn;
    engine.setSpeakerOn(next);
    setIsSpeakerOn(next);
  }, [isSpeakerOn]);

  const switchCamera = useCallback((isFront: boolean) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.useFrontCamera(isFront);
  }, []);

  const joinExistingCall = useCallback(
    async (roomID: string, isVideo: boolean = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      await engine.loginRoom(roomID, actualUserId, userName, expressToken);
      await engine.startPublishingForCall(`stream_${actualUserId}`);

      if (currentCallRef.current) {
        currentCallRef.current.roomID = roomID;
        currentCallRef.current.isVideo = isVideo;
      }

      setCallState((prev) => ({
        ...prev,
        status: "connected",
        roomID,
        isVideo,
      }));
    },
    [actualUserId, userName, expressToken]
  );

  const startGroupCall = useCallback(
    async (roomID: string, _groupName: string, isVideo: boolean = false) => {
      await joinExistingCall(roomID, isVideo);
    },
    [joinExistingCall]
  );

  return {
    callState,
    isReady,
    isZimReady,
    isMicMuted,
    isCameraMuted,
    isSpeakerOn,
    remoteStreamIds,
    incomingInvitation,
    showIncomingModal,
    autoplayBlocked,

    startCall,
    acceptCall,
    rejectCall,
    endCall,
    joinExistingCall,
    startGroupCall,
    toggleMic,
    toggleCamera,
    toggleSpeaker,
    switchCamera,
    resumeAudio,

    setShowIncomingModal,
  };
}