// // // // // src>app>chats>_compoents>ChatList.tsx
// // // // /* eslint-disable @next/next/no-img-element */
// // // // /* eslint-disable jsx-a11y/alt-text */
// // // // /* eslint-disable @typescript-eslint/no-explicit-any */

// // // // 'use client';

// // // // import { useEffect, useRef, useState, useMemo } from "react";
// // // // import { useRouter } from "next/navigation";
// // // // import wsService from "@/lib/websocketService";
// // // // import { markChatSeen } from "@/lib/seenGuard";
// // // // import { ChatItem, Message } from "@/types/types";
// // // // import { Search, X, ChevronDown, Flag, Search as SearchIcon, Archive, Trash2, LogOut, Check } from "lucide-react";
// // // // import { usePathname } from "next/navigation";
// // // // import ChatFilters from './ChatFilters';
// // // // import { motion } from "framer-motion";
// // // // import { toast } from 'react-hot-toast';
// // // // import { Phone, Video } from "lucide-react";
// // // // // import Loader from '@/components/Loader';


// // // // type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

// // // // type Props = {
// // // //   userId?: string | null;
// // // //   apiBase: string;
// // // //   activeChatId?: string | null;
// // // // };

// // // // /* ================= NORMALIZE ================= */
// // // // // function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
// // // // //   if (!Array.isArray(rawChats)) return [];

// // // // //   const map: Record<string, ChatItem> = {};
  
// // // // //   rawChats.forEach((chat) => {
// // // // //     const otherId = chat.otherUserId || chat.id;
// // // // //     const lastMsgText = typeof chat.lastMessage === 'string' 
// // // // //       ? chat.lastMessage 
// // // // //       : chat.lastMessage?.text || chat.lastMessage || '';

// // // // //     const msgObj: Message = {
// // // // //       _id: chat.id,
// // // // //       sender: chat.lastMessage?.sender || otherId,
// // // // //       receiver: myId,
// // // // //       message: lastMsgText,
// // // // //       timestamp: chat.timestamp || new Date().toISOString(),
// // // // //       seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
// // // // //       type: chat.lastMessageType || 'text',
// // // // //     };

// // // // //     map[otherId] = {
// // // // //       chatId: otherId,
// // // // //       chatType: chat.chatType || 'private',
// // // // //       name: chat.name || 'مستخدم',
// // // // //       avatar: chat.avatar || '',
// // // // //       description: chat.description || '',
// // // // //       userinfo: {
// // // // //         _id: otherId,
// // // // //         name: chat.name || 'مستخدم',
// // // // //         img: chat.avatar || '/imgs/user.png',
// // // // //         avatar: chat.avatar || '/imgs/user.png',
// // // // //       },
// // // // //       lastMessage: msgObj,
// // // // //       unreadCount: chat.unreadCount || 0,
// // // // //       seen: chat.seen ?? false,
// // // // //       isGroup: chat.chatType === 'group',
// // // // //       isFavorite: chat.isStarred || false,
// // // // //       typing: false,
// // // // //       members: chat.members || [],
// // // // //       isAdmin: chat.isAdmin || false,
// // // // //     };
// // // // //   });

// // // // //   return Object.values(map).sort(
// // // // //     (a, b) =>
// // // // //       new Date(b.lastMessage?.timestamp || 0).getTime() -
// // // // //       new Date(a.lastMessage?.timestamp || 0).getTime()
// // // // //   );
// // // // // }
// // // // function normalizeChats(rawChats: any[], myId: string): ChatItem[] {
// // // //   if (!Array.isArray(rawChats)) return [];

// // // //   const map: Record<string, ChatItem> = {};
  
// // // //   rawChats.forEach((chat) => {
// // // //     const isGroup = chat.chatType === 'group' || chat.isGroup === true;
    
// // // //     // توحيد المعرف الأساسي للمجموعة أو الشات الفردي
// // // //     const realGroupId = chat.groupId || chat.id || chat._id;
// // // //     const chatKey = isGroup 
// // // //       ? realGroupId 
// // // //       : (chat.otherUserId || chat.id || chat.chatId);

// // // //     const lastMsgText = typeof chat.lastMessage === 'string' 
// // // //       ? chat.lastMessage 
// // // //       : chat.lastMessage?.text || chat.lastMessage || '';

// // // //     const msgObj: Message = {
// // // //       _id: chat.id || chatKey,
// // // //       sender: chat.lastMessage?.sender || chatKey,
// // // //       receiver: myId,
// // // //       message: lastMsgText,
// // // //       timestamp: chat.timestamp || new Date().toISOString(),
// // // //       seenBy: chat.seen ?? chat.lastMessage?.seen ?? false,
// // // //       type: chat.lastMessageType || 'text',
// // // //     };

// // // //     map[chatKey] = {
// // // //       chatId: chatKey,
// // // //       groupId: isGroup ? realGroupId : undefined,
// // // //       chatType: chat.chatType || (isGroup ? 'group' : 'private'),
// // // //       name: chat.name || 'مستخدم',
// // // //       avatar: chat.avatar || '',
// // // //       description: chat.description || '',
// // // //       userinfo: {
// // // //         _id: chatKey,
// // // //         name: chat.name || 'مستخدم',
// // // //         img: chat.avatar || '/imgs/user.png',
// // // //         avatar: chat.avatar || '/imgs/user.png',
// // // //       },
// // // //       lastMessage: msgObj,
// // // //       unreadCount: chat.unreadCount || 0,
// // // //       seen: chat.seen ?? false,
// // // //       isGroup: isGroup,
// // // //       isFavorite: chat.isStarred || false,
// // // //       typing: false,
// // // //       members: chat.members || [],
// // // //       isAdmin: chat.isAdmin || false,
// // // //     } as any;
// // // //   });

// // // //   return Object.values(map).sort(
// // // //     (a, b) =>
// // // //       new Date(b.lastMessage?.timestamp || 0).getTime() -
// // // //       new Date(a.lastMessage?.timestamp || 0).getTime()
// // // //   );
// // // // }
// // // // /* ================= FORMAT TIME WITH "SINCE" FORMAT ================= */
// // // // function formatMessageTime(timestamp: string): string {
// // // //   if (!timestamp) return '';
  
// // // //   const date = new Date(timestamp);
// // // //   if (isNaN(date.getTime())) return '';

// // // //   const now = new Date();
// // // //   const diffMs = now.getTime() - date.getTime();
// // // //   const diffSeconds = Math.floor(diffMs / 1000);
// // // //   const diffMinutes = Math.floor(diffSeconds / 60);
// // // //   const diffHours = Math.floor(diffMinutes / 60);
// // // //   const diffDays = Math.floor(diffHours / 24);
// // // //   const diffWeeks = Math.floor(diffDays / 7);
// // // //   const diffMonths = Math.floor(diffDays / 30);
// // // //   const diffYears = Math.floor(diffDays / 365);

// // // //   // أقل من دقيقة
// // // //   if (diffSeconds < 60) {
// // // //     return 'الآن';
// // // //   }
  
// // // //   // دقائق
// // // //   if (diffMinutes < 60) {
// // // //     return `منذ ${diffMinutes} دقيقة`;
// // // //   }
  
// // // //   // ساعات
// // // //   if (diffHours < 24) {
// // // //     return `منذ ${diffHours} ساعة`;
// // // //   }
  
// // // //   // أيام
// // // //   if (diffDays < 7) {
// // // //     if (diffDays === 1) return 'منذ يوم';
// // // //     return `منذ ${diffDays} يوم`;
// // // //   }
  
// // // //   // أسابيع
// // // //   if (diffWeeks < 4) {
// // // //     if (diffWeeks === 1) return 'منذ أسبوع';
// // // //     return `منذ ${diffWeeks} أسبوع`;
// // // //   }
  
// // // //   // أشهر
// // // //   if (diffMonths < 12) {
// // // //     if (diffMonths === 1) return 'منذ شهر';
// // // //     if (diffMonths === 2) return 'منذ شهرين';
// // // //     if (diffMonths >= 3 && diffMonths <= 10) return `منذ ${diffMonths} أشهر`;
// // // //     return `منذ ${diffMonths} شهر`;
// // // //   }
  
// // // //   // سنوات
// // // //   if (diffYears === 1) return 'منذ سنة';
// // // //   if (diffYears === 2) return 'منذ سنتين';
// // // //   if (diffYears >= 3 && diffYears <= 10) return `منذ ${diffYears} سنوات`;
// // // //   return `منذ ${diffYears} سنة`;
// // // // }
// // // // /* ================= COMPONENT ================= */
// // // // export default function ChatList({ userId: propUserId, apiBase, activeChatId: propActiveChatId }: Props) {
// // // //   const [myUserId, setMyUserId] = useState<string>(propUserId || "");
// // // //   const router = useRouter();
// // // //   const [chats, setChats] = useState<ChatItem[]>([]);
// // // //   const [loading, setLoading] = useState(true);
  
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [activeFilter, setActiveFilter] = useState<FilterType>('all');
// // // //   const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
// // // //   const [filterLoading, setFilterLoading] = useState(false);

// // // //   // ================= SELECTION MODE =================
// // // //   const [selectionMode, setSelectionMode] = useState(false);
// // // //   const [selectedChats, setSelectedChats] = useState<string[]>([]);
// // // //   const longPressTimer = useRef<any>(null);

// // // //   // Group Creation Modal States
// // // //   const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
// // // //   const [groupName, setGroupName] = useState("");
// // // //   const [groupDescription, setGroupDescription] = useState("");
// // // //   const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
// // // //   const [groupSearchTerm, setGroupSearchTerm] = useState("");
// // // //   const [isSubmittingGroup, setIsSubmittingGroup] = useState(false);
// // // //   const [isMemberSelectionOpen, setIsMemberSelectionOpen] = useState(false);

// // // //   // ================= ADMIN STATES =================
// // // //   const [tempAdmins, setTempAdmins] = useState<string[]>([]);
// // // //   const [isAdminLoading, setIsAdminLoading] = useState<Record<string, boolean>>({});

// // // //   // Transfer Ownership Modal States
// // // //   const [showTransferModal, setShowTransferModal] = useState(false);
// // // //   const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
// // // //   const [newOwnerId, setNewOwnerId] = useState<string>('');

// // // //   // Dropdown States
// // // //   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
// // // //   const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

// // // //   const typingTimers = useRef<Record<string, any>>({});

// // // //   // ================= Get token from localStorage =================
// // // //   const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
// // // //   const pathname = usePathname();
// // // //   const activeChatId = propActiveChatId || pathname?.split("/").pop();

// // // //   // ================= BLOCK/UNBLOCK USER =================
// // // //   const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

// // // //   // ================= REPORT STATES =================
// // // //   const [showReportModal, setShowReportModal] = useState(false);
// // // //   const [selectedReportChatId, setSelectedReportChatId] = useState<string | null>(null);
// // // //   const [selectedReason, setSelectedReason] = useState<string>("");
// // // //   const [isReporting, setIsReporting] = useState(false);
// // // //   const [showReportSuccess, setShowReportSuccess] = useState(false);
  
// // // //   // أسباب البلاغ
// // // //   const reportReasons = [
// // // //     { id: "inappropriate", label: "محتوى غير لائق" },
// // // //     { id: "misleading", label: "معلومات مضللة" },
// // // //     { id: "spam", label: "رسائل مزعجة (سبام)" },
// // // //     { id: "harmful", label: "محتوى ضار" },
// // // //     { id: "personal_info", label: "معلومات شخصية" },
// // // //   ];

// // // //   // ================= CALLS STATES =================
// // // //   const [callMinutes, setCallMinutes] = useState<{ free: number; total: number }>({ free: 35, total: 75 });
// // // //   const [isCallModalOpen, setIsCallModalOpen] = useState(false);
// // // //   const [selectedCallChatId, setSelectedCallChatId] = useState<string | null>(null);

// // // //   // ================= TOAST CONFIRMATION HELPER =================
// // // //   // const showConfirmToast = (
// // // //   //   message: string,
// // // //   //   onConfirm: () => void,
// // // //   //   onCancel?: () => void
// // // //   // ) => {
// // // //   //   toast(
// // // //   //     (t) => (
// // // //   //       <div className="flex flex-col items-center gap-3 p-2">
// // // //   //         <p className="text-center text-sm font-medium">{message}</p>
// // // //   //         <div className="flex gap-3 w-full">
// // // //   //           <button
// // // //   //             onClick={() => {
// // // //   //               toast.dismiss(t.id);
// // // //   //               onConfirm();
// // // //   //             }}
// // // //   //             className="flex-1 py-2 px-4 bg-[#D72229] text-white rounded-lg hover:bg-[#b01d23] transition-colors text-sm font-semibold"
// // // //   //           >
// // // //   //             تأكيد
// // // //   //           </button>
// // // //   //           <button
// // // //   //             onClick={() => {
// // // //   //               toast.dismiss(t.id);
// // // //   //               if (onCancel) onCancel();
// // // //   //             }}
// // // //   //             className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
// // // //   //           >
// // // //   //             إلغاء
// // // //   //           </button>
// // // //   //         </div>
// // // //   //       </div>
// // // //   //     ),
// // // //   //     {
// // // //   //       duration: 60000,
// // // //   //       position: 'top-center',
// // // //   //       style: {
// // // //   //         background: '#FFFFFF',
// // // //   //         borderRadius: '16px',
// // // //   //         padding: '16px',
// // // //   //         maxWidth: '400px',
// // // //   //         boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
// // // //   //       },
// // // //   //     }
// // // //   //   );
// // // //   // };

// // // //   // ================= TOAST CONFIRMATION HELPER =================
// // // // const showConfirmToast = (
// // // //   message: string,
// // // //   onConfirm: () => void,
// // // //   onCancel?: () => void,
// // // //   confirmText?: string,
// // // //   cancelText?: string
// // // // ) => {
// // // //   toast(
// // // //     (t) => (
// // // //       <div className="flex flex-col items-center gap-4 p-3">
// // // //         <div className="flex items-center gap-3 w-full">
// // // //           <p className="text-right text-sm font-medium text-gray-800 leading-relaxed flex-1">
// // // //             {message}
// // // //           </p>
// // // //         </div>
// // // //         <div className="flex gap-3 w-full mt-1">
// // // //           <button
// // // //             onClick={() => {
// // // //               toast.dismiss(t.id);
// // // //               onConfirm();
// // // //             }}
// // // //             className="flex-1 py-2.5 px-4 bg-[#D72229] text-white rounded-xl hover:bg-[#b01d23] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
// // // //           >
// // // //             {confirmText || 'تأكيد الحذف'}
// // // //           </button>
// // // //           <button
// // // //             onClick={() => {
// // // //               toast.dismiss(t.id);
// // // //               if (onCancel) onCancel();
// // // //             }}
// // // //             className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold"
// // // //           >
// // // //             {cancelText || 'إلغاء'}
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     ),
// // // //     {
// // // //       duration: 60000,
// // // //       position: 'top-center',
// // // //       style: {
// // // //         background: '#FFFFFF',
// // // //         borderRadius: '20px',
// // // //         padding: '20px 24px',
// // // //         maxWidth: '420px',
// // // //         width: '100%',
// // // //         boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
// // // //         border: '1px solid rgba(0,0,0,0.05)',
// // // //       },
// // // //     }
// // // //   );
// // // // };

// // // //   // جلب قائمة المستخدمين المحظورين
// // // //   const fetchBlockedUsers = async () => {
// // // //     if (!token) return;
// // // //     try {
// // // //       const baseUrl = apiBase || 'https://bo-chat.space';
// // // //       const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
// // // //       const response = await fetch(`${cleanBaseUrl}/block`, {
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //       });
      
// // // //       if (!response.ok) return;
      
// // // //       const responseText = await response.text();
// // // //       let data;
// // // //       try {
// // // //         data = JSON.parse(responseText);
// // // //       } catch (e) {
// // // //         return;
// // // //       }
      
// // // //       let blockedIds: string[] = [];
      
// // // //       if (data.success && data.response) {
// // // //         if (Array.isArray(data.response)) {
// // // //           blockedIds = data.response.map((user: any) => user._id || user.id || user);
// // // //         }
// // // //       } else if (Array.isArray(data)) {
// // // //         blockedIds = data.map((user: any) => user._id || user.id || user);
// // // //       } else if (data.blockedUsers && Array.isArray(data.blockedUsers)) {
// // // //         blockedIds = data.blockedUsers.map((user: any) => user._id || user.id || user);
// // // //       } else if (data.users && Array.isArray(data.users)) {
// // // //         blockedIds = data.users.map((user: any) => user._id || user.id || user);
// // // //       } else if (data.data && Array.isArray(data.data)) {
// // // //         blockedIds = data.data.map((user: any) => user._id || user.id || user);
// // // //       }
      
// // // //       setBlockedUsers(blockedIds);
      
// // // //     } catch (error) {
// // // //       console.error('Error fetching blocked users:', error);
// // // //     }
// // // //   };

// // // //   // ================= USE EFFECT FOR BLOCKED USERS =================
// // // //   useEffect(() => {
// // // //     if (token) {
// // // //       fetchBlockedUsers();
// // // //     }
// // // //   }, [token]);

// // // //   // التحقق إذا كان المستخدم محظوراً
// // // //   const isUserBlocked = (chatId: string) => {
// // // //     return blockedUsers.includes(chatId);
// // // //   };

// // // //   // Close dropdown when clicking outside
// // // //   useEffect(() => {
// // // //     const handleClickOutside = (event: MouseEvent) => {
// // // //       if (openDropdown) {
// // // //         const ref = dropdownRefs.current[openDropdown];
// // // //         if (ref && !ref.contains(event.target as Node)) {
// // // //           setOpenDropdown(null);
// // // //         }
// // // //       }
// // // //     };
// // // //     document.addEventListener('mousedown', handleClickOutside);
// // // //     return () => document.removeEventListener('mousedown', handleClickOutside);
// // // //   }, [openDropdown]);

// // // //   // ================= SELECTION MODE HANDLERS =================
// // // //   const toggleChatSelection = (chatId: string) => {
// // // //     setSelectedChats(prev => {
// // // //       if (prev.includes(chatId)) {
// // // //         const newSelected = prev.filter(id => id !== chatId);
// // // //         if (newSelected.length === 0) {
// // // //           setSelectionMode(false);
// // // //         }
// // // //         return newSelected;
// // // //       } else {
// // // //         return [...prev, chatId];
// // // //       }
// // // //     });
// // // //   };

// // // //   const clearSelection = () => {
// // // //     setSelectedChats([]);
// // // //     setSelectionMode(false);
// // // //   };

// // // //   // ================= BULK ACTIONS =================
// // // //   // const handleBulkDelete = async () => {
// // // //   //   if (selectedChats.length === 0) return;
    
// // // //   //   showConfirmToast(
// // // //   //     `هل أنت متأكد من رغبتك في حذف ${selectedChats.length} محادثة؟`,
// // // //   //     async () => {
// // // //   //       for (const chatId of selectedChats) {
// // // //   //         const chat = chats.find(c => c.chatId === chatId);
// // // //   //         if (chat) {
// // // //   //           await handleDeleteChat(chatId, chat.chatType);
// // // //   //         }
// // // //   //       }
// // // //   //       clearSelection();
// // // //   //     }
// // // //   //   );
// // // //   // };

// // // //   // ================= BULK ACTIONS =================
// // // // // const handleBulkDelete = async () => {
// // // // //   if (selectedChats.length === 0) return;
  
// // // // //   const chatCount = selectedChats.length;
// // // // //   const isPlural = chatCount > 1;
  
// // // // //   showConfirmToast(
// // // // //     ` أنت على وشك حذف ${chatCount} محادثة${isPlural ? 'ات' : ''}\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بهذه المحادثات، ولن تتمكن من استعادتها بعد الحذف.`,
// // // // //     async () => {
// // // // //       for (const chatId of selectedChats) {
// // // // //         const chat = chats.find(c => c.chatId === chatId);
// // // // //         if (chat) {
// // // // //           await handleDeleteChat(chatId, chat.chatType);
// // // // //         }
// // // // //       }
// // // // //       clearSelection();
// // // // //     },
// // // // //     () => {
// // // // //       toast('تم إلغاء عملية الحذف الجماعي', {
// // // // //         icon: '↩️',
// // // // //         duration: 2000,
// // // // //       });
// // // // //     },
// // // // //     `نعم، احذف ${chatCount} محادثة${isPlural ? 'ات' : ''}`,
// // // // //     'إلغاء'
// // // // //   );
// // // // // };
// // // // // const handleBulkDelete = async () => {
// // // // //   if (selectedChats.length === 0) return;

// // // // //   const chatCount = selectedChats.length;
// // // // //   const chatLabel = chatCount === 1 ? 'محادثة واحدة' : `${chatCount} محادثات`;

// // // // //   showConfirmToast(
// // // // //     `أنت على وشك حذف ${chatLabel}\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بهذه المحادثات، ولن تتمكن من استعادتها بعد الحذف.`,
// // // // //     async () => {
// // // // //       try {
// // // // //         // قائمة بحاويات الحذف
// // // // //         const deletePromises = selectedChats.map(async (selectedId) => {
// // // // //           const chat: any = chats.find(c => 
// // // // //             c.chatId === selectedId || 
// // // // //             c.groupId === selectedId ||
// // // // //             c.id === selectedId ||
// // // // //             c._id === selectedId
// // // // //           );
          
// // // // //           if (chat) {
// // // // //             const isGroup = chat.chatType === 'group' || chat.isGroup === true;
// // // // //             const targetId = isGroup 
// // // // //               ? (chat.groupId || chat.id || chat.chatId || selectedId) 
// // // // //               : (chat.chatId || selectedId);
// // // // //             const chatType = isGroup ? 'group' : 'direct';
            
// // // // //             return await performDeleteChat(targetId, chatType, false);
// // // // //           } else {
// // // // //             // في حال عدم وجود الكائن بالـ State نعتبره مجموعة ونمرر المعرف المباشر
// // // // //             return await performDeleteChat(selectedId, 'group', false);
// // // // //           }
// // // // //         });

// // // // //         await Promise.all(deletePromises);

// // // // //         // ✅ التصفية الشاملة من الـ State
// // // // //         const filterFn = (c: any) => {
// // // // //           return !selectedChats.some(id => 
// // // // //             id === c.chatId || 
// // // // //             id === c.groupId || 
// // // // //             id === c.id || 
// // // // //             id === c._id
// // // // //           );
// // // // //         };

// // // // //         setChats(prev => prev.filter(filterFn));
// // // // //         setFilteredChats(prev => prev.filter(filterFn));

// // // // //         toast.success(`تم حذف ${chatLabel} بنجاح`);
// // // // //       } catch (error) {
// // // // //         console.error("Error during bulk delete:", error);
// // // // //         toast.error("حدث خطأ أثناء حذف بعض المحادثات");
// // // // //       } finally {
// // // // //         clearSelection();
// // // // //       }
// // // // //     },
// // // // //     () => {
// // // // //       toast('تم إلغاء عملية الحذف الجماعي', { icon: '↩️', duration: 2000 });
// // // // //     },
// // // // //     `نعم، احذف ${chatLabel}`,
// // // // //     'إلغاء'
// // // // //   );
// // // // // };
// // // //   const handleBulkArchive = async () => {
// // // //     if (selectedChats.length === 0) return;
    
// // // //     showConfirmToast(
// // // //       `هل أنت متأكد من رغبتك في أرشفة ${selectedChats.length} محادثة؟`,
// // // //       async () => {
// // // //         for (const chatId of selectedChats) {
// // // //           const chat = chats.find(c => c.chatId === chatId);
// // // //           if (chat) {
// // // //             await handleArchiveChat(chatId, chat.chatType);
// // // //           }
// // // //         }
// // // //         clearSelection();
// // // //       }
// // // //     );
// // // //   };

// // // //   const handleBulkCall = () => {
// // // //     if (selectedChats.length === 0) return;
// // // //     toast.success(` جاري إنشاء مكالمة جماعية مع ${selectedChats.length} محادثة`);
// // // //     clearSelection();
// // // //   };

// // // //   const handleBulkGroupMessage = () => {
// // // //     if (selectedChats.length === 0) return;
// // // //     toast.success(`💬 جاري إنشاء رسالة جماعية مع ${selectedChats.length} محادثة`);
// // // //     clearSelection();
// // // //   };

// // // //   // ================= MOUSE EVENTS FOR LONG PRESS =================
// // // //   const handleMouseDown = (chatId: string, e: React.MouseEvent) => {
// // // //     if (e.button === 0 && !selectionMode) {
// // // //       longPressTimer.current = setTimeout(() => {
// // // //         setSelectionMode(true);
// // // //         setSelectedChats([chatId]);
// // // //       }, 500);
// // // //     }
// // // //   };

// // // //   const handleMouseUp = () => {
// // // //     clearTimeout(longPressTimer.current);
// // // //   };

// // // //   const handleMouseLeave = () => {
// // // //     clearTimeout(longPressTimer.current);
// // // //   };

// // // //   useEffect(() => {
// // // //     return () => {
// // // //       clearTimeout(longPressTimer.current);
// // // //     };
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (propUserId) {
// // // //       setMyUserId(propUserId);
// // // //       return;
// // // //     }
// // // //     const raw = localStorage.getItem("userData");
// // // //     if (!raw) return;

// // // //     try {
// // // //       const parsed = JSON.parse(raw);
// // // //       const userId = parsed._id || parsed.id || "";
// // // //       setMyUserId(userId);
// // // //     } catch (e) {
// // // //       console.error("Invalid userData in localStorage");
// // // //     }
// // // //   }, [propUserId]);

// // // //   const markMessageAsSeen = async (messageId: string) => {
// // // //     if (!token || !messageId) return false;
// // // //     try {
// // // //       const url = `${apiBase}/chats/seenmessage/${messageId}`;
// // // //       const res = await fetch(url, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //       });
// // // //       if (!res.ok) return false;
// // // //       const data = await res.json();
// // // //       return data.success === true;
// // // //     } catch (error) {
// // // //       return false;
// // // //     }
// // // //   };

// // // //   // ================= FETCH GROUP DETAILS =================
// // // //   // const fetchGroupDetails = async (groupId: string) => {
// // // //   //   if (!token) return null;
// // // //   //   try {
// // // //   //     const url = `${apiBase}/chats/groups/GetGroup/${groupId}`;
// // // //   //     const res = await fetch(url, {
// // // //   //       headers: {
// // // //   //         Authorization: `Bearer ${token}`,
// // // //   //         'Content-Type': 'application/json',
// // // //   //       },
// // // //   //     });
// // // //   //     if (!res.ok) return null;
// // // //   //     const data = await res.json();
      
// // // //   //     const groupData = data.response || data || {};
// // // //   //     return {
// // // //   //       ...groupData,
// // // //   //       admins: groupData.admins || groupData.administrators || [],
// // // //   //       owner: groupData.owner || groupData.createdBy || groupData.ownerId,
// // // //   //     };
// // // //   //   } catch (error) {
// // // //   //     console.error('Error fetching group details:', error);
// // // //   //     return null;
// // // //   //   }
// // // //   // };

// // // //   const fetchGroupDetails = async (groupId: string) => {
// // // //   if (!token) return null;
// // // //   try {
// // // //     const url = `${apiBase}/chats/groups/GetGroup/${groupId}`;
// // // //     const res = await fetch(url, {
// // // //       headers: {
// // // //         Authorization: `Bearer ${token}`,
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });
// // // //     if (!res.ok) return null;
// // // //     const data = await res.json();
    
// // // //     const groupData = data.response || data || {};

// // // //     // ✅ تحويل members للشكل الموحد مع الصور الفعلية
// // // //     const formattedMembers = (groupData.members || []).map((m: any) => ({
// // // //       _id: m.userId || m._id,
// // // //       userId: m.userId || m._id,
// // // //       name: m.name || 'مستخدم',
// // // //       img: m.image || m.img || m.avatar || '/imgs/user.png',      // ✅ دعم كل الاحتمالات
// // // //       avatar: m.image || m.img || m.avatar || '/imgs/user.png',
// // // //       image: m.image || m.img || m.avatar || '/imgs/user.png',
// // // //       username: m.username || m.name || '',
// // // //       role: m.role,
// // // //       isAdmin: m.role === 'admin' || m.role === 'owner',
// // // //       isOwner: m.role === 'owner',
// // // //       joinedAt: m.joinedAt,
// // // //     }));

// // // //     return {
// // // //       ...groupData,
// // // //       members: formattedMembers,                                  // ✅ الأعضاء بالصور الفعلية
// // // //       admins: groupData.admins || groupData.administrators || [],
// // // //       owner: groupData.owner || groupData.createdBy || groupData.ownerId,
// // // //     };
// // // //   } catch (error) {
// // // //     console.error('Error fetching group details:', error);
// // // //     return null;
// // // //   }
// // // // };
// // // //   const fetchChats = async (category: FilterType = 'all') => {
// // // //   if (!myUserId || !token) return null;
// // // //   try {
// // // //     const url = `${apiBase}/chats/chats/${myUserId}?category=${category}`;
// // // //     const res = await fetch(url, {
// // // //       headers: {
// // // //         Authorization: `Bearer ${token}`,
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });
// // // //     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
// // // //     const data = await res.json();
// // // //     const rawList = data.response || data.userchats || [];

// // // //     // ✅ ADD THIS LOG - عشان نشوف الـ raw data
// // // //     console.log('📥 RAW CHATS FROM API:', rawList.map((c: any) => ({
// // // //       id: c.id,
// // // //       _id: c._id,
// // // //       groupId: c.groupId,
// // // //       otherUserId: c.otherUserId,
// // // //       chatType: c.chatType,
// // // //       name: c.name,
// // // //       isGroup: c.chatType === 'group',
// // // //     })));

// // // //     const enrichedList = await Promise.all(
// // // //       rawList.map(async (chat: any) => {
// // // //         if (chat.chatType === 'group' && chat.id) {
// // // //           const groupDetails = await fetchGroupDetails(chat.id);
// // // //           if (groupDetails) {
// // // //             return {
// // // //               ...chat,
// // // //               description: groupDetails.description || '',
// // // //               name: groupDetails.name || chat.name,
// // // //               members: groupDetails.members || [],
// // // //               admins: groupDetails.admins || [],
// // // //               owner: groupDetails.owner || groupDetails.createdBy,
// // // //             };
// // // //           }
// // // //         }
// // // //         return chat;
// // // //       })
// // // //     );

