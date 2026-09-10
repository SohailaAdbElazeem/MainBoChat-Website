// // // /* eslint-disable @next/next/no-img-element */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // /* eslint-disable jsx-a11y/alt-text */
// // // 'use client';
// // // import {  useMemo, useState, useEffect  } from "react";
// // // import { Message } from "@/types/types";
// // // import VoiceNotePlayer from "./VoiceNotePlayer";
// // // import "../css/custom.css";
// // // import wsService from "@/lib/websocketService";

// // // /**
// // //  * Convert media to playable URL
// // //  */
// // // const useMediaUrl = (media: any) => {
// // //   return useMemo(() => {
// // //     if (!media) return null;

// // //     // Array
// // //     if (Array.isArray(media)) {
// // //       const item = media[0];
// // //       if (!item) return null;

// // //       if (typeof item === "string") return item;
// // //       if (item instanceof File || item instanceof Blob) {
// // //         return URL.createObjectURL(item);
// // //       }
// // //     }

// // //     // URL
// // //     if (typeof media === "string") return media;

// // //     // File / Blob (⭐ هنا الحل)
// // //     if (media instanceof File || media instanceof Blob) {
// // //       return URL.createObjectURL(media);
// // //     }

// // //     return null;
// // //   }, [media]);
// // // };


// // // export const MessageItem = ({
// // //   m,
// // //   myId,
// // //   // onRetry,
// // //   index,
// // //   recieverImg,
// // //   prevMessage, // 👈
// // // }: {
// // //   m: Message;
// // //   myId: string | null;
// // //   onRetry: (m: Message) => void;
// // //   index: number;
// // //   recieverImg: string
// // //   prevMessage?: Message;

// // // }) => {
// // //   const mine = m.sender === myId;
// // //   // const isTemp = m._id?.toString().startsWith("tmp-");
// // //   const isThird = (index + 1) % 2 === 0;
// // //   const mediaUrl = useMediaUrl(m.media);
// // //   const ProgressCircle = ({ value }: { value: number }) => {
// // //     const radius = 18;
// // //     const stroke = 3;
// // //     const normalized = radius - stroke * 2;
// // //     const circumference = normalized * 2 * Math.PI;
// // //     const offset =
// // //       circumference - (value / 100) * circumference;
    
// // //     return (
// // //       <svg width={40} height={40}>
// // //         <circle
// // //           stroke="#fee2e2"
// // //           fill="transparent"
// // //           strokeWidth={stroke}
// // //           r={normalized}
// // //           cx={20}
// // //           cy={20}
// // //         />
// // //         <circle
// // //           stroke="#dc2626"
// // //           fill="transparent"
// // //           strokeWidth={stroke}
// // //           strokeDasharray={`${circumference} ${circumference}`}
// // //           style={{ strokeDashoffset: offset, transition: "0.2s" }}
// // //           r={normalized}
// // //           cx={20}
// // //           cy={20}
// // //         />
// // //         {/* <text
// // //           x="50%"
// // //           y="55%"
// // //           textAnchor="middle"
// // //           fontSize="10"
// // //           fill="#dc2626"
// // //         >
// // //           {value}%
// // //         </text> */}
// // //       </svg>
// // //     );
// // //   };

// // //   // // cleanup blob URLs
// // //   // useEffect(() => {
// // //   //   return () => {
// // //   //     if (mediaUrl?.startsWith("blob:")) {
// // //   //       URL.revokeObjectURL(mediaUrl);
// // //   //     }
// // //   //   };
// // //   // }, [mediaUrl]);

// // // const isSameDay = (d1: Date, d2: Date) =>
// // //   d1.getFullYear() === d2.getFullYear() &&
// // //   d1.getMonth() === d2.getMonth() &&
// // //   d1.getDate() === d2.getDate();
  
// // // const getDateLabel = (date: Date) => {
// // //   const today = new Date();
// // //   const yesterday = new Date();
// // //   yesterday.setDate(today.getDate() - 1);

// // //   if (isSameDay(date, today)) return "اليوم";
// // //   if (isSameDay(date, yesterday)) return "أمس";

// // //   return date.toLocaleDateString("ar-EG", {
// // //     day: "numeric",
// // //     month: "long",
// // //     year: "numeric",
// // //   });
// // // };

// // // const messageDate = new Date(m.timestamp);

// // // const showDateHeader =
// // //   !prevMessage ||
// // //   !isSameDay(
// // //     new Date(prevMessage.timestamp),
// // //     messageDate
// // //   );

// // // const [liked, setLiked] = useState(
// // //       m.likes?.includes(myId ?? "")
// // //     );
// // //     const [likesCount, setLikesCount] = useState(
// // //       m.likes?.length || 0
// // //     );
// // //     useEffect(() => {
// // //       setLiked(m.likes?.includes(myId ?? ""));
// // //       setLikesCount(m.likes?.length || 0);
// // //     }, [m.likes, myId]);


// // // const handleLike = async () => {
// // //   if (!myId || liked) return;

// // //   setLiked(true);
// // //   setLikesCount((prev) => prev + 1);

// // //   const token = localStorage.getItem("boChatToken");
// // //   if (!token) return;

