import { useState, useCallback } from "react";
import { getToken, getUserId } from "@/lib/auth-client";
import toast from "react-hot-toast";    

interface Comment {
  _id: string;
  userid: string;
  username?: string;
  userimg?: string;
  comment: string;
  reacts?: string[];  
  createdAt?: string;
}

export function useComments(videoId: string, openLoginModal: () => void) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null); 

  const token = getToken();
  const userId = getUserId();

  // جلب التعليقات
  const fetchComments = useCallback(async () => {
    if (!userId || !token) {
      openLoginModal();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://bo-chat.space/getcomments/${userId}?postid=${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setComments([]);
      toast.error("حدث خطأ في تحميل التعليقات");
    } finally {
      setLoading(false);
    }
  }, [videoId, userId, token, openLoginModal]);

  // إضافة تعليق جديد
  const submitComment = useCallback(async () => {
    if (!userId || !token) {
      openLoginModal();
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(
        `https://bo-chat.space/posts/${videoId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userid: userId,
            comment: trimmed,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to post comment");

      setCommentText("");
      toast.success("تم إضافة التعليق");
      await fetchComments(); 
    } catch (error) {
      console.error(error);
      toast.error("فشل إضافة التعليق");
    }
  }, [commentText, videoId, userId, token, openLoginModal, fetchComments]);

  // الإعجاب بتعليق (Optimistic Update)
  const handleLikeComment = useCallback(
    async (commentId: string) => {
      if (!userId || !token) {
        openLoginModal();
        return;
      }

      // تحديث واجهة المستخدم فوراً
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id !== commentId) return comment;
          const alreadyLiked = comment.reacts?.includes(userId) || false;
          return {
            ...comment,
            reacts: alreadyLiked
              ? comment.reacts!.filter((id) => id !== userId)
              : [...(comment.reacts || []), userId],
          };
        })
      );

      try {
        await fetch("https://bo-chat.space/comment/react", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userid: userId,
            commentid: commentId,
          }),
        });
      } catch {
         await fetchComments();
        toast.error("حدث خطأ في الإعجاب");
      }
    },
    [userId, token, openLoginModal, fetchComments]
  );

  // الإبلاغ عن تعليق
  const handleReportComment = useCallback(
    async (commentId: string) => {
      if (!userId || !token) {
        openLoginModal();
        return;
      }

      try {
        const res = await fetch(
          `https://bo-chat.space/report/comment/${commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userid: userId,
              reporttype: "comment",
              reportdescription: "تم الإبلاغ عن هذا التعليق",
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to report");
        toast.success("تم الإبلاغ عن التعليق");
        setShowMenu(null);
      } catch {
        toast.error("فشل الإبلاغ");
      }
    },
    [userId, token, openLoginModal]
  );

  return {
    comments,
    loading,
    commentText,
    setCommentText,
    showMenu,
    setShowMenu,
    fetchComments,
    submitComment,
    handleLikeComment,
    handleReportComment,
  };
}