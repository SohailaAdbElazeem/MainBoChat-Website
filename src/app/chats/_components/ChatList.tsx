/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import wsService from "@/lib/websocketService";
import { isChatSeen, markChatSeen } from "@/lib/seenGuard";
import { ChatItem, Message } from "@/types/types";
import { Search, X, ChevronDown, Flag, Search as SearchIcon, Archive, Trash2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import ChatFilters from './ChatFilters';

type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

type Props = {
  userId?: string | null;
  apiBase: string;
  activeChatId?: string | null;
};

/* ================= NORMALIZE ================= */
function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
  if (!Array.isArray(rawChats)) return [];

  const map: Record<string, ChatItem> = {};
  
  rawChats.forEach((chat) => {
    const otherId = chat.otherUserId || chat.id;
    const lastMsgText = typeof chat.lastMessage === 'string' 
      ? chat.lastMessage 
      : chat.lastMessage?.text || chat.lastMessage || '';

    const msgObj: Message = {
      _id: chat.id,
      sender: chat.lastMessage?.sender || otherId,
      receiver: myId,
      message: lastMsgText,
      timestamp: chat.timestamp || new Date().toISOString(),
      seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
      type: chat.lastMessageType || 'text',
    };

    map[otherId] = {
      chatId: otherId,
      chatType: chat.chatType || 'private',
      name: chat.name || 'مستخدم',
      avatar: chat.avatar || '',
      userinfo: {
        _id: otherId,
        name: chat.name || 'مستخدم',
        img: chat.avatar || '/imgs/user.png',
        avatar: chat.avatar || '/imgs/user.png',
      },
      lastMessage: msgObj,
      unreadCount: chat.unreadCount || 0,
      seen: chat.seen ?? false,
      isGroup: chat.chatType === 'group',
      isFavorite: chat.isStarred || false,
      typing: false,
    };
  });

  return Object.values(map).sort(
    (a, b) =>
      new Date(b.lastMessage?.timestamp || 0).getTime() -
      new Date(a.lastMessage?.timestamp || 0).getTime()
  );
}