// // //   try {
// // //     const res = await fetch("https://bo-chat.space/reacttomessage", {
// // //       method: "POST",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //         Authorization: `Bearer ${token}`,
// // //       },
// // //       body: JSON.stringify({
// // //         reacter: myId,
// // //         messageid: m._id?.toString(), // ✅ هنا الحل
// // //       }),
// // //     });
// // //     console.log(res);
// // //     console.log({
// // //       reacter: myId,
// // //       messageid: m._id?.toString(), 
// // //     });
// // //     const data = await res.json();
// // //     console.log("❤️ API RESPONSE:", data);

// // //     wsService.send({
// // //       event: "react",
// // //       metadata: {
// // //         sender: myId,
// // //         messageid: m._id?.toString(),
// // //         reciever: m.sender,
// // //       },
// // //     });
// // //   } catch (err) {
// // //     console.error("LIKE ERROR", err);
// // //     setLiked(false);
// // //     setLikesCount((prev) => Math.max(prev - 1, 0));
// // //   }
// // // };


// // // const dateLabel = getDateLabel(messageDate);
// // //   return (
// // //     <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative" >
// // //         {showDateHeader && (
// // //           <div className="flex justify-center my-3 w-[100%] position-relative date-label">
// // //             <span className="px-4 py-1 text-sm  text-[#B4B4B9]  bg-[#fff] z-[99] text-center">
// // //               {dateLabel}
// // //             </span>
// // //           </div>
// // //         )}
// // //       <div
// // //         className="flex-row flex"
// // //         style={{
// // //           alignSelf: mine ? "flex-start" : "flex-end ",
// // //           maxWidth: "70%",
// // //           // background: mine ? "#D72229" : "#F3F5FF",
// // //           // borderRadius: 25,
// // //           // opacity: m._sendFailed ? 0.6 : 1,
// // //           // border: m._sendFailed ? "1px dashed #c33" : undefined,
// // //         }}
// // //       >

// // //         {/* TEXT */}
// // //           {(!m.type || m.type === "text") && (
// // //             <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}
// // //               onClick={()=> console.log(m)}
// // //             >

// // //             <div
// // //               className={`
// // //                 ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
// // //                 ${isThird ? (mine ? "message-mine" : "message-other") : ""}
// // //                 flex items-center justify-center px-5 py-2.5
// // //                 text-[18px] !rounded-[25px]
// // //               `}
// // //               onDoubleClick={()=>handleLike()}
// // //               // onClick={()=>handleLike()}
// // //               >
// // //               {m.message}
// // //             </div>
// // //              {likesCount > 0 && (
// // //               <div style={{ fontSize: 14 }}>
// // //                 <img
// // //                   src="/icons/like.svg"
// // //                   style={{
// // //                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
                     
// // //                   }}
// // //                   alt="like-icon"
// // //                 />
// // //               </div>
// // //             )}

// // //               </div>
// // //           )}

// // //         {/* AUDIO */}
// // //         {m.type === "audio" && (
// // //           <>
// // //             {mediaUrl ? (
// // //               <VoiceNotePlayer
// // //                 mediaUrl={mediaUrl}
// // //                 mine={mine}
                
// // //               />
// // //             ) : (
// // //               <span style={{ fontSize: 12, color: "#999" }}>
// // //                 جاري تجهيز الصوت...
// // //               </span>
// // //             )}
// // //           </>
// // //         )}
// // //         {/* sticker */}
// // //         {
// // //           m.type === "sticker" && (
// // //             <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>

// // //               <div style={{ position: "relative", display: "inline-block" }}
// // //                 onDoubleClick={()=>handleLike()}
// // //               >
// // //                 <img
// // //                   src={mediaUrl}
// // //                   style={{
// // //                     maxWidth: "100%",
// // //                     opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
// // //                   }}                className="rounded-[18px] object-cover"
// // //                   alt="image"
// // //                   loading="lazy"
// // //                   referrerPolicy="no-referrer"
// // //                   width={180}
// // //                   height={230}
// // //                   />
// // //               </div>
// // //                 {m.likes && m.likes.length > 0 && (
// // //                 <div
// // //                   className={` 
// // //                     ${mine ? "" : ""}
                    
// // //                   `}
// // //                   style={{ fontSize: 14 }}
// // //                 >
// // //                   <img src="/icons/like.svg"
// // //                     style={{
// // //                       filter:
// // //                         "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// // //                     }}
// // //                     alt="like-icon" />
// // //                 </div>
// // //               )}
// // //             </div>

// // //           ) 
// // //         }
// // //         {/* IMAGE */}
// // //         {m.type === "image" && mediaUrl && (
// // //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>

