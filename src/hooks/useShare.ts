// src/hooks/useShare.ts
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getToken, getUserId } from "@/lib/auth-client";

export function useShare(openLoginModal: () => void) {
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const [shareText, setShareText] = useState("");
  const [sharing, setSharing] = useState(false);
  const [userSharedStatus, setUserSharedStatus] = useState<Record<string, boolean>>({});

  const handleShare = useCallback(
    async (postId: string) => {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        openLoginModal();
        return;
      }

      try {
        setSharing(true);
        const payload = { userid: userId, content: shareText.trim() };
        const res = await fetch(`https://bo-chat.space/posts/${postId}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Share failed");

        toast.success("تمت المشاركة بنجاح");
        setUserSharedStatus((prev) => ({ ...prev, [postId]: true }));
        setShareText("");
        setShowShareOverlay(false);
      } catch {
        toast.error("فشل المشاركة");
      } finally {
        setSharing(false);
      }
    },
    [shareText, openLoginModal]
  );

  const openShareOverlay = useCallback(() => {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      openLoginModal();
      return;
    }
    setShowShareOverlay(true);
  }, [openLoginModal]);

  const closeShareOverlay = useCallback(() => {
    setShowShareOverlay(false);
    setShareText("");
  }, []);

  return {
    showShareOverlay,
    shareText,
    setShareText,
    sharing,
    userSharedStatus,
    setUserSharedStatus,
    handleShare,
    openShareOverlay,
    closeShareOverlay,
  };
}