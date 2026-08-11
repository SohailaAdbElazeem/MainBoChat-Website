// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useState, useMemo, useCallback } from "react";
// import { ChatItem } from "@/types/types";

// type FilterType = 'all' | 'read' | 'unread' | 'favorite' | 'groups' | 'calls';

// type UseChatFiltersProps = {
//   chats: ChatItem[];
//   onFilterChange: (filter: FilterType) => Promise<ChatItem[] | null>;
// };

// export function useChatFilters({ chats, onFilterChange }: UseChatFiltersProps) {
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all');
//   const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
//   const [filterLoading, setFilterLoading] = useState(false);
//   // ✅ حساب أعداد الفلاتر
//   const getFilterCounts = useMemo(() => ({
//     all: chats.length,
//     read: chats.filter(c => c.lastMessage?.seenBy).length,
//     unread: chats.filter(c => c.unreadCount > 0).length,
//     favorite: chats.filter(c => c.isFavorite).length,
//     groups: chats.filter(c => c.isGroup).length,
//     calls: chats.filter(c => c.lastCall).length,
//   }), [chats]);

//   // ✅ تغيير الفلتر
//   const handleFilterChange = useCallback(async (filter: FilterType) => {
//     setActiveFilter(filter);
//     setFilterLoading(true);

//     try {
//       const result = await onFilterChange(filter);
//       if (result) {
//         setFilteredChats(result);
//       }
//     } catch (error) {
//       console.error('Error in filter change:', error);
//       setFilteredChats(chats);
//     } finally {
//       setFilterLoading(false);
//     }
//   }, [onFilterChange, chats]);

//   // ✅ تحديث الفلاتر عند تغيير 'all'
//   const updateFilteredChats = useCallback((newChats: ChatItem[]) => {
//     if (activeFilter === 'all') {
//       setFilteredChats(newChats);
//     }
//   }, [activeFilter]);

//   // ✅ عنوان القسم حسب الفلتر
//   const getSectionTitle = useCallback(() => {
//     switch(activeFilter) {
//       case 'all': return 'قسم الرسائل العامة';
//       case 'read': return 'قسم الرسائل المقروءة';
//       case 'unread': return 'قسم الرسائل غير المقروءة';
//       case 'favorite': return 'قسم الرسائل المميزة';
//       case 'groups': return 'قسم المجموعات';
//       case 'calls': return 'قسم المكالمات';
//       default: return 'قسم الكلام بينا';
//     }
//   }, [activeFilter]);
//   return {
//     activeFilter,
//     filteredChats,
//     filterLoading,
//     getFilterCounts,
//     handleFilterChange,
//     updateFilteredChats,
//     getSectionTitle,
//     setFilteredChats,
//   };
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback, useEffect } from "react";
import { ChatItem } from "@/types/types";

type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

type UseChatFiltersProps = {
  chats: ChatItem[];
  onFilterChange: (filter: FilterType) => Promise<ChatItem[] | null>;
};

export function useChatFilters({ chats, onFilterChange }: UseChatFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // ✅ حساب أعداد الفلاتر
  const getFilterCounts = useCallback(() => ({
    all: chats.length,
    read: chats.filter(c => c.seen === true).length,
    unread: chats.filter(c => c.unreadCount > 0).length,
    starred: chats.filter(c => c.isStarred === true).length,
    groups: chats.filter(c => c.chatType === 'group').length,
    calls: chats.filter(c => c.hasCalls === true).length,
  }), [chats]);

  // ✅ تغيير الفلتر
  const handleFilterChange = useCallback(async (filter: FilterType) => {
    if (filter === activeFilter) return;
    
    setActiveFilter(filter);
    setFilterLoading(true);

    try {
      const result = await onFilterChange(filter);
      if (result) {
        setFilteredChats(result);
      } else {
        // Fallback to local filtering
        const filtered = filterChatsLocally(chats, filter);
        setFilteredChats(filtered);
      }
    } catch (error) {
      console.error('Error in filter change:', error);
      const filtered = filterChatsLocally(chats, filter);
      setFilteredChats(filtered);
    } finally {
      setFilterLoading(false);
    }
  }, [activeFilter, onFilterChange, chats]);

  // ✅ Local filtering
  const filterChatsLocally = (chatList: ChatItem[], filter: FilterType): ChatItem[] => {
    switch (filter) {
      case 'all': return chatList;
      case 'read': return chatList.filter(c => c.seen === true);
      case 'unread': return chatList.filter(c => c.unreadCount > 0);
      case 'starred': return chatList.filter(c => c.isStarred === true);
      case 'groups': return chatList.filter(c => c.chatType === 'group');
      case 'calls': return chatList.filter(c => c.hasCalls === true);
      default: return chatList;
    }
  };

  // ✅ تحديث الفلاتر
  const updateFilteredChats = useCallback((newChats: ChatItem[]) => {
    const filtered = filterChatsLocally(newChats, activeFilter);
    setFilteredChats(filtered);
  }, [activeFilter]);

  // ✅ عنوان القسم
  const getSectionTitle = useCallback(() => {
    switch(activeFilter) {
      case 'all': return 'جميع المحادثات';
      case 'read': return 'المقروءة';
      case 'unread': return 'غير المقروءة';
      case 'starred': return 'المفضلة';
      case 'groups': return 'المجموعات';
      case 'calls': return 'المكالمات';
      default: return 'المحادثات';
    }
  }, [activeFilter]);

  useEffect(() => {
    updateFilteredChats(chats);
  }, [chats, updateFilteredChats]);

  return {
    activeFilter,
    filteredChats,
    filterLoading,
    getFilterCounts,
    handleFilterChange,
    updateFilteredChats,
    getSectionTitle,
    setFilteredChats,
  };
}