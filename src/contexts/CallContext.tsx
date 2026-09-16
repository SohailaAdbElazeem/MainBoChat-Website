// src/contexts/CallContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CallChat {
  chatId: string;
  name: string;
  userinfo?: {
    name?: string;
    username?: string;
    img?: string;
  };
}

type CallType = 'audio' | 'video';

interface CallContextType {
  isCallModalOpen: boolean;
  selectedCallChat: CallChat | null;
  callMinutes: { free: number; total: number };
  isStarting: boolean;
  openCallModal: (chat: CallChat) => void;
  closeCallModal: () => void;
  setCallMinutes: (m: { free: number; total: number }) => void;
  setIsStarting: (s: boolean) => void;
  startCallHandler: ((type: CallType) => void) | null;
  setStartCallHandler: (fn: ((type: CallType) => void) | null) => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedCallChat, setSelectedCallChat] = useState<CallChat | null>(null);
  const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
  const [isStarting, setIsStarting] = useState(false);
  const [startCallHandler, setStartCallHandler] = useState<
    ((type: CallType) => void) | null
  >(null);

  const openCallModal = (chat: CallChat) => {
    setSelectedCallChat(chat);
    setIsCallModalOpen(true);
  };

  const closeCallModal = () => {
    setIsCallModalOpen(false);
    setSelectedCallChat(null);
  };

  return (
    <CallContext.Provider
      value={{
        isCallModalOpen,
        selectedCallChat,
        callMinutes,
        isStarting,
        openCallModal,
        closeCallModal,
        setCallMinutes,
        setIsStarting,
        startCallHandler,
        setStartCallHandler,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCallContext() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCallContext must be used within CallProvider');
  return ctx;
}