// // //           <div style={{ position: "relative", display: "inline-block" }}
// // //               onDoubleClick={()=>handleLike()}
// // //           >
// // //             <div className={`flex items-center  overflow-hidden w-[200px] max-h-[250px] p-4  rounded-[18px] ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"} ${isThird ? (mine ? "message-mine" : "message-other") : ""} `}>
// // //               <img
// // //                 src={mediaUrl}
// // //                 style={{
// // //                   maxWidth: "100%",
// // //                   opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
// // //                 }}
// // //                 className="rounded-[18px] object-cover"
// // //                 alt="image"
// // //                 loading="lazy"
// // //                 referrerPolicy="no-referrer"
// // //                 width={180}
// // //                 height={230}
// // //                 />
// // //             </div>
// // //             {m.likes && m.likes.length > 0 && (
// // //                 <div
// // //                   style={{ fontSize: 14 }}
// // //                 >
// // //                   <img src="/icons/like.svg"
// // //                     style={{
// // //                       filter:
// // //                         "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// // //                     }}
// // //                     alt="like-icon" />
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {typeof m.uploadProgress === "number" && (
// // //               <div
// // //                 style={{
// // //                   position: "absolute",
// // //                   top: "50%",
// // //                   left: "50%",
// // //                   transform: "translate(-50%, -50%)",
// // //                 }}
// // //               >
// // //                 <ProgressCircle value={m.uploadProgress} />
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}



// // //         {/* VIDEO */}
// // //         {m.type === "video" && mediaUrl && (
// // //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}> 

// // //           <video
// // //             src={mediaUrl}
// // //             controls
// // //             style={{ maxWidth: "100%", borderRadius: 8 }}
// // //             controlsList="nodownload noremoteplayback"
// // //             disablePictureInPicture
// // //             />
// // //             {m.likes && m.likes.length > 0 && (
// // //                 <div
// // //                   className={` 
// // //                     ${mine ? "" : ""}
                    
// // //                   `}
// // //                   style={{ fontSize: 14 }}
// // //                 >
// // //                   <img src="/icons/like.svg"
// // //                     style={{
// // //                       filter:
// // //                         "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// // //                     }}
// // //                     alt="like-icon" />
// // //                 </div>
// // //               )}
// // //           </div>
// // //         )}
// // //         {!mine && isThird ? (
          
// // //           <img
// // //             src={recieverImg}
// // //             className="w-[40px] h-[40px] rounded-full mr-2"
// // //           />
// // //         ): <div className="w-[40px] h-[40px] rounded-full mr-2">

// // //         </div>
// // //         }
// // //         {/* META */}
// // //         <div
// // //           style={{
// // //             fontSize: 12,
// // //             color: "#666",
// // //             marginTop: 6,
// // //             display: "flex",
// // //             gap: 8,
// // //             alignItems: "center",
// // //           }}
// // //         >
// // //           {/* <span>
// // //             {mine ? "أنت" : m.sender} •{" "}
// // //             {new Date(m.timestamp).toLocaleString()}
// // //           </span> */}

// // //           {/* {isTemp && !m._sendFailed && (
// // //             <span style={{ color: "#b35" }}>جاري الإرسال…</span>
// // //           )} */}

// // //           {/* {m._sendFailed && (
// // //             <button
// // //               onClick={() => onRetry(m)}
// // //               style={{
// // //                 padding: "2px 8px",
// // //                 borderRadius: 6,
// // //                 border: "1px solid #c33",
// // //                 background: "#fff",
// // //                 color: "#c33",
// // //                 cursor: "pointer",
// // //               }}
// // //             >
// // //               إعادة إرسال
// // //             </button>
// // //           )} */}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };


// // // app/chats/_components/MessageItem.tsx
// // /* eslint-disable @next/next/no-img-element */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable jsx-a11y/alt-text */
// // 'use client';
// // import { useMemo, useState, useEffect, useRef, useCallback } from "react";
// // import { Message } from "@/types/types";
// // import VoiceNotePlayer from "./VoiceNotePlayer";
// // import { MessageMenu } from "./MessageMenu";
// // import "../css/custom.css";
// // import wsService from "@/lib/websocketService";

// // /**
// //  * Convert media to playable URL
// //  */
// // const useMediaUrl = (media: any) => {
// //   return useMemo(() => {
// //     if (!media) return null;

// //     // Array
// //     if (Array.isArray(media)) {
// //       const item = media[0];
// //       if (!item) return null;

// //       if (typeof item === "string") return item;
// //       if (item instanceof File || item instanceof Blob) {
// //         return URL.createObjectURL(item);
// //       }
// //     }

// //     // URL
// //     if (typeof media === "string") return media;

// //     // File / Blob
// //     if (media instanceof File || media instanceof Blob) {
// //       return URL.createObjectURL(media);
// //     }

// //     return null;
// //   }, [media]);
// // };

// // export const MessageItem = ({
// //   m,
// //   myId,
// //   index,
// //   recieverImg,
// //   prevMessage,
// //   isGroupAdmin = false,
// //   onReact,
// //   onEdit,
// //   onReply,
// //   onTranslate,
// //   onDelete,
// //   onCopy,
// //   showReactions = true,
// // }: {
// //   m: Message;
// //   myId: string | null;
// //   onRetry: (m: Message) => void;
// //   index: number;
// //   recieverImg: string;
// //   prevMessage?: Message;
// //   isGroupAdmin?: boolean;
// //   onReact?: (messageId: string, emoji: string) => void;
// //   onEdit?: (message: Message) => void;
// //   onReply?: (message: Message) => void;
// //   onTranslate?: (message: Message) => void;
// //   onDelete?: (message: Message) => void;
// //   onCopy?: (text: string) => void;
// //   showReactions?: boolean;
// // }) => {
// //   const mine = m.sender === myId;
// //   const isThird = (index + 1) % 2 === 0;
// //   const mediaUrl = useMediaUrl(m.media);
  
// //   // State للقائمة المنسدلة
// //   const [showMenu, setShowMenu] = useState(false);
// //   const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editText, setEditText] = useState(m.message || '');
// //   const messageRef = useRef<HTMLDivElement>(null);
// //   const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

// //   // State للـ Like
// //   const [liked, setLiked] = useState(m.likes?.includes(myId ?? ""));
// //   const [likesCount, setLikesCount] = useState(m.likes?.length || 0);
// //   const [reactions, setReactions] = useState<string[]>(m.likes || []);

// //   useEffect(() => {
// //     setLiked(m.likes?.includes(myId ?? ""));
// //     setLikesCount(m.likes?.length || 0);
// //     setReactions(m.likes || []);
// //   }, [m.likes, myId]);

// //   // معالجة الـ Like
// //   const handleLike = async () => {
// //     if (!myId || liked) return;

// //     setLiked(true);
// //     setLikesCount((prev) => prev + 1);
// //     setReactions((prev) => [...prev, '❤️']);

// //     const token = localStorage.getItem("boChatToken");
// //     if (!token) return;

// //     try {
// //       const res = await fetch("https://bo-chat.space/reacttomessage", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           reacter: myId,
// //           messageid: m._id?.toString(),
// //         }),
// //       });

// //       wsService.send({
// //         event: "react",
// //         metadata: {
// //           sender: myId,
// //           messageid: m._id?.toString(),
// //           reciever: m.sender,
// //         },
// //       });
// //     } catch (err) {
// //       console.error("LIKE ERROR", err);
// //       setLiked(false);
// //       setLikesCount((prev) => Math.max(prev - 1, 0));
// //       setReactions((prev) => prev.filter(r => r !== '❤️'));
// //     }
// //   };

// //   // معالجة التفاعل من القائمة
// //   const handleReact = (messageId: string, emoji: string) => {
// //     if (onReact) {
// //       onReact(messageId, emoji);
// //     } else {
// //       // Fallback: استخدام نفس منطق الـ Like
// //       if (!myId) return;
// //       setReactions((prev) => [...prev, emoji]);
// //       setLikesCount((prev) => prev + 1);
      
// //       // إرسال التفاعل إلى السيرفر
// //       const token = localStorage.getItem("boChatToken");
// //       if (!token) return;
      
// //       fetch("https://bo-chat.space/reacttomessage", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           reacter: myId,
// //           messageid: messageId,
// //         }),
// //       }).catch(console.error);
// //     }
// //   };

// //   // معالجة الضغط المطول (Long Press)
// //   const handleLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
// //     e.preventDefault();
// //     let clientX: number, clientY: number;

// //     if ('touches' in e) {
// //       const touch = e.touches[0];
// //       clientX = touch.clientX;
// //       clientY = touch.clientY;
// //     } else {
// //       clientX = e.clientX;
// //       clientY = e.clientY;
// //     }

// //     // منع ظهور القائمة إذا كانت الرسالة في وضع التعديل
// //     if (isEditing) return;

// //     setMenuPosition({ x: clientX, y: clientY });
// //     setShowMenu(true);
// //   }, [isEditing]);

// //   // معالجة النسخ
// //   const handleCopy = (text: string) => {
// //     navigator.clipboard.writeText(text).catch(console.error);
// //     // يمكن إضافة Toast هنا
// //   };

// //   // معالجة التعديل
// //   const handleEdit = async () => {
// //     if (!editText.trim() || !onEdit) return;
// //     await onEdit({ ...m, message: editText });
// //     setIsEditing(false);
// //   };

// //   // معالجة إلغاء التعديل
// //   const cancelEdit = () => {
// //     setIsEditing(false);
// //     setEditText(m.message || '');
// //   };

// //   // تنسيق التاريخ
// //   const isSameDay = (d1: Date, d2: Date) =>
// //     d1.getFullYear() === d2.getFullYear() &&
// //     d1.getMonth() === d2.getMonth() &&
// //     d1.getDate() === d2.getDate();

// //   const getDateLabel = (date: Date) => {
// //     const today = new Date();
// //     const yesterday = new Date();
// //     yesterday.setDate(today.getDate() - 1);

// //     if (isSameDay(date, today)) return "اليوم";
// //     if (isSameDay(date, yesterday)) return "أمس";

// //     return date.toLocaleDateString("ar-EG", {
// //       day: "numeric",
// //       month: "long",
// //       year: "numeric",
// //     });
// //   };

// //   const messageDate = new Date(m.timestamp);

// //   const showDateHeader =
// //     !prevMessage ||
// //     !isSameDay(new Date(prevMessage.timestamp), messageDate);

// //   const dateLabel = getDateLabel(messageDate);

// //   // مكون دائرة التقدم
// //   const ProgressCircle = ({ value }: { value: number }) => {
// //     const radius = 18;
// //     const stroke = 3;
// //     const normalized = radius - stroke * 2;
// //     const circumference = normalized * 2 * Math.PI;
// //     const offset = circumference - (value / 100) * circumference;

// //     return (
// //       <svg width={40} height={40}>
// //         <circle
// //           stroke="#fee2e2"
// //           fill="transparent"
// //           strokeWidth={stroke}
// //           r={normalized}
// //           cx={20}
// //           cy={20}
// //         />
// //         <circle
// //           stroke="#dc2626"
// //           fill="transparent"
// //           strokeWidth={stroke}
// //           strokeDasharray={`${circumference} ${circumference}`}
// //           style={{ strokeDashoffset: offset, transition: "0.2s" }}
// //           r={normalized}
// //           cx={20}
// //           cy={20}
// //         />
// //       </svg>
// //     );
// //   };

// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative">
// //       {showDateHeader && (
// //         <div className="flex justify-center my-3 w-[100%] position-relative date-label">
// //           <span className="px-4 py-1 text-sm text-[#B4B4B9] bg-[#fff] z-[99] text-center">
// //             {dateLabel}
// //           </span>
// //         </div>
// //       )}

// //       <div
// //         ref={messageRef}
// //         className="flex-row flex relative"
// //         style={{
// //           alignSelf: mine ? "flex-start" : "flex-end",
// //           maxWidth: "70%",
// //         }}
// //         onContextMenu={handleLongPress}
// //         onTouchStart={(e) => {
// //           // بدء المؤقت للضغط المطول
// //           if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
// //           touchTimerRef.current = setTimeout(() => {
// //             handleLongPress(e);
// //           }, 500);
// //         }}
// //         onTouchEnd={() => {
// //           if (touchTimerRef.current) {
// //             clearTimeout(touchTimerRef.current);
// //             touchTimerRef.current = null;
// //           }
// //         }}
// //         onTouchMove={() => {
// //           if (touchTimerRef.current) {
// //             clearTimeout(touchTimerRef.current);
// //             touchTimerRef.current = null;
// //           }
// //         }}
// //       >
// //         {/* TEXT */}
// //         {(!m.type || m.type === "text") && (
// //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
// //             <div
// //               className={`
// //                 ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
// //                 ${isThird ? (mine ? "message-mine" : "message-other") : ""}
// //                 flex items-center justify-center px-5 py-2.5
// //                 text-[18px] !rounded-[25px]
// //                 ${isEditing ? 'p-0 overflow-hidden' : ''}
// //               `}
// //               onDoubleClick={() => handleLike()}
// //             >
// //               {isEditing ? (
// //                 <div className="flex flex-col gap-2 p-2">
// //                   <input
// //                     type="text"
// //                     value={editText}
// //                     onChange={(e) => setEditText(e.target.value)}
// //                     className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-black min-w-[200px]"
// //                     autoFocus
// //                     onKeyDown={(e) => {
// //                       if (e.key === 'Enter') handleEdit();
// //                       if (e.key === 'Escape') cancelEdit();
// //                     }}
// //                   />
// //                   <div className="flex gap-2 justify-end">
// //                     <button
// //                       onClick={handleEdit}
// //                       className="px-3 py-1 bg-[#D72229] text-white rounded-lg text-sm"
// //                     >
// //                       حفظ
// //                     </button>
// //                     <button
// //                       onClick={cancelEdit}
// //                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
// //                     >
// //                       إلغاء
// //                     </button>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 m.message
// //               )}
// //             </div>
// //             {likesCount > 0 && (
// //               <div style={{ fontSize: 14 }}>
// //                 <img
// //                   src="/icons/like.svg"
// //                   style={{
// //                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
// //                   }}
// //                   alt="like-icon"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* AUDIO */}
// //         {m.type === "audio" && (
// //           <>
// //             {mediaUrl ? (
// //               <VoiceNotePlayer
// //                 mediaUrl={mediaUrl}
// //                 mine={mine}
// //               />
// //             ) : (
// //               <span style={{ fontSize: 12, color: "#999" }}>
// //                 جاري تجهيز الصوت...
// //               </span>
// //             )}
// //           </>
// //         )}

// //         {/* STICKER */}
// //         {m.type === "sticker" && (
// //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
// //             <div style={{ position: "relative", display: "inline-block" }}
// //               onDoubleClick={() => handleLike()}
// //             >
// //               <img
// //                 src={mediaUrl}
// //                 style={{
// //                   maxWidth: "100%",
// //                   opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
// //                 }}
// //                 className="rounded-[18px] object-cover"
// //                 alt="sticker"
// //                 loading="lazy"
// //                 referrerPolicy="no-referrer"
// //                 width={180}
// //                 height={230}
// //               />
// //             </div>
// //             {likesCount > 0 && (
// //               <div style={{ fontSize: 14 }}>
// //                 <img
// //                   src="/icons/like.svg"
// //                   style={{
// //                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// //                   }}
// //                   alt="like-icon"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* IMAGE */}
// //         {m.type === "image" && mediaUrl && (
// //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
// //             <div style={{ position: "relative", display: "inline-block" }}
// //               onDoubleClick={() => handleLike()}
// //             >
// //               <div className={`flex items-center overflow-hidden w-[200px] max-h-[250px] p-4 rounded-[18px] ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"} ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}>
// //                 <img
// //                   src={mediaUrl}
// //                   style={{
// //                     maxWidth: "100%",
// //                     opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
// //                   }}
// //                   className="rounded-[18px] object-cover"
// //                   alt="image"
// //                   loading="lazy"
// //                   referrerPolicy="no-referrer"
// //                   width={180}
// //                   height={230}
// //                 />
// //               </div>
// //               {likesCount > 0 && (
// //                 <div style={{ fontSize: 14 }}>
// //                   <img
// //                     src="/icons/like.svg"
// //                     style={{
// //                       filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// //                     }}
// //                     alt="like-icon"
// //                   />
// //                 </div>
// //               )}
// //             </div>

// //             {typeof m.uploadProgress === "number" && (
// //               <div
// //                 style={{
// //                   position: "absolute",
// //                   top: "50%",
// //                   left: "50%",
// //                   transform: "translate(-50%, -50%)",
// //                 }}
// //               >
// //                 <ProgressCircle value={m.uploadProgress} />
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* VIDEO */}
// //         {m.type === "video" && mediaUrl && (
// //           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
// //             <video
// //               src={mediaUrl}
// //               controls
// //               style={{ maxWidth: "100%", borderRadius: 8 }}
// //               controlsList="nodownload noremoteplayback"
// //               disablePictureInPicture
// //             />
// //             {likesCount > 0 && (
// //               <div style={{ fontSize: 14 }}>
// //                 <img
// //                   src="/icons/like.svg"
// //                   style={{
// //                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
// //                   }}
// //                   alt="like-icon"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Avatar */}
// //         {!mine && isThird ? (
// //           <img
// //             src={recieverImg}
// //             className="w-[40px] h-[40px] rounded-full mr-2"
// //             alt="avatar"
// //           />
// //         ) : (
// //           <div className="w-[40px] h-[40px] rounded-full mr-2"></div>
// //         )}
// //       </div>

