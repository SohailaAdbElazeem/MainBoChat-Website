// // src/hooks/useVideoActions.ts
// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { getToken, getUserId } from "@/lib/auth-client";
// import { Video } from "@/types/video";

// export function useVideoActions(videos: Video[], openLoginModal: () => void ) {
//   // ===== LIKE =====
//   const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
//   const [likesCount, setLikesCount] = useState<Record<string, number>>({});

//   useEffect(() => {
//     const userId = getUserId();
//     const initialCounts: Record<string, number> = {};
//     const initialStatus: Record<string, boolean> = {};

//     videos.forEach((video) => {
//       const likes = video.likes || [];
//       initialCounts[video._id] = likes.length;
//       const likedByMe = Array.isArray(likes) && likes.includes(userId);
//       initialStatus[video._id] = likedByMe;
//     });

//     setLikesCount(initialCounts);
//     setLikedStatus(initialStatus);
//   }, [videos]);

//   const handleLike = async (video: { _id: string }) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     const videoId = video._id;
//     const wasLiked = likedStatus[videoId] || false;

//     setLikedStatus((prev) => ({ ...prev, [videoId]: !wasLiked }));
//     setLikesCount((prev) => ({
//       ...prev,
//       [videoId]: (prev[videoId] || 0) + (wasLiked ? -1 : 1),
//     }));

//     try {
//       const res = await fetch(`https://bo-chat.space/posts/${videoId}/reactions`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: userId }),
//       });
//       if (!res.ok) throw new Error();
//     } catch {
//       setLikedStatus((prev) => ({ ...prev, [videoId]: wasLiked }));
//       setLikesCount((prev) => ({
//         ...prev,
//         [videoId]: (prev[videoId] || 0) + (wasLiked ? 1 : -1),
//       }));
//       toast.error("حدث خطأ في الإعجاب");
//     }
//   };

//   // ===== COMMENTS =====
//   const [comments, setComments] = useState<any[]>([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
//   const [userCommentedStatus, setUserCommentedStatus] = useState<Record<string, boolean>>({});
//   // 👇 إضافة state لحفظ عدد التعليقات لكل فيديو
//   const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

//   const fetchComments = async (postId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!userId || !token) {
//       openLoginModal();
//       return;
//     }
//     setLoadingComments(true);
//     try {
//       const res = await fetch(`https://bo-chat.space/getcomments/${userId}?postid=${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setComments(Array.isArray(data) ? data : []);
//       // ✅ تحديث عدد التعليقات لهذا الفيديو
//       setCommentCounts((prev) => ({
//         ...prev,
//         [postId]: Array.isArray(data) ? data.length : 0,
//       }));
//     } catch {
//       setComments([]);
//       // في حالة الخطأ، نضع العدد 0
//       setCommentCounts((prev) => ({ ...prev, [postId]: 0 }));
//     } finally {
//       setLoadingComments(false);
//     }
//   };

//   const submitComment = async (postId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!userId || !token) {
//       openLoginModal();
//       return;
//     }
//     if (!commentText.trim()) return;
//     try {
//       const res = await fetch(`https://bo-chat.space/posts/${postId}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: userId, comment: commentText.trim() }),
//       });
//       if (!res.ok) throw new Error();
//       setCommentText("");
//       setUserCommentedStatus((prev) => ({ ...prev, [postId]: true }));
//       await fetchComments(postId);
//       toast.success("تم إضافة التعليق");
//     } catch {
//       toast.error("خطأ في الإرسال");
//     }
//   };

//   const handleCommentLike = async (commentId: string, postId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     setComments((prev) =>
//       prev.map((comment) => {
//         if (comment._id !== commentId) return comment;
//         const alreadyLiked = Array.isArray(comment.reacts) && comment.reacts.includes(userId);
//         return {
//           ...comment,
//           reacts: alreadyLiked
//             ? comment.reacts.filter((id: string) => id !== userId)
//             : [...(comment.reacts || []), userId],
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
//         body: JSON.stringify({ userid: userId, commentid: commentId }),
//       });
//       if (!res.ok) throw new Error();
//     } catch {
//       fetchComments(postId);
//     }
//   };

//   const handleReportComment = async (commentId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     try {
//       const res = await fetch(`https://bo-chat.space/report/comment/${commentId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userid: userId,
//           reporttype: "comment",
//           reportdescription: "محتوى غير لائق",
//         }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("تم الإبلاغ");
//       setShowCommentMenu(null);
//     } catch {
//       toast.error("فشل الإبلاغ");
//     }
//   };

