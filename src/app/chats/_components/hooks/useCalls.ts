// // src/app/chats/_components/hooks/useCalls.ts
// 'use client';

// import { useState, useCallback } from 'react';
// import { toast } from 'react-hot-toast';
// import {
//   startCallApi,
//   joinCallApi,
//   endCallApi,
//   getActiveCallsApi,
// } from '@/lib/callsApi';
// import { ActiveCall, CallType, GroupCallParticipant } from '../types';

// interface UseCallsProps {
//   apiBase: string;
//   token: string | null;
// }

// // دالة مساعدة لتنظيف رابط API
// const cleanUrl = (base: string) =>
//   base.replace(/\/+$/, '').replace(/\/chats$/, '');

// export function useCalls({ apiBase, token }: UseCallsProps) {
//   // ===== بيانات عامة =====
//   const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
//   const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
//   const [isStarting, setIsStarting] = useState(false);

//   // ===== مكالمة فردية =====
//   const [isCallModalOpen, setIsCallModalOpen] = useState(false);
//   const [selectedCallChatId, setSelectedCallChatId] = useState<string | null>(
//     null
//   );

//   // ===== مكالمة جماعية =====
//   const [isGroupCallModalOpen, setIsGroupCallModalOpen] = useState(false);
//   const [groupParticipants, setGroupParticipants] = useState<
//     GroupCallParticipant[]
//   >([]);

//   // ========================================
//   // ===== مكالمة فردية =====
//   // ========================================
//   const openCallModal = useCallback((chatId: string) => {
//     setSelectedCallChatId(chatId);
//     setIsCallModalOpen(true);
//   }, []);

//   const closeCallModal = useCallback(() => {
//     setIsCallModalOpen(false);
//     setSelectedCallChatId(null);
//   }, []);

//   const startCall = useCallback(
//     async (type: CallType, calleeId: string, calleeName: string) => {
//       if (!token) {
//         toast.error('يرجى تسجيل الدخول أولاً');
//         return;
//       }

//       if (callMinutes.free <= 0) {
//         toast.error('رصيدك من الدقائق المجانية قد انتهى');
//         return;
//       }

//       setIsStarting(true);

//       // دالة تنفيذ الاتصال الأساسية
//       const executeCall = async () => {
//         const result = await startCallApi(apiBase, token, {
//           calleeId,
//           callType: type,
//         });

//         const callId =
//           result.callId || result.response?.callId || result._id;
//         const roomName =
//           result.roomName ||
//           result.response?.roomName ||
//           `call_${calleeId}`;

//         setActiveCall({
//           callId,
//           roomName,
//           callType: type,
//           calleeId,
//           calleeName,
//           direction: 'outgoing',
//         });

//         setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
//         closeCallModal();
//         toast.success(`جاري الاتصال بـ ${calleeName}...`);
//       };

//       try {
//         await executeCall();
//       } catch (error: any) {
//         console.error('Error starting call:', error);

//         const isConflict =
//           error.status === 409 ||
//           error.message?.includes('409') ||
//           error.message?.includes('active call');

//         if (isConflict) {
//           const loadingToast = toast.loading(
//             'جاري إنهاء المكالمة المعلقة وإعادة الاتصال...'
//           );

//           try {
//             // 1. جلب بيانات المكالمة النشطة للحصول على callId
//             let activeCallId: string | undefined;
//             try {
//               const activeRes = await getActiveCallsApi(apiBase, token);
//               activeCallId = activeRes.callId; // ✅ موحد
//             } catch (e) {
//               console.warn('Could not fetch active call:', e);
//             }

//             if (!activeCallId) {
//               toast.dismiss(loadingToast);
//               toast.error(
//                 'مش قادر أحدد المكالمة المعلقة. افتحي المكالمة الحالية وأنهيها يدوياً.'
//               );
//               return;
//             }

//             // 2. إنهاء المكالمة المعلقة
//             await endCallApi(apiBase, token, activeCallId);

//             // 3. إعادة محاولة الاتصال تلقائياً
//             await executeCall();
//             toast.dismiss(loadingToast);
//             toast.success('تم إنهاء المكالمة السابقة وإعادة الاتصال');
//           } catch (retryErr: any) {
//             toast.dismiss(loadingToast);
//             console.error('Retry failed:', retryErr);
//             toast.error(
//               'تعذر إنهاء المكالمة السابقة تلقائياً. افتحي المكالمة وأنهيها يدوياً.'
//             );
//           }
//         } else {
//           toast.error(error.message || 'فشل بدء المكالمة');
//         }
//       } finally {
//         setIsStarting(false);
//       }
//     },
//     [apiBase, token, callMinutes.free, closeCallModal]
//   );

