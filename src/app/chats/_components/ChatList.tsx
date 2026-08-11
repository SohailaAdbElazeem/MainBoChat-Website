//  /* eslint-disable @next/next/no-img-element */
// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useEffect, useRef, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import wsService from "@/lib/websocketService";
// import { isChatSeen, markChatSeen } from "@/lib/seenGuard";
// import { ChatItem, Message } from "@/types/types";
// import { Search } from "lucide-react";
// import { usePathname } from "next/navigation";
// import ChatFilters from './ChatFilters'; // ✅ استيراد المكون الجديد

// // ✅ تعريف نوع الفلاتر
// type FilterType = 'all' | 'read' | 'unread' | 'favorite' | 'groups' | 'calls';

// type Props = {
//   userId: string;
//   apiBase: string;
// };

// /* ================= NORMALIZE ================= */
// function normalizeChats(messages: Message[], myId: string): ChatItem[] {
//   const map: Record<string, ChatItem> = {};
//   messages.forEach((msg) => {
//     const isMe = msg.sender === myId;
//     const otherId = isMe ? msg.receiver : msg.sender;

//     if (!map[otherId]) {
//       map[otherId] = {
//         chatId: otherId,
//         userinfo: msg.receiverinfo,
//         lastMessage: {
//           ...msg,
//           seenBy: false, 
//         },
//         unreadCount: 0,
//         typing: false,
//       };
//     }

//     if (
//       !isMe &&
//       msg.seenBy === false &&
//       !isChatSeen(otherId) 
//     ) {
//       map[otherId].unreadCount += 1;
//     }

//     if (
//       new Date(msg.timestamp) >
//       new Date(map[otherId].lastMessage.timestamp)
//     ) {
//       map[otherId].lastMessage = msg;
//     }
//   });

//   return Object.values(map).sort(
//     (a, b) =>
//       new Date(b.lastMessage.timestamp).getTime() -
//       new Date(a.lastMessage.timestamp).getTime()
//   );
// }

// /* ================= COMPONENT ================= */
// export default function ChatList({ apiBase }: { apiBase: string }) {
//   const [myUserId, setMyUserId] = useState("");
//   const router = useRouter();
//   const [chats, setChats] = useState<ChatItem[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // ✅ حالة البحث
//   const [searchTerm, setSearchTerm] = useState("");

//   // ✅ حالات الفلاتر الجديدة
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all');
//   const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
//   const [filterLoading, setFilterLoading] = useState(false);

//   const typingTimers = useRef<Record<string, any>>({});
//   const bcRef = useRef<BroadcastChannel | null>(null);
  
//   // ✅ حساب أعداد الفلاتر
//   const getFilterCounts = useMemo(() => {
//     return {
//       all: chats.length,
//       read: chats.filter(c => c.lastMessage?.seenBy).length,
//       unread: chats.filter(c => c.unreadCount > 0).length,
//       favorite: chats.filter(c => c.isFavorite).length,
//       groups: chats.filter(c => c.isGroup).length,
//       calls: chats.filter(c => c.lastCall).length,
//     };
//   }, [chats]);

//   useEffect(() => {
//     const raw = localStorage.getItem("userData");
//     if (!raw) return;

//     try {
//       const parsed = JSON.parse(raw);
//       setMyUserId(parsed._id);
//     } catch (e) {
//       console.error("Invalid userData in localStorage");
//     }
//   }, []);

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("accessToken")
//       : null;

//   const pathname = usePathname();
//   const activeChatId = pathname?.split("/").pop();

//   /* ================= 1️⃣ LOAD FROM API ================= */
//   useEffect(() => {
//     async function load() {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           // `${apiBase}/chats/${myUserId}`
//          ` ${apiBase}/chats/chats/${myUserId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         const normalized = normalizeChats(
//           data.userchats || [],
//           myUserId
//         );

//         setChats(normalized);
//         setFilteredChats(normalized);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (myUserId && token) load();
//   }, [myUserId, token, apiBase]);

//   /* ================= 2️⃣ WEBSOCKET ================= */
//   useEffect(() => {
//     if (!myUserId) return;

//     wsService.connect(myUserId);

//     const unsub = wsService.addHandler((payload: any) => {
//       handleWsEvent(payload);
//     });

//     return () => {
//       unsub();
//     };
//   }, [myUserId]);

//   /* ================= 3️⃣ BROADCAST ================= */
//   useEffect(() => {
//     bcRef.current = new BroadcastChannel("bochat-typing");

//     bcRef.current.onmessage = (ev) => {
//       if (ev.data?.type === "chat_update") {
//         handleWsEvent({
//           event: ev.data.event,
//           metadata: ev.data.metadata,
//         });
//       }
//     };
//     return () => {
//       bcRef.current?.close();
//       bcRef.current = null;
//     };
//   }, []);

