// src/components/video/FullscreenOverlay.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { OptionsMenu } from "./OptionsMenu";

interface FullscreenOverlayProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isLiked: boolean;
  likeCount?: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  t?: any;
}

export function FullscreenOverlay({
  video,
  isOpen,
  onClose,
  onPrev,
  onNext,
  isLiked,
  likeCount = 0,
  onLike,
  onComment,
  onShare,
  onBlock,
  onReport,
  t = { views: "مشاهدات" },
}: FullscreenOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setVideoWidth(videoRef.current.getBoundingClientRect().width);
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    }
  };
  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "منذ لحظات";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "منذ لحظات";
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return "منذ لحظات";
    const mins = Math.floor(diffSec / 60);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `منذ ${days} يوم`;
    return `منذ ${Math.floor(days / 30)} شهر`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center"
      onClick={onClose}
    >
      {/* الأزرار في الخلفية   ) */}
      <div
        className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="bg-[#fff]/15 backdrop-blur-md p-3 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-[#fff]/25 transition"
        >
          <img src="/icons/close.svg" alt="close" className="w-5 h-5" />
        </button>
        <button
          onClick={onPrev}
          className="bg-[#fff]/15 backdrop-blur-md p-3 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-[#fff]/25 transition"
        >
          <img src="/icons/arrow-up.svg" alt="prev" className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="bg-[#fff]/15 backdrop-blur-md p-3 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-[#fff]/25 transition"
        >
          <img src="/icons/arrow-down.svg" alt="next" className="w-5 h-5" />
        </button>
      </div>

      {/* حاوية الفيديو */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={video.video?.[0]?.video}
          className="rounded-[17px] object-cover"
          style={{ width: "400px", height: "650px" }}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
        />

        {/* التدرج السفلي */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "231px",
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%)",
          }}
        />

        {/* معلومات المستخدم */}
        <div className="absolute top-5 right-4 flex items-center gap-3 bg-black/30 rounded-[19px] px-3 py-2">
          <img src={video.userimg} alt={video.name} className="w-10 h-10 rounded-full border border-white/30" />
          <div className="text-white">
            <p className="font-semibold">{video.name}</p>
            <p className="text-sm text-gray-300">{timeAgo(video.createdAt)}</p>
          </div>
        </div>

        {/* الأزرار الجانبية  -   */}
        <div className="absolute top-20 right-2 flex flex-col items-center gap-2 py-5">
          {/* 1. الخيارات  */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center"
            >
              <img src="/icons/options-white.svg" className="w-5 h-5" alt="options" />
            </button>
            {onBlock && onReport && (
              <OptionsMenu
                isOpen={showOptionsMenu}
                onClose={() => setShowOptionsMenu(false)}
                onBlock={() => {
                  onBlock();
                  setShowOptionsMenu(false);
                }}
                onReport={() => {
                  onReport();
                  setShowOptionsMenu(false);
                }}
                className="absolute top-full right-0 z-50 mt-1"
              />
            )}
          </div>

          {/* 2. تشغيل / إيقاف */}
          <button
            onClick={togglePlay}
            className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center"
          >
            <img
              src={isPlaying ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
              className="w-5 h-5"
              alt="play"
            />
          </button>

          {/* 3. الإعجاب */}
          <button
            onClick={onLike}
            className={`bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center ${
              isLiked ? "bg-[#D722294D]" : ""
            }`}
          >
            <img src="/icons/like-white.svg" className="w-5 h-5" alt="like" />
          </button>

          {/* 4. التعليق */}
          <button
            onClick={onComment}
            className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center"
          >
            <img src="/icons/comment-white.svg" className="w-5 h-5" alt="comment" />
          </button>

          {/* 5. المشاركة */}
          <button
            onClick={onShare}
            className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center"
          >
            <img src="/icons/share-white.svg" className="w-5 h-5" alt="share" />
          </button>

          {/* 6. تقديم 10 ثواني */}
          <button
            onClick={seekForward}
            className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center mt-10"
          >
            <img src="/imgs/next.svg" className="w-5 h-5" alt="forward" />
          </button>

          {/* 7. تأخير 10 ثواني */}
          <button
            onClick={seekBackward}
            className="bg-[#000000]/15 backdrop-blur-md p-3 rounded-full w-[45px] h-[45px] flex items-center justify-center "
          >
            <img src="/imgs/pre (1).svg" className="w-5 h-5" alt="backward" />
          </button>
        </div>

        {/* عداد المشاهدات */}
        <div className="absolute top-5 left-4 bg-[#FFFFFF]/30 backdrop-blur-md px-3 py-2 rounded-[17px] text-white flex items-center gap-2">
          <span className="text-sm">{video.views || 0}</span>
          <img src="/icons/eye.svg" alt={t.views} className="w-4 h-4" />
        </div>

        {/* شريط التقدم */}
        <div
          onClick={handleSeek}
          dir="ltr"
          className="absolute bottom-[2vh] left-1/2 -translate-x-1/2 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
          style={{ width: videoWidth ? `${videoWidth - 20}px` : "calc(70% - 8px)", height: "6px" }}
        >
          <div className="h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}