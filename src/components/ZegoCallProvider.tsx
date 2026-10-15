// src/components/ZegoCallProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
} from "react";
import { useCall, CallState } from "@/hooks/useCall";
// import type { CallInvitation } from "@/lib/zego/zimService";
// import IncomingCallModal from "@/components/calls/IncomingCallModal"; // ❌ معطّل
// import CallScreen from "@/components/calls/CallScreen"; // ❌ معطّل

interface ZegoContextType {
  isReady: boolean;
  isZimReady: boolean;
  callState: CallState;
  isMicMuted: boolean;
  isCameraMuted: boolean;
  isSpeakerOn: boolean;
  remoteStreamIds: string[];
  autoplayBlocked: string | null;
  startCall: (
    targetUserId: string,
    targetUserName: string,
    isVideo: boolean,
    targetAvatar?: string,
    myAvatar?: string,
    targetUsername?: string
  ) => void;
  startGroupCall: (roomId: string, groupName: string, isVideo: boolean) => void;
  joinExistingCall: (roomId: string, isVideo?: boolean) => void;
  endCall: () => void;
  acceptCall: () => Promise<void> | void; // ⭐ جديد
  rejectCall: () => Promise<void> | void; // ⭐ جديد
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
  switchCamera: (isFront: boolean) => void;
  resumeAudio: () => void;
}

const ZegoContext = createContext<ZegoContextType>({
  isReady: false,
  isZimReady: false,
  callState: { status: "idle" },
  isMicMuted: false,
  isCameraMuted: false,
  isSpeakerOn: false,
  remoteStreamIds: [],
  autoplayBlocked: null,
  startCall: () => {},
  startGroupCall: () => {},
  joinExistingCall: () => {},
  endCall: () => {},
  acceptCall: () => {},
  rejectCall: () => {},
  toggleMic: () => {},
  toggleCamera: () => {},
  toggleSpeaker: () => {},
  switchCamera: () => {},
  resumeAudio: () => {},
});

export const useZegoCall = () => useContext(ZegoContext);

interface ZegoCallProviderProps {
  children: React.ReactNode;
  userID?: string;
  userName?: string;
  userAvatar?: string;
  appId: number;
  zimToken: string;
  expressToken: string;
}

export default function ZegoCallProvider({
  children,
  userID,
  userName,
  userAvatar,
  appId,
  zimToken,
  expressToken,
}: ZegoCallProviderProps) {
  const {
    callState,
    isReady,
    isZimReady,
    isMicMuted,
    isCameraMuted,
    isSpeakerOn,
    remoteStreamIds,
    autoplayBlocked,
    startCall: startCallInternal,
    acceptCall: acceptCallInternal,
    rejectCall: rejectCallInternal,
    endCall: endCallInternal,
    joinExistingCall: joinExistingCallInternal,
    startGroupCall: startGroupCallInternal,
    toggleMic: toggleMicInternal,
    toggleCamera: toggleCameraInternal,
    toggleSpeaker: toggleSpeakerInternal,
    switchCamera: switchCameraInternal,
    resumeAudio,
  } = useCall({
    appId,
    userId: userID || "",
    userName: userName || "",
    userAvatar,
    zimToken,
    expressToken,
  });

  // ==========================================================
  // Context value
  // ==========================================================
  const value: ZegoContextType = {
    isReady,
    isZimReady,
    callState,
    isMicMuted,
    isCameraMuted,
    isSpeakerOn,
    remoteStreamIds,
    autoplayBlocked,
    startCall: startCallInternal,
    startGroupCall: (r, g, v) => startGroupCallInternal(r, g, v),
    joinExistingCall: (r, v = true) => joinExistingCallInternal(r, v),
    endCall: endCallInternal,
    acceptCall: acceptCallInternal, // ⭐
    rejectCall: rejectCallInternal, // ⭐
    toggleMic: toggleMicInternal,
    toggleCamera: toggleCameraInternal,
    toggleSpeaker: toggleSpeakerInternal,
    switchCamera: switchCameraInternal,
    resumeAudio,
  };

  return (
    <ZegoContext.Provider value={value}>
      {children}

      {/* ❌ IncomingCallModal معطّل — الكارت في الـ Sidebar هو البديل */}
      {/* <IncomingCallModal
        isOpen={showIncomingModal}
        invitation={incomingInvitation as CallInvitation | null}
        onAccept={handleAcceptIncoming}
        onReject={handleRejectIncoming}
      /> */}

      {/* ❌ CallScreen معطّل — الكارت في الـ Sidebar هو البديل */}
      {/* {showCallScreen && (
        <CallScreen ... />
      )} */}
    </ZegoContext.Provider>
  );
}