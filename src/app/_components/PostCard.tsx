// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { Post } from "@/types/types";
// import Link from "next/link";
// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import FollowButton from "../profile/_components/FollowButton";
// import Loader from "@/components/Loader";

// // 
// import { useLoginModal } from "@/contexts/LoginModalContext";

// // 
// function parseDateFlexible(dateStr?: string | null): Date | null {
//   if (!dateStr) return null;
//   const s = String(dateStr).trim();
//   if (!s || s.toLowerCase().includes("invalid")) return null;
//   if (/^\d+$/.test(s)) {
//     const d = new Date(Number(s));
//     if (!isNaN(d.getTime())) return d;
//   }
//   const d = new Date(s.replace(" ", "T"));
//   if (!isNaN(d.getTime())) return d;
//   return null;
// }

// export function timeAgoAr(dateStr?: string) {
//   const d = parseDateFlexible(dateStr);
//   if (!d) return "منذ لحظات";
//   const now = new Date();
//   const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
//   if (diffSec < 60) return "منذ لحظات";
//   const mins = Math.floor(diffSec / 60);
//   const hours = Math.floor(mins / 60);
//   const days = Math.floor(hours / 24);
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   if (hours < 24) return `منذ ${hours} ساعة`;
//   if (days < 30) return `منذ ${days} يوم`;
//   return `منذ ${Math.floor(days / 30)} شهر`;
// }

// export default function PostCard({ post }: { post: Post }) {
//   // 
//   const { openLoginModal } = useLoginModal();
// // 

//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(
//     Array.isArray(post.likes) ? post.likes.length : 0
//   );

//   const [expanded, setExpanded] = useState(false);
//   const [isLongText, setIsLongText] = useState(false);
//   const textRef = useRef<HTMLParagraphElement>(null);

//   // --- HIDE STATE (persisted in localStorage) ---
//   const [isHidden, setIsHidden] = useState(false);

//   const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
//   const sharesCount =
//     (Array.isArray(post.shares) && post.shares.length) ||
//     (typeof post.shareCount === "number" && post.shareCount) ||
//     0;

//   const userName = post?.name || "مستخدم";
//   const userHandle = (post?.username || "").toString().replaceAll(" ", "");

//   const firstImage =
//     Array.isArray(post.image) && post.image.length > 0 ? post.image[0] : null;

//   const imgW = firstImage?.width ? Number(firstImage.width) : 1080;
//   const imgH = firstImage?.height ? Number(firstImage.height) : 1350;
//   const isQuestion = post.type === "question";

//   const shouldShowImage = !!firstImage?.image;

//   const validImage =
//     firstImage?.image &&
//     (firstImage.image.startsWith("http") || firstImage.image.startsWith("/"));

//   const likerAvatars: string[] = Array.isArray(post.likes)
//     ? Array.from(
//         new Set(
//           post.likes
//             .map((l: any) => (typeof l?.userimg === "string" ? l.userimg : ""))
//             .filter(Boolean)
//         )
//       ).slice(0, 5)
//     : [];

//   const cardClass = isQuestion
//     ? "rounded-[26px] min-w-[300px] bg-gradient-to-b from-[#EAE8E8] to-[#fff] border border-[#D72229] bg-white"
//     : "rounded-[26px] min-w-[300px] text-right bg-gradient-to-b from-[#EAE8E8] to-[#fff]";

//   const textInnerBorder =
//     post.type === "question" ? " shadow-[inset_0_0_0_1px_#D72229]" : "";
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const images = Array.isArray(post.image) ? post.image : [];

//   // Get current user data from localStorage
//   const user = JSON.parse(localStorage.getItem("userData") || "null");
//   const myUserId = user?._id;
//   const myUserImg =
//     typeof window !== "undefined"
//       ? localStorage.getItem("userimg")
//       : "/imgs/user.png";
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

//   // --- Read hidden state from localStorage on mount ---
//   useEffect(() => {
//     if (typeof window !== "undefined" && post._id) {
//       const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
//       if (Array.isArray(hidden) && hidden.includes(post._id)) {
//         setIsHidden(true);
//       }
//     }
//   }, [post._id]);

//   const handleLike = async () => {
//     // if (!token || !myUserId) return;
// if (!token || !myUserId) {
//   openLoginModal();
//   return;
// } 
//     // Optimistic Update
//     setLiked((prev) => {
//       setLikeCount((count) => (prev ? count - 1 : count + 1));
//       return !prev;
//     });

//     try {
//       const res = await fetch(`https://bo-chat.space/posts/${post._id}/reactions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: myUserId }),
//       });

//       if (!res.ok) throw new Error("Like failed");
//     } catch (err) {
//       console.error("LIKE ERROR:", err);
//       // Rollback
//       setLiked((prev) => {
//         setLikeCount((count) => (prev ? count - 1 : count + 1));
//         return !prev;
//       });
//     }
//   };

//   useEffect(() => {
//     const el = textRef.current;
//     if (el) {
//       const computed = window.getComputedStyle(el);
//       const lineHeight = parseFloat(computed.lineHeight);
//       const height = el.scrollHeight;
//       const visibleHeight = lineHeight * 3;
//       setIsLongText(height > visibleHeight + 2);
//     }
//   }, [post.content]);

//   const [showMenu, setShowMenu] = useState(false);
//   const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
//   const dotsRef = useRef<HTMLDivElement | null>(null);
//   const [shareText, setShareText] = useState("");
//   const [sharing, setSharing] = useState(false);

//   const isLikedByMe =
//     myUserId &&
//     Array.isArray(post.likes) &&
//     post.likes.some((like: any) => like.userid === myUserId);

//   useEffect(() => {
//     setLiked(!!isLikedByMe);
//   }, [isLikedByMe]);

//   // ---------------------------   BLOCK / REPORT   -----------------------------------------
//   const handleBlock = () => {
//     // Hide the post and persist in localStorage
//      if (!myUserId || !token) {
//     openLoginModal();
//     setShowMenu(false); // أغلق القائمة
//     return; // لا تنفذ الحظر
//   }
//     if (typeof window !== "undefined" && post._id) {
//       const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
//       if (!hidden.includes(post._id)) {
//         hidden.push(post._id);
//         localStorage.setItem("hiddenPosts", JSON.stringify(hidden));
//       }
//     }
//     setIsHidden(true);
//     setShowMenu(false);
//   };

//   const handleReport = async () => {
//     // if (!token || !myUserId) {
//     //   window.location.href = "/login";
//     //   return;
//     // }

//    if (!token || !myUserId) {
//     openLoginModal();
//     return;
//   }

//     try {
//       const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           postid: post._id,
//           email: "", // optional, can be omitted
//         }),
//       });

//       const text = await res.text();

//       if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");

//       toast.success("تم إرسال البلاغ بنجاح");
//       setShowMenu(false);
//     } catch (err) {
//       console.error("REPORT ERROR:", err);
//       toast.error("حصل خطأ أثناء إرسال البلاغ");
//     }
//   };

//   // ---------------------------   COMMENTS   -----------------------------------------
//   const [showCommentOverlay, setShowCommentOverlay] = useState(false);
//   const [comments, setComments] = useState<any[]>([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);

