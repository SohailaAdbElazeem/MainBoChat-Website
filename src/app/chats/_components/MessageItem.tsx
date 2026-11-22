//  // app/chats/_components/MessageItem.tsx
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable jsx-a11y/alt-text */
// 'use client';
// import { useMemo, useState, useEffect, useRef, useCallback } from "react";
// import { Message } from "@/types/types";
// import VoicePlayer from "./VoicePlayer";
// import { MessageMenu } from "./MessageMenu";
// import "../css/custom.css";
// import wsService from "@/lib/websocketService";

// // ================= دوال مساعدة للملفات =================
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";

// /**
//  * الحصول على أيقونة الملف حسب النوع
//  */
// const getFileIcon = (type: string): string => {
//   switch (type) {
//     case 'pdf': return '/icons/pdf.svg';
//     case 'word': return '/icons/word.svg';
//     case 'excel': return '/icons/excel.svg';
//     case 'powerpoint': return '/icons/ppt.svg';
//     case 'archive': return '/icons/zip.svg';
//     case 'text': return '/icons/txt.svg';
//     case 'audio': return '/icons/audio-file.svg';
//     case 'video': return '/icons/video-file.svg';
//     default: return '/icons/file.svg';
//   }
// };

// /**
//  * الحصول على لون الملف حسب النوع
//  */
// const getFileColor = (type: string): string => {
//   switch (type) {
//     case 'pdf': return '#FF4444';
//     case 'word': return '#2B579A';
//     case 'excel': return '#217346';
//     case 'powerpoint': return '#D24726';
//     case 'archive': return '#FF9800';
//     case 'text': return '#607D8B';
//     case 'audio': return '#9C27B0';
//     case 'video': return '#E91E63';
//     default: return '#757575';
//   }
// };

// /**
//  * تنسيق حجم الملف
//  */
// const formatFileSize = (bytes: number): string => {
//   if (bytes === 0) return '0 B';
//   const k = 1024;
//   const sizes = ['B', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// /**
//  * الحصول على امتداد الملف
//  */
// const getFileExtension = (fileName: string): string => {
//   if (!fileName) return '';
//   const ext = fileName.split('.').pop();
//   return ext ? ext.toUpperCase() : '';
// };

// /**
//  * التحقق من أن الملف صورة
//  */
// const isImageFile = (type: string): boolean => {
//   return type === 'image' || type === 'sticker';
// };

// /**
//  * التحقق من أن الملف فيديو
//  */
// const isVideoFile = (type: string): boolean => {
//   return type === 'video';
// };

// /**
//  * التحقق من أن الملف صوت
//  */
// const isAudioFile = (type: string): boolean => {
//   return type === 'audio';
// };

// /**
//  * التحقق من أن الملف مستند
//  */
// const isDocumentFile = (type: string): boolean => {
//   const docTypes = ['pdf', 'word', 'excel', 'powerpoint', 'archive', 'text', 'file'];
//   return docTypes.includes(type);
// };

// /**
//  * Convert media to playable URL
//  * بتدعم: string / Blob / File / object فيه url أو fileContent / array
//  */
// const useMediaUrl = (media: any) => {
//   return useMemo(() => {
//     if (!media) return null;

//     const resolve = (item: any): string | null => {
//       if (!item) return null;
//       if (item instanceof File || item instanceof Blob) {
//         return URL.createObjectURL(item);
//       }
//       const raw = typeof item === "string" ? item : item.url || item.fileContent;
//       if (!raw || typeof raw !== "string") return null;
//       return /^(https?:|data:|blob:)/.test(raw)
//         ? raw
//         : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
//     };

//     return resolve(Array.isArray(media) ? media[0] : media);
//   }, [media]);
// };

// export const MessageItem = ({
//   m,
//   myId,
//   index,
//   recieverImg,
//   prevMessage,
//   isGroupAdmin = false,
//   onReact,
//   onEdit,
//   onReply,
//   onTranslate,
//   onDelete,
//   onCopy,
//   showReactions = true,
//   onRetry,
//   onImageClick,
//   onFileClick,
//   // ✅ props الترجمة
//   translation,
//   isTranslating,
//   onCopyTranslation,
//   onClearTranslation,
// }: {
//   m: Message;
//   myId: string | null;
//   onRetry: (m: Message) => void;
//   index: number;
//   recieverImg: string;
//   prevMessage?: Message;
//   isGroupAdmin?: boolean;
//   onReact?: (messageId: string, emoji: string) => void;
//   onEdit?: (message: Message) => void;
//   onReply?: (message: Message) => void;
//   onTranslate?: (message: Message) => void;
//   onDelete?: (message: Message) => void;
//   onCopy?: (text: string) => void;
//   showReactions?: boolean;
//   onImageClick?: (imageUrl: string) => void;
//   onFileClick?: (fileUrl: string, fileName: string) => void;

//     // ✅ props الترجمة
//   translation?: string;
//   isTranslating?: boolean;
//   onCopyTranslation?: (text: string) => void;
//   onClearTranslation?: () => void;

// }) => {
//   const mine = m.sender === myId;
//   // ✅ تحديد إذا كانت الرسالة مقروءة
// const isMessageRead =
//   (m as any).isRead === true ||
//   (m as any).read === true ||
//   (m as any).seen === true ||
//   (m as any).isSeen === true ||
//   (m as any).readBy === myId ||
//   (Array.isArray((m as any).readBy) && (m as any).readBy.length > 0) ||
//   (Array.isArray((m as any).seenBy) && (m as any).seenBy.length > 0);
//   const isThird = (index + 1) % 2 === 0;
//   const mediaUrl = useMediaUrl(m.media ?? (m as any).fileData);

//   // State للقائمة المنسدلة
//   const [showMenu, setShowMenu] = useState(false);
//   const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(m.message || '');
//   const messageRef = useRef<HTMLDivElement>(null);
//   const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

//   // State للـ Like
//   const [liked, setLiked] = useState(m.likes?.includes(myId ?? ""));
//   const [likesCount, setLikesCount] = useState(m.likes?.length || 0);
//   const [reactions, setReactions] = useState<string[]>(m.likes || []);

//   useEffect(() => {
//     setLiked(m.likes?.includes(myId ?? ""));
//     setLikesCount(m.likes?.length || 0);
//     setReactions(m.likes || []);
//   }, [m.likes, myId]);

//   // معالجة الـ Like
//   const handleLike = async () => {
//     if (!myId || liked) return;

//     setLiked(true);
//     setLikesCount((prev) => prev + 1);
//     setReactions((prev) => [...prev, '❤️']);

//     const token = localStorage.getItem("boChatToken");
//     if (!token) return;

//     try {
//       await fetch("https://bo-chat.space/reacttomessage", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           reacter: myId,
//           messageid: m._id?.toString(),
//         }),
//       });

//       wsService.send({
//         event: "react",
//         metadata: {
//           sender: myId,
//           messageid: m._id?.toString(),
//           reciever: m.sender,
//         },
//       });
//     } catch (err) {
//       console.error("LIKE ERROR", err);
//       setLiked(false);
//       setLikesCount((prev) => Math.max(prev - 1, 0));
//       setReactions((prev) => prev.filter(r => r !== '❤️'));
//     }
//   };

//   // معالجة التفاعل من القائمة
//   const handleReact = (messageId: string, emoji: string) => {
//     if (onReact) {
//       onReact(messageId, emoji);
//     } else {
//       if (!myId) return;
//       setReactions((prev) => [...prev, emoji]);
//       setLikesCount((prev) => prev + 1);

//       const token = localStorage.getItem("boChatToken");
//       if (!token) return;

//       fetch("https://bo-chat.space/reacttomessage", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           reacter: myId,
//           messageid: messageId,
//         }),
//       }).catch(console.error);
//     }
//   };

//   // معالجة الضغط المطول (Long Press) - للماوس
//   const handleLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
//     e.preventDefault();
//     let clientX: number, clientY: number;

//     if ('touches' in e) {
//       const touch = e.touches[0];
//       clientX = touch.clientX;
//       clientY = touch.clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     if (isEditing) return;