// // // //     // ✅ ADD THIS LOG - عشان نشوف بعد الـ enrichment
// // // //     console.log('📥 ENRICHED CHATS:', enrichedList.map((c: any) => ({
// // // //       id: c.id,
// // // //       groupId: c.groupId,
// // // //       otherUserId: c.otherUserId,
// // // //       chatType: c.chatType,
// // // //       name: c.name,
// // // //       isGroup: c.chatType === 'group',
// // // //     })));

// // // //     const normalizedChats = normalizeChats(enrichedList, myUserId);

// // // //     // ✅ ADD THIS LOG - عشان نشوف بعد الـ normalize
// // // //     console.log('📥 NORMALIZED CHATS:', normalizedChats.map((c: any) => ({
// // // //       chatId: c.chatId,
// // // //       groupId: c.groupId,
// // // //       chatType: c.chatType,
// // // //       name: c.name,
// // // //       isGroup: c.isGroup,
// // // //     })));

// // // //     return normalizedChats;
// // // //   } catch (error) {
// // // //     console.error('Error fetching chats:', error);
// // // //     return null;
// // // //   }
// // // // };

// // // //   useEffect(() => {
// // // //     async function load() {
// // // //       if (!myUserId || !token) return;
// // // //       setLoading(true);
// // // //       const normalized = await fetchChats('all');
// // // //       if (normalized) {
// // // //         setChats(normalized);
// // // //         setFilteredChats(normalized);
// // // //       }
// // // //       setLoading(false);
// // // //     }
// // // //     load();
// // // //   }, [myUserId, token, apiBase]);

// // // //   useEffect(() => {
// // // //     if (!myUserId) return;
// // // //     wsService.connect(myUserId);
// // // //     const unsub = wsService.addHandler((payload: any) => {
// // // //       handleWsEvent(payload);
// // // //     });
// // // //     return () => {
// // // //       unsub();
// // // //     };
// // // //   }, [myUserId]);

// // // //   function handleWsEvent(payload: any) {
// // // //     if (!payload) return;
// // // //     if (payload.event === "message" && payload.metadata) {
// // // //       onWsMessage(payload.metadata);
// // // //       return;
// // // //     }
// // // //     if (payload.event === "typing" && payload.metadata) {
// // // //       onTyping(payload.metadata);
// // // //       return;
// // // //     }
// // // //     if (payload.event === "seen" && payload.metadata) {
// // // //       onSeen(payload.metadata);
// // // //       return;
// // // //     }
// // // //     if (payload._id && payload.sender && payload.receiver && payload.message) {
// // // //       onWsMessage(payload);
// // // //       return;
// // // //     }
// // // //   }

// // // //   function onWsMessage(msg: Message) {
// // // //     setChats((prev) => {
// // // //       const isMe = msg.sender === myUserId;
// // // //       const otherId = isMe ? msg.receiver : msg.sender;
// // // //       const list = [...prev];
// // // //       const idx = list.findIndex((c) => c.chatId === otherId);
// // // //       if (idx === -1) return prev;

// // // //       const chat = { ...list[idx] };
// // // //       chat.lastMessage = {
// // // //         ...msg,
// // // //         seenBy: isMe ? (chat.lastMessage?.seenBy || false) : false,
// // // //       };
// // // //       chat.typing = false;
// // // //       if (!isMe) chat.unreadCount += 1;

// // // //       list.splice(idx, 1);
// // // //       return [chat, ...list];
// // // //     });
// // // //   }

// // // //   function onTyping(payload: any) {
// // // //     const sender = payload.sender;
// // // //     const to = payload.receiver;
// // // //     if (!sender || to !== myUserId) return;

// // // //     setChats((prev) =>
// // // //       prev.map((c) => (c.chatId === sender ? { ...c, typing: true } : c))
// // // //     );

// // // //     clearTimeout(typingTimers.current[sender]);
// // // //     typingTimers.current[sender] = setTimeout(() => {
// // // //       setChats((prev) =>
// // // //         prev.map((c) => (c.chatId === sender ? { ...c, typing: false } : c))
// // // //       );
// // // //     }, 1500);
// // // //   }

// // // //   function onSeen({ sender }: any) {
// // // //     markChatSeen(sender);
// // // //     setChats(prev =>
// // // //       prev.map(c => {
// // // //         if (c.chatId !== sender) return c;
// // // //         return {
// // // //           ...c,
// // // //           seen: true,
// // // //           unreadCount: 0,
// // // //           lastMessage: c.lastMessage ? {
// // // //             ...c.lastMessage,
// // // //             seenBy: true,
// // // //           } : c.lastMessage,
// // // //         };
// // // //       })
// // // //     );
// // // //   }

// // // //   const handleFilterChange = async (filter: FilterType) => {
// // // //     setActiveFilter(filter);
// // // //     setFilterLoading(true);
// // // //     try {
// // // //       const normalized = await fetchChats(filter);
// // // //       if (normalized) {
// // // //         setFilteredChats(normalized);
// // // //       } else {
// // // //         setFilteredChats(filterChatsClientSide(chats, filter));
// // // //       }
// // // //     } catch (error) {
// // // //       setFilteredChats(filterChatsClientSide(chats, filter));
// // // //     } finally {
// // // //       setFilterLoading(false);
// // // //     }
// // // //   };

// // // //   const filterChatsClientSide = (chatsList: ChatItem[], filter: FilterType): ChatItem[] => {
// // // //     switch(filter) {
// // // //       case 'all': return chatsList;
// // // //       case 'read': return chatsList.filter(c => c.seen === true || c.lastMessage?.seenBy === true);
// // // //       case 'unread': return chatsList.filter(c => c.unreadCount > 0);
// // // //       case 'starred': return chatsList.filter(c => c.isFavorite === true);
// // // //       case 'groups': return chatsList.filter(c => c.isGroup === true);
// // // //       case 'calls': return chatsList.filter(c => c.chatType === 'call');
// // // //       default: return chatsList;
// // // //     }
// // // //   };

   
// // // //   useEffect(() => {
// // // //   if (activeFilter === 'all') {
// // // //     setFilteredChats(chats);
// // // //   } else {
// // // //     setFilteredChats(filterChatsClientSide(chats, activeFilter));
// // // //   }
// // // // }, [chats, activeFilter]);

// // // //   const searchedChats = filteredChats.filter((chat) => {
// // // //     const userName = chat.userinfo?.name || '';
// // // //     return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
// // // //   });

// // // //   const getSectionTitle = () => {
// // // //     if (selectionMode) {
// // // //       return '';
// // // //     }
// // // //     switch(activeFilter) {
// // // //       case 'all': return 'قسم الرسائل العام';
// // // //       case 'read': return 'قسم الرسائل المقروء';
// // // //       case 'unread': return 'قسم الرسائل غير المقروء';
// // // //       case 'starred': return 'قسم الرسائل المميزة';
// // // //       case 'groups': return 'قسم المجموعات';
// // // //       case 'calls': return 'قسم المكالمات';
// // // //       default: return 'قسم الرسائل العام';
// // // //     }
// // // //   };

// // // //   const getFilterCounts = useMemo(() => {
// // // //     return {
// // // //       all: chats.length,
// // // //       read: chats.filter(c => c.seen === true || c.lastMessage?.seenBy === true).length,
// // // //       unread: chats.filter(c => c.unreadCount > 0).length,
// // // //       starred: chats.filter(c => c.isFavorite === true).length,
// // // //       groups: chats.filter(c => c.isGroup === true).length,
// // // //       calls: chats.filter(c => c.chatType === 'call').length,
// // // //     };
// // // //   }, [chats]);

// // // //   // ================= TOGGLE ADMIN STATUS =================
// // // //   const toggleAdminStatus = async (chatId: string, e: React.MouseEvent) => {
// // // //     e.stopPropagation();
    
// // // //     const groupId = selectedGroupId || 'temp_group_id';
    
// // // //     if (groupId === 'temp_group_id') {
// // // //       setTempAdmins(prev => 
// // // //         prev.includes(chatId) 
// // // //           ? prev.filter(id => id !== chatId)
// // // //           : [...prev, chatId]
// // // //       );
// // // //       return;
// // // //     }

// // // //     if (!token) {
// // // //       toast.error('يرجى تسجيل الدخول أولاً');
// // // //       return;
// // // //     }

// // // //     const isCurrentlyAdmin = tempAdmins.includes(chatId);
// // // //     setIsAdminLoading(prev => ({ ...prev, [chatId]: true }));

// // // //     try {
// // // //       const url = isCurrentlyAdmin
// // // //         ? `${apiBase}/chats/groups/DemoteAdmin/${groupId}`
// // // //         : `${apiBase}/chats/groups/PromoteAdmin/${groupId}`;
      
// // // //       const response = await fetch(url, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //         body: JSON.stringify({ memberid: chatId })
// // // //       });

// // // //       const data = await response.json();
      
// // // //       if (data.success) {
// // // //         setTempAdmins(prev => 
// // // //           isCurrentlyAdmin 
// // // //             ? prev.filter(id => id !== chatId)
// // // //             : [...prev, chatId]
// // // //         );
        
// // // //         toast.success(isCurrentlyAdmin ? ' تم إلغاء صلاحية المشرف' : ' تم تعيين المشرف بنجاح');
// // // //       } else {
// // // //         toast.error(`فشل: ${data.response || data.message || 'خطأ غير معروف'}`);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error toggling admin:', error);
// // // //       toast.error('حدث خطأ أثناء محاولة تغيير الصلاحية');
// // // //     } finally {
// // // //       setIsAdminLoading(prev => ({ ...prev, [chatId]: false }));
// // // //     }
// // // //   };

// // // //   // ================= CREATE GROUP SUBMIT =================
// // // //   // const handleCreateGroupSubmit = async () => {
// // // //   //   if (!groupName.trim() || !token) {
// // // //   //     toast.error('يرجى إدخال اسم المجموعة');
// // // //   //     return;
// // // //   //   }
    
// // // //   //   setIsSubmittingGroup(true);

// // // //   //   try {
// // // //   //     const createRes = await fetch(`${apiBase}/chats/groups/CreateGroup`, {
// // // //   //       method: 'POST',
// // // //   //       headers: {
// // // //   //         Authorization: `Bearer ${token}`,
// // // //   //         'Content-Type': 'application/json',
// // // //   //       },
// // // //   //       body: JSON.stringify({
// // // //   //         name: groupName,
// // // //   //         description: groupDescription || "no"
// // // //   //       })
// // // //   //     });

// // // //   //     const createData = await createRes.json();
// // // //   //     if (!createData.success || !createData.response?.groupId) {
// // // //   //       throw new Error(createData.response || "Failed to create group");
// // // //   //     }

// // // //   //     const groupId = createData.response.groupId;
// // // //   //     const members = [myUserId, ...selectedMembers];
      
// // // //   //     const addMembersRes = await fetch(`${apiBase}/chats/groups/AddMembers/${groupId}`, {
// // // //   //       method: 'POST',
// // // //   //       headers: {
// // // //   //         Authorization: `Bearer ${token}`,
// // // //   //         'Content-Type': 'application/json',
// // // //   //       },
// // // //   //       body: JSON.stringify({ members })
// // // //   //     });

// // // //   //     const addMembersData = await addMembersRes.json();
// // // //   //     if (!addMembersData.success) {
// // // //   //       throw new Error(addMembersData.response || "Failed to add members");
// // // //   //     }

// // // //   //     for (const adminId of tempAdmins) {
// // // //   //       try {
// // // //   //         await fetch(`${apiBase}/chats/groups/PromoteAdmin/${groupId}`, {
// // // //   //           method: 'POST',
// // // //   //           headers: {
// // // //   //             Authorization: `Bearer ${token}`,
// // // //   //             'Content-Type': 'application/json',
// // // //   //           },
// // // //   //           body: JSON.stringify({ memberid: adminId })
// // // //   //         });
// // // //   //       } catch (error) {
// // // //   //         console.error(`Failed to promote admin ${adminId}:`, error);
// // // //   //       }
// // // //   //     }

// // // //   //     setIsCreateGroupOpen(false);
// // // //   //     setIsMemberSelectionOpen(false);
// // // //   //     setGroupName("");
// // // //   //     setGroupDescription("");
// // // //   //     setSelectedMembers([]);
// // // //   //     setTempAdmins([]);
// // // //   //     setGroupSearchTerm("");
      
// // // //   //     const normalized = await fetchChats('all');
// // // //   //     if (normalized) {
// // // //   //       setChats(normalized);
// // // //   //       setFilteredChats(normalized);
// // // //   //     }
      
// // // //   //     toast.success(' تم إنشاء المجموعة بنجاح');
// // // //   //     router.push(`/chats/${groupId}`);
      
// // // //   //   } catch (error: any) {
// // // //   //     console.error("Error creating group:", error);
// // // //   //     toast.error(` فشل إنشاء المجموعة: ${error.message || 'خطأ غير معروف'}`);
// // // //   //   } finally {
// // // //   //     setIsSubmittingGroup(false);
// // // //   //   }
// // // //   // };

// // // //   const handleCreateGroupSubmit = async () => {
// // // //   if (!groupName.trim() || !token) {
// // // //     toast.error('يرجى إدخال اسم المجموعة');
// // // //     return;
// // // //   }
  
// // // //   setIsSubmittingGroup(true);

// // // //   try {
// // // //     const formData = new FormData();
// // // //     formData.append('name', groupName.trim());
// // // //     formData.append('description', groupDescription.trim() || '');

// // // //     // استبعاد صاحب المجموعة من قائمة الأعضاء لتجنب التكرار
// // // //     const membersOnly = selectedMembers.filter((id) => id !== myUserId);

// // // //     membersOnly.forEach((memberId) => {
// // // //       formData.append('members', memberId);
// // // //     });

// // // //     const createRes = await fetch(`${apiBase}/chats/groups/CreateGroup`, {
// // // //       method: 'POST',
// // // //       headers: {
// // // //         Authorization: `Bearer ${token}`,
// // // //       },
// // // //       body: formData,
// // // //     });

// // // //     const createData = await createRes.json();
// // // //     if (!createData.success || !createData.response?.groupId) {
// // // //       throw new Error(createData.response || "Failed to create group");
// // // //     }

// // // //     const groupId = createData.response.groupId;

// // // //     // ترقية المشرفين بشكل متوازي
// // // //     if (tempAdmins.length > 0) {
// // // //       await Promise.all(
// // // //         tempAdmins.map((adminId) =>
// // // //           fetch(`${apiBase}/chats/groups/PromoteAdmin/${groupId}`, {
// // // //             method: 'POST',
// // // //             headers: {
// // // //               Authorization: `Bearer ${token}`,
// // // //               'Content-Type': 'application/json',
// // // //             },
// // // //             body: JSON.stringify({ memberid: adminId }),
// // // //           }).catch((err) => console.error(`Failed to promote admin ${adminId}:`, err))
// // // //         )
// // // //       );
// // // //     }

// // // //     // إعادة إعادة ضبط الحالة (State)
// // // //     setIsCreateGroupOpen(false);
// // // //     setIsMemberSelectionOpen(false);
// // // //     setGroupName("");
// // // //     setGroupDescription("");
// // // //     setSelectedMembers([]);
// // // //     setTempAdmins([]);
// // // //     setGroupSearchTerm("");
    
// // // //     const normalized = await fetchChats('all');
// // // //     if (normalized) {
// // // //       setChats(normalized);
// // // //       setFilteredChats(normalized);
// // // //     }
    
// // // //     toast.success('تم إنشاء المجموعة بنجاح');
// // // //     router.push(`/chats/${groupId}`);
    
// // // //   } catch (error: any) {
// // // //     console.error("Error creating group:", error);
// // // //     toast.error(`فشل إنشاء المجموعة: ${error.message || 'خطأ غير معروف'}`);
// // // //   } finally {
// // // //     setIsSubmittingGroup(false);
// // // //   }
// // // // };

// // // //   const toggleMemberSelection = (chatId: string) => {
// // // //     setSelectedMembers(prev => 
// // // //       prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
// // // //     );
// // // //   };

// // // //   // ================= GROUP AVATAR RENDERER =================
// // // //   // const renderGroupAvatar = (chat: ChatItem) => {
// // // //   //   let members = chat.members || [];
    
// // // //   //   if (members.length === 0) {
// // // //   //     const otherMember = {
// // // //   //       _id: chat.chatId,
// // // //   //       name: chat.name,
// // // //   //       img: chat.userinfo?.img || chat.avatar || '/imgs/user.png',
// // // //   //       avatar: chat.userinfo?.avatar || chat.avatar || '/imgs/user.png',
// // // //   //     };
      
// // // //   //     let currentUserImg = '/imgs/user.png';
// // // //   //     try {
// // // //   //       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
// // // //   //       currentUserImg = userData.img || userData.avatar || '/imgs/user.png';
// // // //   //     } catch (e) {
// // // //   //       currentUserImg = '/imgs/user.png';
// // // //   //     }
      
// // // //   //     const currentUser = {
// // // //   //       _id: myUserId,
// // // //   //       name: 'أنت',
// // // //   //       img: currentUserImg,
// // // //   //       avatar: currentUserImg,
// // // //   //     };
// // // //   //     members = [currentUser, otherMember];
// // // //   //   }
    
// // // //   //   const memberCount = members.length;
    
// // // //   //   const getMemberImage = (index: number) => {
// // // //   //     const member = members[index];
// // // //   //     return member?.img || member?.avatar || '/imgs/user.png';
// // // //   //   };

// // // //   //   const GroupIcon = () => (
// // // //   //     <div 
// // // //   //       style={{
// // // //   //         position: 'absolute',
// // // //   //         width: '19px',
// // // //   //         height: '19px',
// // // //   //         top: '50%',
// // // //   //         left: '50%',
// // // //   //         transform: 'translate(-50%, -50%)',
// // // //   //         borderRadius: '8px',
// // // //   //         background: '#FFFFFF',
// // // //   //         display: 'flex',
// // // //   //         alignItems: 'center',
// // // //   //         justifyContent: 'center',
// // // //   //         zIndex: 10,
// // // //   //         pointerEvents: 'none',
// // // //   //         boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
// // // //   //       }}
// // // //   //     >
// // // //   //       <img 
// // // //   //         src="/imgs/Group.svg" 
// // // //   //         alt="Group" 
// // // //   //         style={{
// // // //   //           width: '10.909222602844238px',
// // // //   //           height: '10.909222602844238px',
// // // //   //         }}
// // // //   //       />
// // // //   //     </div>
// // // //   //   );

// // // //   //   if (memberCount < 2) {
// // // //   //     return (
// // // //   //       <div 
// // // //   //         className="relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0  flex items-center justify-center"
// // // //   //       >
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg"
// // // //   //           alt="Member" 
// // // //   //           className="w-full h-full object-cover rounded-[15px] p-1" 
// // // //   //         />
// // // //   //         <GroupIcon />
// // // //   //       </div>
// // // //   //     );
// // // //   //   }

// // // //   //   if (memberCount === 2) {
// // // //   //     return (
// // // //   //       <div
// // // //   //         className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0"
// // // //   //       >
// // // //   //         <img
// // // //   //           src="imgs/person1.svg"
// // // //   //           alt="Member 1"
// // // //   //           className="absolute object-cover"
// // // //   //           style={{
// // // //   //             width: '34.0913200378418',
// // // //   //             height: '34.0913200378418',
// // // //   //             top: '9px',
// // // //   //             left: '25px',
// // // //   //             objectFit: 'cover',
// // // //   //             borderRadius: '15px',
// // // //   //             zIndex: 1,
// // // //   //           }}
// // // //   //         />
// // // //   //         <img
// // // //   //           src="imgs/person2.svg"
// // // //   //           alt="Member 2"
// // // //   //           className="absolute object-cover"
// // // //   //           style={{
// // // //   //             width: '34.0913200378418',
// // // //   //             height: '34.0913200378418',
// // // //   //             top: '9px',
// // // //   //             left: '1px',
// // // //   //             objectFit: 'cover',
// // // //   //             borderRadius: '15px',
// // // //   //             zIndex: 2,
// // // //   //           }}
// // // //   //         />
// // // //   //         <GroupIcon />
// // // //   //       </div>
// // // //   //     );
// // // //   //   }

// // // //   //   if (memberCount === 3) { 
// // // //   //     return ( 
// // // //   //       <div 
// // // //   //         className="relative w-[60px] h-[60px]  overflow-hidden flex-shrink-0 " 
// // // //   //       > 
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg" 
// // // //   //           alt="Member 1" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ 
// // // //   //             width: '34px', 
// // // //   //             height: '34px', 
// // // //   //             top: '4px', 
// // // //   //             right: '6px', 
// // // //   //             zIndex: 1, 
// // // //   //           }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person2.svg" 
// // // //   //           alt="Member 2" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ 
// // // //   //             width: '34px', 
// // // //   //             height: '34px', 
// // // //   //             top: '4px', 
// // // //   //             left: '-2px', 
// // // //   //             zIndex: 1, 
// // // //   //           }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person2.svg" 
// // // //   //           alt="Member 3" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ 
// // // //   //             width: '34px', 
// // // //   //             height: '34px', 
// // // //   //             bottom: '4px', 
// // // //   //             left: '50%', 
// // // //   //             transform: 'translateX(-50%)', 
// // // //   //             zIndex: 2, 
// // // //   //           }} 
// // // //   //         /> 
// // // //   //         <GroupIcon /> 
// // // //   //       </div> 
// // // //   //     ); 
// // // //   //   }

// // // //   //   if (memberCount === 4) {
// // // //   //     return (
// // // //   //       <div 
// // // //   //         className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0 "
// // // //   //       >
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg" 
// // // //   //           alt="Member 1" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person2.svg"  
// // // //   //           alt="Member 2" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person2.svg" 
// // // //   //           alt="Member 3" 
// // // //   //           className="absolute object-cover  rounded-[15px]" 
// // // //   //           style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg" 
// // // //   //           alt="Member 4" 
// // // //   //           className="absolute object-cover rounded-[15px] " 
// // // //   //           style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }} 
// // // //   //         /> 
// // // //   //         <GroupIcon /> 
// // // //   //       </div>
// // // //   //     );
// // // //   //   }

// // // //   //   if (memberCount >= 5) {
// // // //   //     const extraCount = memberCount - 3; 
// // // //   //     return (
// // // //   //       <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg" 
// // // //   //           alt="Member 1" 
// // // //   //           className="absolute object-cover rounded-[15px]" 
// // // //   //           style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
// // // //   //         /> 
// // // //   //         <img 
// // // //   //           src="imgs/person2.svg" 
// // // //   //           alt="Member 2" 
// // // //   //           className="absolute object-cover rounded-[15px]" 
// // // //   //           style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
// // // //   //         /> 
// // // //   //         <div 
// // // //   //           className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold text-[12px] rounded-[15px] shadow-sm"
// // // //   //           style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
// // // //   //         >
// // // //   //           {extraCount}
// // // //   //         </div>
// // // //   //         <img 
// // // //   //           src="imgs/person1.svg" 
// // // //   //           alt="Member 3" 
// // // //   //           className="absolute object-cover rounded-[15px]" 
// // // //   //           style={{ 
// // // //   //             width: '34.09px', 
// // // //   //             height: '34.09px', 
// // // //   //             bottom: '2px', 
// // // //   //             right: '2px', 
// // // //   //             zIndex: 1,
// // // //   //           }} 
// // // //   //         />
// // // //   //         <GroupIcon /> 
// // // //   //       </div>
// // // //   //     );
// // // //   //   }

// // // //   //   return (
// // // //   //     <div 
// // // //   //       className="relative w-[60px] h-[60px] rounded-[25px] border border-white overflow-hidden flex-shrink-0"
// // // //   //     >
// // // //   //       <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
// // // //   //         {members.slice(0, 3).map((member: any, index: number) => {
// // // //   //           let colSpan = index === 2 ? 'col-span-2' : 'col-span-1';
// // // //   //           return (
// // // //   //             <img
// // // //   //               key={index}
// // // //   //               src={getMemberImage(index)}
// // // //   //               alt="Member"
// // // //   //               className={`w-full h-full object-cover ${colSpan} row-span-1`}
// // // //   //             />
// // // //   //           );
// // // //   //         })}
// // // //   //         {members.length > 3 && (
// // // //   //           <div 
// // // //   //             className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center bg-black/70 text-white text-[10px] font-bold rounded-br-[25px] z-20"
// // // //   //           >
// // // //   //             +{members.length - 3}
// // // //   //           </div>
// // // //   //         )}
// // // //   //       </div>
// // // //   //       <GroupIcon />
// // // //   //     </div>
// // // //   //   );
// // // //   // };

// // // //   // ================= GROUP AVATAR RENDERER =================
// // // // const renderGroupAvatar = (chat: ChatItem) => {
// // // //   let members = chat.members || [];
  
// // // //   if (members.length === 0) {
// // // //     const otherMember = {
// // // //       _id: chat.chatId,
// // // //       name: chat.name,
// // // //       img: chat.userinfo?.img || chat.avatar || '/imgs/user.png',
// // // //       avatar: chat.userinfo?.avatar || chat.avatar || '/imgs/user.png',
// // // //     };
    
// // // //     let currentUserImg = '/imgs/user.png';
// // // //     try {
// // // //       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
// // // //       currentUserImg = userData.img || userData.avatar || '/imgs/user.png';
// // // //     } catch (e) {
// // // //       currentUserImg = '/imgs/user.png';
// // // //     }
    
// // // //     const currentUser = {
// // // //       _id: myUserId,
// // // //       name: 'أنت',
// // // //       img: currentUserImg,
// // // //       avatar: currentUserImg,
// // // //     };
// // // //     members = [currentUser, otherMember];
// // // //   }
  
// // // //   const memberCount = members.length;
  
// // // //   // ✅ دالة جلب صورة العضو الفعلية من الـ API
// // // //   const getMemberImage = (index: number) => {
// // // //     const member = members[index];
// // // //     return member?.img || member?.avatar || member?.image || '/imgs/user.png';
// // // //   };

// // // //   const GroupIcon = () => (
// // // //     <div 
// // // //       style={{
// // // //         position: 'absolute',
// // // //         width: '19px',
// // // //         height: '19px',
// // // //         top: '50%',
// // // //         left: '50%',
// // // //         transform: 'translate(-50%, -50%)',
// // // //         borderRadius: '8px',
// // // //         background: '#FFFFFF',
// // // //         display: 'flex',
// // // //         alignItems: 'center',
// // // //         justifyContent: 'center',
// // // //         zIndex: 10,
// // // //         pointerEvents: 'none',
// // // //         boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
// // // //       }}
// // // //     >
// // // //       <img 
// // // //         src="/imgs/Group.svg" 
// // // //         alt="Group" 
// // // //         style={{
// // // //           width: '10.909222602844238px',
// // // //           height: '10.909222602844238px',
// // // //         }}
// // // //       />
// // // //     </div>
// // // //   );

// // // //  if (memberCount < 2) {
// // // //   return (
// // // //     <div className="relative w-[60px] h-[60px] rounded-[15px] overflow-hidden flex-shrink-0 flex items-center justify-center">
// // // //       <img 
// // // //         src={getMemberImage(0)} 
// // // //         alt="Member" 
// // // //         className="w-full h-full object-cover rounded-[25px] p-1" 
// // // //       />
// // // //       <GroupIcon />
// // // //     </div>
// // // //   );
// // // // }
// // // //     if (memberCount === 2) {
// // // //   return (
// // // //     <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
// // // //       <img
// // // //         src={getMemberImage(1)}   
// // // //         alt="Member 1"
// // // //         className="absolute object-cover"
// // // //         style={{
// // // //           width: '34.0913200378418px',
// // // //           height: '34.0913200378418px',
// // // //           top: '9px',
// // // //           left: '25px',
// // // //           objectFit: 'cover',
// // // //           borderRadius: '15px',
// // // //           zIndex: 1,
// // // //         }}
// // // //       />
// // // //       <img
// // // //         src={getMemberImage(0)} // الصورة الفعلية للعضو الأول
// // // //         alt="Member 2"
// // // //         className="absolute object-cover"
// // // //         style={{
// // // //           width: '34.0913200378418px',
// // // //           height: '34.0913200378418px',
// // // //           top: '9px',
// // // //           left: '1px',
// // // //           objectFit: 'cover',
// // // //           borderRadius: '15px',
// // // //           zIndex: 2,
// // // //         }}
// // // //       />
// // // //       <GroupIcon />
// // // //     </div>
// // // //   );
// // // // }

// // // //   if (memberCount === 3) { 
// // // //     return ( 
// // // //       <div 
// // // //         className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0" 
// // // //       > 
// // // //         <img 
// // // //           src={getMemberImage(1)}  // ✅ الصورة الفعلية
// // // //           alt="Member 1" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ 
// // // //             width: '34px', 
// // // //             height: '34px', 
// // // //             top: '4px', 
// // // //             right: '6px', 
// // // //             zIndex: 1, 
// // // //           }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(2)}  // ✅ الصورة الفعلية
// // // //           alt="Member 2" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ 
// // // //             width: '34px', 
// // // //             height: '34px', 
// // // //             top: '4px', 
// // // //             left: '-2px', 
// // // //             zIndex: 1, 
// // // //           }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(0)}  // ✅ الصورة الفعلية
// // // //           alt="Member 3" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ 
// // // //             width: '34px', 
// // // //             height: '34px', 
// // // //             bottom: '4px', 
// // // //             left: '50%', 
// // // //             transform: 'translateX(-50%)', 
// // // //             zIndex: 2, 
// // // //           }} 
// // // //         /> 
// // // //         <GroupIcon /> 
// // // //       </div> 
// // // //     ); 
// // // //   }

