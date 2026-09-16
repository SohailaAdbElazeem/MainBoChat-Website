// src/app/chats/_components/types.ts
export type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';
export type CallType = 'audio' | 'video';

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  seenBy?: boolean;
  type?: string;
}

export interface ChatItem {
  chatId: string;
  groupId?: string;
  chatType: string;
  name: string;
  avatar: string;
  description: string;
  userinfo: {
    _id: string;
    name: string;
    img: string;
    avatar: string;
  };
  lastMessage?: Message;
  unreadCount: number;
  seen: boolean;
  isGroup: boolean;
  isFavorite: boolean;
  typing: boolean;
  members: any[];
  isAdmin: boolean;
}

export interface ActiveCall {
  callId: string;
  roomName: string;
  callType: CallType;
  calleeId: string;
  calleeName: string;
  direction: 'outgoing' | 'incoming';
}