// //       {/* القائمة المنسدلة */}
// //       {showMenu && (
// //         <MessageMenu
// //           message={m}
// //           myId={myId}
// //           isGroupAdmin={isGroupAdmin}
// //           onReact={handleReact}
// //           onCopy={onCopy || handleCopy}
// //           onEdit={(msg) => {
// //             setIsEditing(true);
// //             setEditText(msg.message || '');
// //           }}
// //           onReply={onReply || (() => {})}
// //           onTranslate={onTranslate || ((msg) => {
// //             // يمكن إضافة ترجمة هنا
// //             console.log('Translate:', msg);
// //           })}
// //           onDelete={onDelete || (() => {})}
// //           onClose={() => setShowMenu(false)}
// //           position={menuPosition}
// //         />
// //       )}
// //     </div>
// //   );
// // };



// // app/chats/_components/MessageItem.tsx
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable jsx-a11y/alt-text */
// 'use client';
// import { useMemo, useState, useEffect, useRef, useCallback } from "react";
// import { Message } from "@/types/types";
// import VoiceNotePlayer from "./VoiceNotePlayer";
// import { MessageMenu } from "./MessageMenu";
// import "../css/custom.css";
// import wsService from "@/lib/websocketService";

// /**
//  * Convert media to playable URL
//  */
// const useMediaUrl = (media: any) => {
//   return useMemo(() => {
//     if (!media) return null;

