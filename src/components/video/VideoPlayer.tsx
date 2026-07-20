import { forwardRef } from "react";

interface VideoPlayerProps {
  src: string;
  username: string;
  description: string;
  progress: number;
  onTimeUpdate: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, username, description, progress, onTimeUpdate, onSeek }, ref) => (
    <div
      className="bg-black overflow-hidden shadow-lg relative"
      style={{ width: "450px", height: "580px", borderRadius: "20px" }}
    >
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        onTimeUpdate={onTimeUpdate}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: "180px",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%)",
          borderBottomRightRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      />

      {/* Video Info */}
      <div className="absolute bottom-10 left-4 right-4 z-20 text-white p-2">
        <h3 className="text-lg font-bold">@{username}</h3>
        <p className="text-sm truncate">{description}</p>
      </div>

      {/* Progress Bar */}
      <div
        onClick={onSeek}
        dir="ltr"
        className="absolute bottom-4 left-4 right-4 bg-gray-600 rounded-full cursor-pointer overflow-hidden z-30"
        style={{ height: "6px" }}
      >
        <div
          className="h-full bg-red-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
);
VideoPlayer.displayName = "VideoPlayer";