//     setMenuPosition({ x: clientX, y: clientY });
//     setShowMenu(true);
//   }, [isEditing]);

//   // معالجة الضغط المطول - للهواتف (Touch)
//   const handleTouchStart = useCallback((e: React.TouchEvent) => {
//     if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
//     touchTimerRef.current = setTimeout(() => {
//       handleLongPress(e);
//     }, 500);
//   }, [handleLongPress]);

//   const handleTouchEnd = useCallback(() => {
//     if (touchTimerRef.current) {
//       clearTimeout(touchTimerRef.current);
//       touchTimerRef.current = null;
//     }
//   }, []);

//   const handleTouchMove = useCallback(() => {
//     if (touchTimerRef.current) {
//       clearTimeout(touchTimerRef.current);
//       touchTimerRef.current = null;
//     }
//   }, []);

//   // معالجة النسخ
//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text).catch(console.error);
//   };

//   // معالجة التعديل
//   const handleEdit = async () => {
//     if (!editText.trim() || !onEdit) return;
//     await onEdit({ ...m, message: editText });
//     setIsEditing(false);
//   };

//   // معالجة إلغاء التعديل
//   const cancelEdit = () => {
//     setIsEditing(false);
//     setEditText(m.message || '');
//   };

//   // تنسيق التاريخ
//   const isSameDay = (d1: Date, d2: Date) =>
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate();

//   const getDateLabel = (date: Date) => {
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (isSameDay(date, today)) return "اليوم";
//     if (isSameDay(date, yesterday)) return "أمس";

//     return date.toLocaleDateString("ar-EG", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const messageDate = new Date(m.timestamp);
//   const showDateHeader = !prevMessage || !isSameDay(new Date(prevMessage.timestamp), messageDate);
//   const dateLabel = getDateLabel(messageDate);

//   // مكون دائرة التقدم
//   const ProgressCircle = ({ value }: { value: number }) => {
//     const radius = 18;
//     const stroke = 3;
//     const normalized = radius - stroke * 2;
//     const circumference = normalized * 2 * Math.PI;
//     const offset = circumference - (value / 100) * circumference;

//     return (
//       <svg width={40} height={40}>
//         <circle
//           stroke="#fee2e2"
//           fill="transparent"
//           strokeWidth={stroke}
//           r={normalized}
//           cx={20}
//           cy={20}
//         />
//         <circle
//           stroke="#dc2626"
//           fill="transparent"
//           strokeWidth={stroke}
//           strokeDasharray={`${circumference} ${circumference}`}
//           style={{ strokeDashoffset: offset, transition: "0.2s" }}
//           r={normalized}
//           cx={20}
//           cy={20}
//         />
//       </svg>
//     );
//   };

