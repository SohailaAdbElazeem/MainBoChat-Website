'use client';
export default function AudioBubble({
  duration,
  isMe,
}: {
  duration: string;
  isMe: boolean;
}) {
  return (
    <div className="flex items-center gap-2 w-[220px]">
      
      {/* Play */}
      <button
        className={`w-8 h-8 rounded-full flex items-center justify-center
          ${isMe ? "bg-white text-red-500" : "bg-red-500 text-white"}
        `}
      >
        ▶
      </button>

      {/* Waveform */}
      <div className="flex items-center gap-[2px] flex-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`w-[2px] rounded-full
              ${isMe ? "bg-white/80" : "bg-red-400"}
            `}
            style={{
              height: `${Math.random() * 18 + 6}px`,
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span
        className={`text-[11px]
          ${isMe ? "text-white/80" : "text-gray-500"}
        `}
      >
        {duration}
      </span>
    </div>
  );
}