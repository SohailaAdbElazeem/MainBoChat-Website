// src/app/chats/_components/hooks/useCalls.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { startCallApi, joinCallApi, endCallApi } from '@/lib/callsApi';
import { ActiveCall, CallType } from '../types';

interface UseCallsProps {
  apiBase: string;
  token: string | null;
}

export function useCalls({ apiBase, token }: UseCallsProps) {
  const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedCallChatId, setSelectedCallChatId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const openCallModal = useCallback((chatId: string) => {
    setSelectedCallChatId(chatId);
    setIsCallModalOpen(true);
  }, []);

  const closeCallModal = useCallback(() => {
    setIsCallModalOpen(false);
    setSelectedCallChatId(null);
  }, []);

  const startCall = useCallback(
    async (type: CallType, calleeId: string, calleeName: string) => {
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        return;
      }

      if (callMinutes.free <= 0) {
        toast.error('رصيدك من الدقائق المجانية قد انتهى');
        return;
      }

      setIsStarting(true);
      try {
        const result = await startCallApi(apiBase, token, {
          calleeId,
          callType: type,
        });

        // نتوقع: { success: true, callId: "...", roomName: "..." }
        const callId = result.callId || result.response?.callId;
        const roomName = result.roomName || result.response?.roomName || `call_${calleeId}`;

        setActiveCall({
          callId,
          roomName,
          callType: type,
          calleeId,
          calleeName,
          direction: 'outgoing',
        });

        setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
        closeCallModal();
        toast.success(`جاري الاتصال بـ ${calleeName}...`);
      } catch (error: any) {
        console.error('Error starting call:', error);
        toast.error(error.message || 'فشل بدء المكالمة');
      } finally {
        setIsStarting(false);
      }
    },
    [apiBase, token, callMinutes.free, closeCallModal]
  );

  const joinCall = useCallback(
    async (callData: ActiveCall) => {
      if (!token) return;
      try {
        await joinCallApi(apiBase, token, callData.callId);
        setActiveCall(callData);
      } catch (error) {
        toast.error('فشل الانضمام للمكالمة');
      }
    },
    [apiBase, token]
  );

  const endCall = useCallback(async () => {
    if (!activeCall || !token) {
      setActiveCall(null);
      return;
    }
    try {
      await endCallApi(apiBase, token, activeCall.callId);
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      setActiveCall(null);
    }
  }, [activeCall, apiBase, token]);

  return {
    callMinutes,
    isCallModalOpen,
    selectedCallChatId,
    activeCall,
    isStarting,
    openCallModal,
    closeCallModal,
    startCall,
    joinCall,
    endCall,
  };
}