// // // src/contexts/CallContext.tsx
// // 'use client';

// // import { createContext, useContext, useState, ReactNode } from 'react';

// // export interface CallChat {
// //   chatId: string;
// //   name: string;
// //   userinfo?: {
// //     name?: string;
// //     username?: string;
// //     img?: string;
// //   };
// // }

// // type CallType = 'audio' | 'video';

// // interface CallContextType {
// //   isCallModalOpen: boolean;
// //   selectedCallChat: CallChat | null;
// //   callMinutes: { free: number; total: number };
// //   isStarting: boolean;
// //   openCallModal: (chat: CallChat) => void;
// //   closeCallModal: () => void;
// //   setCallMinutes: (m: { free: number; total: number }) => void;
// //   setIsStarting: (s: boolean) => void;
// //   startCallHandler: ((type: CallType) => void) | null;
// //   setStartCallHandler: (fn: ((type: CallType) => void) | null) => void;
// // }

// // const CallContext = createContext<CallContextType | null>(null);

// // export function CallProvider({ children }: { children: ReactNode }) {
// //   const [isCallModalOpen, setIsCallModalOpen] = useState(false);
// //   const [selectedCallChat, setSelectedCallChat] = useState<CallChat | null>(null);
// //   const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
// //   const [isStarting, setIsStarting] = useState(false);
// //   const [startCallHandler, setStartCallHandler] = useState<
// //     ((type: CallType) => void) | null
// //   >(null);

// //   const openCallModal = (chat: CallChat) => {
// //     setSelectedCallChat(chat);
// //     setIsCallModalOpen(true);
// //   };

// //   const closeCallModal = () => {
// //     setIsCallModalOpen(false);
// //     setSelectedCallChat(null);
// //   };

// //   return (
// //     <CallContext.Provider
// //       value={{
// //         isCallModalOpen,
// //         selectedCallChat,
// //         callMinutes,
// //         isStarting,
// //         openCallModal,
// //         closeCallModal,
// //         setCallMinutes,
// //         setIsStarting,
// //         startCallHandler,
// //         setStartCallHandler,
// //       }}
// //     >
// //       {children}
// //     </CallContext.Provider>
// //   );
// // }

// // export function useCallContext() {
// //   const ctx = useContext(CallContext);
// //   if (!ctx) throw new Error('useCallContext must be used within CallProvider');
// //   return ctx;
// // }

// // src/contexts/CallContext.tsx
// 'use client';

// import { createContext, useContext, useState, ReactNode } from 'react';

// // ✅ تحديث الواجهة لتشمل خصائص الجروب
// export interface CallChat {
//   chatId: string;
//   name: string;
//   userinfo?: {
//     name?: string;
//     username?: string;
//     img?: string;
//     avatar?: string;
//   };
//   // 👈 خصائص الجروب الجديدة
//   isGroup?: boolean;
//   type?: 'group' | 'single' | string;
//   members?: Array<{
//     _id?: string;
//     name?: string;
//     img?: string;
//     avatar?: string;
//     userinfo?: { name?: string; img?: string };
//   }>;
//   groupAvatars?: string[];
//   groupCount?: number;
// }

// type CallType = 'audio' | 'video';

// interface CallContextType {
//   isCallModalOpen: boolean;
//   selectedCallChat: CallChat | null;
//   callMinutes: { free: number; total: number };
//   isStarting: boolean;
//   openCallModal: (chat: CallChat) => void;
//   closeCallModal: () => void;
//   setCallMinutes: (m: { free: number; total: number }) => void;
//   setIsStarting: (s: boolean) => void;
//   startCallHandler: ((type: CallType) => void) | null;
//   setStartCallHandler: (fn: ((type: CallType) => void) | null) => void;
// }

// const CallContext = createContext<CallContextType | null>(null);

// export function CallProvider({ children }: { children: ReactNode }) {
//   const [isCallModalOpen, setIsCallModalOpen] = useState(false);
//   const [selectedCallChat, setSelectedCallChat] = useState<CallChat | null>(null);
//   const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
//   const [isStarting, setIsStarting] = useState(false);
//   const [startCallHandler, setStartCallHandler] = useState<
//     ((type: CallType) => void) | null
//   >(null);

