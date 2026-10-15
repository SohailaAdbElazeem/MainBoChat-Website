// // src/components/calls/types.ts

// export type CallType = 'audio' | 'video';

// export interface ActiveCall {
//   callId: string;
//   roomName: string;
//   callType: CallType;
//   calleeId: string;
//   calleeName: string;
//   direction: 'outgoing' | 'incoming';
// }

// export interface GroupCallParticipant {
//   id: string;
//   name: string;
//   avatar: string;
// }

// export interface CallModalProps {
//   isOpen: boolean;
//   calleeName: string;
//   calleeUsername?: string;
//   calleeAvatar?: string;
//   calleeId: string;
//   freeMinutes?: number;
//   isStarting?: boolean;
//   isGroupCall?: boolean;
//   groupAvatars?: string[];
//   groupCount?: number;
//   callType?: CallType;
//   onClose: () => void;
//   onStart?: (type: CallType) => void;
//   onEnd?: () => void;
// }



// src/components/calls/types.ts

export type CallType = 'audio' | 'video';

export interface ActiveCall {
  callId: string;
  roomName: string;
  callType: CallType;
  calleeId: string;
  calleeName: string;
  direction: 'outgoing' | 'incoming';
  /** اختياري: لربط توكنات الاتصال مع ZegoCloud أو MediaSFU */
  token?: string;
  /** اختياري: الصورة الشخصية للمستقبل أو اسم المجموعة */
  calleeAvatar?: string;
}

export interface GroupCallParticipant {
  id: string;
  name: string;
  avatar: string;
  /** اختياري: حالة الميكروفون والكاميرا في المكالمة الجماعية */
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export interface CallModalProps {
  isOpen: boolean;
  calleeName: string;
  calleeUsername?: string;
  calleeAvatar?: string;
  calleeId: string;
  freeMinutes?: number;
  isStarting?: boolean;
  isGroupCall?: boolean;
  groupAvatars?: string[];
  groupCount?: number;
  callType?: CallType;
  onClose: () => void;
  onStart?: (type: CallType) => void;
  onEnd?: () => void;
}