//   // ================= عرض الملف =================
//   const renderFileMessage = () => {
//     const fileUrl = mediaUrl || '';
//     const fileName = m.fileName || m.message || 'ملف';
//     const fileSize = m.fileSize || 0;
//     const fileType = m.type || 'file';
//     const fileExtension = getFileExtension(fileName);
//     const icon = getFileIcon(fileType);
//     const color = getFileColor(fileType);

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 min-w-[200px] max-w-[280px] ${
//             mine ? "bg-[#D72229] text-white" : "bg-[#F3F5FF] text-[#D72229]"
//           } ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (fileUrl && onFileClick) {
//               onFileClick(fileUrl, fileName);
//             } else if (fileUrl) {
//               window.open(fileUrl, '_blank');
//             }
//           }}
//           onDoubleClick={() => handleLike()}
//         >
//           {/* أيقونة الملف */}
//           <div
//             className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20"
//           >
//             <img
//               src={icon}
//               alt={fileType}
//               className="w-7 h-7 object-contain"
//             />
//           </div>

//           {/* معلومات الملف */}
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">
//               {fileName}
//             </p>
//             <div className="flex items-center gap-2 text-xs opacity-70">
//               <span>{fileExtension}</span>
//               <span>•</span>
//               <span>{formatFileSize(fileSize)}</span>
//             </div>
//           </div>

//           {/* زر التحميل */}
//           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
//             <img src="/icons/download.svg" alt="تحميل" className="w-4 h-4" />
//           </div>
//         </div>

//         {/* ردود الفعل */}
//         {likesCount > 0 && showReactions && (
//           <div style={{ fontSize: 14 }}>
//             <img
//               src="/icons/like.svg"
//               style={{
//                 filter: mine
//                   ? "brightness(0) saturate(100%) invert(1)"
//                   : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
//               }}
//               alt="like-icon"
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ================= عرض الصورة =================
//   const renderImageMessage = () => {
//     if (!mediaUrl) return null;

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           style={{ position: "relative", display: "inline-block" }}
//           onDoubleClick={() => handleLike()}
//         >
//           <div
//             className={`flex items-center overflow-hidden w-[200px] max-h-[250px] p-4 rounded-[18px] ${
//               mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"
//             } ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}
//             onClick={() => {
//               if (onImageClick && mediaUrl) {
//                 onImageClick(mediaUrl);
//               }
//             }}
//           >
//             <img
//               src={mediaUrl}
//               style={{
//                 maxWidth: "100%",
//                 opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
//               }}
//               className="rounded-[18px] object-cover cursor-pointer"
//               alt="image"
//               loading="lazy"
//               referrerPolicy="no-referrer"
//               width={180}
//               height={230}
//             />
//           </div>

//           {/* تقدم التحميل */}
//           {typeof m.uploadProgress === "number" && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               <ProgressCircle value={m.uploadProgress} />
//             </div>
//           )}

//           {/* ردود الفعل */}
//           {likesCount > 0 && showReactions && (
//             <div style={{ fontSize: 14 }}>
//               <img
//                 src="/icons/like.svg"
//                 style={{
//                   filter: mine
//                     ? "brightness(0) saturate(100%) invert(1)"
//                     : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//                 }}
//                 alt="like-icon"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ================= عرض الفيديو =================
//   const renderVideoMessage = () => {
//     if (!mediaUrl) return null;

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <video
//           src={mediaUrl}
//           controls
//           style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 300 }}
//           controlsList="nodownload noremoteplayback"
//           disablePictureInPicture
//           className="rounded-[18px]"
//         />
//         {likesCount > 0 && showReactions && (
//           <div style={{ fontSize: 14 }}>
//             <img
//               src="/icons/like.svg"
//               style={{
//                 filter: mine
//                   ? "brightness(0) saturate(100%) invert(1)"
//                   : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//               }}
//               alt="like-icon"
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ================= عرض الصوت =================
//   const renderAudioMessage = () => {
//     if (!mediaUrl) return null;

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           onDoubleClick={() => handleLike()}
//           className={`px-4 py-2.5 rounded-[25px]
//             ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"}
//             ${isThird ? (mine ? "message-mine" : "message-other") : ""}
//             ${m._sendFailed ? "opacity-60" : ""}`}
//         >
//           <VoicePlayer media={mediaUrl} isMe={mine} peaks={(m as any).waveData} />
//         </div>

//         {likesCount > 0 && showReactions && (
//           <div style={{ fontSize: 14 }}>
//             <img
//               src="/icons/like.svg"
//               style={{
//                 filter: mine
//                   ? "brightness(0) saturate(100%) invert(1)"
//                   : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
//               }}
//               alt="like-icon"
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ================= عرض الملصق =================
//   const renderStickerMessage = () => {
//     if (!mediaUrl) return null;

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           style={{ position: "relative", display: "inline-block" }}
//           onDoubleClick={() => handleLike()}
//         >
//           <img
//             src={mediaUrl}
//             style={{
//               maxWidth: "100%",
//               opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
//             }}
//             className="rounded-[18px] object-cover"
//             alt="sticker"
//             loading="lazy"
//             referrerPolicy="no-referrer"
//             width={180}
//             height={230}
//           />
//         </div>
//         {likesCount > 0 && showReactions && (
//           <div style={{ fontSize: 14 }}>
//             <img
//               src="/icons/like.svg"
//               style={{
//                 filter: mine
//                   ? "brightness(0) saturate(100%) invert(1)"
//                   : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//               }}
//               alt="like-icon"
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ================= عرض الرسالة النصية =================
//   const renderTextMessage = () => {
//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           className={`
//             ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
//             ${isThird ? (mine ? "message-mine" : "message-other") : ""}
//             flex items-center justify-center px-5 py-2.5
//             text-[18px] !rounded-[25px]
//             ${isEditing ? 'p-0 overflow-hidden' : ''}
//             ${m._sendFailed ? 'opacity-60' : ''}
//           `}
//           onDoubleClick={() => handleLike()}
//         >
//           {isEditing ? (
//             <div className="flex flex-col gap-2 p-2">
//               <input
//                 type="text"
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-black min-w-[200px]"
//                 autoFocus
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') handleEdit();
//                   if (e.key === 'Escape') cancelEdit();
//                 }}
//               />
//               <div className="flex gap-2 justify-end">
//                 <button
//                   onClick={handleEdit}
//                   className="px-3 py-1 bg-[#D72229] text-white rounded-lg text-sm"
//                 >
//                   حفظ
//                 </button>
//                 <button
//                   onClick={cancelEdit}
//                   className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
//                 >
//                   إلغاء
//                 </button>
//               </div>
//             </div>
//           ) : (
//             m.message
//           )}
//         </div>
//         {likesCount > 0 && showReactions && (
//           <div style={{ fontSize: 14 }}>
//             <img
//               src="/icons/like.svg"
//               style={{
//                 filter: mine
//                   ? "brightness(0) saturate(100%) invert(1)"
//                   : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
//               }}
//               alt="like-icon"
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//     // ================= عرض رسالة المكالمة =================
//   const renderCallMessage = () => {
//     const callData = (m as any).callData || {};
//     const isMissed =
//       callData.status === 'missed' ||
//       callData.callStatus === 'missed' ||
//       m.message?.toLowerCase().includes('missed') ||
//       m.message?.includes('فائتة');

//     const label = isMissed ? 'مكالمة فائتة' : (m.message || 'مكالمة');

//     const callTime =
//       callData.time ||
//       callData.callTime ||
//       new Date(m.timestamp).toLocaleTimeString('ar-EG', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//       });

  
//     const bgColor = mine ? '#D72229' : '#F3F5FF';
//     const textColor = mine ? '#FFFFFF' : '#D72229';

//     return (
//       <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//         <div
//           style={{
//              position: 'relative', 
//             width: 200,
//             height: 93,
//             borderRadius: 25,
//             background: bgColor,
//             padding: '10px 14px',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             boxSizing: 'border-box',
//           }}
//           onDoubleClick={() => handleLike()}
//           dir="rtl"
//         >
//    <div
//     style={{
//       position: 'absolute',
//       width: 15,
//       height: 15,
//       top: '50%',
//       [mine ? 'right' : 'left']: -4, 
//       transform: 'translateY(-50%) rotate(45deg)',
//       borderRadius: 3,
//       background: bgColor,
//     }}
//   />
//  <div
//   className="flex items-center gap-2"
//   dir="rtl"
//   style={{ justifyContent: 'flex-start' }}
// >
//    <div
//     style={{
//       width: 34,
//       height: 34,
//       borderRadius: '50%',
//       background: mine ? '#FFFFFF' : '#D72229',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexShrink: 0,
//     }}
//   >
//     <img
//       src={mine ? '/imgs/phone-cross.svg' : '/imgs/phone-cross%204.svg'}
//       alt="call"
//       style={{ width: 14, height: 14, objectFit: 'contain', display: 'block' }}
//       onError={(e) => {
//         console.warn('phone-cross image not found');
//         (e.target as HTMLImageElement).style.display = 'none';
//       }}
//     />
//   </div>

//    <div
//     style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-start',
//       gap: 4,
//       minWidth: 0,
//     }}
//   >
//      <span
//       style={{
//         fontFamily: 'Cairo, sans-serif',
//         fontWeight: 600,
//         fontStyle: 'normal',
//         fontSize: 14,
//         lineHeight: 1,
//         letterSpacing: '0%',
//         color: mine ? '#FFFFFF' : '#D72229',
//         textAlign: 'right',
//         whiteSpace: 'nowrap',
//       }}
//     >
//       {label}
//     </span>

//     {/* الوقت تحت النص مباشرة */}
//     <span
//       style={{
//         fontFamily: 'Cairo, sans-serif',
//         fontWeight: 600,
//         fontStyle: 'normal',
//         fontSize: 9,
//         lineHeight: 1,
//         letterSpacing: '0%',
//         color: mine ? '#000000' : '#000000',
//         textAlign: 'right',
//         opacity: 0.85,
//         whiteSpace: 'nowrap',
//       }}
//     >
//       {callTime}
//     </span>
//   </div>
// </div>

//           {/* ===== زر إعادة الاتصال ===== */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               if (onCallBack) {
//                 onCallBack(m);
//               } else {
//                 console.log('Callback requested for:', m);
//               }
//             }}
//             style={{
//               width: 120,
//               height: 30,
//               borderRadius: 10,
//               background: '#FFFFFF',
//               backdropFilter: 'blur(4px)',
//               border: 'none',
//               cursor: 'pointer',
//               fontFamily: 'Cairo, sans-serif',
//               fontWeight: 600,
//               fontStyle: 'normal',
//               fontSize: 12,
//               lineHeight: 1,
//               letterSpacing: '0%',
//               textAlign: 'center',
//               color: '#000000',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               alignSelf: 'center',
//               padding: 0,
//             }}
//           >
//             إعادة الاتصال
//           </button>
//         </div>
//       </div>
//     );
//   };
//   // ================= اختيار نوع العرض حسب نوع الرسالة =================
//   const renderContent = () => {
//     if (m.type === 'text' || !m.type) {
//       return renderTextMessage();
//     }

//     if (m.type === 'image') {
//       return renderImageMessage();
//     }

//     if (m.type === 'video') {
//       return renderVideoMessage();
//     }

//     if (m.type === 'audio') {
//       return renderAudioMessage();
//     }

//     if (m.type === 'sticker') {
//       return renderStickerMessage();
//     }
//     if (m.type === 'call') {
//       return renderCallMessage();
//     }
//     // جميع أنواع الملفات الأخرى (PDF, Word, Excel, إلخ)
//     if (isDocumentFile(m.type)) {
//       return renderFileMessage();
//     }

//     // نوع غير معروف - عرض كنص
//     return renderTextMessage();
//   };

//   // return (
//   //   <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative">
//   //     {showDateHeader && (
//   //       <div className="flex justify-center my-3 w-[100%] position-relative date-label">
//   //         <span className="px-4 py-1 text-sm text-[#B4B4B9] bg-[#fff] z-[99] text-center">
//   //           {dateLabel}
//   //         </span>
//   //       </div>
//   //     )}

//   //     <div
//   //       ref={messageRef}
//   //       className="flex-row flex relative"
//   //       style={{
//   //         alignSelf: mine ? "flex-start" : "flex-end",
//   //         maxWidth: "70%",
//   //       }}
//   //       onContextMenu={handleLongPress}
//   //       onTouchStart={handleTouchStart}
//   //       onTouchEnd={handleTouchEnd}
//   //       onTouchMove={handleTouchMove}
//   //     >
//   //       {renderContent()}

//   //       {/* Avatar */}
//   //       {!mine && isThird ? (
//   //         <img
//   //           src={recieverImg || '/imgs/user.png'}
//   //           className="w-[40px] h-[40px] rounded-full mr-2"
//   //           alt="avatar"
//   //         />
//   //       ) : (
//   //         <div className="w-[40px] h-[40px] rounded-full mr-2"></div>
//   //       )}

//   //       {/* زر إعادة المحاولة للرسائل الفاشلة */}
//   //       {m._sendFailed && (
//   //         <button
//   //           onClick={() => onRetry(m)}
//   //           className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm z-10"
//   //         >
//   //           <span>إعادة المحاولة</span>
//   //           <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//   //           </svg>
//   //         </button>
//   //       )}
//   //     </div>

//   //     {/* القائمة المنسدلة */}
//   //     {showMenu && (
//   //       <MessageMenu
//   //         message={m}
//   //         myId={myId}
//   //         isGroupAdmin={isGroupAdmin}
//   //         onReact={handleReact}
//   //         onCopy={onCopy || handleCopy}
//   //         onEdit={(msg) => {
//   //           setIsEditing(true);
//   //           setEditText(msg.message || '');
//   //         }}
//   //         onReply={onReply || (() => {})}
//   //         onTranslate={onTranslate || ((msg) => {
//   //           console.log('Translate:', msg);
//   //         })}
//   //         onDelete={onDelete || (() => {})}
//   //         onClose={() => setShowMenu(false)}
//   //         position={menuPosition}
//   //       />
//   //     )}
//   //   </div>
//   // );

//     return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative">
//       {showDateHeader && (
//         <div className="flex justify-center my-3 w-[100%] position-relative date-label">
//           <span className="px-4 py-1 text-sm text-[#B4B4B9] bg-[#fff] z-[99] text-center">
//             {dateLabel}
//           </span>
//         </div>
//       )}

//       {/* <div
//         ref={messageRef}
//         className="flex-row flex relative"
//         style={{
//           alignSelf: mine ? "flex-start" : "flex-end",
//           maxWidth: "70%",
//         }}
//         onContextMenu={handleLongPress}
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//         onTouchMove={handleTouchMove}
//       >
//         {renderContent()}

//          {!mine && isThird ? (
//           <img
//             src={recieverImg || '/imgs/user.png'}
//             className="w-[40px] h-[40px] rounded-full mr-2"
//             alt="avatar"
//           />
//         ) : (
//           <div className="w-[40px] h-[40px] rounded-full mr-2"></div>
//         )}

//          {m._sendFailed && (
//           <button
//             onClick={() => onRetry(m)}
//             className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm z-10"
//           >
//             <span>إعادة المحاولة</span>
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//           </button>
//         )}
//       </div> */}
// <div
//   ref={messageRef}
//   className="flex-row flex relative items-end"
//   style={{
//     alignSelf: mine ? "flex-start" : "flex-end",
//     maxWidth: "70%",
//   }}
//   onContextMenu={handleLongPress}
//   onTouchStart={handleTouchStart}
//   onTouchEnd={handleTouchEnd}
//   onTouchMove={handleTouchMove}
// >
// {/* ✅ علامة مقروء/غير مقروء — جانب رسائل الطرف الآخر */}
// {!mine && (
//   <div
//     className="flex items-center flex-shrink-0"
//     style={{ marginLeft: 6, marginBottom: 4 }}
//     title={isMessageRead ? 'تم القراءة' : 'لم تُقرأ'}
//   >
//     <img
//       src={isMessageRead ? '/imgs/read.svg' : '/imgs/unRead.svg'}
//       alt={isMessageRead ? 'read' : 'unread'}
//       style={{
//         width: 10,
//         height: 9,
//         objectFit: 'contain',
//         display: 'block',
//         opacity: 1,
//       }}
//       onError={(e) => {
//         console.warn(`${isMessageRead ? 'read' : 'unRead'}.svg not found`);
//         (e.target as HTMLImageElement).style.display = 'none';
//       }}
//     />
//   </div>
// )}

//   {renderContent()}

//   {/* ✅ صورة الشخص الآخر — تظهر جانب كل رسالة من رسائله */}
//   {!mine && (
//     <img
//       // src={recieverImg || '/imgs/user.png'}
//       // className="w-[40px] h-[40px] rounded-full mr-2 object-cover flex-shrink-0"
//       src={recieverImg || '/imgs/user.png'}
//       className="w-[40px] h-[40px] rounded-full mr-2 object-cover flex-shrink-0"
//       alt="avatar"
//       onError={(e) => {
//         (e.target as HTMLImageElement).src = '/imgs/user.png';
//       }}
//     />
//   )}

    
// {/* ✅ علامتين صح — تظهر جانب كل رسالة أرسلها الشخص الآخر */}

//   {/* زر إعادة المحاولة للرسائل الفاشلة */}
//   {m._sendFailed && (
//     <button
//       onClick={() => onRetry(m)}
//       className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm z-10"
//     >
//       <span>إعادة المحاولة</span>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-3 h-3"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//         />
//       </svg>
//     </button>
//   )}
// </div>
//       {/* ⬇️⬇️⬇️ بلوكة الترجمة — الجديدة ⬇️⬇️⬇️ */}
//       {(isTranslating || translation) && (
//         <div
//           dir="rtl"
//           style={{
//             alignSelf: mine ? "flex-start" : "flex-end",
//             maxWidth: "70%",
//             paddingLeft: 48,
//             paddingRight: 48,
//           }}
//         >
//           {isTranslating && !translation && (
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F3F5FF] text-[#6B7280] text-xs">
//               <span className="w-3 h-3 border-2 border-[#B4B4B9] border-t-transparent rounded-full animate-spin" />
//               جاري الترجمة...
//             </div>
//           )}

//           {translation && (
//             <div className="flex items-center gap-2" dir="rtl">
//               <div
//                 style={{
//                   minWidth: '187px',
//                   minHeight: '50px',
//                   borderRadius: '25px',
//                   border: '1px solid #D72229',
//                   background: '#D72229',
//                   padding: '12px 20px',
//                   fontFamily: 'Cairo, sans-serif',
//                   fontWeight: 600,
//                   fontStyle: 'normal',
//                   fontSize: '14px',
//                   lineHeight: '1',
//                   letterSpacing: '0%',
//                   color: '#FFFFFF',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   textAlign: 'center',
//                   wordBreak: 'break-word',
//                 }}
//               >
//                 {translation}
//               </div>

//               <button
//                 type="button"
//                 onClick={onClearTranslation}
//                 className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#D72229] hover:bg-[#D72229]/10 transition shrink-0"
//                 title="إخفاء الترجمة"
//               >
//                 <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
//                   <path
//                     d="M4 4L12 12M12 4L4 12"
//                     stroke="#D72229"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//       {/* ⬆️⬆️⬆️ نهاية بلوكة الترجمة ⬆️⬆️⬆️ */}

//       {/* القائمة المنسدلة */}
//       {showMenu && (
//         <MessageMenu
//           message={m}
//           myId={myId}
//           isGroupAdmin={isGroupAdmin}
//           onReact={handleReact}
//           onCopy={onCopy || handleCopy}
//           onEdit={(msg) => {
//             setIsEditing(true);
//             setEditText(msg.message || '');
//           }}
//           onReply={onReply || (() => {})}
//           onTranslate={onTranslate || ((msg) => {
//             console.log('Translate:', msg);
//           })}
//           onDelete={onDelete || (() => {})}
//           onClose={() => setShowMenu(false)}
//           position={menuPosition}
//         />
//       )}
//     </div>
//   );
// };






// app/chats/_components/MessageItem.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Message } from "@/types/types";
import VoicePlayer from "./VoicePlayer";
import { MessageMenu } from "./MessageMenu";
import "../css/custom.css";
import wsService from "@/lib/websocketService";

// ================= دوال مساعدة للملفات =================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";

const getFileIcon = (type: string): string => {
  switch (type) {
    case 'pdf': return '/icons/pdf.svg';
    case 'word': return '/icons/word.svg';
    case 'excel': return '/icons/excel.svg';
    case 'powerpoint': return '/icons/ppt.svg';
    case 'archive': return '/icons/zip.svg';
    case 'text': return '/icons/txt.svg';
    case 'audio': return '/icons/audio-file.svg';
    case 'video': return '/icons/video-file.svg';
    default: return '/icons/file.svg';
  }
};

const getFileColor = (type: string): string => {
  switch (type) {
    case 'pdf': return '#FF4444';
    case 'word': return '#2B579A';
    case 'excel': return '#217346';
    case 'powerpoint': return '#D24726';
    case 'archive': return '#FF9800';
    case 'text': return '#607D8B';
    case 'audio': return '#9C27B0';
    case 'video': return '#E91E63';
    default: return '#757575';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (fileName: string): string => {
  if (!fileName) return '';
  const ext = fileName.split('.').pop();
  return ext ? ext.toUpperCase() : '';
};

const isImageFile = (type: string): boolean => {
  return type === 'image' || type === 'sticker';
};

const isVideoFile = (type: string): boolean => {
  return type === 'video';
};

const isAudioFile = (type: string): boolean => {
  return type === 'audio';
};

const isDocumentFile = (type: string): boolean => {
  const docTypes = ['pdf', 'word', 'excel', 'powerpoint', 'archive', 'text', 'file'];
  return docTypes.includes(type);
};

// const useMediaUrl = (media: any) => {
//   return useMemo(() => {
//     if (!media) return null;

//     const resolve = (item: any): string | null => {
//       if (!item) return null;
//       if (item instanceof File || item instanceof Blob) {
//         return URL.createObjectURL(item);
//       }
//       const raw = typeof item === "string" ? item : item.url || item.fileContent;
//       if (!raw || typeof raw !== "string") return null;
//       return /^(https?:|data:|blob:)/.test(raw)
//         ? raw
//         : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
//     };

//     return resolve(Array.isArray(media) ? media[0] : media);
//   }, [media]);
// };

const resolveMediaItem = (item: any): string | null => {
  if (!item) return null;
  if (item instanceof File || item instanceof Blob) {
    return URL.createObjectURL(item);
  }
  const raw = typeof item === "string" ? item : item.url || item.fileContent;
  if (!raw || typeof raw !== "string") return null;
  return /^(https?:|data:|blob:)/.test(raw)
    ? raw
    : `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

const useMediaUrl = (media: any) =>
  useMemo(() => {
    if (!media) return null;
    return resolveMediaItem(Array.isArray(media) ? media[0] : media);
  }, [media]);

const useGroupUrls = (msgs?: Message[]) =>
  useMemo(() => {
    if (!msgs || msgs.length < 2) return [];
    return msgs
      .map((g) => {
        const media = g.media ?? (g as any).fileData;
        return resolveMediaItem(Array.isArray(media) ? media[0] : media);
      })
      .filter(Boolean) as string[];
  }, [msgs]);

export const MessageItem = ({
  m,
  myId,
  index,
  recieverImg,
  prevMessage,
  isGroupAdmin = false,
  onReact,
  onEdit,
  onReply,
  onTranslate,
  onDelete,
  onCopy,
  showReactions = true,
  onRetry,
  onImageClick,
  onFileClick,
  translation,
  isTranslating,
  onCopyTranslation,
  onClearTranslation,
  onCallBack,
  onJumpToMessage, 
  groupMessages,
}: {
  m: Message;
  myId: string | null;
  onRetry: (m: Message) => void;
  index: number;
  recieverImg: string;
  prevMessage?: Message;
  isGroupAdmin?: boolean;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (message: Message) => void;
  onReply?: (message: Message) => void;
  onTranslate?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onCopy?: (text: string) => void;
  showReactions?: boolean;
  // onImageClick?: (imageUrl: string) => void;
  onImageClick?: (imageUrl: string, allImages?: string[]) => void;
  onFileClick?: (fileUrl: string, fileName: string) => void;
  translation?: string;
  isTranslating?: boolean;
  onCopyTranslation?: (text: string) => void;
//   onClearTranslation?: () => void;
// }) => {
 onClearTranslation?: () => void;
  onCallBack?: (m: Message) => void;
  onJumpToMessage?: (messageId: string) => void;   
    groupMessages?: Message[];

}) => {
  const mine = m.sender === myId;
  const isMessageRead =
    (m as any).isRead === true ||
    (m as any).read === true ||
    (m as any).seen === true ||
    (m as any).isSeen === true ||
    (m as any).readBy === myId ||
    (Array.isArray((m as any).readBy) && (m as any).readBy.length > 0) ||
    (Array.isArray((m as any).seenBy) && (m as any).seenBy.length > 0);
  const isThird = (index + 1) % 2 === 0;
  const mediaUrl = useMediaUrl(m.media ?? (m as any).fileData);
  const groupUrls = useGroupUrls(groupMessages);

  // const [showMenu, setShowMenu] = useState(false);
  // const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // const [isEditing, setIsEditing] = useState(false);
  // const [editText, setEditText] = useState(m.message || '');
  // const messageRef = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const messageRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [liked, setLiked] = useState(m.likes?.includes(myId ?? ""));
  const [likesCount, setLikesCount] = useState(m.likes?.length || 0);
  const [reactions, setReactions] = useState<string[]>(m.likes || []);

  useEffect(() => {
    setLiked(m.likes?.includes(myId ?? ""));
    setLikesCount(m.likes?.length || 0);
    setReactions(m.likes || []);
  }, [m.likes, myId]);

  const handleLike = async () => {
    if (!myId || liked) return;

    setLiked(true);
    setLikesCount((prev) => prev + 1);
    setReactions((prev) => [...prev, '❤️']);

    const token = localStorage.getItem("boChatToken");
    if (!token) return;

    try {
      await fetch("https://bo-chat.space/reacttomessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reacter: myId,
          messageid: m._id?.toString(),
        }),
      });

      wsService.send({
        event: "react",
        metadata: {
          sender: myId,
          messageid: m._id?.toString(),
          reciever: m.sender,
        },
      });
    } catch (err) {
      console.error("LIKE ERROR", err);
      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      setReactions((prev) => prev.filter(r => r !== '❤️'));
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (onReact) {
      onReact(messageId, emoji);
    } else {
      if (!myId) return;
      setReactions((prev) => [...prev, emoji]);
      setLikesCount((prev) => prev + 1);

      const token = localStorage.getItem("boChatToken");
      if (!token) return;

      fetch("https://bo-chat.space/reacttomessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reacter: myId,
          messageid: messageId,
        }),
      }).catch(console.error);
    }
  };

  const handleLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

  //   if (isEditing) return;

  //   setMenuPosition({ x: clientX, y: clientY });
  //   setShowMenu(true);
  // }, [isEditing]);
    setMenuPosition({ x: clientX, y: clientY });
    setShowMenu(true);
  }, []);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      handleLongPress(e);
    }, 500);
  }, [handleLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  // const handleEdit = async () => {
  //   if (!editText.trim() || !onEdit) return;
  //   await onEdit({ ...m, message: editText });
  //   setIsEditing(false);
  // };

  // const cancelEdit = () => {
  //   setIsEditing(false);
  //   setEditText(m.message || '');
  // };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return "اليوم";
    if (isSameDay(date, yesterday)) return "أمس";

    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const messageDate = new Date(m.timestamp);
  const showDateHeader = !prevMessage || !isSameDay(new Date(prevMessage.timestamp), messageDate);
  const dateLabel = getDateLabel(messageDate);

  const ProgressCircle = ({ value }: { value: number }) => {
    const radius = 18;
    const stroke = 3;
    const normalized = radius - stroke * 2;
    const circumference = normalized * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <svg width={40} height={40}>
        <circle
          stroke="#fee2e2"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx={20}
          cy={20}
        />
        <circle
          stroke="#dc2626"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "0.2s" }}
          r={normalized}
          cx={20}
          cy={20}
        />
      </svg>
    );
  };

  // ================= شكل الذيل (Tail) =================
  const renderTail = (bgColor: string) => (
    <div
      style={{
        position: 'absolute',
        width: 15,
        height: 15,
        top: '50%',
        [mine ? 'right' : 'left']: -4,
        transform: 'translateY(-50%) rotate(45deg)',
        borderRadius: 3,
        background: bgColor,
        opacity: 1,
      }}
    />
  );

    // ================= عرض رسالة محذوفة =================
  const renderDeletedMessage = () => {
    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{
            width: 233,
            minHeight: 60,
            height: 'auto',
            borderRadius: 25,
            background: '#F3F5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 14px',
            boxSizing: 'border-box',
          }}
          dir="rtl"
        >
          <img
            src="/imgs/ImageDelete.svg"
            alt="deleted"
            style={{
              width: 14,
              height: 17,
              flexShrink: 0,
              objectFit: 'contain',
            }}
          />
          <span
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'right',
              color: '#B4B4B9',
            }}
          >
            تمت إزالة هذه الرسالة بواسطة المرسل
          </span>
        </div>
      </div>
    );
  };
  // ================= عرض الملف =================
  const renderFileMessage = () => {
    const fileUrl = mediaUrl || '';
    const fileName = m.fileName || m.message || 'ملف';
    const fileSize = m.fileSize || 0;
    const fileType = m.type || 'file';
    const fileExtension = getFileExtension(fileName);
    const icon = getFileIcon(fileType);
    const color = getFileColor(fileType);

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{ position: 'relative' }}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 min-w-[200px] max-w-[280px] ${
            mine ? "bg-[#D72229] text-white" : "bg-[#F3F5FF] text-[#D72229]"
          } ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (fileUrl && onFileClick) {
              onFileClick(fileUrl, fileName);
            } else if (fileUrl) {
              window.open(fileUrl, '_blank');
            }
          }}
          onDoubleClick={() => handleLike()}
        >
          {renderTail(mine ? '#D72229' : '#F3F5FF')}
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
            <img src={icon} alt={fileType} className="w-7 h-7 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span>{fileExtension}</span>
              <span>•</span>
              <span>{formatFileSize(fileSize)}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <img src="/icons/download.svg" alt="تحميل" className="w-4 h-4" />
          </div>
        </div>

        {likesCount > 0 && showReactions && (
          <div style={{ fontSize: 14 }}>
            <img
              src="/icons/like.svg"
              style={{
                filter: mine
                  ? "brightness(0) saturate(100%) invert(1)"
                  : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
              }}
              alt="like-icon"
            />
          </div>
        )}
      </div>
    );
  };

  // ================= عرض الصورة =================
  const renderImageMessage = () => {
    if (!mediaUrl) return null;

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{ position: "relative", display: "inline-block" }}
          onDoubleClick={() => handleLike()}
        >
          <div
            className={`flex items-center overflow-hidden w-[200px] max-h-[250px] p-4 rounded-[18px] ${
              mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"
            } ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}
            onClick={() => {
              if (onImageClick && mediaUrl) {
                onImageClick(mediaUrl);
              }
            }}
          >
            <img
              src={mediaUrl}
              style={{
                maxWidth: "100%",
                opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
              }}
              className="rounded-[18px] object-cover cursor-pointer"
              alt="image"
              loading="lazy"
              referrerPolicy="no-referrer"
              width={180}
              height={230}
            />
          </div>

          {renderTail(mine ? '#D72229' : '#F3F5FF')}

          {typeof m.uploadProgress === "number" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <ProgressCircle value={m.uploadProgress} />
            </div>
          )}

          {likesCount > 0 && showReactions && (
            <div style={{ fontSize: 14 }}>
              <img
                src="/icons/like.svg"
                style={{
                  filter: mine
                    ? "brightness(0) saturate(100%) invert(1)"
                    : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
                }}
                alt="like-icon"
              />
            </div>
          )}
        </div>
      </div>
    );
  };


  // ================= عرض مجموعة صور (ستاك) =================