// // // //   if (memberCount === 4) {
// // // //     return (
// // // //       <div 
// // // //         className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0"
// // // //       >
// // // //         <img 
// // // //           src={getMemberImage(0)}  // ✅ الصورة الفعلية
// // // //           alt="Member 1" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(1)}  // ✅ الصورة الفعلية
// // // //           alt="Member 2" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(2)}  // ✅ الصورة الفعلية
// // // //           alt="Member 3" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(3)}  // ✅ الصورة الفعلية
// // // //           alt="Member 4" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', bottom: '2px', right: '2px', zIndex: 1 }} 
// // // //         /> 
// // // //         <GroupIcon /> 
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (memberCount >= 5) {
// // // //     const extraCount = memberCount - 3; 
// // // //     return (
// // // //       <div className="relative w-[60px] h-[60px] overflow-hidden flex-shrink-0">
// // // //         <img 
// // // //           src={getMemberImage(0)}  // ✅ الصورة الفعلية
// // // //           alt="Member 1" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', top: '2px', left: '2px', zIndex: 3 }} 
// // // //         /> 
// // // //         <img 
// // // //           src={getMemberImage(1)}  // ✅ الصورة الفعلية
// // // //           alt="Member 2" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ width: '34px', height: '34px', top: '2px', right: '2px', zIndex: 2 }} 
// // // //         /> 
// // // //         <div 
// // // //           className="absolute flex items-center justify-center bg-[#DADADA] text-[#000000] font-bold text-[12px] rounded-[15px] shadow-sm"
// // // //           style={{ width: '34px', height: '34px', bottom: '2px', left: '2px', zIndex: 4 }}
// // // //         >
// // // //           {extraCount}
// // // //         </div>
// // // //         <img 
// // // //           src={getMemberImage(2)}  // ✅ الصورة الفعلية
// // // //           alt="Member 3" 
// // // //           className="absolute object-cover rounded-[15px]" 
// // // //           style={{ 
// // // //             width: '34.09px', 
// // // //             height: '34.09px', 
// // // //             bottom: '2px', 
// // // //             right: '2px', 
// // // //             zIndex: 1,
// // // //           }} 
// // // //         />
// // // //         <GroupIcon /> 
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div 
// // // //       className="relative w-[60px] h-[60px] rounded-[25px] border border-white overflow-hidden flex-shrink-0"
// // // //     >
// // // //       <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
// // // //         {members.slice(0, 3).map((member: any, index: number) => {
// // // //           let colSpan = index === 2 ? 'col-span-2' : 'col-span-1';
// // // //           return (
// // // //             <img
// // // //               key={index}
// // // //               src={getMemberImage(index)}  // ✅ الصورة الفعلية
// // // //               alt="Member"
// // // //               className={`w-full h-full object-cover ${colSpan} row-span-1`}
// // // //             />
// // // //           );
// // // //         })}
// // // //         {members.length > 3 && (
// // // //           <div 
// // // //             className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center bg-black/70 text-white text-[10px] font-bold rounded-br-[25px] z-20"
// // // //           >
// // // //             +{members.length - 3}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //       <GroupIcon />
// // // //     </div>
// // // //   );
// // // // };

// // // //   // ================= BLOCK/UNBLOCK USER =================
// // // //   // const handleBlockUser = async (chatId: string) => {
// // // //   //   if (!token) return;
    
// // // //   //   const isBlocked = isUserBlocked(chatId);
    
// // // //   //   showConfirmToast(
// // // //   //     isBlocked 
// // // //   //       ? `هل أنت متأكد من رغبتك في رفع الحظر عن هذا المستخدم؟`
// // // //   //       : `هل أنت متأكد من رغبتك في حظر هذا المستخدم؟`,
// // // //   //     async () => {
// // // //   //       try {
// // // //   //         const baseUrl = apiBase || 'https://bo-chat.space';
// // // //   //         const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
          
// // // //   //         const url = isBlocked 
// // // //   //           ? `${cleanBaseUrl}/unblock${myUserId}` 
// // // //   //           : `${cleanBaseUrl}/block${myUserId}`;
          
// // // //   //         const response = await fetch(url, {
// // // //   //           method: 'POST',
// // // //   //           headers: {
// // // //   //             'Authorization': `Bearer ${token}`,
// // // //   //             'Content-Type': 'application/json',
// // // //   //           },
// // // //   //           body: JSON.stringify({ 
// // // //   //             blockedid: chatId 
// // // //   //           })
// // // //   //         });

// // // //   //         const responseText = await response.text();
// // // //   //         let data;
// // // //   //         try {
// // // //   //           data = JSON.parse(responseText);
// // // //   //         } catch (e) {
// // // //   //           if (response.ok) {
// // // //   //             data = { success: true, response: responseText };
// // // //   //           } else {
// // // //   //             data = { success: false, response: responseText || 'خطأ في السيرفر' };
// // // //   //           }
// // // //   //         }
          
// // // //   //         const isSuccess = response.ok && (
// // // //   //           data.success === true || 
// // // //   //           data.status === 'success' || 
// // // //   //           data.message?.includes('success') || 
// // // //   //           data.response === 'success' ||
// // // //   //           data.case === 'done'
// // // //   //         );
          
// // // //   //         if (isSuccess) {
// // // //   //           const message = isBlocked 
// // // //   //             ? '✅ تم رفع الحظر عن المستخدم بنجاح' 
// // // //   //             : '✅ تم حظر المستخدم بنجاح';
            
// // // //   //           toast.success(message);
            
// // // //   //           if (isBlocked) {
// // // //   //             setBlockedUsers(prev => prev.filter(id => id !== chatId));
// // // //   //           } else {
// // // //   //             setBlockedUsers(prev => [...prev, chatId]);
// // // //   //           }
            
// // // //   //           setOpenDropdown(null);
// // // //   //         } else {
// // // //   //           const errorMsg = data?.response || data?.message || data?.error || data?.msg || 'خطأ غير معروف';
// // // //   //           const actionName = isBlocked ? 'رفع الحظر' : 'حظر';
// // // //   //           toast.error(`❌ فشل ${actionName}: ${errorMsg}`);
// // // //   //         }
// // // //   //       } catch (error) {
// // // //   //         console.error('Error blocking/unblocking user:', error);
// // // //   //         toast.error('حدث خطأ أثناء محاولة تنفيذ العملية. يرجى المحاولة مرة أخرى.');
// // // //   //       }
// // // //   //     },
// // // //   //     () => {
// // // //   //       setOpenDropdown(null);
// // // //   //     }
// // // //   //   );
// // // //   // };
// // // //   // ================= BLOCK/UNBLOCK USER =================
// // // // const handleBlockUser = async (chatId: string) => {
// // // //   if (!token) return;
  
// // // //   const isBlocked = isUserBlocked(chatId);
// // // //   const chat = chats.find(c => c.chatId === chatId);
// // // //   const userName = chat?.name || 'هذا المستخدم';
  
// // // //   const confirmMessage = isBlocked 
// // // //     ? ` أنت على وشك رفع الحظر عن "${userName}"\n\nبعد رفع الحظر، سيتمكن هذا المستخدم من التواصل معك مرة أخرى.`
// // // //     : `أنت على وشك حظر "${userName}"\n\nبعد الحظر، لن يتمكن هذا المستخدم من التواصل معك أو رؤية نشاطك.`;
  
// // // //   showConfirmToast(
// // // //     confirmMessage,
// // // //     async () => {
// // // //       try {
// // // //         const baseUrl = apiBase || 'https://bo-chat.space';
// // // //         const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        
// // // //         const url = isBlocked 
// // // //           ? `${cleanBaseUrl}/unblock${myUserId}` 
// // // //           : `${cleanBaseUrl}/block${myUserId}`;
        
// // // //         const response = await fetch(url, {
// // // //           method: 'POST',
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`,
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //           body: JSON.stringify({ 
// // // //             blockedid: chatId 
// // // //           })
// // // //         });

// // // //         const responseText = await response.text();
// // // //         let data;
// // // //         try {
// // // //           data = JSON.parse(responseText);
// // // //         } catch (e) {
// // // //           if (response.ok) {
// // // //             data = { success: true, response: responseText };
// // // //           } else {
// // // //             data = { success: false, response: responseText || 'خطأ في السيرفر' };
// // // //           }
// // // //         }
        
// // // //         const isSuccess = response.ok && (
// // // //           data.success === true || 
// // // //           data.status === 'success' || 
// // // //           data.message?.includes('success') || 
// // // //           data.response === 'success' ||
// // // //           data.case === 'done'
// // // //         );
        
// // // //         if (isSuccess) {
// // // //           const message = isBlocked 
// // // //             ? ' تم رفع الحظر عن المستخدم بنجاح' 
// // // //             : ' تم حظر المستخدم بنجاح';
          
// // // //           toast.success(message);
          
// // // //           if (isBlocked) {
// // // //             setBlockedUsers(prev => prev.filter(id => id !== chatId));
// // // //           } else {
// // // //             setBlockedUsers(prev => [...prev, chatId]);
// // // //           }
          
// // // //           setOpenDropdown(null);
// // // //         } else {
// // // //           const errorMsg = data?.response || data?.message || data?.error || data?.msg || 'خطأ غير معروف';
// // // //           const actionName = isBlocked ? 'رفع الحظر' : 'حظر';
// // // //           toast.error(` فشل ${actionName}: ${errorMsg}`);
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Error blocking/unblocking user:', error);
// // // //         toast.error('حدث خطأ أثناء محاولة تنفيذ العملية. يرجى المحاولة مرة أخرى.');
// // // //       }
// // // //     },
// // // //     () => {
// // // //       setOpenDropdown(null);
// // // //       toast(`تم إلغاء ${isBlocked ? 'رفع الحظر' : 'الحظر'}`, {
// // // //         icon: '↩️',
// // // //         duration: 2000,
// // // //       });
// // // //     },
// // // //     isBlocked ? 'نعم، أرفع الحظر' : 'نعم، أحظر',
// // // //     'إلغاء'
// // // //   );
// // // // };

// // // //   // ================= ARCHIVE/FAVORITE CHAT (TOGGLE) =================
// // // //   const handleArchiveChat = async (chatId: string, chatType: string) => {
// // // //     if (!token) return;
    
// // // //     const currentChat = chats.find(c => c.chatId === chatId);
// // // //     if (!currentChat) return;
    
// // // //     const isCurrentlyFavorite = currentChat.isFavorite || false;
    
// // // //     const url = isCurrentlyFavorite 
// // // //       ? `${apiBase}/chats/unfavorite` 
// // // //       : `${apiBase}/chats/favorite`;
    
// // // //     const successMessage = isCurrentlyFavorite 
// // // //       ? ' تم إزالة المحادثة من المفضلة بنجاح' 
// // // //       : ' تمت إضافة المحادثة إلى المفضلة بنجاح';
    
// // // //     const errorMessage = isCurrentlyFavorite 
// // // //       ? 'إزالة من المفضلة' 
// // // //       : 'إضافة إلى المفضلة';
    
// // // //     try {
// // // //       const response = await fetch(url, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //         body: JSON.stringify({ 
// // // //           chatId: chatId,
// // // //           chatType: chatType
// // // //         })
// // // //       });

// // // //       const data = await response.json();
      
// // // //       if (data.success) {
// // // //         toast.success(successMessage);
        
// // // //         setChats(prev => 
// // // //           prev.map(c => 
// // // //             c.chatId === chatId 
// // // //               ? { ...c, isFavorite: !isCurrentlyFavorite } 
// // // //               : c
// // // //           )
// // // //         );
// // // //         setFilteredChats(prev => 
// // // //           prev.map(c => 
// // // //             c.chatId === chatId 
// // // //               ? { ...c, isFavorite: !isCurrentlyFavorite } 
// // // //               : c
// // // //           )
// // // //         );
        
// // // //         setOpenDropdown(null);
// // // //       } else {
// // // //         toast.error(` فشل ${errorMessage}: ${data.response || data.message || 'خطأ غير معروف'}`);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error toggling favorite:', error);
// // // //       toast.error(`حدث خطأ أثناء محاولة ${errorMessage}`);
// // // //     }
// // // //   };

// // // //   // ================= DELETE CHAT =================
// // // //   // const handleDeleteChat = async (chatId: string, chatType: string) => {
// // // //   //   if (!token) return;
    
// // // //   //   showConfirmToast(
// // // //   //     `هل أنت متأكد من رغبتك في حذف هذه المحادثة؟`,
// // // //   //     async () => {
// // // //   //       try {
// // // //   //         const response = await fetch(`${apiBase}/chats/chats/delete`, {
// // // //   //           method: 'DELETE',
// // // //   //           headers: {
// // // //   //             Authorization: `Bearer ${token}`,
// // // //   //             'Content-Type': 'application/json',
// // // //   //           },
// // // //   //           body: JSON.stringify({ 
// // // //   //             chatId: chatId,
// // // //   //             chatType: chatType
// // // //   //           })
// // // //   //         });

// // // //   //         const data = await response.json();
          
// // // //   //         if (data.success) {
// // // //   //           toast.success('✅ تم حذف المحادثة بنجاح');
// // // //   //           setChats(prev => prev.filter(c => c.chatId !== chatId));
// // // //   //           setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));
            
// // // //   //           if (activeChatId === chatId) {
// // // //   //             router.push('/chats');
// // // //   //           }
            
// // // //   //           setOpenDropdown(null);
// // // //   //         } else {
// // // //   //           toast.error(`❌ فشل حذف المحادثة: ${data.response || data.message || 'خطأ غير معروف'}`);
// // // //   //         }
// // // //   //       } catch (error) {
// // // //   //         console.error('Error deleting chat:', error);
// // // //   //         toast.error('حدث خطأ أثناء محاولة حذف المحادثة');
// // // //   //       }
// // // //   //     },
// // // //   //     () => {
// // // //   //       setOpenDropdown(null);
// // // //   //     }
// // // //   //   );
// // // //   // };

// // // //   // ================= DELETE CHAT =================
// // // // // const handleDeleteChat = async (chatId: string, chatType: string) => {
// // // // //   if (!token) return;
  
// // // // //   // البحث عن اسم المحادثة
// // // // //   const chat = chats.find(c => c.chatId === chatId);
// // // // //   const chatName = chat?.name || 'هذه المحادثة';
// // // // //   const isGroupChat = chatType === 'group' || chat?.isGroup;
  
// // // // //   const confirmMessage = isGroupChat
// // // // //     ? `أنت على وشك حذف المجموعة "${chatName}" بالكامل\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمجموعة، ولن تتمكن من استعادتها بعد الحذف.`
// // // // //     : ` أنت على وشك حذف المحادثة مع "${chatName}"\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمحادثة، ولن تتمكن من استعادتها بعد الحذف.`;
  
// // // // //   showConfirmToast(
// // // // //     confirmMessage,
// // // // //     async () => {
// // // // //       try {
// // // // //         const response = await fetch(`${apiBase}/chats/chats/delete`, {
// // // // //           method: 'DELETE',
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`,
// // // // //             'Content-Type': 'application/json',
// // // // //           },
// // // // //           body: JSON.stringify({ 
// // // // //             chatId: chatId,
// // // // //             chatType: chatType
// // // // //           })
// // // // //         });

// // // // //         const data = await response.json();
        
// // // // //         if (data.success) {
// // // // //           toast.success(' تم حذف المحادثة بنجاح');
// // // // //           setChats(prev => prev.filter(c => c.chatId !== chatId));
// // // // //           setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));
          
// // // // //           if (activeChatId === chatId) {
// // // // //             router.push('/chats');
// // // // //           }
          
// // // // //           setOpenDropdown(null);
// // // // //         } else {
// // // // //           toast.error(` فشل حذف المحادثة: ${data.response || data.message || 'خطأ غير معروف'}`);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error('Error deleting chat:', error);
// // // // //         toast.error('حدث خطأ أثناء محاولة حذف المحادثة');
// // // // //       }
// // // // //     },
// // // // //     () => {
// // // // //       setOpenDropdown(null);
// // // // //       toast('تم إلغاء عملية الحذف', {
// // // // //         icon: '↩️',
// // // // //         duration: 2000,
// // // // //       });
// // // // //     },
// // // // //     'نعم، احذف', // زر التأكيد
// // // // //     'إلغاء' // زر الإلغاء
// // // // //   );
// // // // // };
// // // // // 1. دالة الحذف المباشر (تتعامل مع الـ API وتحديد النوع والتحكم بالإشعارات)
// // // // // const performDeleteChat = async (chatId: string, chatType: string, showToast: boolean = true) => {
// // // // //   if (!token) return false;

// // // // //   const chat = chats.find(c => c.chatId === chatId);
// // // // //   // ✅ تحديد النوع بشكل أكثر دقة
// // // // //   const isGroupChat = chatType === 'group' || chat?.isGroup === true || chat?.chatType === 'group';

// // // // //   // ✅ اختيار المسار والـ Method حسب نوع المحادثة
// // // // //   const endpoint = isGroupChat
// // // // //     ? `${apiBase}/chats/groups/DeleteGroup/${chatId}`
// // // // //     : `${apiBase}/chats/delete/${chatId}`;

// // // // //   const method = isGroupChat ? 'POST' : 'DELETE';

// // // // //   console.log(`🗑️ Deleting chat: ${chatId} | isGroup: ${isGroupChat} | endpoint: ${endpoint} | method: ${method}`);

// // // // //   try {
// // // // //     const response = await fetch(endpoint, {
// // // // //       method: method,
// // // // //       headers: {
// // // // //         Authorization: `Bearer ${token}`,
// // // // //         'Content-Type': 'application/json',
// // // // //       },
// // // // //     });

// // // // //     const data = await response.json();
// // // // //     console.log('🗑️ Delete response:', data);

// // // // //     // ✅ تحقق من success بشكل أكثر شمولاً
// // // // //     const isSuccess = 
// // // // //       response.ok && (
// // // // //         data.success === true ||
// // // // //         data.response?.deleted === true ||
// // // // //         data.status === 'success'
// // // // //       );

// // // // //     if (isSuccess) {
// // // // //       if (showToast) {
// // // // //         toast.success('تم حذف المحادثة بنجاح');
// // // // //       }
// // // // //       return true;
// // // // //     } else {
// // // // //       if (showToast) {
// // // // //         toast.error(`فشل حذف المحادثة: ${data.response?.message || data.response || data.message || 'خطأ غير معروف'}`);
// // // // //       }
// // // // //       return false;
// // // // //     }
// // // // //   } catch (error) {
// // // // //     console.error('Error deleting chat:', error);
// // // // //     if (showToast) {
// // // // //       toast.error('حدث خطأ أثناء محاولة حذف المحادثة');
// // // // //     }
// // // // //     return false;
// // // // //   }
// // // // // };
// // // // // // 2. دالة الحذف الفردي (تعرض رسالة التأكيد وتحدث الـ State)
// // // // // const handleDeleteChat = async (chatId: string, chatType: string) => {
// // // // //   if (!token) return;

// // // // //   const chat = chats.find(c => c.chatId === chatId);
// // // // //   const chatName = chat?.name || 'هذه المحادثة';
// // // // //   const isGroupChat = chatType === 'group' || chat?.isGroup === true || chat?.chatType === 'group';

// // // // //   const confirmMessage = isGroupChat
// // // // //     ? `أنت على وشك حذف المجموعة "${chatName}" بالكامل\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمجموعة، ولن تتمكن من استعادتها بعد الحذف.`
// // // // //     : `أنت على وشك حذف المحادثة مع "${chatName}"\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمحادثة، ولن تتمكن من استعادتها بعد الحذف.`;

// // // // //   showConfirmToast(
// // // // //     confirmMessage,
// // // // //     async () => {
// // // // //       const isSuccess = await performDeleteChat(chatId, chatType, true);

// // // // //       if (isSuccess) {
// // // // //         // ✅ تحديث الـ state بشكل فوري ومتزامن
// // // // //         setChats(prev => prev.filter(c => c.chatId !== chatId));
// // // // //         setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));

// // // // //         // ✅ لو المحادثة الحالية هي المفتوحة، ارجعي لصفحة الشات
// // // // //         if (activeChatId === chatId) {
// // // // //           router.push('/chats');
// // // // //         }
// // // // //       }
// // // // //       setOpenDropdown(null);
// // // // //     },
// // // // //     () => {
// // // // //       setOpenDropdown(null);
// // // // //       toast('تم إلغاء عملية الحذف', { icon: '↩️', duration: 2000 });
// // // // //     },
// // // // //     'نعم، احذف',
// // // // //     'إلغاء'
// // // // //   );
// // // // // };

// // // // // 1. دالة الحذف المباشر (تتعامل مع الـ API مباشرة)
// // // //  const performDeleteChat = async (chatId: string, chatType: string, showToast: boolean = true) => {
// // // //   if (!token) {
// // // //     if (showToast) toast.error('يرجى تسجيل الدخول أولاً');
// // // //     return false;
// // // //   }

// // // //   const chat: any = chats.find(c => 
// // // //     c.chatId === chatId || 
// // // //     c.groupId === chatId || 
// // // //     c.id === chatId || 
// // // //     c._id === chatId
// // // //   );

// // // //   const isGroupChat = chatType === 'group' || chat?.isGroup === true || chat?.chatType === 'group';
// // // //   const targetId = isGroupChat 
// // // //     ? (chat?.groupId || chat?.id || chat?._id || chatId) 
// // // //     : (chat?.chatId || chatId);

// // // //   // 1. الرابط المباشر
// // // //   const endpoint = isGroupChat
// // // //     ? `${apiBase}/chats/groups/DeleteGroup/${targetId}`
// // // //     : `${apiBase}/chats/delete/${targetId}`;

// // // //   try {
// // // //     // 💡 المحاولة الأولى: استخدام طريقة DELETE (بدل POST)
// // // //     let response = await fetch(endpoint, {
// // // //       method: 'DELETE',
// // // //       headers: {
// // // //         'Authorization': `Bearer ${token}`,
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });

// // // //     // 💡 المحاولة الثانية: إذا كان السيرفر يتطلب Case مختلفة للرابط (DeleteGroup vs deleteGroup)
// // // //     if (response.status === 404 && isGroupChat) {
// // // //       const fallbackEndpoint = `${apiBase}/chats/groups/deleteGroup/${targetId}`;
// // // //       response = await fetch(fallbackEndpoint, {
// // // //         method: 'DELETE',
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //       });
// // // //     }

// // // //     const responseText = await response.text();
// // // //     let data;
// // // //     try {
// // // //       data = JSON.parse(responseText);
// // // //     } catch {
// // // //       data = { success: response.ok, response: responseText };
// // // //     }

// // // //     const isSuccess = response.ok && (
// // // //       data.success === true ||
// // // //       data.response?.deleted === true ||
// // // //       data.status === 'success' ||
// // // //       response.status === 200
// // // //     );

// // // //     if (isSuccess) {
// // // //       if (showToast) toast.success(isGroupChat ? 'تم حذف المجموعة بنجاح' : 'تم حذف المحادثة بنجاح');
// // // //       return true;
// // // //     } else {
// // // //       if (showToast) toast.error(`فشل الحذف من السيرفر (${response.status})`);
// // // //       return false;
// // // //     }
// // // //   } catch (error) {
// // // //     console.error('Error during delete:', error);
// // // //     if (showToast) toast.error('حدث خطأ في الاتصال بالسيرفر');
// // // //     return false;
// // // //   }
// // // // };
// // // // const handleBulkDelete = async () => {
// // // //   console.log('🔘 [CLICKED BULK DELETE], Selected items:', selectedChats);

// // // //   if (!selectedChats || selectedChats.length === 0) {
// // // //     console.warn('⚠️ القائمة المحددة فارغة');
// // // //     return;
// // // //   }

// // // //   try {
// // // //     // 1. تنفيذ الحذف عبر الـ API لكل عناصر المصفوفة
// // // //     for (const selectedId of selectedChats) {
// // // //       const chat: any = chats.find(c => 
// // // //         c.chatId === selectedId || 
// // // //         c.groupId === selectedId || 
// // // //         c.id === selectedId || 
// // // //         c._id === selectedId
// // // //       );

// // // //       const isGroup = chat ? (chat.chatType === 'group' || chat.isGroup) : true;
// // // //       const targetId = chat ? (chat.groupId || chat.id || chat.chatId || selectedId) : selectedId;
// // // //       const type = isGroup ? 'group' : 'direct';

// // // //       await performDeleteChat(targetId, type, false);
// // // //     }

// // // //     // 2. تحديث الـ State بعد الحذف
// // // //     setChats(prev => prev.filter(c => 
// // // //       !selectedChats.includes(c.chatId) && 
// // // //       !selectedChats.includes(c.groupId) && 
// // // //       !selectedChats.includes(c.id)
// // // //     ));

// // // //     setFilteredChats(prev => prev.filter(c => 
// // // //       !selectedChats.includes(c.chatId) && 
// // // //       !selectedChats.includes(c.groupId) && 
// // // //       !selectedChats.includes(c.id)
// // // //     ));

// // // //     toast.success('تم حذف العناصر المحددة');
// // // //   } catch (err) {
// // // //     console.error('❌ [BULK DELETE FAILED]:', err);
// // // //   } finally {
// // // //     clearSelection();
// // // //   }
// // // // };
// // // // // 2. دالة الحذف الفردي للمجموعة/المحادثة
// // // // const handleDeleteChat = async (chatId: string, chatType: string) => {
// // // //   if (!token) return;

// // // //   const chat: any = chats.find(c => 
// // // //     c.chatId === chatId || 
// // // //     c.groupId === chatId || 
// // // //     c.id === chatId
// // // //   );
  
// // // //   const chatName = chat?.name || 'هذه المحادثة';
// // // //   const isGroupChat = chatType === 'group' || chat?.isGroup === true || chat?.chatType === 'group';
  
// // // //   const deleteId = isGroupChat 
// // // //     ? (chat?.groupId || chat?.chatId || chatId)
// // // //     : (chat?.chatId || chatId);

// // // //   const confirmMessage = isGroupChat
// // // //     ? `أنت على وشك حذف المجموعة "${chatName}" بالكامل\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمجموعة، ولن تتمكن من استعادتها بعد الحذف.`
// // // //     : `أنت على وشك حذف المحادثة مع "${chatName}"\n\nسيتم حذف جميع الرسائل والمحتوى الخاص بالمحادثة، ولن تتمكن من استعادتها بعد الحذف.`;

// // // //   showConfirmToast(
// // // //     confirmMessage,
// // // //     async () => {
// // // //       const isSuccess = await performDeleteChat(deleteId, chatType, true);

// // // //       if (isSuccess) {
// // // //         const filterOutDeleted = (item: any) => {
// // // //           const itemChatId = item.chatId;
// // // //           const itemGroupId = item.groupId;
          
// // // //           return (
// // // //             itemChatId !== chatId && 
// // // //             itemChatId !== deleteId &&
// // // //             itemGroupId !== chatId && 
// // // //             itemGroupId !== deleteId
// // // //           );
// // // //         };

// // // //         setChats(prev => prev.filter(filterOutDeleted));
// // // //         setFilteredChats(prev => prev.filter(filterOutDeleted));

// // // //         if (activeChatId === chatId || activeChatId === deleteId) {
// // // //           router.push('/chats');
// // // //         }
// // // //       }
// // // //       setOpenDropdown(null);
// // // //     },
// // // //     () => {
// // // //       setOpenDropdown(null);
// // // //       toast('تم إلغاء عملية الحذف', { icon: '↩️', duration: 2000 });
// // // //     },
// // // //     'نعم، احذف',
// // // //     'إلغاء'
// // // //   );
// // // // };
// // // //   // ================= LEAVE GROUP =================
// // // //   // const handleLeaveGroup = async (chatId: string) => {
// // // //   //   if (!token) return;

// // // //   //   showConfirmToast(
// // // //   //     'هل أنت متأكد من رغبتك في الخروج من هذه المجموعة؟',
// // // //   //     async () => {
// // // //   //       try {
// // // //   //         const response = await fetch(
// // // //   //           `${apiBase}/chats/groups/LeaveGroup/${chatId}`,
// // // //   //           {
// // // //   //             method: 'POST',
// // // //   //             headers: {
// // // //   //               Authorization: `Bearer ${token}`,
// // // //   //               'Content-Type': 'application/json',
// // // //   //             },
// // // //   //           }
// // // //   //         );

// // // //   //         const data = await response.json();

// // // //   //         if (data.success) {
// // // //   //           setChats(prev => prev.filter(c => c.chatId !== chatId));
// // // //   //           setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));

// // // //   //           if (activeChatId === chatId) {
// // // //   //             router.push('/chats');
// // // //   //           }

// // // //   //           setOpenDropdown(null);
// // // //   //           toast.success('✅ تم الخروج من المجموعة بنجاح');
// // // //   //           return;
// // // //   //         }

// // // //   //         if (
// // // //   //           data.response &&
// // // //   //           data.response.toLowerCase().includes('transfer ownership')
// // // //   //         ) {
// // // //   //           setSelectedGroupId(chatId);
// // // //   //           setNewOwnerId('');
// // // //   //           setShowTransferModal(true);
// // // //   //           setOpenDropdown(null);
// // // //   //           return;
// // // //   //         }

// // // //   //         toast.error(
// // // //   //           `❌ فشل الخروج من المجموعة: ${
// // // //   //             data.response || data.message || 'خطأ غير معروف'
// // // //   //           }`
// // // //   //         );

// // // //   //       } catch (error) {
// // // //   //         console.error('Error leaving group:', error);
// // // //   //         toast.error('حدث خطأ أثناء محاولة الخروج من المجموعة');
// // // //   //       }
// // // //   //     },
// // // //   //     () => {
// // // //   //       setOpenDropdown(null);
// // // //   //     }
// // // //   //   );
// // // //   // };

// // // //   // ================= LEAVE GROUP =================
// // // // const handleLeaveGroup = async (chatId: string) => {
// // // //   if (!token) return;

// // // //   const chat = chats.find(c => c.chatId === chatId);
// // // //   const groupName = chat?.name || 'المجموعة';

// // // //   showConfirmToast(
// // // //     ` أنت على وشك الخروج من المجموعة "${groupName}"\n\nبعد الخروج، لن تتمكن من رؤية الرسائل الجديدة أو التفاعل مع أعضاء المجموعة.\n${chat?.isAdmin ? '🔴 أنت مشرف في هذه المجموعة، سيتم إزالة صلاحياتك تلقائياً.' : ''}`,
// // // //     async () => {
// // // //       try {
// // // //         const response = await fetch(
// // // //           `${apiBase}/chats/groups/LeaveGroup/${chatId}`,
// // // //           {
// // // //             method: 'POST',
// // // //             headers: {
// // // //               Authorization: `Bearer ${token}`,
// // // //               'Content-Type': 'application/json',
// // // //             },
// // // //           }
// // // //         );

// // // //         const data = await response.json();

// // // //         if (data.success) {
// // // //           setChats(prev => prev.filter(c => c.chatId !== chatId));
// // // //           setFilteredChats(prev => prev.filter(c => c.chatId !== chatId));

// // // //           if (activeChatId === chatId) {
// // // //             router.push('/chats');
// // // //           }

// // // //           setOpenDropdown(null);
// // // //           toast.success(' تم الخروج من المجموعة بنجاح');
// // // //           return;
// // // //         }

// // // //         if (
// // // //           data.response &&
// // // //           data.response.toLowerCase().includes('transfer ownership')
// // // //         ) {
// // // //           setSelectedGroupId(chatId);
// // // //           setNewOwnerId('');
// // // //           setShowTransferModal(true);
// // // //           setOpenDropdown(null);
// // // //           return;
// // // //         }

// // // //         toast.error(
// // // //           `فشل الخروج من المجموعة: ${
// // // //             data.response || data.message || 'خطأ غير معروف'
// // // //           }`
// // // //         );