/* ================= FORMAT TIME WITH AM/PM ================= */
function formatMessageTime(timestamp: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeStr = date.toLocaleTimeString('ar-EG', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  if (msgDate.getTime() === today.getTime()) {
    return timeStr;
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (msgDate.getTime() === yesterday.getTime()) {
    return 'أمس';
  }
  
  const dayDiff = Math.floor((today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24));
  if (dayDiff < 7) {
    return date.toLocaleDateString('ar-EG', { weekday: 'short' });
  }
  
  return date.toLocaleDateString('ar-EG', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  });
}

/* ================= COMPONENT ================= */
export default function ChatList({ userId: propUserId, apiBase, activeChatId: propActiveChatId }: Props) {
  const [myUserId, setMyUserId] = useState<string>(propUserId || "");
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Group Creation Modal States
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const typingTimers = useRef<Record<string, any>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    if (propUserId) {
      setMyUserId(propUserId);
      return;
    }
    const raw = localStorage.getItem("userData");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const userId = parsed._id || parsed.id || "";
      setMyUserId(userId);
    } catch (e) {
      console.error("Invalid userData in localStorage");
    }
  }, [propUserId]);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const pathname = usePathname();
  const activeChatId = propActiveChatId || pathname?.split("/").pop();

  const markMessageAsSeen = async (messageId: string) => {
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
    } catch (error) {
      return false;
    }
  };

  const fetchChats = async (category: FilterType = 'all') => {
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
      const normalizedChats = normalizeChats(rawList, myUserId);
      return normalizedChats;
    } catch (error) {
      return null;
    }
  };

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
  }, [myUserId, token, apiBase]);

  useEffect(() => {
    if (!myUserId) return;
    wsService.connect(myUserId);
    const unsub = wsService.addHandler((payload: any) => {
      handleWsEvent(payload);
    });
    return () => {
      unsub();
    };
  }, [myUserId]);

  function handleWsEvent(payload: any) {
    if (!payload) return;
    if (payload.event === "message" && payload.metadata) {
      onWsMessage(payload.metadata);
      return;
    }
    if (payload.event === "typing" && payload.metadata) {
      onTyping(payload.metadata);
      return;
    }
    if (payload.event === "seen" && payload.metadata) {
      onSeen(payload.metadata);
      return;
    }
    if (payload._id && payload.sender && payload.receiver && payload.message) {
      onWsMessage(payload);
      return;
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
        seenBy: isMe ? (chat.lastMessage?.seenBy || false) : false,
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
    setChats(prev =>
      prev.map(c => {
        if (c.chatId !== sender) return c;
        return {
          ...c,
          seen: true,
          unreadCount: 0,
          lastMessage: c.lastMessage ? {
            ...c.lastMessage,
            seenBy: true,
          } : c.lastMessage,
        };
      })
    );
  }

  const handleFilterChange = async (filter: FilterType) => {
    setActiveFilter(filter);
    setFilterLoading(true);
    try {
      const normalized = await fetchChats(filter);
      if (normalized) {
        setFilteredChats(normalized);
      } else {
        setFilteredChats(filterChatsClientSide(chats, filter));
      }
    } catch (error) {
      setFilteredChats(filterChatsClientSide(chats, filter));
    } finally {
      setFilterLoading(false);
    }
  };

  const filterChatsClientSide = (chatsList: ChatItem[], filter: FilterType): ChatItem[] => {
    switch(filter) {
      case 'all': return chatsList;
      case 'read': return chatsList.filter(c => c.seen === true || c.lastMessage?.seenBy === true);
      case 'unread': return chatsList.filter(c => c.unreadCount > 0);
      case 'starred': return chatsList.filter(c => c.isFavorite === true);
      case 'groups': return chatsList.filter(c => c.isGroup === true);
      case 'calls': return chatsList.filter(c => c.chatType === 'call');
      default: return chatsList;
    }
  };

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredChats(chats);
    } else {
      setFilteredChats(filterChatsClientSide(chats, activeFilter));
    }
  }, [chats, activeFilter]);

  const searchedChats = filteredChats.filter((chat) => {
    const userName = chat.userinfo?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const getSectionTitle = () => {
    switch(activeFilter) {
      case 'all': return 'قسم الرسائل العام';
      case 'read': return 'قسم الرسائل المقروء';
      case 'unread': return 'قسم الرسائل غير المقروء';
      case 'starred': return 'قسم الرسائل المميزة';
      case 'groups': return 'قسم المجموعات';
      case 'calls': return 'قسم المكالمات';
      default: return 'قسم الرسائل العام';
    }
  };

  const getFilterCounts = useMemo(() => {
    return {
      all: chats.length,
      read: chats.filter(c => c.seen === true || c.lastMessage?.seenBy === true).length,
      unread: chats.filter(c => c.unreadCount > 0).length,
      starred: chats.filter(c => c.isFavorite === true).length,
      groups: chats.filter(c => c.isGroup === true).length,
      calls: chats.filter(c => c.chatType === 'call').length,
    };
  }, [chats]);

  const handleCreateGroupSubmit = async () => {
    if (!groupName.trim() || !token) return;
    setIsSubmittingGroup(true);

    try {
      const createRes = await fetch(`${apiBase}/chats/groups/CreateGroup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          description: groupDescription || "no"
        })
      });

      const createData = await createRes.json();
      if (!createData.success || !createData.response?.groupId) {
        throw new Error("Failed to create group");
      }

      const groupId = createData.response.groupId;
      const members = [myUserId, ...selectedMembers];
      
      await fetch(`${apiBase}/chats/groups/AddMembers/${groupId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members })
      });

      setIsCreateGroupOpen(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      
      const normalized = await fetchChats('all');
      if (normalized) {
        setChats(normalized);
        setFilteredChats(normalized);
      }
      
      router.push(`/chats/${groupId}`);
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsSubmittingGroup(false);
    }
  };

  const toggleMemberSelection = (chatId: string) => {
    setSelectedMembers(prev => 
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  // Dropdown menu actions
  const handleDropdownAction = (action: string, chatId: string) => {
    setOpenDropdown(null);
    console.log(`Action: ${action} on chat: ${chatId}`);
    switch(action) {
      case 'report':
        // Handle report
        break;
      case 'search':
        // Handle search in chat
        break;
      case 'archive':
        // Handle archive
        break;
      case 'delete':
        // Handle delete chat
        break;
      case 'leave':
        // Handle leave group
        break;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between px-4 mb-5">
        <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
          {getSectionTitle()}
        </h1>
        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
          aria-label="إنشاء مجموعة"
        >
          <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
        </button>
      </div>

      <div className="flex items-center justify-center w-full mb-3">
        <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
          <Search className="text-[#B6B7B7]"/>
          <input 
            type="text" 
            placeholder=" اكتب هنا ما تريد ان تكتشفه" 
            className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-sm">
              ✕
            </button>
          )}
        </div>
      </div>

      <ChatFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        counts={getFilterCounts}
      />

      {filterLoading ? (
        <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto flex-1">
          {searchedChats.length === 0 && searchTerm.trim() !== '' && (
            <div className="text-center text-gray-500 py-10">
              لا توجد محادثات مع <span className="font-bold">"{searchTerm}"</span>
            </div>
          )}

          {searchedChats.length === 0 && searchTerm.trim() === '' && (
            <div className="text-center text-gray-500 py-10">
              لا توجد محادثات في هذا القسم
            </div>
          )}

          {searchedChats.map((chat) => {
            const isLastFromMe = chat.lastMessage?.sender === myUserId;
            const isMessageSeen = chat.seen === true || chat.lastMessage?.seenBy === true;
            const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
            const time = formatMessageTime(chat.lastMessage?.timestamp || '');
            const isDropdownOpen = openDropdown === chat.chatId;

            return (
              <div
                key={chat.chatId}
                className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
                  activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"
                }`}
                dir="ltr"
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current[chat.chatId] = el;
                  }
                }}
              >
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={async () => {
                    markChatSeen(chat.chatId);
                    if (isLastFromMe && chat.lastMessage?._id) {
                      await markMessageAsSeen(chat.lastMessage._id);
                    }
                    setChats(prev =>
                      prev.map(c =>
                        c.chatId === chat.chatId ? { ...c, unreadCount: 0 } : c
                      )
                    );
                    router.push(`/chats/${chat.chatId}`);
                  }}
                >
                  <img
                    src={chat.userinfo?.img || "/imgs/user.png"}
                    className="w-[60px] h-[60px] rounded-[25px] object-cover"
                    alt={chat.userinfo?.name}
                  />

                  <div className="flex-1">
                    <div className="font-medium text-black flex items-center justify-between">
                      <span className="truncate">{chat.userinfo?.name}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap">
                          {time}
                        </span>
                        {/* {isLastFromMe && ( */}
                          <span className="text-xs flex items-center">
                            {isMessageSeen ? (
                              <img 
                                src="/imgs/read.svg" 
                                alt="مقروءة" 
                                style={{
                                  width: '13px',
                                  height: '12px',
                                  opacity: 1,
                                }}
                                className="w-[13px] h-[12px]"
                              />
                            ) : (
                              <img 
                                src="/imgs/unread.svg" 
                                alt="غير مقروءة"  
                                style={{
                                  width: '13px',
                                  height: '12px',
                                  opacity: 1,
                                }}
                                className="w-[13px] h-[12px]" 
                              />
                            )}
                          </span>
                        {/* )} */}
                      </div>
                    </div>

                    <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                      {chat.typing ? "يكتب الان ..." : chat.lastMessage?.message || ""}
                    </div>
                  </div>
                </div>

                {/* Dropdown Arrow - Positioned with unread count */}
                <div className="flex items-center gap-3 mt-6">
                  {!isLastFromMe && hasUnread && (
                    <span 
                      className="text-white text-[10px] font-semibold flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '15px',
                        borderRadius: '6px',
                        background: '#D72229',
                        fontFamily: 'Cairo',
                        fontWeight: 600,
                        fontSize: '10px',
                        lineHeight: '16px',
                        textAlign: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      {chat.unreadCount}
                    </span>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(isDropdownOpen ? null : chat.chatId);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      isDropdownOpen 
                        ? 'bg-gray-200' 
                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronDown 
                      className={`w-3 h-3 text-gray-500 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
{/* Dropdown Menu */}
{isDropdownOpen && (
  <div 
    className="absolute top-full right-2 mt-1 bg-white rounded-lg shadow-lg z-50 py-1 bg-[#F5F5F5]"
    style={{
      width: '154px',
      borderRadius: '8px',
      backgroundColor: "#F5F5F5"
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => handleDropdownAction('block', chat.chatId)}
      className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
      style={{
        borderBottom: '0.33px solid #3C3C434D',
      }}
    >
      <img src="/imgs/block.svg" alt="حظر" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
      <span style={{
        fontFamily: 'Cairo',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '100%',
        textAlign: 'right',
        color: '#000000',
      }}>حظر</span>
    </button>
    
    <button
      onClick={() => handleDropdownAction('report', chat.chatId)}
      className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
      style={{
        borderBottom: '0.33px solid #3C3C434D',
      }}
    >
      <img src="/imgs/report.svg" alt="إبلاغ" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
      <span style={{
        fontFamily: 'Cairo',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '100%',
        textAlign: 'right',
        color: '#000000',
      }}>إبلاغ</span>
    </button>
    
    <button
      onClick={() => handleDropdownAction('search', chat.chatId)}
      className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
      style={{
        borderBottom: '0.33px solid #3C3C434D',
      }}
    >
      <img src="/imgs/search.svg" alt="بحث" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
      <span style={{
        fontFamily: 'Cairo',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '100%',
        textAlign: 'right',
        color: '#000000',
      }}>بحث</span>
    </button>
    
    <button
      onClick={() => handleDropdownAction('archive', chat.chatId)}
      className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
      style={{
        borderBottom: '0.33px solid #3C3C434D',
      }}
    >
      <img src="/imgs/archive.svg" alt="أرشفة" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
      <span style={{
        fontFamily: 'Cairo',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '100%',
        textAlign: 'right',
        color: '#000000',
      }}>أرشفة</span>
    </button>
    
    <button
      onClick={() => handleDropdownAction('delete', chat.chatId)}
      className="w-full px-2 py-3 text-sm text-red-600 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
      style={{
        borderBottom: chat.isGroup ? '0.33px solid #3C3C434D' : 'none',
      }}
    >
      <img src="/imgs/delete.svg" alt="حذف" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
      <span style={{
        fontFamily: 'Cairo',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '100%',
        textAlign: 'right',
        color: '#D72229',
      }}>حذف الدردشة</span>
    </button>
    
    {chat.isGroup && (
      <>
        <button
          onClick={() => handleDropdownAction('leave', chat.chatId)}
          className="w-full px-2 py-3 text-sm text-red-600 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
        >
          <img src="/imgs/leave.svg" alt="خروج" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
          <span style={{
            fontFamily: 'Cairo',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '100%',
            textAlign: 'right',
            color: '#D72229',
          }}>خروج</span>
        </button>
      </>
    )}
  </div>
)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE GROUP MODAL ================= */}
      {isCreateGroupOpen && (
        <div
          className="fixed top-[130px] bottom-0 left-[18px] w-[20%] z-50 flex flex-col p-6 bg-[#F5F5F5]"
          style={{
            direction: "rtl",
            borderRadius: "35px",
          }}
        >
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <button
              onClick={() => setIsCreateGroupOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h2
              style={{
                fontFamily: 'Cairo',
                fontWeight: 500,
                fontSize: '25px',
                lineHeight: '100%',
                color: '#000000'
              }}
            >
              انشاء مجموعة
            </h2>
          </div>

          <div className="mb-3 flex justify-center gap-2 flex-shrink-0">
            <img
              src={
                JSON.parse(localStorage.getItem('userData') || '{}').img ||
                '/imgs/user.png'
              }
              alt="صورة المستخدم"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />

            <input
              type="text"
              placeholder="اكتب اسم المجموعة"
              value={groupName}
              maxLength={25}
              onChange={(e) => setGroupName(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '402px',
                height: '45px',
                borderRadius: '18px',
                background: '#FFFFFF',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '15px',
                padding: '0 15px',
                border: 'none',
                outline: 'none',
              }}
              className="text-black placeholder-[#B4B4B9]"
            />

            <span
              style={{
                width: '46px',
                height: '28px',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '100%',
                color: '#B4B4B9',
                transform: 'translateY(15px)',
              }}
            >
              25/{groupName.length}
            </span>
          </div>

          <div className="mb-4 flex justify-center flex-shrink-0">
            <div
              className="flex items-center gap-3 p-3 w-full"
              style={{
                maxWidth: '402px',
                height: '102px',
                borderRadius: '18px',
                background: '#FFFFFF',
              }}
            >
              <textarea
                placeholder="اكتب الوصف"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                style={{
                  flex: 1,
                  height: '100%',
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '15px',
                  padding: '8px 0',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  background: 'transparent'
                }}
                className="text-black placeholder-[#B4B4B9]"
              />
            </div>
          </div>

          <div
            className="w-[calc(100%+48px)] -mx-6 shrink-0"
            style={{
              height: '3px',
              borderTop: '0.33px solid #3C3C434D',
            }}
          />

          <div className="flex items-center justify-between mb-2 -mx-5 flex-shrink-0">
            <span
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '17px',
                color: '#000000'
              }}
            >
              الاعضاء:
            </span>
            <span className="text-sm text-gray-500">
              ({selectedMembers.length} شخص)
            </span>
          </div>

          <div className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0" style={{ maxWidth: '402px' }}>
            <Search className="text-[#B6B7B7] w-4 h-4 ml-2" />
            <input
              type="text"
              placeholder="ابحث في الأعضاء..."
              value={groupSearchTerm}
              onChange={(e) => setGroupSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{
                fontFamily: 'Cairo',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 mx-auto w-full" style={{ maxWidth: '402px', minHeight: '150px' }}>
            {(() => {
              const individualUsers = chats.filter(c => !c.isGroup);
              const filteredUsers = individualUsers.filter(c => 
                c.name.toLowerCase().includes(groupSearchTerm.toLowerCase().trim())
              );

              if (individualUsers.length === 0) {
                return (
                  <div className="flex-1 flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
                    <div className="text-center">
                      <div className="text-5xl mb-3">👤</div>
                      <p className="text-xl font-semibold text-gray-600">لا يوجد أعضاء</p>
                      <p className="text-sm text-gray-400 mt-1">ليس لديك أي محادثات مع أفراد</p>
                    </div>
                  </div>
                );
              }

              if (filteredUsers.length === 0 && groupSearchTerm.trim() !== '') {
                return (
                  <div
                    className="flex-1 flex items-center justify-center h-full"
                    style={{ minHeight: '71px' }}
                  >
                    <div className="text-center">
                      <img
                        src="/imgs/noMember.svg"
                        alt="لا توجد نتائج"
                        className="w-[71px] h-[71px] object-contain mx-auto"
                      />
                    </div>
                  </div>
                );
              }

              return filteredUsers.map((chat) => {
                const isChecked = selectedMembers.includes(chat.chatId);
                return (
                  <div
                    key={chat.chatId}
                    onClick={() => toggleMemberSelection(chat.chatId)}
                    className="flex items-center justify-between p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={chat.userinfo?.img || "/imgs/user.png"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={chat.name}
                      />
                      <span className="text-sm font-semibold text-black">{chat.name}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#D72229] border-[#D72229]'
                          : 'border-gray-300'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div
            className="flex justify-center items-center flex-shrink-0"
            style={{
              width: 'calc(100% + 48px)',
              marginLeft: '-24px',
              marginRight: '-24px',
              marginBottom: '-24px',
              padding: '16px 24px',
              background: '#E3E3E366',
              backdropFilter: 'blur(35px)',
              borderBottomLeftRadius: '35px',
              borderBottomRightRadius: '35px',
              minHeight: '82px',
            }}
          >
            <button
              disabled={!groupName.trim() || isSubmittingGroup}
              onClick={handleCreateGroupSubmit}
              style={{
                width: '100%',
                maxWidth: '285px',
                height: '50px',
                borderRadius: '20px',
                background: '#FFFFFF',
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '17px',
                border: '1px solid #ddd',
                cursor: !groupName.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="text-black shadow-md hover:bg-gray-50"
            >
              {isSubmittingGroup ? 'جاري الإنشاء...' : 'انشاء مجموعة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}