//     // Array
//     if (Array.isArray(media)) {
//       const item = media[0];
//       if (!item) return null;

//       if (typeof item === "string") return item;
//       if (item instanceof File || item instanceof Blob) {
//         return URL.createObjectURL(item);
//       }
//     }

//     // URL
//     if (typeof media === "string") return media;

//     // File / Blob
//     if (media instanceof File || media instanceof Blob) {
//       return URL.createObjectURL(media);
//     }

//     return null;
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
// }) => {
//   const mine = m.sender === myId;
//   const isThird = (index + 1) % 2 === 0;
//   const mediaUrl = useMediaUrl(m.media);
  
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
//       const res = await fetch("https://bo-chat.space/reacttomessage", {
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
//       // Fallback: استخدام نفس منطق الـ Like
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

//     // منع ظهور القائمة إذا كانت الرسالة في وضع التعديل
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

//   const showDateHeader =
//     !prevMessage ||
//     !isSameDay(new Date(prevMessage.timestamp), messageDate);

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

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 6 }} className="relative">
//       {showDateHeader && (
//         <div className="flex justify-center my-3 w-[100%] position-relative date-label">
//           <span className="px-4 py-1 text-sm text-[#B4B4B9] bg-[#fff] z-[99] text-center">
//             {dateLabel}
//           </span>
//         </div>
//       )}

