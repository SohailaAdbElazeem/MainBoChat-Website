/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import wsService from "@/lib/websocketService";
import { isChatSeen, markChatSeen } from "@/lib/seenGuard";
import { ChatItem, Message } from "@/types/types";
import { Search, X, ChevronDown, Flag, Search as SearchIcon, Archive, Trash2, LogOut, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import ChatFilters from './ChatFilters';
 import { motion } from "framer-motion"; // أضف هذا في أعلى الملف
 
type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

type Props = {
  userId?: string | null;
  apiBase: string;
  activeChatId?: string | null;
//  onSelectionChange?: (isSelecting: boolean, count: number) => void; // إضافة هذ
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
      description: chat.description || '',
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
      members: chat.members || [],
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

  // ================= SELECTION MODE =================
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const longPressTimer = useRef<any>(null);

  // Group Creation Modal States
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
const [isMemberSelectionOpen, setIsMemberSelectionOpen] = useState(false);

  // Transfer Ownership Modal States
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newOwnerId, setNewOwnerId] = useState<string>('');

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const typingTimers = useRef<Record<string, any>>({});

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const pathname = usePathname();
  const activeChatId = propActiveChatId || pathname?.split("/").pop();


// ////////////////////////////////////////////
// ////////////////////////////////////////////

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

  // ================= SELECTION MODE HANDLERS =================
  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev => {
      if (prev.includes(chatId)) {
        const newSelected = prev.filter(id => id !== chatId);
        if (newSelected.length === 0) {
          setSelectionMode(false);
        }
        return newSelected;
      } else {
        return [...prev, chatId];
      }
    });
  };

  const selectAllChats = () => {
    const allIds = searchedChats.map(chat => chat.chatId);
    setSelectedChats(allIds);
    setSelectionMode(true);
  };

  const clearSelection = () => {
    setSelectedChats([]);
    setSelectionMode(false);
  };

  // ================= BULK ACTIONS =================
  const handleBulkDelete = async () => {
    if (selectedChats.length === 0) return;
    const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في حذف ${selectedChats.length} محادثة؟`);
    if (!confirmDelete) return;
    
    for (const chatId of selectedChats) {
      const chat = chats.find(c => c.chatId === chatId);
      if (chat) {
        await handleDeleteChat(chatId, chat.chatType);
      }
    }
    clearSelection();
  };

  const handleBulkArchive = async () => {
    if (selectedChats.length === 0) return;
    
    for (const chatId of selectedChats) {
      const chat = chats.find(c => c.chatId === chatId);
      if (chat) {
        await handleArchiveChat(chatId, chat.chatType);
      }
    }
    clearSelection();
  };

  const handleBulkCall = () => {
    if (selectedChats.length === 0) return;
    alert(`جاري إنشاء مكالمة جماعية مع ${selectedChats.length} محادثة`);
    clearSelection();
  };

  const handleBulkGroupMessage = () => {
    if (selectedChats.length === 0) return;
    alert(`جاري إنشاء رسالة جماعية مع ${selectedChats.length} محادثة`);
    clearSelection();
  };

  // ================= MOUSE EVENTS FOR LONG PRESS =================
  const handleMouseDown = (chatId: string, e: React.MouseEvent) => {
    if (e.button === 0 && !selectionMode) {
      longPressTimer.current = setTimeout(() => {
        setSelectionMode(true);
        setSelectedChats([chatId]);
      }, 500);
    }
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleMouseLeave = () => {
    clearTimeout(longPressTimer.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(longPressTimer.current);
    };
  }, []);

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
   // ================= FETCH GROUP DETAILS =================
  const fetchGroupDetails = async (groupId: string) => {
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
      return data.response || null;
    } catch (error) {
      console.error('Error fetching group details:', error);
      return null;
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
              };
            }
          }
          return chat;
        })
      );
      
      const normalizedChats = normalizeChats(enrichedList, myUserId);
      return normalizedChats;
    } catch (error) {
      console.error('Error fetching chats:', error);
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
    if (selectionMode) {
      return '';
    }
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

  // ================= GROUP AVATAR RENDERER =================
  const renderGroupAvatar = (chat: ChatItem) => {
    let members = chat.members || [];
    
    if (members.length === 0) {
      const otherMember = {
        _id: chat.chatId,
        name: chat.name,
        img: chat.userinfo?.img || chat.avatar || '/imgs/user.png',
        avatar: chat.userinfo?.avatar || chat.avatar || '/imgs/user.png',
      };
      
      let currentUserImg = '/imgs/user.png';
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        currentUserImg = userData.img || userData.avatar || '/imgs/user.png';
      } catch (e) {
        currentUserImg = '/imgs/user.png';
      }
      
      const currentUser = {
        _id: myUserId,
        name: 'أنت',
        img: currentUserImg,
        avatar: currentUserImg,
      };
      members = [currentUser, otherMember];
    }
    
    const memberCount = members.length;
    
    const getMemberImage = (index: number) => {
      const member = members[index];
      return member?.img || member?.avatar || '/imgs/user.png';
    };

    const GroupIcon = () => (
      <div 
        style={{
          position: 'absolute',
          width: '19px',
          height: '19px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '8px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src="/imgs/Group.svg" 
          alt="Group" 
          style={{
            width: '10.909222602844238px',
            height: '10.909222602844238px',
          }}
        />
      </div>
    );

 
    if (memberCount < 2) {
      return (
        <div 
          className="relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0  flex items-center justify-center"
        >
          {/* صورة العضو الوحيد متمركزة في المنتصف */}
          <img 
            // src={getMemberImage(0)} 
             src="imgs/person1.svg"
            alt="Member" 
            className="w-full h-full object-cover rounded-[15px] p-1" 
          />
          <GroupIcon />
        </div>
      );
    }

    if (memberCount === 2) {
      return (
        <div
          className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0"
        >
          <img
            // src={getMemberImage(0)}
            src="imgs/person1.svg"
            alt="Member 1"
            className="absolute object-cover"
            style={{
              width: '34.0913200378418',
              height: '34.0913200378418',
              top: '9px',
              left: '25px',
              objectFit: 'cover',
              borderRadius: '15px',
              zIndex: 1,
            }}
          />
          <img
            // src={getMemberImage(1)}
            src="imgs/person2.svg"
            alt="Member 2"
            className="absolute object-cover"
            style={{
              width: '34.0913200378418',
              height: '34.0913200378418',
              top: '9px',
              left: '1px',
              objectFit: 'cover',
              borderRadius: '15px',
              zIndex: 2,
            }}
          />
          <GroupIcon />
        </div>
      );
    }
 

    if (memberCount === 3) { 
      return ( 
        <div 
          className="relative w-[60px] h-[60px]  overflow-hidden flex-shrink-0 " 
        > 
          {/* الصورة الأولى (أعلى اليمين) */}
          <img 
            // src={getMemberImage(0)} 
            src="imgs/person1.svg" 
            alt="Member 1" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ 
              width: '34px', 
              height: '34px', 
              top: '4px', 
              right: '6px', 
              zIndex: 1, 
            }} 
          /> 

          {/* الصورة الثانية (أعلى اليسار) */}
          <img 
            // src={getMemberImage(1)} 
            src="imgs/person2.svg" 
            alt="Member 2" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ 
              width: '34px', 
              height: '34px', 
              top: '4px', 
              left: '-2px', 
              zIndex: 1, 
            }} 
          /> 

          {/* الصورة الثالثة (تحتهم في المنتصف) */}
          <img 
            // src={getMemberImage(2)} 
            src="imgs/person2.svg" 
            alt="Member 3" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ 
              width: '34px', 
              height: '34px', 
              bottom: '4px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 2, 
            }} 
          /> 
          <GroupIcon /> 
        </div> 
      ); 
    }

    if (memberCount === 4) {
      return (
        <div 
          className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0 "
        >
          {/* 1. أعلى اليسار (تحت الثالثة وفوق الثانية) */}
          <img 
            // src={getMemberImage(0)} 
            src="imgs/person1.svg" 
            alt="Member 1" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
          /> 

          {/* 2. أعلى اليمين (تحت الأولى وفوق الرابعة) */}
          <img 
            // src={getMemberImage(1)}
            src="imgs/person2.svg"  
            alt="Member 2" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
          /> 

          {/* 3. أسفل اليسار (فوق الأولى والرابعة) */}
          <img 
            // src={getMemberImage(2)} 
            src="imgs/person2.svg" 
            alt="Member 3" 
            className="absolute object-cover  rounded-[15px]" 
            style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }} 
          /> 

          {/* 4. أسفل اليمين (تحت الثانية والثالثة) */}
          <img 
            // src={getMemberImage(3)} 
            src="imgs/person1.svg" 
            alt="Member 4" 
            className="absolute object-cover rounded-[15px] " 
            style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }} 
          /> 

          <GroupIcon /> 
        </div>
      );
    }


    // 5. خمسة أشخاص أو أكثر (ابتداءً من 5)
if (memberCount >= 5) {
  const extraCount = memberCount - 3; 

  return (
    <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
      {/* 1. أعلى اليسار (الصورة الأولى) */}
      <img 
        src="imgs/person1.svg" 
        alt="Member 1" 
        className="absolute object-cover rounded-[15px]" 
        style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
      /> 

      {/* 2. أعلى اليمين (الصورة الثانية) */}
      <img 
        src="imgs/person2.svg" 
        alt="Member 2" 
        className="absolute object-cover rounded-[15px]" 
        style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
      /> 

      {/* 3. أسفل اليسار: العداد للمتبقين (أصبح هو الثالث) */}
      <div 
        className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold text-[12px] rounded-[15px] shadow-sm"
        style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
      >
        {extraCount}
      </div>

      {/* 4. أسفل اليمين: الصورة الثالثة (بالخصائص الجديدة) */}
      <img 
        src="imgs/person1.svg" 
        alt="Member 3" 
        className="absolute object-cover rounded-[15px]" 
        style={{ 
          width: '34.09px', 
          height: '34.09px', 
          bottom: '2px', 
          right: '2px', 
          zIndex: 1,
          // transform: 'rotate(-180deg)' // تطبيق زاوية الدوران المطلوبة
        }} 
      />

      <GroupIcon /> 
    </div>
  );
}

    return (
      <div 
        className="relative w-[60px] h-[60px] rounded-[25px] border border-white overflow-hidden flex-shrink-0"
      >
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
          {members.slice(0, 3).map((member: any, index: number) => {
            let colSpan = index === 2 ? 'col-span-2' : 'col-span-1';
            return (
              <img
                key={index}
                src={getMemberImage(index)}
                alt="Member"
                className={`w-full h-full object-cover ${colSpan} row-span-1`}
              />
            );
          })}
          {members.length > 3 && (
            <div 
              className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center bg-black/70 text-white text-[10px] font-bold rounded-br-[25px] z-20"
            >
              +{members.length - 3}
            </div>
          )}
        </div>
        <GroupIcon />
      </div>
    );
  };

  // ================= BLOCK USER =================
  const handleBlockUser = async (chatId: string) => {
    if (!token) return;
    
    const confirmBlock = window.confirm(`هل أنت متأكد من رغبتك في حظر هذا المستخدم؟`);
    if (!confirmBlock) {
      setOpenDropdown(null);
      return;
    }
    
    try {
      const response = await fetch(`${apiBase}/chats/block`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          blocked_user_id: chatId 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ تم حظر المستخدم بنجاح');
        setChats(prev => prev.filter(c => c.chatId !== chatId));
        setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));
        
        if (activeChatId === chatId) {
          router.push('/chats');
        }
        
        setOpenDropdown(null);
      } else {
        alert(`❌ فشل حظر المستخدم: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('حدث خطأ أثناء محاولة حظر المستخدم');
    }
  };

  // ================= ARCHIVE/FAVORITE CHAT =================
  const handleArchiveChat = async (chatId: string, chatType: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${apiBase}/chats/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatId: chatId,
          chatType: chatType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ تمت إضافة المحادثة إلى المفضلة بنجاح');
        setChats(prev => 
          prev.map(c => 
            c.chatId === chatId 
              ? { ...c, isFavorite: true } 
              : c
          )
        );
        setFilteredChats(prev => 
          prev.map(c => 
            c.chatId === chatId 
              ? { ...c, isFavorite: true } 
              : c
          )
        );
        setOpenDropdown(null);
      } else {
        alert(`❌ فشل إضافة المحادثة إلى المفضلة: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error archiving chat:', error);
      alert('حدث خطأ أثناء محاولة إضافة المحادثة إلى المفضلة');
    }
  };

  // ================= DELETE CHAT =================
  const handleDeleteChat = async (chatId: string, chatType: string) => {
    if (!token) return;
    
    const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في حذف هذه المحادثة؟`);
    if (!confirmDelete) {
      setOpenDropdown(null);
      return;
    }
    
    try {
      const response = await fetch(`${apiBase}/chats/chats/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatId: chatId,
          chatType: chatType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ تم حذف المحادثة بنجاح');
        setChats(prev => prev.filter(c => c.chatId !== chatId));
        setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));
        
        if (activeChatId === chatId) {
          router.push('/chats');
        }
        
        setOpenDropdown(null);
      } else {
        alert(`❌ فشل حذف المحادثة: ${data.response || data.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('حدث خطأ أثناء محاولة حذف المحادثة');
    }
  };

  // ================= TRANSFER OWNERSHIP =================
  const handleTransferOwnership = async (groupId: string, newOwnerId: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${apiBase}/chats/groups/TransferOwnership/${groupId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newOwnerId })
      });

      const data = await response.json();
      
      if (data.success) {
        await handleLeaveGroup(groupId);
        setShowTransferModal(false);
        setSelectedGroupId(null);
        setNewOwnerId('');
      } else {
        alert(`فشل تحويل الملكية: ${data.response || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error transferring ownership:', error);
      alert('حدث خطأ أثناء تحويل الملكية');
    }
  };

  // ================= LEAVE GROUP =================
  const handleLeaveGroup = async (chatId: string) => {
    if (!token) return;
    
    const confirmLeave = window.confirm('هل أنت متأكد من رغبتك في الخروج من هذه المجموعة؟');
    if (!confirmLeave) {
      setOpenDropdown(null);
      return;
    }
    
    try {
      const response = await fetch(`${apiBase}/chats/groups/LeaveGroup/${chatId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setChats(prev => prev.filter(c => c.chatId !== chatId));
        setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));
        
        if (activeChatId === chatId) {
          router.push('/chats');
        }
        
        setOpenDropdown(null);
      } else {
        if (data.response?.includes('Transfer ownership')) {
          setSelectedGroupId(chatId);
          setShowTransferModal(true);
          setOpenDropdown(null);
        } else {
          alert(`❌ فشل الخروج من المجموعة: ${data.response || 'خطأ غير معروف'}`);
        }
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('حدث خطأ أثناء محاولة الخروج من المجموعة');
    }
  };

  // ================= DROPDOWN ACTIONS =================
  const handleDropdownAction = (action: string, chatId: string, chatType: string) => {
    setOpenDropdown(null);
    console.log(`Action: ${action} on chat: ${chatId}`);
    switch(action) {
      case 'block':
        handleBlockUser(chatId);
        break;
      case 'report':
        break;
      case 'search':
        break;
      case 'archive':
        handleArchiveChat(chatId, chatType);
        break;
      case 'delete':
        handleDeleteChat(chatId, chatType);
        break;
      case 'leave':
        handleLeaveGroup(chatId);
        break;
    }
  };

  if (loading) {
    return <div className="p-4 text-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-5">
        <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
          {getSectionTitle()}
        </h1>
        
        {!selectionMode && (
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
            aria-label="إنشاء مجموعة"
          >
            <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
          </button>
        )}
      </div>

      {/* ================= SELECTION MODE TOOLBAR ================= */}
      {selectionMode && selectedChats.length > 0 && (
        <div className="w-full px-4 mb-3"  style={{
      background: 'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderRadius: '12px',
    }}>
          {/* السطر الأول: الأزرار الأربعة */}
          <div className="flex items-center justify-center gap-2">
           <button
  onClick={handleBulkDelete}
  style={{
    width: '63px',
    height: '31px',
    borderRadius: '10px',
    background: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    opacity: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  }}
  className="hover:bg-[#FFEBEE] hover:scale-105 transition-all"
>
  <span 
    style={{
      fontFamily: 'Cairo',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#B4B4B9',
      display: 'inline-block',
    }}
  >
    حذف
  </span>
</button>
                        <button
              onClick={handleBulkGroupMessage}
              style={{
                width: '102px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                opacity: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              className="hover:bg-[#E8F5E9] hover:scale-105 transition-all"
            >
               <span 
    style={{
      fontFamily: 'Cairo',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#B4B4B9',
      display: 'inline-block',
    }}
  >
    رسالة جماعية
  </span>
            </button>

            <button
              onClick={handleBulkCall}
              style={{
                width: '102px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                opacity: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              className="hover:bg-[#E8F4FD] hover:scale-105 transition-all"
            >
               <span 
    style={{
      fontFamily: 'Cairo',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#B4B4B9',
      display: 'inline-block',
    }}
  >
    مكالمة جماعية
  </span>
            </button>

            <button
              onClick={handleBulkArchive}
              style={{
                width: '63px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                opacity: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              className="hover:bg-[#FFF8E1] hover:scale-105 transition-all"
            >
               <span 
    style={{
      fontFamily: 'Cairo',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '100%',
      textAlign: 'center',
      color: '#B4B4B9',
      display: 'inline-block',
    }}
  >
    مميز
  </span>
            </button>


            
          </div>

          {/* السطر الثاني: تم تحديد X محادثة */}
          <div className="flex items-center justify-between px-2 mt-2">
          <div className="flex items-center justify-center px-2 mt-2 mb-1 w-full">
            <span 
              style={{
                width: '100%',
                opacity: 1,
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '25px',
                lineHeight: '100%',
                textAlign: 'center',
                color: '#000000',
                display: 'block'
              }}
            >
              تم تحديد {selectedChats.length} محادثة
            </span>
          </div>
          </div>
        </div>
      )}

      {/* Search */}
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

      {/* Filters */}
      <ChatFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        counts={getFilterCounts}
      />

      {filterLoading ? (
        <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
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
            const isSelected = selectedChats.includes(chat.chatId);

            return (
              <div
                key={chat.chatId}
               className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
                  activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"
                } ${
                  isSelected 
                    ? 'bg-[#FAFAFA] rounded-lg' 
                    : ''
                }`}
                dir="ltr"
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current[chat.chatId] = el;
                  }
                }}
                onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {/* Checkbox - يظهر فقط في وضع التحديد */}
                {selectionMode && (
                  <div className="flex-shrink-0">
                    <img 
                      src={isSelected ? "/imgs/check (2).svg" : "/imgs/uncheck.svg"} 
                      alt={isSelected ? "محدد" : "غير محدد"}
                      onClick={() => toggleChatSelection(chat.chatId)}
                      style={{
                        width: '20px',
                        height: '20px',
                        opacity: 1,
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                )}

                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => {
                    if (selectionMode) {
                      toggleChatSelection(chat.chatId);
                    } else {
                      markChatSeen(chat.chatId);
                      if (isLastFromMe && chat.lastMessage?._id) {
                        markMessageAsSeen(chat.lastMessage._id);
                      }
                      setChats(prev =>
                        prev.map(c =>
                          c.chatId === chat.chatId ? { ...c, unreadCount: 0 } : c
                        )
                      );
                      router.push(`/chats/${chat.chatId}`);
                    }
                  }}
                >
                  {chat.isGroup ? (
                    renderGroupAvatar(chat)
                  ) : (
                    <img
                      src={chat.userinfo?.img || "/imgs/user.png"}
                      className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
                      alt={chat.userinfo?.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '25px',
                      }}
                    />
                  )}

                  <div className="flex-1">
                    <div className="font-medium text-black flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="truncate">
                          {chat.isGroup ? (
                            <span className="flex items-center gap-1"   
                            style={{ fontSize: '18px'}} >
                              <span>{chat.name}</span>
                            </span>
                          ) : (
                            chat.userinfo?.name
                          )}
                        </span>
                        {chat.isGroup && chat.description && chat.description !== 'no' && (
                        <span 
                          className="truncate"
                          style={{
                            width: '297px',
                            height: '23px',
                            opacity: 1,
                            fontFamily: 'Cairo',
                            fontWeight: 400,
                            fontStyle: 'Regular',
                            fontSize: '15px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            verticalAlign: 'middle',
                            color: '#000000',
                            display: 'block',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {chat.description}
                        </span>
                      )}
                      </div>
                    </div>

                    <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                      {chat.typing ? "يكتب الان ..." : chat.lastMessage?.message || ""}
                    </div>
                  </div>
                </div>

                {/* العمود الأيمن: الزمن + علامة قراءة - الأرشفة - عدد الرسائل غير المقروءة */}
                {!selectionMode && (
                  <div className="flex flex-col items-center gap-1 mt-6">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap">
                        {time}
                      </span>
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
                    </div>
                    
                    {chat.isFavorite && (
                      <img 
                        src="/imgs/archive (2).svg" 
                        alt="مؤرشفة" 
                        className="flex-shrink-0"
                        style={{ 
                          width: '13px', 
                          height: '13px', 
                          opacity: 1,
                        }} 
                      />
                    )}
                    
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
                    <img 
                      src="/imgs/dropdwnBtn.svg" 
                      alt="قائمة"
                      style={{
                        width: '12px',
                        height: '6px',
                        opacity: 1,
                        transition: 'transform 0.3s ease',
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

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
                          onClick={() => handleDropdownAction('block', chat.chatId, chat.chatType)}
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
                          onClick={() => handleDropdownAction('report', chat.chatId, chat.chatType)}
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
                          onClick={() => handleDropdownAction('search', chat.chatId, chat.chatType)}
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
                          onClick={() => handleDropdownAction('archive', chat.chatId, chat.chatType)}
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
                          onClick={() => handleDropdownAction('delete', chat.chatId, chat.chatType)}
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
                          <button
                            onClick={() => handleDropdownAction('leave', chat.chatId, chat.chatType)}
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
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TRANSFER OWNERSHIP MODAL ================= */}
      {showTransferModal && selectedGroupId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">تحويل ملكية المجموعة</h3>
            <p className="text-gray-600 mb-4 text-center">
              أنت مالك هذه المجموعة. يرجى اختيار عضو لتحويل الملكية إليه قبل المغادرة.
            </p>
            
            <div className="mb-4 max-h-60 overflow-y-auto">
              {chats
                .filter(c => c.chatId !== myUserId && !c.isGroup)
                .map(member => (
                  <div
                    key={member.chatId}
                    onClick={() => setNewOwnerId(member.chatId)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                      newOwnerId === member.chatId ? 'bg-red-50 border-2 border-red-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={member.userinfo?.img || '/imgs/user.png'}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={member.name}
                    />
                    <span className="font-medium">{member.name}</span>
                  </div>
                ))}
            </div>
            
            {chats.filter(c => c.chatId !== myUserId && !c.isGroup).length === 0 && (
              <p className="text-center text-gray-500 mb-4">
                لا يوجد أعضاء متاحين لتحويل الملكية إليهم
              </p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedGroupId(null);
                  setNewOwnerId('');
                }}
                className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (newOwnerId && selectedGroupId) {
                    handleTransferOwnership(selectedGroupId, newOwnerId);
                  } else {
                    alert('يرجى اختيار عضو لتحويل الملكية إليه');
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newOwnerId}
              >
                تحويل الملكية والمغادرة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE GROUP MODAL ================= */}
      {/* {isCreateGroupOpen && (
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
      )} */}

     {/* ================= CREATE GROUP MODAL ================= */}
  {/* ================= CREATE GROUP MODAL ================= */}
{/* ================= CREATE GROUP MODAL ================= */} 
{isCreateGroupOpen && ( 
  <motion.div 
    drag 
    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} 
    dragMomentum={false} 
    className="fixed top-[130px] bottom-0 left-[18px] w-[20%] z-50 flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing" 
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
        <img  
          src="/imgs/close.svg"  
          alt="إغلاق" 
          style={{ width: '17px', height: '17px', opacity: 1 }} 
        /> 
      </button> 
      <h2 style={{ fontFamily: 'Cairo', fontWeight: 500, fontSize: '25px', lineHeight: '100%', color: '#000000' }}> 
        انشاء مجموعة 
      </h2> 
    </div> 
 
    <div className="mb-3 flex justify-center gap-1 flex-shrink-0 relative -mx-3"> 
      <div className="relative inline-block"> 
        <img 
          src={JSON.parse(localStorage.getItem('userData') || '{}').img || '/imgs/user.png'} 
          alt="صورة المستخدم" 
          className="w-[50px] h-[45px] rounded-[17px] object-cover" 
          style={{ filter: 'blur(1px)' }} 
        /> 
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
          <img src="/imgs/Groupcamer.svg" alt="كاميرا" style={{ width: '17px', height: '17px', opacity: 1 }} /> 
        </div> 
      </div> 
 
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
 
      <span style={{ width: '46px', height: '28px', fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '100%', color: '#B4B4B9', transform: 'translateY(15px)' }}> 
        25/{groupName.length} 
      </span> 
    </div> 
 
    <div className="mb-4 flex justify-center flex-shrink-0 -mx-3"> 
      <div className="flex items-center gap-3 p-3 w-full" style={{ maxWidth: '402px', height: '102px', borderRadius: '18px', background: '#FFFFFF' }}> 
        <textarea 
          placeholder="اكتب الوصف" 
          value={groupDescription} 
          onChange={(e) => setGroupDescription(e.target.value)} 
          style={{ flex: 1, height: '100%', fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', padding: '8px 0', border: 'none', outline: 'none', resize: 'none', background: 'transparent' }} 
          className="text-black placeholder-[#B4B4B9]" 
        /> 
      </div> 
    </div> 
 
    <div className="w-[calc(100%+48px)] -mx-6 shrink-0" style={{ height: '3px', borderTop: '0.33px solid #3C3C434D' }} /> 
 
    <div className="flex items-center justify-between mb-2 -mx-5 flex-shrink-0"> 
      <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '17px', color: '#000000' }}> 
        الاعضاء: 
      </span> 
      <div className="flex items-center gap-1"> 
        <button 
          onClick={() => { 
            const searchInput = document.getElementById('groupSearchInput'); 
            if (searchInput) { 
              searchInput.style.display = searchInput.style.display === 'none' ? 'flex' : 'none'; 
            } 
          }} 
          className="w-8 h-8 rounded-full bg-[#F2F2F2] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors" 
        > 
          <img src="/imgs/search_mem.svg" alt="بحث" style={{ width: '15px', height: '15px', opacity: 1 }} /> 
        </button> 
        <button 
          onClick={() => setIsMemberSelectionOpen(true)} 
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors" 
        > 
           <img src="/imgs/chooseMember.svg" alt="إضافة أعضاء" style={{ width: '16px', height: '16px', opacity: 1 }} /> 
        </button> 
        {selectedMembers.length > 0 && ( 
          <span className="text-sm text-[#D72229] font-semibold"> 
            ({selectedMembers.length}) 
          </span> 
        )} 
      </div> 
    </div> 
 
    <div 
      id="groupSearchInput" 
      className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0"  
      style={{ maxWidth: '402px', display: 'none' }} 
    > 
      <img src="/imgs/search_mem.svg" alt="بحث" style={{ width: '15px', height: '15px', opacity: 1, marginLeft: '8px' }} /> 
      <input 
        type="text" 
        placeholder="ابحث في الأعضاء..." 
        value={groupSearchTerm} 
        onChange={(e) => setGroupSearchTerm(e.target.value)} 
        className="w-full bg-transparent text-sm focus:outline-none" 
        style={{ fontFamily: 'Cairo', fontSize: '14px' }} 
      /> 
    </div> 
 
    <div className="flex-1 flex items-center justify-center mb-4 mx-auto w-full" style={{ maxWidth: '402px', minHeight: '150px' }}> 
      <div className="text-center"> 
        <img src="/imgs/noMember.svg" alt="لا يوجد أعضاء" className="w-[71px] h-[71px] object-contain mx-auto mb-2" /> 
      </div> 
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
  </motion.div> 
)}
{/* ================= MODAL اختيار الأعضاء ================= */}
{isMemberSelectionOpen && (
  <div
    className="fixed top-[130px] bottom-0 left-[18px] w-[20%] z-[60] flex flex-col p-6 bg-[#F5F5F5]"
    style={{
      direction: "rtl",
      borderRadius: "35px",
    }}
  >
    <div className="flex items-center gap-3 mb-4 flex-shrink-0">
      {/* زر إغلاق - صورة close.svg */}
      <button
        onClick={() => setIsMemberSelectionOpen(false)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
      >
        <img 
          src="/imgs/returnPage.svg" 
          alt="returnPage"
          style={{
            width: '17px',
            height: '17px',
            opacity: 1,
           }}
        />
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
          اضافة اشخاص
      </h2>
    </div>

       <div className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0" style={{ maxWidth: '402px' }}>
            <Search className="text-[#B6B7B7] w-4 h-4 ml-2" />
            <input
              type="text"
              placeholder="ابحث عن اسم شخص..."
              value={groupSearchTerm}
              onChange={(e) => setGroupSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{
                fontFamily: 'Cairo',
                fontSize: '14px'
              }}
            />
          </div>

              <div className="flex items-center justify-between px-2 mb-3">
                  {/* أقصى اليسار: صورة المستخدم واسمه */}
      <div className="flex items-center gap-1">
        <img
          src='/imgs/addperson.svg'
          alt="صورة المستخدم"
          className="w-[13px] h-[13px] object-cover"
        />
        <span className="text-sm font-semibold text-black">
         عدد الاعضاء 
        </span>
      </div>

        <div className="flex items-center gap-1">
        
        <span className="text-sm ">
          {selectedMembers.length}
        </span>
        <span className="text-sm text-gray-500">
           الأشخاص
        </span>
      </div>
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
        onClick={() => setIsMemberSelectionOpen(false)}
        style={{
          width: '100%',
          maxWidth: '285px',
          height: '50px',
          borderRadius: '20px',
          background: '#FFFFFF',
          fontFamily: 'Cairo',
          fontWeight: 600,
          fontSize: '17px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: '#000000',
        }}
        className="hover:bg-[#b01d23] shadow-md"
      >
       اضافة الاعضاء
      </button>
    </div>
  </div>
)}
    </div>
  );
}