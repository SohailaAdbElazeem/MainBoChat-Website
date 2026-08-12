/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import wsService from "@/lib/websocketService";
import { isChatSeen, markChatSeen } from "@/lib/seenGuard";
import { ChatItem, Message } from "@/types/types";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import ChatFilters from './ChatFilters';

// Match API categories exactly
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
      : chat.lastMessage?.text || '';

    const msgObj: Message = {
      _id: chat.id,
      sender: otherId,
      receiver: myId,
      message: lastMsgText,
      timestamp: chat.timestamp || new Date().toISOString(),
      seenBy: chat.seen || false,
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
      seen: chat.seen || false,
      isGroup: chat.chatType === 'group',
      isFavorite: chat.isStarred || false,
      typing: false,
    };
  });

  return Object.values(map).sort(
    (a, b) =>
      new Date(b.lastMessage.timestamp).getTime() -
      new Date(a.lastMessage.timestamp).getTime()
  );
}

/* ================= FORMAT TIME WITH AM/PM ================= */
function formatMessageTime(timestamp: string): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
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

  const typingTimers = useRef<Record<string, any>>({});

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
      console.log('✅ User ID loaded:', userId);
      setMyUserId(userId);
    } catch (e) {
      console.error("Invalid userData in localStorage");
    }
  }, [propUserId]);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const pathname = usePathname();
  const activeChatId = propActiveChatId || pathname?.split("/").pop();

  /* ================= MARK MESSAGE AS SEEN (POST) ================= */
  const markMessageAsSeen = async (messageId: string) => {
    if (!token || !messageId) return false;

    try {
      const url = `${apiBase}/chats/seenmessage/${messageId}`;
      console.log('👁️ Marking message as seen (POST):', url);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to mark message as seen:', res.status);
        return false;
      }

      const data = await res.json();
      console.log('✅ Message marked as seen:', data);
      
      return data.success === true && data.response?.matchedCount > 0;
    } catch (error) {
      console.error('❌ Error marking message as seen:', error);
      return false;
    }
  };

  /* ================= CHECK MESSAGE SEEN STATUS (GET) ================= */
  const checkMessageSeenStatus = async (messageId: string) => {
    if (!token || !messageId) return false;

    try {
      const url = `${apiBase}/chats/seenmessage/${messageId}`;
      console.log('🔍 Checking message seen status (GET):', url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to check message status:', res.status);
        return false;
      }

      const data = await res.json();
      console.log('✅ Message status:', data);
      
      return data.seen === true || data.seenBy === true || data.response?.seen === true;
    } catch (error) {
      console.error('❌ Error checking message status:', error);
      return false;
    }
  };

  /* ================= GET LAST MESSAGE ================= */
  const getLastMessage = async (senderId: string) => {
    if (!token || !senderId) return null;

    try {
      const url = `${apiBase}/chats/message/lastmessage/${senderId}`;
      console.log('📩 Getting last message from sender:', senderId);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Failed to get last message:', res.status);
        return null;
      }

      const data = await res.json();
      console.log('✅ Last message:', data);
      
      const lastMessage = data.response || data;
      return {
        ...lastMessage,
        seen: lastMessage.seen || lastMessage.seenBy || false,
      };
    } catch (error) {
      console.error('❌ Error getting last message:', error);
      return null;
    }
  };

  /* ================= UPDATE CHAT SEEN STATUS ================= */
  const updateChatSeenStatus = async (chat: ChatItem) => {
    if (!chat || !chat.chatId) return chat;

    try {
      const lastMessage = await getLastMessage(chat.chatId);
      
      if (lastMessage && lastMessage._id) {
        const isSeen = await checkMessageSeenStatus(lastMessage._id);
        
        return {
          ...chat,
          lastMessage: {
            ...chat.lastMessage,
            seenBy: isSeen,
          },
        };
      }
      return chat;
    } catch (error) {
      console.error('Error updating chat seen status:', error);
      return chat;
    }
  };

  /* ================= 1️⃣ FETCH CHATS WITH CATEGORY ================= */
  const fetchChats = async (category: FilterType = 'all') => {
    if (!myUserId || !token) {
      console.log('⚠️ Missing userId or token');
      return null;
    }

    try {
      const url = `${apiBase}/chats/chats/${myUserId}?category=${category}`;
      console.log('🔍 Fetching:', url);
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ API Response:', data);
      
      const rawList = data.response || data.userchats || [];
      let normalizedChats = normalizeChats(rawList, myUserId);
      
      if (normalizedChats && normalizedChats.length > 0) {
        const updatedChats = await Promise.all(
          normalizedChats.map(async (chat) => {
            if (chat.lastMessage.sender === myUserId) {
              return await updateChatSeenStatus(chat);
            }
            return chat;
          })
        );
        normalizedChats = updatedChats;
      }
      
      return normalizedChats;
    } catch (error) {
      console.error('❌ Error fetching chats:', error);
      return null;
    }
  };

  /* ================= LOAD INITIAL CHATS ================= */
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

  /* ================= 2️⃣ WEBSOCKET ================= */
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

  /* ================= 3️⃣ EVENT ROUTER ================= */
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

  /* ================= 4️⃣ MESSAGE ================= */
  function onWsMessage(msg: Message) {
    setChats((prev) => {
      const isMe = msg.sender === myUserId;
      const otherId = isMe ? msg.receiver : msg.sender;

      const list = [...prev];
      const idx = list.findIndex((c) => c.chatId === otherId);

      if (idx === -1) {
        return prev;
      }

      const chat = { ...list[idx] };

      chat.lastMessage = {
        ...msg,
        seenBy: isMe ? chat.lastMessage.seenBy : false,
      };
      chat.typing = false;

      if (!isMe) chat.unreadCount += 1;

      list.splice(idx, 1);
      return [chat, ...list];
    });
  }

  /* ================= 5️⃣ TYPING ================= */
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

  /* ================= 6️⃣ SEEN ================= */
  function onSeen({ sender }: any) {
    markChatSeen(sender);

    setChats(prev =>
      prev.map(c => {
        if (c.chatId !== sender) return c;
        if (c.lastMessage.sender !== myUserId) return c;

        return {
          ...c,
          unreadCount: 0,
          lastMessage: {
            ...c.lastMessage,
            seenBy: true,
          },
        };
      })
    );
  }

  /* ================= 7️⃣ HANDLE FILTER CHANGE ================= */
  const handleFilterChange = async (filter: FilterType) => {
    setActiveFilter(filter);
    setFilterLoading(true);

    try {
      const normalized = await fetchChats(filter);
      if (normalized) {
        setFilteredChats(normalized);
      } else {
        const filtered = filterChatsClientSide(chats, filter);
        setFilteredChats(filtered);
      }
    } catch (error) {
      console.error('Error fetching filtered chats:', error);
      const filtered = filterChatsClientSide(chats, filter);
      setFilteredChats(filtered);
    } finally {
      setFilterLoading(false);
    }
  };

  /* ================= CLIENT-SIDE FILTERING FALLBACK ================= */
  const filterChatsClientSide = (chatsList: ChatItem[], filter: FilterType): ChatItem[] => {
    switch(filter) {
      case 'all':
        return chatsList;
      case 'read':
        return chatsList.filter(c => c.lastMessage?.seenBy === true);
      case 'unread':
        return chatsList.filter(c => c.unreadCount > 0);
      case 'starred':
        return chatsList.filter(c => c.isFavorite === true);
      case 'groups':
        return chatsList.filter(c => c.isGroup === true);
      case 'calls':
        return chatsList.filter(c => c.chatType === 'call');
      default:
        return chatsList;
    }
  };

  /* ================= UPDATE FILTERED CHATS WHEN CHATS CHANGE ================= */
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredChats(chats);
    } else {
      const filtered = filterChatsClientSide(chats, activeFilter);
      setFilteredChats(filtered);
    }
  }, [chats, activeFilter]);

  /* ================= SEARCH ================= */
  const searchedChats = filteredChats.filter((chat) => {
    const userName = chat.userinfo?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  /* ================= SECTION TITLE ================= */
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

  /* ================= FILTER COUNTS ================= */
  const getFilterCounts = useMemo(() => {
    return {
      all: chats.length,
      read: chats.filter(c => c.lastMessage?.seenBy === true).length,
      unread: chats.filter(c => c.unreadCount > 0).length,
      starred: chats.filter(c => c.isFavorite === true).length,
      groups: chats.filter(c => c.isGroup === true).length,
      calls: chats.filter(c => c.chatType === 'call').length,
    };
  }, [chats]);

  if (loading) {
    return <div className="p-4 text-center">جارٍ التحميل...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-5">
        <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
          {getSectionTitle()}
        </h1>
        <button
          onClick={() => router.push('/chats/create-group')}
          className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
          aria-label="إنشاء مجموعة"
        >
          <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
        </button>
      </div>

      <div className="flex items-center justify-center w-full mb-3">
        <div className="w-[90%] bg-[#F2F2F2] flex h-[61px] items-center px-4 gap-1 rounded-[27px]">
          <Search className="text-[#B6B7B7]"/>
          <input 
            type="text" 
            placeholder="ابحث عن اسم الشخص..." 
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
        <div className="flex flex-col gap-1">
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
            const isLastFromMe = chat.lastMessage.sender === myUserId;
            const isMessageSeen = chat.lastMessage.seenBy === true;
            const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
            const time = formatMessageTime(chat.lastMessage.timestamp);

            return (
              <div
                key={chat.chatId}
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
                className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer ${
                  activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"
                }`}
                dir="ltr"
              >
                <img
                  src={chat.userinfo?.img || "/imgs/user.png"}
                  className="w-[60px] h-[60px] rounded-[25px] object-cover"
                  alt={chat.userinfo?.name}
                />

                <div className="flex-1">
                  <div className="font-medium text-black flex items-center justify-between">
                    <span>{chat.userinfo?.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400 font-normal">
                        {time}
                      </span>
                      {isLastFromMe && (
                        <span className="text-xs">
                          {isMessageSeen ? (
                            <img 
                              src="/imgs/read.svg" 
                              alt="مقروءة" 
                              className="w-4 h-4" 
                              onError={(e) => {
                                // If image fails to load, show text instead
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const textSpan = document.createElement('span');
                                  textSpan.className = 'text-blue-500 text-xs font-bold';
                                  textSpan.textContent = '✓✓';
                                  parent.appendChild(textSpan);
                                }
                              }}
                            />
                          ) : (
                            <img 
                              src="/imgs/unread.svg" 
                              alt="غير مقروءة" 
                              className="w-4 h-4"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const textSpan = document.createElement('span');
                                  textSpan.className = 'text-gray-400 text-xs font-bold';
                                  textSpan.textContent = '✓';
                                  parent.appendChild(textSpan);
                                }
                              }}
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                    {chat.typing
                      ? "يكتب الان ..."
                      : chat.lastMessage?.message || ""}
                  </div> 
                </div>

                {/* Right side - Unread Count for messages from others */}
                {!isLastFromMe && hasUnread && (
                  <div className="flex items-center mt-6">
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}