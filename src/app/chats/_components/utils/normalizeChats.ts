// // src/app/chats/_components/utils/normalizeChats.ts
// import { ChatItem, Message } from '../types';

// export function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
//   if (!Array.isArray(rawChats)) return [];

//   const map: Record<string, ChatItem> = {};

//   rawChats.forEach((chat) => {
//     const isGroup = chat.chatType === 'group' || chat.isGroup === true;
//     const realGroupId = chat.groupId || chat.id || chat._id;
//     const chatKey = isGroup
//       ? realGroupId
//       : (chat.otherUserId || chat.id || chat.chatId);

//     const lastMsgText = typeof chat.lastMessage === 'string'
//       ? chat.lastMessage
//       : chat.lastMessage?.text || chat.lastMessage || '';

//     const msgObj: Message = {
//       _id: chat.id || chatKey,
//       sender: chat.lastMessage?.sender || chatKey,
//       receiver: myId,
//       message: lastMsgText,
//       timestamp: chat.timestamp || new Date().toISOString(),
//       seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
//       type: chat.lastMessageType || 'text',
//     };

//     map[chatKey] = {
//       chatId: chatKey,
//       groupId: isGroup ? realGroupId : undefined,
//       chatType: chat.chatType || (isGroup ? 'group' : 'private'),
//       name: chat.name || 'مستخدم',
//       avatar: chat.avatar || '',
//       description: chat.description || '',
//       userinfo: {
//         _id: chatKey,
//         name: chat.name || 'مستخدم',
//         img: chat.avatar || '/imgs/user.png',
//         avatar: chat.avatar || '/imgs/user.png',
//       },
//       lastMessage: msgObj,
//       unreadCount: chat.unreadCount || 0,
//       seen: chat.seen ?? false,
//       isGroup,
//       isFavorite: chat.isStarred || false,
//       typing: false,
//       members: chat.members || [],
//       isAdmin: chat.isAdmin || false,
//     } as any;
//   });

//   return Object.values(map).sort(
//     (a, b) =>
//       new Date(b.lastMessage?.timestamp || 0).getTime() -
//       new Date(a.lastMessage?.timestamp || 0).getTime()
//   );
// }




// ////////////////
// src/app/chats/_components/utils/normalizeChats.ts
import { ChatItem, Message } from '../types';

export function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
  if (!Array.isArray(rawChats)) return [];

  const map: Record<string, ChatItem> = {};

  rawChats.forEach((chat) => {
    const isGroup =
      chat.chatType === 'group' ||
      chat.isGroup === true ||
      chat.groupId !== undefined;

    // ✅ توحيد المعرف الأساسي
    const realGroupId = chat.groupId || chat.id || chat._id;
    const chatKey = isGroup
      ? realGroupId
      : chat.otherUserId || chat.id || chat.chatId || chat._id;

    if (!chatKey) return;

    const lastMsgText =
      typeof chat.lastMessage === 'string'
        ? chat.lastMessage
        : chat.lastMessage?.text || chat.lastMessage?.message || '';

    const msgObj: Message = {
      _id: chat.lastMessage?._id || chat.id || chatKey,
      sender: chat.lastMessage?.sender || chatKey,
      receiver: myId,
      message: lastMsgText,
      timestamp: chat.timestamp || chat.lastMessage?.timestamp || new Date().toISOString(),
      seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
      type: chat.lastMessageType || 'text',
    };

    // ✅ تحويل الأعضاء للشكل الموحد
    const normalizedMembers = Array.isArray(chat.members)
      ? chat.members.map((m: any) => ({
          _id: m.userId || m._id || m.id,
          userId: m.userId || m._id || m.id,
          name: m.name || m.username || 'مستخدم',
          img: m.image || m.img || m.avatar || '/imgs/user.png',
          avatar: m.image || m.img || m.avatar || '/imgs/user.png',
          image: m.image || m.img || m.avatar || '/imgs/user.png',
          username: m.username || m.name || '',
          role: m.role,
          isAdmin: m.role === 'admin' || m.role === 'owner',
          isOwner: m.role === 'owner',
          joinedAt: m.joinedAt,
        }))
      : [];

    map[chatKey] = {
      chatId: chatKey,
      groupId: isGroup ? realGroupId : undefined,
      chatType: chat.chatType || (isGroup ? 'group' : 'private'),
      name: chat.name || 'مستخدم',
      avatar: chat.avatar || chat.image || '',
      description: chat.description || '',
      userinfo: {
        _id: chatKey,
        name: chat.name || 'مستخدم',
        img: chat.avatar || chat.image || '/imgs/user.png',
        avatar: chat.avatar || chat.image || '/imgs/user.png',
        username: chat.username || '',
      },
      lastMessage: msgObj,
      unreadCount: chat.unreadCount || 0,
      seen: chat.seen ?? false,
      isGroup: isGroup,
      isFavorite: chat.isStarred || chat.isFavorite || false,
      typing: false,
      members: normalizedMembers,           // ✅ محفوظة
      admins: chat.admins || [],             // ✅ محفوظة
      owner: chat.owner || chat.createdBy,   // ✅ محفوظة
      isAdmin: chat.isAdmin || false,
    } as any;
  });

  return Object.values(map).sort(
    (a, b) =>
      new Date(b.lastMessage?.timestamp || 0).getTime() -
      new Date(a.lastMessage?.timestamp || 0).getTime()
  );
}