//   /* ================= 4️⃣ EVENT ROUTER ================= */
//   function handleWsEvent(payload: any) {
//     if (!payload) return;

//     if (payload.event === "message" && payload.metadata) {
//       onWsMessage(payload.metadata);
//       return;
//     }

//     if (payload.event === "typing" && payload.metadata) {
//       onTyping(payload.metadata);
//       return;
//     }

//     if (payload.event === "seen" && payload.metadata) {
//       onSeen(payload.metadata);
//       return;
//     }

//     if (
//       payload._id &&
//       payload.sender &&
//       payload.receiver &&
//       payload.message
//     ) {
//       onWsMessage(payload);
//       return;
//     }
//   }

//   /* ================= 5️⃣ MESSAGE ================= */
//   function onWsMessage(msg: Message) {
//     setChats((prev) => {
//       const isMe = msg.sender === myUserId;
//       const otherId = isMe ? msg.receiver : msg.sender;

//       const list = [...prev];
//       const idx = list.findIndex((c) => c.chatId === otherId);

//       if (idx === -1) {
//         return prev;
//       }

//       const chat = { ...list[idx] };

//       chat.lastMessage = {
//         ...msg,
//         seenBy: isMe ? chat.lastMessage.seenBy : false,
//       };
//       chat.typing = false;

//       if (!isMe) chat.unreadCount += 1;

//       list.splice(idx, 1);
//       return [chat, ...list];
//     });
//   }

//   /* ================= 6️⃣ TYPING ================= */
//   function onTyping(payload: any) {
//     const sender = payload.sender;
//     const to = payload.receiver || payload.receiver;

//     if (!sender || to !== myUserId) return;

//     setChats((prev) =>
//       prev.map((c) =>
//         c.chatId === sender
//           ? { ...c, typing: true }
//           : c
//       )
//     );

//     clearTimeout(typingTimers.current[sender]);
//     typingTimers.current[sender] = setTimeout(() => {
//       setChats((prev) =>
//         prev.map((c) =>
//           c.chatId === sender
//             ? { ...c, typing: false }
//             : c
//         )
//       );
//     }, 1500);
//   }

//   /* ================= 7️⃣ SEEN ================= */
//   function onSeen({ sender }: any) {
//     console.log("🔥 SEEN EVENT RECEIVED:", sender);

//     markChatSeen(sender);

//     setChats(prev =>
//       prev.map(c => {
//         if (c.chatId !== sender) return c;
//         if (c.lastMessage.sender !== myUserId) return c;

//         return {
//           ...c,
//           unreadCount: 0,
//           lastMessage: {
//             ...c.lastMessage,
//             seenBy: true,
//           },
//         };
//       })
//     );
//   }

//   /* ================= POLLING ================= */
//   useEffect(() => {
//     if (!myUserId || !token) return;

//     const poll = async () => {
//       try {
//         const res = await fetch(
//           `${apiBase}/chats/chats/${myUserId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         const messages = data.userchats || [];

//         setChats(prev => {
//           const map = new Map(prev.map(c => [c.chatId, c]));
//           let changed = false;

//           messages.forEach(msg => {
//             const isMe = msg.sender === myUserId;
//             const otherId = isMe ? msg.receiver : msg.sender;

//             const existing = map.get(otherId);

//             if (!existing) {
//               return;
//             }

//             if (
//               new Date(msg.timestamp) >
//               new Date(existing.lastMessage.timestamp)
//             ) {
//               map.set(otherId, {
//                 ...existing,
//                 lastMessage: {
//                   ...msg,
//                   seenBy: existing.lastMessage.seenBy,
//                 },
//                 unreadCount:
//                   !isMe && !msg.seenBy
//                     ? existing.unreadCount + 1
//                     : existing.unreadCount,
//               });
//               changed = true;
//             }
//           });

//           return changed
//             ? Array.from(map.values()).sort(
//                 (a, b) =>
//                   new Date(b.lastMessage.timestamp).getTime() -
//                   new Date(a.lastMessage.timestamp).getTime()
//               )
//             : prev;
//         });
//       } catch {}
//     };

//     poll();
//     const id = setInterval(poll, 2500);

//     return () => clearInterval(id);
//   }, [myUserId, token, apiBase]);

//   /* ================= 8️⃣ HANDLE FILTER CHANGE ================= */
//   const handleFilterChange = async (filter: FilterType) => {
//     setActiveFilter(filter);
//     setFilterLoading(true);

