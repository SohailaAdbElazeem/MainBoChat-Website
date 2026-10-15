// src/hooks/useCall.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CallInvitation } from "@/lib/zego/zimService";

// ============================================================
// Types
// ============================================================

export type CallStatus = "idle" | "calling" | "ringing" | "connected";

export type CallState = {
  status: CallStatus;
  callID?: string;
  roomID?: string;
  peerUserId?: string;
  peerName?: string;
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

  const currentCallRef = useRef<{
    callID: string;
    roomID: string;
    peerUserId: string;
    peerName: string;
    isCaller: boolean;
    isVideo: boolean;
  } | null>(null);

  // ✅ استخدام الـ userId من localStorage مع fallback للـ prop
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

  // ==========================================================
  // ✅ NEW: Helper لجلب توكن جديد من الـ API
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

        // ------- ZIM init -------
        let ok = await zimService.init({
          appId,
          userId: actualUserId,
          userName,
          token: zimToken,
        });

        // ✅ لو فشل، جرب توكن جديد
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
        zimService.setOnInvitationReceived((invitation) => {
          console.log("📥 [setOnInvitationReceived]", invitation);

          if (currentCallRef.current) {
            zimService.rejectInvitation(invitation.callID).catch(console.error);
            return;
          }

          currentCallRef.current = {
            callID: invitation.callID,
            roomID: invitation.roomID,
            peerUserId: invitation.callerID,
            peerName: invitation.callerName,
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
            isVideo: invitation.type === "video",
            invitation,
          });
        });

        zimService.setOnInvitationCancelled((callID) => {
          console.log("📥 [setOnInvitationCancelled]", callID);
          if (currentCallRef.current?.callID === callID) {
            currentCallRef.current = null;
            setShowIncomingModal(false);
            setIncomingInvitation(null);
            setCallState({ status: "idle" });
          }
        });

        zimService.setOnInvitationTimeout((callID) => {
          console.log("📥 [setOnInvitationTimeout]", callID);
          if (currentCallRef.current?.callID === callID) {
            currentCallRef.current = null;
            setShowIncomingModal(false);
            setIncomingInvitation(null);
            setCallState({ status: "idle" });
          }
        });

        zimService.setOnInvitationAccepted(async (info) => {
          console.log("📥 [setOnInvitationAccepted]", info);
          const cur = currentCallRef.current;
          if (!cur?.isCaller) return;

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
            isVideo,
          });

          try {
            await callEngine.loginRoom(roomID, actualUserId, userName, expressToken);
            await callEngine.startPublishingForCall(`stream_${actualUserId}`);
          } catch (err) {
            console.error("❌ start audio (caller):", err);
          }
        });

        zimService.setOnInvitationRejected((info) => {
          console.log("📥 [setOnInvitationRejected]", info);
          const cur = currentCallRef.current;
          if (!cur?.isCaller) return;

          currentCallRef.current = null;
          setShowIncomingModal(false);
          setIncomingInvitation(null);
          setCallState({ status: "idle" });
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
  }, [appId, actualUserId, userName, zimToken, expressToken, fetchFreshToken]);

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
      console.log("🎯 [startCall] targetUserId:", targetUserId, "isVideo:", isVideo);

      if (!zimRef.current || callState.status !== "idle" || !isReady || !isZimReady) {
        console.warn("⚠️ [startCall] Not ready or busy");
        return;
      }

      const sortedIds = [actualUserId, targetUserId].sort();
      const roomID = `call_${sortedIds[0]}_${sortedIds[1]}_${Date.now()}`;

      currentCallRef.current = {
        callID: "",
        roomID,
        peerUserId: targetUserId,
        peerName: targetUserName,
        isCaller: true,
        isVideo,
      };

      setCallState({
        status: "calling",
        callID: "",
        roomID,
        peerUserId: targetUserId,
        peerName: targetUserName,
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
          setCallState({ status: "idle" });
        }
      } catch (err) {
        console.error("❌ [startCall] Error:", err);
        currentCallRef.current = null;
        setCallState({ status: "idle" });
      }
    },
    [callState.status, actualUserId, isReady, isZimReady, userAvatar]
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

      // 🔑 جلب Token جديد للمتلقي
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

    try {
      await zimRef.current.rejectInvitation(cur.callID);
      await zimRef.current.sendSignalMessage(
        cur.peerUserId,
        "REJECT_CALL",
        cur.callID
      );
    } catch (err) {
      console.error("❌ [rejectCall] Error:", err);
    } finally {
      currentCallRef.current = null;
      setShowIncomingModal(false);
      setIncomingInvitation(null);
      setCallState({ status: "idle" });
    }
  }, []);

  // ==========================================================
  // endCall
  // ==========================================================
  const endCall = useCallback(async () => {
    const cur = currentCallRef.current;
    const engine = engineRef.current;

    try {
      if (cur && zimRef.current) {
        if (cur.isCaller && callState.status === "calling" && cur.callID) {
          await zimRef.current.cancelInvitation(cur.callID, cur.peerUserId);
        }
        if (callState.status === "connected" && cur.callID) {
          await zimRef.current.sendSignalMessage(
            cur.peerUserId,
            "REJECT_CALL",
            cur.callID
          );
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
    }
  }, [callState.status]);

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