// const renderImageStack = () => {
//   const urls = groupUrls.slice(0, 3);
//   const extra = groupUrls.length - urls.length;

//   // const layers = [
//   //   { rotate: 0, x: 0, y: 0 },
//   //   { rotate: 8, x: 10, y: -6 },
//   //   { rotate: -8, x: -10, y: -10 },
//   // ];
//   const layers = [
//   { rotate: 0, x: 0, y: 0 },
//   { rotate: 9, x: 16, y: -4 },
//   { rotate: -9, x: -16, y: -8 },
// ];

//   const uploading = (groupMessages || []).filter(
//     (g) => typeof g.uploadProgress === "number"
//   );
//   const avgProgress = uploading.length
//     ? Math.round(
//         uploading.reduce((s, g) => s + (g.uploadProgress || 0), 0) / uploading.length
//       )
//     : null;

//   return (
//     <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//       <div
//         style={{ position: "relative", width: 170, height: 190, margin: "8px 14px" }}
//         className="cursor-pointer"
//         // onClick={() => onImageClick?.(urls[0])}
//         onClick={() => onImageClick?.(groupUrls[0], groupUrls)}
//         onDoubleClick={() => handleLike()}
//       >
//         {urls.map((url, i) => (
//           <div
//             key={url + i}
//             className="absolute overflow-hidden shadow-md"
//             style={{
//               width: 138,
//               height: 156,
//               top: "50%",
//               left: "50%",
//               marginTop: -78,
//               marginLeft: -69,
//               borderRadius: 18,
//               border: "2px solid #fff",
//               transform: `translate(${layers[i].x}px, ${layers[i].y}px) rotate(${layers[i].rotate}deg)`,
//               zIndex: urls.length - i,
//               opacity: avgProgress !== null ? 0.6 : 1,
//             }}
//           >
//             <img
//               src={url}
//               alt={`image ${i + 1}`}
//               className="w-full h-full object-cover"
//               loading="lazy"
//               referrerPolicy="no-referrer"
//             />
//             {i === 0 && extra > 0 && (
//               <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
//                 +{extra}
//               </div>
//             )}
//           </div>
//         ))}