// // // //       } catch (error) {
// // // //         console.error('Error leaving group:', error);
// // // //         toast.error('حدث خطأ أثناء محاولة الخروج من المجموعة');
// // // //       }
// // // //     },
// // // //     () => {
// // // //       setOpenDropdown(null);
// // // //       toast('تم إلغاء الخروج من المجموعة', {
// // // //         icon: '↩️',
// // // //         duration: 2000,
// // // //       });
// // // //     },
// // // //     'نعم، أخرج',
// // // //     'إلغاء'
// // // //   );
// // // // };
// // // //   // ================= PROMOTE ADMIN & LEAVE =================
// // // //   const handleTransferOwnershipAndLeave = async (
// // // //     newAdminMemberId: string
// // // //   ) => {
// // // //     if (!token || !selectedGroupId) return;

// // // //     const groupId = selectedGroupId;

// // // //     try {
// // // //       const groupDetails = await fetchGroupDetails(groupId);
// // // //       if (!groupDetails) {
// // // //         toast.error(' فشل في جلب بيانات المجموعة');
// // // //         return;
// // // //       }

// // // //       const admins = groupDetails.admins || [];
// // // //       const ownerId = groupDetails.owner || groupDetails.createdBy;

// // // //       if (newAdminMemberId === ownerId) {
// // // //         toast.error(' هذا المستخدم هو مالك المجموعة بالفعل، اختر عضواً آخر');
// // // //         return;
// // // //       }

// // // //       if (admins.includes(newAdminMemberId)) {
// // // //         toast.error(' هذا المستخدم مشرف بالفعل، اختر عضواً آخر');
// // // //         return;
// // // //       }

// // // //       const promoteResponse = await fetch(
// // // //         `${apiBase}/chats/groups/PromoteAdmin/${groupId}`,
// // // //         {
// // // //           method: 'POST',
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //           body: JSON.stringify({
// // // //             memberid: newAdminMemberId,
// // // //           }),
// // // //         }
// // // //       );

// // // //       const promoteData = await promoteResponse.json();

// // // //       if (!promoteData.success) {
// // // //         toast.error(
// // // //           `فشل تعيين المشرف الجديد: ${
// // // //             promoteData.response || 'خطأ غير معروف'
// // // //           }`
// // // //         );
// // // //         return;
// // // //       }

// // // //       const leaveResponse = await fetch(
// // // //         `${apiBase}/chats/groups/LeaveGroup/${groupId}`,
// // // //         {
// // // //           method: 'POST',
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //         }
// // // //       );

// // // //       const leaveData = await leaveResponse.json();

// // // //       if (!leaveData.success) {
// // // //         toast.error(
// // // //           ` تم تعيين الأدمن، لكن فشل الخروج من المجموعة: ${
// // // //             leaveData.response || 'خطأ غير معروف'
// // // //           }`
// // // //         );
// // // //         return;
// // // //       }

// // // //       setChats(prev =>
// // // //         prev.filter(chat => chat.chatId !== groupId)
// // // //       );

// // // //       setFilteredChats(prev =>
// // // //         prev.filter(chat => chat.chatId !== groupId)
// // // //       );

// // // //       setShowTransferModal(false);
// // // //       setSelectedGroupId(null);
// // // //       setNewOwnerId('');
// // // //       setOpenDropdown(null);

// // // //       if (activeChatId === groupId) {
// // // //         router.push('/chats');
// // // //       }

// // // //       toast.success(' تم الخروج من المجموعة بنجاح');

// // // //     } catch (error) {
// // // //       console.error('Error promoting admin and leaving group:', error);
// // // //       toast.error('حدث خطأ أثناء تعيين المشرف والخروج من المجموعة');
// // // //     }
// // // //   };

// // // //   // ================= REPORT USER =================
// // // //   const getReporterId = (): string => {
// // // //     try {
// // // //       const raw = localStorage.getItem("userData");
// // // //       if (!raw) return "";
// // // //       const data = JSON.parse(raw);
// // // //       return data?._id || "";
// // // //     } catch {
// // // //       return "";
// // // //     }
// // // //   };

// // // //   const getReporterEmail = (): string => {
// // // //     try {
// // // //       const raw = localStorage.getItem("userData");
// // // //       if (!raw) return "";
// // // //       const data = JSON.parse(raw);
// // // //       return data?.useremail || data?.useremail2 || data?.email || "";
// // // //     } catch {
// // // //       return "";
// // // //     }
// // // //   };

// // // //   const handleReportClick = (chatId: string) => {
// // // //     setOpenDropdown(null);
// // // //     setSelectedReportChatId(chatId);
// // // //     setShowReportModal(true);
// // // //     setSelectedReason("");
// // // //     setShowReportSuccess(false);
// // // //   };

// // // //   const handleCloseReportModal = () => {
// // // //     setShowReportModal(false);
// // // //     setSelectedReportChatId(null);
// // // //     setSelectedReason("");
// // // //   };

// // // //   const handleReasonSelect = async (reasonLabel: string) => {
// // // //     const reporterId = getReporterId();
// // // //     const reporterEmail = getReporterEmail();
    
// // // //     if (!reporterId || !reporterEmail) {
// // // //       toast.error('يرجى تسجيل الدخول أولاً');
// // // //       return;
// // // //     }

// // // //     if (!selectedReportChatId) {
// // // //       toast.error('خطأ: لم يتم تحديد المستخدم');
// // // //       return;
// // // //     }

// // // //     setSelectedReason(reasonLabel);
// // // //     setIsReporting(true);

// // // //     try {
// // // //       const baseUrl = apiBase || 'https://bo-chat.space';
// // // //       const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

// // // //       const body = {
// // // //         reporter: reporterId,
// // // //         report: reasonLabel,
// // // //         email: reporterEmail,
// // // //         reportedUserId: selectedReportChatId,
// // // //       };

// // // //       const res = await fetch(`${cleanBaseUrl}/user/report`, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify(body),
// // // //       });

// // // //       if (!res.ok) {
// // // //         const text = await res.text();
// // // //         throw new Error(text || "فشل إرسال البلاغ");
// // // //       }

// // // //       setShowReportModal(false);
// // // //       setShowReportSuccess(true);
// // // //       toast.success('تم إرسال البلاغ بنجاح');
      
// // // //     } catch (error: any) {
// // // //       console.error("Report error:", error);
// // // //       toast.error(error.message || 'فشل إرسال البلاغ');
// // // //     } finally {
// // // //       setIsReporting(false);
// // // //     }
// // // //   };

// // // //   const handleCloseSuccessModal = () => {
// // // //     setShowReportSuccess(false);
// // // //     setSelectedReason("");
// // // //   };

// // // //   // ================= CALLS FUNCTIONS =================
// // // //   const handleCallClick = (chatId: string) => {
// // // //     setOpenDropdown(null);
// // // //     setSelectedCallChatId(chatId);
// // // //     setIsCallModalOpen(true);
// // // //   };

// // // //   const handleCloseCallModal = () => {
// // // //     setIsCallModalOpen(false);
// // // //     setSelectedCallChatId(null);
// // // //   };

// // // //   const handleStartCall = (type: 'audio' | 'video') => {
// // // //     if (!selectedCallChatId) return;
    
// // // //     const chat = chats.find(c => c.chatId === selectedCallChatId);
// // // //     if (!chat) return;
    
// // // //     if (callMinutes.free <= 0) {
// // // //       toast.error(' رصيدك من الدقائق المجانية قد انتهى');
// // // //       return;
// // // //     }
    
// // // //     setCallMinutes(prev => ({
// // // //       ...prev,
// // // //       free: prev.free - 1
// // // //     }));
    
// // // //     setIsCallModalOpen(false);
// // // //     toast.success(` جاري الاتصال بـ ${chat.name}... (${type === 'audio' ? 'صوتي' : 'فيديو'})`);
    
// // // //     console.log(`Starting ${type} call with ${chat.chatId}`);
// // // //   };

// // // //  const getGroupIdForChat = async (chatId: string): Promise<string | null> => {
// // // //   if (!token) return null;
  
// // // //   try {
// // // //     // جرّبي تجيبي المجموعة مباشرة بالـ chatId
// // // //     const res = await fetch(`${apiBase}/chats/groups/GetGroup/${chatId}`, {
// // // //       headers: {
// // // //         Authorization: `Bearer ${token}`,
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });
    
// // // //     if (res.ok) {
// // // //       const data = await res.json();
// // // //       return data.response?._id || data.response?.groupId || chatId;
// // // //     }
// // // //   } catch (e) {
// // // //     console.error('Failed to get group id:', e);
// // // //   }
// // // //   return chatId;
// // // // }; 
// // // //   // ================= DROPDOWN ACTIONS =================
// // // //   // const handleDropdownAction = (action: string, chatId: string, chatType: string) => {
// // // //   //   setOpenDropdown(null);
// // // //   //   console.log(`Action: ${action} on chat: ${chatId}`);
// // // //   //    console.log('🎯 Dropdown Action:', {
// // // //   //   action,
// // // //   //   chatId,
// // // //   //   chatType,
// // // //   //   chatObject: chat,
// // // //   //   groupId: chat?.groupId,
// // // //   //   isGroup: chat?.isGroup,
// // // //   // });
// // // //   //   switch(action) {
// // // //   //     case 'block':
// // // //   //       handleBlockUser(chatId);
// // // //   //       break;
// // // //   //     case 'report':
// // // //   //       handleReportClick(chatId);
// // // //   //       break;
// // // //   //     case 'search':
// // // //   //       toast.info('جاري البحث في المحادثة...');
// // // //   //       break;
// // // //   //     case 'archive':
// // // //   //       handleArchiveChat(chatId, chatType);
// // // //   //       break;
// // // //   //     case 'delete':
// // // //   //       handleDeleteChat(chatId, chatType);
// // // //   //       break;
// // // //   //     case 'leave':
// // // //   //       handleLeaveGroup(chatId);
// // // //   //       break;
// // // //   //     case 'call':
// // // //   //       handleCallClick(chatId);
// // // //   //       break;
// // // //   //   }
// // // //   // };
// // // //   const handleDropdownAction = (action: string, chatId: string, chatType: string) => {
// // // //   setOpenDropdown(null);
  
// // // //   // ✅ جيبي الـ chat object الأول
// // // //   const chat: any = chats.find(c => 
// // // //     c.chatId === chatId || 
// // // //     (c as any).groupId === chatId || 
// // // //     (c as any).id === chatId ||
// // // //     (c as any)._id === chatId
// // // //   );
  
// // // //   console.log('🎯 Dropdown Action:', {
// // // //     action,
// // // //     chatId,
// // // //     chatType,
// // // //     chatObject: chat,
// // // //     groupId: chat?.groupId,
// // // //     chatIdFromObj: chat?.chatId,
// // // //     id: chat?.id,
// // // //     _id: chat?._id,
// // // //     isGroup: chat?.isGroup,
// // // //     chatTypeFromObj: chat?.chatType,
// // // //   });
  
// // // //   switch(action) {
// // // //     case 'block':
// // // //       handleBlockUser(chatId);
// // // //       break;
// // // //     case 'report':
// // // //       handleReportClick(chatId);
// // // //       break;
// // // //     case 'search':
// // // //       toast.info('جاري البحث في المحادثة...');
// // // //       break;
// // // //     case 'archive':
// // // //       handleArchiveChat(chatId, chatType);
// // // //       break;
// // // //     case 'delete':
// // // //       handleDeleteChat(chatId, chatType);
// // // //       break;
// // // //     case 'leave':
// // // //       handleLeaveGroup(chatId);
// // // //       break;
// // // //     case 'call':
// // // //       handleCallClick(chatId);
// // // //       break;
// // // //   }
// // // // };

// // // //   if (loading) {
// // // //     return <div className="p-4 text-center">جارٍ التحميل...</div>;
// // // //   }
 

// // // //   return (
// // // //     <div className="relative h-full flex flex-col">
// // // //       {/* Header */}
// // // //       <div className="flex items-center justify-between px-4 mb-5">
// // // //         <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
// // // //           {getSectionTitle()}
// // // //         </h1>
        
// // // //         {!selectionMode && (
// // // //           <button
// // // //             onClick={() => setIsCreateGroupOpen(true)}
// // // //             className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
// // // //             aria-label="إنشاء مجموعة"
// // // //           >
// // // //             <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
// // // //           </button>
// // // //         )}
// // // //       </div>

// // // //       {/* ================= SELECTION MODE TOOLBAR ================= */}
// // // //       {selectionMode && selectedChats.length > 0 && (
// // // //         <div className="w-full px-4 mb-3 -mt-10"  style={{
// // // //           background: 'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
// // // //            paddingTop: '8px',
// // // //           paddingBottom: '8px',
// // // //           // borderRadius: '12px',
// // // //         }}>
// // // //           <div className="flex items-center justify-center gap-2 mt-[30px]">
// // // //             <button
// // // //               onClick={handleBulkDelete}
// // // //               style={{
// // // //                 width: '63px',
// // // //                 height: '31px',
// // // //                 borderRadius: '10px',
// // // //                 background: '#FFFFFF',
// // // //                 border: 'none',
// // // //                 cursor: 'pointer',
// // // //                 opacity: 1,
// // // //                 display: 'flex',
// // // //                 alignItems: 'center',
// // // //                 justifyContent: 'center',
// // // //                 transition: 'all 0.2s ease',
// // // //               }}
// // // //               className="hover:bg-[#FFEBEE] hover:scale-105 transition-all"
// // // //             >
// // // //               <span 
// // // //                 style={{
// // // //                   fontFamily: 'Cairo',
// // // //                   fontWeight: 600,
// // // //                   fontSize: '12px',
// // // //                   lineHeight: '100%',
// // // //                   textAlign: 'center',
// // // //                   color: '#B4B4B9',
// // // //                   display: 'inline-block',
// // // //                 }}
// // // //               >
// // // //                 حذف
// // // //               </span>
// // // //             </button>
// // // //             <button
// // // //               onClick={handleBulkGroupMessage}
// // // //               style={{
// // // //                 width: '102px',
// // // //                 height: '31px',
// // // //                 borderRadius: '10px',
// // // //                 background: '#FFFFFF',
// // // //                 border: 'none',
// // // //                 cursor: 'pointer',
// // // //                 opacity: 1,
// // // //                 display: 'flex',
// // // //                 alignItems: 'center',
// // // //                 justifyContent: 'center',
// // // //                 transition: 'all 0.2s ease',
// // // //               }}
// // // //               className="hover:bg-[#E8F5E9] hover:scale-105 transition-all"
// // // //             >
// // // //               <span 
// // // //                 style={{
// // // //                   fontFamily: 'Cairo',
// // // //                   fontWeight: 600,
// // // //                   fontSize: '12px',
// // // //                   lineHeight: '100%',
// // // //                   textAlign: 'center',
// // // //                   color: '#B4B4B9',
// // // //                   display: 'inline-block',
// // // //                 }}
// // // //               >
// // // //                 رسالة جماعية
// // // //               </span>
// // // //             </button>
// // // //             <button
// // // //               onClick={handleBulkCall}
// // // //               style={{
// // // //                 width: '102px',
// // // //                 height: '31px',
// // // //                 borderRadius: '10px',
// // // //                 background: '#FFFFFF',
// // // //                 border: 'none',
// // // //                 cursor: 'pointer',
// // // //                 opacity: 1,
// // // //                 display: 'flex',
// // // //                 alignItems: 'center',
// // // //                 justifyContent: 'center',
// // // //                 transition: 'all 0.2s ease',
// // // //               }}
// // // //               className="hover:bg-[#E8F4FD] hover:scale-105 transition-all"
// // // //             >
// // // //               <span 
// // // //                 style={{
// // // //                   fontFamily: 'Cairo',
// // // //                   fontWeight: 600,
// // // //                   fontSize: '12px',
// // // //                   lineHeight: '100%',
// // // //                   textAlign: 'center',
// // // //                   color: '#B4B4B9',
// // // //                   display: 'inline-block',
// // // //                 }}
// // // //               >
// // // //                 مكالمة جماعية
// // // //               </span>
// // // //             </button>
// // // //             <button
// // // //               onClick={handleBulkArchive}
// // // //               style={{
// // // //                 width: '63px',
// // // //                 height: '31px',
// // // //                 borderRadius: '10px',
// // // //                 background: '#FFFFFF',
// // // //                 border: 'none',
// // // //                 cursor: 'pointer',
// // // //                 opacity: 1,
// // // //                 display: 'flex',
// // // //                 alignItems: 'center',
// // // //                 justifyContent: 'center',
// // // //                 transition: 'all 0.2s ease',
// // // //               }}
// // // //               className="hover:bg-[#FFF8E1] hover:scale-105 transition-all"
// // // //             >
// // // //               <span 
// // // //                 style={{
// // // //                   fontFamily: 'Cairo',
// // // //                   fontWeight: 600,
// // // //                   fontSize: '12px',
// // // //                   lineHeight: '100%',
// // // //                   textAlign: 'center',
// // // //                   color: '#B4B4B9',
// // // //                   display: 'inline-block',
// // // //                 }}
// // // //               >
// // // //                 مميز
// // // //               </span>
// // // //             </button>
// // // //           </div>

// // // //           <div className="flex items-center justify-between px-2 mt-2">
// // // //             <div className="flex items-center justify-center px-2 mt-2 mb-1 w-full">
// // // //               <span 
// // // //                 style={{
// // // //                   width: '100%',
// // // //                   opacity: 1,
// // // //                   fontFamily: 'Cairo',
// // // //                   fontWeight: 600,
// // // //                   fontSize: '25px',
// // // //                   lineHeight: '100%',
// // // //                   textAlign: 'center',
// // // //                   color: '#000000',
// // // //                   display: 'block'
// // // //                 }}
// // // //               >
// // // //                 تم تحديد {selectedChats.length} محادثة
// // // //               </span>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Search */}
// // // //       <div className="flex items-center justify-center w-full mb-3">
// // // //         <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
// // // //           <Search className="text-[#B6B7B7]"/>
// // // //           <input 
// // // //             type="text" 
// // // //             placeholder=" اكتب هنا ما تريد ان تكتشفه" 
// // // //             className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
// // // //             value={searchTerm}
// // // //             onChange={(e) => setSearchTerm(e.target.value)}
// // // //           />
// // // //           {searchTerm && (
// // // //             <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-sm">
// // // //               ✕
// // // //             </button>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Filters */}
// // // //       <ChatFilters 
// // // //         onFilterChange={handleFilterChange}
// // // //         activeFilter={activeFilter}
// // // //         counts={getFilterCounts}
// // // //       />

// // // //       {/* ================= CALLS BALANCE BAR ================= */}
// // // //       {activeFilter === 'calls' && (
// // // //         <div 
// // // //           className="flex items-center justify-between px-4 -mt-1"
// // // //         >
// // // //           <div className="flex items-center gap-2">
// // // //             <img
// // // //               src="/imgs/fire-emergency-call 1.svg"
// // // //               alt="Call"
// // // //               style={{
// // // //                 width: "12px",
// // // //                 height: "12px",
// // // //               }}
// // // //             />
// // // //             <span
// // // //               style={{
// // // //                 color: "#171717",
// // // //                 fontSize: "12px",
// // // //                 fontFamily: "Cairo",
// // // //                 fontWeight: 600,
// // // //               }}
// // // //             >
// // // //               رصيدك الحالي
// // // //             </span>
// // // //           </div>

// // // //           <div
// // // //             style={{
// // // //               display: "flex",
// // // //               alignItems: "center",
// // // //               gap: "4px",
// // // //             }}
// // // //           >
// // // //             <span
// // // //               style={{
// // // //                 color: "#171717",
// // // //                 fontSize: "12px",
// // // //                 fontWeight: 600,
// // // //                 fontFamily: "Cairo",
// // // //               }}
// // // //             >
// // // //               {callMinutes.free}
// // // //             </span>
// // // //             <span
// // // //               style={{
// // // //                 color: "#8899aa",
// // // //                 fontSize: "14px",
// // // //                 fontFamily: "Cairo",
// // // //                 fontWeight: 400,
// // // //               }}
// // // //             >
// // // //               /
// // // //             </span>
// // // //             <span
// // // //               style={{
// // // //                 color: "#171717",
// // // //                 fontSize: "12px",
// // // //                 fontWeight: 600,
// // // //                 fontFamily: "Cairo",
// // // //               }}
// // // //             >
// // // //               {callMinutes.total}
// // // //             </span>
// // // //             <span
// // // //               style={{
// // // //                 color: "#D72229",
// // // //                 fontSize: "12px",
// // // //                 fontFamily: "Cairo",
// // // //                 fontWeight: 400,
// // // //               }}
// // // //             >
// // // //               دقيقة مجانية
// // // //             </span>
// // // //           </div>
// // // //         </div>
// // // //       )}
      
// // // //       {filterLoading ? (
// // // //         <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
// // // //       ) : (
// // // //         <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
// // // //           {searchedChats.length === 0 && searchTerm.trim() !== '' && (
// // // //             <div className="text-center text-gray-500 py-10">
// // // //               لا توجد محادثات مع <span className="font-bold">"{searchTerm}"</span>
// // // //             </div>
// // // //           )}

// // // //           {searchedChats.length === 0 && searchTerm.trim() === '' && (
// // // //             <div className="text-center text-gray-500 py-10">
// // // //               لا توجد محادثات في هذا القسم
// // // //             </div>
// // // //           )}

// // // //           {searchedChats.map((chat) => {
// // // //             const isLastFromMe = chat.lastMessage?.sender === myUserId;
// // // //             const isMessageSeen = chat.seen === true || chat.lastMessage?.seenBy === true;
// // // //             const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
// // // //             const time = formatMessageTime(chat.lastMessage?.timestamp || '');
// // // //             const isDropdownOpen = openDropdown === chat.chatId;
// // // //             const isSelected = selectedChats.includes(chat.chatId);

// // // //             return (
// // // //               <div
// // // //                 key={chat.chatId}
// // // //                 // className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
// // // //                 //   activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"
// // // //                 // } ${
// // // //                 //   isSelected 
// // // //                 //     ? 'bg-[#FAFAFA] rounded-lg' 
// // // //                 //     : ''
// // // //                 // }`}
// // // //                 className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
// // // //                 activeChatId === chat.chatId ? "active-chat" : "hover:bg-gray-100"
// // // //               } ${
// // // //                 isSelected 
// // // //                   ? 'bg-[#FAFAFA] rounded-lg' 
// // // //                   : ''
// // // //               }`}
// // // //                 dir="ltr"
// // // //                 ref={(el) => {
// // // //                   if (el) {
// // // //                     dropdownRefs.current[chat.chatId] = el;
// // // //                   }
// // // //                 }}
// // // //                 onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
// // // //                 onMouseUp={handleMouseUp}
// // // //                 onMouseLeave={handleMouseLeave}
// // // //               >
// // // //                 {selectionMode && (
// // // //                   <div className="flex-shrink-0">
// // // //                     <img 
// // // //                       src={isSelected ? "/imgs/check (2).svg" : "/imgs/uncheck.svg"} 
// // // //                       alt={isSelected ? "محدد" : "غير محدد"}
// // // //                       onClick={() => toggleChatSelection(chat.chatId)}
// // // //                       style={{
// // // //                         width: '20px',
// // // //                         height: '20px',
// // // //                         opacity: 1,
// // // //                         cursor: 'pointer',
// // // //                       }}
// // // //                     />
// // // //                   </div>
// // // //                 )}

// // // //                 <div 
// // // //                   className="flex items-center gap-3 flex-1"
// // // //                   onClick={() => {
// // // //                     if (selectionMode) {
// // // //                       toggleChatSelection(chat.chatId);
// // // //                     } else {
// // // //                       markChatSeen(chat.chatId);
// // // //                       if (isLastFromMe && chat.lastMessage?._id) {
// // // //                         markMessageAsSeen(chat.lastMessage._id);
// // // //                       }
// // // //                       setChats(prev =>
// // // //                         prev.map(c =>
// // // //                           c.chatId === chat.chatId ? { ...c, unreadCount: 0 } : c
// // // //                         )
// // // //                       );
// // // //                       router.push(`/chats/${chat.chatId}`);
// // // //                     }
// // // //                   }}
// // // //                 >
// // // //                   {chat.isGroup ? (
// // // //                     renderGroupAvatar(chat)
// // // //                   ) : (
// // // //                     <img
// // // //                       src={chat.userinfo?.img || "/imgs/user.png"}
// // // //                       className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
// // // //                       alt={chat.userinfo?.name}
// // // //                       style={{
// // // //                         width: '60px',
// // // //                         height: '60px',
// // // //                         borderRadius: '25px',
// // // //                       }}
// // // //                     />
// // // //                   )}

// // // //                   <div className="flex-1">
// // // //                     <div className="font-medium text-black flex items-center justify-between">
// // // //                       <div className="flex flex-col">
// // // //                         <span className="truncate">
// // // //                           {chat.isGroup ? (
// // // //                             <span className="flex items-center gap-1"   
// // // //                               style={{ fontSize: '18px'}} >
// // // //                               <span>{chat.name}</span>
// // // //                             </span>
// // // //                           ) : (
// // // //                             chat.userinfo?.name
// // // //                           )}
// // // //                         </span>
// // // //                         {chat.isGroup && chat.description && chat.description !== 'no' && (
// // // //                           <span 
// // // //                             className="truncate"
// // // //                             style={{
// // // //                               width: '297px',
// // // //                               height: '23px',
// // // //                               opacity: 1,
// // // //                               fontFamily: 'Cairo',
// // // //                               fontWeight: 400,
// // // //                               fontStyle: 'Regular',
// // // //                               fontSize: '15px',
// // // //                               lineHeight: '100%',
// // // //                               letterSpacing: '0%',
// // // //                               verticalAlign: 'middle',
// // // //                               color: '#000000',
// // // //                               display: 'block',
// // // //                               maxWidth: '150px',
// // // //                               overflow: 'hidden',
// // // //                               textOverflow: 'ellipsis',
// // // //                               whiteSpace: 'nowrap'
// // // //                             }}
// // // //                           >
// // // //                             {chat.description}
// // // //                           </span>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>

// // // //                     <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
// // // //                       {chat.typing ? "يكتب الان ..." : chat.lastMessage?.message || ""}
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>

// // // //                 {!selectionMode && (
// // // //                   <div className="flex flex-col items-center gap-1 mt-6">
// // // //                     <div className="flex items-center gap-1">
// // // //                       <span className="text-[10px] text-gray-400 font-normal whitespace-nowrap">
// // // //                         {time}
// // // //                       </span>
// // // //                       <span className="text-xs flex items-center">
// // // //                         {isMessageSeen ? (
// // // //                           <img 
// // // //                             src="/imgs/read.svg" 
// // // //                             alt="مقروءة" 
// // // //                             style={{
// // // //                               width: '13px',
// // // //                               height: '12px',
// // // //                               opacity: 1,
// // // //                             }}
// // // //                             className="w-[13px] h-[12px]"
// // // //                           />
// // // //                         ) : (
// // // //                           <img 
// // // //                             src="/imgs/unread.svg" 
// // // //                             alt="غير مقروءة"  
// // // //                             style={{
// // // //                               width: '13px',
// // // //                               height: '12px',
// // // //                               opacity: 1,
// // // //                             }}
// // // //                             className="w-[13px] h-[12px]" 
// // // //                           />
// // // //                         )}
// // // //                       </span>
// // // //                     </div>
                    
// // // //                     {chat.isFavorite && (
// // // //                       <img 
// // // //                         src="/imgs/archive (2).svg" 
// // // //                         alt="مؤرشفة" 
// // // //                         className="flex-shrink-0"
// // // //                         style={{ 
// // // //                           width: '13px', 
// // // //                           height: '13px', 
// // // //                           opacity: 1,
// // // //                         }} 
// // // //                       />
// // // //                     )}
                    
// // // //                     {!isLastFromMe && hasUnread && (
// // // //                       <span 
// // // //                         className="text-white text-[10px] font-semibold flex items-center justify-center"
// // // //                         style={{
// // // //                           width: '22px',
// // // //                           height: '15px',
// // // //                           borderRadius: '6px',
// // // //                           background: '#D72229',
// // // //                           fontFamily: 'Cairo',
// // // //                           fontWeight: 600,
// // // //                           fontSize: '10px',
// // // //                           lineHeight: '16px',
// // // //                           textAlign: 'center',
// // // //                           color: '#FFFFFF',
// // // //                         }}
// // // //                       >
// // // //                         {chat.unreadCount}
// // // //                       </span>
// // // //                     )}
                    
// // // //                     <button
// // // //                       onClick={(e) => {
// // // //                         e.stopPropagation();
// // // //                         setOpenDropdown(isDropdownOpen ? null : chat.chatId);
// // // //                       }}
// // // //                       className={`p-1 rounded-full transition-colors ${
// // // //                         isDropdownOpen 
// // // //                           ? 'bg-gray-200' 
// // // //                           : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
// // // //                       }`}
// // // //                     >
// // // //                       <img 
// // // //                         src="/imgs/dropdwnBtn.svg" 
// // // //                         alt="قائمة"
// // // //                         style={{
// // // //                           width: '12px',
// // // //                           height: '6px',
// // // //                           opacity: 1,
// // // //                           transition: 'transform 0.3s ease',
// // // //                           transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
// // // //                         }}
// // // //                       />
// // // //                     </button>

// // // //                     {isDropdownOpen && (
// // // //                       <div 
// // // //                         className="absolute top-full right-2 mt-1 bg-white rounded-lg shadow-lg z-50 py-1 bg-[#F5F5F5]"
// // // //                         style={{
// // // //                           width: '154px',
// // // //                           borderRadius: '8px',
// // // //                           backgroundColor: "#F5F5F5"
// // // //                         }}
// // // //                         onClick={(e) => e.stopPropagation()}
// // // //                       >
// // // //                         <button
// // // //                           onClick={() => handleDropdownAction('block', chat.chatId, chat.chatType)}
// // // //                           className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           style={{
// // // //                             borderBottom: '0.33px solid #3C3C434D',
// // // //                           }}
// // // //                         >
// // // //                           <img 
// // // //                             src={isUserBlocked(chat.chatId) ? "/imgs/block.svg" : "/imgs/block.svg"} 
// // // //                             alt={isUserBlocked(chat.chatId) ? "رفع الحظر" : "حظر"} 
// // // //                             className="w-4 h-4" 
// // // //                             style={{ width: '16px', height: '16px', opacity: 1 }} 
// // // //                           />
// // // //                           <span style={{
// // // //                             fontFamily: 'Cairo',
// // // //                             fontWeight: 600,
// // // //                             fontSize: '15px',
// // // //                             lineHeight: '100%',
// // // //                             textAlign: 'right',
// // // //                             color: isUserBlocked(chat.chatId) ? '#000000' : '#000000',
// // // //                           }}>
// // // //                             {isUserBlocked(chat.chatId) ? 'رفع الحظر' : 'حظر'}
// // // //                           </span>
// // // //                         </button>
                        