//   // ========================================
//   // ===== مكالمة جماعية =====
//   // ========================================
//   const openGroupCallModal = useCallback(
//     (participants: GroupCallParticipant[]) => {
//       setGroupParticipants(participants);
//       setIsGroupCallModalOpen(true);
//     },
//     []
//   );

//   const closeGroupCallModal = useCallback(() => {
//     setIsGroupCallModalOpen(false);
//   }, []);

//   const startGroupCall = useCallback(
//     async (type: CallType) => {
//       if (!token) {
//         toast.error('يرجى تسجيل الدخول أولاً');
//         return;
//       }

//       if (callMinutes.free <= 0) {
//         toast.error('رصيدك من الدقائق المجانية قد انتهى');
//         return;
//       }

//       if (groupParticipants.length === 0) {
//         toast.error('لا يوجد مشاركون في المكالمة');
//         return;
//       }

//       setIsStarting(true);

//       const executeGroupCall = async () => {
//         const baseUrl = cleanUrl(apiBase);
//         const res = await fetch(`${baseUrl}/chats/calls/group/start`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             participantIds: groupParticipants.map((p) => p.id),
//             callType: type,
//           }),
//         });

//         if (!res.ok) {
//           if (res.status === 409) {
//             throw new Error('409: You are already in an active call');
//           }
//           throw new Error('فشل بدء المكالمة الجماعية');
//         }

//         const data = await res.json();

//         setActiveCall({
//           callId: data.callId,
//           roomName: data.roomName,
//           callType: type,
//           calleeId: data.calleeId || groupParticipants[0]?.id || '',
//           calleeName: data.calleeName || 'مكالمة جماعية',
//           direction: 'outgoing',
//         });

//         setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
//         closeGroupCallModal();
//         toast.success('جاري بدء المكالمة الجماعية...');
//       };

//       try {
//         await executeGroupCall();
//       } catch (error: any) {
//         console.error('Error starting group call:', error);

//         const isConflict =
//           error.message?.includes('409') ||
//           error.message?.includes('already in an active call');

//         if (isConflict) {
//           const loadingToast = toast.loading(
//             'جاري إنهاء المكالمة المعلقة وإعادة المحاولة...'
//           );

//           try {
//             let activeCallId: string | undefined;
//             try {
//               const activeRes = await getActiveCallsApi(apiBase, token);
//               activeCallId = activeRes.callId;
//             } catch (e) {
//               console.warn('Could not fetch active call:', e);
//             }

//             if (!activeCallId) {
//               toast.dismiss(loadingToast);
//               toast.error(
//                 'مش قادر أحدد المكالمة المعلقة. افتحي المكالمة الحالية وأنهيها يدوياً.'
//               );
//               return;
//             }

//             await endCallApi(apiBase, token, activeCallId);
//             await executeGroupCall();
//             toast.dismiss(loadingToast);
//             toast.success('تم إنهاء المكالمة السابقة وإعادة المحاولة');
//           } catch (retryErr: any) {
//             toast.dismiss(loadingToast);
//             console.error('Retry failed:', retryErr);
//             toast.error('تعذر إنهاء المكالمة السابقة تلقائياً.');
//           }
//         } else {
//           toast.error(error.message || 'فشل بدء المكالمة الجماعية');
//         }
//       } finally {
//         setIsStarting(false);
//       }
//     },
//     [
//       apiBase,
//       token,
//       callMinutes.free,
//       groupParticipants,
//       closeGroupCallModal,
//     ]
//   );

//   // ========================================
//   // ===== مشترك =====
//   // ========================================
//   const joinCall = useCallback(
//     async (callData: ActiveCall) => {
//       if (!token) return;
//       try {
//         await joinCallApi(apiBase, token, callData.callId);
//         setActiveCall(callData);
//       } catch (error) {
//         toast.error('فشل الانضمام للمكالمة');
//       }
//     },
//     [apiBase, token]
//   );

//   const endCall = useCallback(async () => {
//     if (!activeCall || !token) {
//       setActiveCall(null);
//       return;
//     }
//     try {
//       await endCallApi(apiBase, token, activeCall.callId);
//     } catch (error) {
//       console.error('Error ending call:', error);
//     } finally {
//       setActiveCall(null);
//     }
//   }, [activeCall, apiBase, token]);

