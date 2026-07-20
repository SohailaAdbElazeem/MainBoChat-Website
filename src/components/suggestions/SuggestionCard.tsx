"use client";

import { Video } from "@/types/video";

interface SuggestionCardProps {
  video: Video;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onPlay: () => void;
}
function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + 'M';
  }
  if (views >= 1_000) {
    return (views / 1_000).toFixed(1) + 'k';
  }
  return views.toString();
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString.replace(" ", "T"));
  const diffMs = now.getTime() - past.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHour < 24) return `منذ ${diffHour} ساعة`;
  if (diffDay < 30) return `منذ ${diffDay} يوم`;
  if (diffDay < 365) return `منذ ${Math.floor(diffDay / 30)} شهر`;
  return `منذ ${Math.floor(diffDay / 365)} سنة`;
}

export function SuggestionCard({ video, onPlay }: SuggestionCardProps) {
  const userImage = video.userimg || "/imgs/user.png";
  const displayName = video.name || video.username || "مستخدم";
  const time = video.createdAt ? timeAgo(video.createdAt) : "";
  const views = video.views ?? 0;
  const formattedViews = formatViews(views);  
  const description = video.description || "";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
      onClick={onPlay}
    >
      {/* Video Container */}
      <div className="relative w-full  flex justify-center items-center py-3">
        <video
          src={video.video?.[0]?.video}
          className="w-[282px] h-[340px] object-cover rounded-[30px]"
        />
        {/*  Num of Views*/}
        <div className="absolute bottom-6 left-3 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <span>{formattedViews}</span>
          <img
            src="/icons/EyeIcon.svg"
            alt="eye icon"
            className="w-[22px] h-[14px]"
          />
        </div>
      </div>

      {/*  Description of Video */}
      {description && (
        <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
      )}

      {/*  info Personal & Time */}
      <div className="py-3 flex items-center gap-2 px-0">
        <img
          src={userImage}
          alt={displayName}
            className="w-[45px] h-[45px] rounded-[18px] object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white truncate">
            {displayName}
          </p>
          {time && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {time}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}