// // // //                         <button
// // // //                           onClick={() => handleDropdownAction('report', chat.chatId, chat.chatType)}
// // // //                           className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           style={{
// // // //                             borderBottom: '0.33px solid #3C3C434D',
// // // //                           }}
// // // //                         >
// // // //                           <img src="/imgs/report.svg" alt="إبلاغ" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
// // // //                           <span style={{
// // // //                             fontFamily: 'Cairo',
// // // //                             fontWeight: 600,
// // // //                             fontSize: '15px',
// // // //                             lineHeight: '100%',
// // // //                             textAlign: 'right',
// // // //                             color: '#000000',
// // // //                           }}>إبلاغ</span>
// // // //                         </button>

// // // //                         <button
// // // //                           onClick={() => handleDropdownAction('search', chat.chatId, chat.chatType)}
// // // //                           className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           style={{
// // // //                             borderBottom: '0.33px solid #3C3C434D',
// // // //                           }}
// // // //                         >
// // // //                           <img src="/imgs/search.svg" alt="بحث" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
// // // //                           <span style={{
// // // //                             fontFamily: 'Cairo',
// // // //                             fontWeight: 600,
// // // //                             fontSize: '15px',
// // // //                             lineHeight: '100%',
// // // //                             textAlign: 'right',
// // // //                             color: '#000000',
// // // //                           }}>بحث</span>
// // // //                         </button>
                  
// // // //                         <button
// // // //                           onClick={() => handleDropdownAction('archive', chat.chatId, chat.chatType)}
// // // //                           className="w-full px-2 py-3 text-sm text-gray-700 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           style={{
// // // //                             borderBottom: '0.33px solid #3C3C434D',
// // // //                           }}
// // // //                         >
// // // //                           <img 
// // // //                             src={chat.isFavorite ? "/imgs/archive.svg" : "/imgs/archive.svg"} 
// // // //                             alt={chat.isFavorite ? "ازلة أرشفة" : "أرشفة"} 
// // // //                             className="w-4 h-4" 
// // // //                             style={{ width: '16px', height: '16px', opacity: 1 }} 
// // // //                           />
// // // //                           <span style={{
// // // //                             fontFamily: 'Cairo',
// // // //                             fontWeight: 600,
// // // //                             fontSize: '15px',
// // // //                             lineHeight: '100%',
// // // //                             textAlign: 'right',
// // // //                             color: chat.isFavorite ? '#000000' : '#000000',
// // // //                           }}>
// // // //                             {chat.isFavorite ? 'إزالة أرشفة' : 'أرشفة'}
// // // //                           </span>
// // // //                         </button>
                        
// // // //                         <button
// // // //                           onClick={() => handleDropdownAction('delete', chat.chatId, chat.chatType)}
// // // //                           className="w-full px-2 py-3 text-sm text-red-600 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           style={{
// // // //                             borderBottom: chat.isGroup ? '0.33px solid #3C3C434D' : 'none',
// // // //                           }}
// // // //                         >
// // // //                           <img src="/imgs/delete.svg" alt="حذف" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
// // // //                           <span style={{
// // // //                             fontFamily: 'Cairo',
// // // //                             fontWeight: 600,
// // // //                             fontSize: '15px',
// // // //                             lineHeight: '100%',
// // // //                             textAlign: 'right',
// // // //                             color: '#D72229',
// // // //                           }}>حذف الدردشة</span>
// // // //                         </button>
                        
// // // //                         {chat.isGroup && (
// // // //                           <button
// // // //                             onClick={() => handleDropdownAction('leave', chat.chatId, chat.chatType)}
// // // //                             className="w-full px-2 py-3 text-sm text-red-600 hover:bg-[#FFFFFF] flex items-center justify-between gap-2"
// // // //                           >
// // // //                             <img src="/imgs/leave.svg" alt="خروج" className="w-4 h-4" style={{ width: '16px', height: '16px', opacity: 1 }} />
// // // //                             <span style={{
// // // //                               fontFamily: 'Cairo',
// // // //                               fontWeight: 600,
// // // //                               fontSize: '15px',
// // // //                               lineHeight: '100%',
// // // //                               textAlign: 'right',
// // // //                               color: '#D72229',
// // // //                             }}>خروج</span>
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       )}

// // // //       {/* ================= TRANSFER OWNERSHIP MODAL ================= */}
// // // //       {showTransferModal && selectedGroupId && (
// // // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
// // // //           <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
// // // //             <h3 className="text-xl font-bold mb-4 text-center">تحويل ملكية المجموعة</h3>
// // // //             <p className="text-gray-600 mb-4 text-center">
// // // //               أنت مالك هذه المجموعة. يرجى اختيار عضو لتحويل الملكية إليه قبل المغادرة.
// // // //             </p>
            
// // // //             <div className="mb-4 max-h-60 overflow-y-auto">
// // // //               {chats
// // // //                 .filter(c => {
// // // //                   if (c.chatId === myUserId) return false;
// // // //                   if (c.isGroup) return false;
// // // //                   return true;
// // // //                 })
// // // //                 .map(member => (
// // // //                   <div
// // // //                     key={member.chatId}
// // // //                     onClick={() => setNewOwnerId(member.chatId)}
// // // //                     className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
// // // //                       newOwnerId === member.chatId ? 'bg-red-50 border-2 border-red-500' : 'hover:bg-gray-50'
// // // //                     }`}
// // // //                   >
// // // //                     <img
// // // //                       src={member.userinfo?.img || '/imgs/user.png'}
// // // //                       className="w-10 h-10 rounded-full object-cover"
// // // //                       alt={member.name}
// // // //                     />
// // // //                     <span className="font-medium">{member.name}</span>
// // // //                   </div>
// // // //                 ))}
// // // //             </div>
            
// // // //             {chats.filter(c => c.chatId !== myUserId && !c.isGroup).length === 0 && (
// // // //               <p className="text-center text-gray-500 mb-4">
// // // //                 لا يوجد أعضاء متاحين لتحويل الملكية إليهم
// // // //               </p>
// // // //             )}
            
// // // //             <div className="flex gap-3">
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setShowTransferModal(false);
// // // //                   setSelectedGroupId(null);
// // // //                   setNewOwnerId('');
// // // //                 }}
// // // //                 className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
// // // //               >
// // // //                 إلغاء
// // // //               </button>
// // // //               <button
// // // //                 onClick={() => {
// // // //                   if (newOwnerId && selectedGroupId) {
// // // //                     handleTransferOwnershipAndLeave(newOwnerId);
// // // //                   } else {
// // // //                     toast.error('يرجى اختيار عضو لتحويل الملكية إليه');
// // // //                   }
// // // //                 }}
// // // //                 className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //                 disabled={!newOwnerId}
// // // //               >
// // // //                 تحويل الملكية والمغادرة
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ================= CREATE GROUP MODAL ================= */}
// // // //       {isCreateGroupOpen && ( 
// // // //         <motion.div
// // // //           drag
// // // //           dragMomentum={false}
// // // //           className="fixed w-[20%] z-50 flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing"
// // // //           initial={{
// // // //             x: 0,
// // // //             y: 0,
// // // //           }}
// // // //           style={{
// // // //             top: '130px',
// // // //             left: '18px',
// // // //             direction: 'rtl',
// // // //             borderRadius: '35px',
// // // //           }}
// // // //         >
// // // //           <div className="flex items-center gap-3 mb-4 flex-shrink-0"> 
// // // //             <button 
// // // //               onClick={() => setIsCreateGroupOpen(false)} 
// // // //               className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0" 
// // // //             > 
// // // //               <img  
// // // //                 src="/imgs/close.svg"  
// // // //                 alt="إغلاق" 
// // // //                 style={{ width: '17px', height: '17px', opacity: 1 }} 
// // // //               /> 
// // // //             </button> 
// // // //             <h2 style={{ fontFamily: 'Cairo', fontWeight: 500, fontSize: '25px', lineHeight: '100%', color: '#000000' }}> 
// // // //               انشاء مجموعة 
// // // //             </h2> 
// // // //           </div> 
      
// // // //           <div className="mb-3 flex justify-center gap-1 flex-shrink-0 relative -mx-3"> 
// // // //             <div className="relative inline-block"> 
// // // //               <img 
// // // //                 src={JSON.parse(localStorage.getItem('userData') || '{}').img || '/imgs/user.png'} 
// // // //                 alt="صورة المستخدم" 
// // // //                 className="w-[50px] h-[45px] rounded-[17px] object-cover" 
// // // //                 style={{ filter: 'blur(1px)' }} 
// // // //               /> 
// // // //               <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> 
// // // //                 <img src="/imgs/Groupcamer.svg" alt="كاميرا" style={{ width: '17px', height: '17px', opacity: 1 }} /> 
// // // //               </div> 
// // // //             </div> 
      
// // // //             <input 
// // // //               type="text" 
// // // //               placeholder="اكتب اسم المجموعة" 
// // // //               value={groupName} 
// // // //               maxLength={25} 
// // // //               onChange={(e) => setGroupName(e.target.value)} 
// // // //               style={{ 
// // // //                 width: '100%', 
// // // //                 maxWidth: '402px', 
// // // //                 height: '45px', 
// // // //                 borderRadius: '18px', 
// // // //                 background: '#FFFFFF', 
// // // //                 fontFamily: 'Cairo', 
// // // //                 fontWeight: 600, 
// // // //                 fontSize: '15px', 
// // // //                 padding: '0 15px', 
// // // //                 border: 'none', 
// // // //                 outline: 'none', 
// // // //               }} 
// // // //               className="text-black placeholder-[#B4B4B9]" 
// // // //             /> 
      
// // // //             <span style={{ width: '46px', height: '28px', fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', lineHeight: '100%', color: '#B4B4B9', transform: 'translateY(15px)' }}> 
// // // //               25/{groupName.length} 
// // // //             </span> 
// // // //           </div> 
      
// // // //           <div className="mb-4 flex justify-center flex-shrink-0 -mx-3"> 
// // // //             <div className="flex items-center gap-3 p-3 w-full" style={{ maxWidth: '402px', height: '102px', borderRadius: '18px', background: '#FFFFFF' }}> 
// // // //               <textarea 
// // // //                 placeholder="اكتب الوصف" 
// // // //                 value={groupDescription} 
// // // //                 onChange={(e) => setGroupDescription(e.target.value)} 
// // // //                 style={{ flex: 1, height: '100%', fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', padding: '8px 0', border: 'none', outline: 'none', resize: 'none', background: 'transparent' }} 
// // // //                 className="text-black placeholder-[#B4B4B9]" 
// // // //               /> 
// // // //             </div> 
// // // //           </div> 
      
// // // //           <div className="w-[calc(100%+48px)] -mx-6 shrink-0" style={{ height: '3px', borderTop: '0.33px solid #3C3C434D' }} /> 
      
// // // //           <div className="flex items-center justify-between mb-2 -mx-5 flex-shrink-0"> 
// // // //             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '17px', color: '#000000' }}> 
// // // //               الاعضاء: 
// // // //             </span> 
// // // //             <div className="flex items-center gap-1"> 
// // // //               <button 
// // // //                 onClick={() => setIsMemberSelectionOpen(true)}
// // // //                 className="w-8 h-8 rounded-full bg-[#F2F2F2] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors" 
// // // //               > 
// // // //                 <img src="/imgs/search_mem.svg" alt="بحث" style={{ width: '15px', height: '15px', opacity: 1 }} /> 
// // // //               </button> 
// // // //               <button 
// // // //                 onClick={() => setIsMemberSelectionOpen(true)} 
// // // //                 className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors" 
// // // //               > 
// // // //                 <img src="/imgs/chooseMember.svg" alt="إضافة أعضاء" style={{ width: '16px', height: '16px', opacity: 1 }} /> 
// // // //               </button> 
// // // //             </div> 
// // // //           </div> 
      
// // // //           <div 
// // // //             id="groupSearchInput" 
// // // //             className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0"  
// // // //             style={{ maxWidth: '402px', display: 'none' }} 
// // // //           > 
// // // //             <img src="/imgs/search_mem.svg" alt="بحث" style={{ width: '15px', height: '15px', opacity: 1, marginLeft: '8px' }} /> 
// // // //             <input 
// // // //               type="text" 
// // // //               placeholder="ابحث في الأعضاء..." 
// // // //               value={groupSearchTerm} 
// // // //               onChange={(e) => setGroupSearchTerm(e.target.value)} 
// // // //               className="w-full bg-transparent text-sm focus:outline-none" 
// // // //               style={{ fontFamily: 'Cairo', fontSize: '14px' }} 
// // // //             /> 
// // // //           </div> 
      
// // // //           <div className="flex-1 flex items-center justify-center mb-4 mx-auto w-full" style={{ maxWidth: '402px', minHeight: '150px' }}> 
// // // //             <div className="text-center"> 
// // // //               <img src="/imgs/noMember.svg" alt="لا يوجد أعضاء" className="w-[71px] h-[71px] object-contain mx-auto mb-2" /> 
// // // //             </div> 
// // // //           </div> 
      
// // // //       <div 
// // // //   className="flex justify-center items-center flex-shrink-0" 
// // // //   style={{ 
// // // //     width: 'calc(100% + 48px)', 
// // // //     marginLeft: '-24px', 
// // // //     marginRight: '-24px', 
// // // //     marginBottom: '-24px', 
// // // //     padding: '16px 24px', 
// // // //     background: '#E3E3E366', 
// // // //     backdropFilter: 'blur(35px)', 
// // // //     borderBottomLeftRadius: '35px', 
// // // //     borderBottomRightRadius: '35px', 
// // // //     minHeight: '82px', 
// // // //   }} 
// // // // > 
// // // //   {/* أضف CSS التموّج هنا */}
// // // //   <style jsx>{`
// // // //     .wave {
// // // //       stroke: #D72229;
// // // //       stroke-width: 6;
// // // //       stroke-linecap: round;
// // // //       fill: none;
// // // //       stroke-dasharray: 40 140;
// // // //       animation: dash 1.2s ease-in-out infinite;
// // // //     }

// // // //     .wave2 {
// // // //       animation-delay: 0.15s;
// // // //     }

// // // //     .wave3 {
// // // //       animation-delay: 0.30s;
// // // //     }

// // // //     @keyframes dash {
// // // //       0% {
// // // //         stroke-dashoffset: 40;
// // // //         opacity: 0.2;
// // // //       }
// // // //       50% {
// // // //         stroke-dashoffset: 0;
// // // //         opacity: 1;
// // // //       }
// // // //       100% {
// // // //         stroke-dashoffset: -40;
// // // //         opacity: 0.2;
// // // //       }
// // // //     }
// // // //   `}</style>

// // // //   <button
// // // //     disabled={!groupName.trim() || isSubmittingGroup}
// // // //     onClick={handleCreateGroupSubmit}
// // // //     style={{
// // // //       width: '100%',
// // // //       maxWidth: '285px',
// // // //       height: '50px',
// // // //       borderRadius: '20px',
// // // //       background: isSubmittingGroup ? '#FFF5F5' : '#FFFFFF',
// // // //       fontFamily: 'Cairo',
// // // //       fontWeight: 600,
// // // //       fontSize: '17px',
// // // //       border: isSubmittingGroup ? '1px solid #D72229' : '1px solid #ddd',
// // // //       cursor: !groupName.trim() || isSubmittingGroup ? 'not-allowed' : 'pointer',
// // // //       transition: 'all 0.2s ease',
// // // //       display: 'flex',
// // // //       alignItems: 'center',
// // // //       justifyContent: 'center',
// // // //       opacity: isSubmittingGroup ? 0.85 : 1
// // // //     }}
// // // //     className={`text-black shadow-md ${!isSubmittingGroup && groupName.trim() ? 'hover:bg-gray-50' : ''}`}
// // // //   >
// // // //     {isSubmittingGroup ? (
// // // //       <svg
// // // //         width="80"
// // // //         height="30"
// // // //         viewBox="0 0 120 36"
// // // //         className="block mx-auto"
// // // //       >
// // // //         <path className="wave wave1" d="M5 18 Q 11 6 17 18" />
// // // //         <path
// // // //           className="wave wave2"
// // // //           d="M5 18 Q 11 6 17 18"
// // // //           transform="translate(26,0)"
// // // //         />
// // // //         <path
// // // //           className="wave wave3"
// // // //           d="M5 18 Q 11 6 17 18"
// // // //           transform="translate(52,0)"
// // // //         />
// // // //       </svg>
// // // //     ) : (
// // // //       'انشاء مجموعة'
// // // //     )}
// // // //   </button>
// // // // </div>
// // // //           {/* <div 
// // // //             className="flex justify-center items-center flex-shrink-0" 
// // // //             style={{ 
// // // //               width: 'calc(100% + 48px)', 
// // // //               marginLeft: '-24px', 
// // // //               marginRight: '-24px', 
// // // //               marginBottom: '-24px', 
// // // //               padding: '16px 24px', 
// // // //               background: '#E3E3E366', 
// // // //               backdropFilter: 'blur(35px)', 
// // // //               borderBottomLeftRadius: '35px', 
// // // //               borderBottomRightRadius: '35px', 
// // // //               minHeight: '82px', 
// // // //             }} 
// // // //           > 
// // // //             <button 
// // // //               disabled={!groupName.trim() || isSubmittingGroup} 
// // // //               onClick={handleCreateGroupSubmit} 
// // // //               style={{ 
// // // //                 width: '100%', 
// // // //                 maxWidth: '285px', 
// // // //                 height: '50px', 
// // // //                 borderRadius: '20px', 
// // // //                 background: '#FFFFFF', 
// // // //                 fontFamily: 'Cairo', 
// // // //                 fontWeight: 600, 
// // // //                 fontSize: '17px', 
// // // //                 border: '1px solid #ddd', 
// // // //                 cursor: !groupName.trim() ? 'not-allowed' : 'pointer', 
// // // //                 transition: 'all 0.2s ease' 
// // // //               }} 
// // // //               className="text-black shadow-md hover:bg-gray-50" 
// // // //             > 
// // // //               {isSubmittingGroup ? 'جاري الإنشاء...' : 'انشاء مجموعة'} 
// // // //             </button> 
// // // //           </div>  */}
// // // //         </motion.div> 
// // // //       )}

// // // //       {/* ================= MODAL اختيار الأعضاء ================= */}
// // // //       {isMemberSelectionOpen && (
// // // //         <motion.div
// // // //           drag
// // // //           dragMomentum={false}
// // // //           className="fixed top-[130px] bottom-0 left-[18px] w-[20%] z-[60] flex flex-col p-6 bg-[#F5F5F5] cursor-grab active:cursor-grabbing"
// // // //           style={{
// // // //             direction: "rtl",
// // // //             borderRadius: "35px",
// // // //           }}
// // // //         >
// // // //           <div className="flex items-center gap-2 mb-4 flex-shrink-0">
// // // //             <button
// // // //               onClick={() => setIsMemberSelectionOpen(false)}
// // // //               className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors p-0"
// // // //             >
// // // //               <img 
// // // //                 src="/imgs/returnPage.svg" 
// // // //                 alt="returnPage"
// // // //                 style={{
// // // //                   width: '17px',
// // // //                   height: '17px',
// // // //                   opacity: 1,
// // // //                 }}
// // // //               />
// // // //             </button>
// // // //             <h2
// // // //               style={{
// // // //                 fontFamily: 'Cairo',
// // // //                 fontWeight: 500,
// // // //                 fontSize: '25px',
// // // //                 lineHeight: '100%',
// // // //                 color: '#000000'
// // // //               }}
// // // //             >
// // // //               اضافة اشخاص
// // // //             </h2>
// // // //           </div>

// // // //           <div className="flex items-center bg-white rounded-xl px-3 py-2 mb-3 shadow-sm mx-auto w-full flex-shrink-0" style={{ maxWidth: '402px' }}>
// // // //             <Search className="text-[#B6B7B7] w-4 h-4 ml-2" />
// // // //             <input
// // // //               type="text"
// // // //               placeholder="ابحث عن اسم شخص..."
// // // //               value={groupSearchTerm}
// // // //               onChange={(e) => setGroupSearchTerm(e.target.value)}
// // // //               className="w-full bg-transparent text-sm focus:outline-none"
// // // //               style={{
// // // //                 fontFamily: 'Cairo',
// // // //                 fontSize: '14px'
// // // //               }}
// // // //             />
// // // //           </div>

// // // //           <div className="flex items-center justify-between px-2 mb-3">
// // // //             <div className="flex items-center gap-1">
// // // //               <img
// // // //                 src='/imgs/addperson.svg'
// // // //                 alt="صورة المستخدم"
// // // //                 className="w-[13px] h-[13px] object-cover"
// // // //               />
// // // //               <span className="text-sm font-semibold text-black">
// // // //                 عدد الاعضاء 
// // // //               </span>
// // // //             </div>

// // // //             <div className="flex items-center gap-1">
// // // //               <span className="text-sm ">
// // // //                 {selectedMembers.length}
// // // //               </span>
// // // //               <span className="text-sm text-gray-500">
// // // //                 الأشخاص
// // // //               </span>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4 mx-auto w-full" style={{ maxWidth: '402px', minHeight: '150px' }}>
// // // //             {(() => {
// // // //               const individualUsers = chats.filter(c => !c.isGroup);
// // // //               const filteredUsers = individualUsers.filter(c => 
// // // //                 c.name.toLowerCase().includes(groupSearchTerm.toLowerCase().trim())
// // // //               );

// // // //               if (individualUsers.length === 0) {
// // // //                 return (
// // // //                   <div className="flex-1 flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
// // // //                     <div className="text-center">
// // // //                       <div className="text-5xl mb-3">👤</div>
// // // //                       <p className="text-xl font-semibold text-gray-600">لا يوجد أعضاء</p>
// // // //                       <p className="text-sm text-gray-400 mt-1">ليس لديك أي محادثات مع أفراد</p>
// // // //                     </div>
// // // //                   </div>
// // // //                 );
// // // //               }

// // // //               if (filteredUsers.length === 0 && groupSearchTerm.trim() !== '') {
// // // //                 return (
// // // //                   <div
// // // //                     className="flex-1 flex items-center justify-center h-full"
// // // //                     style={{ minHeight: '71px' }}
// // // //                   >
// // // //                     <div className="text-center">
// // // //                       <img
// // // //                         src="/imgs/noMember.svg"
// // // //                         alt="لا توجد نتائج"
// // // //                         className="w-[71px] h-[71px] object-contain mx-auto"
// // // //                       />
// // // //                     </div>
// // // //                   </div>
// // // //                 );
// // // //               }

// // // //               return filteredUsers.map((chat) => {
// // // //                 const isChecked = selectedMembers.includes(chat.chatId);
// // // //                 const isAdmin = tempAdmins.includes(chat.chatId);
// // // //                 const isLoading = isAdminLoading[chat.chatId] || false;

// // // //                 return (
// // // //                   <div
// // // //                     key={chat.chatId}
// // // //                     onClick={() => toggleMemberSelection(chat.chatId)}
// // // //                     className={`flex items-center justify-between px-2 py-3 rounded-2xl cursor-pointer transition-all  ${
// // // //                       isChecked 
// // // //                         ? 'border-2 border-[#D72229] shadow-sm' 
// // // //                         : 'border-2 border-transparent hover:bg-gray-50'
// // // //                     }`}
// // // //                   >
// // // //                     <div className="flex items-center gap-3">
// // // //                       <img
// // // //                         src={chat.userinfo?.img || "/imgs/user.png"}
// // // //                         className="w-10 h-10 rounded-full object-cover"
// // // //                         alt={chat.name}
// // // //                       />
// // // //                       <span className="text-sm font-semibold text-black">{chat.name}</span>
// // // //                     </div>

// // // //                     <div
// // // //                       onClick={(e) => toggleAdminStatus(chat.chatId, e)}
// // // //                       className={`w-[30px] h-[30px] rounded-[20px] bg-white backdrop-blur-[4px] flex items-center justify-center shadow-sm transition-all ${
// // // //                         isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-gray-100 cursor-pointer'
// // // //                       }`}
// // // //                     >
// // // //                       {isLoading ? (
// // // //                         <div className="w-3 h-3 border-2 border-[#D72229] border-t-transparent rounded-full animate-spin" />
// // // //                       ) : (
// // // //                         <img
// // // //                           src={isAdmin ? "/imgs/admin (2).svg" : "/imgs/noAdmin (2).svg"}
// // // //                           alt={isAdmin ? "Admin" : "Not Admin"}
// // // //                           className="w-[12px] h-[13px] object-contain"
// // // //                         />
// // // //                       )}
// // // //                     </div>
// // // //                   </div>
// // // //                 );
// // // //               });
// // // //             })()}
// // // //           </div>

// // // //           {/* {tempAdmins.length > 0 && (
// // // //             <div className="text-center text-sm text-[#D72229] font-semibold mb-2">
// // // //                {tempAdmins.length} مشرفين تم تعيينهم
// // // //             </div>
// // // //           )} */}

// // // //           <div
// // // //             className="flex justify-center items-center flex-shrink-0"
// // // //             style={{
// // // //               width: 'calc(100% + 48px)',
// // // //               marginLeft: '-24px',
// // // //               marginRight: '-24px',
// // // //               marginBottom: '-24px',
// // // //               padding: '16px 24px',
// // // //               background: '#E3E3E366',
// // // //               backdropFilter: 'blur(35px)',
// // // //               borderBottomLeftRadius: '35px',
// // // //               borderBottomRightRadius: '35px',
// // // //               minHeight: '82px',
// // // //             }}
// // // //           >
// // // //             <button
// // // //               onClick={() => setIsMemberSelectionOpen(false)}
// // // //               style={{
// // // //                 width: '100%',
// // // //                 maxWidth: '285px',
// // // //                 height: '50px',
// // // //                 borderRadius: '20px',
// // // //                 background: '#FFFFFF',
// // // //                 fontFamily: 'Cairo',
// // // //                 fontWeight: 600,
// // // //                 fontSize: '17px',
// // // //                 border: 'none',
// // // //                 cursor: 'pointer',
// // // //                 transition: 'all 0.2s ease',
// // // //                 color: '#000000',
// // // //               }}
// // // //               className="hover:bg-[#b01d23] shadow-md"
// // // //             >
// // // //               اضافة الاعضاء
// // // //             </button>
// // // //           </div>
// // // //         </motion.div>
// // // //       )}

// // // //       {/* ================= REPORT REASONS MODAL ================= */}
// // // //       {showReportModal && (
// // // //         <div
// // // //           className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 transition-all duration-200"
// // // //           onClick={handleCloseReportModal}
// // // //         >
// // // //           <div
// // // //             className="relative flex flex-col text-right"
// // // //             style={{
// // // //               width: "690px",
// // // //               maxHeight: "90vh",
// // // //               height: "auto",
// // // //               borderRadius: "25px",
// // // //               background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
// // // //               backdropFilter: "blur(30px)",
// // // //               boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
// // // //             }}
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           >
// // // //             <button
// // // //               onClick={handleCloseReportModal}
// // // //               className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
// // // //               aria-label="إغلاق"
// // // //             >
// // // //               <svg
// // // //                 xmlns="http://www.w3.org/2000/svg"
// // // //                 className="h-6 w-6"
// // // //                 fill="none"
// // // //                 viewBox="0 0 24 24"
// // // //                 stroke="currentColor"
// // // //                 strokeWidth={2}
// // // //               >
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// // // //               </svg>
// // // //             </button>

// // // //             <div
// // // //               className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
// // // //               style={{
// // // //                 fontSize: "20px",
// // // //                 lineHeight: "100%",
// // // //                 background: "#FFFFFF40",
// // // //                 backdropFilter: "blur(10px)",
// // // //                 borderTopLeftRadius: "25px",
// // // //                 borderTopRightRadius: "25px",
// // // //                 textAlign: "right",
// // // //               }}
// // // //             >
// // // //               الإبلاغ عن مستخدم
// // // //             </div>

// // // //             <div
// // // //               className="w-full flex items-center justify-center flex-shrink-0"
// // // //               style={{ minHeight: "47px" }}
// // // //             >
// // // //               <p
// // // //                 className="text-black text-center"
// // // //                 style={{
// // // //                   fontSize: "25px",
// // // //                   fontWeight: 500,
// // // //                   lineHeight: "100%",
// // // //                   padding: "30px 0 12px",
// // // //                 }}
// // // //               >
// // // //                 لماذا تريد الإبلاغ عن هذا المستخدم؟
// // // //               </p>
// // // //             </div>

// // // //             <div
// // // //               className="mt-6 w-full px-8 space-y-4 flex-1"
// // // //               style={{
// // // //                 overflowY: "scroll",
// // // //                 scrollbarWidth: "none",
// // // //                 msOverflowStyle: "none",
// // // //                 maxHeight: "calc(90vh - 200px)",
// // // //               }}
// // // //             >
// // // //               {reportReasons.map((reason) => (
// // // //                 <div
// // // //                   key={reason.id}
// // // //                   onClick={() => !isReporting && handleReasonSelect(reason.label)}
// // // //                   className={`flex items-center gap-3 cursor-pointer group transition-all hover:bg-white/20 rounded-[19px] ${
// // // //                     isReporting ? "opacity-50 pointer-events-none" : ""
// // // //                   }`}
// // // //                   style={{
// // // //                     width: "100%",
// // // //                     height: "66px",
// // // //                     borderRadius: "19px",
// // // //                     border: "1px solid #A1A1A1",
// // // //                     padding: "0 16px",
// // // //                   }}
// // // //                 >
// // // //                   <div
// // // //                     className="flex items-center justify-center flex-shrink-0"
// // // //                     style={{
// // // //                       width: "45px",
// // // //                       height: "45px",
// // // //                       backgroundColor: "#A1A1A1",
// // // //                       borderRadius: "50%",
// // // //                     }}
// // // //                   >
// // // //                     <img
// // // //                       src="/imgs/Vector (6).svg"
// // // //                       alt="report icon"
// // // //                       style={{
// // // //                         width: "18px",
// // // //                         height: "20px",
// // // //                         objectFit: "contain",
// // // //                       }}
// // // //                     />
// // // //                   </div>
// // // //                   <span
// // // //                     className="text-black flex-1"
// // // //                     style={{
// // // //                       fontSize: "18px",
// // // //                       fontWeight: 400,
// // // //                       lineHeight: "100%",
// // // //                       textAlign: "right",
// // // //                     }}
// // // //                   >
// // // //                     {reason.label}
// // // //                   </span>
// // // //                   <img
// // // //                     src="/imgs/Group 6836.svg"
// // // //                     alt="arrow"
// // // //                     style={{
// // // //                       width: "6.5px",
// // // //                       height: "13px",
// // // //                       objectFit: "contain",
// // // //                     }}
// // // //                   />
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //             <div className="h-4 flex-shrink-0"></div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ================= REPORT SUCCESS MODAL ================= */}
// // // //       {showReportSuccess && (
// // // //         <div
// // // //           className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
// // // //           onClick={handleCloseSuccessModal}
// // // //         >
// // // //           <div
// // // //             className="relative flex flex-col items-center text-center"
// // // //             style={{
// // // //               width: "690px",
// // // //               height: "341px",
// // // //               borderRadius: "25px",
// // // //               background: "linear-gradient(270deg, #FFFFFF 0%, #8D8D8D 79.81%)",
// // // //               backdropFilter: "blur(30px)",
// // // //               boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
// // // //             }}
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           >
// // // //             <h2
// // // //               className="w-full h-[55px] flex items-center px-6 text-black font-semibold flex-shrink-0"
// // // //               style={{
// // // //                 fontSize: "20px",
// // // //                 lineHeight: "100%",
// // // //                 background: "#FFFFFF40",
// // // //                 backdropFilter: "blur(10px)",
// // // //                 borderTopLeftRadius: "25px",
// // // //                 borderTopRightRadius: "25px",
// // // //               }}
// // // //             >
// // // //               تم الإبلاغ
// // // //             </h2>