//   const fetchComments = async () => {
//     // if (!myUserId || !token) {
//     //   window.location.href = "/login";
//     //   return;
//     // }
//      if (!myUserId || !token) {
//     openLoginModal();
//     return;
//   }
//     try {
//       setLoadingComments(true);
//       const res = await fetch(
//         `https://bo-chat.space/getcomments/${myUserId}?postid=${post._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to load comments");
//       const data = await res.json();
//       setComments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("COMMENTS ERROR:", err);
//       setComments([]);
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const submitComment = async () => {
//     // if (!myUserId || !token) {
//     //   window.location.href = "/login";
//     //   return;
//     // }
//      if (!myUserId || !token) {
//     openLoginModal();
//     return;
//   }
//     if (!commentText.trim()) return;
//     try {
//       const res = await fetch(`https://bo-chat.space/posts/${post._id}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: myUserId, comment: commentText.trim() }),
//       });
//       if (!res.ok) throw new Error("Failed to send comment");
//       setCommentText("");
//       fetchComments();
//     } catch (err) {
//       console.error("SEND COMMENT ERROR:", err);
//       alert("حصل خطأ أثناء إرسال التعليق");
//     }
//   };

//   const handleReportComment = async (commentId: string) => {
//     // if (!token || !myUserId) {
//     //   window.location.href = "/login";
//     //   return;
//     // }
//       if (!token || !myUserId) {
//     openLoginModal();
//     return;
//   }
//     try {
//       const res = await fetch(`https://bo-chat.space/report/comment/${commentId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userid: myUserId,
//           reporttype: "comment",
//           reportdescription: "محتوى غير لائق",
//         }),
//       });
//       const data = await res.text();
//       if (!res.ok) throw new Error(data || "فشل إرسال البلاغ");
//       toast.success("تم إرسال البلاغ بنجاح ✅");
//       setShowCommentMenu(null);
//     } catch (err) {
//       console.error("REPORT COMMENT ERROR:", err);
//       toast.error("حصل خطأ أثناء إرسال البلاغ");
//     }
//   };

//   const handleCommentLike = async (commentId: string) => {
//     // if (!token || !myUserId) {
//     //   window.location.href = "/login";
//     //   return;
//     // }
//      if (!token || !myUserId) {
//     openLoginModal();
//     return;
//   }
//     // Optimistic UI
//     setComments((prev) =>
//       prev.map((comment) => {
//         if (comment._id !== commentId) return comment;
//         const alreadyLiked =
//           Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
//         return {
//           ...comment,
//           reacts: alreadyLiked
//             ? comment.reacts.filter((id: string) => id !== myUserId)
//             : [...(comment.reacts || []), myUserId],
//         };
//       })
//     );
//     try {
//       const res = await fetch("https://bo-chat.space/comment/react", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: myUserId, commentid: commentId }),
//       });
//       if (!res.ok) throw new Error("Failed to react on comment");
//     } catch (err) {
//       console.error("COMMENT LIKE ERROR:", err);
//       fetchComments(); // rollback
//     }
//   };

//   // ---------------------------   SHARE   -----------------------------------------
//   const [showShareOverlay, setShowShareOverlay] = useState(false);
//   const [followers, setFollowers] = useState<any[]>([]);
//   const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
//   const [loadingFollowers, setLoadingFollowers] = useState(false);


//   const handleShare = async () => {
//     // if (!token || !myUserId) {
//     //   window.location.href = "/login";
//     //   return;
//     // }
//     if (!token || !myUserId) {
//     openLoginModal();
//     return;
//   }

//     try {
//       setSharing(true);
//       const payload = { userid: myUserId, content: shareText.trim() };
//       const res = await fetch(`https://bo-chat.space/posts/${post._id}/share`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         data = await res.text();
//       }
//       if (!res.ok)
//         throw new Error(typeof data === "string" ? data : data?.message || "Share failed");
//       toast.success("تمت مشاركة المنشور بنجاح ✅");
//       setShareText("");
//       setShowShareOverlay(false);
//     } catch (err) {
//       console.error("SHARE ERROR:", err);
//       toast.error("حصل خطأ أثناء الشير");
//     } finally {
//       setSharing(false);
//     }
//   };

//   // ---------------------------   LIKES OVERLAY   -----------------------------------------
//   const [showLikesOverlay, setShowLikesOverlay] = useState(false);
 
//   // --- If hidden, render the hidden card instead ---
// if (isHidden) {
//   return (
//     <article dir="rtl" className={`${cardClass} relative`}>
//       <div className="p-6 flex flex-col items-start gap-3 min-h-[220px]">
//         {/* Icon + Heading row - aligned to the start (right) */}
//         <div className="flex items-center gap-2 mb-1">
//           <img
//             src="/icons/Group 8735.svg"
//             alt="مخفي"
//             className="w-[16.36px] h-[15px]"
//           />
//           <p className="text-[#D72229] text-[14px] font-semibold font-cairo leading-[100%]">
//             تم الاخفاء
//           </p>
//         </div>

//         {/* Description - centered */}
//         <p
//           className="text-black text-[14px] font-semibold font-cairo leading-[1.8] text-center max-w-[314px] self-center"
//           style={{ verticalAlign: "middle" }}
//         >
//           بنساعدك إنك تتحكم في المحتوى اللي بيظهر لك
//           <br />
//           تم إخفاء هذه الفضفضة من موجزك بناءً على تفضيلاتك.
//         </p>

//         {/* Buttons - aligned to the start (right) */}
//         <div className="flex justify-center gap-3 mt-2">
//   <button
//     onClick={() => {
//       if (typeof window !== "undefined" && post._id) {
//         const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
//         const updated = hidden.filter((id: string) => id !== post._id);
//         localStorage.setItem("hiddenPosts", JSON.stringify(updated));
//       }
//       setIsHidden(false);
//     }}
//     className="w-[125px] h-[50px] rounded-[20px] bg-[#D72229] text-white font-semibold font-cairo text-[17px] leading-[100%] hover:bg-[#b91c22] transition shadow-sm flex items-center justify-center"
//   >
//     تراجع
//   </button>
//   <button
//     onClick={handleReport}
//     className="w-[182px] h-[50px] rounded-[20px] bg-white text-[#D72229] font-semibold font-cairo text-[17px] leading-[100%] border border-gray-200 hover:bg-gray-50 transition shadow-sm flex items-center justify-center"
//   >
//     ابلاغ
//   </button>
// </div>
//       </div>
//     </article>
//   );
// }

//   // --- Normal post rendering ---
//   return (
//     <article dir="rtl" className={`${cardClass + textInnerBorder} relative`}>
//       <header className="p-5 flex items-start justify-between gap-3">
//         {/* <div className="flex gap-2">
//           <div className="relative h-[50px] w-[50px] shrink-0 rounded-[21px]">
//             <Link href={`/profile/${post.userid}`}>
//               <img
//                 src={post.userimg || "/imgs/user.png"}
//                 alt={userName}
//                 sizes="50px"
//                 className="object-cover rounded-[21px]"
//               />
//               {post.vip && (
//                 <div className="absolute bottom-[-8px] right-1/2 transform translate-x-1/2 w-5 h-5">
//                   <img src="/icons/vip.svg" alt="" />
//                 </div>
//               )}
//             </Link>
//           </div>
//           <div className="">
//             <div className="flex flex-col">
//               <span className="font-semibold">{userName}</span>
//               <span className="text-sm text-black/50">@{userHandle}</span>
//             </div>
//           </div>
//         </div> */}
//         <div className="flex gap-2">
//   {/* صورة المستخدم */}
//   <div
//     className="relative h-[50px] w-[50px] shrink-0 rounded-[21px] cursor-pointer"
//     onClick={() => {
//       if (!myUserId || !token) {
//         openLoginModal();
//         return;
//       }
//       window.location.href = `/profile/${post.userid}`;
//     }}
//   >
//     <img
//       src={post.userimg || "/imgs/user.png"}
//       alt={userName}
//       sizes="50px"
//       className="object-cover rounded-[21px]"
//     />
//     {post.vip && (
//       <div className="absolute bottom-[-8px] right-1/2 transform translate-x-1/2 w-5 h-5">
//         <img src="/icons/vip.svg" alt="" />
//       </div>
//     )}
//   </div>
//   {/* اسم المستخدم */}
//   <div
//     className="cursor-pointer"
//     onClick={() => {
//       if (!myUserId || !token) {
//         openLoginModal();
//         return;
//       }
//       window.location.href = `/profile/${post.userid}`;
//     }}
//   >
//     <div className="flex flex-col">
//       <span className="font-semibold">{userName}</span>
//       <span className="text-sm text-black/50">@{userHandle}</span>
//     </div>
//   </div>
// </div>
//         <div className="flex relative items-center justify-center gap-2">
//           <div className="text-xs text-[#D72229]">
//             {timeAgoAr(post.createdAt || new Date().toISOString())}
//           </div>
//           <div
//             ref={dotsRef}
//             onClick={() => {
//               if (dotsRef.current) {
//                 const rect = dotsRef.current.getBoundingClientRect();
//                 setMenuPos({
//                   top: rect.bottom + 8,
//                   left: window.innerWidth - rect.right,
//                 });
//               }
//               setShowMenu((prev) => !prev);
//             }}
//             className="cursor-pointer"
//           >
//             <img src="/imgs/dots.svg" className="mr-1" alt="menu" />
//           </div>
//         </div>
//       </header>

//       {post.content ? (
//         <div className="px-4">
//           <p
//             ref={textRef}
//             className={`leading-7 text-black/90 whitespace-pre-wrap break-words transition-all duration-300 ${
//               expanded ? "" : "line-clamp-3 overflow-hidden"
//             }`}
//             style={{
//               display: "-webkit-box",
//               WebkitBoxOrient: "vertical",
//               WebkitLineClamp: expanded ? "unset" : "3",
//             }}
//           >
//             {post.content}
//           </p>
//           {isLongText && (
//             <button
//               onClick={() => setExpanded(!expanded)}
//               className="text-[#D72229] text-sm mt-1 mb-2"
//             >
//               {expanded ? "إخفاء" : "المزيد"}
//             </button>
//           )}
//         </div>
//       ) : null}

//       {shouldShowImage && validImage ? (
//         <div
//           className="max-h-[350px] flex items-center justify-center overflow-hidden bg-black/5 cursor-pointer"
//           onClick={() => {
//             setActiveIndex(0);
//             setShowOverlay(true);
//           }}
//         >
//           <img
//             src={firstImage!.image}
//             alt="post image"
//             width={imgW}
//             height={imgH}
//             loading="lazy"
//             className="h-full w-full object-cover"
//           />
//         </div>
//       ) : (
//         ""
//       )}

//       {isQuestion && (
//         <>
//           <div className="flex items-center px-5 gap-4">
//             <p className="text-[#B4B4B9]">{commentCount} اجابه</p>
//             <p className="text-[#B4B4B9]">{likeCount} اعجاب</p>
//           </div>
//           <div className="w-full border-t-2 border-[#D72229] mt-3"></div>
//         </>
//       )}

//       <footer className="flex items-center justify-between p-2">
//         {isQuestion ? (
//           <div className="flex justify-center items-center w-full gap-3">
//             <button
//               onClick={() => {
//                 setShowCommentOverlay(true);
//                 fetchComments();
//               }}
//               className="flex items-center px-[45px] text-center gap-2 bg-[#F2F2F2] text-[#B5B5B5] py-2 rounded-xl cursor-default select-none"
//             >
//               أضف إجابة
//             </button>
//             <div className="bg-[#F2F2F2] p-2 rounded-[12px] flex items-center justify-center">
//               <img src="/icons/like.svg" className="opacity-50" />
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center" 
//             // onClick={() => setShowLikesOverlay(true)}
//             onClick={() => {
//     if (!myUserId || !token) {
//       openLoginModal();
//       return;
//     }
//     setShowLikesOverlay(true);
//   }}
//             >
//               {likerAvatars.length > 0 ? (
//                 <div className="flex items-center">
//                   {likerAvatars.map((src, idx) => (
//                     <div
//                       key={src + idx}
//                       className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
//                       style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
//                     >
//                       <img
//                         src={src}
//                         alt="user like"
//                         className="h-full w-full object-cover"
//                         loading="lazy"
//                       />
//                     </div>
//                   ))}
//                   {likeCount > likerAvatars.length && (
//                     <span className="me-3 text-xs text-black/60">
//                       +{likeCount - likerAvatars.length}
//                     </span>
//                   )}
//                 </div>
//               ) : (
//                 <span className="text-xs text-black/50">لا إعجابات بعد</span>
//               )}
//             </div>
//             <div className="flex items-center justify-center gap-4 text-sm text-black/70" dir="ltr">
//               <button
//                 onClick={handleLike}
//                 className="inline-flex items-center gap-1 cursor-pointer transition"
//                 style={{ color: liked ? "#D72229" : "inherit" }}
//               >
//                 <LikeIcon active={liked} white={false} />
//               </button>
//               <span
//                 onClick={() => {
//                      if (!myUserId || !token) {
//                       openLoginModal();
//                       return; // ← نمنع فتح طبقة التعليقات
//                     }
//                   fetchComments();
//                   setShowCommentOverlay(true);
//                 }}
//                 className="inline-flex items-center gap-1"
//               >
//                 <ReplyIcon />
//                 {commentCount}
//               </span>
//               <span
//                 // onClick={() => setShowShareOverlay(true)}
//                 onClick={() => {
//             if (!myUserId || !token) {
//               openLoginModal();
//               return; // ← يمنع فتح نافذة المشاركة
//             }
//             setShowShareOverlay(true);
//           }}
//                 className="inline-flex items-center gap-1"
//               >
//                 <ShareIcon />
//                 {sharesCount}
//               </span>
//             </div>
//           </>
//         )}
//       </footer>

//       {showMenu && (
//         <div className="absolute z-[9999]" style={{ top: "40px", left: "0px" }}>
//           <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">
//             <button
//               onClick={handleBlock}
//               className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2"
//             >
//               <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
//                 <img
//                   src="/icons/eye.svg"
//                   className="w-5 h-5 invert-0 transform rotate-[160deg]"
//                   style={{ filter: "brightness(0) saturate(100%)" }}
//                 />
//               </div>
//               <span className="text-black">لا اريد مشاهدة هذا</span>
//             </button>
//             <button
//               onClick={handleReport}
//               className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
//             >
//               <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
//                 <img src="/icons/flag.svg" className="w-4 h-4" />
//               </div>
//               <span className="text-black">إبلاغ عن المنشور</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {showOverlay && (
//         <div className="fixed inset-0 z-[99999] bg-[#000000]/90 backdrop-blur-sm flex items-center justify-center flex-col">
//           <div className="mb-[15px] mt-[-15px] flex items-center gap-4">
//             <button
//               className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//               onClick={() => setShowOverlay(false)}
//             >
//               <img src="/icons/close.svg" alt="" />
//             </button>
//             {images.length > 1 && (
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={() =>
//                     setActiveIndex((prev) =>
//                       prev === images.length - 1 ? 0 : prev + 1
//                     )
//                   }
//                   className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//                 >
//                   <img src="/imgs/arrowright.svg" alt="" />
//                 </button>
//                 <button
//                   onClick={() =>
//                     setActiveIndex((prev) =>
//                       prev === 0 ? images.length - 1 : prev - 1
//                     )
//                   }
//                   className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//                 >
//                   <img src="/imgs/arrowleft.svg" alt="" />
//                 </button>
//               </div>
//             )}
//           </div>
//           <div>
//             <img
//               src={images[activeIndex]?.image}
//               className="max-h-[550px] max-w-[700px] rounded-[65px] object-contain"
//             />
//           </div>
//         </div>
//       )}

//       {/* -------------- COMMENT OVERLAY ------------ */}
//       {showCommentOverlay && (
//         <div className="fixed inset-0 z-[9999] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center">
//           <div className="relative w-[90%] max-w-[600px] relative rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
//             <div
//               onClick={() => setShowCommentOverlay(false)}
//               className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//             >
//               <img src="/icons/close.svg" alt="close" />
//             </div>
//             <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">
//               {isQuestion ? "الإجابات" : "تقول ايه"}
//             </h3>
//             <div className="overflow-y-auto space-y-2 scrollbar-hidden">
//               {loadingComments && <Loader />}
//               {!loadingComments && comments.length === 0 && (
//                 <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
//                   {isQuestion ? (
//                     <>
//                       <img src="/icons/answers.svg" className="w-[65px]" alt="" />
//                       <p className="text-2xl">مافيش اجابات لسه</p>
//                       <p className="text-md">ماحدش جاوب لسه… خليك أنت أول واحد يكسر الصمت</p>
//                     </>
//                   ) : (
//                     <>
//                       <img src="/icons/nocomments.svg" className="w-[65px]" alt="" />
//                       <p className="text-2xl">مافيش ردود لسه</p>
//                       <p className="text-md">ماحدش رد لسه خليك أنت أول واحد يكسر الصمت</p>
//                     </>
//                   )}
//                 </div>
//               )}
//               {!loadingComments &&
//                 comments.map((comment, idx) => {
//                   const isCommentLikedByMe =
//                     myUserId &&
//                     Array.isArray(comment.reacts) &&
//                     comment.reacts.includes(myUserId);
//                   const commentReactsCount = comment.reacts?.length || 0;
//                   return (
//                     <div
//                       key={comment._id || idx}
//                       className="flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 h-[107px]"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
//                           <img
//                             src={comment.userimg || "/imgs/user.png"}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="flex-1 text-right">
//                           <div className="flex items-center">
//                             <div className="flex flex-col">
//                               <span className="font-semibold text-[15px] text-white">
//                                 {comment.name || comment.username || "مستخدم"}
//                               </span>
//                               <div className="flex gap-2">
//                                 <span className="text-[12px] text-black/50">
//                                   @{(comment.username || "").replaceAll(" ", "")}
//                                 </span>
//                                 <span className="text-[12px] text-[#D72229]">
//                                   {timeAgoAr(comment.createdAt)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <p className="mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6">
//                             {comment.content}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex cursor-pointer gap-2">
//                         <div
//                           onClick={() => handleCommentLike(comment._id)}
//                           className={`w-[60px] h-[34px] rounded-[15px] ${
//                             isCommentLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"
//                           } flex items-center justify-center gap-2`}
//                         >
//                           {commentReactsCount > 0 && (
//                             <p className="text-white text-sm">{commentReactsCount}</p>
//                           )}
//                           <LikeIcon active={false} white={true} />
//                         </div>
//                         <div
//                           className="w-[50px] h-[34px] rounded-[15px] flex bg-[##B4B4B9]/30 border border-[#fff]/40 items-center justify-center gap-2"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setShowCommentMenu(
//                               showCommentMenu === comment._id ? null : comment._id
//                             );
//                           }}
//                         >
//                           <img src="/imgs/dots.svg" className="filter invert" alt="" />
//                         </div>
//                         {showCommentMenu === comment._id && (
//                           <div
//                             className="absolute bottom-1 left-0 z-[9999] flex gap-2 ml-3"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-2 py-2 text-sm bg-[#000]/30 text-white">
//                               <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                                 <img src="/icons/reply.svg" alt="" />
//                               </div>
//                               <span>رد</span>
//                             </button>
//                             <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white">
//                               <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                                 <img src="/icons/ban.svg" alt="" />
//                               </div>
//                               <span>حجب</span>
//                             </button>
//                             <button
//                               onClick={() => handleReportComment(comment._id)}
//                               className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white"
//                             >
//                               <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                                 <img
//                                   src="/icons/flag.svg"
//                                   style={{
//                                     filter:
//                                       "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
//                                   }}
//                                   alt=""
//                                 />
//                               </div>
//                               <span>بلاغ</span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px]">
//                 <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
//                   <img src={myUserImg || "/imgs/user.png"} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
//                   <input
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     placeholder="اكتب إجابتك هنا"
//                     className="flex-1 bg-transparent outline-none p-3"
//                   />
//                   <button
//                     onClick={submitComment}
//                     className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
//                   >
//                     نشر الإجابة
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* share overlay */}
//       {showShareOverlay && (
//         <div className="fixed inset-0 z-[100000] bg-[#000]/10 backdrop-blur-[10px] flex items-center justify-center">
//           <div className="w-[90%] max-w-[690px] rounded-[25px] backdrop-blur-xl relative bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
//             <div
//               onClick={() => setShowShareOverlay(false)}
//               className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//             >
//               <img src="/icons/close.svg" alt="close" />
//             </div>
//             <h3 className="text-right text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px]">
//               شيرها فضفضة
//             </h3>
//             <div className="p-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D]">
//               <textarea
//                 placeholder="اكتب هذا المحتوى الذي تريد مشاركته"
//                 value={shareText}
//                 onChange={(e) => setShareText(e.target.value)}
//                 className="w-full h-[247px] p-4 rounded-[20px] bg-transparent resize-none outline-none border border-black/10 placeholder:text-sm"
//               />
//             </div>
//             <div className="px-5 pb-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D] rounded-b-[25px]">
//               <div className="text-right mb-3 font-medium">شيرها في رسالة</div>
//               <div className="flex items-center gap-3 overflow-x-auto pb-3">
//                 {/* You may add followers list if available, otherwise skip */}
//                 {/* <p className="text-xs text-black/50">لا يوجد متابعون لعرضهم</p> */}
//                 <div className="flex items-center gap-3 overflow-x-auto pb-3">
//   {followers?.length > 0 ? (
//     followers.map((follower: any, idx: number) => (
//       <div
//         key={follower._id || idx}
//         className="w-[42px] h-[42px] rounded-[18px] overflow-hidden ring-2 ring-white shrink-0"
//         style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
//       >
//         <img
//           src={follower?.followerdata?.img || "/imgs/user.png"}
//           className="w-full h-full object-cover"
//         />
//       </div>
//     ))
//   ) : (
//     <p className="text-xs text-black/50">لا يوجد متابعون لعرضهم</p>
//   )}
// </div>
//               </div>
//               <div className="flex items-center justify-center">
//                 <button
//                   onClick={handleShare}
//                   className={`w-[300px] mx-auto py-4 rounded-[23px] mt-4 text-white transition cursor-pointer ${
//                     sharing || !shareText.trim()
//                       ? "bg-black/40"
//                       : "bg-[#D72229] hover:bg-[#b91c22]"
//                   }`}
//                 >
//                   {sharing ? "جاري الشير..." : "شيرها"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Likes Overlay */}
//       {showLikesOverlay && (
//         <div
//           className="fixed inset-0 z-[100000] bg-black/10 backdrop-blur-[20px] flex items-center justify-center"
//           onClick={() => setShowLikesOverlay(false)}
//         >
//           <div className="w-[90%] max-w-[690px] rounded-[25px] max-h-[660px] flex flex-col overflow-hidden bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
//             <div
//               onClick={() => setShowLikesOverlay(false)}
//               className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//             >
//               <img src="/icons/close.svg" alt="close" />
//             </div>
//             <div className="bg-[#fff]/25 backdrop-blur-md px-4 h-[55px] flex items-center">
//               <span className="font-semibold text-lg">تكات الاعجاب بالفضفضة</span>
//             </div>
//             <div className="px-5 flex items-center justify-between">
//               <p className="text-[13px]">اعجابات بواسطة</p>
//               <p className="text-[13px]">{post.likes.length}</p>
//             </div>
//             <div className="flex-1 overflow-y-auto scrollbar-hidden">
//               {Array.isArray(post.likes) && post.likes.length > 0 ? (
//                 post.likes.map((like: any, idx: number) => (
//                   <div key={idx} className="flex items-center justify-between py-2 px-4">
//                     <div className="flex items-center gap-3">
//                       <Link href={`/profile/${like.userid}`}>
//                         <div className="w-[54px] h-[54px] rounded-[24px] overflow-hidden cursor-pointer">
//                           <img
//                             src={like.userimg || "/imgs/user.png"}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       </Link>
//                       <div className="flex flex-col">
//                         <span className="font-medium">{like.name || "مستخدم"}</span>
//                         <span className="text-sm text-black/50">
//                           @{(like.username || "").replaceAll(" ", "")}
//                         </span>
//                       </div>
//                     </div>
//                     {like.userid === myUserId ? null : (
//                       <FollowButton
//                         followingId={like.userid}
//                         serverFollowerIds={like.followerIds || []}
//                         requestedFollow={like.requestedFollow || false}
//                       />
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-6 text-gray-400">لا يوجد إعجابات</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// }

// function LikeIcon({ active = false, white = true }: { active?: boolean; white?: boolean }) {
//   return (
//     <img
//       src="/icons/like.svg"
//       alt=""
//       style={{
//         filter: active
//           ? "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)"
//           : white
//           ? "brightness(0) invert(1)"
//           : "none",
//       }}
//     />
//   );
// }
// function ReplyIcon() {
//   return <img src="/icons/comment.svg" alt="" />;
// }
// function ShareIcon() {
//   return <img src="/icons/share.svg" alt="" />;
// }
// ////////////////////


/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Post } from "@/types/types";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import FollowButton from "../profile/_components/FollowButton";
import Loader from "@/components/Loader";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTranslation } from "@/contexts/TranslationContext";

