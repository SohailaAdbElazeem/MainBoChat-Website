// src/app/chats/_components/hook/useGroupCall.ts
'use client';

import { useState, useCallback } from 'react';
import { CallType, GroupCallParticipant, ActiveCall } from '../../types';

interface UseGroupCallOptions {
  participants: GroupCallParticipant[];
  freeMinutes?: number;
  apiBase: string;
  token: string | null;
  onCallStarted?: (call: ActiveCall) => void;
  onCallEnded?: () => void;
}

export function useGroupCall({
  participants,
  freeMinutes = 60,
  apiBase,
  token,
  onCallStarted,
  onCallEnded,
}: UseGroupCallOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setIsStarting(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsStarting(false);
  }, []);

  const startCall = useCallback(
    async (type: CallType) => {
      if (freeMinutes <= 0) return;

      setIsStarting(true);

      try {
        // ✅ API call لإنشاء غرفة جماعية
        const res = await fetch(`${apiBase}/chats/calls/group/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantIds: participants.map((p) => p.id),
            type,
          }),
        });

        if (!res.ok) throw new Error('فشل بدء المكالمة');

        const data = await res.json();

        // ✅ بناء ActiveCall بنفس الـ interface بتاعك
        const call: ActiveCall = {
          callId: data.callId,
          roomName: data.roomName,
          callType: type,                        // ✅ callType مش type
          calleeId: data.calleeId || '',         // ✅ أول مشارك أو فاضي
          calleeName: data.calleeName || 'مكالمة جماعية',
          direction: 'outgoing',                 // ✅ دايماً outgoing للبدء
        };

        setActiveCall(call);
        setIsOpen(false);
        onCallStarted?.(call);
      } catch (err) {
        console.error('Group call error:', err);
      } finally {
        setIsStarting(false);
      }
    },
    [participants, freeMinutes, apiBase, token, onCallStarted]
  );

  const endCall = useCallback(() => {
    setActiveCall(null);
    onCallEnded?.();
  }, [onCallEnded]);

  return {
    // مودال
    isOpen,
    isStarting,
    openModal,
    closeModal,
    startCall,
    // مكالمة نشطة
    activeCall,
    endCall,
    // بيانات
    freeMinutes,
    participants,
  };
}