//       <div
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
//         {/* TEXT */}
//         {(!m.type || m.type === "text") && (
//           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//             <div
//               className={`
//                 ${mine ? "text-white bg-[#D72229]" : "text-[#D72229] bg-[#F3F5FF]"}
//                 ${isThird ? (mine ? "message-mine" : "message-other") : ""}
//                 flex items-center justify-center px-5 py-2.5
//                 text-[18px] !rounded-[25px]
//                 ${isEditing ? 'p-0 overflow-hidden' : ''}
//                 ${m._sendFailed ? 'opacity-60' : ''}
//               `}
//               onDoubleClick={() => handleLike()}
//             >
//               {isEditing ? (
//                 <div className="flex flex-col gap-2 p-2">
//                   <input
//                     type="text"
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                     className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D72229] text-black min-w-[200px]"
//                     autoFocus
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') handleEdit();
//                       if (e.key === 'Escape') cancelEdit();
//                     }}
//                   />
//                   <div className="flex gap-2 justify-end">
//                     <button
//                       onClick={handleEdit}
//                       className="px-3 py-1 bg-[#D72229] text-white rounded-lg text-sm"
//                     >
//                       حفظ
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
//                     >
//                       إلغاء
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 m.message
//               )}
//             </div>
//             {likesCount > 0 && showReactions && (
//               <div style={{ fontSize: 14 }}>
//                 <img
//                   src="/icons/like.svg"
//                   style={{
//                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg)"
//                   }}
//                   alt="like-icon"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* AUDIO */}
//         {m.type === "audio" && (
//           <>
//             {mediaUrl ? (
//               <VoiceNotePlayer
//                 mediaUrl={mediaUrl}
//                 mine={mine}
//               />
//             ) : (
//               <span style={{ fontSize: 12, color: "#999" }}>
//                 جاري تجهيز الصوت...
//               </span>
//             )}
//           </>
//         )}