//   // ===== SHARE =====
//   const [showShareOverlay, setShowShareOverlay] = useState(false);
//   const [shareText, setShareText] = useState("");
//   const [sharing, setSharing] = useState(false);
//   const [userSharedStatus, setUserSharedStatus] = useState<Record<string, boolean>>({});

//   const handleShare = async (postId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     setSharing(true);
//     try {
//       const res = await fetch(`https://bo-chat.space/posts/${postId}/share`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userid: userId, content: shareText.trim() }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("تمت المشاركة");
//       setUserSharedStatus((prev) => ({ ...prev, [postId]: true }));
//       setShareText("");
//       setShowShareOverlay(false);
//     } catch {
//       toast.error("فشل المشاركة");
//     } finally {
//       setSharing(false);
//     }
//   };

//   // ===== OPTIONS =====
//   const [isBlocking, setIsBlocking] = useState(false);

//   const handleBlockUser = async (
//     targetUserId: string,
//     currentVideoId: string,
//     onSuccess?: () => void
//   ) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     if (targetUserId === userId) {
//       toast.error("لا يمكنك حظر نفسك");
//       return;
//     }
//     setIsBlocking(true);
//     try {
//       const res = await fetch(`https://bo-chat.space/block${userId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ blockedid: targetUserId }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("تم الحظر");
//       onSuccess?.();
//     } catch {
//       toast.error("فشل الحظر");
//     } finally {
//       setIsBlocking(false);
//     }
//   };

//   const handleReportVideo = async (postId: string) => {
//     const token = getToken();
//     const userId = getUserId();
//     if (!token || !userId) {
//       openLoginModal();
//       return;
//     }
//     try {
//       const res = await fetch(`https://bo-chat.space/report${userId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ postid: postId, email: "" }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success("تم الإبلاغ");
//     } catch {
//       toast.error("فشل الإبلاغ");
//     }
//   };

//   // ===== RETURN =====
//   return {
//     // Like
//     likedStatus,
//     likesCount,
//     handleLike,
//     // Comments
//     comments,
//     loadingComments,
//     commentText,
//     setCommentText,
//     showCommentMenu,
//     setShowCommentMenu,
//     fetchComments,
//     submitComment,
//     handleCommentLike,
//     handleReportComment,
//     userCommentedStatus,
//      commentCounts,
//     // Share
//     showShareOverlay,
//     setShowShareOverlay,
//     shareText,
//     setShareText,
//     sharing,
//     handleShare,
//     userSharedStatus,
//     // Options
//     isBlocking,
//     handleBlockUser,
//     handleReportVideo,
//   };
// }

// src/hooks/useVideoActions.ts
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getToken, getUserId } from "@/lib/auth-client";
import { Video } from "@/types/video";