// ============================================================
// 1. كائن الترجمات (كامل)
// ============================================================
const translations = {
  ar: {
    // عام
    reels: "الريلز",
    comments: "تقول ايه",
    answers: "الإجابات",
    noAnswers: "مافيش اجابات لسه",
    beFirstAnswer: "ماحدش جاوب لسه… خليك أنت أول واحد يكسر الصمت",
    noComments: "مافيش ردود لسه",
    beFirstComment: "ماحدش رد لسه خليك أنت أول واحد يكسر الصمت",
    addAnswer: "أضف إجابة",
    writeAnswer: "اكتب إجابتك هنا",
    publish: "نشر",
    send: "إرسال",
    more: "المزيد",
    hide: "إخفاء",
    
    // البطاقة المخفية
    hiddenTitle: "تم الاخفاء",
    hiddenDesc1: "بنساعدك إنك تتحكم في المحتوى اللي بيظهر لك",
    hiddenDesc2: "تم إخفاء هذه الفضفضة من موجزك بناءً على تفضيلاتك.",
    undo: "تراجع",
    report: "ابلاغ",
    reportPost: "إبلاغ عن المنشور",
    dontShow: "لا اريد مشاهدة هذا",
    
    // المشاركة (Share)
    sharePost: "شيرها فضفضة",
    sharePlaceholder: "اكتب هذا المحتوى الذي تريد مشاركته",
    shareInMessage: "شيرها في رسالة",
    noFollowers: "لا يوجد متابعون لعرضهم",
    share: "شيرها",
    sharing: "جاري الشير...",
    shareSuccess: "تم إرسال الرسائل إلى {count} متابع",
    shareTextRequired: "يرجى كتابة نص للمشاركة",
    shareFollowerRequired: "يرجى اختيار متابع واحد على الأقل",
    shareError: "حدث خطأ أثناء الإرسال",
    
    // الإعجابات (Likes)
    likesTitle: "تكات الاعجاب بالفضفضة",
    likesBy: "اعجابات بواسطة",
    noLikes: "لا يوجد إعجابات",
    
    // قائمة التعليقات (Comment Menu)
    delete: "حذف",
    unmark: "الغاء التحديد",
    markAnswer: "اختار الاجابة",
    reply: "رد",
    block: "حجب",
    replyTo: "الرد على {name}",
    
    // الوقت
    moment: "منذ لحظات",
    minute: "دقيقة",
    minutes: "دقائق",
    hour: "ساعة",
    hours: "ساعات",
    day: "يوم",
    days: "أيام",
    month: "شهر",
    months: "أشهر",
    ago: "منذ",
    
    // رسائل الـ Toast والأخطاء
    reportSuccess: "تم إرسال البلاغ بنجاح ✅",
    reportError: "حصل خطأ أثناء إرسال البلاغ",
    deleteCommentSuccess: "تم حذف التعليق ✅",
    deleteCommentError: "حدث خطأ أثناء حذف التعليق",
    markSuccess: "تم تحديث حالة الإجابة ✅",
    markError: "حدث خطأ أثناء تحديد الإجابة",
    blockUserSuccess: "تم حجب المستخدم",
    blockUserError: "فشل حجب المستخدم",
    replySent: "تم إرسال الرد",
    loadFollowersError: "فشل في تحميل المتابعين",
    notPostOwner: "أنت لست صاحب هذا المنشور",
    notCommentOwner: "هذا التعليق ليس لك",
    likeError: "حدث خطأ أثناء الإعجاب",
    commentAdded: "تم إضافة التعليق",
    commentError: "حدث خطأ أثناء إرسال التعليق",
    // الاتجاه
    dir: "rtl",
  },
  en: {
    // General
    reels: "Reels",
    comments: "Say What?",
    answers: "Answers",
    noAnswers: "No answers yet",
    beFirstAnswer: "No one has answered yet... Be the first to break the silence",
    noComments: "No comments yet",
    beFirstComment: "No one has replied yet... Be the first to break the silence",
    addAnswer: "Add an answer",
    writeAnswer: "Write your answer here",
    publish: "Publish",
    send: "Send",
    more: "More",
    hide: "Hide",
    
    // Hidden Card
    hiddenTitle: "Hidden",
    hiddenDesc1: "We help you control the content you see",
    hiddenDesc2: "This post has been hidden from your feed based on your preferences.",
    undo: "Undo",
    report: "Report",
    reportPost: "Report post",
    dontShow: "I don't want to see this",
    
    // Share
    sharePost: "Share this post",
    sharePlaceholder: "Write the content you want to share",
    shareInMessage: "Share in a message",
    noFollowers: "No followers to display",
    share: "Share",
    sharing: "Sharing...",
    shareSuccess: "Messages sent to {count} followers",
    shareTextRequired: "Please write a text to share",
    shareFollowerRequired: "Please select at least one follower",
    shareError: "Error while sending",
    
    // Likes
    likesTitle: "Likes",
    likesBy: "Liked by",
    noLikes: "No likes yet",
    
    // Comment Menu
    delete: "Delete",
    unmark: "Unmark",
    markAnswer: "Mark as answer",
    reply: "Reply",
    block: "Block",
    replyTo: "Reply to {name}",
    
    // Time
    moment: "just now",
    minute: "minute",
    minutes: "minutes",
    hour: "hour",
    hours: "hours",
    day: "day",
    days: "days",
    month: "month",
    months: "months",
    ago: "ago",
    
    // Toast & Error Messages
    reportSuccess: "Report sent successfully ✅",
    reportError: "Error while reporting",
    deleteCommentSuccess: "Comment deleted ✅",
    deleteCommentError: "Error deleting comment",
    markSuccess: "Answer status updated ✅",
    markError: "Error while marking answer",
    blockUserSuccess: "User blocked",
    blockUserError: "Failed to block user",
    replySent: "Reply sent",
    loadFollowersError: "Failed to load followers",
    notPostOwner: "You are not the owner of this post",
    notCommentOwner: "This comment is not yours",
    likeError: "An error occurred while liking",
    commentAdded: "Comment added",
    commentError: "Error sending comment",
    dir: "ltr",
  },
};

