// src/hooks/useLike.ts
import { useState, useEffect } from "react";
import { Video } from "@/types/video";
import { getToken, getUserId } from "@/lib/auth-client";

export function useLike(videos: Video[]) {
  const [likedStatus, setLikedStatus] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const userId = getUserId();
    const initialCounts: Record<string, number> = {};
    const initialStatus: Record<string, boolean> = {};

    videos.forEach((video) => {
      const likes = video.likes || [];
       initialCounts[video._id] = likes.length;
      
       const likedByMe = Array.isArray(likes) && likes.includes(userId);
      initialStatus[video._id] = likedByMe;
    });

    setLikesCount(initialCounts);
    setLikedStatus(initialStatus);
  }, [videos]);

  const handleLike = async (video: Video, onLoginRequired: () => void) => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      onLoginRequired();
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
      const res = await fetch(
        `https://bo-chat.space/posts/${videoId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userid: userId }),
        }
      );
      if (!res.ok) throw new Error("Failed to like");
    } catch (error) {
      // Rollback
      setLikedStatus((prev) => ({ ...prev, [videoId]: wasLiked }));
      setLikesCount((prev) => ({
        ...prev,
        [videoId]: (prev[videoId] || 0) + (wasLiked ? 1 : -1),
      }));
      console.error("Like error:", error);
    }
  };

  return { likedStatus, likesCount, handleLike };
}