//   return {
//     // ===== بيانات عامة =====
//     callMinutes,
//     activeCall,
//     isStarting,

//     // ===== مكالمة فردية =====
//     isCallModalOpen,
//     selectedCallChatId,
//     openCallModal,
//     closeCallModal,
//     startCall,

//     // ===== مكالمة جماعية =====
//     isGroupCallModalOpen,
//     groupParticipants,
//     openGroupCallModal,
//     closeGroupCallModal,
//     startGroupCall,

//     // ===== مشترك =====
//     joinCall,
//     endCall,
//   };
// }


// ////////////////
// src/app/chats/_components/hooks/useCalls.ts
'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  startCallApi,
  joinCallApi,
  endCallApi,
  getActiveCallsApi,
} from '@/lib/callsApi';
import { ActiveCall, CallType, GroupCallParticipant } from '../types';

interface UseCallsProps {
  apiBase: string;
  token: string | null;
}

const cleanUrl = (base: string) =>
  base.replace(/\/+$/, '').replace(/\/chats$/, '');

// ============================================
// ⚙️ إعدادات وضع التجربة (TEST MODE)
// ============================================
const TEST_MODE = true;
const TEST_ROOM_ID = 'bochat-test-room-123';
// ============================================

export function useCalls({ apiBase, token }: UseCallsProps) {
  const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedCallChatId, setSelectedCallChatId] = useState<string | null>(
    null
  );

  const [isGroupCallModalOpen, setIsGroupCallModalOpen] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState<
    GroupCallParticipant[]
  >([]);

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

      if (!TEST_MODE && callMinutes.free <= 0) {
        toast.error('رصيدك من الدقائق المجانية قد انتهى');
        return;
      }

      setIsStarting(true);

      // 🧪 وضع التجربة
      if (TEST_MODE) {
        try {
          const mockCallId = TEST_ROOM_ID;
          const mockRoomName = TEST_ROOM_ID;

          setActiveCall({
            callId: mockCallId,
            roomName: mockRoomName,
            callType: type,
            calleeId,
            calleeName,
            direction: 'outgoing',
          });

          setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
          closeCallModal();
          toast.success(`جاري الاتصال بـ ${calleeName}... (وضع التجربة)`);
        } catch (error: any) {
          console.error('Test mode error:', error);
          toast.error('حدث خطأ في وضع التجربة');
        } finally {
          setIsStarting(false);
        }
        return;
      }

      // 🚀 الوضع الحقيقي
      const executeCall = async () => {
        const result = await startCallApi(apiBase, token, {
          calleeId,
          callType: type,
        });

        const callId =
          result.callId || result.response?.callId || result._id;
        const roomName =
          result.roomName ||
          result.response?.roomName ||
          `call_${calleeId}`;

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
      };

      try {
        await executeCall();
      } catch (error: any) {
        console.error('Error starting call:', error);

        const isConflict =
          error.status === 409 ||
          error.message?.includes('409') ||
          error.message?.includes('active call');

        if (isConflict) {
          const loadingToast = toast.loading(
            'جاري إنهاء المكالمة المعلقة وإعادة الاتصال...'
          );

          try {
            let activeCallId: string | undefined;
            try {
              const activeRes = await getActiveCallsApi(apiBase, token);
              activeCallId = activeRes.callId;
            } catch (e) {
              console.warn('Could not fetch active call:', e);
            }

            if (!activeCallId) {
              toast.dismiss(loadingToast);
              toast.error(
                'مش قادر أحدد المكالمة المعلقة. افتحي المكالمة الحالية وأنهيها يدوياً.'
              );
              return;
            }

            await endCallApi(apiBase, token, activeCallId);
            await executeCall();
            toast.dismiss(loadingToast);
            toast.success('تم إنهاء المكالمة السابقة وإعادة الاتصال');
          } catch (retryErr: any) {
            toast.dismiss(loadingToast);
            console.error('Retry failed:', retryErr);
            toast.error(
              'تعذر إنهاء المكالمة السابقة تلقائياً. افتحي المكالمة وأنهيها يدوياً.'
            );
          }
        } else {
          toast.error(error.message || 'فشل بدء المكالمة');
        }
      } finally {
        setIsStarting(false);
      }
    },
    [apiBase, token, callMinutes.free, closeCallModal]
  );

  const openGroupCallModal = useCallback(
    (participants: GroupCallParticipant[]) => {
      setGroupParticipants(participants);
      setIsGroupCallModalOpen(true);
    },
    []
  );

  const closeGroupCallModal = useCallback(() => {
    setIsGroupCallModalOpen(false);
  }, []);

  const startGroupCall = useCallback(
    async (type: CallType) => {
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        return;
      }

      if (!TEST_MODE && callMinutes.free <= 0) {
        toast.error('رصيدك من الدقائق المجانية قد انتهى');
        return;
      }

      if (groupParticipants.length === 0) {
        toast.error('لا يوجد مشاركون في المكالمة');
        return;
      }

      setIsStarting(true);

      // 🧪 وضع التجربة
      if (TEST_MODE) {
        try {
          const mockCallId = `${TEST_ROOM_ID}-group`;

          setActiveCall({
            callId: mockCallId,
            roomName: mockCallId,
            callType: type,
            calleeId: groupParticipants[0]?.id || '',
            calleeName: 'مكالمة جماعية',
            direction: 'outgoing',
          });

          setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
          closeGroupCallModal();
          toast.success('جاري بدء المكالمة الجماعية... (وضع التجربة)');
        } catch (error: any) {
          console.error('Test mode error:', error);
          toast.error('حدث خطأ في وضع التجربة');
        } finally {
          setIsStarting(false);
        }
        return;
      }

      // 🚀 الوضع الحقيقي
      const executeGroupCall = async () => {
        const baseUrl = cleanUrl(apiBase);
        const res = await fetch(`${baseUrl}/chats/calls/group/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantIds: groupParticipants.map((p) => p.id),
            callType: type,
          }),
        });

        if (!res.ok) {
          if (res.status === 409) {
            throw new Error('409: You are already in an active call');
          }
          throw new Error('فشل بدء المكالمة الجماعية');
        }

        const data = await res.json();

        setActiveCall({
          callId: data.callId,
          roomName: data.roomName,
          callType: type,
          calleeId: data.calleeId || groupParticipants[0]?.id || '',
          calleeName: data.calleeName || 'مكالمة جماعية',
          direction: 'outgoing',
        });

        setCallMinutes((prev) => ({ ...prev, free: prev.free - 1 }));
        closeGroupCallModal();
        toast.success('جاري بدء المكالمة الجماعية...');
      };

      try {
        await executeGroupCall();
      } catch (error: any) {
        console.error('Error starting group call:', error);

        const isConflict =
          error.message?.includes('409') ||
          error.message?.includes('already in an active call');

        if (isConflict) {
          const loadingToast = toast.loading(
            'جاري إنهاء المكالمة المعلقة وإعادة المحاولة...'
          );

          try {
            let activeCallId: string | undefined;
            try {
              const activeRes = await getActiveCallsApi(apiBase, token);
              activeCallId = activeRes.callId;
            } catch (e) {
              console.warn('Could not fetch active call:', e);
            }

            if (!activeCallId) {
              toast.dismiss(loadingToast);
              toast.error(
                'مش قادر أحدد المكالمة المعلقة. افتحي المكالمة الحالية وأنهيها يدوياً.'
              );
              return;
            }

            await endCallApi(apiBase, token, activeCallId);
            await executeGroupCall();
            toast.dismiss(loadingToast);
            toast.success('تم إنهاء المكالمة السابقة وإعادة المحاولة');
          } catch (retryErr: any) {
            toast.dismiss(loadingToast);
            console.error('Retry failed:', retryErr);
            toast.error('تعذر إنهاء المكالمة السابقة تلقائياً.');
          }
        } else {
          toast.error(error.message || 'فشل بدء المكالمة الجماعية');
        }
      } finally {
        setIsStarting(false);
      }
    },
    [
      apiBase,
      token,
      callMinutes.free,
      groupParticipants,
      closeGroupCallModal,
    ]
  );

  const joinCall = useCallback(
    async (callData: ActiveCall) => {
      if (!token) return;

      if (TEST_MODE) {
        setActiveCall(callData);
        toast.success('جاري الانضمام للمكالمة... (وضع التجربة)');
        return;
      }

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

    if (TEST_MODE) {
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
    activeCall,
    isStarting,
    isCallModalOpen,
    selectedCallChatId,
    openCallModal,
    closeCallModal,
    startCall,
    isGroupCallModalOpen,
    groupParticipants,
    openGroupCallModal,
    closeGroupCallModal,
    startGroupCall,
    joinCall,
    endCall,
  };
}