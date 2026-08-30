// src/components/video/SideButtons.tsx
"use client";

import { useState } from "react";
import { LikeButton } from "./LikeButton";
import { OptionsMenu } from "./OptionsMenu";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('SideButtons');

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
        className="relative w-[40px] h-[40px] cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={userImg || "/imgs/user.png"}
            alt={t('user_avatar')}
            className="w-full h-full object-cover"
          />
        </div>

        {isFollowing ? (
          <img
            src="/icons/check.svg"
            alt={t('following')}
            className="absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 w-4 h-4 z-10 border-0 outline-none"
          />
        ) : (
          <img
            src="/icons/UnFollow (2).svg"
            alt={t('not_following')}
            className="absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 w-4 h-4 z-10 border-0 outline-none"
          />
        )}
      </div>

      <LikeButton isLiked={isLiked} likeCount={likeCount} onLike={onLike} />

      {/* Comment */}
      <button
        onClick={onComment}
        className={`relative rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center transition-colors ${
          isCommented ? "bg-[#D722294D]" : "bg-[#000000]/15"
        }`}
        aria-label={t('comment')}
      >
        <img src="/icons/comment-white.svg" alt={t('comment')} className="w-4 h-4" />
        <span className="absolute -bottom-4 text-[10px] text-[#D72229A6] whitespace-nowrap">
          {formatNumber(commentsCount)}
        </span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="mt-3 relative rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center transition-colors bg-[#000000]/15"
        aria-label={t('share')}
      >
        <img src="/icons/share-white.svg" alt={t('share')} className="w-4 h-4" />
        <span className="absolute -bottom-5 text-[10px] text-[#D72229A6] whitespace-nowrap">
          {formatNumber(shareCount)}
        </span>
      </button>

      <button
        onClick={onFullscreen}
        className="mt-3 rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center bg-[#000000]/15"
        aria-label={t('fullscreen')}
      >
        <img src="/icons/fullscreen.svg" alt={t('fullscreen')} className="w-4 h-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          className="rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center bg-[#000000]/15"
          aria-label={t('options')}
        >
          <img src="/icons/options-white.svg" alt={t('options')} className="w-4 h-4" />
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

      <button
        onClick={onTogglePlay}
        className="rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center bg-[#000000]/15"
        aria-label={isPlaying ? t('pause') : t('play')}
      >
        <img
          src={isPlaying ? "/imgs/Group 9081.svg" : "/icons/play.svg"}
          className="w-4 h-4"
          alt={isPlaying ? t('pause') : t('play')}
        />
      </button>

      <div className="flex flex-col gap-3 mt-5">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center bg-[#000000]/15 disabled:opacity-30"
          aria-label={t('previous')}
        >
          <img src="/icons/arrow-up.svg" alt={t('previous')} className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="rounded-full backdrop-blur-md w-[36px] h-[36px] flex items-center justify-center bg-[#000000]/15 disabled:opacity-30"
          aria-label={t('next')}
        >
          <img src="/icons/arrow-down.svg" alt={t('next')} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}