//     try {
//       const res = await fetch(
//         // `${apiBase}/chats/${myUserId}?filter=${filter}`,
//       `${apiBase}/chats/chats/${myUserId}?category=all`,  // ✅ مسار صحيح
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error('Failed to fetch filtered chats');
//       }

//       const data = await res.json();
//       const normalized = normalizeChats(data.userchats || [], myUserId);
//       setFilteredChats(normalized);
      
//     } catch (error) {
//       console.error('Error fetching filtered chats:', error);
//       setFilteredChats(chats);
//     } finally {
//       setFilterLoading(false);
//     }
//   };

//   /* ================= 9️⃣ UPDATE FILTERED CHATS ================= */
//   useEffect(() => {
//     if (activeFilter === 'all') {
//       setFilteredChats(chats);
//     }
//   }, [chats, activeFilter]);

//   /* ================= 🔟 RENDER ================= */

//   // ✅ تصفية المحادثات بناءً على البحث
//   const searchedChats = filteredChats.filter((chat) => {
//     const userName = chat.userinfo?.name || chat.userinfo?.username || '';
//     return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
//   });

//   // ✅ دالة لتحديد عنوان القسم حسب الفلتر
//   const getSectionTitle = () => {
//     switch(activeFilter) {
//       case 'all':
//         return 'قسم  الرسائل العامة';
//       case 'read':
//         return 'قسم الرسائل المقروءة';
//       case 'unread':
//         return 'قسم الرسائل غير المقروءة';
//       case 'favorite':
//         return 'قسم الرسائل المميزة';
//       case 'groups':
//         return 'قسم المجموعات';
//       case 'calls':
//         return 'قسم المكالمات';
//       default:
//         return 'قسم الكلام بينا';
//     }
//   };

//   if (loading) {
//     return <div className="p-4">جارٍ التحميل...</div>;
//   }

//   return (
//     <div>
//       {/* ✅ العنوان الديناميكي */}
//       {/* <h1 className="text-[25px] mb-5 px-4">{getSectionTitle()}</h1> */}
//       {/* ✅ العنوان مع زر إنشاء مجموعة */}
// <div className="flex items-center justify-between px-4 mb-5">
//   <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
//     {getSectionTitle()}
//   </h1>
  
//   {/* ✅ زر إنشاء مجموعة */}
//   <button
//     onClick={() => router.push('/chats/create-group')}
//     className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
//     aria-label="إنشاء مجموعة"
//   >
//     <img 
//       src="/imgs/createGrup.svg" 
//       alt="إنشاء مجموعة"
//       className="w-6 h-6 block"
//     />
//   </button>
// </div>
//       {/* 🔍 شريط البحث */}
//       <div className="flex items-center justify-center w-full mb-3">
//         <div className="w-[90%] bg-[#F2F2F2] flex h-[61px] items-center px-4 gap-1 rounded-[27px]">
//           <Search className="text-[#B6B7B7]"/>
//           <input 
//             type="text" 
//             placeholder="ابحث عن اسم الشخص..." 
//             className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <button 
//               onClick={() => setSearchTerm('')}
//               className="text-gray-400 hover:text-gray-600 text-sm"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//     {/* ✅ الفلاتر الجديدة بالتصميم المطلوب */}
//       <ChatFilters 
//         onFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//         counts={getFilterCounts}
//       />

//       {/* ✅ حالة تحميل الفلاتر */}
//       {filterLoading ? (
//         <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
//       ) : (
//         <div className="flex flex-col gap-1">
//           {/* ✅ عرض المحادثات المفلترة والمبحثة */}
//           {searchedChats.length === 0 && searchTerm.trim() !== '' && (
//             <div className="text-center text-gray-500 py-10">
//               لا توجد محادثات مع <span className="font-bold">"{searchTerm}"</span>
//             </div>
//           )}

//           {searchedChats.length === 0 && searchTerm.trim() === '' && (
//             <div className="text-center text-gray-500 py-10">
//               ليس لديك أي محادثات حالياً
//             </div>
//           )}

//           {searchedChats.map((chat) => {
//             const isLastFromMe = chat.lastMessage.sender === myUserId;

//             return (
//               <div
//                 key={chat.chatId}
//                 onClick={() => {
//                   markChatSeen(chat.chatId);
//                   setChats(prev =>
//                     prev.map(c =>
//                       c.chatId === chat.chatId
//                         ? { ...c, unreadCount: 0 }
//                         : c
//                     )
//                   );
//                   router.push(`/chats/${chat.chatId}`);
//                 }}
//                 className={`
//                   flex items-center gap-3 px-3 py-1 transition cursor-pointer
//                   ${activeChatId === chat.chatId
//                     ? "active-chat"
//                     : "hover:bg-gray-100"}
//                 `}
//                 dir="ltr"
//               >
//                 <img
//                   src={chat.userinfo?.img || "/imgs/user.png"}
//                   className="w-[60px] h-[60px] rounded-[25px]"
//                 />