//         {/* STICKER */}
//         {m.type === "sticker" && (
//           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//             <div style={{ position: "relative", display: "inline-block" }}
//               onDoubleClick={() => handleLike()}
//             >
//               <img
//                 src={mediaUrl}
//                 style={{
//                   maxWidth: "100%",
//                   opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
//                 }}
//                 className="rounded-[18px] object-cover"
//                 alt="sticker"
//                 loading="lazy"
//                 referrerPolicy="no-referrer"
//                 width={180}
//                 height={230}
//               />
//             </div>
//             {likesCount > 0 && showReactions && (
//               <div style={{ fontSize: 14 }}>
//                 <img
//                   src="/icons/like.svg"
//                   style={{
//                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//                   }}
//                   alt="like-icon"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* IMAGE */}
//         {m.type === "image" && mediaUrl && (
//           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//             <div style={{ position: "relative", display: "inline-block" }}
//               onDoubleClick={() => handleLike()}
//             >
//               <div className={`flex items-center overflow-hidden w-[200px] max-h-[250px] p-4 rounded-[18px] ${mine ? "bg-[#D72229]" : "bg-[#F3F5FF]"} ${isThird ? (mine ? "message-mine" : "message-other") : ""}`}>
//                 <img
//                   src={mediaUrl}
//                   style={{
//                     maxWidth: "100%",
//                     opacity: typeof m.uploadProgress === "number" ? 0.6 : 1,
//                   }}
//                   className="rounded-[18px] object-cover"
//                   alt="image"
//                   loading="lazy"
//                   referrerPolicy="no-referrer"
//                   width={180}
//                   height={230}
//                 />
//               </div>
//               {likesCount > 0 && showReactions && (
//                 <div style={{ fontSize: 14 }}>
//                   <img
//                     src="/icons/like.svg"
//                     style={{
//                       filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//                     }}
//                     alt="like-icon"
//                   />
//                 </div>
//               )}
//             </div>

//             {typeof m.uploadProgress === "number" && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                 }}
//               >
//                 <ProgressCircle value={m.uploadProgress} />
//               </div>
//             )}
//           </div>
//         )}

//         {/* VIDEO */}
//         {m.type === "video" && mediaUrl && (
//           <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
//             <video
//               src={mediaUrl}
//               controls
//               style={{ maxWidth: "100%", borderRadius: 8 }}
//               controlsList="nodownload noremoteplayback"
//               disablePictureInPicture
//             />
//             {likesCount > 0 && showReactions && (
//               <div style={{ fontSize: 14 }}>
//                 <img
//                   src="/icons/like.svg"
//                   style={{
//                     filter: "brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(4251%) hue-rotate(350deg) brightness(90%) contrast(95%)"
//                   }}
//                   alt="like-icon"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Avatar */}
//         {!mine && isThird ? (
//           <img
//             src={recieverImg || '/imgs/user.png'}
//             className="w-[40px] h-[40px] rounded-full mr-2"
//             alt="avatar"
//           />
//         ) : (
//           <div className="w-[40px] h-[40px] rounded-full mr-2"></div>
//         )}

//         {/* زر إعادة المحاولة للرسائل الفاشلة */}
//         {m._sendFailed && (
//           <button
//             onClick={() => onRetry(m)}
//             className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm"
//           >
//             <span>إعادة المحاولة</span>
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//           </button>
//         )}
//       </div>

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
import VoiceNotePlayer from "./VoiceNotePlayer";
import { MessageMenu } from "./MessageMenu";
import "../css/custom.css";
import wsService from "@/lib/websocketService";

// ================= دوال مساعدة للملفات =================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";

/**
 * الحصول على أيقونة الملف حسب النوع
 */
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

/**
 * الحصول على لون الملف حسب النوع
 */
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

/**
 * تنسيق حجم الملف
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * الحصول على امتداد الملف
 */
const getFileExtension = (fileName: string): string => {
  if (!fileName) return '';
  const ext = fileName.split('.').pop();
  return ext ? ext.toUpperCase() : '';
};

/**
 * التحقق من أن الملف صورة
 */
const isImageFile = (type: string): boolean => {
  return type === 'image' || type === 'sticker';
};

/**
 * التحقق من أن الملف فيديو
 */
const isVideoFile = (type: string): boolean => {
  return type === 'video';
};

/**
 * التحقق من أن الملف صوت
 */
const isAudioFile = (type: string): boolean => {
  return type === 'audio';
};

/**
 * التحقق من أن الملف مستند
 */
const isDocumentFile = (type: string): boolean => {
  const docTypes = ['pdf', 'word', 'excel', 'powerpoint', 'archive', 'text', 'file'];
  return docTypes.includes(type);
};