//   // const openCallModal = (chat: CallChat) => {
//   //   setSelectedCallChat(chat);
//   //   setIsCallModalOpen(true);
//   // };
// const openCallModal = (chat: CallChat) => {
//   // 🔍 طباعة الكائن القادم عند الضغط على زر الاتصال
//   console.log('🔴 [CallContext] Data received in openCallModal:', chat);

//   const isGroup = Boolean(
//     chat.isGroup ||
//     chat.type === 'group' ||
//     (chat as any).chatType === 'group' ||
//     (Array.isArray(chat.members) && chat.members.length > 1) ||
//     (Array.isArray((chat as any).participants) && (chat as any).participants.length > 1)
//   );

//   // 🔍 طباعة النتيجة بعد الحساب
//   console.log('🟢 [CallContext] Computed isGroup:', isGroup);

//   setSelectedCallChat({
//     ...chat,
//     isGroup,
//   });
//   setIsCallModalOpen(true);
// };

//   const closeCallModal = () => {
//     setIsCallModalOpen(false);
//     setSelectedCallChat(null);
//   };

//   return (
//     <CallContext.Provider
//       value={{
//         isCallModalOpen,
//         selectedCallChat,
//         callMinutes,
//         isStarting,
//         openCallModal,
//         closeCallModal,
//         setCallMinutes,
//         setIsStarting,
//         startCallHandler,
//         setStartCallHandler,
//       }}
//     >
//       {children}
//     </CallContext.Provider>
//   );
// }

// export function useCallContext() {
//   const ctx = useContext(CallContext);
//   if (!ctx) throw new Error('useCallContext must be used within CallProvider');
//   return ctx;
// }


// ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
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
    avatar?: string;
  };
  isGroup?: boolean;
  type?: 'group' | 'single' | string;
  members?: Array<any>;
  groupAvatars?: string[];
  groupCount?: number;
}

type CallType = 'audio' | 'video';

// ✅ تعريف ActiveCall
export interface ActiveCall {
  callId: string;
  roomName: string;
  callType: CallType;
  calleeId: string;
  calleeName: string;
  direction: 'outgoing' | 'incoming';
}

interface CallContextType {
  isCallModalOpen: boolean;
  selectedCallChat: CallChat | null;
  callMinutes: { free: number; total: number };
  isStarting: boolean;
  activeCall: ActiveCall | null;  // ✅ ضيفي ده

  openCallModal: (chat: CallChat) => void;
  closeCallModal: () => void;
  setCallMinutes: (m: { free: number; total: number }) => void;
  setIsStarting: (s: boolean) => void;
  setActiveCall: (c: ActiveCall | null) => void;  // ✅ ضيفي ده

  startCallHandler: ((type: CallType) => void) | null;
  setStartCallHandler: (fn: ((type: CallType) => void) | null) => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedCallChat, setSelectedCallChat] = useState<CallChat | null>(null);
  const [callMinutes, setCallMinutes] = useState({ free: 35, total: 75 });
  const [isStarting, setIsStarting] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null); // ✅
  const [startCallHandler, setStartCallHandler] = useState<
    ((type: CallType) => void) | null
  >(null);

  const openCallModal = (chat: CallChat) => {
    console.log('🔴 [CallContext] Data received in openCallModal:', chat);

    const isGroup = Boolean(
      chat.isGroup ||
        chat.type === 'group' ||
        (chat as any).chatType === 'group' ||
        (Array.isArray(chat.members) && chat.members.length > 1) ||
        (Array.isArray((chat as any).participants) && (chat as any).participants.length > 1)
    );

    console.log('🟢 [CallContext] Computed isGroup:', isGroup);

    setSelectedCallChat({
      ...chat,
      isGroup,
    });
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
        activeCall,          // ✅
        openCallModal,
        closeCallModal,
        setCallMinutes,
        setIsStarting,
        setActiveCall,       // ✅
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