export function useVideoActions(videos: Video[], openLoginModal: () => void) {
  // ===== LIKE =====
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  // ===== COMMENTS =====
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  const [userCommentedStatus, setUserCommentedStatus] = useState<Record<string, boolean>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  // ===== SHARE =====
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [shareText, setShareText] = useState("");
  const [sharing, setSharing] = useState(false);
  const [userSharedStatus, setUserSharedStatus] = useState<Record<string, boolean>>({});
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({}); // ← إضافة

  // ===== OPTIONS =====
  const [isBlocking, setIsBlocking] = useState(false);

  // ===== تهيئة القيم عند تغير الفيديوهات =====
  useEffect(() => {
    const userId = getUserId();
    const initialLikesCounts: Record<string, number> = {};
    const initialLikedStatus: Record<string, boolean> = {};
    const initialCommentCounts: Record<string, number> = {};
     const initialShareCounts: Record<string, number> = {};

    videos.forEach((video) => {
      // --- Likes ---
      const likes = video.likes || [];
      initialLikesCounts[video._id] = likes.length;
      initialLikedStatus[video._id] = Array.isArray(likes) && likes.includes(userId);

      // --- Comment ---
      const comments = video.comments || [];
      initialCommentCounts[video._id] = comments.length;

      // --- Share ---
      const shares = video.shares || [];
      initialShareCounts[video._id] = shares.length;

    });

    setLikesCount(initialLikesCounts);
    setLikedStatus(initialLikedStatus);
    setCommentCounts(initialCommentCounts);
        setShareCounts(initialShareCounts); // ← تهيئة

  }, [videos]);

  // ===== LIKE =====
  const handleLike = async (video: { _id: string }) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    const videoId = video._id;
    const wasLiked = likedStatus[videoId] || false;

    // Optimistic update
    setLikedStatus((prev) => ({ ...prev, [videoId]: !wasLiked }));
    setLikesCount((prev) => ({
      ...prev,
      [videoId]: (prev[videoId] || 0) + (wasLiked ? -1 : 1),
    }));

    try {
      const res = await fetch(`https://bo-chat.space/posts/${videoId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: userId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback
      setLikedStatus((prev) => ({ ...prev, [videoId]: wasLiked }));
      setLikesCount((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] || 0) + (wasLiked ? 1 : -1),
      }));
      toast.error("حدث خطأ في الإعجاب");
    }
  };

  // ===== COMMENTS =====
  const fetchComments = async (postId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) {
      openLoginModal();
      return;
    }
    setLoadingComments(true);
    try {
      const res = await fetch(`https://bo-chat.space/getcomments/${userId}?postid=${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: Array.isArray(data) ? data.length : 0,
      }));
    } catch {
      setComments([]);
      setCommentCounts((prev) => ({ ...prev, [postId]: 0 }));
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (postId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!userId || !token) {
      openLoginModal();
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`https://bo-chat.space/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: userId, comment: commentText.trim() }),
      });
      if (!res.ok) throw new Error();
      setCommentText("");
      setUserCommentedStatus((prev) => ({ ...prev, [postId]: true }));
      await fetchComments(postId);
      toast.success("تم إضافة التعليق");
    } catch {
      toast.error("خطأ في الإرسال");
    }
  };

  const handleCommentLike = async (commentId: string, postId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id !== commentId) return comment;
        const alreadyLiked = Array.isArray(comment.reacts) && comment.reacts.includes(userId);
        return {
          ...comment,
          reacts: alreadyLiked
            ? comment.reacts.filter((id: string) => id !== userId)
            : [...(comment.reacts || []), userId],
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
        body: JSON.stringify({ userid: userId, commentid: commentId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      fetchComments(postId);
    }
  };

  const handleReportComment = async (commentId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch(`https://bo-chat.space/report/comment/${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userid: userId,
          reporttype: "comment",
          reportdescription: "محتوى غير لائق",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم الإبلاغ");
      setShowCommentMenu(null);
    } catch {
      toast.error("فشل الإبلاغ");
    }
  };

  // ===== SHARE =====
  const handleShare = async (postId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    setSharing(true);
    try {
      const res = await fetch(`https://bo-chat.space/posts/${postId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: userId, content: shareText.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("تمت المشاركة");
      setUserSharedStatus((prev) => ({ ...prev, [postId]: true }));
 
      setShareCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));
      setShareText("");
      setShowShareOverlay(false);
    } catch {
      toast.error("فشل المشاركة");
    } finally {
      setSharing(false);
    }
  };

  // ===== OPTIONS =====
  const handleBlockUser = async (
    targetUserId: string,
    currentVideoId: string,
    onSuccess?: () => void
  ) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    if (targetUserId === userId) {
      toast.error("لا يمكنك حظر نفسك");
      return;
    }
    setIsBlocking(true);
    try {
      const res = await fetch(`https://bo-chat.space/block${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blockedid: targetUserId }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم الحظر");
      onSuccess?.();
    } catch {
      toast.error("فشل الحظر");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReportVideo = async (postId: string) => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch(`https://bo-chat.space/report${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postid: postId, email: "" }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم الإبلاغ");
    } catch {
      toast.error("فشل الإبلاغ");
    }
  };

  // ===== RETURN =====
  return {
    // Like
    likedStatus,
    likesCount,
    handleLike,
    // Comments
    comments,
    loadingComments,
    commentText,
    setCommentText,
    showCommentMenu,
    setShowCommentMenu,
    fetchComments,
    submitComment,
    handleCommentLike,
    handleReportComment,
    userCommentedStatus,
    commentCounts,
    // Share
    showShareOverlay,
    setShowShareOverlay,
    shareText,
    setShareText,
    sharing,
    handleShare,
    userSharedStatus,
    shareCounts,  
    // Options
    isBlocking,
    handleBlockUser,
    handleReportVideo,
  };
}