// src/components/suggestions/SuggestionsFeed.tsx
"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Video } from "@/types/video";
import { SuggestionCard } from "./SuggestionCard";
import Loader from "@/components/Loader";
import { useLike } from "@/hooks/useLike";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useVideoStore } from "@/store/videoStore";
import { useSearchStore } from "@/store/searchStore";

const LIMIT = 20;

interface SuggestionsFeedProps {
  onVideoSelect?: (video: Video) => void; 
}

export function SuggestionsFeed({ onVideoSelect }: SuggestionsFeedProps) {
  const t = useTranslations('SuggestionsFeed');
  const router = useRouter();
  const { setSelectedVideo } = useVideoStore((state) => state);
  const { searchQuery } = useSearchStore();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { openLoginModal } = useLoginModal();
  const { likedStatus, likesCount, handleLike } = useLike(videos);

  // تصفية الفيديوهات بناءً على searchQuery
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return videos.filter((v) => {
      const desc = (v.description || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const username = (v.username || '').toLowerCase();
      return desc.includes(lowerQuery) || name.includes(lowerQuery) || username.includes(lowerQuery);
    });
  }, [videos, searchQuery]);

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
 
  if (filteredVideos.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {searchQuery.trim() ? (
          <>
            <div
              className="w-[180px] text-black flex items-center justify-center rounded-[8px]"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '30px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center' }}
            >
              {t('no_results')}
            </div>
            <p
              className="mt-6"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '27px',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#000000',
                width: '403px',
                height: '54px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t('no_results_message')}
            </p>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">{t('no_suggestions')}</p>
        )}
      </div>
    );
  }

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    if (onVideoSelect) {
      onVideoSelect(video);
    } else {
      router.push("/videos");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {filteredVideos.map((video, index) => {
        const isLast = index === filteredVideos.length - 1;
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

      {loadingMore && (
        <div className="col-span-1 md:col-span-2 flex justify-center py-4">
          <Loader />
        </div>
      )}

      {!hasMore && filteredVideos.length > 0 && (
        <div className="col-span-1 md:col-span-2 text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          {t('all_loaded')}
        </div>
      )}
    </div>
  );
}