// components/suggestions/SuggestionsFeed.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Video } from "@/types/video";
import { SuggestionCard } from "./SuggestionCard";
import Loader from "@/components/Loader";
import { useLike } from "@/hooks/useLike";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useVideoStore } from "@/store/videoStore";

const LIMIT = 20; 

export function SuggestionsFeed() {
  const router = useRouter();
  const setSelectedVideo = useVideoStore((state) => state.setSelectedVideo);

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { openLoginModal } = useLoginModal();
  const { likedStatus, likesCount, handleLike } = useLike(videos);

   const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

   const fetchSuggestions = async (pageNum: number, append: boolean = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await fetch(
        `https://bo-chat.space/homepage/reels/BestVideos?page=${pageNum}&limit=${LIMIT}`
      );
      const data = await res.json();

      let newVideos: Video[] = [];
      if (data?.success && Array.isArray(data.response)) {
        newVideos = data.response;
      } else if (Array.isArray(data)) {
        newVideos = data;
      }

      if (append) {
        setVideos((prev) => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }

       setHasMore(newVideos.length === LIMIT);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

   useEffect(() => {
    fetchSuggestions(1, false);
     setPage(1);
    setHasMore(true);
  }, []);

   useEffect(() => {
    if (page > 1) {
      fetchSuggestions(page, true);
    }
  }, [page]);

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        لا توجد مقترحات حالياً
      </div>
    );
  }

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    router.push("/videos");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {videos.map((video, index) => {
        // ربط آخر عنصر بـ lastVideoRef لبدء تحميل المزيد
        const isLast = index === videos.length - 1;
        return (
          <div key={video._id} ref={isLast ? lastVideoRef : null}>
            <SuggestionCard
              video={video}
              isLiked={likedStatus[video._id] || false}
              likeCount={likesCount[video._id] || 0}
              onLike={() => handleLike(video, openLoginModal)}
              onPlay={() => handlePlayVideo(video)}
            />
          </div>
        );
      })}

      {/* مؤشر تحميل المزيد */}
      {loadingMore && (
        <div className="col-span-1 md:col-span-2 flex justify-center py-4">
          <Loader />
        </div>
      )}

      {/* رسالة انتهاء القائمة */}
      {!hasMore && videos.length > 0 && (
        <div className="col-span-1 md:col-span-2 text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          تم تحميل جميع الفيديوهات
        </div>
      )}
    </div>
  );
}