//                 <div className="flex-1">
//                   <div className="font-medium">
//                     {chat.userinfo?.name}
//                   </div>

//                   <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
//                     {chat.typing
//                       ? "يكتب الان ..."
//                       : chat.lastMessage.type === "image" ||
//                         chat.lastMessage.type === "sticker"
//                         ? "صورة 📷"
//                         : chat.lastMessage.message || ""}
//                   </div> 
//                 </div>

//                 {isLastFromMe && (
//                   <span className="text-xs">
//                     {chat.lastMessage.seenBy ? (
//                       <img src="/icons/read.svg" alt="read" />
//                     ) : (
//                       <img src="/icons/unread.svg" alt="unread" />
//                     )}
//                   </span>
//                 )}

//                 {!isLastFromMe && chat.unreadCount > 0 && (
//                   <span className="w-2 h-2 bg-red-500 rounded-full" />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

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

type FilterType = 'all' | 'read' | 'unread' | 'favorite' | 'groups' | 'calls';

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
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (propUserId) {
      setMyUserId(propUserId);
      return;
    }
    const raw = localStorage.getItem("userData");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setMyUserId(parsed._id || parsed.id || "");
    } catch (e) {
      console.error("Invalid userData in localStorage");
    }
  }, [propUserId]);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const pathname = usePathname();
  const activeChatId = propActiveChatId || pathname?.split("/").pop();

  /* ================= 1️⃣ LOAD FROM API ================= */
  useEffect(() => {
    async function load() {
      if (!myUserId || !token) return;
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/chats/chats/${myUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // ✅ استخدام data.response بناءً على هيكل استجابة السيرفر
        const rawList = data.response || data.userchats || [];
        const normalized = normalizeChats(rawList, myUserId);

        setChats(normalized);
        setFilteredChats(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
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

  /* ================= 5️⃣ MESSAGE ================= */
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

  /* ================= 6️⃣ TYPING ================= */
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

  /* ================= 7️⃣ SEEN ================= */
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

  /* ================= 8️⃣ HANDLE FILTER CHANGE ================= */
  const handleFilterChange = async (filter: FilterType) => {
    setActiveFilter(filter);
    setFilterLoading(true);

    try {
      const res = await fetch(`${apiBase}/chats/chats/${myUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch filtered chats');

      const data = await res.json();
      const rawList = data.response || data.userchats || [];
      const normalized = normalizeChats(rawList, myUserId);
      setFilteredChats(normalized);
    } catch (error) {
      console.error('Error fetching filtered chats:', error);
      setFilteredChats(chats);
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredChats(chats);
    }
  }, [chats, activeFilter]);

  const searchedChats = filteredChats.filter((chat) => {
    const userName = chat.userinfo?.name || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const getSectionTitle = () => {
    switch(activeFilter) {
      case 'all': return 'قسم الرسائل العامة';
      case 'read': return 'قسم الرسائل المقروءة';
      case 'unread': return 'قسم الرسائل غير المقروءة';
      case 'favorite': return 'قسم الرسائل المميزة';
      case 'groups': return 'قسم المجموعات';
      case 'calls': return 'قسم المكالمات';
      default: return 'قسم الكلام بينا';
    }
  };

  const getFilterCounts = useMemo(() => {
    return {
      all: chats.length,
      read: chats.filter(c => c.lastMessage?.seenBy).length,
      unread: chats.filter(c => c.unreadCount > 0).length,
      favorite: chats.filter(c => c.isFavorite).length,
      groups: chats.filter(c => c.isGroup).length,
      calls: 0,
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
              ليس لديك أي محادثات حالياً
            </div>
          )}

          {searchedChats.map((chat) => {
            const isLastFromMe = chat.lastMessage.sender === myUserId;

            return (
              <div
                key={chat.chatId}
                onClick={() => {
                  markChatSeen(chat.chatId);
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
                />

                <div className="flex-1">
                  <div className="font-medium text-black">
                    {chat.userinfo?.name}
                  </div>

                  <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                    {chat.typing
                      ? "يكتب الان ..."
                      : chat.lastMessage?.message || ""}
                  </div> 
                </div>

                {isLastFromMe && (
                  <span className="text-xs">
                    {chat.lastMessage.seenBy ? (
                      <img src="/icons/read.svg" alt="read" />
                    ) : (
                      <img src="/icons/unread.svg" alt="unread" />
                    )}
                  </span>
                )}

                {!isLastFromMe && chat.unreadCount > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}