// // // //             <div className="text-right w-full flex-1 flex flex-col justify-center items-center">
// // // //               <div className="text-center">
// // // //                 <p
// // // //                   className="text-black mb-3 mt-4"
// // // //                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
// // // //                 >
// // // //                   شكراً لك على إبلاغك
// // // //                 </p>
// // // //                 <p
// // // //                   className="text-black"
// // // //                   style={{ fontSize: "25px", fontWeight: 400, lineHeight: "1.4" }}
// // // //                 >
// // // //                   سيتم مراجعة البلاغ في أقرب وقت
// // // //                 </p>
// // // //               </div>
// // // //               <hr
// // // //                 style={{
// // // //                   width: "100%",
// // // //                   border: "1px solid #70707080",
// // // //                   marginTop: "20px",
// // // //                 }}
// // // //               />
// // // //             </div>

// // // //             <button
// // // //               onClick={handleCloseSuccessModal}
// // // //               className="mt-6 mb-6 bg-black text-white font-semibold rounded-[23px] hover:bg-gray-800 transition-colors flex-shrink-0"
// // // //               style={{
// // // //                 width: "300px",
// // // //                 height: "60px",
// // // //                 fontSize: "20px",
// // // //                 fontWeight: 600,
// // // //                 lineHeight: "100%",
// // // //                 borderRadius: "23px",
// // // //               }}
// // // //             >
// // // //               إغلاق
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ================= CALL MODAL ================= */}
// // // //       {isCallModalOpen && selectedCallChatId && (
// // // //         <div
// // // //           className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 backdrop-blur-md"
// // // //           onClick={handleCloseCallModal}
// // // //         >
// // // //           <div
// // // //             className="relative flex flex-col items-center"
// // // //             style={{
// // // //               width: "400px",
// // // //               maxWidth: "90vw",
// // // //               borderRadius: "30px",
// // // //               background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
// // // //               padding: "30px 20px 25px",
// // // //               boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
// // // //             }}
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           >
// // // //             <button
// // // //               onClick={handleCloseCallModal}
// // // //               className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
// // // //             >
// // // //               <svg
// // // //                 xmlns="http://www.w3.org/2000/svg"
// // // //                 className="h-6 w-6"
// // // //                 fill="none"
// // // //                 viewBox="0 0 24 24"
// // // //                 stroke="currentColor"
// // // //                 strokeWidth={2}
// // // //               >
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// // // //               </svg>
// // // //             </button>

// // // //             <div
// // // //               className="flex items-center justify-center mb-4"
// // // //               style={{
// // // //                 width: "100px",
// // // //                 height: "100px",
// // // //                 borderRadius: "50%",
// // // //                 background: "linear-gradient(135deg, #e94560, #c23152)",
// // // //                 boxShadow: "0 0 40px rgba(233, 69, 96, 0.3)",
// // // //               }}
// // // //             >
// // // //               <img
// // // //                 src="/imgs/fire-emergency-call-1.svg"
// // // //                 alt="Call"
// // // //                 style={{
// // // //                   width: "55px",
// // // //                   height: "55px",
// // // //                   filter: "brightness(0) invert(1)",
// // // //                 }}
// // // //               />
// // // //             </div>

// // // //             <h3
// // // //               className="text-white font-bold mb-1"
// // // //               style={{
// // // //                 fontSize: "24px",
// // // //                 fontFamily: "Cairo",
// // // //               }}
// // // //             >
// // // //               {chats.find(c => c.chatId === selectedCallChatId)?.name || "مستخدم"}
// // // //             </h3>

// // // //             <div
// // // //               className="flex items-center justify-between w-full px-4 py-2 mb-4"
// // // //               style={{
// // // //                 background: "rgba(255,255,255,0.08)",
// // // //                 borderRadius: "15px",
// // // //                 border: "1px solid rgba(255,255,255,0.1)",
// // // //               }}
// // // //             >
// // // //               <span
// // // //                 style={{
// // // //                   color: "#8899aa",
// // // //                   fontSize: "14px",
// // // //                   fontFamily: "Cairo",
// // // //                 }}
// // // //               >
// // // //                 رصيدك الحالي
// // // //               </span>
// // // //               <span
// // // //                 style={{
// // // //                   color: "#4fc3f7",
// // // //                   fontSize: "16px",
// // // //                   fontWeight: 600,
// // // //                   fontFamily: "Cairo",
// // // //                 }}
// // // //               >
// // // //                 {callMinutes.free} / {callMinutes.total} دقيقة مجانية
// // // //               </span>
// // // //             </div>

// // // //             <div className="flex items-center gap-4 w-full">
// // // //               <button
// // // //                 onClick={() => handleStartCall('audio')}
// // // //                 disabled={callMinutes.free <= 0}
// // // //                 className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
// // // //                 style={{
// // // //                   background: callMinutes.free > 0 
// // // //                     ? "linear-gradient(135deg, #4caf50, #388e3c)" 
// // // //                     : "rgba(255,255,255,0.1)",
// // // //                   color: callMinutes.free > 0 ? "#fff" : "#666",
// // // //                   cursor: callMinutes.free > 0 ? "pointer" : "not-allowed",
// // // //                   border: "none",
// // // //                 }}
// // // //               >
// // // //                 <Phone size={18} />
// // // //                 <span style={{ fontFamily: "Cairo", fontWeight: 600, fontSize: "15px" }}>
// // // //                   مكالمة صوتية
// // // //                 </span>
// // // //               </button>

// // // //               <button
// // // //                 onClick={() => handleStartCall('video')}
// // // //                 disabled={callMinutes.free <= 0}
// // // //                 className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
// // // //                 style={{
// // // //                   background: callMinutes.free > 0 
// // // //                     ? "linear-gradient(135deg, #e94560, #c23152)" 
// // // //                     : "rgba(255,255,255,0.1)",
// // // //                   color: callMinutes.free > 0 ? "#fff" : "#666",
// // // //                   cursor: callMinutes.free > 0 ? "pointer" : "not-allowed",
// // // //                   border: "none",
// // // //                 }}
// // // //               >
// // // //                 <Video size={18} />
// // // //                 <span style={{ fontFamily: "Cairo", fontWeight: 600, fontSize: "15px" }}>
// // // //                   مكالمة مرئية
// // // //                 </span>
// // // //               </button>
// // // //             </div>

// // // //             {callMinutes.free <= 0 && (
// // // //               <p
// // // //                 className="mt-3 text-center"
// // // //                 style={{
// // // //                   color: "#ff6b6b",
// // // //                   fontSize: "13px",
// // // //                   fontFamily: "Cairo",
// // // //                 }}
// // // //               >
// // // //                  رصيد الدقائق المجانية منتهي
// // // //               </p>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


 


// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ////////////////////////////////////


// // // src/app/chats/_components/ChatList.tsx
// // /* eslint-disable @next/next/no-img-element */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useRouter, usePathname } from 'next/navigation';
// // import { Search } from 'lucide-react';

// // import ChatFilters from './ChatFilters';
// // import { useChats } from './hooks/useChats';
// // import { useCalls } from './hooks/useCalls';
// // import { useSelectionMode } from './hooks/useSelectionMode';
// // import { useDropdown } from './hooks/useDropdown';
// // import { useBlockedUsers } from './hooks/useBlockedUsers';

// // import CallModal from './components/calls/CallModal';
// // import CallInterface from './components/calls/CallInterface';

// // import { formatMessageTime } from './utils/formatTime';
// // import { FilterType } from './types';
// // import { useCallContext } from '@/contexts/CallContext';


// // type Props = {
// //   userId?: string | null;
// //   apiBase: string;
// //   activeChatId?: string | null;
// // };

// // export default function ChatList({ userId: propUserId, apiBase, activeChatId: propActiveChatId }: Props) {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const activeChatId = propActiveChatId || pathname?.split('/').pop();

// //   const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
// //   const [myUserId, setMyUserId] = useState<string>(propUserId || '');

// //   useEffect(() => {
// //     if (propUserId) {
// //       setMyUserId(propUserId);
// //       return;
// //     }
// //     const raw = localStorage.getItem('userData');
// //     if (!raw) return;
// //     try {
// //       const parsed = JSON.parse(raw);
// //       setMyUserId(parsed._id || parsed.id || '');
// //     } catch {}
// //   }, [propUserId]);

// //   // Hooks
// //   const {
// //     chats,
// //     searchedChats,
// //     loading,
// //     filterLoading,
// //     searchTerm,
// //     setSearchTerm,
// //     activeFilter,
// //     handleFilterChange,
// //     getFilterCounts,
// //     markMessageAsSeen,
// //     updateChat,
// //     removeChats,
// //   } = useChats({ myUserId, apiBase, token });

// //   const {
// //     callMinutes,
// //     isCallModalOpen,
// //     selectedCallChatId,
// //     activeCall,
// //     isStarting,
// //     openCallModal,
// //     closeCallModal,
// //     startCall,
// //     endCall,
// //   } = useCalls({ apiBase, token });

// //   const {
// //     selectionMode,
// //     selectedChats,
// //     toggleChatSelection,
// //     clearSelection,
// //     handleMouseDown,
// //     handleMouseUp,
// //     handleMouseLeave,
// //   } = useSelectionMode();

// //   const { openDropdown, setOpenDropdown, setRef } = useDropdown();
// //   const { isUserBlocked } = useBlockedUsers({ apiBase, token });

// //   // Modals (يمكن لاحقاً نقلها إلى مكونات منفصلة)
// //   const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

// //   const userName = (() => {
// //     try {
// //       const data = JSON.parse(localStorage.getItem('userData') || '{}');
// //       return data.name || data.username || 'User';
// //     } catch {
// //       return 'User';
// //     }
// //   })();

// //   const selectedCallChat = chats.find((c) => c.chatId === selectedCallChatId);

// //   const getSectionTitle = () => {
// //     if (selectionMode) return '';
// //     switch (activeFilter) {
// //       case 'all': return 'قسم الرسائل العام';
// //       case 'read': return 'قسم الرسائل المقروء';
// //       case 'unread': return 'قسم الرسائل غير المقروء';
// //       case 'starred': return 'قسم الرسائل المميزة';
// //       case 'groups': return 'قسم المجموعات';
// //       case 'calls': return 'قسم المكالمات';
// //       default: return 'قسم الرسائل العام';
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     removeChats(selectedChats);
// //     clearSelection();
// //   };

// //   const handleBulkArchive = async () => {
// //     // TODO: أضف منطق الأرشفة
// //     clearSelection();
// //   };

// //   const handleBulkCall = () => {
// //     clearSelection();
// //   };

// //   const handleBulkGroupMessage = () => {
// //     clearSelection();
// //   };

// //   if (loading) return <div className="p-4 text-center">جارٍ التحميل...</div>;

// //   return (
// //     <div className="relative h-full flex flex-col">
// //       {/* ===== واجهة MediaSFU ===== */}
// //       {activeCall && (
// //         <CallInterface
// //           activeCall={activeCall}
// //           apiBase={apiBase}
// //           token={token}
// //           userName={userName}
// //           onClose={endCall}
// //         />
// //       )}

// //       {/* ===== Header ===== */}
// //       <div className="flex items-center justify-between px-4 mb-5">
// //         <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
// //           {getSectionTitle()}
// //         </h1>
// //         {!selectionMode && (
// //           <button
// //             onClick={() => setIsCreateGroupOpen(true)}
// //             className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
// //             aria-label="إنشاء مجموعة"
// //           >
// //             <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
// //           </button>
// //         )}
// //       </div>

// //       {/* ===== Selection Toolbar ===== */}
// //       {selectionMode && selectedChats.length > 0 && (
// //         <div className="w-full px-4 mb-3 -mt-10" style={{
// //           background: 'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
// //           paddingTop: '8px',
// //           paddingBottom: '8px',
// //         }}>
// //           <div className="flex items-center justify-center gap-2 mt-[30px]">
// //             <button onClick={handleBulkDelete} className="hover:bg-[#FFEBEE] hover:scale-105 transition-all" style={{ width: '63px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>حذف</span>
// //             </button>
// //             <button onClick={handleBulkGroupMessage} className="hover:bg-[#E8F5E9] hover:scale-105 transition-all" style={{ width: '102px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>رسالة جماعية</span>
// //             </button>
// //             <button onClick={handleBulkCall} className="hover:bg-[#E8F4FD] hover:scale-105 transition-all" style={{ width: '102px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>مكالمة جماعية</span>
// //             </button>
// //             <button onClick={handleBulkArchive} className="hover:bg-[#FFF8E1] hover:scale-105 transition-all" style={{ width: '63px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>مميز</span>
// //             </button>
// //           </div>
// //           <div className="text-center mt-2">
// //             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '25px', color: '#000' }}>
// //               تم تحديد {selectedChats.length} محادثة
// //             </span>
// //           </div>
// //         </div>
// //       )}

// //       {/* ===== Search ===== */}
// //       <div className="flex items-center justify-center w-full mb-3">
// //         <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
// //           <Search className="text-[#B6B7B7]" />
// //           <input
// //             type="text"
// //             placeholder=" اكتب هنا ما تريد ان تكتشفه"
// //             className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //           {searchTerm && (
// //             <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
// //           )}
// //         </div>
// //       </div>

// //       {/* ===== Filters ===== */}
// //       <ChatFilters
// //         onFilterChange={handleFilterChange as any}
// //         activeFilter={activeFilter as any}
// //         counts={getFilterCounts as any}
// //       />

// //       {/* ===== Calls Balance ===== */}
// //       {activeFilter === 'calls' && (
// //         <div className="flex items-center justify-between px-4 -mt-1">
// //           <div className="flex items-center gap-2">
// //             <img src="/imgs/fire-emergency-call 1.svg" alt="Call" style={{ width: '12px', height: '12px' }} />
// //             <span style={{ color: '#171717', fontSize: '12px', fontFamily: 'Cairo', fontWeight: 600 }}>رصيدك الحالي</span>
// //           </div>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
// //             <span style={{ color: '#171717', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo' }}>{callMinutes.free}</span>
// //             <span style={{ color: '#8899aa', fontSize: '14px', fontFamily: 'Cairo' }}>/</span>
// //             <span style={{ color: '#171717', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo' }}>{callMinutes.total}</span>
// //             <span style={{ color: '#D72229', fontSize: '12px', fontFamily: 'Cairo' }}>دقيقة مجانية</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* ===== Chat List ===== */}
// //       {filterLoading ? (
// //         <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
// //       ) : (
// //         <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
// //           {searchedChats.length === 0 && (
// //             <div className="text-center text-gray-500 py-10">
// //               {searchTerm.trim() !== '' ? `لا توجد محادثات مع "${searchTerm}"` : 'لا توجد محادثات في هذا القسم'}
// //             </div>
// //           )}

// //           {searchedChats.map((chat) => {
// //             const isLastFromMe = chat.lastMessage?.sender === myUserId;
// //             const isMessageSeen = chat.seen === true || chat.lastMessage?.seenBy === true;
// //             const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
// //             const time = formatMessageTime(chat.lastMessage?.timestamp || '');
// //             const isDropdownOpen = openDropdown === chat.chatId;
// //             const isSelected = selectedChats.includes(chat.chatId);

// //             return (
// //               <div
// //                 key={chat.chatId}
// //                 className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
// //                   activeChatId === chat.chatId ? 'active-chat' : 'hover:bg-gray-100'
// //                 } ${isSelected ? 'bg-[#FAFAFA] rounded-lg' : ''}`}
// //                 dir="ltr"
// //                 ref={(el) => setRef(chat.chatId, el)}
// //                 onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
// //                 onMouseUp={handleMouseUp}
// //                 onMouseLeave={handleMouseLeave}
// //               >
// //                 {selectionMode && (
// //                   <div className="flex-shrink-0">
// //                     <img
// //                       src={isSelected ? '/imgs/check (2).svg' : '/imgs/uncheck.svg'}
// //                       alt={isSelected ? 'محدد' : 'غير محدد'}
// //                       onClick={() => toggleChatSelection(chat.chatId)}
// //                       style={{ width: '20px', height: '20px', cursor: 'pointer' }}
// //                     />
// //                   </div>
// //                 )}

// //                 <div
// //                   className="flex items-center gap-3 flex-1"
// //                   onClick={() => {
// //                     if (selectionMode) {
// //                       toggleChatSelection(chat.chatId);
// //                     } else {
// //                       if (isLastFromMe && chat.lastMessage?._id) {
// //                         markMessageAsSeen(chat.lastMessage._id);
// //                       }
// //                       updateChat(chat.chatId, { unreadCount: 0 } as any);
// //                       router.push(`/chats/${chat.chatId}`);
// //                     }
// //                   }}
// //                 >
// //                   <img
// //                     src={chat.userinfo?.img || '/imgs/user.png'}
// //                     className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
// //                     alt={chat.userinfo?.name}
// //                   />

// //                   <div className="flex-1">
// //                     <div className="font-medium text-black">
// //                       <span className="truncate">{chat.userinfo?.name}</span>
// //                     </div>
// //                     <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
// //                       {chat.typing ? 'يكتب الان ...' : chat.lastMessage?.message || ''}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {!selectionMode && (
// //                   <div className="flex flex-col items-center gap-1 mt-6">
// //                     <div className="flex items-center gap-1">
// //                       <span className="text-[10px] text-gray-400">{time}</span>
// //                       <img
// //                         src={isMessageSeen ? '/imgs/read.svg' : '/imgs/unread.svg'}
// //                         alt={isMessageSeen ? 'مقروءة' : 'غير مقروءة'}
// //                         style={{ width: '13px', height: '12px' }}
// //                       />
// //                     </div>

// //                     {!isLastFromMe && hasUnread && (
// //                       <span
// //                         className="text-white text-[10px] font-semibold flex items-center justify-center"
// //                         style={{
// //                           width: '22px',
// //                           height: '15px',
// //                           borderRadius: '6px',
// //                           background: '#D72229',
// //                           fontFamily: 'Cairo',
// //                           fontSize: '10px',
// //                         }}
// //                       >
// //                         {chat.unreadCount}
// //                       </span>
// //                     )}

// //                     {/* زر القائمة المنسدلة - نسخة مبسطة */}
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         setOpenDropdown(isDropdownOpen ? null : chat.chatId);
// //                       }}
// //                       className={`p-1 rounded-full transition-colors ${
// //                         isDropdownOpen ? 'bg-gray-200' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
// //                       }`}
// //                     >
// //                       <img
// //                         src="/imgs/dropdwnBtn.svg"
// //                         alt="قائمة"
// //                         style={{
// //                           width: '12px',
// //                           height: '6px',
// //                           transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
// //                         }}
// //                       />
// //                     </button>

// //                     {isDropdownOpen && (
// //                       <div
// //                         className="absolute top-full right-2 mt-1 rounded-lg shadow-lg z-50 py-1"
// //                         style={{ width: '154px', borderRadius: '8px', backgroundColor: '#F5F5F5' }}
// //                         onClick={(e) => e.stopPropagation()}
// //                       >
// //                         <button
// //                           onClick={() => {
// //                             setOpenDropdown(null);
// //                             openCallModal(chat.chatId);
// //                           }}
// //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// //                           style={{ borderBottom: '0.33px solid #3C3C434D' }}
// //                         >
// //                           <img src="/imgs/fire-emergency-call 1.svg" alt="call" style={{ width: '16px', height: '16px' }} />
// //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>اتصال</span>
// //                         </button>

// //                         <button
// //                           onClick={() => {
// //                             setOpenDropdown(null);
// //                             // TODO: احذف المحادثة
// //                             removeChats([chat.chatId]);
// //                           }}
// //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// //                         >
// //                           <img src="/imgs/delete.svg" alt="حذف" style={{ width: '16px', height: '16px' }} />
// //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', color: '#D72229' }}>حذف</span>
// //                         </button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}

// //       {/* ===== Call Modal ===== */}
// //          {/* <CallModal
// //           isOpen={isCallModalOpen}
// //           calleeName={selectedCallChat?.userinfo?.name || selectedCallChat?.name || 'مستخدم'}
// //           calleeUsername={`@${selectedCallChat?.userinfo?.username || 'user'}`}   // ✅ جديد
// //           calleeAvatar={selectedCallChat?.userinfo?.img || '/imgs/user.png'}      // ✅ جديد
// //           callTitle="مكالمة صوتية واردة"                                          // ✅ جديد
// //           freeMinutes={callMinutes.free}
// //           totalMinutes={callMinutes.total}
// //           isStarting={isStarting}
// //           onClose={closeCallModal}
// //           onStart={(type) => {
// //             if (!selectedCallChat) return;
// //             startCall(type, selectedCallChat.chatId, selectedCallChat.name);
// //           }}
// //         /> */}
// //         {/* ===== Call Modal ===== */}
// // <CallModal
// //   isOpen={isCallModalOpen}
// //   calleeName={
// //     selectedCallChat?.userinfo?.name ||
// //     selectedCallChat?.name ||
// //     'مستخدم'
// //   }
// //   calleeUsername={
// //     selectedCallChat?.userinfo?.username
// //       ? `@${selectedCallChat.userinfo.username}`
// //       : selectedCallChat?.userinfo?.name
// //       ? `@${selectedCallChat.userinfo.name}`
// //       : '@user'
// //   }
// //   calleeAvatar={
// //     selectedCallChat?.userinfo?.img || '/imgs/user.png'
// //   }
// //   callTitle="مكالمة صوتية صادرة"
// //   freeMinutes={callMinutes.free}
// //   totalMinutes={callMinutes.total}
// //   isStarting={isStarting}
// //   onClose={closeCallModal}
// //   onStart={(type) => {
// //     if (!selectedCallChat) return;
// //     startCall(type, selectedCallChat.chatId, selectedCallChat.name);
// //   }}
// // />
// //     </div>
// //   );
// // }



// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // // // ////////////////////////////////////


// // // // src/app/chats/_components/ChatList.tsx
// // // /* eslint-disable @next/next/no-img-element */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // 'use client';

// // // import { useEffect, useState, useRef } from 'react';
// // // import { useRouter, usePathname } from 'next/navigation';
// // // import { Search } from 'lucide-react';
// // // import { toast } from 'react-hot-toast';

// // // import ChatFilters from './ChatFilters';
// // // import { useChats } from './hooks/useChats';
// // // import { useCalls } from './hooks/useCalls';
// // // import { useSelectionMode } from './hooks/useSelectionMode';
// // // import { useDropdown } from './hooks/useDropdown';
// // // import { useBlockedUsers } from './hooks/useBlockedUsers';

// // // import CallModal from './components/calls/CallModal';
// // // import CallInterface from './components/calls/CallInterface';
// // // import GroupAvatar from './components/GroupAvatar';

// // // import { formatMessageTime } from './utils/formatTime';
// // // import { FilterType } from './types';

// // // type Props = {
// // //   userId?: string | null;
// // //   apiBase: string;
// // //   activeChatId?: string | null;
// // // };

// // // export default function ChatList({ userId: propUserId, apiBase, activeChatId: propActiveChatId }: Props) {
// // //   const router = useRouter();
// // //   const pathname = usePathname();
// // //   const activeChatId = propActiveChatId || pathname?.split('/').pop();

// // //   const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
// // //   const [myUserId, setMyUserId] = useState<string>(propUserId || '');

// // //   useEffect(() => {
// // //     if (propUserId) {
// // //       setMyUserId(propUserId);
// // //       return;
// // //     }
// // //     const raw = localStorage.getItem('userData');
// // //     if (!raw) return;
// // //     try {
// // //       const parsed = JSON.parse(raw);
// // //       setMyUserId(parsed._id || parsed.id || '');
// // //     } catch {}
// // //   }, [propUserId]);

// // //   // ================= Hooks =================
// // //   const {
// // //     chats,
// // //     searchedChats,
// // //     loading,
// // //     filterLoading,
// // //     searchTerm,
// // //     setSearchTerm,
// // //     activeFilter,
// // //     handleFilterChange,
// // //     getFilterCounts,
// // //     markMessageAsSeen,
// // //     updateChat,
// // //     removeChats,
// // //   } = useChats({ myUserId, apiBase, token });

// // //   const {
// // //     callMinutes,
// // //     isCallModalOpen,
// // //     selectedCallChatId,
// // //     activeCall,
// // //     isStarting,
// // //     openCallModal,
// // //     closeCallModal,
// // //     startCall,
// // //     endCall,
// // //   } = useCalls({ apiBase, token });

// // //   const {
// // //     selectionMode,
// // //     selectedChats,
// // //     toggleChatSelection,
// // //     clearSelection,
// // //     handleMouseDown,
// // //     handleMouseUp,
// // //     handleMouseLeave,
// // //   } = useSelectionMode();

// // //   const { openDropdown, setOpenDropdown, setRef } = useDropdown();
// // //   const { isUserBlocked } = useBlockedUsers({ apiBase, token });

// // //   // ================= Modals =================
// // //   const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

// // //   const userName = (() => {
// // //     try {
// // //       const data = JSON.parse(localStorage.getItem('userData') || '{}');
// // //       return data.name || data.username || 'User';
// // //     } catch {
// // //       return 'User';
// // //     }
// // //   })();

// // //   const selectedCallChat = chats.find((c) => c.chatId === selectedCallChatId);

// // //   const getSectionTitle = () => {
// // //     if (selectionMode) return '';
// // //     switch (activeFilter) {
// // //       case 'all': return 'قسم الرسائل العام';
// // //       case 'read': return 'قسم الرسائل المقروء';
// // //       case 'unread': return 'قسم الرسائل غير المقروء';
// // //       case 'starred': return 'قسم الرسائل المميزة';
// // //       case 'groups': return 'قسم المجموعات';
// // //       case 'calls': return 'قسم المكالمات';
// // //       default: return 'قسم الرسائل العام';
// // //     }
// // //   };

// // //   // ================= Dropdown Actions =================
// // //   const handleDropdownAction = async (action: string, chatId: string, chatType: string) => {
// // //     setOpenDropdown(null);

// // //     const chat: any = chats.find((c) => c.chatId === chatId);
// // //     const chatName = chat?.name || 'هذه المحادثة';
// // //     const isGroup = chatType === 'group' || chat?.isGroup;

// // //     switch (action) {
// // //       case 'block':
// // //         await handleBlockUser(chatId, chatName);
// // //         break;
// // //       case 'report':
// // //         toast.success('جاري فتح نافذة الإبلاغ...');
// // //         // TODO: افتح ReportModal
// // //         break;
// // //       case 'search':
// // //         toast.info('جاري البحث في المحادثة...');
// // //         break;
// // //       case 'archive':
// // //         await handleArchiveChat(chatId, chatType);
// // //         break;
// // //       case 'delete':
// // //         await handleDeleteChat(chatId, chatType, chatName, isGroup);
// // //         break;
// // //       case 'leave':
// // //         await handleLeaveGroup(chatId, chatName);
// // //         break;
// // //       case 'call':
// // //         openCallModal(chatId);
// // //         break;
// // //     }
// // //   };

// // //   // ================= Block User =================
// // //   const handleBlockUser = async (chatId: string, chatName: string) => {
// // //     if (!token) return;
// // //     const isBlocked = isUserBlocked(chatId);
// // //     const url = isBlocked
// // //       ? `${apiBase}/unblock${myUserId}`
// // //       : `${apiBase}/block${myUserId}`;

// // //     try {
// // //       const res = await fetch(url, {
// // //         method: 'POST',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ blockedid: chatId }),
// // //       });

// // //       const data = await res.json();
// // //       if (res.ok && data.success) {
// // //         toast.success(isBlocked ? 'تم رفع الحظر' : 'تم حظر المستخدم');
// // //       } else {
// // //         toast.error(`فشل: ${data.response || data.message || 'خطأ'}`);
// // //       }
// // //     } catch (error) {
// // //       console.error('Block error:', error);
// // //       toast.error('حدث خطأ أثناء العملية');
// // //     }
// // //   };

// // //   // ================= Archive / Favorite =================
// // //   const handleArchiveChat = async (chatId: string, chatType: string) => {
// // //     if (!token) return;
// // //     const currentChat = chats.find((c) => c.chatId === chatId);
// // //     if (!currentChat) return;

// // //     const isCurrentlyFavorite = currentChat.isFavorite || false;
// // //     const url = isCurrentlyFavorite
// // //       ? `${apiBase}/chats/unfavorite`
// // //       : `${apiBase}/chats/favorite`;

// // //     try {
// // //       const res = await fetch(url, {
// // //         method: 'POST',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ chatId, chatType }),
// // //       });

// // //       const data = await res.json();
// // //       if (data.success) {
// // //         toast.success(isCurrentlyFavorite ? 'تم إزالة الأرشفة' : 'تمت الأرشفة');
// // //         updateChat(chatId, { isFavorite: !isCurrentlyFavorite } as any);
// // //       } else {
// // //         toast.error(`فشل: ${data.response || 'خطأ'}`);
// // //       }
// // //     } catch (error) {
// // //       console.error('Archive error:', error);
// // //       toast.error('حدث خطأ');
// // //     }
// // //   };