// ============================================================
// 2. دوال مساعدة (Helper functions)
// ============================================================
function parseDateFlexible(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (!s || s.toLowerCase().includes("invalid")) return null;
  if (/^\d+$/.test(s)) {
    const d = new Date(Number(s));
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(s.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d;
  return null;
}

// ============================================================
// 3. المكون الرئيسي
// ============================================================
export default function PostCard({ post }: { post: Post }) {
  const { openLoginModal } = useLoginModal();
  const { language } = useTranslation();
  const t = translations[language];

  // ------ دوال الوقت المعتمدة على الترجمة (داخل المكون) ------
  const timeAgo = (dateStr?: string) => {
    const d = parseDateFlexible(dateStr);
    if (!d) return t.moment;
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return t.moment;
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    if (mins < 60) return `${mins} ${mins === 1 ? t.minute : t.minutes} ${t.ago}`;
    if (hours < 24) return `${hours} ${hours === 1 ? t.hour : t.hours} ${t.ago}`;
    if (days < 30) return `${days} ${days === 1 ? t.day : t.days} ${t.ago}`;
    return `${months} ${months === 1 ? t.month : t.months} ${t.ago}`;
  };

  // ------ باقي الـ States والـ Hooks ------
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );
  const [expanded, setExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;
  const sharesCount =
    (Array.isArray(post.shares) && post.shares.length) ||
    (typeof post.shareCount === "number" && post.shareCount) ||
    0;
  const userName = post?.name || "مستخدم";
  const userHandle = (post?.username || "").toString().replaceAll(" ", "");
  const firstImage =
    Array.isArray(post.image) && post.image.length > 0 ? post.image[0] : null;
  const imgW = firstImage?.width ? Number(firstImage.width) : 1080;
  const imgH = firstImage?.height ? Number(firstImage.height) : 1350;
  const isQuestion = post.type === "question";
  const shouldShowImage = !!firstImage?.image;
  const validImage =
    firstImage?.image &&
    (firstImage.image.startsWith("http") || firstImage.image.startsWith("/"));
  const likerAvatars: string[] = Array.isArray(post.likes)
    ? Array.from(
        new Set(
          post.likes
            .map((l: any) => (typeof l?.userimg === "string" ? l.userimg : ""))
            .filter(Boolean)
        )
      ).slice(0, 5)
    : [];
  const cardClass = isQuestion
    ? "rounded-[26px] min-w-[300px] bg-gradient-to-b from-[#EAE8E8] to-[#fff] border border-[#D72229] bg-white"
    : "rounded-[26px] min-w-[300px] text-right bg-gradient-to-b from-[#EAE8E8] to-[#fff]";
  const textInnerBorder =
    post.type === "question" ? " shadow-[inset_0_0_0_1px_#D72229]" : "";
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = Array.isArray(post.image) ? post.image : [];
  const user = JSON.parse(localStorage.getItem("userData") || "null");
  const myUserId = user?._id;
  const isPostOwner = post?.userid === myUserId;
  const myUserImg =
    typeof window !== "undefined"
      ? localStorage.getItem("userimg")
      : "/imgs/user.png";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // --- Read hidden state from localStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined" && post._id) {
      const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
      if (Array.isArray(hidden) && hidden.includes(post._id)) {
        setIsHidden(true);
      }
    }
  }, [post._id]);

  // ------ دوال التفاعل (Like, Block, Report, Comment, Share) ------
  const handleLike = async () => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    setLiked((prev) => {
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });

    try {
      const res = await fetch(`https://bo-chat.space/posts/${post._id}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: myUserId }),
      });
      if (!res.ok) throw new Error("Like failed");
    } catch (err) {
      console.error("LIKE ERROR:", err);
      toast.error(t.likeError);
      setLiked((prev) => {
        setLikeCount((count) => (prev ? count - 1 : count + 1));
        return !prev;
      });
    }
  };

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const computed = window.getComputedStyle(el);
      const lineHeight = parseFloat(computed.lineHeight);
      const height = el.scrollHeight;
      const visibleHeight = lineHeight * 3;
      setIsLongText(height > visibleHeight + 2);
    }
  }, [post.content]);

  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const [shareText, setShareText] = useState("");
  const [sharing, setSharing] = useState(false);

  const isLikedByMe =
    myUserId &&
    Array.isArray(post.likes) &&
    post.likes.some((like: any) => like.userid === myUserId);

  useEffect(() => {
    setLiked(!!isLikedByMe);
  }, [isLikedByMe]);

  // BLOCK
  const handleBlock = () => {
    if (!myUserId || !token) {
      openLoginModal();
      setShowMenu(false);
      return;
    }
    if (typeof window !== "undefined" && post._id) {
      const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
      if (!hidden.includes(post._id)) {
        hidden.push(post._id);
        localStorage.setItem("hiddenPosts", JSON.stringify(hidden));
      }
    }
    setIsHidden(true);
    setShowMenu(false);
  };

  // REPORT
  const handleReport = async () => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch(`https://bo-chat.space/report${myUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postid: post._id,
          email: "",
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || t.reportError);
      toast.success(t.reportSuccess);
      setShowMenu(false);
    } catch (err) {
      console.error("REPORT ERROR:", err);
      toast.error(t.reportError);
    }
  };

  // COMMENTS
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  const [markingCommentId, setMarkingCommentId] = useState<string | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchComments = async () => {
    if (!myUserId || !token) {
      openLoginModal();
      return;
    }
    try {
      setLoadingComments(true);
      const res = await fetch(
        `https://bo-chat.space/getcomments/${myUserId}?postid=${post._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("COMMENTS ERROR:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!myUserId || !token) {
      openLoginModal();
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`https://bo-chat.space/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: myUserId, comment: commentText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send comment");
      setCommentText("");
      fetchComments();
      toast.success(t.commentAdded);
    } catch (err) {
      console.error("SEND COMMENT ERROR:", err);
      toast.error(t.commentError);
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch(`https://bo-chat.space/report/comment${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userid: myUserId,
          reporttype: "comment",
          reportdescription: "محتوى غير لائق",
        }),
      });
      const data = await res.text();
      if (!res.ok) throw new Error(data || t.reportError);
      toast.success(t.reportSuccess);
      setShowCommentMenu(null);
    } catch (err) {
      console.error("REPORT COMMENT ERROR:", err);
      toast.error(t.reportError);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id !== commentId) return comment;
        const alreadyLiked =
          Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
        return {
          ...comment,
          reacts: alreadyLiked
            ? comment.reacts.filter((id: string) => id !== myUserId)
            : [...(comment.reacts || []), myUserId],
        };
      })
    );
    try {
      const res = await fetch("https://bo-chat.space/comment/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: myUserId, commentid: commentId }),
      });
      if (!res.ok) throw new Error("Failed to react on comment");
    } catch (err) {
      console.error("COMMENT LIKE ERROR:", err);
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch(`https://bo-chat.space/delComment${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: myUserId }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || t.deleteCommentError);
      }
      toast.success(t.deleteCommentSuccess);
      setShowCommentMenu(null);
      fetchComments();
    } catch (err) {
      console.error("DELETE COMMENT ERROR:", err);
      toast.error(t.deleteCommentError);
    }
  };

  const handleMarkComment = async (commentId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    setMarkingCommentId(commentId);
    try {
      const res = await fetch(`https://bo-chat.space/comment/mark${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: myUserId }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || t.markError);
      }
      toast.success(t.markSuccess);
      fetchComments();
    } catch (err) {
      console.error("MARK COMMENT ERROR:", err);
      toast.error(t.markError);
    } finally {
      setMarkingCommentId(null);
    }
  };

  const handleBlockUser = async (blockedUserId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    try {
      const response = await fetch(
        `https://bo-chat.space/block${myUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ blockedid: blockedUserId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t.blockUserError);
      }
      toast.success(t.blockUserSuccess);
      setShowCommentMenu(null);
    } catch (error) {
      console.error(error);
      toast.error(t.blockUserError);
    }
  };

  const submitReply = async (commentId: string) => {
    if (!token || !myUserId) {
      openLoginModal();
      return;
    }
    if (!replyText.trim()) return;

    try {
      const res = await fetch(
        `https://bo-chat.space/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userid: myUserId,
            comment: replyText.trim(),
            replyTo: commentId,
          }),
        }
      );
      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }
      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Request failed (${res.status})`
        );
      }
      toast.success(t.replySent);
      await fetchComments();
      setReplyText("");
      setReplyToCommentId(null);
    } catch (err: any) {
      console.error("❌ SUBMIT REPLY ERROR:", err);
      toast.error(err.message || t.replySent);
    }
  };

  // ----------------------- SHARE OVERLAY -----------------------
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  const fetchFollowersFromAPI = async () => {
    if (!myUserId || !token) {
      console.warn("⚠️ No userId or token");
      return;
    }
    setLoadingFollowers(true);
    try {
      const res = await fetch(`https://bo-chat.space/users/${myUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const followersData = data?.followers || [];
      const mapped = followersData.map((f: any) => {
        const follower = f.followerdata || {};
        return {
          _id: f.followerid || follower._id || f._id,
          name: follower.name || "مستخدم",
          username: follower.username || "",
          img: follower.img || "/imgs/user.png",
        };
      });
      setFollowers(mapped);
    } catch (err) {
      console.error("❌ Error fetching followers:", err);
      toast.error(t.loadFollowersError);
    } finally {
      setLoadingFollowers(false);
    }
  };

  useEffect(() => {
    if (showShareOverlay) {
      setSelectedFollowers([]);
      fetchFollowersFromAPI();
    }
  }, [showShareOverlay]);

  const toggleFollowerSelection = (followerId: string) => {
    setSelectedFollowers((prev) =>
      prev.includes(followerId)
        ? prev.filter((id) => id !== followerId)
        : [...prev, followerId]
    );
  };

  const sendMessageToUser = async (receiverId: string, content: string) => {
    const res = await fetch(`https://bo-chat.space/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senderId: myUserId,
        receiverId,
        content,
        postId: post._id,
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  };

  const handleShare = async () => {
    if (!shareText.trim()) {
      toast.error(t.shareTextRequired);
      return;
    }
    if (selectedFollowers.length === 0) {
      toast.error(t.shareFollowerRequired);
      return;
    }
    setSharing(true);
    try {
      await Promise.all(
        selectedFollowers.map((followerId) =>
          sendMessageToUser(followerId, shareText)
        )
      );
      toast.success(t.shareSuccess.replace('{count}', String(selectedFollowers.length)));
      setShareText("");
      setSelectedFollowers([]);
      setShowShareOverlay(false);
    } catch (err) {
      console.error("❌ Share error:", err);
      toast.error(t.shareError);
    } finally {
      setSharing(false);
    }
  };

  // LIKES OVERLAY
  const [showLikesOverlay, setShowLikesOverlay] = useState(false);

  // ============================================================
  // 4. RENDER
  // ============================================================
  if (isHidden) {
    return (
      <article dir={t.dir} className={`${cardClass} relative`}>
        <div className="p-6 flex flex-col items-start gap-3 min-h-[220px]">
          <div className="flex items-center gap-2 mb-1">
            <img
              src="/icons/Group 8735.svg"
              alt={t.hiddenTitle}
              className="w-[16.36px] h-[15px]"
            />
            <p className="text-[#D72229] text-[14px] font-semibold font-cairo leading-[100%]">
              {t.hiddenTitle}
            </p>
          </div>
          <p
            className="text-black text-[14px] font-semibold font-cairo leading-[1.8] text-center max-w-[314px] self-center"
            style={{ verticalAlign: "middle" }}
          >
            {t.hiddenDesc1}
            <br />
            {t.hiddenDesc2}
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && post._id) {
                  const hidden = JSON.parse(localStorage.getItem("hiddenPosts") || "[]");
                  const updated = hidden.filter((id: string) => id !== post._id);
                  localStorage.setItem("hiddenPosts", JSON.stringify(updated));
                }
                setIsHidden(false);
              }}
              className="w-[125px] h-[50px] rounded-[20px] bg-[#D72229] text-white font-semibold font-cairo text-[17px] leading-[100%] hover:bg-[#b91c22] transition shadow-sm flex items-center justify-center"
            >
              {t.undo}
            </button>
            <button
              onClick={handleReport}
              className="w-[182px] h-[50px] rounded-[20px] bg-white text-[#D72229] font-semibold font-cairo text-[17px] leading-[100%] border border-gray-200 hover:bg-gray-50 transition shadow-sm flex items-center justify-center"
            >
              {t.report}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // --- Normal rendering ---
  return (
    <article dir={t.dir} className={`${cardClass + textInnerBorder} relative`}>
      {/* الهيدر */}
      <header className="p-5 flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <div
            className="relative h-[50px] w-[50px] shrink-0 rounded-[21px] cursor-pointer"
            onClick={() => {
              if (!myUserId || !token) {
                openLoginModal();
                return;
              }
              window.location.href = `/profile/${post.userid}`;
            }}
          >
            <img
              src={post.userimg || "/imgs/user.png"}
              alt={userName}
              sizes="50px"
              className="object-cover rounded-[21px]"
            />
            {post.vip && (
              <div className="absolute bottom-[-8px] right-1/2 transform translate-x-1/2 w-5 h-5">
                <img src="/icons/vip.svg" alt="" />
              </div>
            )}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              if (!myUserId || !token) {
                openLoginModal();
                return;
              }
              window.location.href = `/profile/${post.userid}`;
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{userName}</span>
              <span className="text-sm text-black/50">@{userHandle}</span>
            </div>
          </div>
        </div>
        <div className="flex relative items-center justify-center gap-2">
          <div className="text-xs text-[#D72229]">
            {timeAgo(post.createdAt || new Date().toISOString())}
          </div>
          <div
            ref={dotsRef}
            onClick={() => {
              if (dotsRef.current) {
                const rect = dotsRef.current.getBoundingClientRect();
                setMenuPos({
                  top: rect.bottom + 8,
                  left: window.innerWidth - rect.right,
                });
              }
              setShowMenu((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            <img src="/imgs/dots.svg" className="mr-1" alt="menu" />
          </div>
        </div>
      </header>

      {/* المحتوى */}
      {post.content ? (
        <div className="px-4">
          <p
            ref={textRef}
            className={`leading-7 text-black/90 whitespace-pre-wrap break-words transition-all duration-300 ${
              expanded ? "" : "line-clamp-3 overflow-hidden"
            }`}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: expanded ? "unset" : "3",
            }}
          >
            {post.content}
          </p>
          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#D72229] text-sm mt-1 mb-2"
            >
              {expanded ? t.hide : t.more}
            </button>
          )}
        </div>
      ) : null}

      {/* الصور */}
      {shouldShowImage && validImage ? (
        <div
          className="max-h-[350px] flex items-center justify-center overflow-hidden bg-black/5 cursor-pointer"
          onClick={() => {
            setActiveIndex(0);
            setShowOverlay(true);
          }}
        >
          <img
            src={firstImage!.image}
            alt="post image"
            width={imgW}
            height={imgH}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        ""
      )}

      {/* لو السؤال */}
      {isQuestion && (
        <>
          <div className="flex items-center px-5 gap-4">
            <p className="text-[#B4B4B9]">{commentCount} {t.answers}</p>
            <p className="text-[#B4B4B9]">{likeCount} {t.likesBy}</p>
          </div>
          <div className="w-full border-t-2 border-[#D72229] mt-3"></div>
        </>
      )}

      {/* الفوتر */}
      <footer className="flex items-center justify-between p-2">
        {isQuestion ? (
          <div className="flex justify-center items-center w-full gap-3">
            <button
              onClick={() => {
                setShowCommentOverlay(true);
                fetchComments();
              }}
              className="flex items-center px-[45px] text-center gap-2 bg-[#F2F2F2] text-[#B5B5B5] py-2 rounded-xl cursor-default select-none"
            >
              {t.addAnswer}
            </button>
            <div className="bg-[#F2F2F2] p-2 rounded-[12px] flex items-center justify-center">
              <img src="/icons/like.svg" className="opacity-50" />
            </div>
          </div>
        ) : (
          <>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                if (!myUserId || !token) {
                  openLoginModal();
                  return;
                }
                setShowLikesOverlay(true);
              }}
            >
              {likerAvatars.length > 0 ? (
                <div className="flex items-center">
                  {likerAvatars.map((src, idx) => (
                    <div
                      key={src + idx}
                      className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
                      style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
                    >
                      <img
                        src={src}
                        alt="user like"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  {likeCount > likerAvatars.length && (
                    <span className="me-3 text-xs text-black/60">
                      +{likeCount - likerAvatars.length}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-black/50">{t.noLikes}</span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-black/70" dir="ltr">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-1 cursor-pointer transition"
                style={{ color: liked ? "#D72229" : "inherit" }}
              >
                <LikeIcon active={liked} white={false} />
              </button>
              <span
                onClick={() => {
                  if (!myUserId || !token) {
                    openLoginModal();
                    return;
                  }
                  fetchComments();
                  setShowCommentOverlay(true);
                }}
                className="inline-flex items-center gap-1 cursor-pointer"
              >
                <ReplyIcon />
                {commentCount}
              </span>
              <span
                onClick={() => {
                  if (!myUserId || !token) {
                    openLoginModal();
                    return;
                  }
                  setShowShareOverlay(true);
                }}
                className="inline-flex items-center gap-1 cursor-pointer"
              >
                <ShareIcon />
                {sharesCount}
              </span>
            </div>
          </>
        )}
      </footer>

      {/* القائمة المنسدلة (dots) */}
      {showMenu && (
        <div className="absolute z-[9999]" style={{ top: "40px", left: "0px" }}>
          <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">
            <button
              onClick={handleBlock}
              className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2"
            >
              <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
                <img
                  src="/icons/eye.svg"
                  className="w-5 h-5 invert-0 transform rotate-[160deg]"
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </div>
              <span className="text-black">{t.dontShow}</span>
            </button>
            <button
              onClick={handleReport}
              className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
            >
              <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
                <img src="/icons/flag.svg" className="w-4 h-4" />
              </div>
              <span className="text-black">{t.reportPost}</span>
            </button>
          </div>
        </div>
      )}

      {/* أوفرلاي الصور */}
      {showOverlay && (
        <div className="fixed inset-0 z-[99999] bg-[#000000]/90 backdrop-blur-sm flex items-center justify-center flex-col">
          <div className="mb-[15px] mt-[-15px] flex items-center gap-4">
            <button
              className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
              onClick={() => setShowOverlay(false)}
            >
              <img src="/icons/close.svg" alt="" />
            </button>
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
                >
                  <img src="/imgs/arrowright.svg" alt="" />
                </button>
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
                >
                  <img src="/imgs/arrowleft.svg" alt="" />
                </button>
              </div>
            )}
          </div>
          <div>
            <img
              src={images[activeIndex]?.image}
              className="max-h-[550px] max-w-[700px] rounded-[65px] object-contain"
            />
          </div>
        </div>
      )}

      {/* أوفرلاي التعليقات */}
      {showCommentOverlay && (
        <div className="fixed inset-0 z-[9999] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center">
          <div className="relative w-[90%] max-w-[600px] rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
            <div
              onClick={() => setShowCommentOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
            {/* <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">
              {isQuestion ? t.answers : t.comments}
            </h3> */}
            <h3 className={`text-lg font-semibold p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px] ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {isQuestion ? t.answers : t.comments}
            </h3>
            <div className="overflow-y-auto space-y-2 scrollbar-hidden">
              {loadingComments && <Loader />}
              {!loadingComments && comments.length === 0 && (
                <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
                  {isQuestion ? (
                    <>
                      <img src="/icons/answers.svg" className="w-[65px]" alt="" />
                      <p className="text-2xl">{t.noAnswers}</p>
                      <p className="text-md">{t.beFirstAnswer}</p>
                    </>
                  ) : (
                    <>
                      <img src="/icons/nocomments.svg" className="w-[65px]" alt="" />
                      <p className="text-2xl">{t.noComments}</p>
                      <p className="text-md">{t.beFirstComment}</p>
                    </>
                  )}
                </div>
              )}
              {!loadingComments &&
                comments.map((comment, idx) => {
                  const isCommentLikedByMe =
                    myUserId &&
                    Array.isArray(comment.reacts) &&
                    comment.reacts.includes(myUserId);
                  const commentReactsCount = comment.reacts?.length || 0;
                  const isMarked = comment.isMarked || comment.selected || comment.accepted || false;
                  const isPostOwnerFlag = post?.userid === myUserId;
                  const isCommentOwner = comment.userid === myUserId;

                  return (
                    <div key={comment._id || idx} className="mb-3">
                      <div
                        className={`flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 rounded-xl transition-all ${
                          isMarked ? "border-2 border-transparent" : ""
                        }`}
                        style={
                          isMarked
                            ? {
                                borderImage:
                                  "linear-gradient(271.09deg, #D72229 2.17%, rgba(215, 34, 41, 0) 54.32%) 1",
                                borderImageSlice: 1,
                                borderWidth: "2px",
                                borderStyle: "solid",
                                borderRadius: "12px",
                              }
                            : {}
                        }
                      >
                        <div className="flex items-start justify-between gap-3 flex-1">
                          <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
                            <img
                              src={comment.userimg || "/imgs/user.png"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-center">
                              <div className="flex flex-col">
                                {/* <span className="font-semibold text-[15px] text-white"> */}
                                <span className={`font-semibold text-[15px] text-white ${
                                  language === 'en' ? 'text-left' : 'text-right'
                                }`}>
                                  {comment.name || comment.username || "مستخدم"}
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                  <span className="text-[12px] text-black/50">
                                    @{(comment.username || "").replaceAll(" ", "")}
                                  </span>
                                  <span className="text-[12px] text-[#D72229]">
                                    {timeAgo(comment.createdAt)}
                                  </span>
                                  {isMarked && (
                                    <span className="text-[12px] font-bold text-[#D72229] bg-[#D72229]/10 px-2 py-0.5 rounded-full">
                                      ✓ الإجابة المختارة
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
 
                            <p className={`mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6 ${
                              language === 'en' ? 'text-left' : 'text-right'
                            }`}>
                              {comment.content}
                            </p>
                          </div>
                        </div>

                        <div className="flex cursor-pointer gap-2">
                          <div
                            onClick={() => handleCommentLike(comment._id)}
                            className={`w-[60px] h-[34px] rounded-[15px] ${
                              isCommentLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"
                            } flex items-center justify-center gap-2`}
                          >
                            {commentReactsCount > 0 && (
                              <p className="text-white text-sm">{commentReactsCount}</p>
                            )}
                            <LikeIcon active={false} white={true} />
                          </div>
                          <div
                            className="w-[50px] h-[34px] rounded-[15px] flex bg-[#B4B4B9]/30 border border-[#fff]/40 
                            items-center justify-center gap-2 cursor-pointer relative"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCommentMenu(
                                showCommentMenu === comment._id ? null : comment._id
                              );
                            }}
                          >
                            <img src="/imgs/dots.svg" className="filter invert" alt="" />
                          </div>
                        </div>

                        {showCommentMenu === comment._id && (
                          <div
                            className="absolute bottom-3 left-0 flex flex-wrap gap-1 ml-3 p-2 z-50 translate-y-[20px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                   <button
  onClick={() => {
    if (!isPostOwnerFlag) {
      toast.error(t.notPostOwner);
      return;
    }
    handleMarkComment(comment._id);
  }}
  disabled={markingCommentId === comment._id}
  className={`w-[140px] h-[55px] flex items-center justify-center gap-1.5 rounded-[18px] px-3 py-2 text-sm text-white ${
    isMarked ? "bg-black" : "bg-[#0000004D]"
  } backdrop-blur-[6px] ${!isPostOwnerFlag ? "opacity-100 cursor-not-allowed" : ""}`}
>
  <div className={`${language === 'en' ? 'w-[30px] h-[30px]' : 'w-[38px] h-[38px]'} bg-white rounded-full flex items-center justify-center`}>
    {markingCommentId === comment._id ? (
      <Loader />
    ) : (
      <img
        src="/icons/Vector (15).svg"
        alt={isMarked ? t.unmark : t.markAnswer}
        className={language === 'en' ? 'w-4 h-4' : 'w-5 h-5'}
      />
    )}
  </div>
  <span className={language === 'en' ? 'text-xs' : 'text-sm'}>
    {isMarked ? t.unmark : t.markAnswer}
  </span>
</button>
                       
                            <button
  onClick={() => {
    if (!isCommentOwner) {
      toast.error(t.notCommentOwner);
      return;
    }
    handleDeleteComment(comment._id);
  }}
  className={`${
    language === 'en' ? 'w-[85px]' : 'w-[99px]'
  } h-[55px] flex items-center justify-center gap-1 rounded-[18px] px-3 py-2 text-sm text-white bg-[#0000004D] backdrop-blur-[10px] ${
    !isCommentOwner ? "opacity-100 cursor-not-allowed" : ""
  }`}
>
  <div className={`${
    language === 'en' ? 'w-[30px] h-[30px]' : 'w-[38px] h-[38px]'
  } bg-white rounded-full flex items-center justify-center shrink-0`}>
    <img src="/icons/Vector (14).svg" alt={t.delete} className={`${
      language === 'en' ? 'w-4 h-4' : 'w-5 h-5'
    }`} />
  </div>
  <span className={language === 'en' ? 'text-xs' : 'text-sm'}>
    {t.delete}
  </span>
</button>

                          
                            <button
  onClick={() => {
    setReplyToCommentId(comment._id);
    setReplyText("");
    setShowCommentMenu(null);
  }}
  className={`${
    language === 'en' ? 'w-[80px]' : 'w-[80px]'
  } h-[55px] flex items-center justify-center gap-1 rounded-[18px] px-3 py-2 text-sm text-white bg-[#0000004D] backdrop-blur-[6px]`}
>
  <div className={`${
    language === 'en' ? 'w-[39px] h-[30px]' : 'w-[38px] h-[38px]'
  } bg-white rounded-full flex items-center justify-center`}>
    <img src="/icons/reply.svg" alt={t.reply} className={`${
      language === 'en' ? 'w-4 h-4' : 'w-5 h-5'
    }`} />
  </div>
  <span className={language === 'en' ? 'text-xs' : 'text-sm'}>
    {t.reply}
  </span>
</button>

                        <button
              onClick={() => handleReportComment(comment._id)}
                className="w-[90px] h-[55px] flex items-center justify-center gap-1.5 rounded-[18px] px-3 py-2 text-sm text-white bg-[#D722294D] backdrop-blur-[5px]"
                            >
               <div className={`${
            language === 'en' ? 'w-[39px] h-[30px]' : 'w-[38px] h-[38px]'
          } bg-white rounded-full flex items-center justify-center`}>
                <img
                  src="/icons/flag.svg"
                  style={{
                    filter: "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
                  }}
                  alt={t.report}
                  className={language === 'en' ? 'w-4 h-4' : 'w-5 h-5'}
                />
              </div>
              <span className={language === 'en' ? 'text-xs' : 'text-sm'}>
                {t.report}
              </span>
            </button>

                            <button
                              onClick={() => handleBlockUser(comment.userid)}
                              className="w-[90px] h-[55px] flex items-center justify-center gap-1.5 rounded-[18px] px-3 py-2 text-sm text-white bg-[#D722294D] backdrop-blur-[5px]"
                            >
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                                <img src="/icons/ban.svg" alt={t.block} className="w-5 h-5" />
                              </div>
                              <span>{t.block}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {replyToCommentId === comment._id && (
                        <div className="mr-12 mt-2 flex items-center gap-3 bg-[#fff]/30 backdrop-blur-sm p-2 rounded-[20px]">
                          <div className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0">
                            <img
                              src={myUserImg || "/imgs/user.png"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-[#000]/10 backdrop-blur-sm w-full flex rounded-[16px]">
                            <input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={t.replyTo.replace('{name}', comment.name)}
                              className="flex-1 bg-transparent outline-none p-2 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitReply(comment._id);
                              }}
                            />
                            <button
                              onClick={() => submitReply(comment._id)}
                              className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
                            >
                              {t.send}
                            </button>
                          </div>
                        </div>
                      )}

                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mr-10 mt-2 space-y-2">
                          {comment.replies.map((reply: any) => {
                            const isReplyLikedByMe =
                              myUserId &&
                              Array.isArray(reply.reacts) &&
                              reply.reacts.includes(myUserId);
                            const replyReactsCount = reply.reacts?.length || 0;
                            return (
                              <div
                                key={reply._id}
                                className="flex items-start justify-between p-2 bg-[#000]/05 rounded-xl"
                              >
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="w-[40px] h-[40px] shrink-0 rounded-full overflow-hidden">
                                    <img
                                      src={reply.userimg || "/imgs/user.png"}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 text-right">
                                    <div className="flex items-center">
                                      <span className="font-semibold text-sm">
                                        {reply.name || reply.username || "مستخدم"}
                                      </span>
                                      <span className="text-[10px] text-black/50 mr-2">
                                        @{(reply.username || "").replaceAll(" ", "")}
                                      </span>
                                      <span className="text-[10px] text-[#D72229] mr-2">
                                        {timeAgo(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-black/80 leading-6">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div
                                    onClick={() => handleCommentLike(reply._id)}
                                    className={`w-[40px] h-[28px] rounded-[12px] ${
                                      isReplyLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"
                                    } flex items-center justify-center gap-1 cursor-pointer`}
                                  >
                                    {replyReactsCount > 0 && (
                                      <span className="text-white text-xs">{replyReactsCount}</span>
                                    )}
                                    <LikeIcon active={false} white={true} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px]">
                <div className="w-[50px] h-[50px] rounded-[21px] overflow-hidden shrink-0">
                  <img src={myUserImg || "/imgs/user.png"} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.writeAnswer}
                    className="flex-1 bg-transparent outline-none p-3"
                  />
                  <button
                    onClick={submitComment}
                    className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
                  >
                    {t.publish}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أوفرلاي المشاركة */}
      {showShareOverlay && (
        <div className="fixed inset-0 z-[100000] bg-[#000]/10 backdrop-blur-[10px] flex items-center justify-center">
          <div className="w-[90%] max-w-[690px] rounded-[25px] backdrop-blur-xl relative bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
            <div
              onClick={() => setShowShareOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
             
            <h3 className={`text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px] ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}>
              {t.sharePost}
            </h3>
            <div className="p-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D]">
              <textarea
                placeholder={t.sharePlaceholder}
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="w-full h-[247px] p-4 rounded-[20px] bg-transparent resize-none outline-none border border-black/10 placeholder:text-sm"
              />
            </div>
            <div className="px-5 pb-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D] rounded-b-[25px]">
              <div className="text-right mb-3 font-medium flex items-center justify-between">
                <span>{t.shareInMessage}</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-3">
                {loadingFollowers ? (
                  <div className="flex items-center justify-center w-full py-4">
                    <Loader />
                  </div>
                ) : followers.length === 0 ? (
                  <p className="text-xs text-black/50 w-full text-center">
                    {t.noFollowers}
                  </p>
                ) : (
                  followers.map((follower) => {
                    const isSelected = selectedFollowers.includes(follower._id);
                    return (
                      <div
                        key={follower._id}
                        onClick={() => toggleFollowerSelection(follower._id)}
                        className={`flex flex-col items-center gap-1 min-w-[80px] cursor-pointer transition ${
                          isSelected ?  "ring-[#D72229]" : "ring-white"
                        }`}
                      >
                        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-white">
                          <img
                            src={follower.img || "/imgs/user.png"}
                            alt={follower.name}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#D72229]/40 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs truncate max-w-[70px]">
                          {follower.name}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleShare}
                  className={`w-[300px] mx-auto py-4 rounded-[23px] mt-4 text-white transition ${
                    sharing || !shareText.trim()
                      ? "bg-black/40 cursor-not-allowed"
                      : selectedFollowers.length === 0
                      ? "bg-[#D72229] cursor-not-allowed"
                      : "bg-[#D72229] hover:bg-[#b91c22] cursor-pointer"
                  }`}
                  disabled={sharing || !shareText.trim() || selectedFollowers.length === 0}
                >
                  {sharing ? t.sharing : t.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أوفرلاي الإعجابات */}
      {showLikesOverlay && (
        <div
          className="fixed inset-0 z-[100000] bg-black/10 backdrop-blur-[20px] flex items-center justify-center"
          onClick={() => setShowLikesOverlay(false)}
        >
          <div className="w-[90%] max-w-[690px] rounded-[25px] max-h-[660px] flex flex-col overflow-hidden bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
            <div
              onClick={() => setShowLikesOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
            <div className="bg-[#fff]/25 backdrop-blur-md px-4 h-[55px] flex items-center">
              <span className="font-semibold text-lg">{t.likesTitle}</span>
            </div>
            <div className="px-5 flex items-center justify-between">
              <p className="text-[13px]">{t.likesBy}</p>
              <p className="text-[13px]">{post.likes.length}</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hidden">
              {Array.isArray(post.likes) && post.likes.length > 0 ? (
                post.likes.map((like: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${like.userid}`}>
                        <div className="w-[54px] h-[54px] rounded-[24px] overflow-hidden cursor-pointer">
                          <img
                            src={like.userimg || "/imgs/user.png"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col">
                        <span className="font-medium">{like.name || "مستخدم"}</span>
                        <span className="text-sm text-black/50">
                          @{(like.username || "").replaceAll(" ", "")}
                        </span>
                      </div>
                    </div>
                    {like.userid === myUserId ? null : (
                      <FollowButton
                        followingId={like.userid}
                        serverFollowerIds={like.followerIds || []}
                        requestedFollow={like.requestedFollow || false}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-gray-400">{t.noLikes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================
// 5. مكونات الأيقونات (Icon components)
// ============================================================
function LikeIcon({ active = false, white = true }: { active?: boolean; white?: boolean }) {
  return (
    <img
      src="/icons/like.svg"
      alt=""
      style={{
        filter: active
          ? "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)"
          : white
          ? "brightness(0) invert(1)"
          : "none",
      }}
    />
  );
}
function ReplyIcon() {
  return <img src="/icons/comment.svg" alt="" />;
}
function ShareIcon() {
  return <img src="/icons/share.svg" alt="" />;
}