//         {avgProgress !== null && (
//           <div
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: 10,
//             }}
//           >
//             <ProgressCircle value={avgProgress} />
//           </div>
//         )}
//       </div>

//       {likesCount > 0 && showReactions && (
//         <div style={{ fontSize: 14 }}>
//           <img
//             src="/icons/like.svg"
//             style={{
//               filter: mine
//                 ? "brightness(0) saturate(100%) invert(1)"
//                 : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)",
//             }}
//             alt="like-icon"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// ================= عرض مجموعة صور (ستاك مروحة) =================
const renderImageStack = () => {
  // نعرض حد أقصى 7 صور في الستاك عشان الشكل ما يزدحمش
  const MAX_VISIBLE = 7;
  const urls = groupUrls.slice(0, MAX_VISIBLE);
  const extra = groupUrls.length - urls.length;

  // الصورة الأولى في النص، والباقي بالتناوب يمين/شمال بزاوية وإزاحة متزايدة
  // const getLayer = (i: number) => {
  //   if (i === 0) return { rotate: 0, x: 0, y: 0 };
  //   const step = Math.ceil(i / 2);          // 1,1,2,2,3,3...
  //   const side = i % 2 === 1 ? 1 : -1;      // يمين ثم شمال
  //   return {
  //     rotate: side * (6 + step * 4),        // 10°, 14°, 18°...
  //     x: side * step * 14,                  // إزاحة أفقية
  //     y: -step * 3,                         // رفع بسيط للخلف
  //   };
  // };
const getLayer = (i: number) => {
  if (i === 0) return { rotate: 0, x: 0, y: 0 };   // الأولى مظبوطة
  // if (i === 1) return { rotate: 5, x: 6, y: -4 };  // التانية: ميل بسيط يمين
  // if (i === 2) return { rotate: -5, x: -6, y: -6 }; // التالتة: ميل بسيط شمال
  if (i === 1)  return  { rotate: 8, x: 10, y: -6 };
  if (i === 2) return { rotate: -8, x: -10, y: -10 };
  // الرابعة وما بعدها: من غير ميل، وبتبان حافتها من فوق
  return { rotate: 0, x: 0, y: -6 - (i - 2) * 7 };
};
  // const maxStep = Math.ceil((urls.length - 1) / 2);
  // const containerWidth = 150 + maxStep * 30 + 24;
 const extraTop = Math.max(0, urls.length - 3) * 7;
  const containerWidth = 170;


  const uploading = (groupMessages || []).filter(
    (g) => typeof g.uploadProgress === "number"
  );
  const avgProgress = uploading.length
    ? Math.round(
        uploading.reduce((s, g) => s + (g.uploadProgress || 0), 0) / uploading.length
      )
    : null;

  return (
    <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
      <div
        style={{
          position: "relative",
          width: containerWidth,
          // height: 190,
          height: 190 + extraTop,
          margin: "8px 14px",
        }}
        className="cursor-pointer"
        onClick={() => onImageClick?.(groupUrls[0], groupUrls)}
        onDoubleClick={() => handleLike()}
      >
        {urls.map((url, i) => {
          const { rotate, x, y } = getLayer(i);
          return (
            <div
              key={url + i}
              className="absolute overflow-hidden shadow-md"
              style={{
                width: 138,
                height: 156,
                top: "50%",
                left: "50%",
                marginTop: -78,
                marginLeft: -69,
                borderRadius: 18,
                border: "2px solid #fff",
                transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
                zIndex: urls.length - i,   // الأولى فوق، والباقي ورا
                opacity: avgProgress !== null ? 0.6 : 1,
              }}
            >
              <img
                src={url}
                alt={`image ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {i === 0 && extra > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                  +{extra}
                </div>
              )}
            </div>
          );
        })}

        {avgProgress !== null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 50,
            }}
          >
            <ProgressCircle value={avgProgress} />
          </div>
        )}
      </div>

      {likesCount > 0 && showReactions && (
        <div style={{ fontSize: 14 }}>
          <img
            src="/icons/like.svg"
            style={{
              filter: mine
                ? "brightness(0) saturate(100%) invert(1)"
                : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)",
            }}
            alt="like-icon"
          />
        </div>
      )}
    </div>
  );
};
  // ================= عرض الفيديو =================
  const renderVideoMessage = () => {
    if (!mediaUrl) return null;

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div style={{ position: 'relative' }}>
          <video
            src={mediaUrl}
            controls
            style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 300 }}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            className="rounded-[18px]"
          />
          {renderTail(mine ? '#D72229' : '#F3F5FF')}
        </div>
        {likesCount > 0 && showReactions && (
          <div style={{ fontSize: 14 }}>
            <img
              src="/icons/like.svg"
              style={{
                filter: mine
                  ? "brightness(0) saturate(100%) invert(1)"
                  : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
              }}
              alt="like-icon"
            />
          </div>
        )}
      </div>
    );
  };

  // ================= عرض الصوت =================
  const renderAudioMessage = () => {
    if (!mediaUrl) return null;

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{ position: 'relative' }}
          onDoubleClick={() => handleLike()}
          className={`px-4 py-2.5 rounded-[25px]
            ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"}
            ${isThird ? (mine ? "message-mine" : "message-other") : ""}
            ${m._sendFailed ? "opacity-60" : ""}`}
        >
          {renderTail(mine ? '#D72229' : '#F3F5FF')}
          {/* <VoicePlayer media={mediaUrl} isMe={mine} peaks={(m as any).waveData} /> */}
          <VoicePlayer media={mediaUrl} isMe={mine} peaks={m.waveData} />
        </div>

        {likesCount > 0 && showReactions && (
          <div style={{ fontSize: 14 }}>
            <img
              src="/icons/like.svg"
              style={{
                filter: mine
                  ? "brightness(0) saturate(100%) invert(1)"
                  : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
              }}
              alt="like-icon"
            />
          </div>
        )}
      </div>
    );
  };

  // ================= عرض الملصق =================
  const renderStickerMessage = () => {
    if (!mediaUrl) return null;

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{ position: "relative", display: "inline-block" }}
          onDoubleClick={() => handleLike()}
        >
          <img
            src={mediaUrl}
            style={{
              maxWidth: "100%",
              opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
            }}
            className="rounded-[18px] object-cover"
            alt="sticker"
            loading="lazy"
            referrerPolicy="no-referrer"
            width={180}
            height={230}
          />
          {renderTail(mine ? '#D72229' : '#F3F5FF')}
        </div>
        {likesCount > 0 && showReactions && (
          <div style={{ fontSize: 14 }}>
            <img
              src="/icons/like.svg"
              style={{
                filter: mine
                  ? "brightness(0) saturate(100%) invert(1)"
                  : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
              }}
              alt="like-icon"
            />
          </div>
        )}
      </div>
    );
  };

  // ================= عرض الرسالة النصية =================
  // const renderTextMessage = () => {
  //   return (
  //     <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
  //       <div
  //         style={{ position: 'relative' }}
  //         className={`
  //           ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
  //           ${isThird ? (mine ? "message-mine" : "message-other") : ""}
  //           flex items-center justify-center px-5 py-2.5
  //           text-[18px] !rounded-[25px]
  //           ${isEditing ? 'p-0 overflow-hidden' : ''}
  //           ${m._sendFailed ? 'opacity-60' : ''}
  //         `}
  //         onDoubleClick={() => handleLike()}
  //       >
  //         {!isEditing && renderTail(mine ? '#D72229' : '#F3F5FF')}
  //         {isEditing ? (
  //           <div className="flex flex-col gap-2 p-2">
  //             <input
  //               type="text"
  //               value={editText}
  //               onChange={(e) => setEditText(e.target.value)}
  //               className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-black min-w-[200px]"
  //               autoFocus
  //               onKeyDown={(e) => {
  //                 if (e.key === 'Enter') handleEdit();
  //                 if (e.key === 'Escape') cancelEdit();
  //               }}
  //             />
  //             <div className="flex gap-2 justify-end">
  //               <button
  //                 onClick={handleEdit}
  //                 className="px-3 py-1 bg-[#D72229] text-white rounded-lg text-sm"
  //               >
  //                 حفظ
  //               </button>
  //               <button
  //                 onClick={cancelEdit}
  //                 className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
  //               >
  //                 إلغاء
  //               </button>
  //             </div>
  //           </div>
  //         ) : (
  //           m.message
  //         )}
  //       </div>
  //       {likesCount > 0 && showReactions && (
  //         <div style={{ fontSize: 14 }}>
  //           <img
  //             src="/icons/like.svg"
  //             style={{
  //               filter: mine
  //                 ? "brightness(0) saturate(100%) invert(1)"
  //                 : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
  //             }}
  //             alt="like-icon"
  //           />
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  // ================= عرض الرسالة النصية =================
  const renderTextMessage = () => {
    // const reply = (m as any).replyTo;
    const reply = m.replyTo;
    const hasReply = !!(reply && (reply.message || reply.type));

    // نص مختصر للرد
    let replyPreviewText = (reply?.message || '').trim();
    let replyIcon = '';
    if (reply?.type && reply.type !== 'text') {
      const t = reply.type;
      if (t === 'image') { replyIcon = '📷'; replyPreviewText = 'صورة'; }
      else if (t === 'video') { replyIcon = '🎬'; replyPreviewText = 'فيديو'; }
      else if (t === 'audio') { replyIcon = '🎵'; replyPreviewText = 'رسالة صوتية'; }
      else if (t === 'sticker') { replyIcon = '🎨'; replyPreviewText = 'ملصق'; }
      else { replyIcon = '📎'; replyPreviewText = reply.fileName || 'ملف'; }
    }

    const fullReplyText = `${replyIcon ? replyIcon + ' ' : ''}${replyPreviewText}`;

    return (
      <div
        className={`flex flex-col gap-1 ${mine ? "items-start" : "items-end"}`}
        style={{ maxWidth: '100%' }}
      >
        {/* ✅ Pill الرد — فوق الرسالة */}
        {/* {hasReply && (
          <div
            dir="rtl"
            style={{
              minWidth: '187px',
              minHeight: '50px',
              borderRadius: '25px',
              border: '1px solid #D72229',
              background: '#ffffff',
              padding: '12px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '1',
              color: '#D72229',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            <span className="truncate">{fullReplyText}</span>
          </div>
        )} */}
           {hasReply && (
          <div
            dir="rtl"
            onClick={(e) => {
              e.stopPropagation();
              if (onJumpToMessage && reply?._id) {
                onJumpToMessage(reply._id);
              }
            }}
            className="cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
            title="انتقل إلى الرسالة الأصلية"
            style={{
              minWidth: '187px',
              minHeight: '50px',
              borderRadius: '25px',
              border: '1px solid #D72229',
              background: '#ffffff',
              padding: '12px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '1',
              color: '#D72229',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            <span className="truncate">{fullReplyText}</span>
          </div>
        )}
        {/* ✅ فقاعة الرسالة + اللايك */}
        <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
          {/* <div
            style={{ position: 'relative' }}
            className={`
              ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
              ${isThird ? (mine ? "message-mine" : "message-other") : ""}
              flex items-center justify-center px-5 py-2.5
              text-[18px] !rounded-[25px]
              ${isEditing ? 'p-0 overflow-hidden' : ''}
              ${m._sendFailed ? 'opacity-60' : ''}
            `}
            onDoubleClick={() => handleLike()}
          >
            {!isEditing && renderTail(mine ? '#D72229' : '#F3F5FF')}
            {isEditing ? (
              <div className="flex flex-col gap-2 p-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-black min-w-[200px]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-[#D72229] text-white rounded-lg text-sm"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <span className="block whitespace-pre-wrap break-words">{m.message}</span>
            )}
          </div> */}

                    <div
            style={{ position: 'relative' }}
            className={`
              ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
              ${isThird ? (mine ? "message-mine" : "message-other") : ""}
              flex items-center justify-center px-5 py-2.5
              text-[18px] !rounded-[25px]
              ${m._sendFailed ? 'opacity-60' : ''}
            `}
            onDoubleClick={() => handleLike()}
          >
            {renderTail(mine ? '#D72229' : '#F3F5FF')}
            <span className="block whitespace-pre-wrap break-words">
              {m.message}
              {m.edited && (
                <span className="text-[10px] opacity-60 mr-2 inline-block">(تم التعديل)</span>
              )}
            </span>
          </div>

          {likesCount > 0 && showReactions && (
            <div style={{ fontSize: 14 }}>
              <img
                src="/icons/like.svg"
                style={{
                  filter: mine
                    ? "brightness(0) saturate(100%) invert(1)"
                    : "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
                }}
                alt="like-icon"
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  // ================= عرض رسالة المكالمة =================
  const renderCallMessage = () => {
    const callData = (m as any).callData || {};
    const isMissed =
      callData.status === 'missed' ||
      callData.callStatus === 'missed' ||
      m.message?.toLowerCase().includes('missed') ||
      m.message?.includes('فائتة');

    const label = isMissed ? 'مكالمة فائتة' : (m.message || 'مكالمة');

    const callTime =
      callData.time ||
      callData.callTime ||
      new Date(m.timestamp).toLocaleTimeString('ar-EG', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    const bgColor = mine ? '#D72229' : '#F3F5FF';

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
          style={{
            position: 'relative',
            width: 200,
            height: 93,
            borderRadius: 25,
            background: bgColor,
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
          onDoubleClick={() => handleLike()}
          dir="rtl"
        >
          <div
            style={{
              position: 'absolute',
              width: 15,
              height: 15,
              top: '50%',
              [mine ? 'right' : 'left']: -4,
              transform: 'translateY(-50%) rotate(45deg)',
              borderRadius: 3,
              background: bgColor,
            }}
          />
          <div className="flex items-center gap-2" dir="rtl" style={{ justifyContent: 'flex-start' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: mine ? '#FFFFFF' : '#D72229',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src={mine ? '/imgs/phone-cross.svg' : '/imgs/phone-cross%204.svg'}
                alt="call"
                style={{ width: 14, height: 14, objectFit: 'contain', display: 'block' }}
                onError={(e) => {
                  console.warn('phone-cross image not found');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: 1,
                  color: mine ? '#FFFFFF' : '#D72229',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  fontSize: 9,
                  lineHeight: 1,
                  color: '#000000',
                  textAlign: 'right',
                  opacity: 0.85,
                  whiteSpace: 'nowrap',
                }}
              >
                {callTime}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onCallBack) {
                onCallBack(m);
              } else {
                console.log('Callback requested for:', m);
              }
            }}
            style={{
              width: 120,
              height: 30,
              borderRadius: 10,
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: 12,
              lineHeight: 1,
              textAlign: 'center',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 0,
            }}
          >
            إعادة الاتصال
          </button>
        </div>
      </div>
    );
  };

  // ================= اختيار نوع العرض حسب نوع الرسالة =================
  const renderContent = () => {
    // if (m.type === 'text' || !m.type) return renderTextMessage();
    //  if ((m as any)._deleted) return renderDeletedMessage();
    if (m._deleted) return renderDeletedMessage();
    if (m.type === 'text' || !m.type) return renderTextMessage();
    if (m.type === 'image' && groupUrls.length > 1) return renderImageStack();
    if (m.type === 'image') return renderImageMessage();
    if (m.type === 'video') return renderVideoMessage();
    if (m.type === 'audio') return renderAudioMessage();
    if (m.type === 'sticker') return renderStickerMessage();
    if (m.type === 'call') return renderCallMessage();
    if (isDocumentFile(m.type)) return renderFileMessage();
    return renderTextMessage();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative">
      {showDateHeader && (
        <div className="flex justify-center my-3 w-[100%] position-relative date-label">
          <span className="px-4 py-1 text-sm text-[#B4B4B9] bg-[#fff] z-[99] text-center">
            {dateLabel}
          </span>
        </div>
      )}

      <div
        ref={messageRef}
        // className="flex-row flex relative items-end"
        //  className={`flex-row flex relative ${
        //   (m.type === 'image' || m.type === 'audio' || m.type === 'sticker' || m.type === 'video' || m.type === 'call')
        //     ? 'items-center'
        //     : 'items-end'
        // }`}
         data-message-id={m._id}
         className={`flex-row flex relative ${
          !(m as any)._deleted &&
          (m.type === 'image' || m.type === 'audio' || m.type === 'sticker' || m.type === 'video' || m.type === 'call')
            ? 'items-center'
            : 'items-end'
        }`}
         style={{ alignSelf: mine ? "flex-start" : "flex-end", maxWidth: "70%" }}
        onContextMenu={handleLongPress}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {!mine && (
          <div
            className="flex items-center flex-shrink-0"
            style={{ marginLeft: 6, marginBottom: 4 }}
            title={isMessageRead ? 'تم القراءة' : 'لم تُقرأ'}
          >
            <img
              src={isMessageRead ? '/imgs/read.svg' : '/imgs/unRead.svg'}
              alt={isMessageRead ? 'read' : 'unread'}
              style={{ width: 10, height: 9, objectFit: 'contain', display: 'block', opacity: 1 }}
              onError={(e) => {
                console.warn(`${isMessageRead ? 'read' : 'unRead'}.svg not found`);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {renderContent()}

        {!mine && (
          <img
            src={recieverImg || '/imgs/user.png'}
            className="w-[40px] h-[40px] rounded-full mr-2 object-cover flex-shrink-0"
            alt="avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/imgs/user.png';
            }}
          />
        )}

        {m._sendFailed && (
          <button
            onClick={() => onRetry(m)}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm z-10"
          >
            <span>إعادة المحاولة</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {(isTranslating || translation) && (
        <div
          dir="rtl"
          style={{ alignSelf: mine ? "flex-start" : "flex-end", maxWidth: "70%", paddingLeft: 48, paddingRight: 48 }}
        >
          {isTranslating && !translation && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F3F5FF] text-[#6B7280] text-xs">
              <span className="w-3 h-3 border-2 border-[#B4B4B9] border-t-transparent rounded-full animate-spin" />
              جاري الترجمة...
            </div>
          )}

          {translation && (
            <div className="flex items-center gap-2" dir="rtl">
              <div
                style={{
                  minWidth: '187px',
                  minHeight: '50px',
                  borderRadius: '25px',
                  border: '1px solid #D72229',
                  background: '#D72229',
                  padding: '12px 20px',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '1',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {translation}
              </div>

              <button
                type="button"
                onClick={onClearTranslation}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#D72229] hover:bg-[#D72229]/10 transition shrink-0"
                title="إخفاء الترجمة"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#D72229" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {showMenu && (
        <MessageMenu
          message={m}
          myId={myId}
          isGroupAdmin={isGroupAdmin}
          onReact={handleReact}
          onCopy={onCopy || handleCopy}
          // onEdit={(msg) => {
          //   setIsEditing(true);
          //   setEditText(msg.message || '');
          // }}
          onEdit={(msg) => {
            if (onEdit) onEdit(msg);
          }}
          onReply={onReply || (() => {})}
          onTranslate={onTranslate || ((msg) => {
            console.log('Translate:', msg);
          })}
          onDelete={onDelete || (() => {})}
          onClose={() => setShowMenu(false)}
          position={menuPosition}
        />
      )}
    </div>
  );
};