// // //   // ================= Delete Chat =================
// // //   const handleDeleteChat = async (
// // //     chatId: string,
// // //     chatType: string,
// // //     chatName: string,
// // //     isGroup: boolean
// // //   ) => {
// // //     if (!token) return;

// // //     const endpoint = isGroup
// // //       ? `${apiBase}/chats/groups/DeleteGroup/${chatId}`
// // //       : `${apiBase}/chats/delete/${chatId}`;

// // //     try {
// // //       const res = await fetch(endpoint, {
// // //         method: 'DELETE',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       const data = await res.json();
// // //       if (res.ok && (data.success || data.status === 'success')) {
// // //         toast.success(isGroup ? 'تم حذف المجموعة' : 'تم حذف المحادثة');
// // //         removeChats([chatId]);
// // //         if (activeChatId === chatId) {
// // //           router.push('/chats');
// // //         }
// // //       } else {
// // //         toast.error(`فشل الحذف: ${data.response || data.message || 'خطأ'}`);
// // //       }
// // //     } catch (error) {
// // //       console.error('Delete error:', error);
// // //       toast.error('حدث خطأ أثناء الحذف');
// // //     }
// // //   };

// // //   // ================= Leave Group =================
// // //   const handleLeaveGroup = async (chatId: string, groupName: string) => {
// // //     if (!token) return;

// // //     try {
// // //       const res = await fetch(`${apiBase}/chats/groups/LeaveGroup/${chatId}`, {
// // //         method: 'POST',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       const data = await res.json();
// // //       if (data.success) {
// // //         toast.success('تم الخروج من المجموعة');
// // //         removeChats([chatId]);
// // //         if (activeChatId === chatId) {
// // //           router.push('/chats');
// // //         }
// // //       } else {
// // //         toast.error(`فشل الخروج: ${data.response || 'خطأ'}`);
// // //       }
// // //     } catch (error) {
// // //       console.error('Leave error:', error);
// // //       toast.error('حدث خطأ');
// // //     }
// // //   };

// // //   // ================= Bulk Actions =================
// // //   const handleBulkDelete = async () => {
// // //     if (!token || selectedChats.length === 0) return;
// // //     for (const id of selectedChats) {
// // //       const chat = chats.find((c) => c.chatId === id);
// // //       if (chat) {
// // //         await handleDeleteChat(id, chat.chatType, chat.name, chat.isGroup);
// // //       }
// // //     }
// // //     clearSelection();
// // //   };

// // //   const handleBulkArchive = async () => {
// // //     if (selectedChats.length === 0) return;
// // //     for (const id of selectedChats) {
// // //       const chat = chats.find((c) => c.chatId === id);
// // //       if (chat) await handleArchiveChat(id, chat.chatType);
// // //     }
// // //     clearSelection();
// // //   };

// // //   const handleBulkCall = () => clearSelection();
// // //   const handleBulkGroupMessage = () => clearSelection();

// // //   if (loading) return <div className="p-4 text-center">جارٍ التحميل...</div>;

// // //   return (
// // //     <div className="relative h-full flex flex-col">
// // //       {/* ===== واجهة MediaSFU ===== */}
// // //       {activeCall && (
// // //         <CallInterface
// // //           activeCall={activeCall}
// // //           apiBase={apiBase}
// // //           token={token}
// // //           userName={userName}
// // //           onClose={endCall}
// // //         />
// // //       )}

// // //       {/* ===== Header ===== */}
// // //       <div className="flex items-center justify-between px-4 mb-5">
// // //         <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
// // //           {getSectionTitle()}
// // //         </h1>
// // //         {!selectionMode && (
// // //           <button
// // //             onClick={() => setIsCreateGroupOpen(true)}
// // //             className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
// // //             aria-label="إنشاء مجموعة"
// // //           >
// // //             <img src="/imgs/createGrup.svg" alt="إنشاء مجموعة" className="w-6 h-6 block" />
// // //           </button>
// // //         )}
// // //       </div>

// // //       {/* ===== Selection Toolbar ===== */}
// // //       {selectionMode && selectedChats.length > 0 && (
// // //         <div className="w-full px-4 mb-3 -mt-10" style={{
// // //           background: 'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
// // //           paddingTop: '8px',
// // //           paddingBottom: '8px',
// // //         }}>
// // //           <div className="flex items-center justify-center gap-2 mt-[30px]">
// // //             <button onClick={handleBulkDelete} className="hover:bg-[#FFEBEE] hover:scale-105 transition-all" style={{ width: '63px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// // //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>حذف</span>
// // //             </button>
// // //             <button onClick={handleBulkGroupMessage} className="hover:bg-[#E8F5E9] hover:scale-105 transition-all" style={{ width: '102px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// // //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>رسالة جماعية</span>
// // //             </button>
// // //             <button onClick={handleBulkCall} className="hover:bg-[#E8F4FD] hover:scale-105 transition-all" style={{ width: '102px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// // //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>مكالمة جماعية</span>
// // //             </button>
// // //             <button onClick={handleBulkArchive} className="hover:bg-[#FFF8E1] hover:scale-105 transition-all" style={{ width: '63px', height: '31px', borderRadius: '10px', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
// // //               <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '12px', color: '#B4B4B9' }}>مميز</span>
// // //             </button>
// // //           </div>
// // //           <div className="text-center mt-2">
// // //             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '25px', color: '#000' }}>
// // //               تم تحديد {selectedChats.length} محادثة
// // //             </span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ===== Search ===== */}
// // //       <div className="flex items-center justify-center w-full mb-3">
// // //         <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
// // //           <Search className="text-[#B6B7B7]" />
// // //           <input
// // //             type="text"
// // //             placeholder=" اكتب هنا ما تريد ان تكتشفه"
// // //             className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //           />
// // //           {searchTerm && (
// // //             <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ===== Filters ===== */}
// // //       <ChatFilters
// // //         onFilterChange={handleFilterChange as any}
// // //         activeFilter={activeFilter as any}
// // //         counts={getFilterCounts as any}
// // //       />

// // //       {/* ===== Calls Balance ===== */}
// // //       {activeFilter === 'calls' && (
// // //         <div className="flex items-center justify-between px-4 -mt-1">
// // //           <div className="flex items-center gap-2">
// // //             <img src="/imgs/fire-emergency-call 1.svg" alt="Call" style={{ width: '12px', height: '12px' }} />
// // //             <span style={{ color: '#171717', fontSize: '12px', fontFamily: 'Cairo', fontWeight: 600 }}>رصيدك الحالي</span>
// // //           </div>
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
// // //             <span style={{ color: '#171717', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo' }}>{callMinutes.free}</span>
// // //             <span style={{ color: '#8899aa', fontSize: '14px', fontFamily: 'Cairo' }}>/</span>
// // //             <span style={{ color: '#171717', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo' }}>{callMinutes.total}</span>
// // //             <span style={{ color: '#D72229', fontSize: '12px', fontFamily: 'Cairo' }}>دقيقة مجانية</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ===== Chat List ===== */}
// // //       {filterLoading ? (
// // //         <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
// // //       ) : (
// // //         <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
// // //           {searchedChats.length === 0 && (
// // //             <div className="text-center text-gray-500 py-10">
// // //               {searchTerm.trim() !== '' ? `لا توجد محادثات مع "${searchTerm}"` : 'لا توجد محادثات في هذا القسم'}
// // //             </div>
// // //           )}

// // //           {searchedChats.map((chat) => {
// // //             const isLastFromMe = chat.lastMessage?.sender === myUserId;
// // //             const isMessageSeen = chat.seen === true || chat.lastMessage?.seenBy === true;
// // //             const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
// // //             const time = formatMessageTime(chat.lastMessage?.timestamp || '');
// // //             const isDropdownOpen = openDropdown === chat.chatId;
// // //             const isSelected = selectedChats.includes(chat.chatId);

// // //             return (
// // //               <div
// // //                 key={chat.chatId}
// // //                 className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
// // //                   activeChatId === chat.chatId ? 'active-chat' : 'hover:bg-gray-100'
// // //                 } ${isSelected ? 'bg-[#FAFAFA] rounded-lg' : ''}`}
// // //                 dir="ltr"
// // //                 ref={(el) => setRef(chat.chatId, el)}
// // //                 onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
// // //                 onMouseUp={handleMouseUp}
// // //                 onMouseLeave={handleMouseLeave}
// // //               >
// // //                 {selectionMode && (
// // //                   <div className="flex-shrink-0">
// // //                     <img
// // //                       src={isSelected ? '/imgs/check (2).svg' : '/imgs/uncheck.svg'}
// // //                       alt={isSelected ? 'محدد' : 'غير محدد'}
// // //                       onClick={() => toggleChatSelection(chat.chatId)}
// // //                       style={{ width: '20px', height: '20px', cursor: 'pointer' }}
// // //                     />
// // //                   </div>
// // //                 )}

// // //                 <div
// // //                   className="flex items-center gap-3 flex-1"
// // //                   onClick={() => {
// // //                     if (selectionMode) {
// // //                       toggleChatSelection(chat.chatId);
// // //                     } else {
// // //                       if (isLastFromMe && chat.lastMessage?._id) {
// // //                         markMessageAsSeen(chat.lastMessage._id);
// // //                       }
// // //                       updateChat(chat.chatId, { unreadCount: 0 } as any);
// // //                       router.push(`/chats/${chat.chatId}`);
// // //                     }
// // //                   }}
// // //                 >
// // //                   {/* ✅ عرض الجروب أو الصورة العادية */}
// // //                   {chat.isGroup ? (
// // //                     <GroupAvatar chat={chat} myUserId={myUserId} />
// // //                   ) : (
// // //                     <img
// // //                       src={chat.userinfo?.img || '/imgs/user.png'}
// // //                       className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
// // //                       alt={chat.userinfo?.name}
// // //                     />
// // //                   )}

// // //                   <div className="flex-1">
// // //                     <div className="font-medium text-black flex items-center justify-between">
// // //                       <div className="flex flex-col">
// // //                         <span className="truncate" style={{ fontSize: chat.isGroup ? '18px' : '16px' }}>
// // //                           {chat.name}
// // //                         </span>
// // //                         {chat.isGroup && chat.description && chat.description !== 'no' && (
// // //                           <span
// // //                             className="truncate"
// // //                             style={{
// // //                               fontFamily: 'Cairo',
// // //                               fontSize: '15px',
// // //                               color: '#000000',
// // //                               maxWidth: '150px',
// // //                               overflow: 'hidden',
// // //                               textOverflow: 'ellipsis',
// // //                               whiteSpace: 'nowrap',
// // //                             }}
// // //                           >
// // //                             {chat.description}
// // //                           </span>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                     <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
// // //                       {chat.typing ? 'يكتب الان ...' : chat.lastMessage?.message || ''}
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 {!selectionMode && (
// // //                   <div className="flex flex-col items-center gap-1 mt-6">
// // //                     <div className="flex items-center gap-1">
// // //                       <span className="text-[10px] text-gray-400">{time}</span>
// // //                       <img
// // //                         src={isMessageSeen ? '/imgs/read.svg' : '/imgs/unread.svg'}
// // //                         alt={isMessageSeen ? 'مقروءة' : 'غير مقروءة'}
// // //                         style={{ width: '13px', height: '12px' }}
// // //                       />
// // //                     </div>

// // //                     {chat.isFavorite && (
// // //                       <img
// // //                         src="/imgs/archive (2).svg"
// // //                         alt="مؤرشفة"
// // //                         style={{ width: '13px', height: '13px' }}
// // //                       />
// // //                     )}

// // //                     {!isLastFromMe && hasUnread && (
// // //                       <span
// // //                         className="text-white text-[10px] font-semibold flex items-center justify-center"
// // //                         style={{
// // //                           width: '22px',
// // //                           height: '15px',
// // //                           borderRadius: '6px',
// // //                           background: '#D72229',
// // //                           fontFamily: 'Cairo',
// // //                           fontSize: '10px',
// // //                         }}
// // //                       >
// // //                         {chat.unreadCount}
// // //                       </span>
// // //                     )}

// // //                     <button
// // //                       onClick={(e) => {
// // //                         e.stopPropagation();
// // //                         setOpenDropdown(isDropdownOpen ? null : chat.chatId);
// // //                       }}
// // //                       className={`p-1 rounded-full transition-colors ${
// // //                         isDropdownOpen ? 'bg-gray-200' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
// // //                       }`}
// // //                     >
// // //                       <img
// // //                         src="/imgs/dropdwnBtn.svg"
// // //                         alt="قائمة"
// // //                         style={{
// // //                           width: '12px',
// // //                           height: '6px',
// // //                           transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
// // //                         }}
// // //                       />
// // //                     </button>

// // //                     {/* ===== القائمة المنسدلة الكاملة ===== */}
// // //                     {isDropdownOpen && (
// // //                       <div
// // //                         className="absolute top-full right-2 mt-1 rounded-lg shadow-lg z-50 py-1"
// // //                         style={{ width: '154px', borderRadius: '8px', backgroundColor: '#F5F5F5' }}
// // //                         onClick={(e) => e.stopPropagation()}
// // //                       >
// // //                         {/* حظر / رفع الحظر */}
// // //                         <button
// // //                           onClick={() => handleDropdownAction('block', chat.chatId, chat.chatType)}
// // //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           style={{ borderBottom: '0.33px solid #3C3C434D' }}
// // //                         >
// // //                           <img src="/imgs/block.svg" alt="حظر" style={{ width: '16px', height: '16px' }} />
// // //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>
// // //                             {isUserBlocked(chat.chatId) ? 'رفع الحظر' : 'حظر'}
// // //                           </span>
// // //                         </button>

// // //                         {/* إبلاغ */}
// // //                         <button
// // //                           onClick={() => handleDropdownAction('report', chat.chatId, chat.chatType)}
// // //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           style={{ borderBottom: '0.33px solid #3C3C434D' }}
// // //                         >
// // //                           <img src="/imgs/report.svg" alt="إبلاغ" style={{ width: '16px', height: '16px' }} />
// // //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>إبلاغ</span>
// // //                         </button>

// // //                         {/* بحث */}
// // //                         <button
// // //                           onClick={() => handleDropdownAction('search', chat.chatId, chat.chatType)}
// // //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           style={{ borderBottom: '0.33px solid #3C3C434D' }}
// // //                         >
// // //                           <img src="/imgs/search.svg" alt="بحث" style={{ width: '16px', height: '16px' }} />
// // //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>بحث</span>
// // //                         </button>

// // //                         {/* أرشفة */}
// // //                         <button
// // //                           onClick={() => handleDropdownAction('archive', chat.chatId, chat.chatType)}
// // //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           style={{ borderBottom: '0.33px solid #3C3C434D' }}
// // //                         >
// // //                           <img src="/imgs/archive.svg" alt="أرشفة" style={{ width: '16px', height: '16px' }} />
// // //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px' }}>
// // //                             {chat.isFavorite ? 'إزالة أرشفة' : 'أرشفة'}
// // //                           </span>
// // //                         </button>

// // //                         {/* حذف الدردشة */}
// // //                         <button
// // //                           onClick={() => handleDropdownAction('delete', chat.chatId, chat.chatType)}
// // //                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           style={{ borderBottom: chat.isGroup ? '0.33px solid #3C3C434D' : 'none' }}
// // //                         >
// // //                           <img src="/imgs/delete.svg" alt="حذف" style={{ width: '16px', height: '16px' }} />
// // //                           <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', color: '#D72229' }}>
// // //                             حذف الدردشة
// // //                           </span>
// // //                         </button>

// // //                         {/* خروج (للمجموعات فقط) */}
// // //                         {chat.isGroup && (
// // //                           <button
// // //                             onClick={() => handleDropdownAction('leave', chat.chatId, chat.chatType)}
// // //                             className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
// // //                           >
// // //                             <img src="/imgs/leave.svg" alt="خروج" style={{ width: '16px', height: '16px' }} />
// // //                             <span style={{ fontFamily: 'Cairo', fontWeight: 600, fontSize: '15px', color: '#D72229' }}>
// // //                               خروج
// // //                             </span>
// // //                           </button>
// // //                         )}
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}

// // //       {/* ===== Call Modal ===== */}
// // //       <CallModal
// // //         isOpen={isCallModalOpen}
// // //         calleeName={selectedCallChat?.name || 'مستخدم'}
// // //         freeMinutes={callMinutes.free}
// // //         totalMinutes={callMinutes.total}
// // //         isStarting={isStarting}
// // //         onClose={closeCallModal}
// // //         onStart={(type) => {
// // //           if (!selectedCallChat) return;
// // //           startCall(type, selectedCallChat.chatId, selectedCallChat.name);
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // }




// // ////////////////////////////////////
// // ////////////////////////////////////
// // ////////////////////////////////////
// // ////////////////////////////////////
// // ////////////////////////////////////
// // ////////////////////////////////////
// // ////////////////////////////////////
// // src/app/chats/_components/ChatList.tsx
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Search } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// import ChatFilters from './ChatFilters';
// import { useChats } from './hooks/useChats';
// import { useCalls } from './hooks/useCalls';
// import { useSelectionMode } from './hooks/useSelectionMode';
// import { useDropdown } from './hooks/useDropdown';
// import { useBlockedUsers } from './hooks/useBlockedUsers';
// import { useCallContext } from '@/contexts/CallContext';

// import CallInterface from './components/calls/CallInterface';
// import GroupAvatar from './components/GroupAvatar';

// import { formatMessageTime } from './utils/formatTime';
// import { FilterType } from './types';
// import CreateGroupModal from './components/CreateGroupModal';


// type Props = {
//   userId?: string | null;
//   apiBase: string;
//   activeChatId?: string | null;
// };

// export default function ChatList({
//   userId: propUserId,
//   apiBase,
//   activeChatId: propActiveChatId,
// }: Props) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const activeChatId = propActiveChatId || pathname?.split('/').pop();

//   const token =
//     typeof window !== 'undefined'
//       ? localStorage.getItem('accessToken')
//       : null;

//   const [myUserId, setMyUserId] = useState<string>(propUserId || '');

//   useEffect(() => {
//     if (propUserId) {
//       setMyUserId(propUserId);
//       return;
//     }
//     const raw = localStorage.getItem('userData');
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       setMyUserId(parsed._id || parsed.id || '');
//     } catch {}
//   }, [propUserId]);

//   // ================= Hooks =================
//   const {
//     chats,
//     searchedChats,
//     loading,
//     filterLoading,
//     searchTerm,
//     setSearchTerm,
//     activeFilter,
//     handleFilterChange,
//     getFilterCounts,
//     markMessageAsSeen,
//     updateChat,
//     removeChats,
//     fetchChats,
//   } = useChats({ myUserId, apiBase, token });

//   const {
//     callMinutes: localCallMinutes,
//     activeCall,
//     isStarting: localIsStarting,
//     startCall,
//     endCall,
//   } = useCalls({ apiBase, token });

//   // ✅ CallContext (للربط مع SidebarArabic)
//   const {
//     openCallModal,
//     setCallMinutes,
//     setIsStarting,
//     setStartCallHandler,
//     selectedCallChat: ctxSelectedChat,
//   } = useCallContext();

//   const {
//     selectionMode,
//     selectedChats,
//     toggleChatSelection,
//     clearSelection,
//     handleMouseDown,
//     handleMouseUp,
//     handleMouseLeave,
//   } = useSelectionMode();

//   const { openDropdown, setOpenDropdown, setRef } = useDropdown();
//   const { isUserBlocked } = useBlockedUsers({ apiBase, token });

//   // ================= Modals =================
//   const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

//   const userName = (() => {
//     try {
//       const data = JSON.parse(localStorage.getItem('userData') || '{}');
//       return data.name || data.username || 'User';
//     } catch {
//       return 'User';
//     }
//   })();

//   // ================= Sync with Context =================

//   // ✅ مزامنة الرصيد
//   useEffect(() => {
//     setCallMinutes(localCallMinutes);
//   }, [localCallMinutes, setCallMinutes]);

//   // ✅ مزامنة حالة البدء
//   useEffect(() => {
//     setIsStarting(localIsStarting);
//   }, [localIsStarting, setIsStarting]);

//   // ✅ سجّلي دالة startCall عشان SidebarArabic تستخدمها
//   useEffect(() => {
//     setStartCallHandler(() => (type: 'audio' | 'video') => {
//       if (!ctxSelectedChat) return;
//       startCall(type, ctxSelectedChat.chatId, ctxSelectedChat.name);
//     });
//   }, [ctxSelectedChat, startCall, setStartCallHandler]);

//   // ================= Section Title =================
//   const getSectionTitle = () => {
//     if (selectionMode) return '';
//     switch (activeFilter) {
//       case 'all':
//         return 'قسم الرسائل العام';
//       case 'read':
//         return 'قسم الرسائل المقروء';
//       case 'unread':
//         return 'قسم الرسائل غير المقروء';
//       case 'starred':
//         return 'قسم الرسائل المميزة';
//       case 'groups':
//         return 'قسم المجموعات';
//       case 'calls':
//         return 'قسم المكالمات';
//       default:
//         return 'قسم الرسائل العام';
//     }
//   };

//   // ================= Dropdown Actions =================
//   const handleDropdownAction = async (
//     action: string,
//     chatId: string,
//     chatType: string
//   ) => {
//     setOpenDropdown(null);

//     const chat: any = chats.find((c) => c.chatId === chatId);
//     const chatName = chat?.name || 'هذه المحادثة';
//     const isGroup = chatType === 'group' || chat?.isGroup;

//     switch (action) {
//       case 'block':
//         await handleBlockUser(chatId, chatName);
//         break;
//       case 'report':
//         toast.success('جاري فتح نافذة الإبلاغ...');
//         break;
//       case 'search':
//         toast.info('جاري البحث في المحادثة...');
//         break;
//       case 'archive':
//         await handleArchiveChat(chatId, chatType);
//         break;
//       case 'delete':
//         await handleDeleteChat(chatId, chatType, chatName, isGroup);
//         break;
//       case 'leave':
//         await handleLeaveGroup(chatId, chatName);
//         break;
//       case 'call':
//         // ✅ فتح CallModal في SidebarArabic
//         openCallModal({
//           chatId,
//           name: chat?.name || 'مستخدم',
//           userinfo: chat?.userinfo,
//         });
//         break;
//     }
//   };

//   // ================= Block User =================
//   const handleBlockUser = async (chatId: string, chatName: string) => {
//     if (!token) return;
//     const isBlocked = isUserBlocked(chatId);
//     const url = isBlocked
//       ? `${apiBase}/unblock${myUserId}`
//       : `${apiBase}/block${myUserId}`;

//     try {
//       const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ blockedid: chatId }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         toast.success(isBlocked ? 'تم رفع الحظر' : 'تم حظر المستخدم');
//       } else {
//         toast.error(`فشل: ${data.response || data.message || 'خطأ'}`);
//       }
//     } catch (error) {
//       console.error('Block error:', error);
//       toast.error('حدث خطأ أثناء العملية');
//     }
//   };

//   // ================= Archive / Favorite =================
//   const handleArchiveChat = async (chatId: string, chatType: string) => {
//     if (!token) return;
//     const currentChat = chats.find((c) => c.chatId === chatId);
//     if (!currentChat) return;

//     const isCurrentlyFavorite = currentChat.isFavorite || false;
//     const url = isCurrentlyFavorite
//       ? `${apiBase}/chats/unfavorite`
//       : `${apiBase}/chats/favorite`;

//     try {
//       const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ chatId, chatType }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success(
//           isCurrentlyFavorite ? 'تم إزالة الأرشفة' : 'تمت الأرشفة'
//         );
//         updateChat(chatId, { isFavorite: !isCurrentlyFavorite } as any);
//       } else {
//         toast.error(`فشل: ${data.response || 'خطأ'}`);
//       }
//     } catch (error) {
//       console.error('Archive error:', error);
//       toast.error('حدث خطأ');
//     }
//   };

//   // ================= Delete Chat =================
//   const handleDeleteChat = async (
//     chatId: string,
//     chatType: string,
//     chatName: string,
//     isGroup: boolean
//   ) => {
//     if (!token) return;

//     const endpoint = isGroup
//       ? `${apiBase}/chats/groups/DeleteGroup/${chatId}`
//       : `${apiBase}/chats/delete/${chatId}`;

//     try {
//       const res = await fetch(endpoint, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await res.json();
//       if (res.ok && (data.success || data.status === 'success')) {
//         toast.success(isGroup ? 'تم حذف المجموعة' : 'تم حذف المحادثة');
//         removeChats([chatId]);
//         if (activeChatId === chatId) {
//           router.push('/chats');
//         }
//       } else {
//         toast.error(
//           `فشل الحذف: ${data.response || data.message || 'خطأ'}`
//         );
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       toast.error('حدث خطأ أثناء الحذف');
//     }
//   };

//   // ================= Leave Group =================
//   const handleLeaveGroup = async (chatId: string, groupName: string) => {
//     if (!token) return;

//     try {
//       const res = await fetch(`${apiBase}/chats/groups/LeaveGroup/${chatId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success('تم الخروج من المجموعة');
//         removeChats([chatId]);
//         if (activeChatId === chatId) {
//           router.push('/chats');
//         }
//       } else {
//         toast.error(`فشل الخروج: ${data.response || 'خطأ'}`);
//       }
//     } catch (error) {
//       console.error('Leave error:', error);
//       toast.error('حدث خطأ');
//     }
//   };

//   // ================= Bulk Actions =================
//   const handleBulkDelete = async () => {
//     if (!token || selectedChats.length === 0) return;
//     for (const id of selectedChats) {
//       const chat = chats.find((c) => c.chatId === id);
//       if (chat) {
//         await handleDeleteChat(id, chat.chatType, chat.name, chat.isGroup);
//       }
//     }
//     clearSelection();
//   };

//   const handleBulkArchive = async () => {
//     if (selectedChats.length === 0) return;
//     for (const id of selectedChats) {
//       const chat = chats.find((c) => c.chatId === id);
//       if (chat) await handleArchiveChat(id, chat.chatType);
//     }
//     clearSelection();
//   };

//   const handleBulkCall = () => clearSelection();
//   const handleBulkGroupMessage = () => clearSelection();

//   if (loading)
//     return <div className="p-4 text-center">جارٍ التحميل...</div>;

//   return (
//     <div className="relative h-full flex flex-col">
//       {/* ===== واجهة MediaSFU ===== */}
//       {activeCall && (
//         <CallInterface
//           activeCall={activeCall}
//           apiBase={apiBase}
//           token={token}
//           userName={userName}
//           onClose={endCall}
//         />
//       )}

//       {/* ===== Header ===== */}
//       <div className="flex items-center justify-between px-4 mb-5">
//         <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
//           {getSectionTitle()}
//         </h1>
//         {!selectionMode && (
//           <button
//             onClick={() => setIsCreateGroupOpen(true)}
//             className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
//             aria-label="إنشاء مجموعة"
//           >
//             <img
//               src="/imgs/createGrup.svg"
//               alt="إنشاء مجموعة"
//               className="w-6 h-6 block"
//             />
//           </button>
//         )}
//       </div>

//       {/* ===== Selection Toolbar ===== */}
//       {selectionMode && selectedChats.length > 0 && (
//         <div
//           className="w-full px-4 mb-3 -mt-10"
//           style={{
//             background:
//               'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
//             paddingTop: '8px',
//             paddingBottom: '8px',
//           }}
//         >
//           <div className="flex items-center justify-center gap-2 mt-[30px]">
//             <button
//               onClick={handleBulkDelete}
//               className="hover:bg-[#FFEBEE] hover:scale-105 transition-all"
//               style={{
//                 width: '63px',
//                 height: '31px',
//                 borderRadius: '10px',
//                 background: '#FFFFFF',
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               <span
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '12px',
//                   color: '#B4B4B9',
//                 }}
//               >
//                 حذف
//               </span>
//             </button>
//             <button
//               onClick={handleBulkGroupMessage}
//               className="hover:bg-[#E8F5E9] hover:scale-105 transition-all"
//               style={{
//                 width: '102px',
//                 height: '31px',
//                 borderRadius: '10px',
//                 background: '#FFFFFF',
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               <span
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '12px',
//                   color: '#B4B4B9',
//                 }}
//               >
//                 رسالة جماعية
//               </span>
//             </button>
//             <button
//               onClick={handleBulkCall}
//               className="hover:bg-[#E8F4FD] hover:scale-105 transition-all"
//               style={{
//                 width: '102px',
//                 height: '31px',
//                 borderRadius: '10px',
//                 background: '#FFFFFF',
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               <span
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '12px',
//                   color: '#B4B4B9',
//                 }}
//               >
//                 مكالمة جماعية
//               </span>
//             </button>
//             <button
//               onClick={handleBulkArchive}
//               className="hover:bg-[#FFF8E1] hover:scale-105 transition-all"
//               style={{
//                 width: '63px',
//                 height: '31px',
//                 borderRadius: '10px',
//                 background: '#FFFFFF',
//                 border: 'none',
//                 cursor: 'pointer',
//               }}
//             >
//               <span
//                 style={{
//                   fontFamily: 'Cairo',
//                   fontWeight: 600,
//                   fontSize: '12px',
//                   color: '#B4B4B9',
//                 }}
//               >
//                 مميز
//               </span>
//             </button>
//           </div>
//           <div className="text-center mt-2">
//             <span
//               style={{
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//                 fontSize: '25px',
//                 color: '#000',
//               }}
//             >
//               تم تحديد {selectedChats.length} محادثة
//             </span>
//           </div>
//         </div>
//       )}

//       {/* ===== Search ===== */}
//       <div className="flex items-center justify-center w-full mb-3">
//         <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
//           <Search className="text-[#B6B7B7]" />
//           <input
//             type="text"
//             placeholder=" اكتب هنا ما تريد ان تكتشفه"
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

//       {/* ===== Filters ===== */}
//       <ChatFilters
//         onFilterChange={handleFilterChange as any}
//         activeFilter={activeFilter as any}
//         counts={getFilterCounts as any}
//       />

