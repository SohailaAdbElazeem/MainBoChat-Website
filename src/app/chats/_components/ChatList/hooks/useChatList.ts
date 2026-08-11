/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ChatItem, Message } from "@/types/types";
import { useChatApi } from './hooks/useChatApi';
import { useWebSocket } from './hooks/useWebSocket';
import { useChatFilters } from './hooks/useChatFilters';
import { useChatSearch } from './hooks/useChatSearch';

type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

type UseChatListProps = {
  apiBase: string;
  token: string | null;
  userId?: string | null;
  activeChatId?: string | null;
};

export function useChatList({ 
  apiBase, 
  token, 
  userId: propUserId, 
  activeChatId: propActiveChatId 
}: UseChatListProps) {
  console.log('🔴🔴🔴 USE CHAT LIST HOOK CALLED 🔴🔴🔴');
  console.log('📌 propUserId:', propUserId);
  console.log('📌 token:', token ? '✅ موجود' : '❌ غير موجود');
  console.log('📌 apiBase:', apiBase);

  const router = useRouter();
  const pathname = usePathname();
  
  const [myUserId, setMyUserId] = useState<string>("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const activeChatId = propActiveChatId || pathname?.split("/").pop();

  // ✅ Get user ID
  useEffect(() => {
    console.log('🔴 USER ID EFFECT IN USE CHAT LIST');
    console.log('📌 propUserId:', propUserId);
    
    if (propUserId) {
      console.log('✅ Using propUserId:', propUserId);
      setMyUserId(propUserId);
      return;
    }
    
    const userDataRaw = localStorage.getItem("userData");
    console.log('📌 userData from localStorage:', userDataRaw);
    
    if (userDataRaw) {
      try {
        const parsed = JSON.parse(userDataRaw);
        console.log('📌 Parsed userData:', parsed);
        const userId = parsed._id || parsed.id;
        if (userId) {
          console.log('✅ Found userId in userData:', userId);
          setMyUserId(userId);
          return;
        }
      } catch (e) {
        console.error('❌ Error parsing userData:', e);
      }
    }
    
    console.warn('⚠️ No userId found anywhere');
    setError("لم يتم العثور على معرف المستخدم");
    setLoading(false);
    
  }, [propUserId]);

  // ✅ Normalize chats - تحويل بيانات API إلى ChatItem
  // const normalizeChats = useCallback((chats: any[], myId: string): ChatItem[] => {
  //   console.log('🔴 NORMALIZE CHATS CALLED');
  //   console.log('📌 chats length:', chats?.length);
  //   console.log('📌 myId:', myId);
    
  //   if (!chats || !Array.isArray(chats)) {
  //     console.warn('⚠️ No chats to normalize');
  //     return [];
  //   }

  //   if (chats.length === 0) {
  //     console.warn('⚠️ Chats array is empty');
  //     return [];
  //   }

  //   console.log('🔄 Normalizing', chats.length, 'chats');
  //   console.log('📌 First chat sample:', JSON.stringify(chats[0], null, 2));

  //   // ✅ تحويل البيانات مباشرة
  //   const result = chats.map((chat: any) => ({
  //     chatId: chat.id, // ✅ استخدام id الحقيقي للمحادثة
  //     chatType: chat.chatType || 'private',
  //     name: chat.name || 'مستخدم',
  //     avatar: chat.avatar || '',
  //     lastMessage: chat.lastMessage || '',
  //     lastMessageType: chat.lastMessageType || 'text',
  //     timestamp: chat.timestamp || new Date().toISOString(),
  //     unreadCount: chat.unreadCount || 0,
  //     seen: chat.seen || false,
  //     deliveryStatus: chat.deliveryStatus || null,
  //     vip: chat.vip || false,
  //     otherUserId: chat.otherUserId,
  //     isStarred: chat.isStarred || false,
  //     typing: false,
  //     isGroup: chat.chatType === 'group',
  //     hasCalls: false,
  //     // ✅ userinfo للتوافق مع المكونات
  //     userinfo: {
  //       _id: chat.otherUserId || chat.id,
  //       name: chat.name || 'مستخدم',
  //       img: chat.avatar || '/imgs/user.png',
  //       avatar: chat.avatar || '/imgs/user.png',
  //     },
  //     // ✅ lastMessage كـ Message للتوافق مع ChatMessages
  //     lastMessageObj: {
  //       _id: chat.id,
  //       sender: chat.otherUserId || chat.id,
  //       receiver: myId,
  //       message: chat.lastMessage || '',
  //       timestamp: chat.timestamp || new Date().toISOString(),
  //       seenBy: chat.seen || false,
  //       type: chat.lastMessageType || 'text',
  //     }
  //   }));

  //   console.log('✅ Normalized chats result:', result);
  //   console.log('✅ Normalized count:', result.length);
  //   return result;
  // }, []);

  // ✅ Normalize chats - تحويل بيانات API إلى ChatItem
  const normalizeChats = useCallback((chats: any[], myId: string): ChatItem[] => {
    console.log('🔴 NORMALIZE CHATS CALLED');
    console.log('📌 chats length:', chats?.length);
    console.log('📌 myId:', myId);
    
    if (!chats || !Array.isArray(chats)) {
      console.warn('⚠️ No chats to normalize');
      return [];
    }

    if (chats.length === 0) {
      console.warn('⚠️ Chats array is empty');
      return [];
    }

    console.log('🔄 Normalizing', chats.length, 'chats');

    const result = chats.map((chat: any) => {
      const lastMsgText = typeof chat.lastMessage === 'string' 
        ? chat.lastMessage 
        : chat.lastMessage?.text || '';

      return {
        chatId: chat.id,
        chatType: chat.chatType || 'private',
        name: chat.name || 'مستخدم',
        avatar: chat.avatar || '',
        lastMessage: {
          _id: chat.id,
          sender: chat.otherUserId || chat.id,
          receiver: myId,
          message: lastMsgText,
          text: lastMsgText, // دعم الحالتين للتأكد
          timestamp: chat.timestamp || new Date().toISOString(),
          seenBy: chat.seen || false,
          type: chat.lastMessageType || 'text',
        },
        lastMessageType: chat.lastMessageType || 'text',
        timestamp: chat.timestamp || new Date().toISOString(),
        unreadCount: chat.unreadCount || 0,
        seen: chat.seen || false,
        deliveryStatus: chat.deliveryStatus || null,
        vip: chat.vip || false,
        otherUserId: chat.otherUserId,
        isStarred: chat.isStarred || false,
        typing: false,
        isGroup: chat.chatType === 'group',
        hasCalls: false,
        userinfo: {
          _id: chat.otherUserId || chat.id,
          name: chat.name || 'مستخدم',
          img: chat.avatar || '/imgs/user.png',
          avatar: chat.avatar || '/imgs/user.png',
        },
        lastMessageObj: {
          _id: chat.id,
          sender: chat.otherUserId || chat.id,
          receiver: myId,
          message: lastMsgText,
          timestamp: chat.timestamp || new Date().toISOString(),
          seenBy: chat.seen || false,
          type: chat.lastMessageType || 'text',
        }
      };
    });

    console.log('✅ Normalized chats result:', result);
    return result;
  }, []);
  // ✅ API Hook
  console.log('🔴 Calling useChatApi with myUserId:', myUserId);
  const { fetchAllChats, fetchFilteredChats } = useChatApi({
    apiBase,
    token,
    myUserId,
    normalizeChats,
  });

  // ✅ Filters Hook
  const {
    activeFilter,
    filteredChats,
    filterLoading,
    getFilterCounts,
    handleFilterChange,
    updateFilteredChats,
    getSectionTitle,
    setFilteredChats,
  } = useChatFilters({
    chats,
    onFilterChange: fetchFilteredChats,
  });

  // ✅ Search Hook
  const { searchTerm, setSearchTerm, searchedChats } = useChatSearch(filteredChats);

  // ✅ Load chats
  // useEffect(() => {
  //   console.log('🔴🔴🔴 LOAD EFFECT TRIGGERED 🔴🔴🔴');
  //   console.log('📌 myUserId:', myUserId);
  //   console.log('📌 token:', token ? '✅ موجود' : '❌ غير موجود');
    
  //   if (!myUserId) {
  //     console.log('⏸️ Skipping load: No userId');
  //     setLoading(false);
  //     return;
  //   }
    
  //   if (!token) {
  //     console.log('⏸️ Skipping load: No token');
  //     setLoading(false);
  //     return;
  //   }
    
  //   async function load() {
  //     console.log('🔴 LOAD FUNCTION STARTED');
  //     console.log('🔄 Loading chats for user:', myUserId);
      
  //     setLoading(true);
  //     setError(null);
      
  //     try {
  //       console.log('🔄 Calling fetchAllChats...');
  //       const result = await fetchAllChats();
  //       console.log('📦 Result from fetchAllChats:', result);
  //       console.log('📦 Is array:', Array.isArray(result));
  //       console.log('📦 Length:', result?.length);
        
  //       if (result && Array.isArray(result) && result.length > 0) {
  //         console.log(`✅ Setting ${result.length} chats`);
  //         setChats(result);
  //         setFilteredChats(result);
  //       } else {
  //         console.warn('⚠️ No chats returned or empty array');
  //         setChats([]);
  //         setFilteredChats([]);
  //       }
  //     } catch (err) {
  //       console.error('❌ Error loading chats:', err);
  //       setError("حدث خطأ أثناء تحميل المحادثات");
  //     } finally {
  //       setLoading(false);
  //       console.log('🏁 Load function completed');
  //     }
  //   }
    
  //   load();
  // }, [myUserId, token, fetchAllChats, setFilteredChats]);

  // ✅ Load chats
  useEffect(() => {
    if (!myUserId || !token) {
      setLoading(false);
      return;
    }
    
    async function load() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchAllChats();
        
        if (result && Array.isArray(result)) {
          setChats(result);
          setFilteredChats(result);
        }
      } catch (err) {
        console.error('❌ Error loading chats:', err);
        setError("حدث خطأ أثناء تحميل المحادثات");
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [myUserId, token, fetchAllChats, setFilteredChats]);
  // Update filtered chats
  useEffect(() => {
    if (chats.length > 0) {
      console.log('🔴 UPDATE FILTERED EFFECT TRIGGERED');
      console.log('📌 chats length:', chats.length);
      updateFilteredChats(chats);
    }
  }, [chats, updateFilteredChats]);

  // WebSocket handlers
  const onWsMessage = useCallback((msg: Message) => {
    if (!myUserId) return;
    
    setChats((prev) => {
      const isMe = msg.sender === myUserId;
      const otherId = isMe ? msg.receiver : msg.sender;
      const list = [...prev];
      const idx = list.findIndex((c) => c.chatId === otherId);
      
      if (idx === -1) {
        const newChat: ChatItem = {
          chatId: otherId,
          userinfo: msg.receiverinfo || { _id: otherId, name: 'مستخدم' },
          lastMessage: { ...msg, seenBy: isMe },
          unreadCount: isMe ? 0 : 1,
          typing: false,
        };
        return [newChat, ...list];
      }
      
      const chat = { ...list[idx] };
      chat.lastMessage = { ...msg, seenBy: isMe ? chat.lastMessage.seenBy : false };
      chat.typing = false;
      if (!isMe) chat.unreadCount += 1;
      
      list.splice(idx, 1);
      return [chat, ...list];
    });
  }, [myUserId]);

  const onTyping = useCallback((payload: any) => {
    if (!myUserId) return;
    
    const sender = payload.sender;
    const to = payload.receiver || payload.receiver;
    if (!sender || to !== myUserId) return;
    
    setChats((prev) =>
      prev.map((c) => (c.chatId === sender ? { ...c, typing: true } : c))
    );
    
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) => (c.chatId === sender ? { ...c, typing: false } : c))
      );
    }, 1500);
  }, [myUserId]);

  const onSeen = useCallback(({ sender }: any) => {
    if (!myUserId) return;
    
    setChats(prev =>
      prev.map(c => {
        if (c.chatId !== sender || c.lastMessage.sender !== myUserId) return c;
        return { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, seenBy: true } };
      })
    );
  }, [myUserId]);

  // ✅ WebSocket Hook
  useWebSocket({
    myUserId,
    onMessage: onWsMessage,
    onTyping,
    onSeen,
  });

  // Polling as fallback
  useEffect(() => {
    if (!myUserId || !token) return;
    
    const poll = async () => {
      try {
        const result = await fetchAllChats();
        if (result && Array.isArray(result)) {
          setChats(result);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };
    
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [myUserId, token, fetchAllChats]);

  // Mark chat as read
  const markAsRead = useCallback(async (chatId: string) => {
    if (!chatId || !token || !myUserId) return;
    
    try {
      const response = await fetch(`${apiBase}/chats/mark-read/${myUserId}/${chatId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setChats(prev =>
          prev.map(c => {
            if (c.chatId === chatId) {
              return {
                ...c,
                unreadCount: 0,
                lastMessage: { ...c.lastMessage, seenBy: true }
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  }, [apiBase, token, myUserId]);

  console.log('🔴🔴🔴 RETURNING FROM USE CHAT LIST 🔴🔴🔴');
  console.log('📌 myUserId:', myUserId);
  console.log('📌 loading:', loading);
  console.log('📌 chats length:', chats.length);
  console.log('📌 searchedChats length:', searchedChats?.length || 0);

  return {
    myUserId,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeFilter,
    filterLoading,
    activeChatId,
    getFilterCounts,
    handleFilterChange,
    getSectionTitle,
    searchedChats,
    router,
    markAsRead,
    refreshChats: fetchAllChats,
  };
}