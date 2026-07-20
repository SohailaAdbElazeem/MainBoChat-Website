// src/components/video/SideButtons.tsx
"use client";

import { useState } from "react";
import { LikeButton } from "./LikeButton";
import { OptionsMenu } from "./OptionsMenu";

interface SideButtonsProps {
  userImg: string;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  onComment: () => void;
  onShare: () => void;
  onFullscreen: () => void;
  isShared?: boolean;
  onBlock?: () => void;
  onReport?: () => void;
  isBlocking?: boolean;
  commentsCount?: number;
  isCommented?: boolean;
  shareCount?: number;
   userId?: string;
  onProfileClick?: (userId: string) => void;
   isFollowing?: boolean;
}

export function SideButtons({
  userImg,
  isLiked,
  likeCount,
  onLike,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  isFirst,
  isLast,
  onComment,
  onShare,
  onFullscreen,
  isShared = false,
  onBlock,
  onReport,
  isBlocking = false,
  commentsCount = 0,
  isCommented = false,
  shareCount = 0,
  userId,
  onProfileClick,
  isFollowing = false,
}: SideButtonsProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  function formatNumber(num: number): string {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  }

  const handleProfileClick = () => {
    if (userId && onProfileClick) {
      onProfileClick(userId);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-10">
   <div
  className="relative w-[44px] h-[44px] cursor-pointer"
  onClick={handleProfileClick}
>
  <div className="w-full h-full rounded-full overflow-hidden">
    <img
      src={userImg || "/imgs/user.png"}
      alt="User"
      className="w-full h-full object-cover"
    />
  </div>

  {isFollowing ? (
     <img
      src="/icons/check.svg"
      alt="following"
      className="absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 w-[19px] h-[19px] z-10 border-0 outline-none"
    />
  ) : (
    <img
      src="/icons/UnFollow (2).svg"
      alt="following"
      className="absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 w-[19px] h-[19px] z-10 border-0 outline-none"
    />
  )}
</div>

      <LikeButton isLiked={isLiked} likeCount={likeCount} onLike={onLike} />

      {/* Comment */}
      <button
        onClick={onComment}
        className={`relative rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center transition-colors ${
          isCommented ? "bg-[#D722294D]" : "bg-[#000000]/15"
        }`}
      >
        <img src="/icons/comment-white.svg" alt="comment" className="w-5 h-5" />
        <span className="absolute -bottom-4 text-[10px] text-[#D72229A6] whitespace-nowrap">
          {formatNumber(commentsCount)}
        </span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="mt-3 relative rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center transition-colors bg-[#000000]/15"
      >
        <img src="/icons/share-white.svg" alt="share" className="w-5 h-5" />
        <span className="absolute -bottom-5 text-[10px] text-[#D72229A6] whitespace-nowrap">
          {formatNumber(shareCount)}
        </span>
      </button>

      <button onClick={onFullscreen} className="mt-3 rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center bg-[#000000]/15">
        <img src="/icons/fullscreen.svg" alt="fullscreen" className="w-5 h-5" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          className="rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center bg-[#000000]/15"
        >
          <img src="/icons/options-white.svg" alt="options" className="w-5 h-5" />
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
            isBlocking={isBlocking}
            className="absolute top-full right-0 z-50 mt-1"
          />
        )}
      </div>

      <button onClick={onTogglePlay} className="rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center bg-[#000000]/15">
        <img src={isPlaying ? "/imgs/Group 9081.svg" : "/icons/play.svg"} className="w-5 h-5" alt="play" />
      </button>

      <div className="flex flex-col gap-3 mt-5">
        <button onClick={onPrev} disabled={isFirst} className="rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center bg-[#000000]/15 disabled:opacity-30">
          <img src="/icons/arrow-up.svg" alt="prev" className="w-5 h-5" />
        </button>
        <button onClick={onNext} disabled={isLast} className="rounded-full backdrop-blur-md w-[40px] h-[40px] flex items-center justify-center bg-[#000000]/15 disabled:opacity-30">
          <img src="/icons/arrow-down.svg" alt="next" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}