/**
 * Convert media to playable URL
 */
const useMediaUrl = (media: any) => {
  return useMemo(() => {
    if (!media) return null;

    // Array
    if (Array.isArray(media)) {
      const item = media[0];
      if (!item) return null;

      if (typeof item === "string") return item;
      if (item instanceof File || item instanceof Blob) {
        return URL.createObjectURL(item);
      }
    }

    // URL
    if (typeof media === "string") {
      // إذا كان الرابط نسبياً، أضف API_BASE
      if (media.startsWith('/')) {
        return `${API_BASE}${media}`;
      }
      return media;
    }

    // File / Blob
    if (media instanceof File || media instanceof Blob) {
      return URL.createObjectURL(media);
    }

    return null;
  }, [media]);
};

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
  onImageClick?: (imageUrl: string) => void;
  onFileClick?: (fileUrl: string, fileName: string) => void;
}) => {
  const mine = m.sender === myId;
  const isThird = (index + 1) % 2 === 0;
  const mediaUrl = useMediaUrl(m.media);
  
  // State للقائمة المنسدلة
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(m.message || '');
  const messageRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // State للـ Like
  const [liked, setLiked] = useState(m.likes?.includes(myId ?? ""));
  const [likesCount, setLikesCount] = useState(m.likes?.length || 0);
  const [reactions, setReactions] = useState<string[]>(m.likes || []);

  useEffect(() => {
    setLiked(m.likes?.includes(myId ?? ""));
    setLikesCount(m.likes?.length || 0);
    setReactions(m.likes || []);
  }, [m.likes, myId]);

  // معالجة الـ Like
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

  // معالجة التفاعل من القائمة
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

  // معالجة الضغط المطول (Long Press) - للماوس
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

    if (isEditing) return;

    setMenuPosition({ x: clientX, y: clientY });
    setShowMenu(true);
  }, [isEditing]);

  // معالجة الضغط المطول - للهواتف (Touch)
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

  // معالجة النسخ
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  // معالجة التعديل
  const handleEdit = async () => {
    if (!editText.trim() || !onEdit) return;
    await onEdit({ ...m, message: editText });
    setIsEditing(false);
  };

  // معالجة إلغاء التعديل
  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(m.message || '');
  };

  // تنسيق التاريخ
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

  // مكون دائرة التقدم
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
          {/* أيقونة الملف */}
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20"
          >
            <img 
              src={icon} 
              alt={fileType} 
              className="w-7 h-7 object-contain"
            />
          </div>

          {/* معلومات الملف */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {fileName}
            </p>
            <div className="flex items-center gap-2 text-xs opacity-70">
              <span>{fileExtension}</span>
              <span>•</span>
              <span>{formatFileSize(fileSize)}</span>
            </div>
          </div>

          {/* زر التحميل */}
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <img src="/icons/download.svg" alt="تحميل" className="w-4 h-4" />
          </div>
        </div>

        {/* ردود الفعل */}
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

          {/* تقدم التحميل */}
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

          {/* ردود الفعل */}
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

  // ================= عرض الفيديو =================
  const renderVideoMessage = () => {
    if (!mediaUrl) return null;

    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <video
          src={mediaUrl}
          controls
          style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 300 }}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          className="rounded-[18px]"
        />
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
        <VoiceNotePlayer
          mediaUrl={mediaUrl}
          mine={mine}
        />
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
  const renderTextMessage = () => {
    return (
      <div className={`flex flex-row items-center gap-1 ${mine ? "" : "flex-row-reverse"}`}>
        <div
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
            m.message
          )}
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

  // ================= اختيار نوع العرض حسب نوع الرسالة =================
  const renderContent = () => {
    // التحقق من نوع الملف وعرضه بشكل مناسب
    if (m.type === 'text' || !m.type) {
      return renderTextMessage();
    }
    
    if (m.type === 'image') {
      return renderImageMessage();
    }
    
    if (m.type === 'video') {
      return renderVideoMessage();
    }
    
    if (m.type === 'audio') {
      return renderAudioMessage();
    }
    
    if (m.type === 'sticker') {
      return renderStickerMessage();
    }
    
    // جميع أنواع الملفات الأخرى (PDF, Word, Excel, إلخ)
    if (isDocumentFile(m.type)) {
      return renderFileMessage();
    }
    
    // نوع غير معروف - عرض كنص
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
        className="flex-row flex relative"
        style={{
          alignSelf: mine ? "flex-start" : "flex-end",
          maxWidth: "70%",
        }}
        onContextMenu={handleLongPress}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {renderContent()}

        {/* Avatar */}
        {!mine && isThird ? (
          <img
            src={recieverImg || '/imgs/user.png'}
            className="w-[40px] h-[40px] rounded-full mr-2"
            alt="avatar"
          />
        ) : (
          <div className="w-[40px] h-[40px] rounded-full mr-2"></div>
        )}

        {/* زر إعادة المحاولة للرسائل الفاشلة */}
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

      {/* القائمة المنسدلة */}
      {showMenu && (
        <MessageMenu
          message={m}
          myId={myId}
          isGroupAdmin={isGroupAdmin}
          onReact={handleReact}
          onCopy={onCopy || handleCopy}
          onEdit={(msg) => {
            setIsEditing(true);
            setEditText(msg.message || '');
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