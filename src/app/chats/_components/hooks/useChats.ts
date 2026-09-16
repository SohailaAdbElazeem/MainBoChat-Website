// src/app/chats/_components/hooks/useChats.ts
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import wsService from '@/lib/websocketService';
import { markChatSeen } from '@/lib/seenGuard';
import { ChatItem, FilterType, Message } from '../types';
import { normalizeChats } from '../utils/normalizeChats';

interface UseChatsProps {
  myUserId: string;
  apiBase: string;
  token: string | null;
}

export function useChats({ myUserId, apiBase, token }: UseChatsProps) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const typingTimers = useRef<Record<string, any>>({});

  const fetchGroupDetails = useCallback(
    async (groupId: string) => {
      if (!token) return null;
      try {
        const url = `${apiBase}/chats/groups/GetGroup/${groupId}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) return null;
        const data = await res.json();
        const groupData = data.response || data || {};

        const formattedMembers = (groupData.members || []).map((m: any) => ({
          _id: m.userId || m._id,
          userId: m.userId || m._id,
          name: m.name || 'مستخدم',
          img: m.image || m.img || m.avatar || '/imgs/user.png',
          avatar: m.image || m.img || m.avatar || '/imgs/user.png',
          image: m.image || m.img || m.avatar || '/imgs/user.png',
          username: m.username || m.name || '',
          role: m.role,
          isAdmin: m.role === 'admin' || m.role === 'owner',
          isOwner: m.role === 'owner',
          joinedAt: m.joinedAt,
        }));

        return {
          ...groupData,
          members: formattedMembers,
          admins: groupData.admins || groupData.administrators || [],
          owner: groupData.owner || groupData.createdBy || groupData.ownerId,
        };
      } catch (error) {
        console.error('Error fetching group details:', error);
        return null;
      }
    },
    [apiBase, token]
  );

  const fetchChats = useCallback(
    async (category: FilterType = 'all') => {
      if (!myUserId || !token) return null;
      try {
        const url = `${apiBase}/chats/chats/${myUserId}?category=${category}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const rawList = data.response || data.userchats || [];

        const enrichedList = await Promise.all(
          rawList.map(async (chat: any) => {
            if (chat.chatType === 'group' && chat.id) {
              const groupDetails = await fetchGroupDetails(chat.id);
              if (groupDetails) {
                return {
                  ...chat,
                  description: groupDetails.description || '',
                  name: groupDetails.name || chat.name,
                  members: groupDetails.members || [],
                  admins: groupDetails.admins || [],
                  owner: groupDetails.owner || groupDetails.createdBy,
                };
              }
            }
            return chat;
          })
        );

        return normalizeChats(enrichedList, myUserId);
      } catch (error) {
        console.error('Error fetching chats:', error);
        return null;
      }
    },
    [apiBase, myUserId, token, fetchGroupDetails]
  );

  // Initial load
  useEffect(() => {
    async function load() {
      if (!myUserId || !token) return;
      setLoading(true);
      const normalized = await fetchChats('all');
      if (normalized) {
        setChats(normalized);
        setFilteredChats(normalized);
      }
      setLoading(false);
    }
    load();
  }, [myUserId, token, apiBase, fetchChats]);

  // WebSocket
  useEffect(() => {
    if (!myUserId) return;
    wsService.connect(myUserId);
    const unsub = wsService.addHandler((payload: any) => {
      handleWsEvent(payload);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  function handleWsEvent(payload: any) {
    if (!payload) return;
    if (payload.event === 'message' && payload.metadata) {
      onWsMessage(payload.metadata);
      return;
    }
    if (payload.event === 'typing' && payload.metadata) {
      onTyping(payload.metadata);
      return;
    }
    if (payload.event === 'seen' && payload.metadata) {
      onSeen(payload.metadata);
      return;
    }
    if (payload._id && payload.sender && payload.receiver && payload.message) {
      onWsMessage(payload);
    }
  }

  function onWsMessage(msg: Message) {
    setChats((prev) => {
      const isMe = msg.sender === myUserId;
      const otherId = isMe ? msg.receiver : msg.sender;
      const list = [...prev];
      const idx = list.findIndex((c) => c.chatId === otherId);
      if (idx === -1) return prev;

      const chat = { ...list[idx] };
      chat.lastMessage = {
        ...msg,
        seenBy: isMe ? chat.lastMessage?.seenBy || false : false,
      };
      chat.typing = false;
      if (!isMe) chat.unreadCount += 1;

      list.splice(idx, 1);
      return [chat, ...list];
    });
  }

  function onTyping(payload: any) {
    const sender = payload.sender;
    const to = payload.receiver;
    if (!sender || to !== myUserId) return;

    setChats((prev) =>
      prev.map((c) => (c.chatId === sender ? { ...c, typing: true } : c))
    );

    clearTimeout(typingTimers.current[sender]);
    typingTimers.current[sender] = setTimeout(() => {
      setChats((prev) =>
        prev.map((c) => (c.chatId === sender ? { ...c, typing: false } : c))
      );
    }, 1500);
  }

  function onSeen({ sender }: any) {
    markChatSeen(sender);
    setChats((prev) =>
      prev.map((c) => {
        if (c.chatId !== sender) return c;
        return {
          ...c,
          seen: true,
          unreadCount: 0,
          lastMessage: c.lastMessage
            ? { ...c.lastMessage, seenBy: true }
            : c.lastMessage,
        };
      })
    );
  }

  const filterChatsClientSide = (list: ChatItem[], filter: FilterType): ChatItem[] => {
    switch (filter) {
      case 'all': return list;
      case 'read': return list.filter((c) => c.seen === true || c.lastMessage?.seenBy === true);
      case 'unread': return list.filter((c) => c.unreadCount > 0);
      case 'starred': return list.filter((c) => c.isFavorite === true);
      case 'groups': return list.filter((c) => c.isGroup === true);
      case 'calls': return list.filter((c) => c.chatType === 'call');
      default: return list;
    }
  };

  const handleFilterChange = useCallback(
    async (filter: FilterType) => {
      setActiveFilter(filter);
      setFilterLoading(true);
      try {
        const normalized = await fetchChats(filter);
        if (normalized) {
          setFilteredChats(normalized);
        } else {
          setFilteredChats(filterChatsClientSide(chats, filter));
        }
      } catch {
        setFilteredChats(filterChatsClientSide(chats, filter));
      } finally {
        setFilterLoading(false);
      }
    },
    [chats, fetchChats]
  );

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredChats(chats);
    } else {
      setFilteredChats(filterChatsClientSide(chats, activeFilter));
    }
  }, [chats, activeFilter]);

  const searchedChats = useMemo(
    () =>
      filteredChats.filter((chat) => {
        const userName = chat.userinfo?.name || '';
        return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
      }),
    [filteredChats, searchTerm]
  );

  const markMessageAsSeen = useCallback(
    async (messageId: string) => {
      if (!token || !messageId) return false;
      try {
        const url = `${apiBase}/chats/seenmessage/${messageId}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) return false;
        const data = await res.json();
        return data.success === true;
      } catch {
        return false;
      }
    },
    [apiBase, token]
  );

  const getFilterCounts = useMemo(
    () => ({
      all: chats.length,
      read: chats.filter((c) => c.seen === true || c.lastMessage?.seenBy === true).length,
      unread: chats.filter((c) => c.unreadCount > 0).length,
      starred: chats.filter((c) => c.isFavorite === true).length,
      groups: chats.filter((c) => c.isGroup === true).length,
      calls: chats.filter((c) => c.chatType === 'call').length,
    }),
    [chats]
  );

  const removeChats = useCallback((ids: string[]) => {
    setChats((prev) =>
      prev.filter(
        (c) => !ids.includes(c.chatId) && !ids.includes(c.groupId || '')
      )
    );
    setFilteredChats((prev) =>
      prev.filter(
        (c) => !ids.includes(c.chatId) && !ids.includes(c.groupId || '')
      )
    );
  }, []);

  const updateChat = useCallback((chatId: string, updates: Partial<ChatItem>) => {
    setChats((prev) =>
      prev.map((c) => (c.chatId === chatId ? { ...c, ...updates } : c))
    );
    setFilteredChats((prev) =>
      prev.map((c) => (c.chatId === chatId ? { ...c, ...updates } : c))
    );
  }, []);

  return {
    chats,
    filteredChats,
    searchedChats,
    loading,
    filterLoading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    handleFilterChange,
    getFilterCounts,
    markMessageAsSeen,
    fetchChats,
    removeChats,
    updateChat,
  };
}