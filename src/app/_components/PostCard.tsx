// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { Post } from "@/types/types";
// // import Image from "next/image";
// import Link from "next/link";
// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import FollowButton from "../profile/_components/FollowButton";
// import Loader from "@/components/Loader";


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
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(
//     Array.isArray(post.likes) ? post.likes.length : 0
//   );
   
//   const [expanded, setExpanded] = useState(false);
//   const [isLongText, setIsLongText] = useState(false);
//   const textRef = useRef<HTMLParagraphElement>(null);
//   const [error, setError] = useState<string | null>(null);

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
//   ? "rounded-[26px] min-w-[300px] bg-gradient-to-b from-[#EAE8E8] to-[#fff] border border-[#D72229] bg-white"
//   : "rounded-[26px] min-w-[300px] text-right bg-gradient-to-b from-[#EAE8E8] to-[#fff]";

//   const textInnerBorder =
//     post.type === "question"
//       ? " shadow-[inset_0_0_0_1px_#D72229]"
//       : "";
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const images = Array.isArray(post.image) ? post.image : [];
      
//   const handleLike = async () => {
//     const token = localStorage.getItem("boChatToken");
//     const myUserId = localStorage.getItem("userid");

//     if (!token || !myUserId) return;

//     // 🔹 Optimistic Update
//     setLiked((prev) => {
//       setLikeCount((count) => (prev ? count - 1 : count + 1));
//       return !prev;
//     });

//     try {
//       const res = await fetch(
//         `http://bo-chat.space/posts/${post._id}/reactions`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             userid: myUserId,
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Like failed");
//       }

//       // ✅ مفيش setState هنا — optimistic already applied
//     } catch (err) {
//       console.error("LIKE ERROR:", err);

//       // 🔁 Rollback لو الـ API فشل
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

//   const myUserId =
//     typeof window !== "undefined"
//       ? localStorage.getItem("userid")
//       : null;

//   const isLikedByMe =
//     myUserId &&
//     Array.isArray(post.likes) &&
//     post.likes.some((like: any) => like.userid === myUserId);

//   useEffect(() => {
//     setLiked(!!isLikedByMe);
//   }, []);
//   // ---------------------------   REPORT POST   -----------------------------------------
//   const handleReport = async () => {
//     try {
//       const token = localStorage.getItem("boChatToken");

//       const res = await fetch(
//         `http://bo-chat.space/report${userid}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             postid: post._id,
//             email: userData?.email || "",
//           }),
//         }
//       );

//       const text = await res.text(); // 👈 مهم

//       if (!res.ok) {
//         throw new Error(text || "فشل إرسال البلاغ");
//       }

//       toast.success(" تم إرسال البلاغ بنجاح");
//         setShowMenu(false);
//       } catch (err) {
//         console.error("REPORT ERROR:", err);
//         toast.error(" حصل خطأ أثناء إرسال البلاغ");
//       }
//   };


//   // ---------------------------   COMMENTS   -----------------------------------------
//   const handleReportComment = async (commentId: string) => {
//     try {
//       const token = localStorage.getItem("boChatToken");
//       const userid = localStorage.getItem("userid");

//       if (!token || !userid) {
//         window.location.href = "/login";
//         return;
//       }

//       const res = await fetch(
//         `http://bo-chat.space/report/comment${commentId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             userid,
//             reporttype: "comment",
//             reportdescription: "محتوى غير لائق", // ← غيرها براحتك
//           }),
//         }
//       );

//       const data = await res.text();

//       if (!res.ok) {
//         throw new Error(data || "فشل إرسال البلاغ");
//       }

//       toast.success("تم إرسال البلاغ بنجاح ✅");
//       setShowCommentMenu(null);
//     } catch (err) {
//       console.error("REPORT COMMENT ERROR:", err);
//       toast.error("حصل خطأ أثناء إرسال البلاغ");
//     }
//   };

//   const [showCommentOverlay, setShowCommentOverlay] = useState(false);
//   const [comments, setComments] = useState<any[]>([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [showShareOverlay, setShowShareOverlay] = useState(false);

//   const fetchComments = async () => {
//     const token = localStorage.getItem("boChatToken");
//     const userid = localStorage.getItem("userid");

//     // 🔴 لو مش مسجل
//     if (!userid || !token) {
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       setLoadingComments(true);

//       const res = await fetch(
//         `https://bo-chat.space/getcomments/${userid}?postid=${post._id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
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

//   const [commentText, setCommentText] = useState("");

//   const commentId = comments.length > 0 ? comments[0]._id : null;    
//   const userid = localStorage.getItem("userid");
//   const submitComment = async () => {
//   const token = localStorage.getItem("boChatToken");

//   if (!userid || !token) {
//     window.location.href = "/login";
//     return;
//   }

//   if (!commentText.trim()) return;

//   try {
//     const res = await fetch(
//       `https://bo-chat.space/posts/${post._id}/comments`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userid,
//           comment: commentText.trim(),
//         }),
//       }
//     );

//     if (!res.ok) throw new Error("Failed to send comment");

//     setCommentText("");

//     // 🔄 اعادة تحميل الكومنتات
//     fetchComments();
//   } catch (err) {
//     console.error("SEND COMMENT ERROR:", err);
//     alert("حصل خطأ أثناء إرسال التعليق");
//   }
// };
//   const [userData, setUserData] = useState<any>(null);
//   //   const fetchUserData = async () => {
//   //   try {
//   //     const token = localStorage.getItem("boChatToken");
//   //     const res = await fetch(`https://bo-chat.space/users/${userid}`, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });
//   //     if (!res.ok) throw new Error("Failed to fetch user data");
//   //       const data = await res.json();

//   //       setUserData(data);
//   //     return;
//   //   } catch (err) {
//   //     console.error("FETCH USER DATA ERROR:", err);
//   //     return null;
//   //   }
//   // };

// const fetchUserData = async () => {
//   try {
//     const response = await fetch('/api/user'); // your actual URL

//     // First, check if the response is OK (status 200-299)
//     if (!response.ok) {
//       // Log the HTTP error and see what the server returned
//       const text = await response.text(); // get HTML or plain text
//       console.error(`HTTP ${response.status}:`, text.slice(0, 200)); // show first 200 chars
//       throw new Error(`Server returned ${response.status}`);
//     }

//     // Then, verify content type
//     const contentType = response.headers.get('content-type');
//     if (!contentType || !contentType.includes('application/json')) {
//       const text = await response.text();
//       throw new Error(`Expected JSON but got ${contentType || 'unknown'} – ${text.slice(0, 100)}`);
//     }

//     const data = await response.json();
//     setUserData(data);
//   } catch (err) {
//     console.error('FETCH USER DATA ERROR:', err);
//     // Show a user-friendly message
//     setError('Unable to load user data. Please try again later.');
//   }
// };
//   useEffect(() => {
//     fetchUserData();
//   }, []);
//     const myUserImg = userData?.userpersonaldata?.img
//     // console.log("myUserImg", userData);

//   // ---------------------------   SHARE   -----------------------------------------
//   const handleShare = async () => {
//   const token = localStorage.getItem("boChatToken");
//   const userid = localStorage.getItem("userid");

//   if (!token || !userid) {
//     window.location.href = "/login";
//     return;
//   }

  

//   try {
//     setSharing(true);
//     const payload = {
//       userid,
//       content: shareText.trim(),
//     };

//     const res = await fetch(
//       `http://bo-chat.space/posts/${post._id}/share`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//    let data;
//       try {
//         data = await res.json();
//       } catch {
//         data = await res.text();
//       }

//     if (!res.ok) {
//       console.error("SHARE RESPONSE:", data);
//       throw new Error(
//         typeof data === "string" ? data : data?.message || "Share failed"
//       );
//     }

//     toast.success("تمت مشاركة المنشور بنجاح ✅");
//     setShareText("");
//     setShowShareOverlay(false);
//   } catch (err) {
//     console.error("SHARE ERROR:", err);
//     toast.error("حصل خطأ أثناء الشير");
//   } finally {
//     setSharing(false);
//   }
// };



//   // ---------------------------   LIKE   -----------------------------------------
//   const [showLikesOverlay, setShowLikesOverlay] = useState(false);
//   // ---------------------------   Comment Like   -----------------------------------------
//   // const handleCommentLike = async (commentId: string) => {
//   //   const token = localStorage.getItem("boChatToken");
//   //   const userid = localStorage.getItem("userid");
//   //   if (!token || !userid) {
//   //     window.location.href = "/login";
//   //     return;
//   //   }
//   //   try {
//   //     const res = await fetch("https://bo-chat.space/comment/react", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify({
//   //         userid,
//   //         commentid: commentId,
//   //       }),
//   //     });

//   //     if (!res.ok) {
//   //       const text = await res.text();
//   //       throw new Error(text || "Failed to react on comment");
//   //     }
      
//   //     console.log("COMMENT LIKE SUCCESS");
//   //   } catch (err) {
//   //     console.error("COMMENT LIKE ERROR:", err);
//   //   }
//   // };
//   const handleCommentLike = async (commentId: string) => {
//   const token = localStorage.getItem("boChatToken");
//   const userid = localStorage.getItem("userid");

//   if (!token || !userid) {
//     window.location.href = "/login";
//     return;
//   }

//   // 🔥 Optimistic UI
//   setComments(prev =>
//     prev.map(comment => {
//       if (comment._id !== commentId) return comment;

//       const alreadyLiked =
//         Array.isArray(comment.reacts) &&
//         comment.reacts.includes(userid);

//       return {
//         ...comment,
//         reacts: alreadyLiked
//           ? comment.reacts.filter((id: string) => id !== userid)
//           : [...(comment.reacts || []), userid],
//       };
//     })
//   );

//   try {
//     const res = await fetch("https://bo-chat.space/comment/react", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         userid,
//         commentid: commentId,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to react on comment");
//     }
//   } catch (err) {
//     console.error("COMMENT LIKE ERROR:", err);

//     // 🔁 Rollback لو حصل Error
//     fetchComments();
//   }
// };

//   const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
//   console.log("PostCard Comments", comments);
  
//   return (

//     <article dir="rtl" className={`${cardClass + textInnerBorder} relative`}>
//       <header className="p-5 flex items-start justify-between gap-3">
//         <div className="flex gap-2">
//         <div className="relative h-[50px] w-[50px] shrink-0  rounded-[21px]">
//           <Link href={`/profile/${post.userid}`}>
//             <img
//               src={post.userimg || "/imgs/user.png"}
//               alt={userName}
//               sizes="50px"
//               className="object-cover rounded-[21px]"
//               />
//               {post.vip && (
//                 <div className="absolute bottom-[-8px] right-1/2 transform translate-x-1/2 w-5 h-5">
//                   <img src="/icons/vip.svg" alt="" />
//                 </div>
//               )}
//             </Link>
//         </div>
//         <div className="">
//           <div className="flex flex-col ">
//             <span className="font-semibold">{userName}</span>
//             <span className="text-sm text-black/50">@{userHandle}</span>

//           </div>
//         </div>
//         </div>
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
//         <div className="max-h-[350px] flex items-center justify-center overflow-hidden bg-black/5 cursor-pointer"
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
//           {isQuestion? (
//             <div className="flex justify-center items-center w-full gap-3">
//               <button

//                 onClick={() =>{ setShowCommentOverlay(true); 
//                   fetchComments();
                  
//                 }}
//                 className="flex items-center px-[45px] text-center gap-2 bg-[#F2F2F2] text-[#B5B5B5]  py-2 rounded-xl cursor-default select-none"
//                 >
//                 أضف إجابة
//               </button>
//               <div className="bg-[#F2F2F2] p-2 rounded-[12px] flex items-center justify-center">
//                 <img src="/icons/like.svg" className="opacity-50" />
//               </div>
//             </div>

//           )
//         :
//         <><div className="flex items-center"  onClick={() => setShowLikesOverlay(true)}>

//             {likerAvatars.length > 0 ? (
//               <div className="flex items-center">
//                 {likerAvatars.map((src, idx) => (
//                   <div
//                     key={src + idx}
//                     className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
//                     style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
//                   >
//                     <img
//                       src={src}
//                       alt="user like"
//                       className="h-full w-full object-cover"
//                       loading="lazy" />
//                   </div>
//                 ))}
//                 {likeCount > likerAvatars.length && (
//                   <span className="me-3 text-xs text-black/60">
//                     +{likeCount - likerAvatars.length}
//                   </span>
//                 )}
//               </div>
//             ) : (
//               <span className="text-xs text-black/50">لا إعجابات بعد</span>
//             )}
//           </div>
//           <div className="flex items-center justify-center gap-4 text-sm text-black/70" dir="ltr">
//               <button
//                 onClick={handleLike}
//                 className="inline-flex items-center gap-1 cursor-pointer transition"
//                 style={{
//                   color: liked ? "#D72229" : "inherit",
//                 }}
//               >
//                 <LikeIcon active={liked} white={false} />
//               </button>

//               <span 
//                 onClick={() =>
//                     {
//                       fetchComments();
//                       setShowCommentOverlay(true)
//                     }
//                   }
//                 className="inline-flex items-center gap-1">
//                 <ReplyIcon />
//                 {commentCount}
//               </span>

//               <span className="inline-flex items-center gap-1"
//                onClick={() => setShowShareOverlay(true)}
//                >
//                 <ShareIcon />
//                 {sharesCount}
//               </span>
//             </div></>
//         }

//       </footer>
//       {showMenu && (
//         <div
//           className="absolute z-[9999]"
//           style={{
//             top: "40px",
//             left: "0px",
//           }}
//         >
//           <div className="
//             bg-[#000000]/15
//             rounded-[30px] 
//             shadow-xl 
//             backdrop-blur-xl 
//             p-4 
//             w-[260px]
//             flex flex-col 
//             gap-4
//           ">
//             <button 
//               onClick={() => handleBlock()}
//             className="
//               w-full 
//               bg-white 
//               rounded-[20px] 
//               py-3 
//               px-4 
//               text-right 
//               flex 
//               items-center 
//               gap-2
//             ">
//               <div className="h-8 w-8 bg-[#D8D8D8]  flex items-center justify-center rounded-full">
//                 <img src="/icons/eye.svg" className="w-5 h-5 invert-0 transform rotate-[160deg]" style={{ filter: "brightness(0) saturate(100%)" }} />
//               </div>
//               <span className="text-black">لا اريد مشاهدة هذا</span>
//             </button>

//             <button 
//               onClick={() => handleReport()}
//               className="
//                 w-full 
//                 bg-white 
//                 rounded-[20px] 
//                 py-3 
//                 px-4 
//                 text-right 
//                 flex 
//                 items-center 
//                 gap-2
//                 cursor-pointer
//                 hover:bg-[#F2F2F2]
//               ">
//               <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
//                 <img src="/icons/flag.svg" className="w-4 h-4" />
//               </div>
//               <span className="text-black">إبلاغ عن المنشور</span>
//             </button>
//           </div>
//         </div>
//       )}
//       {showOverlay && (
//         <div className="fixed inset-0 z-[99999] bg-[#000000]/90 backdrop-blur-sm flex items-center justify-center flex-col"
          
//         >
//           <div className=" mb-[15px] mt-[-15px] flex items-center gap-4" >
//             <button
//               className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//               onClick={() => setShowOverlay(false)}
//             >
//               <img src="/icons/close.svg" alt="" />
//             </button>
//           {/* Right Arrow */}
//           {images.length > 1 && (
//             <div className="flex items-center justify-center gap-2">
//             <button
//               onClick={() =>
//                 setActiveIndex((prev) =>
//                   prev === images.length - 1 ? 0 : prev + 1
//                 )
//               }
//               className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//             >
//               <img src="/imgs/arrowright.svg" alt="" />
//             </button>
//             <button
//               onClick={() =>
//                 setActiveIndex((prev) =>
//                   prev === 0 ? images.length - 1 : prev - 1
//                 )
//               }
//               className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
//             >
//               <img src="/imgs/arrowleft.svg" alt="" />
//             </button>
//             </div>

//           )}

//           </div>

//           {/* Image */}
//           <div >
//             <img
//               src={images[activeIndex]?.image}
//               className="max-h-[550px] max-w-[700px] rounded-[65px] object-contain"
//               />
//           </div>
          
//           {/* Left Arrow */}

//         </div>
//       )}

// {/* -------------- COMMENT OVERLAY ------------ */}
//   {showCommentOverlay && (
//     <div className="
//       fixed inset-0 z-[9999]
//       bg-[#0000001A]
//       backdrop-blur-[20px]
//       flex items-center justify-center
//     "
//     >

//       <div 
//         className="
//         relative
//           w-[90%] max-w-[600px]
//           relative
//           rounded-[25px]
//           max-h-[80vh]
//           bg-gradient-to-l from-[#fff] to-[#8D8D8D]
//           flex flex-col
//           z-[99999]
//         "
//       >
//       <div
//         onClick={() => setShowCommentOverlay(false)}
//         className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15  flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//       >
//         <img src="/icons/close.svg" alt="close" />
//       </div>
//         <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">
//           {
//             isQuestion ? "الإجابات" : "تقول ايه"
//           }
//         </h3>

//         {/* Content */}
//         <div className=" overflow-y-auto space-y-2 scrollbar-hidden ">
          
//           {loadingComments && (
//             <Loader />
//           )}

//           {!loadingComments && comments.length === 0 && (
//             <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
//               {
//                 isQuestion ? (
//                   <>
//                     <img src="/icons/answers.svg" className="w-[65px]" alt="" />
//                     <p className="text-2xl">مافيش اجابات لسه</p>
//                     <p className="text-md">ماحدش جاوب لسه… خليك أنت أول واحد يكسر الصمت</p>
//                   </>
//                 ) : (
//                   <>
//                     <img src="/icons/nocomments.svg" className="w-[65px]" alt="" />
//                   <p className="text-2xl">مافيش ردود لسه</p>
//                   <p className="text-md">ماحدش رد لسه خليك أنت أول واحد يكسر الصمت</p>
//                   </>
//                 )
//               }
//             </div>
//           )}

//         {!loadingComments &&
        
//           comments.map((comment, idx) => {
//             const myUserId = localStorage.getItem("userid");
//             const isCommentLikedByMe =
//               myUserId &&
//               Array.isArray(comment.reacts) &&
//               comment.reacts.includes(myUserId);
//             const commentReactsCount = comment.reacts?.length || 0;
//             return (
//               <div
//                 key={comment._id || idx}
//                 className="flex relative items-start justify-between p-3   gap-2 bg-[#000]/10 h-[107px]"
//               >
//                 <div className="flex items-start justify-between gap-3 ">
//                 {/* Avatar */}
//                   <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
//                     <img
//                       src={comment.userimg || "/imgs/user.png"}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   {/* Text */}
//                   <div className="flex-1 text-right">
//                     <div className="flex items-center">
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-[15px] text-white">
//                           {comment.name || comment.username || "مستخدم"}
//                         </span>
//                         <div className="flex gap-2">
//                           <span className="text-[12px] text-black/50">
//                             @{(comment.username || "").replaceAll(" ", "")}
//                           </span>

//                           <span className="text-[12px] text-[#D72229]">
//                             {timeAgoAr(comment.createdAt)}
//                           </span>
//                         </div>
//                       </div>

//                     </div>

//                     <p className="mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6"
//                     >
//                       {comment.content}
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className="
//                     flex
//                     cursor-pointer
//                     gap-2
//                   "
//                 >
//                   <div 
//                     onClick={() => handleCommentLike(comment._id)}
//                     className={`
//                       w-[60px]
//                       h-[34px]
//                       rounded-[15px]
//                       ${isCommentLikedByMe  ? "bg-[#D72229]" : "bg-[#B4B4B9]"}
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                     `}>
//                       {commentReactsCount > 0 && (
//                         <p className="text-white text-sm">
//                           {commentReactsCount}
//                         </p>
//                       )}
//                     <LikeIcon active={false} white={true} />
//                   </div>
//                   <div className=" w-[50px]
//                     h-[34px]
//                     rounded-[15px]
//                     flex
//                     bg-[##B4B4B9]/30
//                     border border-[#fff]/40
//                     items-center
//                     justify-center
//                     gap-2"
                    
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowCommentMenu(
//                           showCommentMenu === comment._id ? null : comment._id
//                         );
//                       }}
//                     >
//                     <img src="/imgs/dots.svg" className="filter invert" alt="" />
//                   </div>

//                   {showCommentMenu === comment._id && (
//                     <div
//                       className="
//                         absolute
//                         bottom-1
//                         left-0
//                         z-[9999]
//                         flex
//                         gap-2
//                         ml-3
//                       "
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       {/* رد */}
//                       <button
//                         className="
//                         w-[100px]
//                           flex items-center gap-1.5
//                           rounded-[18px]
//                           px-2 py-2
//                           text-sm
//                           bg-[#000]/30
//                           text-white
//                         "
//                       >
//                         <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                           <img src="/icons/reply.svg" alt="" />
//                         </div>
//                         <span>رد</span>
//                       </button>

//                       {/* إعجاب */}
//                       <button
//                         className="
//                         w-[100px]
//                           flex items-center gap-1.5
//                           rounded-[18px]
//                           px-3 py-2
//                           text-sm
//                           bg-[#D72229]/30
//                           text-white
//                         "
//                       >
//                         <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                           <img src="/icons/ban.svg" alt="" />
//                         </div>
//                         <span>حجب</span>
//                       </button>

//                       {/* بلاغ */}
//                       <button
//                         onClick={()=> handleReportComment(comment._id)}
//                         className="
//                         w-[100px]
//                           flex items-center gap-1.5
//                           rounded-[18px]
//                           px-3 py-2
//                           text-sm
//                           bg-[#D72229]/30
//                           text-white
//                         "
//                       >
//                         <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
//                           <img src="/icons/flag.svg"
//                             style={{
//                               filter:
//                                 "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
//                             }}
//                             alt="" 
//                             />
//                         </div>
//                         <span>بلاغ</span>
//                       </button>
//                     </div>
//                   )}

//                 </div>

//               </div>
//             )
//           })}
//           {/* Add Comment */}
//           <div className="
//             flex items-center gap-3
//             bg-[#fff]/50 backdrop-blur-xl
//             p-3
//             rounded-b-[25px]
//           ">
//             {/* Avatar */}
//             <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
//               <img
//                 src={myUserImg || "/imgs/user.png"}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {/* Input */}

//             <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
//               <input
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="اكتب إجابتك هنا"
//                 className="
//                   flex-1
//                   bg-transparent
//                   outline-none
//                   p-3
//                 "
//               />

//               {/* Submit */}
//               <button
//                 onClick={submitComment}
//                 className="
//                   bg-white
//                   px-4
//                   py-3
//                   rounded-tl-[19px]
//                   rounded-b-[19px]
//                   text-[#D72229]
//                   font-semibold
//                   shrink-0
//                   cursor-pointer
//                 "
//               >
//                 نشر الإجابة
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* share */}

//   {showShareOverlay && (
//       <div
//         className="
//           fixed inset-0 z-[100000]
//           bg-[#000]/10
//           backdrop-blur-[10px]
//           flex items-center justify-center
//         "
//       >
//         <div
//           className="
//             w-[90%] max-w-[690px]
//             rounded-[25px]
//             backdrop-blur-xl
//             relative
//             bg-gradient-to-l from-[#fff] to-[#8D8D8D]
//           "
//         >
//           <div
//            onClick={() => setShowShareOverlay(false)}
//             className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15  flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//           >
//             <img src="/icons/close.svg" alt="close" />
//           </div>
//           {/* Title */}
//           <h3 className="text-right text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px]">
//             شيرها فضفضة
//           </h3>
            
//           <div className="p-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D]">
//             {/* Textarea */}
//             <textarea
//               placeholder="اكتب هذا المحتوى الذي تريد مشاركته"
//               value={shareText}
//               onChange={(e) => setShareText(e.target.value)}
//               className="
//                 w-full
//                 h-[247px]
//                 p-4
//                 rounded-[20px]
//                 bg-transparent
//                 resize-none
//                 outline-none
//                 border border-black/10
//                 placeholder:text-sm
//               "
//             />

//           </div>
//           <div className="px-5 pb-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D] rounded-b-[25px]">

//             {/* Share To */}
//             <div className="text-right mb-3 font-medium">
//               شيرها في رسالة
//             </div>

//             <div className="flex items-center gap-3 overflow-x-auto pb-3">
//               {userData.followers.map((follower) => (
//                 <div key={follower.followerid} className="flex flex-col items-center gap-1">
//                   <div className="w-[55px] h-[55px] rounded-[23px] overflow-hidden">
//                     <img
//                       src={follower.followerdata.img || "/imgs/user.png"}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center justify-center">
//             {/* Share Button */}
//               <button
//                 onClick={handleShare}
//                 className={`
//                   w-[300px]
//                   mx-auto
//                   py-4
//                   rounded-[23px]
//                   mt-4
//                   text-white
//                   transition
//                   cursor-pointer
//                   ${
//                     sharing || !shareText.trim()
//                       ? "bg-black/40 "
//                       : "bg-[#D72229] hover:bg-[#b91c22]"
//                   }
//                 `}
//               >
//                 {sharing ? "جاري الشير..." : "شيرها"}
//               </button>

//           </div>
//           </div>
//         </div>
//       </div>
//     )}
//       {/* Likes Overlay */}
//       {showLikesOverlay && (
//         <div className="
//           fixed inset-0 z-[100000]
//           bg-black/10
//           backdrop-blur-[20px]
//           flex items-center justify-center
//         "
//           onClick={() => setShowLikesOverlay(false)}
//         >
//           <div className="
//             w-[90%] max-w-[690px]
//             rounded-[25px]
//             max-h-[660px]
//             flex flex-col
//             overflow-hidden
//             bg-gradient-to-l from-[#fff] to-[#8D8D8D]
//           ">
//             <div
//               onClick={() => setShowLikesOverlay(false)}
//               className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15  flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
//             >
//               <img src="/icons/close.svg" alt="close" />
//             </div>
//             {/* Header */}
//             <div className="bg-[#fff]/25 backdrop-blur-md px-4 h-[55px] flex items-center">
//                 <span className="font-semibold text-lg">تكات الاعجاب بالفضفضة</span>
   
//             </div>
//             <div className="px-5 flex items-center justify-between ">
//               <p className="text-[13px]">اعجابات بواسطة</p>
//               <p className="text-[13px]">{post.likes.length}</p>
//             </div>
//             {/* List */}
//               <div className="flex-1 overflow-y-auto scrollbar-hidden">
//               {Array.isArray(post.likes) && post.likes.length > 0 ? (
//                 post.likes.map((like: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between py-2 px-4 "
//                   >
//                     <div className="flex items-center gap-3">
//                       <Link href={`/profile/${like.userid}`}>
//                         <div className="w-[54px] h-[54px] rounded-[24px] overflow-hidden cursor-pointer">
//                           <img
//                             src={like.userimg || '/imgs/user.png'}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       </Link>
//                       <div className="flex flex-col">
//                         <span className="font-medium">
//                           {like.name || 'مستخدم'}
//                         </span>
//                         <span className="text-sm text-black/50">
//                           @{(like.username || '').replaceAll(' ', '')}
//                         </span>
//                       </div>
//                     </div>
//                     {
//                       like.userid === myUserId ? (
//                         null
//                       ) : (
//                         <FollowButton
//                           followingId={like.userid}
//                           serverFollowerIds={like.followerIds || []}
//                           requestedFollow={like.requestedFollow || false}
//                         />
//                       )
//                     }
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-6 text-gray-400">
//                   لا يوجد إعجابات
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//     </article>
//   );
// }

// function LikeIcon({ active = false , white = true}: { active?: boolean, white?: boolean }) {
//   return (
//     <img
//       src="/icons/like.svg"
//       alt=""
//       style={{
//         filter: active
//           ? "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)"
//           : white ? "brightness(0) invert(1)" : "none",
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

export function timeAgoAr(dateStr?: string) {
  const d = parseDateFlexible(dateStr);
  if (!d) return "منذ لحظات";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return "منذ لحظات";
  const mins = Math.floor(diffSec / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 30) return `منذ ${days} يوم`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );

  const [expanded, setExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

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

  // Get current user data from localStorage
  const myUserId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
  const myUserImg = typeof window !== "undefined" ? localStorage.getItem("userimg") : "/imgs/user.png";
  const token = typeof window !== "undefined" ? localStorage.getItem("boChatToken") : null;

  const handleLike = async () => {
    if (!token || !myUserId) return;

    // Optimistic Update
    setLiked((prev) => {
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });

    try {
      const res = await fetch(`http://bo-chat.space/posts/${post._id}/reactions`, {
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
      // Rollback
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

  // ---------------------------   BLOCK / REPORT   -----------------------------------------
  const handleBlock = () => {
    toast.error("الميزة قيد التطوير");
    setShowMenu(false);
  };

  const handleReport = async () => {
    if (!token || !myUserId) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch(`http://bo-chat.space/report/${myUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postid: post._id,
          email: "", // optional, can be omitted
        }),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text || "فشل إرسال البلاغ");

      toast.success("تم إرسال البلاغ بنجاح");
      setShowMenu(false);
    } catch (err) {
      console.error("REPORT ERROR:", err);
      toast.error("حصل خطأ أثناء إرسال البلاغ");
    }
  };

  // ---------------------------   COMMENTS   -----------------------------------------
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!myUserId || !token) {
      window.location.href = "/login";
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
      window.location.href = "/login";
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
    } catch (err) {
      console.error("SEND COMMENT ERROR:", err);
      alert("حصل خطأ أثناء إرسال التعليق");
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!token || !myUserId) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch(`http://bo-chat.space/report/comment/${commentId}`, {
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
      if (!res.ok) throw new Error(data || "فشل إرسال البلاغ");
      toast.success("تم إرسال البلاغ بنجاح ✅");
      setShowCommentMenu(null);
    } catch (err) {
      console.error("REPORT COMMENT ERROR:", err);
      toast.error("حصل خطأ أثناء إرسال البلاغ");
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!token || !myUserId) {
      window.location.href = "/login";
      return;
    }
    // Optimistic UI
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id !== commentId) return comment;
        const alreadyLiked = Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
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
      fetchComments(); // rollback
    }
  };

  // ---------------------------   SHARE   -----------------------------------------
  const [showShareOverlay, setShowShareOverlay] = useState(false);

  const handleShare = async () => {
    if (!token || !myUserId) {
      window.location.href = "/login";
      return;
    }
    try {
      setSharing(true);
      const payload = { userid: myUserId, content: shareText.trim() };
      const res = await fetch(`http://bo-chat.space/posts/${post._id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }
      if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || "Share failed");
      toast.success("تمت مشاركة المنشور بنجاح ✅");
      setShareText("");
      setShowShareOverlay(false);
    } catch (err) {
      console.error("SHARE ERROR:", err);
      toast.error("حصل خطأ أثناء الشير");
    } finally {
      setSharing(false);
    }
  };

  // ---------------------------   LIKES OVERLAY   -----------------------------------------
  const [showLikesOverlay, setShowLikesOverlay] = useState(false);

  return (
    <article dir="rtl" className={`${cardClass + textInnerBorder} relative`}>
      <header className="p-5 flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <div className="relative h-[50px] w-[50px] shrink-0 rounded-[21px]">
            <Link href={`/profile/${post.userid}`}>
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
            </Link>
          </div>
          <div className="">
            <div className="flex flex-col">
              <span className="font-semibold">{userName}</span>
              <span className="text-sm text-black/50">@{userHandle}</span>
            </div>
          </div>
        </div>
        <div className="flex relative items-center justify-center gap-2">
          <div className="text-xs text-[#D72229]">{timeAgoAr(post.createdAt || new Date().toISOString())}</div>
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
            <button onClick={() => setExpanded(!expanded)} className="text-[#D72229] text-sm mt-1 mb-2">
              {expanded ? "إخفاء" : "المزيد"}
            </button>
          )}
        </div>
      ) : null}

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

      {isQuestion && (
        <>
          <div className="flex items-center px-5 gap-4">
            <p className="text-[#B4B4B9]">{commentCount} اجابه</p>
            <p className="text-[#B4B4B9]">{likeCount} اعجاب</p>
          </div>
          <div className="w-full border-t-2 border-[#D72229] mt-3"></div>
        </>
      )}

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
              أضف إجابة
            </button>
            <div className="bg-[#F2F2F2] p-2 rounded-[12px] flex items-center justify-center">
              <img src="/icons/like.svg" className="opacity-50" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center" onClick={() => setShowLikesOverlay(true)}>
              {likerAvatars.length > 0 ? (
                <div className="flex items-center">
                  {likerAvatars.map((src, idx) => (
                    <div
                      key={src + idx}
                      className="relative h-7 w-7 rounded-[12px] ring-2 ring-white overflow-hidden"
                      style={{ marginInlineStart: idx === 0 ? 0 : -8 }}
                    >
                      <img src={src} alt="user like" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                  {likeCount > likerAvatars.length && (
                    <span className="me-3 text-xs text-black/60">+{likeCount - likerAvatars.length}</span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-black/50">لا إعجابات بعد</span>
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
                  fetchComments();
                  setShowCommentOverlay(true);
                }}
                className="inline-flex items-center gap-1"
              >
                <ReplyIcon />
                {commentCount}
              </span>
              <span onClick={() => setShowShareOverlay(true)} className="inline-flex items-center gap-1">
                <ShareIcon />
                {sharesCount}
              </span>
            </div>
          </>
        )}
      </footer>

      {showMenu && (
        <div className="absolute z-[9999]" style={{ top: "40px", left: "0px" }}>
          <div className="bg-[#000000]/15 rounded-[30px] shadow-xl backdrop-blur-xl p-4 w-[260px] flex flex-col gap-4">
            <button
              onClick={() => handleBlock()}
              className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2"
            >
              <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
                <img
                  src="/icons/eye.svg"
                  className="w-5 h-5 invert-0 transform rotate-[160deg]"
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </div>
              <span className="text-black">لا اريد مشاهدة هذا</span>
            </button>
            <button
              onClick={() => handleReport()}
              className="w-full bg-white rounded-[20px] py-3 px-4 text-right flex items-center gap-2 cursor-pointer hover:bg-[#F2F2F2]"
            >
              <div className="h-8 w-8 bg-[#D8D8D8] flex items-center justify-center rounded-full">
                <img src="/icons/flag.svg" className="w-4 h-4" />
              </div>
              <span className="text-black">إبلاغ عن المنشور</span>
            </button>
          </div>
        </div>
      )}

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
                  onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
                >
                  <img src="/imgs/arrowright.svg" alt="" />
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="cursor-pointer bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/50 transition w-[55px] h-[55px] flex items-center justify-center rounded-full"
                >
                  <img src="/imgs/arrowleft.svg" alt="" />
                </button>
              </div>
            )}
          </div>
          <div>
            <img src={images[activeIndex]?.image} className="max-h-[550px] max-w-[700px] rounded-[65px] object-contain" />
          </div>
        </div>
      )}

      {/* -------------- COMMENT OVERLAY ------------ */}
      {showCommentOverlay && (
        <div className="fixed inset-0 z-[9999] bg-[#0000001A] backdrop-blur-[20px] flex items-center justify-center">
          <div className="relative w-[90%] max-w-[600px] relative rounded-[25px] max-h-[80vh] bg-gradient-to-l from-[#fff] to-[#8D8D8D] flex flex-col z-[99999]">
            <div
              onClick={() => setShowCommentOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
            <h3 className="text-lg font-semibold text-right p-3 bg-[#fff]/25 backdrop-blur-xl rounded-t-[25px]">
              {isQuestion ? "الإجابات" : "تقول ايه"}
            </h3>
            <div className="overflow-y-auto space-y-2 scrollbar-hidden">
              {loadingComments && <Loader />}
              {!loadingComments && comments.length === 0 && (
                <div className="flex items-center justify-center w-full h-[400px] flex-col gap-4">
                  {isQuestion ? (
                    <>
                      <img src="/icons/answers.svg" className="w-[65px]" alt="" />
                      <p className="text-2xl">مافيش اجابات لسه</p>
                      <p className="text-md">ماحدش جاوب لسه… خليك أنت أول واحد يكسر الصمت</p>
                    </>
                  ) : (
                    <>
                      <img src="/icons/nocomments.svg" className="w-[65px]" alt="" />
                      <p className="text-2xl">مافيش ردود لسه</p>
                      <p className="text-md">ماحدش رد لسه خليك أنت أول واحد يكسر الصمت</p>
                    </>
                  )}
                </div>
              )}
              {!loadingComments &&
                comments.map((comment, idx) => {
                  const isCommentLikedByMe =
                    myUserId && Array.isArray(comment.reacts) && comment.reacts.includes(myUserId);
                  const commentReactsCount = comment.reacts?.length || 0;
                  return (
                    <div key={comment._id || idx} className="flex relative items-start justify-between p-3 gap-2 bg-[#000]/10 h-[107px]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-[54px] h-[54px] shrink-0 rounded-[23px] overflow-hidden">
                          <img src={comment.userimg || "/imgs/user.png"} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[15px] text-white">
                                {comment.name || comment.username || "مستخدم"}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-[12px] text-black/50">
                                  @{(comment.username || "").replaceAll(" ", "")}
                                </span>
                                <span className="text-[12px] text-[#D72229]">{timeAgoAr(comment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-black/80 whitespace-pre-wrap leading-6">{comment.content}</p>
                        </div>
                      </div>
                      <div className="flex cursor-pointer gap-2">
                        <div
                          onClick={() => handleCommentLike(comment._id)}
                          className={`w-[60px] h-[34px] rounded-[15px] ${
                            isCommentLikedByMe ? "bg-[#D72229]" : "bg-[#B4B4B9]"
                          } flex items-center justify-center gap-2`}
                        >
                          {commentReactsCount > 0 && <p className="text-white text-sm">{commentReactsCount}</p>}
                          <LikeIcon active={false} white={true} />
                        </div>
                        <div
                          className="w-[50px] h-[34px] rounded-[15px] flex bg-[##B4B4B9]/30 border border-[#fff]/40 items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCommentMenu(showCommentMenu === comment._id ? null : comment._id);
                          }}
                        >
                          <img src="/imgs/dots.svg" className="filter invert" alt="" />
                        </div>
                        {showCommentMenu === comment._id && (
                          <div className="absolute bottom-1 left-0 z-[9999] flex gap-2 ml-3" onClick={(e) => e.stopPropagation()}>
                            <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-2 py-2 text-sm bg-[#000]/30 text-white">
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                                <img src="/icons/reply.svg" alt="" />
                              </div>
                              <span>رد</span>
                            </button>
                            <button className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white">
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                                <img src="/icons/ban.svg" alt="" />
                              </div>
                              <span>حجب</span>
                            </button>
                            <button
                              onClick={() => handleReportComment(comment._id)}
                              className="w-[100px] flex items-center gap-1.5 rounded-[18px] px-3 py-2 text-sm bg-[#D72229]/30 text-white"
                            >
                              <div className="w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center">
                                <img
                                  src="/icons/flag.svg"
                                  style={{
                                    filter:
                                      "invert(27%) sepia(88%) saturate(2997%) hue-rotate(342deg) brightness(91%) contrast(96%)",
                                  }}
                                  alt=""
                                />
                              </div>
                              <span>بلاغ</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div className="flex items-center gap-3 bg-[#fff]/50 backdrop-blur-xl p-3 rounded-b-[25px]">
                <div className="w-[42px] h-[42px] rounded-[21px] overflow-hidden shrink-0">
                  <img src={myUserImg || "/imgs/user.png"} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#000]/10 backdrop-blur-xl w-full flex rounded-[19px]">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="اكتب إجابتك هنا"
                    className="flex-1 bg-transparent outline-none p-3"
                  />
                  <button
                    onClick={submitComment}
                    className="bg-white px-4 py-3 rounded-tl-[19px] rounded-b-[19px] text-[#D72229] font-semibold shrink-0 cursor-pointer"
                  >
                    نشر الإجابة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* share overlay */}
      {showShareOverlay && (
        <div className="fixed inset-0 z-[100000] bg-[#000]/10 backdrop-blur-[10px] flex items-center justify-center">
          <div className="w-[90%] max-w-[690px] rounded-[25px] backdrop-blur-xl relative bg-gradient-to-l from-[#fff] to-[#8D8D8D]">
            <div
              onClick={() => setShowShareOverlay(false)}
              className="absolute -top-16 left-1/2 w-[50px] h-[50px] bg-[#000]/15 flex items-center justify-center rounded-full hover:bg-[#fff]/10 transform -translate-x-1/2 cursor-pointer z-9999 transition"
            >
              <img src="/icons/close.svg" alt="close" />
            </div>
            <h3 className="text-right text-lg font-semibold bg-[#fff]/25 backdrop-blur-md p-3 rounded-t-[25px]">
              شيرها فضفضة
            </h3>
            <div className="p-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D]">
              <textarea
                placeholder="اكتب هذا المحتوى الذي تريد مشاركته"
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="w-full h-[247px] p-4 rounded-[20px] bg-transparent resize-none outline-none border border-black/10 placeholder:text-sm"
              />
            </div>
            <div className="px-5 pb-5 bg-gradient-to-l from-[#FFFFFF] bg-[##8D8D8D] rounded-b-[25px]">
              <div className="text-right mb-3 font-medium">شيرها في رسالة</div>
              <div className="flex items-center gap-3 overflow-x-auto pb-3">
                {/* You may add followers list if available, otherwise skip */}
                <p className="text-xs text-black/50">لا يوجد متابعون لعرضهم</p>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleShare}
                  className={`w-[300px] mx-auto py-4 rounded-[23px] mt-4 text-white transition cursor-pointer ${
                    sharing || !shareText.trim() ? "bg-black/40" : "bg-[#D72229] hover:bg-[#b91c22]"
                  }`}
                >
                  {sharing ? "جاري الشير..." : "شيرها"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Likes Overlay */}
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
              <span className="font-semibold text-lg">تكات الاعجاب بالفضفضة</span>
            </div>
            <div className="px-5 flex items-center justify-between">
              <p className="text-[13px]">اعجابات بواسطة</p>
              <p className="text-[13px]">{post.likes.length}</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hidden">
              {Array.isArray(post.likes) && post.likes.length > 0 ? (
                post.likes.map((like: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${like.userid}`}>
                        <div className="w-[54px] h-[54px] rounded-[24px] overflow-hidden cursor-pointer">
                          <img src={like.userimg || "/imgs/user.png"} className="w-full h-full object-cover" />
                        </div>
                      </Link>
                      <div className="flex flex-col">
                        <span className="font-medium">{like.name || "مستخدم"}</span>
                        <span className="text-sm text-black/50">@{(like.username || "").replaceAll(" ", "")}</span>
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
                <p className="text-center py-6 text-gray-400">لا يوجد إعجابات</p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

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