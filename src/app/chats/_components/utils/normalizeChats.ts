// src/app/chats/_components/utils/normalizeChats.ts
import { ChatItem, Message } from '../types';

export function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
  if (!Array.isArray(rawChats)) return [];

  const map: Record<string, ChatItem> = {};

  rawChats.forEach((chat) => {
    const isGroup = chat.chatType === 'group' || chat.isGroup === true;
    const realGroupId = chat.groupId || chat.id || chat._id;
    const chatKey = isGroup
      ? realGroupId
      : (chat.otherUserId || chat.id || chat.chatId);

    const lastMsgText = typeof chat.lastMessage === 'string'
      ? chat.lastMessage
      : chat.lastMessage?.text || chat.lastMessage || '';

    const msgObj: Message = {
      _id: chat.id || chatKey,
      sender: chat.lastMessage?.sender || chatKey,
      receiver: myId,
      message: lastMsgText,
      timestamp: chat.timestamp || new Date().toISOString(),
      seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
      type: chat.lastMessageType || 'text',
    };

    map[chatKey] = {
      chatId: chatKey,
      groupId: isGroup ? realGroupId : undefined,
      chatType: chat.chatType || (isGroup ? 'group' : 'private'),
      name: chat.name || 'مستخدم',
      avatar: chat.avatar || '',
      description: chat.description || '',
      userinfo: {
        _id: chatKey,
        name: chat.name || 'مستخدم',
        img: chat.avatar || '/imgs/user.png',
        avatar: chat.avatar || '/imgs/user.png',
      },
      lastMessage: msgObj,
      unreadCount: chat.unreadCount || 0,
      seen: chat.seen ?? false,
      isGroup,
      isFavorite: chat.isStarred || false,
      typing: false,
      members: chat.members || [],
      isAdmin: chat.isAdmin || false,
    } as any;
  });

  return Object.values(map).sort(
    (a, b) =>
      new Date(b.lastMessage?.timestamp || 0).getTime() -
      new Date(a.lastMessage?.timestamp || 0).getTime()
  );
}