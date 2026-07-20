// src/hooks/useVideos.ts
import { useState, useEffect, useCallback } from "react";
import { Video } from "@/types/video";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://bo-chat.space/bestvideosTest/null?page=1&limit=20`
      );
      const data = await res.json();
      console.log("🔍 [API] Data received:", data);
      data.forEach((video: any) => {
        console.log(`📹 [API] Video ${video._id} likes:`, video.likes);
        if (video.likes) {
          console.log(
            `👤 [API] User IDs in likes:`,
            video.likes.map((l: any) => l.userid)
          );
        }
      });
      if (Array.isArray(data)) {
         const formattedData = data.map((video: any) => ({
          ...video,
          likes: Array.isArray(video.likes)
            ? video.likes.map((like: any) =>
                typeof like === "string" ? like : like.userid
              )
            : [],
        }));
        setVideos(formattedData);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => Math.min(videos.length - 1, prev + 1));

   const updateVideo = useCallback((videoId: string, updatedData: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id === videoId ? { ...video, ...updatedData } : video
      )
    );
  }, []);

  return {
    videos,
    loading,
    currentIndex,
    currentVideo: videos[currentIndex],
    goToPrev,
    goToNext,
    refresh: fetchVideos,
    updateVideo,  
  };
}