//       {/* ===== Calls Balance ===== */}
//       {activeFilter === 'calls' && (
//         <div className="flex items-center justify-between px-4 -mt-1">
//           <div className="flex items-center gap-2">
//             <img
//               src="/imgs/fire-emergency-call 1.svg"
//               alt="Call"
//               style={{ width: '12px', height: '12px' }}
//             />
//             <span
//               style={{
//                 color: '#171717',
//                 fontSize: '12px',
//                 fontFamily: 'Cairo',
//                 fontWeight: 600,
//               }}
//             >
//               رصيدك الحالي
//             </span>
//           </div>
//           <div
//             style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
//           >
//             <span
//               style={{
//                 color: '#171717',
//                 fontSize: '12px',
//                 fontWeight: 600,
//                 fontFamily: 'Cairo',
//               }}
//             >
//               {localCallMinutes.free}
//             </span>
//             <span
//               style={{
//                 color: '#8899aa',
//                 fontSize: '14px',
//                 fontFamily: 'Cairo',
//               }}
//             >
//               /
//             </span>
//             <span
//               style={{
//                 color: '#171717',
//                 fontSize: '12px',
//                 fontWeight: 600,
//                 fontFamily: 'Cairo',
//               }}
//             >
//               {localCallMinutes.total}
//             </span>
//             <span
//               style={{
//                 color: '#D72229',
//                 fontSize: '12px',
//                 fontFamily: 'Cairo',
//               }}
//             >
//               دقيقة مجانية
//             </span>
//           </div>
//         </div>
//       )}

//       {/* ===== Chat List ===== */}
//       {filterLoading ? (
//         <div className="text-center py-10 text-gray-500">
//           جاري تحميل المحادثات...
//         </div>
//       ) : (
//         <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
//           {searchedChats.length === 0 && (
//             <div className="text-center text-gray-500 py-10">
//               {searchTerm.trim() !== ''
//                 ? `لا توجد محادثات مع "${searchTerm}"`
//                 : 'لا توجد محادثات في هذا القسم'}
//             </div>
//           )}

//           {searchedChats.map((chat) => {
//             const isLastFromMe = chat.lastMessage?.sender === myUserId;
//             const isMessageSeen =
//               chat.seen === true || chat.lastMessage?.seenBy === true;
//             const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
//             const time = formatMessageTime(
//               chat.lastMessage?.timestamp || ''
//             );
//             const isDropdownOpen = openDropdown === chat.chatId;
//             const isSelected = selectedChats.includes(chat.chatId);

//             return (
//               <div
//                 key={chat.chatId}
//                 className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
//                   activeChatId === chat.chatId
//                     ? 'active-chat'
//                     : 'hover:bg-gray-100'
//                 } ${isSelected ? 'bg-[#FAFAFA] rounded-lg' : ''}`}
//                 dir="ltr"
//                 ref={(el) => setRef(chat.chatId, el)}
//                 onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 {selectionMode && (
//                   <div className="flex-shrink-0">
//                     <img
//                       src={
//                         isSelected
//                           ? '/imgs/check (2).svg'
//                           : '/imgs/uncheck.svg'
//                       }
//                       alt={isSelected ? 'محدد' : 'غير محدد'}
//                       onClick={() => toggleChatSelection(chat.chatId)}
//                       style={{
//                         width: '20px',
//                         height: '20px',
//                         cursor: 'pointer',
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* <div
//                   className="flex items-center gap-3 flex-1"
//                   onClick={() => {
//                     if (selectionMode) {
//                       toggleChatSelection(chat.chatId);
//                     } else {
//                       if (isLastFromMe && chat.lastMessage?._id) {
//                         markMessageAsSeen(chat.lastMessage._id);
//                       }
//                       updateChat(chat.chatId, { unreadCount: 0 } as any);
//                       router.push(`/chats/${chat.chatId}`);
//                     }
//                   }}
                  
//                 > */}
//                 <div
//   className="flex items-center gap-3 flex-1"
//   onClick={() => {
//     if (selectionMode) {
//       toggleChatSelection(chat.chatId);
//     } else {
//       if (isLastFromMe && chat.lastMessage?._id) {
//         markMessageAsSeen(chat.lastMessage._id);
//       }
//       updateChat(chat.chatId, { unreadCount: 0 } as any);

//       // ✅ للمجموعات: استخدمي groupId
//       const targetId = chat.isGroup
//         ? (chat as any).groupId || chat.chatId
//         : chat.chatId;

//       console.log('🖱️ Navigate to:', {
//         isGroup: chat.isGroup,
//         chatId: chat.chatId,
//         groupId: (chat as any).groupId,
//         targetId,
//       });

//       router.push(`/chats/${targetId}`);
//     }
//   }}
// >
//                   {/* ✅ عرض الجروب أو الصورة العادية */}
//                   {chat.isGroup ? (
//                     <GroupAvatar chat={chat} myUserId={myUserId} />
//                   ) : (
//                     <img
//                       src={chat.userinfo?.img || '/imgs/user.png'}
//                       className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
//                       alt={chat.userinfo?.name}
//                     />
//                   )}

//                   <div className="flex-1">
//                     <div className="font-medium text-black flex items-center justify-between">
//                       <div className="flex flex-col">
//                         <span
//                           className="truncate"
//                           style={{
//                             fontSize: chat.isGroup ? '18px' : '16px',
//                           }}
//                         >
//                           {chat.name}
//                         </span>
//                         {chat.isGroup &&
//                           chat.description &&
//                           chat.description !== 'no' && (
//                             <span
//                               className="truncate"
//                               style={{
//                                 fontFamily: 'Cairo',
//                                 fontSize: '15px',
//                                 color: '#000000',
//                                 maxWidth: '150px',
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                                 whiteSpace: 'nowrap',
//                               }}
//                             >
//                               {chat.description}
//                             </span>
//                           )}
//                       </div>
//                     </div>
//                     <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
//                       {chat.typing
//                         ? 'يكتب الان ...'
//                         : chat.lastMessage?.message || ''}
//                     </div>
//                   </div>
//                 </div>

//                 {!selectionMode && (
//                   <div className="flex flex-col items-center gap-1 mt-6">
//                     <div className="flex items-center gap-1">
//                       <span className="text-[10px] text-gray-400">
//                         {time}
//                       </span>
//                       <img
//                         src={
//                           isMessageSeen
//                             ? '/imgs/read.svg'
//                             : '/imgs/unread.svg'
//                         }
//                         alt={isMessageSeen ? 'مقروءة' : 'غير مقروءة'}
//                         style={{ width: '13px', height: '12px' }}
//                       />
//                     </div>

//                     {chat.isFavorite && (
//                       <img
//                         src="/imgs/archive (2).svg"
//                         alt="مؤرشفة"
//                         style={{ width: '13px', height: '13px' }}
//                       />
//                     )}

//                     {!isLastFromMe && hasUnread && (
//                       <span
//                         className="text-white text-[10px] font-semibold flex items-center justify-center"
//                         style={{
//                           width: '22px',
//                           height: '15px',
//                           borderRadius: '6px',
//                           background: '#D72229',
//                           fontFamily: 'Cairo',
//                           fontSize: '10px',
//                         }}
//                       >
//                         {chat.unreadCount}
//                       </span>
//                     )}

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenDropdown(
//                           isDropdownOpen ? null : chat.chatId
//                         );
//                       }}
//                       className={`p-1 rounded-full transition-colors ${
//                         isDropdownOpen
//                           ? 'bg-gray-200'
//                           : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200'
//                       }`}
//                     >
//                       <img
//                         src="/imgs/dropdwnBtn.svg"
//                         alt="قائمة"
//                         style={{
//                           width: '12px',
//                           height: '6px',
//                           transform: isDropdownOpen
//                             ? 'rotate(180deg)'
//                             : 'rotate(0deg)',
//                         }}
//                       />
//                     </button>

//                     {/* ===== القائمة المنسدلة الكاملة ===== */}
//                     {isDropdownOpen && (
//                       <div
//                         className="absolute top-full right-2 mt-1 rounded-lg shadow-lg z-50 py-1"
//                         style={{
//                           width: '154px',
//                           borderRadius: '8px',
//                           backgroundColor: '#F5F5F5',
//                         }}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         {/* اتصال */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'call',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: '0.33px solid #3C3C434D',
//                           }}
//                         >
//                           <img
//                             src="/imgs/fire-emergency-call 1.svg"
//                             alt="اتصال"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                             }}
//                           >
//                             اتصال
//                           </span>
//                         </button>

//                         {/* حظر / رفع الحظر */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'block',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: '0.33px solid #3C3C434D',
//                           }}
//                         >
//                           <img
//                             src="/imgs/block.svg"
//                             alt="حظر"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                             }}
//                           >
//                             {isUserBlocked(chat.chatId)
//                               ? 'رفع الحظر'
//                               : 'حظر'}
//                           </span>
//                         </button>

//                         {/* إبلاغ */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'report',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: '0.33px solid #3C3C434D',
//                           }}
//                         >
//                           <img
//                             src="/imgs/report.svg"
//                             alt="إبلاغ"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                             }}
//                           >
//                             إبلاغ
//                           </span>
//                         </button>

//                         {/* بحث */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'search',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: '0.33px solid #3C3C434D',
//                           }}
//                         >
//                           <img
//                             src="/imgs/search.svg"
//                             alt="بحث"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                             }}
//                           >
//                             بحث
//                           </span>
//                         </button>

//                         {/* أرشفة */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'archive',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: '0.33px solid #3C3C434D',
//                           }}
//                         >
//                           <img
//                             src="/imgs/archive.svg"
//                             alt="أرشفة"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                             }}
//                           >
//                             {chat.isFavorite ? 'إزالة أرشفة' : 'أرشفة'}
//                           </span>
//                         </button>

//                         {/* حذف الدردشة */}
//                         <button
//                           onClick={() =>
//                             handleDropdownAction(
//                               'delete',
//                               chat.chatId,
//                               chat.chatType
//                             )
//                           }
//                           className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           style={{
//                             borderBottom: chat.isGroup
//                               ? '0.33px solid #3C3C434D'
//                               : 'none',
//                           }}
//                         >
//                           <img
//                             src="/imgs/delete.svg"
//                             alt="حذف"
//                             style={{ width: '16px', height: '16px' }}
//                           />
//                           <span
//                             style={{
//                               fontFamily: 'Cairo',
//                               fontWeight: 600,
//                               fontSize: '15px',
//                               color: '#D72229',
//                             }}
//                           >
//                             حذف الدردشة
//                           </span>
//                         </button>

//                         {/* خروج (للمجموعات فقط) */}
//                         {chat.isGroup && (
//                           <button
//                             onClick={() =>
//                               handleDropdownAction(
//                                 'leave',
//                                 chat.chatId,
//                                 chat.chatType
//                               )
//                             }
//                             className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
//                           >
//                             <img
//                               src="/imgs/leave.svg"
//                               alt="خروج"
//                               style={{ width: '16px', height: '16px' }}
//                             />
//                             <span
//                               style={{
//                                 fontFamily: 'Cairo',
//                                 fontWeight: 600,
//                                 fontSize: '15px',
//                                 color: '#D72229',
//                               }}
//                             >
//                               خروج
//                             </span>
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ===== Call Modal ===== */}
//       {/* ❌ امسحيها من هنا لأنها موجودة في SidebarArabic */}
//     </div>
//   );
// }



// src/app/chats/_components/ChatList.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ChatFilters from './ChatFilters';
import { useChats } from './hooks/useChats';
import { useCalls } from './hooks/useCalls';
import { useSelectionMode } from './hooks/useSelectionMode';
import { useDropdown } from './hooks/useDropdown';
import { useBlockedUsers } from './hooks/useBlockedUsers';
import { useCallContext } from '@/contexts/CallContext';

import CallInterface from './components/calls/CallInterface';
import GroupAvatar from './components/GroupAvatar';
import CreateGroupModal from './components/CreateGroupModal';

import { formatMessageTime } from './utils/formatTime';
import { FilterType } from './types';

type Props = {
  userId?: string | null;
  apiBase: string;
  activeChatId?: string | null;
};

export default function ChatList({
  userId: propUserId,
  apiBase,
  activeChatId: propActiveChatId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const activeChatId = propActiveChatId || pathname?.split('/').pop();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

  const [myUserId, setMyUserId] = useState<string>(propUserId || '');

  useEffect(() => {
    if (propUserId) {
      setMyUserId(propUserId);
      return;
    }
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setMyUserId(parsed._id || parsed.id || '');
    } catch {}
  }, [propUserId]);

  // ================= Hooks =================
  const {
    chats,
    searchedChats,
    loading,
    filterLoading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    handleFilterChange,
    getFilterCounts,
    markMessageAsSeen,
    updateChat,
    removeChats,
    fetchChats,
  } = useChats({ myUserId, apiBase, token });

  const {
    callMinutes: localCallMinutes,
    activeCall,
    isStarting: localIsStarting,
    startCall,
    endCall,
  } = useCalls({ apiBase, token });

  // ✅ CallContext (للربط مع SidebarArabic)
  const {
    openCallModal,
    setCallMinutes,
    setIsStarting,
    setStartCallHandler,
    selectedCallChat: ctxSelectedChat,
  } = useCallContext();

  const {
    selectionMode,
    selectedChats,
    toggleChatSelection,
    clearSelection,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  } = useSelectionMode();

  const { openDropdown, setOpenDropdown, setRef } = useDropdown();
  const { isUserBlocked } = useBlockedUsers({ apiBase, token });

  // ================= Modals =================
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const userName = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userData') || '{}');
      return data.name || data.username || 'User';
    } catch {
      return 'User';
    }
  })();

  // ================= Sync with Context =================

  // ✅ مزامنة الرصيد
  useEffect(() => {
    setCallMinutes(localCallMinutes);
  }, [localCallMinutes, setCallMinutes]);

  // ✅ مزامنة حالة البدء
  useEffect(() => {
    setIsStarting(localIsStarting);
  }, [localIsStarting, setIsStarting]);

  // ✅ سجّلي دالة startCall عشان SidebarArabic تستخدمها
  useEffect(() => {
    setStartCallHandler(() => (type: 'audio' | 'video') => {
      if (!ctxSelectedChat) return;
      startCall(type, ctxSelectedChat.chatId, ctxSelectedChat.name);
    });
  }, [ctxSelectedChat, startCall, setStartCallHandler]);

  // ================= Section Title =================
  const getSectionTitle = () => {
    if (selectionMode) return '';
    switch (activeFilter) {
      case 'all':
        return 'قسم الرسائل العام';
      case 'read':
        return 'قسم الرسائل المقروء';
      case 'unread':
        return 'قسم الرسائل غير المقروء';
      case 'starred':
        return 'قسم الرسائل المميزة';
      case 'groups':
        return 'قسم المجموعات';
      case 'calls':
        return 'قسم المكالمات';
      default:
        return 'قسم الرسائل العام';
    }
  };

  // ================= Dropdown Actions =================
  const handleDropdownAction = async (
    action: string,
    chatId: string,
    chatType: string
  ) => {
    setOpenDropdown(null);

    const chat: any = chats.find((c) => c.chatId === chatId);
    const chatName = chat?.name || 'هذه المحادثة';
    const isGroup = chatType === 'group' || chat?.isGroup;

    switch (action) {
      case 'block':
        await handleBlockUser(chatId, chatName);
        break;
      case 'report':
        toast.success('جاري فتح نافذة الإبلاغ...');
        break;
      case 'search':
        toast.info('جاري البحث في المحادثة...');
        break;
      case 'archive':
        await handleArchiveChat(chatId, chatType);
        break;
      case 'delete':
        await handleDeleteChat(chatId, chatType, chatName, isGroup);
        break;
      case 'leave':
        await handleLeaveGroup(chatId, chatName);
        break;
      // case 'call':
      //   // ✅ فتح CallModal في SidebarArabic
      //   openCallModal({
      //     chatId,
      //     name: chat?.name || 'مستخدم',
      //     userinfo: chat?.userinfo,
      //   });
      //   break;
      case 'call':
  // ✅ تمرير كل البيانات عشان CallContext يقدر يحدد إنه جروب
  openCallModal({
    chatId,
    name: chat?.name || 'مستخدم',
    userinfo: chat?.userinfo,
    isGroup: Boolean(chat?.isGroup),
    type: chat?.isGroup ? 'group' : 'single',
    chatType: chat?.chatType,
    members: Array.isArray(chat?.members) ? chat.members : [],
    participants: Array.isArray((chat as any)?.participants)
      ? (chat as any).participants
      : [],
  } as any);
  break;
    }
  };

  // ================= Block User =================
  const handleBlockUser = async (chatId: string, chatName: string) => {
    if (!token) return;
    const isBlocked = isUserBlocked(chatId);
    const url = isBlocked
      ? `${apiBase}/unblock${myUserId}`
      : `${apiBase}/block${myUserId}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockedid: chatId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(isBlocked ? 'تم رفع الحظر' : 'تم حظر المستخدم');
      } else {
        toast.error(`فشل: ${data.response || data.message || 'خطأ'}`);
      }
    } catch (error) {
      console.error('Block error:', error);
      toast.error('حدث خطأ أثناء العملية');
    }
  };

  // ================= Archive / Favorite =================
  const handleArchiveChat = async (chatId: string, chatType: string) => {
    if (!token) return;
    const currentChat = chats.find((c) => c.chatId === chatId);
    if (!currentChat) return;

    const isCurrentlyFavorite = currentChat.isFavorite || false;
    const url = isCurrentlyFavorite
      ? `${apiBase}/chats/unfavorite`
      : `${apiBase}/chats/favorite`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, chatType }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          isCurrentlyFavorite ? 'تم إزالة الأرشفة' : 'تمت الأرشفة'
        );
        updateChat(chatId, { isFavorite: !isCurrentlyFavorite } as any);
      } else {
        toast.error(`فشل: ${data.response || 'خطأ'}`);
      }
    } catch (error) {
      console.error('Archive error:', error);
      toast.error('حدث خطأ');
    }
  };

  // ================= Delete Chat =================
  const handleDeleteChat = async (
    chatId: string,
    chatType: string,
    chatName: string,
    isGroup: boolean
  ) => {
    if (!token) return;

    const endpoint = isGroup
      ? `${apiBase}/chats/groups/DeleteGroup/${chatId}`
      : `${apiBase}/chats/delete/${chatId}`;

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok && (data.success || data.status === 'success')) {
        toast.success(isGroup ? 'تم حذف المجموعة' : 'تم حذف المحادثة');
        removeChats([chatId]);
        if (activeChatId === chatId) {
          router.push('/chats');
        }
      } else {
        toast.error(
          `فشل الحذف: ${data.response || data.message || 'خطأ'}`
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  // ================= Leave Group =================
  const handleLeaveGroup = async (chatId: string, groupName: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${apiBase}/chats/groups/LeaveGroup/${chatId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('تم الخروج من المجموعة');
        removeChats([chatId]);
        if (activeChatId === chatId) {
          router.push('/chats');
        }
      } else {
        toast.error(`فشل الخروج: ${data.response || 'خطأ'}`);
      }
    } catch (error) {
      console.error('Leave error:', error);
      toast.error('حدث خطأ');
    }
  };

  // ================= Bulk Actions =================
  const handleBulkDelete = async () => {
    if (!token || selectedChats.length === 0) return;
    for (const id of selectedChats) {
      const chat = chats.find((c) => c.chatId === id);
      if (chat) {
        await handleDeleteChat(id, chat.chatType, chat.name, chat.isGroup);
      }
    }
    clearSelection();
  };

  const handleBulkArchive = async () => {
    if (selectedChats.length === 0) return;
    for (const id of selectedChats) {
      const chat = chats.find((c) => c.chatId === id);
      if (chat) await handleArchiveChat(id, chat.chatType);
    }
    clearSelection();
  };

  const handleBulkCall = () => clearSelection();
  const handleBulkGroupMessage = () => clearSelection();

  if (loading)
    return <div className="p-4 text-center">جارٍ التحميل...</div>;

  return (
    <div className="relative h-full flex flex-col">
      {/* ===== واجهة MediaSFU ===== */}
      {activeCall && (
        <CallInterface
          activeCall={activeCall}
          apiBase={apiBase}
          token={token}
          userName={userName}
          onClose={endCall}
        />
      )}

      {/* ===== Header ===== */}
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
            <img
              src="/imgs/createGrup.svg"
              alt="إنشاء مجموعة"
              className="w-6 h-6 block"
            />
          </button>
        )}
      </div>

      {/* ===== Selection Toolbar ===== */}
      {selectionMode && selectedChats.length > 0 && (
        <div
          className="w-full px-4 mb-3 -mt-10"
          style={{
            background:
              'linear-gradient(0deg, #FFFFFF 0%, #F2F2F2 46.74%)',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <div className="flex items-center justify-center gap-2 mt-[30px]">
            <button
              onClick={handleBulkDelete}
              className="hover:bg-[#FFEBEE] hover:scale-105 transition-all"
              style={{
                width: '63px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#B4B4B9',
                }}
              >
                حذف
              </span>
            </button>
            <button
              onClick={handleBulkGroupMessage}
              className="hover:bg-[#E8F5E9] hover:scale-105 transition-all"
              style={{
                width: '102px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#B4B4B9',
                }}
              >
                رسالة جماعية
              </span>
            </button>
            <button
              onClick={handleBulkCall}
              className="hover:bg-[#E8F4FD] hover:scale-105 transition-all"
              style={{
                width: '102px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#B4B4B9',
                }}
              >
                مكالمة جماعية
              </span>
            </button>
            <button
              onClick={handleBulkArchive}
              className="hover:bg-[#FFF8E1] hover:scale-105 transition-all"
              style={{
                width: '63px',
                height: '31px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#B4B4B9',
                }}
              >
                مميز
              </span>
            </button>
          </div>
          <div className="text-center mt-2">
            <span
              style={{
                fontFamily: 'Cairo',
                fontWeight: 600,
                fontSize: '25px',
                color: '#000',
              }}
            >
              تم تحديد {selectedChats.length} محادثة
            </span>
          </div>
        </div>
      )}

      {/* ===== Search ===== */}
      <div className="flex items-center justify-center w-full mb-3">
        <div className="w-[95%] bg-[#F2F2F2] flex h-[50px] items-center px-4 gap-1 rounded-[27px]">
          <Search className="text-[#B6B7B7]" />
          <input
            type="text"
            placeholder=" اكتب هنا ما تريد ان تكتشفه"
            className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ===== Filters ===== */}
      <ChatFilters
        onFilterChange={handleFilterChange as any}
        activeFilter={activeFilter as any}
        counts={getFilterCounts as any}
      />

      {/* ===== Calls Balance ===== */}
      {activeFilter === 'calls' && (
        <div className="flex items-center justify-between px-4 -mt-1">
          <div className="flex items-center gap-2">
            <img
              src="/imgs/fire-emergency-call 1.svg"
              alt="Call"
              style={{ width: '12px', height: '12px' }}
            />
            <span
              style={{
                color: '#171717',
                fontSize: '12px',
                fontFamily: 'Cairo',
                fontWeight: 600,
              }}
            >
              رصيدك الحالي
            </span>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span
              style={{
                color: '#171717',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Cairo',
              }}
            >
              {localCallMinutes.free}
            </span>
            <span
              style={{
                color: '#8899aa',
                fontSize: '14px',
                fontFamily: 'Cairo',
              }}
            >
              /
            </span>
            <span
              style={{
                color: '#171717',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Cairo',
              }}
            >
              {localCallMinutes.total}
            </span>
            <span
              style={{
                color: '#D72229',
                fontSize: '12px',
                fontFamily: 'Cairo',
              }}
            >
              دقيقة مجانية
            </span>
          </div>
        </div>
      )}

      {/* ===== Chat List ===== */}
      {filterLoading ? (
        <div className="text-center py-10 text-gray-500">
          جاري تحميل المحادثات...
        </div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-24">
          {searchedChats.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              {searchTerm.trim() !== ''
                ? `لا توجد محادثات مع "${searchTerm}"`
                : 'لا توجد محادثات في هذا القسم'}
            </div>
          )}

          {searchedChats.map((chat) => {
            const isLastFromMe = chat.lastMessage?.sender === myUserId;
            const isMessageSeen =
              chat.seen === true || chat.lastMessage?.seenBy === true;
            const hasUnread = chat.unreadCount > 0 && !isLastFromMe;
            const time = formatMessageTime(
              chat.lastMessage?.timestamp || ''
            );
            const isDropdownOpen = openDropdown === chat.chatId;
            const isSelected = selectedChats.includes(chat.chatId);

            return (
              <div
                key={chat.chatId}
                className={`flex items-center gap-3 px-3 py-1 transition cursor-pointer relative group ${
                  activeChatId === chat.chatId
                    ? 'active-chat'
                    : 'hover:bg-gray-100'
                } ${isSelected ? 'bg-[#FAFAFA] rounded-lg' : ''}`}
                dir="ltr"
                ref={(el) => setRef(chat.chatId, el)}
                onMouseDown={(e) => handleMouseDown(chat.chatId, e)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {selectionMode && (
                  <div className="flex-shrink-0">
                    <img
                      src={
                        isSelected
                          ? '/imgs/check (2).svg'
                          : '/imgs/uncheck.svg'
                      }
                      alt={isSelected ? 'محدد' : 'غير محدد'}
                      onClick={() => toggleChatSelection(chat.chatId)}
                      style={{
                        width: '20px',
                        height: '20px',
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
                      if (isLastFromMe && chat.lastMessage?._id) {
                        markMessageAsSeen(chat.lastMessage._id);
                      }
                      updateChat(chat.chatId, { unreadCount: 0 } as any);

                      // ✅ للمجموعات: استخدمي groupId
                      const targetId = chat.isGroup
                        ? (chat as any).groupId || chat.chatId
                        : chat.chatId;

                      console.log('🖱️ Navigate to:', {
                        isGroup: chat.isGroup,
                        chatId: chat.chatId,
                        groupId: (chat as any).groupId,
                        targetId,
                      });

                      router.push(`/chats/${targetId}`);
                    }
                  }}
                >
                  {/* ✅ عرض الجروب أو الصورة العادية */}
                  {chat.isGroup ? (
                    <GroupAvatar chat={chat} myUserId={myUserId} />
                  ) : (
                    <img
                      src={chat.userinfo?.img || '/imgs/user.png'}
                      className="w-[60px] h-[60px] rounded-[25px] object-cover flex-shrink-0"
                      alt={chat.userinfo?.name}
                    />
                  )}

                  <div className="flex-1">
                    <div className="font-medium text-black flex items-center justify-between">
                      <div className="flex flex-col">
                        <span
                          className="truncate"
                          style={{
                            fontSize: chat.isGroup ? '18px' : '16px',
                          }}
                        >
                          {chat.name}
                        </span>
                        {chat.isGroup &&
                          chat.description &&
                          chat.description !== 'no' && (
                            <span
                              className="truncate"
                              style={{
                                fontFamily: 'Cairo',
                                fontSize: '15px',
                                color: '#000000',
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {chat.description}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="text-sm text-[#B4B4B9] truncate max-w-[120px] overflow-hidden">
                      {chat.typing
                        ? 'يكتب الان ...'
                        : chat.lastMessage?.message || ''}
                    </div>
                  </div>
                </div>

                {!selectionMode && (
                  <div className="flex flex-col items-center gap-1 mt-6">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">
                        {time}
                      </span>
                      <img
                        src={
                          isMessageSeen
                            ? '/imgs/read.svg'
                            : '/imgs/unread.svg'
                        }
                        alt={isMessageSeen ? 'مقروءة' : 'غير مقروءة'}
                        style={{ width: '13px', height: '12px' }}
                      />
                    </div>

                    {chat.isFavorite && (
                      <img
                        src="/imgs/archive (2).svg"
                        alt="مؤرشفة"
                        style={{ width: '13px', height: '13px' }}
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
                          fontSize: '10px',
                        }}
                      >
                        {chat.unreadCount}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          isDropdownOpen ? null : chat.chatId
                        );
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
                          transform: isDropdownOpen
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        }}
                      />
                    </button>

                    {/* ===== القائمة المنسدلة الكاملة ===== */}
                    {isDropdownOpen && (
                      <div
                        className="absolute top-full right-2 mt-1 rounded-lg shadow-lg z-50 py-1"
                        style={{
                          width: '154px',
                          borderRadius: '8px',
                          backgroundColor: '#F5F5F5',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* اتصال */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'call',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <img
                            src="/imgs/fire-emergency-call 1.svg"
                            alt="اتصال"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                            }}
                          >
                            اتصال
                          </span>
                        </button>

                        {/* حظر / رفع الحظر */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'block',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <img
                            src="/imgs/block.svg"
                            alt="حظر"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                            }}
                          >
                            {isUserBlocked(chat.chatId)
                              ? 'رفع الحظر'
                              : 'حظر'}
                          </span>
                        </button>

                        {/* إبلاغ */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'report',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <img
                            src="/imgs/report.svg"
                            alt="إبلاغ"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                            }}
                          >
                            إبلاغ
                          </span>
                        </button>

                        {/* بحث */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'search',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <img
                            src="/imgs/search.svg"
                            alt="بحث"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                            }}
                          >
                            بحث
                          </span>
                        </button>

                        {/* أرشفة */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'archive',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: '0.33px solid #3C3C434D',
                          }}
                        >
                          <img
                            src="/imgs/archive.svg"
                            alt="أرشفة"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                            }}
                          >
                            {chat.isFavorite ? 'إزالة أرشفة' : 'أرشفة'}
                          </span>
                        </button>

                        {/* حذف الدردشة */}
                        <button
                          onClick={() =>
                            handleDropdownAction(
                              'delete',
                              chat.chatId,
                              chat.chatType
                            )
                          }
                          className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          style={{
                            borderBottom: chat.isGroup
                              ? '0.33px solid #3C3C434D'
                              : 'none',
                          }}
                        >
                          <img
                            src="/imgs/delete.svg"
                            alt="حذف"
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'Cairo',
                              fontWeight: 600,
                              fontSize: '15px',
                              color: '#D72229',
                            }}
                          >
                            حذف الدردشة
                          </span>
                        </button>

                        {/* خروج (للمجموعات فقط) */}
                        {chat.isGroup && (
                          <button
                            onClick={() =>
                              handleDropdownAction(
                                'leave',
                                chat.chatId,
                                chat.chatType
                              )
                            }
                            className="w-full px-2 py-3 text-sm hover:bg-white flex items-center justify-between gap-2"
                          >
                            <img
                              src="/imgs/leave.svg"
                              alt="خروج"
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span
                              style={{
                                fontFamily: 'Cairo',
                                fontWeight: 600,
                                fontSize: '15px',
                                color: '#D72229',
                              }}
                            >
                              خروج
                            </span>
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

      {/* ===== Create Group Modal ===== */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        apiBase={apiBase}
        token={token}
        myUserId={myUserId}
        chats={chats}
        onSuccess={async (groupId) => {
          await fetchChats('all');
          router.push(`/chats/${groupId}`);
        }}
      />

      {/* ===== Call Modal ===== */}
      {/* ❌ امسحيها من هنا لأنها موجودة في SidebarArabic */}
    </div>
  );
}